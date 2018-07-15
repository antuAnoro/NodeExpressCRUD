var employee = require('../../models/Employee');

var chai = require('chai');
var chaiHttp = require('chai-http');
chai.use(chaiHttp);
var should = chai.should();

var server = process.env.INT_LB_DNS || '127.0.0.1';

describe('Pruebas contra API REST del entorno integrado', function () {
	
	// Primero debemos limpiar la BBDD
	before('Borramos todos los empleados', function (done) {
		chai.request(server)
			.delete('/employees')
			.end((err, res) => {
				res.should.have.status(200);
				res.body.should.be.a('object');
				res.body.should.have.property('message').eql('Empleados borrados correctamente');
				done();
			});
	});
	
	// Probamos POST
	describe('Prueba /POST', () => {
		it('insertamos un empleado válido, debería ir OK', (done) => {
			employee1 = {
				name      : "Antonio Manteca",
				address   : "Calle Mortadelo 4",
				position  : "System Technician",
				salary    : "30000"
			}
			
			chai.request(server)
				.post('/employees')
				.send(employee1)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.should.have.property('message').eql('Empleado creado correctamente');
					idEmpleado = res.body._id;
					done();
				});
		});
		
		it('insertamos un empleado con salario inválido, debería fallar', (done) => {
			var employee2 = {
				name      : "Francisco Alegre",
				address   : "Calle Maravillas 43",
				position  : "System Technician",
				salary    : "Treinta mil"
			}
			
			chai.request(server)
				.post('/employees')
				.send(employee2)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.should.have.property('errors');
					res.body.errors.should.have.property('salary');
					res.body.errors.salary.should.have.property('kind').eql('Number');
					done();
				});
		});
	});	
	
	// Probamos GET
	describe('Prueba /GET', () => {
		it('obtenemos todos los empleados, debe devolver solo uno', (done) => {
			chai.request(server)
			.get('/employees')
			.end((err, res) => {
				res.should.have.status(200);
				res.body.should.be.a('array');
				res.body.length.should.be.eql(1);
				done();
			});
		});
		
		it('buscamos por nombre un empleado insertado anteriormente', (done) => {
			var nombreEmpleado = "Antonio%20Manteca";
			
			chai.request(server)
			.get('/employees/find/' + nombreEmpleado)
			.end((err, res) => {
				res.should.have.status(200);
				res.body.should.be.a('object');
				res.body.should.have.property('name').eql("Antonio Manteca");
				done();
			});
		});
		
		it('obtenemos un unico empleado, insertado anteriormente', (done) => {
			var nombreEmpleado = "Antonio%20Manteca";
			
			chai.request(server)
			.get('/employees/find/' + nombreEmpleado)
			.end((err, res) => {
				var idEmpleado = res.body._id;
				console.log("ID empleado " + idEmpleado);
				
				chai.request(server)
				.get('/employees/' + idEmpleado)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.should.have.property('_id').eql(idEmpleado);
					res.body.should.have.property('name');
					res.body.should.have.property('address');
					res.body.should.have.property('position');
					res.body.should.have.property('salary');
					done();
				});
			});
		});
	});
	
	// Probamos PUT
	describe('Prueba /PUT', () => {
		it('actualizamos el puesto y salario del empleado, debe cambiar su valor', (done) => {
			var nombreEmpleado = "Antonio%20Manteca";
			
			chai.request(server)
			.get('/employees/find/' + nombreEmpleado)
			.end((err, res) => {
				var idEmpleado = res.body._id;
				
				chai.request(server)
				.put('/employees/' + idEmpleado)
				.send({	name: "Antonio Manteca", address: "Calle Mortadelo 4", position  : "DevOps Manager", salary: "50000"})
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.should.have.property('message').eql('Empleado actualizado correctamente');
					res.body.employee.should.have.property('position').eql("DevOps Manager");
					res.body.employee.should.have.property('salary').eql(50000);
					done();
				});				
			});
		});
	});
	
	// Por ultimo probamos a borrar un unico empleado
	describe('Prueba /DELETE', () => {
		it('borramos el empleado, debe ir OK', (done) => {
			var nombreEmpleado = "Antonio%20Manteca";
			
			chai.request(server)
			.get('/employees/find/' + nombreEmpleado)
			.end((err, res) => {
				var idEmpleado = res.body._id;
				
				chai.request(server)
				.delete('/employees/' + idEmpleado)			
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.should.have.property('message').eql('Empleado borrado correctamente');
					done();
				});
			});
		});
	});
});
