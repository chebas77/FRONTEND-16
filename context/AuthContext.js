import { createContext, useContext, useEffect, useState } from "react";
import api from "../lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // Verificar sesión al cargar
  useEffect(() => {
    async function check() {
      try {
        const res = await api.get("/auth/me");
        setUser(res.data);
      } catch (err) {
        setUser(null);
      }
    }
    check();
  }, []);

  async function login(email, password) {
    const res = await api.post("/auth/login", { email, password });
    setUser(res.data.user);
  }

  async function register(fullName, email, password) {
    const res = await api.post("/auth/register", {
      fullName,
      email,
      password,
    });
    // registrar no loguea automáticamente
  }

  function logout() {
    api.post("/auth/logout");
    setUser(null);
  }

  // 🔥 AQUÍ ESTABA EL PROBLEMA
  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        isAuthenticated, // ← YA EXISTE Y SE ENVÍA AL FRONTEND
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
