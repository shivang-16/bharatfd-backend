import FAQ from "../models/Faq.js";
import translateText from "../services/translationService.js";
import redisClient from "../services/redis.js";
import languages from "../constants/lang.js";

export const createFAQ = async (req, res, next) => {
  try {
    const { question, answer } = req.body;

    const translations = {
      question: new Map(),
      answer: new Map(),
    };

    for (const lang of languages) {
      translations.question.set(lang, await translateText(question, lang));
      translations.answer.set(lang, await translateText(answer, lang));
    }

    const faq = new FAQ({ question, answer, translations });
    await faq.save();

    const cacheKeys = await redisClient.keys("faqs:*");
    if (cacheKeys.length > 0) {
      await redisClient.del(cacheKeys);
    }

    res.status(201).json({ message: "FAQ created", data: faq });
  } catch (error) {
    next(error);
  }
};

export const getFAQs = async (req, res, next) => {
  try {
    const { lang = "en" } = req.query;
    const cacheKey = `faqs:${lang}`;

    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      return res.status(200).json(JSON.parse(cachedData));
    }

    const faqs = await FAQ.find();
    const translatedFAQs = faqs.map((faq) => ({
      _id: faq._id,
      ...faq.getTranslatedContent(lang),
    }));

    await redisClient.set(cacheKey, JSON.stringify(translatedFAQs), {
      EX: 3600, // Cache for 1 hour
    });

    res.status(200).json(translatedFAQs);
  } catch (error) {
    next(error);
  }
};
