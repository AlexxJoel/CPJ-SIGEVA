-- PostgreSQL

-- Crear el esquema
-- CREATE SCHEMA IF NOT EXISTS sigeva;
-- Usaremos el esquema por default: public

-- Crear la tabla roles
CREATE TABLE IF NOT EXISTS roles (
  id SERIAL PRIMARY KEY,
  name VARCHAR(10) UNIQUE NOT NULL,
  description VARCHAR(100)
);

-- Crear la tabla categories
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL,
  description VARCHAR(100)
);

-- Crear la tabla transaction_types
CREATE TABLE IF NOT EXISTS transaction_types (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL,
  description VARCHAR(100)
);

-- Crear la tabla people
CREATE TABLE IF NOT EXISTS people (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  surname VARCHAR(100) NOT NULL,
  lastname VARCHAR(100)
);

-- Crear la tabla staff
CREATE TABLE IF NOT EXISTS staff (
  id SERIAL PRIMARY KEY,
  birthday DATE NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  status BOOLEAN NOT NULL DEFAULT TRUE,
  is_manager BOOLEAN NOT NULL DEFAULT FALSE,
  people_id INTEGER NOT NULL,
  FOREIGN KEY (people_id) REFERENCES people(id)
);

-- Crear la tabla suppliers
CREATE TABLE IF NOT EXISTS suppliers (
  id SERIAL PRIMARY KEY,
  contact VARCHAR(150) NOT NULL,
  people_id INTEGER NOT NULL,
  FOREIGN KEY (people_id) REFERENCES people(id)
);

-- Crear la tabla clients
CREATE TABLE IF NOT EXISTS clients (
  id SERIAL PRIMARY KEY,
  email VARCHAR(150) UNIQUE NOT NULL,
  phone_number VARCHAR(45) NOT NULL,
  people_id INTEGER NOT NULL,
  FOREIGN KEY (people_id) REFERENCES people(id)
);

-- Crear la tabla users
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password TEXT NOT NULL,
  status BOOLEAN NOT NULL DEFAULT TRUE,
  staff_id INTEGER NOT NULL,
  roles_id INTEGER NOT NULL,
  FOREIGN KEY (staff_id) REFERENCES staff(id),
  FOREIGN KEY (roles_id) REFERENCES roles(id)
);

-- Crear la tabla products
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL,
  description VARCHAR(100),
  quantity INTEGER NOT NULL DEFAULT 0,
  unit_price DOUBLE PRECISION NOT NULL DEFAULT 0,
  status BOOLEAN NOT NULL DEFAULT TRUE,
  categories_id INTEGER NOT NULL,
  FOREIGN KEY (categories_id) REFERENCES categories(id)
);

-- Crear la tabla transactions
CREATE TABLE IF NOT EXISTS transactions (
  id SERIAL PRIMARY KEY,
  creation_date TIMESTAMPTZ NOT NULL,
  payment_date TIMESTAMPTZ,
  total_amount DOUBLE PRECISION NOT NULL DEFAULT 0,
  transaction_types_id INTEGER NOT NULL,
  people_id INTEGER NOT NULL,
  FOREIGN KEY (transaction_types_id) REFERENCES transaction_types(id),
  FOREIGN KEY (people_id) REFERENCES people(id)
);

-- Crear la tabla transactions_has_products
CREATE TABLE IF NOT EXISTS transactions_has_products (
  transactions_id INTEGER NOT NULL,
  products_id INTEGER NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (transactions_id, products_id),
  FOREIGN KEY (transactions_id) REFERENCES transactions(id),
  FOREIGN KEY (products_id) REFERENCES products(id)
);