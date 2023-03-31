const Router = require("express");
const router = Router.Router();

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();



// get the all employee data
router.get("/employee", async function (req,res) {

    try {

        const employees = await prisma.employee.findMany({
            include: {
                department: true,
            },
        });
        res.status(200).json(employees);

    } catch (error) {

        console.error(error);
        res.status(500).json({message: "An error occurred while reading employees"});

    }
    
});

// get the employee by id
router.get("/employee/:id", async function (req, res) {
    const id = parseInt(req.params.id);
    try {
    const employee = await prisma.employee.findUnique({
        where: {
            emp_id: id,
        },
        include: {
            department: true,
            hodOf: true
        },
    });
    res.status(200).json(employee);
    } catch (error) {

        console.error(error);
        res.status(500).json({message: `An error occurred while reading employee having id=${id}`});

    }
    
});


// get the all department data
router.get("/department", async function (req, res) {
    try {

        const depts = await prisma.department.findMany({
            include: {
                employees: true,
            }
        });
        res.json(depts);

    } catch (error) {

        console.error(error);
        res.status(500).json({message: "An error occurred while reading department"});

    }
});


// get the department by id
router.get("/department/:id", async function (req, res) {
    const id = parseInt(req.params.id);
    try {
    const dept = await prisma.department.findUnique({
        where: {
            department_id: id,
        },
        include: {
            employees: true,
            hod: true
        },
    });
    if (!dept) {
        
        res.status(404).json({ message: `Department with ID ${id} not found` });

    }else {
        
        res.status(200).json(dept);
    }
    } catch (error) {

        console.error(error);
        res.status(400).json({message: `An error occurred while reading department data having id=${id}`});

    }
    
});



// create the empoloyee
router.post("/employee", async function (req, res) {
    try {
        const {emp_name, emp_email, dept_id} = req.body;
        const employee = await prisma.employee.create({
            data: {
                emp_name: emp_name,
                emp_email: emp_email,
                department: { 
                    connect: { department_id: dept_id} 
                },
            },
        });
        res.status(201).send("Employee successfully created!!");
    } catch (error) {

        if (error.code === "InvalidInputError") {

            res.status(400).json({message: "Invalid Input" + error.message});

        } else {

            console.error(error);
            res.status(500).json({message: "An error occurred while creating the employee"});

        }
    }
});



// create the department
router.post("/department", async function (req, res) {
    try {
        const {dept_name, description, hod_id} = req.body;
        const dept = await prisma.department.create({
            data: {
                dept_name: dept_name,
                description: description,
                hod_id: hod_id
            },
        });
        res.status(201).send("The department is successfully created");
    } catch (error) {

        if (error.code === "InvalidInputErrro") {

            res.status(400).json({message: "Invalid Input: " + error.message});

        }else {

            console.error(error);
            res.status(500).json({message: "An error occurred while creating the department"});

        }
    }
});


// update the employee
router.put("/employee/:id", async function (req, res) {
    const id = parseInt(req.params.id);
    
    try {
        const { emp_name, emp_email, dept_id } = req.body;
        const employee = await prisma.employee.findUnique({     // fetching the current employee details to const employee
            where: { emp_id: id },
            include: { department: {
                include: {
                    hod: true
                }
            }}
        });
        
        if (!employee) {
            res.status(404).send("Employee not found");
            return;
        }

        const prevDeptId = employee.department.department_id;   // storing the current dept id
        
        if (prevDeptId !== dept_id && employee.department.hod.emp_id === id) {     // checking if prev !== given && employee is the head of the curr dept
            console.log("inside the if statement")
            await prisma.department.update({
                where: { department_id: prevDeptId },
                data: { hod_id: null }      // making the hod_id to null of the current department
            });
        }

        await prisma.employee.update({
            where: { emp_id: id },
            data: {
                emp_name: emp_name,
                emp_email: emp_email,
                dept_id: dept_id,
                hodOf: undefined    // hod or not, just simply remove the hodOf desig. off the employee when changed to the department
            }
        });
        
        res.status(200).send("The employee is successfully updated!!");

    
    } catch (error) {
        if (error.code === "InvalidInputErrro") {
            res.status(400).json({ message: "Invalid Input: " + error.message });
        } else {
            console.error(error);
            res.status(500).json({ message: "An error occurred while updating the employee" });
        }
    }
});


// update the department
router.put("/department/:id", async function (req, res) {
    const id = parseInt(req.params.id);
    try {
        const {dept_name, description, hod_id} = req.body;
        const dept = await prisma.department.update({
            where: {
                department_id: id,
            },
            data: {
                dept_name: dept_name,
                description: description,
                hod_id: hod_id,
            }
        });
        res.status(200).send("The department is successfully updated!!");
    } catch (error) {

        if (error.code === "InvalidInputErrro") {

            res.status(400).json({message: "Invalid Input: " + error.message});

        }else {

            console.error(error);
            res.status(500).json({message: "An error occurred while updating the department having id=${id}"});

        }
    }
});


// delete the employee data by id
router.delete("/employee/:id", async function (req, res){
    const id = parseInt(req.params.id);
    try {
        await prisma.employee.delete({
            where: {
                emp_id: id,
            }
        });
        res.send("The employee is successfully deleted!!");
    } catch (error) {

        if (error.code === "InvalidInputErrro") {

            res.status(400).json({message: "Invalid Input: " + error.message});

        }else {

            console.error(error);
            res.status(500).json({message: "An error occurred while deleting the employee"});

        }
    }
});


// delete the department data by id
router.delete("/department/:id", async function (req, res) {
    const id = parseInt(req.params.id);
    try {
        await prisma.department.delete({
            where: {
                department_id: id,
            }
        });
        res.send("The Department is successfully deleted!!")
    } catch (error) {

        if (error.code === "InvalidInputErrro") {

            res.status(400).json({message: "Invalid Input: " + error.message});

        }else {

            console.error(error);
            res.status(500).json({message: "An error occurred while creating the department"});

        }
    }
});


module.exports = router;
