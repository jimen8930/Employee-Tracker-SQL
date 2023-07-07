-- This will drop any database that exist with that name, so any tables, data, or associated objects 
DROP DATABASE IF EXISTS employeedb;
-- Create the database for employees, create department table with id which is an integer by auto increment and includes a primary key
CREATE DATABASE employeedb;
USE DATABASE employeedb;
CREATE TABLE department (
    id integer auto_increment primary key,
    -- Name of the department with a limit of 30 characters 
    name VARCHAR(30)
);
-- Create the table for employee roles with salary and department id
CREATE Table role (
    id integer auto_increment primary key,
    title VARCHAR(30) ,
    salary decimal,
    department_id integer
);
-- Create a table for employee information such as first name, last name, role, and manager. 
CREATE TABLE employee (
    id integer auto_increment primary key,
 first_name VARCHAR(30),
 last_name VARCHAR(30),
 role_id integer,
 manager_id integer
);


