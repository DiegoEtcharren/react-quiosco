import {useEffect} from 'react'
import useSWR, { mutate } from "swr";
import clienteAxios from "../config/axios";
import { useNavigate } from 'react-router-dom';
export const useAuth = ({middleware, url}) => {

    const token = localStorage.getItem('AUTH_TOKEN');
    const navigate = useNavigate();

    const {data: user, error, mutate } = useSWR('/api/user', () =>
        clienteAxios('/api/user', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(res => res.data)
        .catch(error => {
            throw Error(error?.response?.data?.errors)
        })
    );
    const login = async (datos, setErrores) => {
        try {
        const { data } = await clienteAxios.post("api/login", datos);
        localStorage.setItem('AUTH_TOKEN', data.token);
        setErrores([]);
        await mutate();
        } catch (error) {
        setErrores(Object.values(error.response.data.errors));
        }
    }

    const registro = async (datos, setErrores) => {
      try {
        const { data } = await clienteAxios.post("api/registro", datos);
        localStorage.setItem('AUTH_TOKEN', data.token);
        setErrores([]);
        await mutate();
      } catch (error) {
        setErrores(Object.values(error.response.data.errors));
      }
    };

    const logout = async () => {
      try {
        await clienteAxios.post("/api/logout", null, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        localStorage.removeItem("AUTH_TOKEN");
        await mutate(undefined)
      } catch (error) {
        throw Error(error?.response?.data?.errors);
      }
    };

    useEffect(() => {
      if (middleware === "guest" && user) {
        // Fix: If Admin, ignore stored 'url' and FORCE /admin
        if (user.admin) {
          navigate("/admin");
        }
        // If Regular User, go to intended URL or fallback
        else if (url) {
          navigate(url);
        }
      }

      if (middleware === "admin" && user && !user.admin) {
        navigate("/");
      }

      if (middleware === "auth") {
        // Not logged in? Go to login
        if (error) {
          navigate("/auth/login");
        }
        // NEW STRICT RULE: If Admin is on a regular user page, FORCE /admin
        else if (user && user.admin) {
          navigate("/admin");
        }
      }
    }, [user, error]);

    return {
        login,
        registro,
        logout,
        user,
        error
    }
}