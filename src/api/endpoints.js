import API from "./axios";

// Login
export const loginUser = (data) => API.post("/auth/login", data);

// Appointments
export const getAppointments = () => API.get("/appointments/my");
export const addAppointments = (data) => API.post("/appointments", data);
export const getAppointmentsId = (id) => API.get(`/appointments/${id}`);

// Queue
export const getQueue = (date = '2026-03-17') => API.get(`/queue?date=${date}`);
export const getQueueId = (id, data) => API.patch(`/queue/${id}`, data);

// Doctor
export const getDoctor = () => API.get("/doctor/queue");

// Prescriptions
export const getPrescriptions = () => API.get("/prescription/my");
export const addPrescription = (appointmentId, data) => API.post(`/prescription/${appointmentId}`, data);

// Reports
export const getReports = () => API.get("/reports/my");
export const addReports = (appointmentId, data) => API.post(`/reports/${appointmentId}`, data);

// Admin
export const getAdmin = () => API.get("/admin/clinic");
export const getUsers = () => API.get("/admin/users");
export const addUsers = (data) => API.post(`/admin/users`, data);
export const updateUser = (id, data) => API.put(`/admin/users/${id}`, data);
export const deleteUser = (id) => API.delete(`/admin/users/${id}`);