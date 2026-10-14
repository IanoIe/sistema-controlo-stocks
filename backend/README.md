⚙️ Stock Management System — Backend

The backend of the Stock Management System is a REST API developed with Symfony and API Platform. It handles inventory data, stock operations, authentication, validation, and communication with the MySQL database.

🚧 Project Status: In Development
🎯 Overview

The backend provides the business logic and data management services required by the Stock Management System.

It exposes REST API endpoints that allow the Angular frontend to retrieve and manage products, register stock movements, access inventory information, and interact with other entities in the system.

🚀 Features
🔐 JWT-based authentication
👤 User authentication and identification
📦 Product management
🗂️ Product category management
📥 Stock entry registration
📤 Stock exit registration
⚠️ Stock quantity validation
🏢 Warehouse management
🔄 Stock transfer data model
👥 Supplier management
🔗 Product-supplier associations
📊 Inventory data for dashboards and reports
📋 Audit log entity for recording operations

Some features may require additional implementation or validation before being considered complete.

🛠️ Technologies
Backend
PHP
Symfony
API Platform
Doctrine ORM
Doctrine DBAL
LexikJWTAuthenticationBundle
Database
MySQL
Development Tools
Composer
Git
GitHub
Visual Studio Code
🏗️ Architecture

The backend follows a REST API architecture and communicates with the Angular frontend using HTTP requests and JSON.

Angular Frontend
       |
       | HTTP / JSON
       v
Symfony + API Platform
       |
       +---- Authentication (JWT)
       |
       +---- Application Logic
       |
       +---- Doctrine ORM
                  |
                  v
                MySQL


API Platform exposes the configured resources, while Doctrine ORM manages the interaction between PHP entities and the database.

Custom state processors handle business logic for stock entries and stock exits.

📁 Main Entities

The application uses Doctrine entities to represent the main elements of the inventory system.

Entity	Description
User	Represents application users.
Product	Stores product information, prices, quantities, minimum stock levels, and status.
Category	Organizes products into categories.
StockEntry	Records incoming stock operations.
StockExit	Records outgoing stock operations.
Supplier	Stores supplier information.
ProductSupplier	Associates products with suppliers and stores supplier-specific information.
Warehouse	Represents a warehouse and its location.
WarehouseStock	Represents stock associated with a warehouse.
StockTransfer	Represents a transfer between a source warehouse and a destination warehouse.
StockTransferItem	Stores the products and quantities included in a transfer.
AuditLog	Provides a data model for recording actions and previous or updated data.
📦 Product Management

The product resource supports the configured API operations for:

Retrieving product collections
Retrieving individual products
Creating products
Replacing existing products
Partially updating products
Deleting products

Product information includes the product name, unique product code, price, quantity, minimum stock level, active status, category, and timestamps.

The API also supports filtering products by category ID.

📥 Stock Entries

Stock entries represent incoming inventory operations.

The StockEntryProcessor applies the following business rules:

A product must be specified.
The quantity must be greater than zero.
The authenticated user is associated with the operation.
A stock entry date is assigned if one was not provided.
The product quantity is increased by the entered amount.
The product update timestamp is refreshed.

The stock entry and updated product are persisted through Doctrine ORM.

📤 Stock Exits

Stock exits represent outgoing inventory operations.

The StockExitProcessor validates the operation before updating inventory:

A product must be specified.
The requested quantity must be greater than zero.
The requested quantity cannot exceed the available stock.
The authenticated user is associated with the operation.
A stock exit date is assigned if one was not provided.
The product quantity is decreased by the requested amount.
The product update timestamp is refreshed.

If the available stock is insufficient, the API returns a client error instead of processing the exit.

🔐 Authentication and Security

The backend uses JWT authentication through LexikJWTAuthenticationBundle.

The configured login endpoint is:

POST /api/login_check


The login request uses the following JSON structure:

{
  "email": "user@example.com",
  "password": "your-password"
}


The credentials must belong to a valid user account. On successful authentication, the API returns a JWT token.

