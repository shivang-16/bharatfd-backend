import translate from "translate";

const translateText = async (text, targetLanguage) => {
  try {
    const traslation = await translate(text, targetLanguage);
    return traslation;
  } catch (error) {
    console.error("Translation Error:", error);
    return text; // Fallback to original text
  }
};

export default translateText;
