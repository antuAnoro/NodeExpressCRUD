var expect = require('chai').expect;
var employeeController = require('../controller/EmployeeController');

describe('checkEmployeeController()', function () {
  it('el controlador existe', function () {
    
    // 1. ARRANGE

    // 2. ACT
    var isEmployeeControllerPresent = employeeController.isEmployeeControllerPresent();

    // 3. ASSERT
    expect(isEmployeeControllerPresent).to.be.equal(true);

  });
});