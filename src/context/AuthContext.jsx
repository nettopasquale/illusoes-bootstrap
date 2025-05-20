// Permite o login / logout em qualquer lugar, evita o localStorage excessivo
import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [usuario, setUsuario] = useState(null);
    const [token, setToken] = useState(null);

    //const navigate = useNavigate();

    useEffect(() => {
        const tokenSalvo = localStorage.getItem("token");
        const usuarioSalvo = localStorage.getItem("usuario");

        if (tokenSalvo && usuarioSalvo) {
            setToken(tokenSalvo);
            setUsuario(JSON.parse(usuarioSalvo))
        }
    }, []);

    const login = (token, usuario) => {
        localStorage.setItem("token", token);
        localStorage.setItem("usuario", JSON.stringify(usuario))
        setToken(token);
        setUsuario(usuario);
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("usuario")
        setToken(null);
        setUsuario(null);
    };

    return (
        <AuthContext.Provider value={{usuario, token, login, logout, autenticado: !!usuario}}>
            {children}
        </AuthContext.Provider>
    )

}

AuthProvider.propTypes = {
  children: PropTypes.node
}