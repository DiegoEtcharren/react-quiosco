import useQuiosco from "../hooks/useQuiosco"

export default function Categoria({categoria}) {
    const {handleClickCategoria, categoriaActual } = useQuiosco();
    const {icono, id, nombre } = categoria
  return (
    <button
      className={`flex items-center gap-4 border border-gray-200 w-full p-3 hover:bg-amber-400 cursor-pointer ${categoriaActual.id === id ? "bg-amber-400" : ""}`}
      type="button"
      onClick={() => handleClickCategoria(id)}
    >
        <img
            className="w-12"
            src={`/img/icono_${icono}.svg`}
            alt="Imagen Icono"
        />
        <p
          className="text-lg font-bold cursor-pointer truncate"
        >
          { nombre }
        </p>
    </button>
  )
}
