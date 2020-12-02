DROP DATABASE IF EXISTS cm_systems;
CREATE database cm_systems;

USE cm_systems;

CREATE TABLE employee
(
    id INT NOT NULL,
    first_name VARCHAR(30) NULL,
    last_name VARCHAR(30) NULL,
    role_id INT NULL,
    -- to hold reference to role employee has
    manager_id INT NULL,
    -- to hold reference to another employee that manages the employee being created. this field my be null if the employee has nomanager
    PRIMARY KEY (id)
);

CREATE TABLE [role]
(
    id INT NOT NULL,
    title VARCHAR(30) NULL,
    salary DECIMAL(10,4) NULL,
    department_id INT NULL,
    -- to hold reference to department "role" belongs to
    PRIMARY KEY (id)
);

CREATE TABLE department
(
    id INT NOT NULL,
    [name] VARCHAR(30) NULL,
    -- to hold department name
    PRIMARY KEY (id)
);