# 🛡️ CyberShield — Real-Time Cyber Threat Intelligence Platform

<div align="center">

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![Leaflet](https://img.shields.io/badge/Leaflet-199900?style=for-the-badge&logo=leaflet&logoColor=white)

**A full-stack cybersecurity dashboard for monitoring, analyzing, and responding to cyber threats in real time.**

[Features](#-features) · [Tech Stack](#-tech-stack) · [Getting Started](#-getting-started) · [API Endpoints](#-api-endpoints) · [Project Structure](#-project-structure)

</div>

---

## 📋 Overview

**CyberShield** is a comprehensive Cyber Threat Intelligence (CTI) platform that provides real-time monitoring, visualization, and management of cybersecurity threats. It features role-based access control (Admin/User), an interactive global threat map, AI-powered chatbot analyst, vulnerability reporting, and predictive analytics — all wrapped in a sleek, dark-themed UI.

---

## ✨ Features

### 🔐 Authentication & Authorization
- JWT-based secure authentication
- Role-based access control (**Admin** / **User**)
- Password hashing with bcrypt
- Protected routes on both frontend and backend

### 📊 Admin Control Panel
- **Real-time threat statistics** — Total, High, Medium, Low severity counts
- **AI Risk Score** — Dynamic risk assessment with visual meter
- **Threat Management Table** — Resolve, Block IP, or Erase threats
- **Vector Velocity Chart** — 7-day threat trend visualization (Recharts)
- **Priority Incursions Panel** — Critical alerts with timestamps
- **Severity Matrix** — Visual breakdown of threat distribution

### 🗺️ GeoIncursion Threat Map
- Interactive **Leaflet** world map with dark tiles
- Color-coded circle markers by severity (🔴 High · 🟣 Medium · 🟢 Low)
- Popup details with threat type, country, and source IP
- Demo fallback data for visualization without live threats

### 🤖 AI Chatbot Analyst
- Rule-based cybersecurity chatbot connected to live threat data
- Pre-built suggestion prompts for quick queries
- Real-time threat database access
- Chat history with clear functionality

### 📈 Additional Modules
- **Vulnerability Reports** — System weakness tracking with risk levels
- **Predictions** — Threat prediction and forecasting (Admin only)
- **Recommendations** — Security action recommendations (Admin only)
- **Insights** — Threat intelligence insights and analytics
- **Activity Logs** — System activity monitoring

### 👤 User Dashboard
- Personalized threat overview for standard users
- Filtered access based on user role

---

## 🛠️ Tech Stack

| Layer        | Technology                                                        |
| ------------ | ----------------------------------------------------------------- |
| **Frontend** | React 19, Vite 8, Tailwind CSS 4, React Router 7, Recharts       |
| **Backend**  | Node.js, Express 5, Mongoose 9                                    |
| **Database** | MongoDB                                                           |
| **Auth**     | JWT (jsonwebtoken), bcryptjs                                      |
| **Maps**     | Leaflet, React-Leaflet, Stadia Maps dark tiles                    |
| **Icons**    | Lucide React                                                      |
| **HTTP**     | Axios                                                             |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18.x
- **MongoDB** (local or [MongoDB Atlas](https://www.mongodb.com/atlas))
- **Git**

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/Cyber.git
cd Cyber
```

### 2. Setup the Backend

```bash
cd server
npm install
```

Create a `.env` file in the `server/` directory:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/cyber_threat_intel
JWT_SECRET=your_super_secret_key_here
```

> ⚠️ **Never commit `.env` files.** The `.gitignore` is configured to exclude them.

Seed the database (optional):

```bash
node seed_map_data.js
node create_admin.js
```

Start the server:

```bash
npm start
```

The API will be running at `http://localhost:5000`

### 3. Setup the Frontend

```bash
cd ../client
npm install
npm run dev
```

The app will be running at `http://localhost:5173`

---

## 🔌 API Endpoints

### Auth Routes — `/api/auth`

| Method | Endpoint    | Description         | Auth |
| ------ | ----------- | ------------------- | ---- |
| POST   | `/register` | Register a new user | ❌    |
| POST   | `/login`    | Login & get JWT     | ❌    |

### Threat Routes — `/api/threats` 🔒

| Method | Endpoint           | Description           | Auth |
| ------ | ------------------ | --------------------- | ---- |
| GET    | `/`                | Get all threats       | ✅    |
| POST   | `/`                | Create a new threat   | ✅    |
| PUT    | `/:id/resolve`     | Resolve a threat      | ✅    |
| POST   | `/block-ip`        | Block an IP address   | ✅    |
| DELETE | `/:id`             | Delete a threat       | ✅    |
| GET    | `/risk-score`      | Get AI risk score     | ✅    |

### Vulnerability Routes — `/api/vulnerabilities` 🔒

| Method | Endpoint | Description             | Auth |
| ------ | -------- | ----------------------- | ---- |
| GET    | `/`      | Get all vulnerabilities | ✅    |
| POST   | `/`      | Report a vulnerability  | ✅    |

### Log Routes — `/api/logs` 🔒

| Method | Endpoint | Description        | Auth |
| ------ | -------- | ------------------ | ---- |
| GET    | `/`      | Get activity logs  | ✅    |
| POST   | `/`      | Create a log entry | ✅    |

> 🔒 = Requires `Authorization: Bearer <token>` header

---

## 📁 Project Structure

```
Cyber/
├── client/                     # React Frontend
│   ├── public/                 # Static assets
│   ├── src/
│   │   ├── api/                # Axios API configuration
│   │   │   └── index.js
│   │   ├── assets/             # Images & SVGs
│   │   ├── components/
│   │   │   ├── Navbar.jsx      # Sidebar navigation
│   │   │   └── ThreatMap.jsx   # Leaflet threat map
│   │   ├── pages/
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── UserDashboard.jsx
│   │   │   ├── Chatbot.jsx
│   │   │   ├── ThreatList.jsx
│   │   │   ├── VulnerabilityReport.jsx
│   │   │   ├── Predictions.jsx
│   │   │   ├── Recommendations.jsx
│   │   │   ├── Insights.jsx
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   ├── App.jsx             # Routes & layout
│   │   ├── App.css             # Custom styles
│   │   ├── index.css           # Global styles
│   │   └── main.jsx            # Entry point
│   ├── index.html
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
│
├── server/                     # Express Backend
│   ├── config/
│   │   └── db.js               # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── threatController.js
│   │   ├── vulnerabilityController.js
│   │   └── logController.js
│   ├── middleware/
│   │   └── authMiddleware.js   # JWT verification
│   ├── models/
│   │   ├── User.js
│   │   ├── Threat.js
│   │   ├── Vulnerability.js
│   │   └── Log.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── threatRoutes.js
│   │   ├── vulnerabilityRoutes.js
│   │   └── logRoutes.js
│   ├── seed_map_data.js        # Seed geo-located threats
│   ├── create_admin.js         # Create admin user
│   ├── server.js               # Entry point
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## 🧑‍💻 Default Credentials

After running `node create_admin.js`:

| Role  | Email              | Password  |
| ----- | ------------------ | --------- |
| Admin | admin@cyber.com    | admin123  |

> ⚠️ Change these credentials in production!

---

## 📸 Screenshots

<details>
<summary>🖥️ Admin Dashboard</summary>

> Real-time threat statistics, risk meter, severity matrix, and threat management table with resolve/block/erase actions.

</details>

<details>
<summary>🗺️ GeoIncursion Map</summary>

> Interactive dark-themed world map with color-coded threat markers showing attack origin, type, and severity.

</details>

<details>
<summary>🤖 AI Chatbot</summary>

> CyberShield AI Analyst with real-time threat data access, suggestion prompts, and conversational interface.

</details>

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

<div align="center">

**Built with 🔐 by [Your Name]**

</div>
