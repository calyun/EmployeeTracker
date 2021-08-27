USE squad_db;

INSERT INTO department(name)
VALUES ("HR"),
("SALES");

INSERT INTO role(title, salary, department_id)
VALUES ("HR Head", 60000, 1),
        ("HR Rep", 50000, 1),
        ("Sales Head", 80000, 2),
        ("Sales Rep", 70000, 2);

INSERT INTO employee (first_name, last_name)
VALUES ("Cal", "Younkin"),
        ("Chris", "Breen"),
        ("Adarash", "Mishra"),
        ("Cierra", "Marshall");