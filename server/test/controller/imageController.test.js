const { expect } = require('chai');
const sinon = require('sinon');
const { mockRequest, mockResponse } = require('../helpers/testHelper');
const imageService = require('../../lib/imageService');
const { imageRoutes } = require('../../routes/imageRoutes');
const { AppError } = require('../../utils/errorHandler');

describe('ImageController', () => {
    let req, res, next;

    beforeEach(() => {
        req = mockRequest();
        res = mockResponse();
        next = sinon.spy();
    });

    afterEach(() => {
        sinon.restore();
    });

    describe('getAllImages', () => {
        it('should return all images', async () => {
            const mockImages = [
                { _id: '1', title: 'test1.jpg' },
                { _id: '2', title: 'test2.jpg' }
            ];

            sinon.stub(imageService, 'getAllImages').resolves(mockImages);
            await imageRoutes.getAllImages(req, res);
            expect(res.json.calledWith(mockImages)).to.be.true;
        });

        it('should handle errors', async () => {
            const error = new AppError('Database error', 500);
            sinon.stub(imageService, 'getAllImages').rejects(error);
            await imageRoutes.getAllImages(req, res, next);
            expect(next.calledWith(error)).to.be.true;
        });
    });

    describe('uploadImage', () => {
        it('should upload image successfully', async () => {
            const mockFile = { filename: 'test.jpg' };
            const mockImage = { _id: '1', title: 'test.jpg' };

            req.file = mockFile;
            sinon.stub(imageService, 'createImage').resolves(mockImage);

            await imageController.uploadImage(req, res, next);

            expect(res.status.calledWith(201)).to.be.true;
            expect(res.json.calledWith(mockImage)).to.be.true;
        });

        it('should handle missing file', async () => {
            await imageController.uploadImage(req, res, next);

            expect(next.calledWith(sinon.match.instanceOf(AppError))).to.be.true;
            expect(res.json.notCalled).to.be.true;
        });
    });
}); 