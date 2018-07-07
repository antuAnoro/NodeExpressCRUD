var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

var employee = require('../../models/Employee');

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
			employee1.name      = 'Antonio Manteca';
			employee1.address   = 'Calle Mortadelo 4';
			employee1.position  = 'System Technician';
			employee1.salary    = '30000';

			// Insertamos
			employee1.save(done);
		});	
		

		it('insertamos un empleado con salario inválido, debería fallar', function (done) {

			// Preparamos
			var employee2 = new employee();
			employee2.name      = 'Francisco Alegre';
			employee2.address   = 'Calle Maravillas 43';
			employee2.position  = 'System Technician';
			employee2.salary    = 'Treinta mil';

			// Insertamos
			employee2.save(err => {
				if(err) {
					return done(); 
				} else {
					throw new Error(':( No ha generado error');
				}
			});
		});	
	
		it('insertamos un empleado con un nombre ya existente, debería fallar', function (done) {

			// Preparamos
			var employee3 = new employee();
			employee3.name      = 'Antonio Manteca';
			employee3.address   = 'Calle Serrano 61';
			employee3.position  = 'Director';
			employee3.salary    = '90000';

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
			employee.findOne({name: 'Antonio Manteca'}, (err, name) => {
				if(err) {
					throw err;
				}
				if(name === null) {
					throw new Error(':( Sin datos');
				}
				done();
			});
		});	
		

		it('buscamos un empleado inexistente, debería fallar', function (done) {

			// Buscamos
			employee.findOne({name: 'Pato Lucas'}, (err, name) => {
				if(err) {
					throw err;
				}
				if(name === null) {
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
			var employee4 = employee.findOne({name: 'Antonio Manteca'}, (err, name, _id) => {
				if(err) {
					throw err;
				}
				
				if(name === null) {
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