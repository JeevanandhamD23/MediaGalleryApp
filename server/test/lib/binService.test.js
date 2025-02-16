const { expect } = require('chai');
const sinon = require('sinon');
const binService = require('../../lib/binService');
const Bin = require('../../presentator/binModel');
const Image = require('../../presentator/imageModel');
const Video = require('../../presentator/videoModel');
const { AppError } = require('../../utils/errorHandler');

describe('BinService', () => {
    afterEach(() => {
        sinon.restore();
    });

    describe('moveToTrash', () => {
        it('should move image to trash', async () => {
            const mockImage = {
                _id: '1',
                title: 'test.jpg',
                mimetype: 'image/jpeg',
                toObject: () => ({
                    title: 'test.jpg',
                    mimetype: 'image/jpeg'
                }),
                save: sinon.stub().resolves()
            };

            sinon.stub(Image, 'findById').resolves(mockImage);
            const saveBinStub = sinon.stub(Bin.prototype, 'save').resolves();

            await binService.moveToTrash('1', 'image');
            expect(saveBinStub.called).to.be.true;
        });

        it('should handle non-existent items', async () => {
            sinon.stub(Image, 'findById').resolves(null);

            try {
                await binService.moveToTrash('1', 'image');
                expect.fail('Should have thrown an error');
            } catch (err) {
                expect(err).to.be.instanceOf(AppError);
                expect(err.statusCode).to.equal(404);
                expect(err.message).to.equal('image not found');
            }
        });
    });
}); 