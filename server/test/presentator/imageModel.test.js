const { expect } = require('chai');
const Image = require('../../presentator/imageModel');

describe('Image Model', () => {
    it('should be invalid if required fields are missing', (done) => {
        const image = new Image();

        image.validate((err) => {
            expect(err.errors.title).to.exist;
            expect(err.errors.url).to.exist;
            expect(err.errors.mimetype).to.exist;
            done();
        });
    });

    it('should be valid with all required fields', (done) => {
        const image = new Image({
            title: 'test.jpg',
            url: '/uploads/test.jpg',
            filename: 'test.jpg',
            mimetype: 'image/jpeg',
            size: 1024
        });

        image.validate((err) => {
            expect(err).to.be.null;
            done();
        });
    });
}); 