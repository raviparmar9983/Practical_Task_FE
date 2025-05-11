"use client";

import { loginUser, registerUser } from "@/services/authServices";
import { useState } from "react";

const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (data) => {
    setLoading(true);
    setError(null);
    try {
      const res = await loginUser(data);
      localStorage.setItem("user", JSON.stringify(res.data.data));
      return res.data;
    } catch (err) {
      setError(err?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const register = async (data) => {
    setLoading(true);
    setError(null);
    try {
      const res = await registerUser(data);
      return res.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.response?.data?.error || err.message || "Registration failed";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { login, register, loading, error };
};

export default useAuth;
