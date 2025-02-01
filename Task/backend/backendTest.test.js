const request = require('supertest');
const app = require('./app');
const mongoose = require('mongoose');
const Url = require('./model/urlModel');


let server;

beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect('mongodb://localhost:27017/testdb', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    }
    server = app.listen(5001); 
  });
  afterEach(async () => {
    await Url.deleteMany({ shortId: 'testshortid' });
  });
  afterAll(async () => {
    await mongoose.connection.close();
    await server.close(); 
  });




describe('URL Shortener API', () => {
  describe('POST /shorten', () => {
    it('should shorten a valid URL', async () => {
        const response = await request(app)
          .post('/shorten')
          .send({ url: 'https://www.example.com' })
          .expect(200);
      
        expect(response.body).toHaveProperty('shortenedUrl');
        expect(response.body.shortenedUrl).toMatch(/http:\/\/localhost:5000\/[a-zA-Z0-9]{7,}/);
      }, 10000);

    it('should return 400 for invalid URL', async () => {
      const response = await request(app)
        .post('/shorten')
        .send({ url: 'invalid-url' })
        .expect(400);

      expect(response.body).toHaveProperty('error', 'Invalid URL');
    });

    it('should return 400 if URL is missing', async () => {
      const response = await request(app)
        .post('/shorten')
        .send({})
        .expect(400);

      expect(response.body).toHaveProperty('error', 'URL is required');
    });
  });

  // Test GET /:shortId (URL redirect)
  describe('GET /:shortId', () => {
    let shortId;

    beforeAll(async () => {
      const url = new Url({
        originalUrl: 'https://www.example.com',
        shortId: 'testshortid',
      });
      await url.save();
      shortId = url.shortId;
    });

    it('should redirect to the original URL', async () => {
      const response = await request(app)
        .get(`/${shortId}`)
        .expect(302); 

      expect(response.header.location).toBe('https://www.example.com');
    });

    it('should return 404 for non-existent shortId', async () => {
      const response = await request(app)
        .get('/nonexistentid')
        .expect(404);

      expect(response.body).toHaveProperty('error', 'URL not found');
    });
  });

});
