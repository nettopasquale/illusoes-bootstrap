import axios from "axios";
import { useContext, useEffect } from "react";
import { AuthContext } from "./AuthContext";

//axios vai intercepcar a resposta das requisições para ver o token do usuário está válido. se não estiver, ele força o logout
export const tokenExp = () => {
  const { logout } = useContext(AuthContext);

  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
          logout("Sua sessão expirou. Faça login novamente.");
        }
        return Promise.reject(error);
      }
    );

    return () => axios.interceptors.response.eject(interceptor);
  }, [logout]);
};
