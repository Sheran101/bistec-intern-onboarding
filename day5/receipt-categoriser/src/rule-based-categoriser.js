function categoriseWithRules(receiptText) {
  const text = receiptText.toLowerCase();

  if (text.includes("restaurant") || text.includes("food")) {
    return { status: 200, category: "Meals", confidence: 0.5, source: "rule-based" };
  }

  if (text.includes("taxi") || text.includes("bus") || text.includes("fuel")) {
    return { status: 200, category: "Travel", confidence: 0.5, source: "rule-based" };
  }

  if (text.includes("hotel")) {
    return { status: 200, category: "Lodging", confidence: 0.5, source: "rule-based" };
  }

  if (text.includes("pen") || text.includes("stationery")) {
    return { status: 200, category: "Office Supplies", confidence: 0.5, source: "rule-based" };
  }

  return { status: 200, category: "Other", confidence: 0.4, source: "rule-based" };
}

module.exports = { categoriseWithRules };