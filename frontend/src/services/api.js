import axios from "axios";

const API = axios.create({
  baseURL:
    "http://127.0.0.1:8000/api/",
});

API.interceptors.request.use(
  (req) => {

    const token =
      localStorage.getItem(
        "token"
      );

    if (token) {

      req.headers.Authorization =
        `Bearer ${token}`;
    }

    return req;
  }
);

API.interceptors.response.use(

  (response) => response,

  async (error) => {

    const originalRequest =
      error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("login/")
    ) {

      originalRequest._retry =
        true;

      try {

        const refresh =
          localStorage.getItem(
            "refresh"
          );

        const res =
          await axios.post(
            "http://127.0.0.1:8000/api/token/refresh/",
            {
              refresh,
            }
          );

        localStorage.setItem(
          "token",
          res.data.access
        );

        originalRequest.headers.Authorization =
          `Bearer ${res.data.access}`;

        return API(
          originalRequest
        );

      } catch {

        localStorage.clear();

        window.location.href =
          "/";
      }
    }

    return Promise.reject(
      error
    );
  }
);

export default API;