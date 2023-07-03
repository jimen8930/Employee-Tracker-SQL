DROP DATABASE IF EXISTS employeedb;
CREATE DATABASE employeedb;
USE DATABASE employeedb;
CREATE TABLE department (
    id integer auto_increment primary key,
    name VARCHAR(30)
);

CREATE Table role (
    id integer auto_increment primary key,
    title VARCHAR(30) ,
    salary decimal,
    department_id integer
);

CREATE TABLE employee (
    id integer auto_increment primary key,
 first_name VARCHAR(30),
 last_name VARCHAR(30),
 role_id integer,
 manager_id integer
);


