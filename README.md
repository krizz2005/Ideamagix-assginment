# IdeaMagix CRM

A modern Customer Relationship Management (CRM) system built using the MERN Stack. The application helps organizations manage users, leads, tags, and customer interactions through a secure role-based dashboard.

---

## Features

### Authentication
- Secure JWT-based authentication
- Role-based authorization
- Protected routes
- Session management

### User Management
- Create users
- Update user information
- Delete users
- Assign roles
- Manage account status

### Lead Management
- Create and manage leads
- Update lead details
- Lead status tracking
- Lead assignment
- Search and filter leads

### Tag Management
- Create tags
- Edit tags
- Delete tags
- Categorize leads

### Activity Logs
- Track user activities
- Maintain audit history
- Record important system actions

### Dashboard
- User statistics
- Lead analytics
- Performance overview
- Interactive charts

---

# Tech Stack

## Frontend
- React.js
- Vite
- React Router DOM
- Axios
- Tailwind CSS
- Lucide React

## Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcrypt.js

---

# Project Structure

```
IdeaMagix/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── services/
│   │   └── App.jsx
│   └── package.json
│
└── README.md
```

---

# Installation

## Clone the Repository

```bash
git clone https://github.com/yourusername/ideamagix-assignment.git
```

```bash
cd ideamagix-assignment
```

---

## Backend Setup

```bash
cd backend
```

Install dependencies

```bash
npm install
```

Create a `.env` file inside the backend directory.

Example:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
NODE_ENV=development
```

Start the backend

```bash
npm run dev
```

---

## Frontend Setup

```bash
cd frontend
```

Install dependencies

```bash
npm install
```

Create a `.env` file.

Example

```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend

```bash
npm run dev
```

---

# API Modules

- Authentication
- User Management
- Lead Management
- Tag Management
- Activity Logs

---

# Security Features

- JWT Authentication
- Password Hashing using bcrypt
- Protected API Routes
- Role-Based Access Control
- Request Validation
- Secure Password Storage

---

# Technologies Used

| Technology | Purpose |
|------------|---------|
| React | Frontend |
| Vite | Build Tool |
| Express | Backend API |
| Node.js | Runtime |
| MongoDB | Database |
| Mongoose | ODM |
| JWT | Authentication |
| bcrypt.js | Password Hashing |
| Axios | API Communication |
| Tailwind CSS | Styling |

---

# Future Improvements

- Email Notifications
- File Upload Support
- Advanced Lead Analytics
- Export Reports
- Notification System
- Calendar Integration
- Real-Time Updates
- Multi-Tenant Support

---

# Author

**Krish Nanda**

B.Sc. Computer Science Student

Full Stack MERN Developer

---

## License

This project is developed for educational and assessment purposes.
