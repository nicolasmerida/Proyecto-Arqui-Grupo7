// app/page.tsx

export default function Home() {
  
  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-4 py-8 pt-10">
      <section className="text-center px-8 py-16 mb-8 max-w-4xl w-full bg-slate-500/75 rounded-2xl">
        <h1 className="flex flex-col text-4xl sm:text-5xl font-semibold text-amber-400 mb-4 tracking-tight">
          Bienvenido al
          <strong className="text-amber-400 m-4"> Sistema de Gestión de Restaurante 🧑‍🍳</strong>
        </h1>
        <p className="text-lg sm:text-xl text-amber-300 max-w-3xl mx-auto">
          El sistema de gestión pensado para agilizar las operaciones de las personas que asisten al establecimiento.
        </p> 
        <p className="text-lg sm:text-xl text-amber-300 max-w-3xl mx-auto"> 
          Explorá el menú con las distintas opciones que se brindan y disfruta de una linda experiencia culinaria.
        </p>
      </section>
    </main>
  );
}