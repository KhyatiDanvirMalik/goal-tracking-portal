# Goal Tracking Portal

A full-stack Goal Setting & Performance Tracking Portal built for enterprise performance management workflows. The system enables employees, managers, and admins to collaboratively manage goals, quarterly check-ins, approvals, and performance visibility in real time.

---

## 🚀 Live Demo

### Frontend
https://goal-tracking-portal-u4hj.onrender.com

### Backend API
https://goal-tracking-backend.onrender.com

---

## 📌 Features

### 👨‍💼 Employee
- Create and manage goals
- Submit goals for approval
- Quarterly achievement updates
- Track progress and completion
- View locked approved goals

### 👨‍💻 Manager
- Approve/reject employee goals
- Team dashboard and analytics
- Inline goal editing during approval
- Monitor team performance
- Quarterly check-in tracking

### 🛡️ Admin
- Organization-wide visibility
- Goal governance and reporting
- Dashboard analytics
- User and role management

---

## 📊 Core Functionalities

- Goal Creation & Approval Workflow
- Quarterly Check-ins
- Real-time Progress Tracking
- Dashboard Analytics
- Role-Based Authentication
- JWT Authorization
- Protected Routes
- Goal Weightage Validation
- Responsive UI
- REST API Architecture
- MySQL Database Integration

---

## 🛠️ Tech Stack

### Frontend
- React.js
- Vite
- Tailwind CSS
- Axios
- React Router
- React Hot Toast

### Backend
- Node.js
- Express.js
- JWT Authentication
- bcrypt.js

### Database
- MySQL (Railway)

### Deployment
- Frontend: Render Static Site
- Backend: Render Web Service
- Database: Railway MySQL

---

## 📂 Project Structure

```bash
goal-tracking-portal/
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── routes/
│   ├── controllers/
│   ├── middleware/
│   ├── config/
│   ├── database/
│   └── package.json
│
└── README.md
```

---

## ⚙️ Environment Variables

### Backend `.env`

```env
DB_HOST=your_host
DB_PORT=your_port
DB_USER=your_user
DB_PASSWORD=your_password
DB_NAME=railway

JWT_SECRET=your_secret_key

PORT=4000
```

### Frontend `.env`

```env
VITE_API_BASE_URL=https://your-backend-url.onrender.com
```

---

## 🔑 Demo Credentials

### Admin
```txt
Email: admin@portal.com
Password: password123
```

### Manager
```txt
Email: manager@portal.com
Password: password123
```

### Employee
```txt
Email: john@portal.com
Password: password123
```

---

## 🧪 Local Setup

### Clone Repository

```bash
git clone https://github.com/your-username/goal-tracking-portal.git
```

---

### Backend Setup

```bash
cd backend
npm install
npm start
```

---

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## 📈 Deployment Architecture

```txt
Frontend (Render Static Site)
        ↓
Backend API (Render Web Service)
        ↓
Railway MySQL Database
```

---

## 🔒 Security Features

- JWT Authentication
- Password Hashing
- Protected API Routes
- Role-Based Access Control
- Secure API Communication

---

## 📱 Responsive Design

The portal is fully responsive and optimized for:
- Desktop
- Tablet
- Mobile Devices

---

## 👩‍💻 Developed By

Khyati Malik

---

## 📄 License

This project is developed for educational and hackathon purposes.
