import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Result from "./pages/Result";
import BuyCredit from "./pages/BuyCredit";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Login from "./components/Login";
import { AppContext } from "./context/AppContext";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProtectedRoute = ({ children }) => {
  const { user, isLoading } = useContext(AppContext);

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const App = () => {
  const { showLogin } = useContext(AppContext);

  return (
    <div className="px-4 sm:px-10 md:px-14 lg:px-28 min-h-screen bg-gradient-to-b from-teal-50 to-orange-50 text-neutral-800">
      <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar={false} />
      <Navbar />
      {showLogin && <Login />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/result" element={
          <ProtectedRoute>
            <Result />
          </ProtectedRoute>
        } />
        <Route path="/buy" element={
          <ProtectedRoute>
            <BuyCredit />
          </ProtectedRoute>
        } />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;
