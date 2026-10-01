# 🏰 Grand Monarch Pavilion
### Web-Based Restaurant and Event Management System
**Course:** SE2030 – Software Engineering Project  
**Academic Year:** Year 2 Semester 1  
**Group ID:** `2026-Y2-S1-MLB-B3G2-09`  

---

## 📌 Project Overview

**Grand Monarch Pavilion** is an enterprise-grade, web-based management platform built to streamline the daily operations of luxury banquet facilities and dining establishments. The platform provides end-to-end automation for customer reservations, event bookings, resource and venue scheduling, financial invoicing, dynamic menu management, and multi-tier staff coordination with role-based access control.

---

## 👥 Group Members & Contribution Matrix

| Member No | Student Name | Assigned Module / Role | Primary Responsibilities |
| :--- | :--- | :--- | :--- |
| **01** | **Nadin P.G.K.** | User Management & Security | User Authentication, JWT, Roles, Profile Management |
| **02** | **Sandaruwan D.G.I.** | Table Reservation System | Dining Table Allocations, Reservation Scheduling |
| **03** | **Hellarawa H. M. V. K. B.** | Event Management | Event Bookings, Stage/Hall Coordination, Staff Assignments |
| **04** | **Wijesingha W.M.G.K.** | Finance & Billing | Invoicing, Multi-channel Payments, Digital Receipts |
| **05** | **Dulanjee R. K. K.** | Venue Operations | Venue Hall Setup, Capacity Management, Availability |
| **06** | **Jayakodi J.A.P.V.N.** | Resource & Inventory | Resource Inventory, Event Equipment Allocation, CSR |

---

## 🛠️ Technology Stack

### **Backend**
- **Language / Platform:** Java 17 (LTS)
- **Framework:** Spring Boot 3.3.2
- **Data Persistence:** Spring Data JPA / Hibernate ORM
- **Security:** Spring Security 6 with JWT (JSON Web Tokens)
- **Build Tool:** Apache Maven
- **Database Driver:** MySQL Connector/J 8.0+

### **Frontend**
- **Core:** HTML5, CSS3, Modern JavaScript (Vanilla ES6+)
- **Architecture:** Component-based UI modules (`components/`, `common/`)
- **Styling:** Custom luxury theme with responsive design & modal frameworks

### **Database**
- **RDBMS:** MySQL 8.0+
- **Database Name:** `restaurant_event_db`

---

## 🏛️ System Architecture

The application adheres to the industry-standard **Layered Architecture** pattern:

```
├── Controller Layer      -> Handles REST endpoints, incoming HTTP requests & validations
├── Service Layer         -> Encapsulates business logic, transactional rules, workflows
├── Repository Layer      -> Spring Data JPA interfaces for database operations
├── Entity Layer          -> JPA database domain entities mapped to MySQL tables
├── DTO Layer             -> Data Transfer Objects for decoupled API request/response payloads
└── Security & Config     -> Spring Security filters, JWT authentication, CORS handlers
```

---

## 📂 Project Directory Structure

```plaintext
Grand Monarch Pavilion/
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/restaurant/app/
│   │   │   │   ├── common/             # Global configurations, exceptions, JWT security, utilities
│   │   │   │   ├── config/             # CORS, JPA, and Spring Security configurations
│   │   │   │   ├── menu/               # Menu item management module (Controller, DTO, Entity, Repo, Service)
│   │   │   │   └── EventManagementApplication.java  # Spring Boot Main Entry Point
│   │   │   └── resources/
│   │   │       └── application.properties # Spring configuration & MySQL connection details
│   │   └── test/                       # Unit & integration tests
│   ├── pom.xml                         # Maven dependencies & build configurations
│   └── run_backend.bat                 # Automated script to detect Maven and launch backend
├── database/
│   ├── schema.sql                      # Complete MySQL schema DDL & initial seed records
│   └── setup_db.bat                    # One-click automated database initialization script
└── frontend/
    ├── css/                            # Global & component style sheets
    ├── images/                         # Project image assets & media
    ├── js/
    │   ├── common/                     # Utility scripts and shared helpers
    │   ├── components/                 # Component scripts (menu.js, header.js, sidebar.js, reviews.js)
    │   └── app.js                      # Main client application logic
    └── index.html                      # Single Page Application main entry point
```

