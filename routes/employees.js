var express = require('express');
var router = express.Router();
var employee = require("../controllers/EmployeeController.js");

// Get all employees
router.get('/', function(req, res) {
  employee.getAll(req, res);
});

// Get single employee by id
router.get('/:id', function(req, res) {
  employee.get(req, res);
});

// Save employee
router.post('/', function(req, res) {
  employee.save(req, res);
});

// Edit employee
router.put('/:id', function(req, res) {
  employee.edit(req, res);
});

// Delete all employees
router.delete('/', function(req, res) {
  employee.deleteAll(req, res);
});

// Delete employee
router.delete('/:id', function(req, res) {
  employee.delete(req, res);
});

module.exports = router;
