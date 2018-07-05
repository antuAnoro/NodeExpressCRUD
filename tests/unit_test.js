var expect = require('chai').expect;
var employeeController = require('../controllers/EmployeeController');

describe('checkEmployeeController()', function () {
  it('el controlador existe', function () {
    
    // 1. ARRANGE

    // 2. ACT
    var isEmployeeControllerPresent = employeeController.isControllerPresent();

    // 3. ASSERT
    expect(isEmployeeControllerPresent).to.be.equal(true);

  });
});
