import { useContext } from "react";
import { AuthContext } from "./AuthContext";

// hook que facilita o AuthContext
export const useAuth = () => useContext(AuthContext);