async function categoriseWithLLM(receiptText, options = {}) {
  if (options.llmStatus === 503) {
    throw new Error("Azure OpenAI unavailable");
  }

  const text = receiptText.toLowerCase();

  if (text.includes("restaurant") || text.includes("food") || text.includes("meal")) {
    return { status: 200, category: "Meals", confidence: 0.8, source: "llm" };
  }

  if (text.includes("hotel") || text.includes("room")) {
    return { status: 200, category: "Lodging", confidence: 0.8, source: "llm" };
  }

  if (text.includes("taxi") || text.includes("bus") || text.includes("fuel")) {
    return { status: 200, category: "Travel", confidence: 0.75, source: "llm" };
  }

  if (text.includes("pen") || text.includes("paper") || text.includes("stationery")) {
    return { status: 200, category: "Office Supplies", confidence: 0.75, source: "llm" };
  }

  return { status: 200, category: "Other", confidence: 0.5, source: "llm" };
}

module.exports = { categoriseWithLLM };