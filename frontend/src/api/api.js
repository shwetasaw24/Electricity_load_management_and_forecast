import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:8000",
  timeout: 10000
});

export function setAuthHeaders(email, password) {
  if (email && password) {
    api.defaults.headers.common["email"] = email;
    api.defaults.headers.common["password"] = password;
  } else {
    delete api.defaults.headers.common["email"];
    delete api.defaults.headers.common["password"];
  }
}
