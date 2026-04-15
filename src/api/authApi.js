import API from "./axios";

// CSRF
const csrf = () => API.get("/sanctum/csrf-cookie");

// REGISTER
export const registerUser = async (data) => {
  await csrf();
  return API.post("/api/v1/register", data);
};

// LOGIN
// export const loginUser = async (data) => {
//   await csrf();
//   return API.post("/api/v1/login", data);
// };

// FORGOT
// export const forgotPassword = async (data) => {
//   return API.post("/api/v1/forgot-password", data);
// };

// import API from "./axios";

// // ✅ CSRF helper
// const csrf = () => API.get("/sanctum/csrf-cookie");

// // REGISTER
// export const registerUser = async (data) => {
//   await csrf();
//   return API.post("/api/v1/register", data);
// };

// // LOGIN
// export const loginUser = async (data) => {
//   await csrf();
//   return API.post("/api/v1/login", data);
// };

// // FORGOT PASSWORD
// export const forgotPassword = async (data) => {
//   return API.post("/api/v1/forgot-password", data);
// };
// export const resetPassword = async (data) => {
//   return API.post("/api/v1/reset-password", data);
// };

// // LOGOUT
// export const logoutUser = async () => {
//   return API.post("/api/v1/logout");
// };

// // GET USER
// export const getUser = async () => {
//   return API.get("/api/v1/user");
// };

// // UPDATE USER
// export const updateUser = async (data) => {
//   return API.put("/api/v1/user", data);
// };

// // DELETE USER
// export const deleteUser = async () => {
//   return API.delete("/api/v1/user");
// };
