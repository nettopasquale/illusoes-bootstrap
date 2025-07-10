// Permite o login / logout em qualquer lugar, evita o localStorage excessivo
import { createContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(() => {
    const salvo = localStorage.getItem("usuario");
    return salvo ? JSON.parse(salvo) : null;
  });
  const [token, setToken] = useState(() => {
    return localStorage.getItem("token") || null;
  });

  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    setCarregando(false);
  }, []);

  useEffect(() => {
    const tokenSalvo = localStorage.getItem("token");
    const usuarioSalvo = localStorage.getItem("usuario");

    if (tokenSalvo && usuarioSalvo) {
      setToken(tokenSalvo);
      setUsuario(JSON.parse(usuarioSalvo));
    }
  }, []);

  useEffect(() => {
    const carregarPerfil = async () => {
      if (token && usuario && !usuario.imagemProfile) {
        try {
          const res = await axios.get("http://localhost:8080/userProfile/me", {
            headers: { Authorization: `Bearer ${token}` },
          });

          const perfil = res.data;

          const usuarioAtualizado = {
            ...usuario,
            imagemProfile: perfil.imagemProfile,
            nome: perfil.nome,
          };

          setUsuario(usuarioAtualizado);
          localStorage.setItem("usuario", JSON.stringify(usuarioAtualizado));
        } catch (err) {
          console.error("Erro ao carregar perfil do usuário:", err);
        }
      }
    };

    carregarPerfil();
  }, [token, usuario]);

  const login = (token, usuario) => {
    localStorage.setItem("token", token);
    localStorage.setItem("usuario", JSON.stringify(usuario));
    setToken(token);
    setUsuario(usuario);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    setToken(null);
    setUsuario(null);
    
    if (mensagem) alert(mensagem);

    setTimeout(() => {
      window.location.href = "/";
    }, 2000);
  };

  return (
    <AuthContext.Provider
      value={{ usuario, token, login, logout, autenticado: !!usuario }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node,
};
