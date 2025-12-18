import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { server } from "../main";
import toast, { Toaster } from "react-hot-toast";

const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState(null); // ✅ FIXED
  const [isAuth, setIsAuth] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const [loading, setLoading] = useState(true);

  // ---------------- LOGIN ----------------
  async function loginUser(email, password, navigate) {
    setBtnLoading(true);
    try {
      const { data } = await axios.post(`${server}/api/user/login`, {
        email,
        password,
      });

      toast.success(data.message);
      localStorage.setItem("token", data.token);

      setUser(data.user);
      setIsAuth(true);
      navigate("/");
    } catch (error) {
      setIsAuth(false);
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setBtnLoading(false);
    }
  }

  // ---------------- REGISTER ----------------
  async function registerUser(name, email, password, navigate) {
    setBtnLoading(true);
    try {
      const { data } = await axios.post(`${server}/api/user/register`, {
        name,
        email,
        password,
      });

      toast.success(data.message);
      localStorage.setItem("activationToken", data.activationToken);
      navigate("/verify");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setBtnLoading(false);
    }
  }

  // ---------------- VERIFY OTP ----------------
  async function verifyOtp(otp, navigate) {
    setBtnLoading(true);
    const activationToken = localStorage.getItem("activationToken");

    if (!activationToken) {
      toast.error("Activation token missing. Please register again.");
      setBtnLoading(false);
      return;
    }

    try {
      const { data } = await axios.post(`${server}/api/user/verify`, {
        otp,
        activationToken,
      });

      toast.success(data.message);
      localStorage.removeItem("activationToken"); // ✅ FIXED
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "OTP verification failed");
    } finally {
      setBtnLoading(false);
    }
  }

  // ---------------- FETCH USER ----------------
  async function fetchUser() {
    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const { data } = await axios.get(`${server}/api/user/me`, {
        headers: {
          token,
        },
      });

      setUser(data.user);
      setIsAuth(true);
    } catch (error) {
      setUser(null);
      setIsAuth(false);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        isAuth,
        setIsAuth,
        btnLoading,
        loading,
        loginUser,
        registerUser,
        verifyOtp,
        fetchUser,
      }}
    >
      {children}
      <Toaster />
    </UserContext.Provider>
  );
};

export const UserData = () => useContext(UserContext);
