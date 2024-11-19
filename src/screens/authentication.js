import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Authentication.css";
import { Link } from "react-router-dom";
import { useUser } from "../context/useUser";

export const AuthenticationMode = Object.freeze({
  Login: "Login",
  Register: "Register",
});

export default function Authentication({ authenticationMode }) {
  const navigate = useNavigate();
  const { user, setUser, signUp, login } = useUser();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      authenticationMode === AuthenticationMode.Register && password !== confirmPassword
    ) {
      alert("Passwords do not match");
      return;
    }

    try {
      if (authenticationMode === AuthenticationMode.Register) {
        await signUp(user.email, password);
        navigate("/login");
      } else {
        await login(user.email, password);
        navigate("/");
      }
    } catch (error) {
      const message = error.response && error.response.data ? error.response.data.error : error;
      alert(message);
    }
  };

  return (
    <div>
      <Link to="/">Back</Link>
      <div className="container">
        <div className="header">
          <div className="text">
            {authenticationMode === AuthenticationMode.Register ? "Create a new account" : "Login"}
          </div>
        </div>

        <form className="inputs" onSubmit={handleSubmit}>
          <div className="input">
            <input type="email" placeholder="Email" value={user.email} onChange={(e) => setUser({ ...user, email: e.target.value })}/>
          </div>
          <div className="input">
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}/>
          </div>
          {authenticationMode === AuthenticationMode.Register && (
            <div className="input">
              <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}/>
            </div>
          )}
        </form>
        {authenticationMode === AuthenticationMode.Login ? (
          <div className="signup"> Don't have an account?{" "} <span onClick={() => navigate("/signup")}>Sign up</span>
          </div>
        ) : (
          <div className="signup"> Already have an account?{" "} <span onClick={() => navigate("/login")}>Login</span>
          </div>
        )}

        <div className="submit-container">
          <button type="submit" className="login-newAcc-btn" onClick={handleSubmit}>
            {authenticationMode === AuthenticationMode.Login ? "Sign in" : "Create an account"}
          </button>
        </div>
      </div>
    </div>
  );
}
