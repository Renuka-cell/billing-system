import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000/api/",
});


// Attach JWT token automatically
API.interceptors.request.use((req) => {

  const token = localStorage.getItem("token");

  // DEBUG TOKEN
  console.log("TOKEN FOUND:", token);

  if (token) {

    req.headers.Authorization =
      `Bearer ${token}`;

  }

  return req;
});

export default API;