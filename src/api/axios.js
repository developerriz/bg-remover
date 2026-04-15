import axios from "axios";

const API = axios.create({
  baseURL: "https://unemitting-dalilah-inefficaciously.ngrok-free.dev",
  withCredentials: true, // Required to send/receive cookies
  withXSRFToken: true, // Required for Laravel 11/12 to auto-read the token
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true", // Bypass ngrok warning page
  },
});

export default API;
// import axios from "axios";

// const API = axios.create({
//   baseURL: "https://unemitting-dalilah-inefficaciously.ngrok-free.dev",
//   withCredentials: true, // 🔥 IMPORTANT for Sanctum
//   headers: {
//     "ngrok-skip-browser-warning": "true", // 🔥 NGROK bypass
//     "Content-Type": "application/json",
//     Accept: "application/json",
//   },
// });

// // 🔥 Laravel Sanctum (Laravel 11/12)
// API.defaults.withXSRFToken = true;

// export default API;
