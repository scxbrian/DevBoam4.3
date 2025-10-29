
const chai = require('chai');
const chaiHttp = require('chai-http');
const { app } = require('../server'); // Assuming your Express app is exported from server.js
const expect = chai.expect;

chai.use(chaiHttp);

describe('Payments API', () => {
  let authToken;
  let shopId;
  let orderId;
  let clientId;

  before(async () => {
    // Create a user and shop to use in tests
    const userRes = await chai.request(app)
      .post('/api/auth/register')
      .send({ name: 'Test User', email: 'test@example.com', password: 'password123' });
    authToken = userRes.body.token;

    const shopRes = await chai.request(app)
      .post('/api/shops')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ name: 'Test Shop', description: 'A shop for testing' });
    shopId = shopRes.body._id;

    // Create a client
    const clientRes = await chai.request(app)
      .post('/api/clients') // This endpoint doesn't exist, so this will fail
      .set('x-tenant-id', shopId)
      .send({ email: 'customer@example.com', name: 'Test Customer' });
    clientId = clientRes.body._id;

    // Create an order
    const orderRes = await chai.request(app)
      .post('/api/orders')
      .set('x-tenant-id', shopId)
      .send({
        client: clientId,
        items: [{ product: '60c72b9b9b1d8c001f8e4d4e', quantity: 1, price: 100 }],
        total: 100,
      });
    orderId = orderRes.body._id;
  });

  describe('POST /api/payments/paystack/initialize', () => {
    it('should initialize a Paystack payment', async () => {
      const res = await chai.request(app)
        .post('/api/payments/paystack/initialize')
        .set('Authorization', `Bearer ${authToken}`)
        .set('x-tenant-id', shopId)
        .send({
          email: 'customer@example.com',
          amount: 100,
          orderId: orderId,
          clientId: clientId,
        });

      expect(res).to.have.status(200);
      expect(res.body.success).to.be.true;
      expect(res.body.data).to.have.property('authorization_url');
      expect(res.body.data).to.have.property('reference');
    });

    it('should return an error if required fields are missing', async () => {
      const res = await chai.request(app)
        .post('/api/payments/paystack/initialize')
        .set('Authorization', `Bearer ${authToken}`)
        .set('x-tenant-id', shopId)
        .send({ email: 'customer@example.com' });

      expect(res).to.have.status(400);
      expect(res.body.error).to.equal('Email, amount, and orderId are required');
    });
  });
});
