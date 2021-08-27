const inquirer = require('inquirer');
const fs = require('fs');
const cTable = require('console.table');
const mysql = require('mysql2');
const { brotliDecompress } = require('zlib');
const { title } = require('process');

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        port:3306,
        password: 'shrimp',
        database: 'squad_db'
    }

)

db.connect(err => {
    if(err) throw err;
    menu();
})

function menu() {
    inquirer.prompt([
        {
            type: "list",
            message: "What would you like to do?",
            choices: ["View All Employees", "Add Employee", "Update Employee Role", "View All Roles", "Add Role", "View All Departments", "Add Department", "Quit"],
            name: "menu"
        }
    ]).then(response => {
        if (response.menu == "View All Employees") {
            viewEmployees();
            //need work
        }
        if (response.menu == "Add Employee") {
            addEmployee();
            //it work
        }
        if (response.menu == "Update Employee Role") {
            updateEmployee();
        }
        if (response.menu == "View All Roles") {
            viewRoles();
            //this work but maybe fix table names(?)
        }
        if (response.menu == "Add Role") {
            roleDepartment();
            //this work 
        }
        if (response.menu == "View All Departments") {
            viewDepartments();
            //this work
        }
        if (response.menu == "Add Department") {
            addDepartment();
            //this work
        }
        if (response.menu == "Quit") {
            console.log("Goodbye.")
            process.exit(1);
        }
    })
}

function viewEmployees() {
    db.query("SELECT * FROM employee", (err, data) => {
        if (err) throw err;
        console.table(data);
        menu();
    });
};

function addEmployee() {
    inquirer.prompt([
        {
            message: "Enter employee's first and last name:",
            name: "name"
        }
    ]).then(response => {
        let splitOn = " ";
        let results = response.name.split(splitOn);
        addEmployeeRole(results);
    })
}

function addEmployeeRole(employeeName) {
    db.query("SELECT * FROM role", (err, data) => {
        // console.log(data);
        if (err) throw err;
        rolesArr = ["No Role"];
        for (let i = 0; i < data.length; i++) {
            rolesArr.push(data[i].title);
        }
        // console.log(rolesArr);
        inquirer.prompt(
            {
                type: "list",
                message: "Select employee role:",
                choices: rolesArr,
                name: "eRole"
            }
        ).then(response => {
            // console.log(data);
            let roleObj = data.filter(query => query.title.includes(response.eRole))
            console.log(roleObj[0].id);

        addEmployeeManager(employeeName, roleObj[0].id);
    })
    })
}

function addEmployeeManager(eName, roleId) {
    // console.log(eName);
    // console.log(eRole);
    db.query("SELECT * from employee", (err, data) => {
        if (err) throw err;
        // console.log(data)
        managerArr = ["No Manager"];
        for (let i = 0; i <data.length; i++) {
            managerArr.push((data[i].first_name) + " " + (data[i].last_name))
        }
        // console.log(managerArr);
        inquirer.prompt(
            {
                type: "list",
                message: "Select Employee Manager:",
                choices: managerArr,
                name: "eManager"
            }
        ).then(response => {
            console.log(response.eManager);
            let splitOn = " ";
            let results = response.eManager.split(splitOn);
            console.log(results[1])
            let manObj = data.filter(query => query.last_name.includes(results[1]))
            console.log(manObj);
            let manId = manObj[0].id;
            console.log(eName, roleId, manId);
            const queryString = `
            INSERT INTO employee (first_name, last_name, role_id, manager_id)
            VALUES (?,?,?,?)`

            db.query(queryString, [eName[0], eName[1], roleId, manId], (err, data) => {
                if(err) throw err
                menu();
            })
        })
    })
}

function viewRoles() {
    db.query("SELECT role.id, title, salary, name FROM role JOIN department ON department_id= department.id", (err, data) => {
        if(err) throw err;

        console.table(data);
        menu();
    });
};

function roleDepartment() {
    let depNames = [];
    db.query("SELECT * FROM department", (err, data) => {
        if (err) throw err;
        depNames = data;
        // console.log(data);
        inquirer.prompt(
            {
                type: "list",
                message: "Pick",
                choices: depNames,
                name: "depName"
            }
        ).then(({depName}) => {
            let idObj = depNames.filter(query => query.name.includes(depName))
            console.log(idObj)
            // console.log(idObj[0].id)
            addANewRole(idObj[0].id)
        })
    })
}

function addANewRole(depId) {
    inquirer.prompt([
        {
            message: "What be that title yo?",
            name: "title"
        },
        {
            message: "cash money?",
            name: "salary"
        }
    ]).then(({title, salary}) => {
        const queryString = `
        INSERT INTO role (title, salary, department_id)
        VALUES (?,?,?)`

        db.query(queryString, [title, salary, depId], (err, data) => {
            if(err) throw err
            // console.log(data)
            menu()
        })
    })
}

function viewDepartments() {
    db.query("SELECT * FROM department", (err, data) => {
        if(err) throw err;

        console.table(data);
        menu();
    });
};

function addDepartment() {
    inquirer.prompt(
        {
            message: "Enter Department Name:",
            name: "newDepartment"
        }
    ).then(response => {
        let queryString = `
        INSERT INTO department(name)
        VALUES (?)`
    
        db.query(queryString, [response.newDepartment], (err, data) => {
            if(err) throw err;
            menu()
        })
    })

}
