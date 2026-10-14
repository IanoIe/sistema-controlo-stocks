# 📦 Stock Management System

A web-based inventory and stock management application built with Angular, Symfony, PHP, and MySQL. The system helps businesses manage products, monitor stock levels, record stock movements, and organize inventory operations through a centralized platform.

## 🚧 Project Status: In Development
## 📋 Table of Contents
- Overview
- Objectives
- Features
- Technologies
- Architecture
- Project Structure
- Getting Started
- Configuration
- Authentication and Security
- Current Limitations
- Future Improvements
- Author

## 🎯 Overview
The Stock Management System is a personal software project designed to simplify inventory management through a web application.
It provides a centralized interface for managing products, tracking stock entries and exits, identifying products that require replenishment, and reviewing inventory information.
The project is being developed incrementally, with the possibility of expanding its functionality as new requirements and ideas emerge.

## 🎯 Objectives
The main objectives are to:
- Centralize inventory information in one application.
- Simplify product and category management.
- Keep track of incoming and outgoing stock movements.
- Reduce stock management errors.
- Identify products with low or depleted stock.
- Provide useful inventory indicators and reports.
- Implement authentication and controlled access to the API.
- Establish a foundation for future warehouse and supplier management features.

## 🚀 Features

## 📦 Product Management
Create, view, update, and delete products.
Assign products to categories.
Store product codes, prices, and quantities.
Define minimum stock levels.
Activate or deactivate products.
Track product creation and update dates.
Search and filter products by category.

## 📥 Stock Entries
Register incoming stock movements.
Associate entries with products and authenticated users.
Record quantities, dates, reasons, and notes.
Automatically increase the product's stock quantity when an entry is registered.

## 📤 Stock Exits
Register outgoing stock movements.
Associate exits with products and authenticated users.
Record quantities, dates, reasons, and notes.
Validate stock availability before processing an exit.
Automatically decrease the product's stock quantity.

## ⚠️ Stock Alerts
Identify products with low stock.
Identify products with no available stock.
Compare current quantities with minimum stock thresholds.

## 📊 Dashboard
Display the total number of products.
Monitor low-stock and out-of-stock products.
Summarize products by category.
Display total stock entries and exits.
Visualize stock movement trends.

## 📋 Reports
Summarize products and inventory quantities.
Display low-stock and out-of-stock totals.
Summarize stock movements.
Group products by category.
Provide a print-friendly reporting option.

## 🔐 Authentication and Security
Authenticate users through a JWT-based API.
Protect API endpoints against unauthenticated access.
Associate stock movements with the authenticated user.

## 🏭 Warehouse and Supplier Management
The backend data model also includes entities for:
- Warehouses.
- arehouse transfers.
- Transfer items and quantities.
- Suppliers.
- Product-supplier relationships.
- Preferred suppliers and supplier-specific costs.
These entities provide a foundation for extending inventory management across multiple warehouses and suppliers. Their implementation and integration into the complete user interface may evolve during development.

## 📝 Audit Logging
An audit log entity is defined to store information about actions, affected entities, previous and new data, timestamps, and associated users.
The scope and automatic recording of audit events may be expanded as the project develops.

## 🛠️ Technologies

### Frontend
- Angular 20 — web application framework.
- TypeScript — application logic and type safety.
- HTML and CSS — user interface and styling.
- Tailwind CSS — utility-first styling, as used in the project.

### Backend
- PHP — server-side programming language.
- Symfony — backend application framework.
- API Platform — REST API and resource management.
- Doctrine ORM — database mapping and persistence.
- LexikJWTAuthenticationBundle — JWT authentication.

### Database
- MySQL — relational database management system.

### Development Tools
- Git
- GitHub
- Visual Studio Code
- Angular CLI
- Composer
- Git Bash

## 🏗️ Architecture
The application follows a client-server architecture.
┌──────────────────────────────┐
│       Angular Frontend       │
│                              │
│ Dashboard, Products, Reports │
│ Alerts and Stock Operations  │
└──────────────┬───────────────┘
               │
               │ HTTP / JSON
               │ REST API
               ▼
┌──────────────────────────────┐
│       Symfony Backend       │
│                              │
│ API Platform                 │
│ Business Logic               │
│ JWT Authentication           │
│ Doctrine ORM                 │
└──────────────┬───────────────┘
               │
               │ SQL
               ▼
