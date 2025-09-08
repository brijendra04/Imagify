import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '/src/context/AppContext.jsx';
import { motion } from 'framer-motion';

const Login = () => {
  const { showLogin, setShowLogin, loginUser, registerUser } = useContext(AppContext);
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLogin) {
      await loginUser(formData.email, formData.password);
    } else {
      await registerUser(formData.name, formData.email, formData.password);
    }
  };

  // Effect to disable body scroll when modal is open
  useEffect(() => {
    if (showLogin) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showLogin]);

  if (!showLogin) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0.2, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="relative w-full max-w-md p-10 bg-white rounded-xl text-slate-500 shadow-2xl"
      >
        <img
          onClick={() => setShowLogin(false)}
          src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cline x1='18' y1='6' x2='6' y2='18'%3E%3C/line%3E%3Cline x1='6' y1='6' x2='18' y2='18'%3E%3C/line%3E%3C/svg%3E"
          alt="close"
          className="absolute w-5 cursor-pointer top-5 right-5"
        />
        <h1 className="text-2xl font-medium text-center text-neutral-700">{isLogin ? "Login" : "Sign Up"}</h1>
        <p className="text-sm text-center">Welcome back! Please sign in to continue</p>

        {!isLogin && (
          <div className="flex items-center gap-2 px-6 py-2 mt-5 border rounded-full">
             <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            <input
              onChange={handleChange}
              value={formData.name}
              name="name"
              type="text"
              className="w-full text-sm outline-none"
              placeholder="Full Name"
              required
            />
          </div>
        )}

        <div className="flex items-center gap-2 px-6 py-2 mt-4 border rounded-full">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" /></svg>
          <input
            onChange={handleChange}
            value={formData.email}
            name="email"
            type="email"
            className="w-full text-sm outline-none"
            placeholder="Email id"
            required
          />
        </div>

        <div className="flex items-center gap-2 px-6 py-2 mt-4 border rounded-full">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
          <input
            onChange={handleChange}
            value={formData.password}
            name="password"
            type="password"
            className="w-full text-sm outline-none"
            placeholder="Password"
            required
          />
        </div>

        <p className="my-4 text-sm text-blue-600 cursor-pointer">Forgot password?</p>

        <button
          type="submit"
          className="w-full py-2 text-white bg-blue-600 rounded-full"
        >
          {isLogin ? "Login" : "Create Account"}
        </button>

        {isLogin ? (
          <p className="mt-5 text-center">
            Don&apos;t have an account?{" "}
            <span
              onClick={() => setIsLogin(false)}
              className="text-blue-600 cursor-pointer"
            >
              Sign up
            </span>
          </p>
        ) : (
          <p className="mt-5 text-center">
            Already have an account?{" "}
            <span
              className="text-blue-600 cursor-pointer"
              onClick={() => setIsLogin(true)}
            >
              Login
            </span>
          </p>
        )}
      </motion.form>
    </div>
  );
};

export default Login;

