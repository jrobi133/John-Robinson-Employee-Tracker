DROP DATABASE IF EXISTS cm_systems;
CREATE database cm_systems;

USE cm_systems;

CREATE TABLE employee
(
    id INT NOT NULL
    AUTO_INCREMENT,
    first_name VARCHAR
    (30) NOT NULL,
    last_name VARCHAR
    (30) NOT NULL,
    role_id INT NOT NULL,
    -- to hold reference to role employee has
    manager_id INT NULL,
    -- to hold reference to another employee that manages the employee being created. this field my be null if the employee has nomanager
    PRIMARY KEY
    (id)
);

    CREATE TABLE `role`
    (
        id INT NOT NULL
        AUTO_INCREMENT,
    title VARCHAR
    (30) NOT NULL,
    salary DECIMAL
    (10,4) NOT NULL,
    department_id INT NOT NULL,
    -- to hold reference to department "role" belongs to
    PRIMARY KEY
    (id)
);

    CREATE TABLE `department`
    (
            id INT NOT NULL
            AUTO_INCREMENT,
    `name` VARCHAR
    (30) NOT NULL,
    -- to hold department name
    PRIMARY KEY
    (id)
);