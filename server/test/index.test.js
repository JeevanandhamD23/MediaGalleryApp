const { expect } = require('chai');
const testConfig = require('./config/testConfig');

before(async function () {
    this.timeout(10000);
    await testConfig.connect();
});

beforeEach(async function () {
    await testConfig.clearDatabase();
});

after(async function () {
    await testConfig.closeDatabase();
});

// Import all test files
describe('Server Test Suite', function () {
    // Service tests
    require('./lib/imageService.test.js');
    require('./lib/videoService.test.js');
    require('./lib/binService.test.js');

    // Controller tests
    require('./controller/imageController.test.js');

    // Repository tests
    require('./db/imageRepository.test.js');

    // Model tests
    require('./presentator/imageModel.test.js');

    // Middleware tests
    require('./middleware/errorMiddleware.test.js');
}); 