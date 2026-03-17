import API from "./axios";

// Login
export const loginUser = (data) => API.post("/auth/login", data);

// Appointments
export const getAppointments = () => API.get("/appointments/my");
export const addAppointments = () => API.post("/appointments");
export const getAppointmentsId = () => API.get("/apointments/{id}");

// Queue
export const getQueue = () => API.get("/queue");
export const getQueueId = () => API.patch("/queue/{id}");

// Doctor
export const getDoctor = () => API.get("/doctor/queue");

// Prescriptions
export const getPrescriptions = () => API.get("/prescription/my");
export const getPrescriptionsId = () => API.post("/prescription/{appointmentId}");

// Reports
export const getReports = () => API.get("/reports/my");
export const addReports = () => API.post("/reports/{appointmentId}");

// Admin
export const getAdmin = () => API.get("/admin/clinic");
export const getUsers = () => API.get("/admin/users");
export const addUsers = () => API.post("/admin/users");