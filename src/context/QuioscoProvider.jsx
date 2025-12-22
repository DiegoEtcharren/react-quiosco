import { createContext, useState, useEffect} from "react"
import { toast, ToastContainer, Bounce } from "react-toastify";
import { categorias as categoriasDB } from "../data/categorias";
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

    console.log(import.meta.env.VITE_API_URL);
    const obtenerCategorias = async() => {
      try {
        const { data } = await clienteAxios('/api/categorias');
        setCategorias(data.data);
        setCategoriaActual(data.data[0])
      } catch (error) {
        console.log(error);
      }
    }

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
                total
            }}
        >
            {children}
        </QuioscoContext.Provider>
    )
}

export { QuioscoProvider };
export default QuioscoContext;