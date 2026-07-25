-- Modelo de datos inicial — ver modelo-negocio.md para el contexto de negocio.
-- Diseño clave: notas clínicas separadas de lo que ve el padre (session_clinical_notes
-- vs. sessions.summary_for_parents), porque son audiencias distintas con distinto acceso.

-- ============ Tipos ============

create type user_role as enum ('parent', 'therapist', 'coordinator');
create type case_status as enum ('evaluacion', 'activo', 'pausado', 'cerrado');
create type session_status as enum ('programada', 'completada', 'cancelada', 'no_show');
create type intake_status as enum ('pendiente', 'en_revision', 'asignado', 'descartado');

-- ============ Tablas ============

-- Un registro por usuario de auth.users (padre, terapeuta o coordinador)
create table profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role user_role not null default 'parent',
  full_name text not null,
  phone text,
  created_at timestamptz not null default now()
);

-- Catálogo de especialidades (lenguaje, ocupacional, conducta/ABA, psicología...)
create table specialties (
  id uuid primary key default gen_random_uuid(),
  name text not null unique
);

-- Empresas pagadoras (contrato: fee de acceso + comisión + tope anual — ver modelo-negocio.md #4)
create table companies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  access_fee_soles numeric(10, 2) not null default 0,
  session_commission_pct numeric(5, 2) not null default 25,
  annual_session_cap int not null default 48,
  contract_started_at date,
  created_at timestamptz not null default now()
);

-- Niños (el paciente). company_id nulo = plan particular, sin empresa pagadora.
create table children (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid not null references profiles (id) on delete cascade,
  company_id uuid references companies (id),
  full_name text not null,
  birth_date date not null,
  diagnosis_notes text,
  created_at timestamptz not null default now()
);

-- Extensión del perfil para terapeutas/centros afiliados
create table therapist_profiles (
  id uuid primary key references profiles (id) on delete cascade,
  bio text,
  zone text,
  active boolean not null default true
);

create table therapist_specialties (
  therapist_id uuid not null references therapist_profiles (id) on delete cascade,
  specialty_id uuid not null references specialties (id) on delete cascade,
  primary key (therapist_id, specialty_id)
);

