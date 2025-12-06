import { createContext, useContext, useEffect, useState } from "react";
import api from "../lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const TOKEN_KEY = 'mc_token';

  // Verificar sesión al cargar y configurar interceptor
  useEffect(() => {
    // Configurar interceptor de request para añadir token automáticamente
    const requestInterceptor = api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem(TOKEN_KEY);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Verificar sesión al cargar
    async function check() {
      try {
        const res = await api.get("/auth/me");
        setUser(res.data);
      } catch (err) {
        setUser(null);
      }
    }
    check();

    // Limpiar interceptor al desmontar
    return () => {
      api.interceptors.request.eject(requestInterceptor);
    };
  }, []);

  async function login(email, password) {
    const res = await api.post("/auth/login", { email, password });
    const { token, user: u } = res.data;
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    }
    setUser(u || null);
    return res.data;
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
    // intentar notificar al servidor, pero no es obligatorio
    try {
      api.post('/auth/logout').catch(() => {});
    } catch (e) {}
    // limpiar token y estado
    localStorage.removeItem(TOKEN_KEY);
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