┌──────────────────────────────┐
│          MySQL               │
│                              │
│ Products, Users, Stock       │
│ Categories, Warehouses       │
│ Suppliers and Audit Logs     │
└──────────────────────────────┘
The Angular frontend communicates with the Symfony API using HTTP requests and JSON responses. The backend handles API operations, authentication, validation, business logic, and database access through Doctrine ORM.

## 📁 Project Structure
The repository is organized into separate frontend and backend applications.
stock-management-system/
├── frontend/
│   ├── src/
│   │   └── app/
│   ├── package.json
│   └── README.md
│
├── backend/
│   ├── src/
│   │   ├── Entity/
│   │   ├── Repository/
│   │   └── State/
│   ├── config/
│   ├── migrations/
│   ├── composer.json
│   └── README.md
│
└── README.md

Note: This is an illustrative structure. Actual directories and files may vary depending on the current repository.

frontend/ — Angular application, components, services, models, and routing.
backend/ — Symfony application, API resources, entities, repositories, and business logic.
Root README.md — general project documentation.
Frontend README.md — frontend-specific setup and development instructions.
Backend README.md — backend-specific setup and configuration instructions.

### 🚀 Getting Started
Prerequisites
Install the following tools before running the application:
- Node.js and npm, compatible with the installed Angular version.
- PHP, compatible with the project's Symfony version.
- Composer.
- MySQL.
- Git.

1. Clone the Repository:
- git clone <https://github.com/IanoIe/sistema-controlo-stocks.git>
- cd stock-management-system
- Replace <https://github.com/IanoIe/sistema-controlo-stocks.git> with the URL of your GitHub repository.

2. Start the Backend
Open a terminal and navigate to the backend directory:
- cd backend
- composer install
- Configure the environment variables and database connection as described in the backend README.
- Create or update the database schema using the project's Doctrine migrations:
- php bin/console doctrine:migrations:migrate

Start the Symfony development server:
- symfony server:start
- The backend's actual URL depends on your local configuration.

3. Start the Frontend
Open another terminal:
- cd frontend
- npm install
- ng serve

Open the local frontend URL displayed by Angular CLI, commonly:
- http://localhost:4200
Ensure that the frontend API configuration points to the running backend and that CORS settings allow requests from the frontend origin.

## ⚙️ Configuration
The frontend and backend require separate configuration.
Frontend Configuration
Configure the API base URL using the application's environment configuration or service configuration, depending on the project's implementation.
Ensure that the URL matches the running Symfony API.
Backend Configuration
The backend uses environment variables for settings such as:
- Application environment.
- Database connection.
- API base URL.
- Frontend base URL.
- JWT key paths and passphrase.
- Mailer configuration.
- For local development, use an appropriate environment file such as .env.local when needed.

Security recommendations:
- Never commit production credentials, passwords, private keys, or real JWT passphrases to Git.
- Keep sensitive environment-specific values out of public repositories.
- Use strong, unique secrets in production.
- Replace development placeholders before deployment.
- If a real secret has already been committed or shared, rotate it and remove it from the repository's tracked configuration.

## 🔐 Authentication and Security
The backend uses JWT authentication to protect API endpoints.
The login endpoint authenticates users and returns a token that the frontend can use when accessing protected resources.
The Angular application includes an authentication guard to restrict navigation to authenticated users.
Important security considerations:
- Frontend route guards improve navigation and user experience but do not replace backend authorization.
- Protected API endpoints must enforce authentication and, where necessary, role-based permissions.
- Tokens should be handled and stored according to an appropriate security strategy.
- Sensitive information must never be exposed through public API responses or version control.

## ⚠️ Current Limitations
The project is still under development. Functionality, validation rules, and interfaces may change.
Some backend entities already exist to support more advanced features, but their presence does not necessarily mean that every related workflow is fully implemented in the frontend or backend.
Reports and dashboard indicators may also be refined as the application's requirements evolve.

## 🔮 Future Improvements
Potential improvements include:
- Expand user roles and permission management.
- Improve audit logging and activity history.
- Complete warehouse-specific stock tracking.
- Implement stock transfers with transactional stock updates.
- Expand supplier management and product-supplier workflows.
- Improve reporting, filtering, and data visualization.
- Add automated tests for frontend and backend functionality.
- Improve validation, error handling, and API documentation.
- Prepare deployment and production configuration.
- Refine the user interface and accessibility.
- This roadmap is indicative and may change as the project develops.

## 👤 Author

AC Marvel
Personal project developed to build a practical inventory management solution and explore modern web application development.
Stock Management System — an evolving project focused on inventory control, stock tracking, and operational visibility.