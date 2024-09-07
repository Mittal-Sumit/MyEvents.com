// src/utils/authReg.js
import axios from "axios";
import { toast } from "react-toastify";

export const handleRegistration = async (
  username,
  email,
  password,
  navigate
) => {
  try {
    const response = await axios.post(
      "http://localhost:8000/api/users/register/",
      {
        username,
        email,
        password,
      }
    );

    const { access, refresh } = response.data;
    sessionStorage.setItem("accessToken", access);
    sessionStorage.setItem("refreshToken", refresh);
    toast.success("Registration successful! You are now logged in.");
    navigate("/home");
  } catch (error) {
    if (error.response && error.response.data) {
      const errorData = error.response.data;
      if (errorData.username) {
        toast.error("Username already exists. Please choose a different one.");
      } else if (errorData.email) {
        toast.error("Email already exists. Please choose a different one.");
      } else {
        toast.error("There was an error registering the user.");
      }
    } else {
      toast.error("There was an error registering the user.");
    }
  }
};
