// Permite o login / logout em qualquer lugar, evita o localStorage excessivo
import { createContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import api from "../services/api";
import { toast } from "react-toastify";

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
    const carregarPerfil = async () => {
      if (token && usuario && !usuario.imagemProfile) {
        try {
          const res = await api.get("/userProfile/me");
          const perfil = res.data;
          setUsuario((prev)=> {
            //usa função de atualização para evitar loop infinito
            const usuarioAtualizado = {
              ...prev,
              imagemProfile: perfil.imagemProfile,
              nome: perfil.nome,
            };
            localStorage.setItem("usuario", JSON.stringify(usuarioAtualizado));
            return usuarioAtualizado
          });
        } catch (err) {
          console.error("Erro ao carregar perfil do usuário:", err);
        }
      }
    };
    carregarPerfil();
  }, [token]); //retirado depenência de usuario

  const login = (token, usuario) => {
    localStorage.setItem("token", token);
    localStorage.setItem("usuario", JSON.stringify(usuario));
    setToken(token);
    setUsuario(usuario);
  };

  const logout = (mensagem) => { //parâmetro mensagem declarado
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    setToken(null);
    setUsuario(null);
    
    if (mensagem) toast.success(mensagem);

    setTimeout(() => {
      window.location.href = "/";
    }, 2000);
  };

  //isAdmin exposto no contexto
  const isAdmin = usuario?.tipo === "admin";

  return (
    <AuthContext.Provider //exposto aqui o isAdmin
      value={{ usuario, token, login, logout, autenticado: !!usuario, userId: usuario?._id || null, isAdmin }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node,
};
