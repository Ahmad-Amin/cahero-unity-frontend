import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../Slice/AuthSlice";
import Cookies from 'js-cookie';
import axiosInstance from "../lib/axiosInstance";
import { HashLoader } from "react-spinners"; 
import { toast } from "react-toastify";



function SignInForm({ onClose, toggleSignUp }) {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false); 
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); 

    
    const { email, password } = credentials;

    try {
      const response = await axiosInstance.post('/auth/login', { email, password });
      const { token } = response.data;

      
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      Cookies.set("token", token, { expires: 7 });

      console.log(response.data.user, token);
      dispatch(login({user: response.data.user, token: token}))

      if (response.data.user.role === "admin") {
        navigate("/dashboard");
      } else {
        navigate("/");
      }
      onClose();
    } catch (error) {
      console.log(error.response.data.message)
      toast.error(error?.response?.data?.message || 'Error Logging in')
      console.error("Login error:", error.response?.data || error.message);
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal bg-[#0d0d0d] text-white">
        <div className="flex justify-end p-2">
          <button onClick={onClose}>
            <CloseIcon />
          </button>
        </div>
        <h2 className="text-2xl font-semibold mx-10 my-5">Login</h2>
        <p className="text-md font-normal mx-10 mb-5 opacity-60">
          Login to access your account
        </p>
        
        {loading ? ( 
          <div className="flex justify-center items-center h-48">
            <HashLoader color="#6A55EA" loading={loading} size={40} />
          </div>
        ) : (
          <form onSubmit={handleLogin}>
            <div className="mx-10 mb-5">
              <TextField
                className="w-full"
                id="email"
                label="Email"
                variant="outlined"
                type="email"
                name="email"
                value={credentials.email}
                onChange={handleChange}
                sx={{
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
                }}
              />
            </div>
            <div className="mx-10">
              <TextField
                className="w-full"
                id="password"
                label="Password"
                variant="outlined"
                type={showPassword ? "text" : "password"}
                name="password"
                value={credentials.password}
                onChange={handleChange}
                sx={{
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
                }}
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
            <div className="mx-10 mt-5 flex justify-between items-center">
              <FormControlLabel
                control={
                  <Checkbox
                    sx={{
                      color: "white",
                      "&.Mui-checked": {
                        color: "white",
                      },
                      "&:hover": {
                        color: "white",
                      },
                    }}
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                }
                label="Remember me"
              />
              <button className="text-[#6A55EA] hover:text-[#5242b6] ease-in-out transition duration-300 text-base font-semibold">
                Forgot Password
              </button>
            </div>
            <div className="mx-10 mt-5 mb-10">
              <button
                className="bg-[#6a55ea] text-white rounded-lg py-2 w-full"
                type="submit"
              >
                Login
              </button>
            </div>
            <div className="flex justify-center my-5">
              <p className="text-[#313131] text-sm font-semibold">
                Don't have an Account?{" "}
                <button className="text-[#6A55EA] hover:text-[#5242b6] ease-in-out transition duration-300" onClick={toggleSignUp}>
                  Sign up
                </button>
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default SignInForm;
