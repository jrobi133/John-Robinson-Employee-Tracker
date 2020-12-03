USE cm_systems;

INSERT INTO employee
    (first_name, last_name, roleTitle, manager_id)
VALUES
    ('John', 'Robinson', 1, null);

INSERT INTO [role]
    (title, salary, department_id)
VALUES
    ('lead software engineer', '95000', 1),
    ('software engineer', '80000', 2),
    ('salesman', '70000', 3),
    ('accountant', '50000', 4),
    ('hr', '30000', 5),
    ('operations manager', '45000', 6);

INSERT INTO department
    ([name])
VALUES
    ('engineering'),
    ('sales'),
    ("finance"),
    ('human resource'),
    ('operations department');