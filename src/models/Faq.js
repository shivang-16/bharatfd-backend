import mongoose from "mongoose";

const faqSchema = new mongoose.Schema(
  {
    question: { type: String, required: true },
    answer: { type: String, required: true, maxLength: 100000 },
    translations: {
      question: { type: Map, of: String },
      answer: { type: Map, of: String },
    },
  },
  { timestamps: true },
);

faqSchema.methods.getTranslatedContent = function (lang) {
  if (
    !this.translations ||
    !this.translations.question ||
    !this.translations.answer
  ) {
    return {
      question: this.question,
      answer: this.answer,
      message: "No translations available",
    };
  }

  const translatedQuestion = this.translations.question.get(lang);
  const translatedAnswer = this.translations.answer.get(lang);

  if (!translatedQuestion || !translatedAnswer) {
    return {
      question: this.question,
      answer: this.answer,
      message: `Translation not available for language: ${lang}`,
    };
  }

  return {
    question: translatedQuestion,
    answer: translatedAnswer,
  };
};

const Faq = mongoose.model("Faq", faqSchema);

export default Faq;