-- Solicitud de intake de la familia, antes de la asignación curada (ver modelo-negocio.md #2)
create table intake_requests (
  id uuid primary key default gen_random_uuid(),
  child_id uuid not null references children (id) on delete cascade,
  requested_specialty_id uuid references specialties (id),
  availability_notes text,
  status intake_status not null default 'pendiente',
  created_at timestamptz not null default now()
);

-- El "plan" de intervención con un terapeuta fijo — no una clase suelta.
create table cases (
  id uuid primary key default gen_random_uuid(),
  child_id uuid not null references children (id) on delete cascade,
  therapist_id uuid not null references therapist_profiles (id),
  specialty_id uuid not null references specialties (id),
  intake_request_id uuid references intake_requests (id),
  status case_status not null default 'evaluacion',
  goals text,
  started_at date not null default current_date,
  created_at timestamptz not null default now()
);

-- Sesiones — solo lo que el padre puede ver (resumen, no la nota clínica completa)
create table sessions (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references cases (id) on delete cascade,
  scheduled_at timestamptz not null,
  status session_status not null default 'programada',
  summary_for_parents text,
  rate_charged_to_company numeric(10, 2),
  rate_paid_to_therapist numeric(10, 2),
  created_at timestamptz not null default now()
);

-- Nota clínica completa — solo terapeuta a cargo y coordinador, nunca el padre.
create table session_clinical_notes (
  session_id uuid primary key references sessions (id) on delete cascade,
  notes text not null,
  updated_at timestamptz not null default now()
);

-- ============ Perfil automático al registrarse ============

create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    coalesce((new.raw_user_meta_data ->> 'role')::user_role, 'parent')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============ Helper para políticas (security definer evita recursión de RLS) ============

create function public.current_role()
returns user_role
language sql
security definer
set search_path = public
stable
as $$
  select role from profiles where id = auth.uid()
$$;

-- ============ RLS ============

alter table profiles enable row level security;
alter table specialties enable row level security;
alter table companies enable row level security;
alter table children enable row level security;
alter table therapist_profiles enable row level security;
alter table therapist_specialties enable row level security;
alter table intake_requests enable row level security;
alter table cases enable row level security;
alter table sessions enable row level security;
alter table session_clinical_notes enable row level security;

-- profiles: cada quien ve/edita el suyo; coordinador ve todos
create policy "profiles_select_own_or_coordinator" on profiles
  for select using (id = auth.uid() or public.current_role() = 'coordinator');
create policy "profiles_update_own" on profiles
  for update using (id = auth.uid());

-- specialties: catálogo visible para cualquier usuario autenticado
create policy "specialties_select_authenticated" on specialties
  for select using (auth.role() = 'authenticated');
create policy "specialties_write_coordinator" on specialties
  for all using (public.current_role() = 'coordinator');

-- companies: solo coordinador (no hay portal de empresa en este MVP)
create policy "companies_coordinator_only" on companies
  for all using (public.current_role() = 'coordinator');

-- children: el padre ve/edita los suyos; terapeuta ve los niños de sus casos; coordinador ve todo
create policy "children_select" on children
  for select using (
    parent_id = auth.uid()
    or public.current_role() = 'coordinator'
    or exists (
      select 1 from cases
      where cases.child_id = children.id and cases.therapist_id = auth.uid()
    )
  );
create policy "children_insert_own" on children
  for insert with check (parent_id = auth.uid() or public.current_role() = 'coordinator');
create policy "children_update_own_or_coordinator" on children
  for update using (parent_id = auth.uid() or public.current_role() = 'coordinator');

-- therapist_profiles / therapist_specialties: directorio visible para cualquier autenticado
create policy "therapist_profiles_select_authenticated" on therapist_profiles
  for select using (auth.role() = 'authenticated');
create policy "therapist_profiles_write_self_or_coordinator" on therapist_profiles
  for all using (id = auth.uid() or public.current_role() = 'coordinator');

create policy "therapist_specialties_select_authenticated" on therapist_specialties
  for select using (auth.role() = 'authenticated');
create policy "therapist_specialties_write_self_or_coordinator" on therapist_specialties
  for all using (therapist_id = auth.uid() or public.current_role() = 'coordinator');

-- intake_requests: solo el padre del niño y el coordinador (el terapeuta no navega solicitudes sueltas)
create policy "intake_requests_select" on intake_requests
  for select using (
    public.current_role() = 'coordinator'
    or exists (select 1 from children where children.id = intake_requests.child_id and children.parent_id = auth.uid())
  );
create policy "intake_requests_insert" on intake_requests
  for insert with check (
    exists (select 1 from children where children.id = intake_requests.child_id and children.parent_id = auth.uid())
  );
create policy "intake_requests_update_coordinator" on intake_requests
  for update using (public.current_role() = 'coordinator');

-- cases: visible para el padre del niño, el terapeuta asignado, y coordinador. Solo coordinador crea/edita (matching curado).
create policy "cases_select" on cases
  for select using (
    public.current_role() = 'coordinator'
    or therapist_id = auth.uid()
    or exists (select 1 from children where children.id = cases.child_id and children.parent_id = auth.uid())
  );
create policy "cases_write_coordinator" on cases
  for all using (public.current_role() = 'coordinator');

-- sessions: visible para padre/terapeuta/coordinador del caso. Solo el terapeuta a cargo (o coordinador) escribe.
create policy "sessions_select" on sessions
  for select using (
    public.current_role() = 'coordinator'
    or exists (
      select 1 from cases
      where cases.id = sessions.case_id
        and (
          cases.therapist_id = auth.uid()
          or exists (select 1 from children where children.id = cases.child_id and children.parent_id = auth.uid())
        )
    )
  );
create policy "sessions_write_therapist_or_coordinator" on sessions
  for all using (
    public.current_role() = 'coordinator'
    or exists (select 1 from cases where cases.id = sessions.case_id and cases.therapist_id = auth.uid())
  );

-- session_clinical_notes: SOLO terapeuta a cargo y coordinador — nunca el padre.
create policy "clinical_notes_therapist_or_coordinator" on session_clinical_notes
  for all using (
    public.current_role() = 'coordinator'
    or exists (
      select 1 from sessions
      join cases on cases.id = sessions.case_id
      where sessions.id = session_clinical_notes.session_id and cases.therapist_id = auth.uid()
    )
  );

-- ============ Catálogo inicial de especialidades ============

insert into specialties (name) values
  ('Lenguaje'),
  ('Terapia ocupacional'),
  ('Conducta / ABA'),
  ('Psicología');
