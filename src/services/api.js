 import axios from "axios";


 

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Drivers
export const getDrivers = () => API.get("/drivers");
export const createDriver = (data) => API.post("/drivers", data);
export const updateDriver = (id, data) => API.put(`/drivers/${id}`, data);
export const deleteDriver = (id) => API.delete(`/drivers/${id}`);

// Routes
export const getRoutes = () => API.get("/routes");
export const createRoute = (data) => API.post("/routes", data);
export const updateRoute = (id, data) => API.put(`/routes/${id}`, data);
export const deleteRoute = (id) => API.delete(`/routes/${id}`);

// Orders
export const getOrders = () => API.get("/orders");
export const createOrder = (data) => API.post("/orders", data);
export const updateOrder = (id, data) => API.put(`/orders/${id}`, data);
export const deleteOrder = (id) => API.delete(`/orders/${id}`);


 
export const runSimulation = (params) => API.post("/simulation", params);
