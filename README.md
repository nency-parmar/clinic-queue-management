# 🏥 Clinic Queue Management System (Frontend)

A modern **Clinic Queue Management System (CMS)** frontend built using **Vite + React + Bootstrap**, designed to manage clinic operations efficiently with multiple user roles.

---

## 🚀 Overview

This project is a frontend application for the **Clinic Queue Management API**.  
It supports multiple clinics, where each clinic operates independently with its own:

- Admin
- Doctors
- Receptionists
- Patients

All data is securely scoped per clinic.

---

## 🛠️ Tech Stack

- ⚛️ React (Vite)
- 🎨 Bootstrap (UI Styling)
- 🔗 Axios (API integration)
- 🌐 REST API (Backend)

---

## 🔐 Authentication

- JWT-based authentication
- Token stored in `localStorage`
- Role-based routing after login

---

## 👥 User Roles & Features

### 🧑‍💼 Admin Dashboard
- View clinic information
- Manage users:
  - Add user
  - Update user
  - Delete user
- Role management:
  - `admin`
  - `doctor`
  - `receptionist`
  - `patient`

---

### 🧑‍⚕️ Doctor Dashboard
- View patient queue
- Add prescriptions
- Add medicines
- Upload reports

---

### 🧑‍💻 Receptionist Dashboard
- Manage patient queue
- Update queue status:
  - Waiting
  - In Progress
  - Completed
- Queue display for TV screen

---

### 👤 Patient Dashboard
- Book appointments
  - Select date
  - 15-minute time slots
- View:
  - My appointments
  - Prescriptions
  - Reports
  - Appointment details

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the repository
```bash
git clone https://github.com/nency-parmar/clinic-queue-management.git
cd <project-folder>
```

### 2️⃣ Install dependencies
```bash
npm install
```

### 3️⃣ Run the development server
```bash
npm run dev
```

---

## 🎨 UI & Styling

- Built using **Bootstrap 5**

---

## 🔗 API Configuration

All API requests are handled using Axios with JWT authentication.

---

## 📌 Key API Modules

- Authentication → `/auth/login`
- Appointments → `/appointments`
- Queue → `/queue`
- Users → `/admin/users`
- Prescriptions → `/prescription`
- Reports → `/reports`

---

## 🧪 Development Notes

- Ensure valid JWT token before accessing protected routes
- Role-based redirection implemented after login
- API errors handled using Axios

---

## 🎯 Future Improvements

- Toast notifications (success/error)
- Better UI with modals & tables
- Real-time queue updates

---

## 👨‍💻 Author

**Parmar Nency**

---

## 📄 License

This project is for educational purposes.
