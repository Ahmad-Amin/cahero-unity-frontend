import axios from "axios";
import Cookies from "js-cookie";
import { store } from "../store";
import { logout } from "../Slice/AuthSlice";

const axiosInstance = axios.create({
  baseURL: "https://cahero-ott-f285594fd4fa.herokuapp.com/api",
  // baseURL: "http://localhost:3003/api",
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = Cookies.get("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`; // Use backticks here for template literal
    }
    config.headers["ngrok-skip-browser-warning"] = "true";
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response &&
      error.response.data &&
      error.response.data.error === "jwt expired"
    ) {
      store.dispatch(logout());

      Cookies.remove("token");
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
