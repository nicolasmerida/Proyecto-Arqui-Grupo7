// app/not-found.tsx

export default function NotFoundPage() {
  
  return (
    <div className="min-h-full mt-20 flex flex-col items-center justify-center text-white text-center p-6">
      <h1 className="text-5xl font-bold mb-4">404</h1>
      <p className="text-xl mb-6">Oops! La página que buscás no existe.</p>
      <img
        src="https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExaG4zMWtyYjNjdGhocTJjYnEyYjN6NXpiMnpnbHo0cGczc2t4YzJrOCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/2vlC9FMLSmqGs/giphy.gif"
        alt="not-found gif"
        className="w-180 h-auto rounded shadow-lg mb-4"
      />
      <a
        href="/"
        className="px-4 py-2 bg-white/30 text-white rounded hover:bg-dcic_white/90 transition mb-16"
      >
        Volver al inicio
      </a>
    </div>
  );
}
