export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 font-sans dark:bg-black">
      {/* Hero */}
      <section className="flex flex-col items-center text-center gap-6 px-6 py-24 max-w-3xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-black dark:text-zinc-50">
          [Nombre del centro] — estimulación temprana para niños con TEA y TDAH
        </h1>
        <p className="max-w-xl text-lg text-zinc-600 dark:text-zinc-400">
          Conectamos a tu familia con el terapeuta correcto y hacemos seguimiento continuo del
          progreso de tu hijo. [Texto placeholder — reemplazar con propuesta de valor final.]
        </p>
        <a
          href="#demo"
          className="rounded-full bg-foreground px-6 py-3 text-background font-medium hover:bg-[#383838] dark:hover:bg-[#ccc]"
        >
          Solicitar demo
        </a>
      </section>

      {/* Propuesta de valor */}
      <section className="px-6 py-16 bg-white dark:bg-zinc-950">
        <div className="max-w-4xl mx-auto grid gap-8 sm:grid-cols-3">
          <div>
            <h3 className="font-semibold text-lg mb-2">Match, no catálogo</h3>
            <p className="text-zinc-600 dark:text-zinc-400 text-sm">
              [Placeholder] Tu hijo se empareja con un terapeuta y mantiene continuidad, no
              reserva sesiones sueltas con desconocidos.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-2">Seguimiento centralizado</h3>
            <p className="text-zinc-600 dark:text-zinc-400 text-sm">
              [Placeholder] Progreso, notas de sesión y tareas para casa en un solo lugar para
              toda la familia.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-2">Beneficio corporativo</h3>
            <p className="text-zinc-600 dark:text-zinc-400 text-sm">
              [Placeholder] Empresas pueden ofrecer este beneficio a colaboradores con hijos en
              el espectro.
            </p>
          </div>
        </div>
      </section>

      {/* Cómo funciona */}
      <section className="px-6 py-16 max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold text-center mb-10">Cómo funciona</h2>
        <ol className="grid gap-8 sm:grid-cols-4 text-sm text-zinc-600 dark:text-zinc-400">
          <li><span className="font-semibold text-black dark:text-white">1. Evaluación</span><br />[Placeholder]</li>
          <li><span className="font-semibold text-black dark:text-white">2. Match</span><br />[Placeholder]</li>
          <li><span className="font-semibold text-black dark:text-white">3. Plan</span><br />[Placeholder]</li>
          <li><span className="font-semibold text-black dark:text-white">4. Seguimiento</span><br />[Placeholder]</li>
        </ol>
      </section>

      {/* Para empresas */}
      <section className="px-6 py-16 bg-white dark:bg-zinc-950">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-semibold mb-4">Para empresas</h2>
          <p className="text-zinc-600 dark:text-zinc-400 mb-6">
            [Placeholder] Ofrece este beneficio a tus colaboradores con hijos en el espectro
            TEA/TDAH. Métricas, casos de éxito y precios — pendiente de completar.
          </p>
        </div>
      </section>

      {/* CTA / Demo */}
      <section id="demo" className="px-6 py-24 text-center">
        <h2 className="text-2xl font-semibold mb-4">Solicitar demo</h2>
        <p className="text-zinc-600 dark:text-zinc-400 mb-6">[Placeholder — formulario o link de contacto pendiente]</p>
      </section>
    </div>
  );
}
