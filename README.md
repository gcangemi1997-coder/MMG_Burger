# 🍔 MMG Burger

<div align="center">

![React](https://img.shields.io/badge/Frontend-React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Build-Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Express](https://img.shields.io/badge/Backend-Express-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/Auth-JWT-black?style=for-the-badge&logo=jsonwebtokens)
![Bootstrap](https://img.shields.io/badge/UI-Bootstrap-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white)

</div>

A modern burger ordering platform built with **React**, **Express.js**, and **MongoDB**, featuring authentication, cart management, order tracking, kitchen workflow, and admin controls.

---

## ✨ Overview

MMG Burger is a full stack web application designed to simulate a modern burger ordering experience.  
Users can browse the menu, add products to the cart, place orders, and track their personal order history, while staff and admins can manage the kitchen and incoming orders.

---

## 🚀 Features

### 👤 Authentication

- User registration and login
- JWT-based authentication
- Persistent session handling
- Logout flow that clears local authentication data
- Role-based access control

### 🍔 Customer Experience

- Burger menu browsing
- Shopping cart with quantity management
- Order placement
- Personal order history

### 👨‍🍳 Staff Area

- Kitchen dashboard for incoming orders
- Order status updates during preparation
- Real-time workflow for kitchen operations

### 🛡️ Admin Area

- Admin dashboard for order management
- Access control for privileged actions
- Centralized view of incoming orders

### 🗄️ Data Layer

- MongoDB integration with Mongoose
- In-memory fallback support for local development

---

## 🛠️ Tech Stack

| Layer          | Technologies                    |
| -------------- | ------------------------------- |
| Frontend       | React, Vite, Bootstrap          |
| Backend        | Express.js                      |
| Database       | MongoDB, Mongoose               |
| Authentication | JSON Web Tokens (JWT), bcryptjs |
| Testing        | Automated API route tests       |

---

## 📦 Project Structure

```text
MMG Burger/
├── api/
│   ├── admin/
│   ├── config/
│   ├── models/
│   ├── orders/
│   ├── index.js
│   ├── login.js
│   ├── order.js
│   ├── orders.js
│   └── register.js
├── public/
│   └── site.webmanifest
├── src/
│   ├── components/
│   ├── context/
│   ├── App.jsx
│   └── main.jsx
├── tests/
│   └── api-routes.test.js
├── index.html
├── package.json
├── vite.config.js
└── vercel.json
```

### Folder Guide

- `src/` → React frontend and UI components
- `api/` → backend routes, authentication, models, and database logic
- `public/` → static assets and web manifest
- `tests/` → automated backend/API tests

---

## ✅ Main Functionalities Implemented

- Authentication flow with login and registration
- Protected routes based on user role
- Shopping cart with quantity management
- Order submission and personal order tracking
- Staff dashboard to update order status
- Admin dashboard to manage incoming orders
- Database integration with fallback for local development

---

## ⚙️ Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Run the frontend development server

```bash
npm run dev
```

### 3. Start the API server

```bash
npm run api
```

---

## 🔐 Demo Credentials

### Admin

- **Email:** [admin@mmgburger.test](mailto:admin@mmgburger.test)
- **Password:** `admin123`

### Customer

- **Email:** [cliente@mmgburger.test](mailto:cliente@mmgburger.test)
- **Password:** `cliente123`

---

## 🧪 Project Goals

This project was created to practice and demonstrate:

- Full stack application structure
- Authentication and authorization
- Role-based user flows
- CRUD logic for orders
- Frontend and backend integration
- Real-world portfolio project organization

---

## 👨‍💻 Author

Built by **Giorgio Cangemi** as part of the [Start2Impact](https://www.start2impact.it/) Full Stack Developer course.

---

## 📬 Contact

- 💼 [LinkedIn — Giorgio Cangemi](https://www.linkedin.com/in/giorgio-cangemi-7b4b77172/)
- 📧 [g.cangemi1997@gmail.com](mailto:g.cangemi1997@gmail.com)

---

## 📄 License

This project was created for educational purposes.
