var employee = require('../../models/Employee');

var chai = require('chai');
var chaiHttp = require('chai-http');
chai.use(chaiHttp);
var should = chai.should();

var server = process.env.INT_LB_DNS || '127.0.0.1';

console.log('Accediendo a aplicación por ' + server);

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
				nif        : "12345678A",
				nombre     : "Antonio Manteca",
				direccion  : "Calle Mortadelo 4",
				categoria  : "System Technician",
				salario    : "30000"
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
				nif        : "87654321Z"
				nombre     : "Francisco Alegre",
				direccion  : "Calle Maravillas 43",
				categoria  : "System Technician",
				salario    : "Treinta mil"
			}
			
			chai.request(server)
				.post('/employees')
				.send(employee2)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.should.have.property('errors');
					res.body.errors.should.have.property('salario');
					res.body.errors.salario.should.have.property('kind').eql('Number');
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
				res.body.should.have.property('nombre').eql("Antonio Manteca");
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
					res.body.should.have.property('nif');
					res.body.should.have.property('nombre');
					res.body.should.have.property('direccion');
					res.body.should.have.property('categoria');
					res.body.should.have.property('salario');
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
				.send({	nif: res.body.nif, nombre: res.body.nombre, direccion: res.body.direccion, categoria  : "DevOps Manager", salario: "50000"})
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.should.have.property('message').eql('Empleado actualizado correctamente');
					res.body.employee.should.have.property('categoria').eql("DevOps Manager");
					res.body.employee.should.have.property('salario').eql(50000);
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
