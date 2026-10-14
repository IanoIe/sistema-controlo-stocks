# 📦 Stock Management System — Frontend

The frontend of the Stock Management System is a web application developed with Angular. It provides an interface for managing products and inventory operations, monitoring stock levels, and viewing relevant information through a dashboard and reports.

## 🚧 Project Status: In Development
## 🎯 Overview

The frontend communicates with a REST API developed with Symfony and API Platform to access and manage inventory data.

The application aims to provide a clear and intuitive interface for stock management, helping users monitor inventory levels, track stock movements, and access relevant inventory information.

## 🚀 Features
- 🔐 User authentication and protected routes
- 📦 Product management
- 📥 Stock entry registration
- 📤 Stock exit registration
- ⚠️ Low-stock and out-of-stock alerts
- 📊 Dashboard with inventory indicators
- 📈 Stock movement visualization
- 📋 Reports with stock and product information
- 🗂️ Product categorization
- 🔎 Product search and filtering, where implemented

## 🛠️ Technologies

### Frontend
- Angular 20.3.6
- TypeScript
- Tailwind CSS
- Angular Router
- RxJS

### Backend Integration
- Symfony
- API Platform
- REST API
- JSON over HTTP

## 🏗️ Architecture

The frontend communicates with the backend through HTTP requests. The backend processes requests, applies business rules, and manages persistent data in the database.

Angular Frontend
       |
       | HTTP / JSON
       v
Symfony REST API
       |
       v
MySQL Database

## 📁 Main Application Areas

### Dashboard
Provides an overview of inventory information, including:
Total number of products
Products with low stock
Products out of stock
Product statistics by category
Total stock entries and exits
Stock movement evolution

### Product Management
Provides access to product information, including product names, codes, prices, quantities, minimum stock levels, categories, and active status.

### Stock Entries
Allows users to register incoming stock operations. The backend validates the requested quantity and updates the corresponding product stock.

### Stock Exits
Allows users to register outgoing stock operations. The backend checks stock availability before processing an exit to prevent quantities from exceeding available stock.

### Alerts
Identifies products that have reached zero stock or whose quantities have fallen to or below their configured minimum stock level.

### Reports
Provides summaries of products, stock quantities, stock entries, stock exits, and product categories. Reports can be prepared for printing.

### Authentication
The application includes a login flow and protected routes. Unauthenticated users are redirected to the login page.

## ⚙️ Requirements
Before running the frontend, make sure you have installed:

Node.js compatible with Angular 20
npm
Angular CLI 20.3.6, if using a globally installed CLI

The Symfony backend and MySQL database must also be configured and running for features that require server data.

## 🚀 Installation

Clone the repository:

git clone <https://github.com/IanoIe/sistema-controlo-stocks.git>


Navigate to the frontend project directory:

cd <frontend>


Install the project dependencies:

npm install


Replace <https://github.com/IanoIe/sistema-controlo-stocks.git> and <frontend> with the actual repository URL and frontend directory name.

## 💻 Development Server

Start the Angular development server:

npx ng serve


Open your browser and navigate to:

http://localhost:4200/

The application automatically reloads when source files change.

## 🏗️ Production Build

To build the application for production, run:

npx ng build


The generated build artifacts are stored in the dist/ directory.

## 🧪 Testing

To run unit tests using the test runner configured in the project, execute:

npx ng test


The availability of unit and end-to-end testing depends on the testing tools configured in the project.

## 🔗 Backend Integration

The frontend communicates with the Symfony backend through dedicated Angular services, including services for:

- Products
- Stock entries
- Stock exits

The backend is responsible for authentication, data persistence, validation, and inventory-related business rules.
Make sure the backend API URL is configured correctly for your development environment.
Do not store passwords, private keys, JWT signing secrets, or other sensitive credentials in frontend source code.

## 👨‍💻 Development

To generate a new Angular component, run:
npx ng generate component component-name
For more information about Angular CLI commands, visit the official documentation:
Angular CLI Documentation

## 👤 Author
AC Marvel

Part of the Stock Management System personal project.
