import { useEffect, useState } from "react";
import api from "../services/api";

import { AuthContext } from "./auth-context";

export function AuthProvider({ children }) {
  const [token, setToken] = useState(
    localStorage.getItem("clarifai_token")
  );

  const isAuthenticated = !!token;

  useEffect(() => {
    if (token) {
      localStorage.setItem("clarifai_token", token);

      api.defaults.headers.common.Authorization = `Bearer ${token}`;
    } else {
      localStorage.removeItem("clarifai_token");

      delete api.defaults.headers.common.Authorization;
    }
  }, [token]);

  function login(accessToken) {
    setToken(accessToken);
  }

  function logout() {
    setToken(null);
  }

  return (
    <AuthContext.Provider
      value={{
        token,
        isAuthenticated,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}