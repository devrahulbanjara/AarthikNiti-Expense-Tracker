import { useState } from "react";

const AuthForm = ({ onSubmit, isSignup }) => {
  const [formData, setFormData] = useState({ email: "", password: "", full_name: "", currency_preference: "NPR" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(formData); }}>
      {isSignup && <input type="text" name="full_name" placeholder="Full Name" onChange={handleChange} required />}
      <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
      <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
      {isSignup && (
        <select name="currency_preference" onChange={handleChange}>
          <option value="NPR">NPR</option>
          <option value="INR">INR</option>
          <option value="USD">USD</option>
        </select>
      )}
      <button type="submit">{isSignup ? "Sign Up" : "Login"}</button>
    </form>
  );
};

export default AuthForm;
