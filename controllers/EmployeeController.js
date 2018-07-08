var mongoose = require("mongoose");
var Employee = require("../models/Employee");

var employeeController = {};

// Show list of employees
employeeController.getAll = function(req, res) {
  Employee.find({}).exec(function (err, employees) {
    if (err) {
      console.log("Error:", err);
	  res.send(err);
    }
    else {
      res.json(employees);
    }
  });
};

// Show employee by id
employeeController.get = function(req, res) {
  Employee.findOne({_id: req.params.id}).exec(function (err, employee) {
    if (err) {
      console.log("Error:", err);
	  res.send(err);
    }
    else {
      res.json(employee);
    }
  });
};

// Create new employee
employeeController.save = function(req, res) {
  var employee = new Employee(req.body);

  employee.save(function(err, employee) {
    if(err) {
      console.log("Error:", err);
      res.send(err);
    } else {
      console.log("Empleado creado correctamente.");
      res.json({message: "Empleado creado correctamente", employee });
    }
  });
};

// Update an employee
employeeController.edit = function(req, res) {
  Employee.findByIdAndUpdate(req.params.id, { $set: { name: req.body.name, address: req.body.address, position: req.body.position, salary: req.body.salary }}, { new: true }, function (err, employee) {
    if (err) {
      console.log("Error:", err);
      res.send(err);
    } else {
      console.log("Empleado actualizado correctamente.");
      res.json({message: "Empleado actualizado correctamente", employee });
	}
  });
};

// Delete all employees
employeeController.delete = function(req, res) {
  Employee.remove({}, function(err, result) {
  if(err) {
      console.log("Error:", err);
      res.send(err);
    }
    else {
      console.log("Empleados borrados correctamente.");
      res.json({message: "Empleados borrados correctamente", result});
    }
  });
};

// Delete an employee
employeeController.delete = function(req, res) {
  Employee.remove({_id: req.params.id}, function(err, result) {
    if(err) {
      console.log("Error:", err);
      res.send(err);
    }
    else {
      console.log("Empleado borrado correctamente.");
      res.json({message: "Empleado borrado correctamente", result });
    }
  });
};

module.exports = employeeController;
