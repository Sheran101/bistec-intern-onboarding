const { categoriseWithLLM } = require("./llm-categoriser");
const { categoriseWithRules } = require("./rule-based-categoriser");

async function categorise(receiptText, options = {}) {
  if (!receiptText || receiptText.trim() === "") {
    return {
      status: 200,
      category: "Other",
      confidence: 0.3,
      source: "rule-based",
      needs_review: true,
      message: "Receipt could not be parsed clearly."
    };
  }

  if (options.fileSizeMB && options.fileSizeMB > 10) {
    return {
      status: 413,
      error: "Receipt image is too large. Maximum allowed size is 10 MB."
    };
  }

  try {
    const result = await categoriseWithLLM(receiptText, options);

    return {
      ...result,
      needs_review: result.confidence < 0.6
    };
  } catch (error) {
    const fallback = categoriseWithRules(receiptText);

    return {
      ...fallback,
      needs_review: fallback.confidence < 0.6
    };
  }
}

module.exports = { categorise };