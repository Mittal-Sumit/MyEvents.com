/* src/components/Login/PasswordField.js */
import React, { useState } from "react";
import TextInput from "./TextInput";
import PasswordToggle from "./PasswordToggle";

const PasswordField = ({ password, setPassword, customLabel }) => {
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  return (
    <div className="password-field">
      <TextInput
        label={customLabel || "Enter Your Password"}
        type={showPassword ? "text" : "password"}
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <PasswordToggle
        showPassword={showPassword}
        togglePasswordVisibility={togglePasswordVisibility}
      />
    </div>
  );
};

export default PasswordField;