For protected endpoints, include the token in the HTTP request header:

Authorization: Bearer YOUR_JWT_TOKEN


The API firewall is configured to require full authentication for routes under /api, except for the explicitly public login endpoint.

Role-based authorization and additional access restrictions should be documented according to the permissions actually implemented in the application.

🗄️ Database Configuration

The application uses MySQL as its relational database.

Database connection settings are configured through the DATABASE_URL environment variable.

For local development, configure your own database connection in an appropriate local environment file.

Example format:

DATABASE_URL="mysql://DB_USER:DB_PASSWORD@127.0.0.1:3306/DB_NAME?serverVersion=8.0.32&charset=utf8mb4"


Replace the example values with your actual local database credentials and database name.

Never commit production credentials, private keys, or other sensitive information to the repository.

⚙️ Requirements

Before running the backend, make sure you have installed:

PHP in a version compatible with the project's Symfony dependencies
Composer
MySQL
Git

The PHP extensions required by the application must also be installed.

Check the project's composer.json file to identify the exact PHP version and required extensions.

🚀 Installation

Clone the repository:

git clone <repository-url>


Navigate to the backend directory:

cd <backend-directory>


Install the PHP dependencies:

composer install


Configure the required environment variables before starting the application.

Replace <repository-url> and <backend-directory> with the actual repository URL and backend directory name.

🗃️ Database Setup

Create the MySQL database and configure the DATABASE_URL variable.

If the project uses Doctrine migrations, apply the available migrations with:

php bin/console doctrine:migrations:migrate


Make sure the database server is running and the migrations are available before executing this command.

To inspect the current Doctrine schema mapping, you can run:

php bin/console doctrine:schema:validate

🔑 JWT Key Configuration

The JWT configuration uses the following environment variables:

JWT_SECRET_KEY=%kernel.project_dir%/config/jwt/private.pem
JWT_PUBLIC_KEY=%kernel.project_dir%/config/jwt/public.pem
JWT_PASSPHRASE=your-local-passphrase


The paths shown above reflect the expected configuration format. Keep the actual passphrase private and do not publish it in this README.

Generate or configure the JWT keys using the project's installed LexikJWTAuthenticationBundle commands and instructions.

Private keys and real passphrases must not be committed to a public repository.

💻 Running the Development Server

Start the Symfony development server:

symfony server:start


If Symfony CLI is not installed, you can use PHP's built-in development server:

php -S 127.0.0.1:8000 -t public


The API will then be available at the configured local server address.

Use the Symfony CLI or your web server configuration when you need HTTPS or a custom local domain.

🔎 API Documentation

API Platform automatically generates API documentation for the configured resources and operations.

Once the application is running, open the API documentation interface at the route configured by API Platform, commonly:

/api


Use the documentation interface to inspect available operations, request formats, response structures, and resource relations.

🔗 Frontend Integration

The backend provides the API consumed by the Angular frontend.

The frontend uses dedicated services to communicate with resources such as products, stock entries, and stock exits.

The backend is responsible for:

Validating incoming requests
Enforcing stock quantity rules
Identifying the authenticated user
Updating inventory data
Persisting changes to MySQL
Returning API responses

Make sure the API URL, CORS configuration, and authentication settings are compatible with the frontend environment.

🌐 Environment Configuration

The application uses environment variables for configuration, including:

APP_ENV
APP_SECRET
DATABASE_URL
DEFAULT_URI
CORS_ALLOW_ORIGIN
JWT_SECRET_KEY
JWT_PUBLIC_KEY
JWT_PASSPHRASE

Values must be configured appropriately for the local, testing, and production environments.

Do not publish real secrets or production credentials.

👨‍💻 Development

To clear the Symfony cache, run:

php bin/console cache:clear


To list the registered application routes, run:

php bin/console debug:router


To inspect configured services, run:

php bin/console debug:container


These commands can help with debugging and verifying the application configuration during development.

👤 Author

AC Marvel

Part of the Stock Management System personal project.
