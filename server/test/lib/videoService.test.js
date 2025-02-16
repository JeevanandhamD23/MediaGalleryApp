const { expect } = require('chai');
const sinon = require('sinon');
const videoService = require('../../lib/videoService');
const videoRepository = require('../../db/videoRepository');
const { AppError } = require('../../utils/errorHandler');

describe('VideoService', () => {
    afterEach(() => {
        sinon.restore();
    });

    describe('getAllVideos', () => {
        it('should return all videos', async () => {
            const mockVideos = [
                { _id: '1', title: 'test1.mp4' },
                { _id: '2', title: 'test2.mp4' }
            ];

            sinon.stub(videoRepository, 'findAll').resolves({
                videos: mockVideos,
                total: 2,
                page: 1,
                pages: 1
            });

            const result = await videoService.getAllVideos({});
            expect(result.videos).to.deep.equal(mockVideos);
        });

        it('should handle database errors', async () => {
            sinon.stub(videoRepository, 'findAll').rejects(new AppError('DB Error', 500));

            try {
                await videoService.getAllVideos({});
                expect.fail('Should have thrown an error');
            } catch (err) {
                expect(err).to.be.instanceOf(AppError);
                expect(err.statusCode).to.equal(500);
            }
        });
    });
}); 