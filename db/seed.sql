USE cm_systems;

INSERT INTO employee
    (first_name, last_name, role_id, manager_id)
VALUES
    ('John', 'Robinson', 1, null),
    ('Bob', 'Jones', 6, null),
    ('Kevin', 'Foster', 5, 1),
    ('Keren', 'Kingston', 3, 6),
    ('Dick', 'Long', 6, null),
    ('Sam', 'Sung', 2, 1),
    ('Saad', 'Maan', 4, 6),
    ('ChrisP', 'Bacon', 2, 1),
    ('Paul', 'Stonewall', 3, 6);

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