---

## ⚡ Prerequisites

Make sure the following tools are installed on your workstation:
1. **Java Development Kit (JDK):** Version 17 or higher (`java -version`)
2. **MySQL Server:** Version 8.0 or higher running on port `3306`
3. **Apache Maven:** Version 3.8+ (Optional if using IDE or IntelliJ bundled Maven)
4. **Web Browser:** Google Chrome, Microsoft Edge, or Mozilla Firefox

---

## 🚀 Quick Start / Setup Instructions

### 1️⃣ Database Setup
1. Ensure your MySQL server service is running.
2. Open `database/schema.sql` in MySQL Workbench or run the automated script:
   ```cmd
   cd database
   setup_db.bat
   ```
   *Or execute manually via command line:*
   ```cmd
   mysql -u root -p < schema.sql
   ```
   This creates the `restaurant_event_db` database, all necessary relational tables, foreign key constraints, and default seed users.

---

### 2️⃣ Configure Backend Connection
Check `backend/src/main/resources/application.properties` and verify your MySQL credentials:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/restaurant_event_db?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=root
```
*(Update `username` and `password` according to your local MySQL installation if needed)*

---

### 3️⃣ Run the Spring Boot Backend
You can launch the backend using one of the following methods:

**Method A: Using the automated batch script**
```cmd
cd backend
run_backend.bat
```

**Method B: Using Maven CLI**
```cmd
cd backend
mvn clean spring-boot:run
```

**Method C: Using IntelliJ IDEA / Eclipse**
- Open the `backend/` folder in your IDE.
- Locate `src/main/java/com/restaurant/app/EventManagementApplication.java`.
- Right-click and choose **Run 'EventManagementApplication'**.

The backend server starts on: **`http://localhost:8080`**

---

### 4️⃣ Launch the Frontend
- The Spring Boot backend is pre-configured to serve static frontend files directly at:
  👉 **`http://localhost:8080/index.html`**
- Alternatively, you can open `frontend/index.html` directly in any web browser or serve it using the VS Code **Live Server** extension.

---

## 🔑 Default Test Accounts (Demo Credentials)

All test accounts are pre-seeded in the database with the default password: `admin123`

| Username | Password | Role | Assigned Member / Name |
| :--- | :--- | :--- | :--- |
| `admin` | `admin123` | **ADMIN** | Nadin P.G.K. |
| `coordinator` | `admin123` | **EVENT_COORDINATOR** | Hellarawa H. M. V. K. B. |
| `finance` | `admin123` | **FINANCE_OFFICER** | Wijesingha W.M.G.K. |
| `supervisor` | `admin123` | **OPERATIONS_SUPERVISOR** | Dulanjee R. K. K. |
| `csr` | `admin123` | **CUSTOMER_SERVICE** | Jayakodi J.A.P.V.N. |
| `sandaruwan` | `admin123` | **CUSTOMER** | Sandaruwan D.G.I. |
| `kamal` | `admin123` | **CUSTOMER** | Kamal Perera |

---

## 📡 Core API Endpoints

### 🍽️ Menu Management (`/api/menu`)
- `GET /api/menu` – Retrieve all active menu items
- `GET /api/menu/{id}` – Retrieve single item details
- `POST /api/menu` – Create a new menu item *(Admin/Staff only)*
- `PUT /api/menu/{id}` – Update an existing item
- `DELETE /api/menu/{id}` – Soft-delete/deactivate item
- `GET /api/menu/categories` – List all available menu categories

---

## 🔒 Security & Role-Based Access Control (RBAC)

- Authentication is managed via **JWT Bearer Tokens**.
- Protected endpoints require an `Authorization: Bearer <TOKEN>` header.
- Cross-Origin Resource Sharing (CORS) is enabled to support frontend communication on common localhost ports.

---

## 📜 Academic Disclaimer
This project has been developed as an academic submission for the **SE2030 Software Engineering Project** module at the **Sri Lanka Institute of Information Technology (SLIIT)**. All rights reserved by the project members.
