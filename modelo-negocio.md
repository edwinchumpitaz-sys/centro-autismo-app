# Modelo de negocio — Plataforma de estimulación TEA/TDAH (B2B2C)

Inspirado en MonkeyFit (bienestar corporativo, Perú), pero adaptado a terapia infantil TEA/TDAH,
donde el servicio **no es intercambiable** (a diferencia de una clase de gym).

## 1. Diferencia clave frente a MonkeyFit

MonkeyFit vende **acceso amplio y variedad** (reserva libre entre +500 centros).
Esta plataforma vende **acceso correcto y continuidad**: el niño se empareja una vez con
un terapeuta/centro y mantiene la relación en el tiempo (modelo tipo Alma / Headway / Grow Therapy
para adultos, y Lyra Health / Brightline para el caso pediátrico-corporativo en EE.UU.).

En Latinoamérica no se encontró un agregador equivalente (Therafy Care en Brasil es una
herramienta B2B de RV/gamificación vendida a clínicas y colegios, no un marketplace de reservas;
AsisTEA es una app de acompañamiento, tampoco marketplace). El hueco parece real, no solo una copia.

## 2. Flujo de usuario (matching + continuidad)

1. **Intake de la familia**: datos del niño, diagnóstico o sospecha, áreas de preocupación,
   zona/horarios, quién paga. Consentimiento informado explícito (dato de salud de un menor).
2. **Asignación curada**: un coordinador clínico (no un buscador abierto) presenta 2-3 opciones
   de terapeuta/centro que calzan con especialidad + geografía + disponibilidad + cobertura.
3. **Se compra un plan, no una clase suelta**: evaluación inicial → plan de intervención con
   metas → cadencia recurrente con el mismo terapeuta.
4. **Seguimiento longitudinal**: notas de sesión (clínicas + resumen para padres), tablero de
   progreso, tareas para casa (uso diario, no solo el día de la cita), alertas de inasistencia/estancamiento.
5. **Equipo multidisciplinario centralizado**: expediente único del niño si se suman más
   especialistas (lenguaje, ocupacional, conducta) — evita la fragmentación típica entre
   especialistas que no se hablan entre sí.
6. **Métricas de negocio**: adherencia al plan (% sesiones completadas), permanencia con el
   mismo terapeuta, progreso hacia metas — no "diversidad de reservas" como mide MonkeyFit.

## 3. Lado del terapeuta/centro afiliado

El gancho (modelo Alma/Headway) es quitarle 3 cargas operativas al profesional independiente:

- **Consigue pacientes sin marketing propio**: bandeja de "casos disponibles" filtrada por
  especialidad/disponibilidad/geografía — el sistema empuja el caso al profesional, no al revés.
- **Documentación simple**: notas de sesión cortas (5-10 min), sirven para continuidad clínica
  y como respaldo de facturación.
- **Cobro garantizado**: el terapeuta le factura a la plataforma, no a la empresa ni al padre;
  la plataforma paga con cadencia fija (ej. quincenal), descontando su comisión.

## 4. Modelo económico

### Cobro a la empresa (pagador principal) — dos capas, no solo pay-per-use
- **Fee de acceso**: monto fijo mensual, cobrado solo sobre la *población de riesgo real*
  (colaboradores con hijos en edad relevante, ~2-12 años) — no sobre toda la planilla, a
  diferencia de MonkeyFit. Da ingreso recurrente predecible aunque no haya casos activos ese mes.
- **Fee de consumo**: comisión ~25-30% sobre cada sesión facturada. Ejemplo: factura a la
  empresa S/120/sesión, paga al terapeuta S/90/sesión.
- Arrancar sin fee de acceso (solo consumo) para bajar la barrera de decisión del primer
  piloto; migrar a modelo híbrido una vez haya casos de éxito.

### Tope de sesiones cubiertas al 100%
- **No cubrir ABA intensivo** (10-40 hrs/semana, casos severos) — eso es de seguro
  especializado/EsSalud/SIS, no de un beneficio corporativo tipo wellness.
- Posicionarse en terapia moderada/multidisciplinaria (1-2 sesiones/semana por especialidad).
- Recomendado: **48 sesiones/año** por niño (≈1 sesión/semana, año escolar), distribuibles
  como "presupuesto" entre especialidades del plan (no tope rígido por especialidad).
- Piloto conservador: 24/año. Plan premium: 96/año.
- Sesiones que excedan el tope → copago con descuento (30-50%), nunca corte abrupto de acceso.

### Riesgos económicos a resolver en el contrato
- **Escalamiento de demanda**: la plataforma puede destapar demanda oculta (tamizaje/evaluación
  accesible revela casos no diagnosticados antes). *Meter cláusula de revisión de tarifa o
  tope agregado por empresa (no solo por niño) para protegerse de ese escalamiento.*
- **Gap de flujo de caja**: se paga al terapeuta rápido (quincenal) pero se cobra a la empresa
  a 30-60 días — requiere colchón de capital de trabajo o negociar cobro más corto.
- **CAC alto en venta directa** (beneficio de nicho, sensible, pasa por legal/compliance).
  Priorizar canal indirecto: brokers de beneficios corporativos, aseguradoras, o alianza como
  add-on de plataformas de wellness ya instaladas (ej. tipo MonkeyFit), en vez de fuerza de
  ventas propia desde el día uno.
- El negocio funciona por **volumen agregado de muchas empresas**, no por pocos clientes
  grandes (margen por empresa individual es delgado).

## 5. Datos de prevalencia (Perú) — sin estadística epidemiológica oficial propia

- **TEA**: no hay estudio poblacional peruano. Estimado aplicando tasa OMS (~0.625%) ≈ 204,818
  personas en Perú. **97% no diagnosticado** por falta de acceso — MINSA certificó solo 5,328
  personas en 2020.
- **TDAH**: UNICEF estima 5-10%; estudio INSM 2007 encontró 9.5% en menores peruanos. Casos
  atendidos por MINSA crecen cada año (5,850 en 2020 → 46,503 en 2023 → 25,010 en 1er
  semestre 2025) pero eso mide capacidad del sistema de salud, no prevalencia real.
- **Implicancia para el forecast**: usar "población ya diagnosticada/buscando ayuda" para
  dimensionar demanda año 1, no la prevalencia epidemiológica completa — la brecha de
  diagnóstico es enorme y limita la utilización real en el corto plazo.

## 6. Pendientes / decisiones abiertas

- Marco legal de datos sensibles de menores (Ley de Protección de Datos Personales, Perú) —
  diseñarlo desde el inicio, no como parche.
- Definir criterios de triage/matching en detalle (reglas vs. asistido por coordinador humano
  en fase 1).
- Definir % exacto de comisión y estructura de fee de acceso con datos reales de un piloto.
- Explorar canal indirecto (brokers/aseguradoras/alianza con plataforma de wellness existente)
  como estrategia de adquisición de empresas.
