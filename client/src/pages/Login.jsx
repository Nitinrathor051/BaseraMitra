import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { toast } from "react-toastify";

import { useAuth } from "../context/AuthContext";
import "../styles/Auth.css";

const Login = () => {
  const navigate = useNavigate();

  const { login, loading } = useAuth();

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    login: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await login(formData);

    if (result.success) {
      toast.success("Login Successful");

      if (result.user.role === "owner") {
        navigate("/owner-dashboard");
      } else {
        navigate("/customer-dashboard");
      }
    } else {
      toast.error(result.message);
    }
  };

  return (
    <section className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Welcome Back</h1>

          <p>Login to continue with BaseraMitra</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Email or Mobile Number</label>

            <input
              type="text"
              name="login"
              placeholder="Enter your email or mobile number"
              value={formData.login}
              onChange={handleChange}
              autoComplete="username"
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>

            <div className="password-box">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="current-password"
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={
                  showPassword ? "Hide Password" : "Show Password"
                }
              >
                {showPassword ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="login-btn"
            disabled={loading}
          >
            <LogIn size={18} />

            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        
      </div>
    </section>
  );
};

export default Login;