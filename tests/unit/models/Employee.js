var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

var employee = require('../../../models/Employee');

describe('Pruebas contra BBDD utilizando el modelo', function () {
	
	// Primero debemos conectar a la BBDD
	before(function (done) {
		mongoose.connect(`mongodb://localhost/employee`)
		const db = mongoose.connection;
		db.on('error', console.error.bind(console, '    Error conectando a la BBDD'));
		db.once('open', function() {
		  console.log('    Conectados a la BBDD!');
		  done();
		});
	});
	
	// Ahora vamos con la primera prueba, inserciones
	describe('Comprobamos inserciones', function () {
		
		it('insertamos un empleado válido, debería ir OK', function (done) {

			// Preparamos
			var employee1 = new employee();
			
			employee1.nif        = '12345678A';
			employee1.nombre     = 'Antonio Manteca';
			employee1.direccion  = 'Calle Mortadelo 4';
			employee1.categoria  = 'System Technician';
			employee1.salario    = '30000';

			// Insertamos
			employee1.save(done);
		});	
		

		it('insertamos un empleado con salario inválido, debería fallar', function (done) {

			// Preparamos
			var employee2 = new employee();
			employee2.nif        = '87654321Z';
			employee2.nombre     = 'Francisco Alegre';
			employee2.direccion  = 'Calle Maravillas 43';
			employee2.categoria  = 'System Technician';
			employee2.salario    = 'Treinta mil';

			// Insertamos
			employee2.save(err => {
				if(err) {
					return done(); 
				} else {
					throw new Error(':( No ha generado error');
				}
			});
		});	
	
		it('insertamos un empleado con un nif ya existente, debería fallar', function (done) {

			// Preparamos
			var employee3 = new employee();
			employee3.nif        = '12345678A';
			employee3.nombre     = 'Felix Garcia';
			employee3.direccion  = 'Calle Serrano 61';
			employee3.categoria  = 'Director';
			employee3.salario    = '90000';

			// Insertamos
			employee3.save(err => {
				if(err) {
					return done(); 
				} else {
					throw new Error(':( No ha generado error');
				}
			});
		});
	});
	
	// Segunda prueba, búsquedas
	describe('Comprobamos busquedas', function () {
		
		it('buscamos un empleado existente, debería ir OK', function (done) {

			// Buscamos
			employee.findOne({nombre: 'Antonio Manteca'}, (err, nombre) => {
				if(err) {
					throw err;
				}
				if(nombre === null) {
					throw new Error(':( Sin datos');
				}
				done();
			});
		});	
		

		it('buscamos un empleado inexistente, debería fallar', function (done) {

			// Buscamos
			employee.findOne({nombre: 'Pato Lucas'}, (err, nombre) => {
				if(err) {
					throw err;
				}
				if(nombre === null) {
					return done(); 
				} else {
					throw new Error(':( Ha encontrado una ocurrencia');
				}
			});
		});		

	});

	// Última prueba, borrados
	describe('Comprobamos borrados', function () {
		
		it('borramos un empleado existente, debería ir OK', function (done) {

			// Preparamos
			var employee4 = employee.findOne({nombre: 'Antonio Manteca'}, (err, nombre, _id) => {
				if(err) {
					throw err;
				}
				
				if(nombre === null) {
					throw new Error(':( Sin datos');
				}
				
				employee.remove({_id: _id}, done);
			});
		});	
	

	});
	
	// Eliminamos la BBDD de prueba
	after(function(done){
		mongoose.connection.db.dropDatabase(function(){
			console.log('    Desconectados de la BBDD!');
			mongoose.connection.close(done);
		});
	});
});
