const testConfig = require('./testConfig');

// Before all tests
before(async function () {
    this.timeout(10000); // Increase timeout for DB connection
    await testConfig.connect();
});

// Before each test
beforeEach(async function () {
    await testConfig.clearDatabase();
});

// After all tests
after(async function () {
    await testConfig.closeDatabase();
}); 