const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const mongoose = require('sinon-mongoose');
const app = require('../../app');
const Video = require('../../presentator/videoModel');
const expect = chai.expect;

chai.use(chaiHttp);

describe('Video Controller', () => {
    let VideoMock;

    beforeEach(() => {
        VideoMock = sinon.mock(Video);
    });

    afterEach(() => {
        VideoMock.restore();
    });

    describe('GET /api/videos', () => {
        it('should return all videos', (done) => {
            const expectedVideos = [
                { _id: '1', title: 'Test Video 1' },
                { _id: '2', title: 'Test Video 2' }
            ];

            VideoMock
                .expects('find')
                .chain('sort')
                .resolves(expectedVideos);

            chai.request(app)
                .get('/api/videos')
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body.videos).to.be.an('array');
                    expect(res.body.videos).to.have.lengthOf(2);
                    VideoMock.verify();
                    done();
                });
        });
    });
}); 