const { expect } = require('chai');
const sinon = require('sinon');
const errorHandler = require('../../middleware/errorMiddleware');
const { AppError } = require('../../utils/errorHandler');

describe('Error Middleware', () => {
    let req, res, next;

    beforeEach(() => {
        req = {};
        res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub()
        };
        next = sinon.spy();
    });

    it('should handle AppError correctly', () => {
        const error = new AppError('Test error', 400);
        errorHandler(error, req, res, next);

        expect(res.status.calledWith(400)).to.be.true;
        expect(res.json.calledWith({
            code: 400,
            message: 'Test error'
        })).to.be.true;
    });

    it('should handle validation errors', () => {
        const error = new Error('Validation failed');
        error.name = 'ValidationError';
        error.errors = { field: { message: 'Required' } };

        errorHandler(error, req, res, next);

        expect(res.status.calledWith(400)).to.be.true;
        expect(res.json.calledWith({
            code: 400,
            message: 'Required'
        })).to.be.true;
    });
}); 