const path = require('path');
const fs = require('fs').promises;
const sinon = require('sinon');

const createMockFile = async () => {
    const testFilePath = path.join(__dirname, '../fixtures/test-image.jpg');
    const buffer = await fs.readFile(testFilePath);

    return {
        fieldname: 'photo',
        originalname: 'test-image.jpg',
        encoding: '7bit',
        mimetype: 'image/jpeg',
        buffer,
        size: buffer.length,
        filename: 'test-image.jpg'
    };
};

const mockRequest = (params = {}, body = {}, query = {}, file = null) => ({
    params,
    body,
    query,
    file
});

const mockResponse = () => {
    const res = {};
    res.status = sinon.stub().returns(res);
    res.json = sinon.stub().returns(res);
    return res;
};

module.exports = {
    createMockFile,
    mockRequest,
    mockResponse
}; 