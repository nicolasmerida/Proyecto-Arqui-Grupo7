// app/page.tsx

export default function Home() {
  return (
    <main className="bg-cover bg-center bg-fixed flex flex-col items-center justify-center py-8 px-4 min-h-screen pt-10">
      <section className="text-center py-16 px-4 text-white rounded-xl mb-8 max-w-4xl w-full">
        <h1 className="text-4xl sm:text-5xl font-semibold mb-4 tracking-tight">
          Bienvenido al 
          <strong className="text-white">Sistema de Gestión de Restaurante 🧑‍🍳</strong>
        </h1>
        <p className="text-lg sm:text-xl text-white/70 max-w-3xl mx-auto">
          El sistema de gestión pensado para agilizar las operaciones de las personas que asisten al establecimiento.
        </p> 
        <p className="text-lg sm:text-xl text-white/70 max-w-3xl mx-auto"> 
          Explorá el menú con las distintas opciones que se brindan y disfruta de una linda experiencia culinaria.
        </p>
      </section>
    </main>
  );
}
