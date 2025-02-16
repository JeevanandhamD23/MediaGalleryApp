const { expect } = require('chai');
const sinon = require('sinon');
const imageService = require('../../lib/imageService');
const imageRepository = require('../../db/imageRepository');
const { AppError } = require('../../utils/errorHandler');
const { createMockFile } = require('../helpers/testHelper');

describe('ImageService', () => {
    afterEach(() => {
        sinon.restore();
    });

    describe('getAllImages', () => {
        it('should return all images', async () => {
            const mockImages = [
                { _id: '1', title: 'test1.jpg' },
                { _id: '2', title: 'test2.jpg' }
            ];
            sinon.stub(imageRepository, 'findAll').resolves(mockImages);

            const result = await imageService.getAllImages();
            expect(result).to.deep.equal(mockImages);
        });

        it('should handle database errors', async () => {
            sinon.stub(imageRepository, 'findAll').rejects(new Error('DB Error'));

            try {
                await imageService.getAllImages();
                expect.fail('Should have thrown an error');
            } catch (err) {
                expect(err).to.be.instanceOf(AppError);
                expect(err.statusCode).to.equal(500);
            }
        });
    });

    describe('createImage', () => {
        it('should create a new image', async () => {
            const mockFile = await createMockFile();
            const mockImage = { _id: '1', title: mockFile.filename };
            sinon.stub(imageRepository, 'create').resolves(mockImage);

            const result = await imageService.createImage(mockFile, {});
            expect(result).to.deep.equal(mockImage);
        });

        it('should handle missing file', async () => {
            try {
                await imageService.createImage(null, {});
                expect.fail('Should have thrown an error');
            } catch (err) {
                expect(err).to.be.instanceOf(AppError);
                expect(err.statusCode).to.equal(400);
            }
        });
    });
}); 