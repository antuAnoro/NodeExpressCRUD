// De momento hay que tocarlo manualmente
process.env.INT_LOAD_BALANCER = 'TFM-load-balancer-frontend-int-748900962.eu-west-2.elb.amazonaws.com';

var employee = require('../../models/Employee');

var chai = require('chai');
var chaiHttp = require('chai-http');
chai.use(chaiHttp);
var should = chai.should();

var server = process.env.INT_LOAD_BALANCER || '127.0.0.1';

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
			var employee1 = {
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
				.send(employee1)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.should.have.property('errors');
					res.body.errors.should.have.property('salary');
					// res.body.errors.pages.should.have.property('kind').eql('required');
					done();
				});
		});
	});
	
	
	// Probamos GET
	describe('Prueba /GET', () => {
		it('debería devolver todos los empleados', (done) => {
			chai.request(server)
			.get('/employees')
			.end((err, res) => {
				res.should.have.status(200);
				res.body.should.be.a('array');
				res.body.length.should.be.eql(1);
				done();
			});
		});
	});
});
