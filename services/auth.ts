import { clearToken, getToken, storeToken } from "@/storage/secureStore";

export const authService = {
  getToken,
  setToken: storeToken,
  logout: clearToken,
};