var express = require('express');
var router = express.Router();
var employee = require("../controllers/EmployeeController.js");

/**
 * Devuelve todos los empleados
 *
 * @section empleados
 * @type get
 * @url /employee
 */
router.get('/', function(req, res) {
  employee.getAll(req, res);
});

/**
 * Devuelve un empleado
 *
 * @section empleados
 * @type get
 * @url /employees/:id
 */
router.get('/:id', function(req, res) {
  employee.get(req, res);
});

/**
 * Encuentra un empleado por nombre
 *
 * @section empleados
 * @type get
 * @url /employees/find/:nombre
 */
router.get('/find/:nombre', function(req, res) {
  employee.findByName(req, res);
});

/**
 * Crea un nuevo empleado
 *
 * @section empleados
 * @type post
 * @url /employees
 * @param {string} nif
 * @param {string} nombre
 * @param {string} direccion
 * @param {string} categoria
 * @param {string} salario
 */
router.post('/', function(req, res) {
  employee.save(req, res);
});

/**
 * Edita un empleado
 *
 * @section empleados
 * @type put
 * @url /employees/:id
 * @param {string} nif
 * @param {string} nombre
 * @param {string} direccion
 * @param {string} categoria
 * @param {string} salario
 */
router.put('/:id', function(req, res) {
  employee.edit(req, res);
});

/**
 * Borra todos los empleados
 *
 * @section empleados
 * @type delete
 * @url /employees
 */
router.delete('/', function(req, res) {
  employee.deleteAll(req, res);
});

/**
 * Borra un empleado
 *
 * @section empleados
 * @type delete
 * @url /employees/:id
 */
router.delete('/:id', function(req, res) {
  employee.delete(req, res);
});

module.exports = router;
