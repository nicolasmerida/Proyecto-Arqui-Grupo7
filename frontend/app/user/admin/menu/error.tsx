// app/menu/error.tsx
'use client';

export default function MenuError({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error); 

  return (
    <div className="min-h-full mt-40 flex flex-col items-center justify-center text-center text-white px-6">
        <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight mb-6">
            Algo salió mal.
        </h1>
        <p className="text-lg sm:text-xl text-white/80 max-w-xl text-center mb-10">
            {error.message}
        </p>
        <p className="text-xs text-gray-400 max-w-xl text-center font-mono mb-4">
            Ref: {String(error.cause)}
        </p>
        <img
        src="https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExZWpqcW90cHhyNHphYm54NGNrNjZxNTY0YTN2NHJ6czc4cHBjM2YxYiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/PkVpoRawXYW5i/giphy.gif"
        alt="error gif"
        className="w-180 h-auto rounded shadow-lg mb-4"
        />
        <button
            onClick={() => reset()}
            className="bg-gray-500 text-white px-6 py-3 rounded-full 
            text-sm font-medium hover:bg-neutral-200/50 hover:text-white transition"
        >
            Reintentar
        </button>
    </div>
  );
}
