import { createContext, use, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
export const AppContext = createContext();

const AppContextProvider = (props) => {
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [userId, setUserId] = useState(localStorage.getItem("userId") || null);
  const [credit, setCredit] = useState(null); 
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const navigate = useNavigate();
  const loadCreditsData = async () => {
    try {
      if (!token) return;

      const { data } = await axios.get(`${backendUrl}/api/user/credits`, {
        headers: { Authorization: `Bearer ${token}` }, 
      });

      if (data.success) {
        setCredit(data.credits);
        setUser(data.user);
      } else {
        toast.error("Failed to load credits data.");
      }
    } catch (error) {
      console.error("Error loading credits:", error);
      toast.error(error.response?.data?.message || "Something went wrong.");
    }
  };

  const generateImage = async (prompt) => {
    try {
      const { data } = await axios.post(backendUrl + "/api/image/generate-image", {prompt}, {headers: {token}});
       
      if (data.success) {
        loadCreditsData();
        return data.resultImage;
      } else {
        toast.error(data.message);
        loadCreditsData();
        if(data.creditBalance === 0){
          navigate("/buy");
        }
      }
    } catch (error) {
      console.error("Error generating image:", error);
      toast.error(error.response?.data?.message || "Something went wrong.");
    }
  };
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setToken(null);
    setUser(null);
    setUserId(null);
    setCredit(null);
  };

  useEffect(() => {
    if (token) {
      loadCreditsData();
    }
  }, [token]); 

  const value = {
    user,
    setUser,
    showLogin,
    setShowLogin,
    backendUrl,
    token,
    setToken,
    credit,
    setCredit,
    loadCreditsData,
    logout,
    generateImage
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};

export default AppContextProvider;