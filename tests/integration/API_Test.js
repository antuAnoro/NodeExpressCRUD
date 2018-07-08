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
	before(function (done) {
		chai.request(server)
			.delete('/employees')
			.end((err, res) => {
				res.should.have.status(200);
				res.body.should.be.a('object');
				res.body.should.have.property('message').eql('Empleados borrados correctamente');
				done();
			});
	});
	
	// Probamos GET
	describe('prueba /GET', () => {
		it('debería devolver todos los empleados', (done) => {
			chai.request(server)
			.get('/employees')
			.end((err, res) => {
				res.should.have.status(200);
				res.body.should.be.a('array');
				res.body.length.should.be.eql(0);
				done();
			});
		});
	});
});
