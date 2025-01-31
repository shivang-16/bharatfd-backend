import mongoose from "mongoose";
import request from "supertest";
import { expect } from "chai";
import app from "../app.js";
import FAQ from "../models/Faq.js";
import redisClient from "../services/redis.js";

describe("FAQ API Tests", function () {
  // Set timeout for all tests in this suite
  this.timeout(50000);

  before(async function () {
    await FAQ.deleteMany({});
    const cacheKeys = await redisClient.keys("faqs:*");
    if (cacheKeys.length > 0) {
      await redisClient.del(cacheKeys);
    }
  });

  after(async function () {
    this.timeout(5000);
    await mongoose.connection.close();
    await redisClient.quit();
  });

  describe("POST /api/faqs", () => {
    it("should create a new FAQ", async () => {
      const faqData = {
        question: "What is Jest?",
        answer: "Jest is a JavaScript testing framework.",
      };

      const response = await request(app)
        .post("/api/faqs")
        .send(faqData)
        .expect(201);

      expect(response.body.message).to.equal("FAQ created");
      expect(response.body.data.question).to.equal(faqData.question);
      expect(response.body.data.answer).to.equal(faqData.answer);
      expect(response.body.data.translations).to.exist;
    });

    it("should fail intentionally for demonstration of missing fields", async () => {
      const faqData = {
        question: "What is Jest?",
      };

      await request(app).post("/api/faqs").send(faqData).expect(400);
    });
  });

  describe("GET /api/faqs", () => {
    beforeEach(async () => {
      await FAQ.deleteMany({});
      // Create a test FAQ
      await FAQ.create({
        question: "Test Question",
        answer: "Test Answer",
        translations: {
          question: new Map([["hi", "टेस्ट प्रश्न"]]),
          answer: new Map([["hi", "टेस्ट उत्तर"]]),
        },
      });
    });

    it("should get FAQs in default language (en)", async () => {
      const response = await request(app).get("/api/faqs").expect(200);

      expect(Array.isArray(response.body)).to.be.true;
      expect(response.body[0].question).to.equal("Test Question");
      expect(response.body[0].answer).to.equal("Test Answer");
    });

    it("should get FAQs in specified language", async () => {
      const response = await request(app).get("/api/faqs?lang=hi").expect(200);

      expect(Array.isArray(response.body)).to.be.true;
      expect(response.body[0].question).to.equal("टेस्ट प्रश्न");
      expect(response.body[0].answer).to.equal("टेस्ट उत्तर");
    });

    it("should return cached results on subsequent requests", async () => {
      await request(app).get("/api/faqs").expect(200);

      const start = Date.now();
      await request(app).get("/api/faqs").expect(200);
      const end = Date.now();

      expect(end - start).to.be.lessThan(50);
    });
  });
});
