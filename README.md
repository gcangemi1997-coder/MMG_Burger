# MMG Burger

A modern burger ordering platform with authentication, cart management, user orders, kitchen dashboard, and admin management.

## ✨ Features

- User registration and login
- Role-based access for users, staff, and admins
- Burger menu browsing with cart management
- Order placement and order history
- Kitchen dashboard for preparing orders
- Admin dashboard for order management
- MongoDB support with in-memory fallback
- JWT-based authentication

## 🛠️ Tech Stack

- React
- Vite
- Express.js
- MongoDB + Mongoose
- Bootstrap
- JSON Web Tokens
- bcryptjs

## 🚀 Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Run the development server

```bash
npm run dev
```

### 3. Start the API server

```bash
npm run api
```

## 🔐 Demo Credentials

- Admin
  - Email: admin@mmgburger.test
  - Password: admin123

- Customer
  - Email: cliente@mmgburger.test
  - Password: cliente123

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

- `src/` contains the React frontend and all UI components
- `api/` contains the Express backend routes, database logic, and models
- `public/` contains static files such as the web manifest
- `tests/` contains automated API route tests

## ✅ Main Functionalities Implemented

- Authentication flow with login and registration
- Protected routes based on user role
- Shopping cart with quantity management
- Order submission and personal order tracking
- Staff panel to update order status
- Admin panel to manage incoming orders
- Database integration with fallback for local development

## 👨‍💻 Author

Built by **Giorgio Cangemi** as part of the [Start2Impact](https://www.start2impact.it/) Full Stack Developer course — AI Agents module.

---

## 📬 Contact

Feel free to reach out if you have any questions or feedback:

- 💼 [LinkedIn — Giorgio Cangemi](https://www.linkedin.com/in/giorgio-cangemi-7b4b77172/)
- 📧 [g.cangemi1997@gmail.com](mailto:g.cangemi1997@gmail.com)

---

## 📄 License

This project is created for educational purposes.
