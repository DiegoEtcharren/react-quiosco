import useSWR from "swr";
import useQuiosco from "../hooks/useQuiosco";
import clienteAxios from '../config/axios';
import { formatearDinero } from '../helpers/index'

export default function Ordenes() {
  const token = localStorage.getItem('AUTH_TOKEN');
  const fetcher = () => clienteAxios('/api/pedidos', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  const { data, error, isLoading } = useSWR('/api/pedidos', fetcher);
  const {handleClickCompletarPedido} = useQuiosco();

  if (isLoading) return 'Cargando...';
  if (error) return <p>Hubo un error al cargar las ordenes</p>;
  console.log(data);

  return (
    <div>
      <h1 className="text-4xl font-black ">Ordenes</h1>
      <p className="text-2xl my-10">Administra tus ordenes:</p>
      <div className="grid grid-cols-2 gap-5">
        {data?.data?.data.map((pedido) => (
          <div
            key={pedido.id}
            className="p-5 bg-white shadow space-y-2"
          >
            <p className="text-xl font-bold text-slate-600 ">
              Contenido del Pedido:
            </p>
            {pedido.productos.map((producto) => (
              <div
                key={producto.id}
                className="border-b border-b-slate-200 last-of-type:border-none py-4"
              >
                <p className="text-sm font-bold">
                  ID: <span className="font-normal">{producto.id}</span>
                </p>
                <p className="text-sm">{producto.nombre}</p>
                <p className="text-sm font-bold">
                  Cantidad:{" "}
                  <span className="font-normal">{producto.pivot.cantidad}</span>
                </p>
              </div>
            ))}

            <p className="text-lg font-bold text-black">
              Cliente:{" "}
              <span className="font-normal text-slate-600">
                {pedido.user.name}
              </span>
            </p>
            <p className="text-lg font-bold text-amber-500">
              Total a Pagar:{" "}
              <span className="font-normal text-black">
                {formatearDinero(pedido.total)}
              </span>
            </p>
            <button
              type="button"
              className="text-white bg-indigo-600 hover:bg-indigo-800 px-5 py-2 rounded cursor-pointer w-full"
              onClick={() => handleClickCompletarPedido(pedido.id)}
            >
              Completar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

