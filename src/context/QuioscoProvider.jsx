import { createContext, useState, useEffect} from "react"
import { toast, ToastContainer, Bounce } from "react-toastify";
import clienteAxios from "../config/axios";

const QuioscoContext = createContext();

const QuioscoProvider = ({children}) => {

    const [categorias, setCategorias ] = useState([]);
    const [categoriaActual, setCategoriaActual] = useState({});
    const [modal, setModal] = useState(false);
    const [producto, setProducto] = useState({});
    const [pedido, setPedido] = useState([]);
    const [total, settotal] = useState(0);

    useEffect(() => {
        const nuevoTotal = pedido.reduce( (total, producto) => total = (producto.precio * producto.cantidad) + total, 0)
        settotal(nuevoTotal)
    }, [pedido])

    const obtenerCategorias = async () => {
      const token = localStorage.getItem("AUTH_TOKEN");
      try {
        const { data } = await clienteAxios("/api/categorias", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCategorias(data.data);
        setCategoriaActual(data.data[0]);
      } catch (error) {
        console.log(error);
      }
    };

    useEffect( () => {
      obtenerCategorias();
    }, [])

    const handleClickCategoria = (id) => {
        const categoria = categorias.filter(categoria => categoria.id === id)[0]
        setCategoriaActual(categoria)
    }

    const handleClickModal = () => {
        setModal(!modal)
    }

    const handleSetProducto = producto => {
        setProducto(producto)
    }

    const handleAgregarPedido = ({ categoria_id, ...producto }) => {
      if (pedido.some((pedidoState) => pedidoState.id === producto.id)) {
        const pedidoActualizado = pedido.map((pedidoState) =>
          pedidoState.id === producto.id ? producto : pedidoState
        );
        setPedido(pedidoActualizado);
        toast.success("Producto actualizado!", {
          position: "top-left",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });
      } else {
        setPedido([...pedido, producto]);
        toast.success("Producto agregado!", {
          position: "top-left",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });
      }
    };

    const handleEditarCantidad = (id) => {
        const productoActualizar = pedido.filter(producto => producto.id === id )[0];
        setProducto(productoActualizar);
        setModal(!modal);
    }

    const handleEliminarProductoPedido = (id) => {
      const pedidoActualizado = pedido.filter((producto) => producto.id !== id);
      setPedido(pedidoActualizado);
      toast.success("Pedido Eliminado", {
        position: "top-left",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
      });
    };

    const handleSubmitNuevaOrden = async (logout) => {
      const token = localStorage.getItem('AUTH_TOKEN');
      try {
        const { data } = await clienteAxios.post(
          "/api/pedidos",
          {total,
            productos: pedido.map(producto => {
              return {
                id : producto.id,
                cantidad : producto.cantidad
              }
            })
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        toast.success(data.message);
        setTimeout(() => {
          setPedido([]);
        }, 1000);

        // Cerrar Sesion del usuario:
        setTimeout(() => {
          localStorage.removeItem('AUTH_TOKEN');
          logout();
        }, 3000);
      } catch (error) {
        console.log(error);
      }
    };

    const handleClickCompletarPedido = async (id) => {
      const token = localStorage.getItem("AUTH_TOKEN");
      try {
        const { data } = await clienteAxios.put(`/api/pedidos/${id}`, null, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        toast.success(data.pedido.id);
        setTimeout(() => {
          setPedido([]);
        }, 1000);
      } catch (error) {
        console.log(error);
      }
    };

    const handleClickProductoAgotado = async (id) => {
      const token = localStorage.getItem("AUTH_TOKEN");
      try {
        const { data } = await clienteAxios.put(`/api/productos/${id}`, null, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        toast.success(data.pedido.id);
        setTimeout(() => {
          setPedido([]);
        }, 1000);
      } catch (error) {
        console.log(error);
      }
    };

    return (
        <QuioscoContext.Provider
            value = {{
                categorias,
                categoriaActual,
                handleClickCategoria,
                modal,
                handleClickModal,
                producto,
                handleSetProducto,
                pedido,
                handleAgregarPedido,
                handleEditarCantidad,
                handleEliminarProductoPedido,
                total,
                handleSubmitNuevaOrden,
                handleClickCompletarPedido,
                handleClickProductoAgotado
            }}
        >
            {children}
        </QuioscoContext.Provider>
    )
}

export { QuioscoProvider };
export default QuioscoContext;