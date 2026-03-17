import axios from "axios";

const API = axios.create({
    baseURL: "https://cmsback.sampaarsh.cloud",
});

API.interceptors.request.use((req) => {
    const token = localStorage.getItem("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIwNSwicm9sZSI6ImFkbWluIiwiY2xpbmljSWQiOjM3OCwiaWF0IjoxNzczNzE2MzgyLCJleHAiOjE3NzQzMjExODJ9.PRzagb5e_WyOafGtmvIQ2b1XlbZYNlrTNHn3xsyMzpo");

    if (token) {
        req.headers.Authorization = `Bearer ${token}`;
    }

    return req;
});

export default API;