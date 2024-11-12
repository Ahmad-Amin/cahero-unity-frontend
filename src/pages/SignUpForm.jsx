import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import TextField from "@mui/material/TextField";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { toast } from "react-toastify"; 
import Cookies from 'js-cookie'; 
import { login } from "../Slice/AuthSlice";
import axiosInstance from "../lib/axiosInstance";
import { HashLoader } from "react-spinners"; 

function SignUpForm({ onClose, toggleSignIn }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState(false); 
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });
  
  const [loading, setLoading] = useState(false); 

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.user);

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleClickShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
  
    const { firstName, lastName, email, phoneNumber, password, confirmPassword } = formData;
  
    if (password !== confirmPassword) {
      setPasswordError(true);
      return; 
    }

    
    if(password.length < 6){
      toast.error("Password must be at least 6 characters long.");
      return;
    }
    
    const phoneNumberRegex = /^\d{10,15}$/;

    if (!phoneNumberRegex.test(phoneNumber)) {
      toast.error("Invalid phone number. Please enter a valid 10-15 digit phone number.");
      return;
    }

    setPasswordError(false);
    setLoading(true);
  
    try {
      const response = await axiosInstance.post("/auth/register", {
        firstName,
        lastName,
        email,
        phoneNumber,
        password,
      });
  
      const { token } = response.data;
  
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      Cookies.set('token', token, { expires: 7 });
      dispatch(login({ user: response.data.user, token }));
      navigate("/dashboard");
      toast.success("Account created successfully!");

      onClose();
  
    } catch (error) {
      console.log(error)
      if (error.response && error.response.status === 409) {
        toast.error("Email already exists. Please use a different email.");
        console.log("Email Already Exists");
      } else {
        const errorMessage = error.response?.data?.message || "An error occurred during signup";
        toast.error(errorMessage);
      }
    } finally {
      setLoading(false); 
    }
  };
  
  useEffect(() => {
    console.log("User Data from Redux Store: ", userData);
  }, [userData]);

  const textfieldStyles = {
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "#79747E",
      },
      "&:hover fieldset": {
        borderColor: "white",
      },
      "&.Mui-focused fieldset": {
        borderColor: "white",
      },
    },
    "& .MuiInputLabel-root": {
      color: "white",
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: "white",
    },
    "& .MuiOutlinedInput-input": {
      color: "white",
    },
  };

  return (
    <div className="modal-overlay">
      <div className="modal bg-[#0d0d0d] text-white p-5 sm:p-10">
        <div className="flex justify-end">
          <button onClick={onClose}>
            <CloseIcon />
          </button>
        </div>
        <h2 className="text-2xl font-semibold my-5">Sign Up</h2>
        <p className="text-md font-normal mb-5 opacity-60">
          Let’s get you all set up so you can access your personal account.
        </p>
        {loading ? ( 
          <div className="flex justify-center items-center h-48">
            <HashLoader color="#6A55EA" loading={loading} size={40} />
          </div>
        ) : (
        <form onSubmit={handleSignup}>
          <div className="mb-5 gap-4 flex flex-col sm:flex-row">
            <TextField
              className="w-full sm:w-1/2"
              id="first-name"
              name="firstName"
              label="First Name"
              variant="outlined"
              value={formData.firstName}
              onChange={handleChange}
              sx={textfieldStyles}
            />
            <TextField
              className="w-full sm:w-1/2"
              id="last-name"
              name="lastName"
              label="Last Name"
              variant="outlined"
              value={formData.lastName}
              onChange={handleChange}
              sx={textfieldStyles}
            />
          </div>
          <div className="mb-5 gap-4 flex flex-col sm:flex-row">
            <TextField
              className="w-full sm:w-1/2"
              id="email"
              name="email"
              label="Email"
              variant="outlined"
              type="email"
              value={formData.email}
              onChange={handleChange}
              sx={textfieldStyles}
              required
            />
            <TextField
              className="w-full sm:w-1/2"
              id="phoneNumber"
              name="phoneNumber"
              label="Phone Number"
              variant="outlined"
              type="tel"
              value={formData.phoneNumber}
              onChange={handleChange}
              sx={textfieldStyles}
              required
            />
          </div>
          <div className="mb-5">
            <TextField
              className="w-full"
              id="password"
              name="password"
              label="Password"
              variant="outlined"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              sx={textfieldStyles}
              pattern=".{6,}" 
              title="6 or more Character"
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      edge="end"
                      sx={{ color: "white" }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </div>
          <div className="mb-5">
            <TextField
              className="w-full"
              id="confirm-password"
              name="confirmPassword"
              label="Confirm Password"
              variant="outlined"
              pattern=".{6,}" 
              title="6 or more Character"
              type={showConfirmPassword ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={handleChange}
              sx={textfieldStyles}
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle confirm password visibility"
                      onClick={handleClickShowConfirmPassword}
                      edge="end"
                      sx={{ color: "white" }}
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            {passwordError && (
              <p className="text-red-500 text-sm mt-2">
                Password and Confirm Password do not match.
              </p>
            )}
          </div>
          <div className="mb-5 flex items-center">
            <FormControlLabel
              control={
                <Checkbox
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleChange}
                  sx={{
                    color: "white",
                    "&.Mui-checked": {
                      color: "white",
                    },
                    "&:hover": {
                      color: "white",
                    },
                  }}
                  required
                />
              }
              className="text-[#313131]"
              label={
                <span className="font-extrabold text-sm">
                  I agree to all the{" "}
                  <button className="text-[#6A55EA] hover:text-[#5242b6] ease-in-out transition duration-300">terms</button> and{" "}
                  <button className="text-[#6A55EA] hover:text-[#5242b6] ease-in-out transition duration-300">privacy policies</button>
                </span>
              }
            />
          </div>
          <div className="my-5">
            <button
              className="text-black font-semibold w-full bg-[#6A55EA] hover:bg-[#5242b6] ease-in-out transition duration-300 py-3 rounded-lg"
              type="submit"
            >
              Sign Up
            </button>
          </div>
        <p className="mt-4 text-sm text-center">
          Already have an account?{" "}
          <button onClick={toggleSignIn} className="font-bold text-[#6A55EA] hover:text-[#5242b6] ease-in-out transition duration-300">
            Sign In
          </button>
        </p>
        </form>)}
      </div>
    </div>
  );
}

export default SignUpForm;
