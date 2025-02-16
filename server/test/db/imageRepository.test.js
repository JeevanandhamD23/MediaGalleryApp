const { expect } = require('chai');
const sinon = require('sinon');
const Image = require('../../presentator/imageModel');
const imageRepository = require('../../db/imageRepository');

describe('ImageRepository', () => {
    afterEach(() => {
        sinon.restore();
    });

    describe('findAll', () => {
        it('should return all images', async () => {
            const mockImages = [
                { _id: '1', title: 'test1.jpg' },
                { _id: '2', title: 'test2.jpg' }
            ];

            const mockQuery = {
                sort: sinon.stub().returns({
                    skip: sinon.stub().returns({
                        limit: sinon.stub().returns({
                            exec: sinon.stub().resolves(mockImages)
                        })
                    })
                })
            };

            sinon.stub(Image, 'find').returns(mockQuery);

            const result = await imageRepository.findAll({});
            expect(result.images).to.deep.equal(mockImages);
        });
    });

    describe('create', () => {
        it('should create a new image', async () => {
            const mockImage = { _id: '1', title: 'test.jpg' };
            sinon.stub(Image.prototype, 'save').resolves(mockImage);

            const result = await imageRepository.create(mockImage);
            expect(result).to.deep.equal(mockImage);
        });
    });
}); 