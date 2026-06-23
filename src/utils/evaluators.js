// Quick simple spelling dictionary for simulation validation
const pseudoDictionary = new Set([
  "the", "and", "a", "to", "of", "in", "is", "that", "it", "for", "on", "with", "as", "at", "by", "an", "be", "this", "are", "from",
  "write", "email", "manager", "automotive", "company", "poor", "quality", "service", "facilities", "city", "sign", "anil", "very",
  "few", "centres", "complaints", "pending", "problems", "maintenance", "cost", "time", "delivery", "increase", "customer", "satisfaction",
  "dear", "sir", "madam", "sincerely", "regards", "respectfully", "thanks", "thank", "you", "i", "am", "writing", "regarding", "issue",
  "technology", "drives", "modern", "communication", "frameworks", "efficiently", "across", "continents", "transforms", "manual", "systems",
  "into", "complex", "smart", "machines", "today", "seamless", "automation", "underpins", "industrial", "operational", "productivity",
  "optimizes", "raw", "workflows", "globally", "cloud", "architecture", "shifts", "computing", "away", "physical", "servers", "virtual",
  "networks", "distributed", "strategy", "minimizes", "hardware", "infrastructure", "expenditures", "while", "enhancing", "system", "scaling",
  "capabilities", "dynamically"
]);

export function evaluateEmail(text, keywords, metadata) {
  if (!text || text.trim().length === 0) {
    return { grammar: 0, spelling: 0, keywordScore: 0, structureScore: 0, finalScore: 0, missingKeywords: keywords };
  }

  const normalizedText = text.toLowerCase();
  
  // 1. Keyword detection
  let foundKeywords = 0;
  const missingKeywords = [];
  keywords.forEach(kw => {
    if (normalizedText.includes(kw.toLowerCase())) {
      foundKeywords++;
    } else {
      missingKeywords.push(kw);
    }
  });
  const keywordScore = Math.round((foundKeywords / keywords.length) * 30);

  // 2. Structural checks (TCS NQT typical structural boundaries)
  let structureScore = 0;
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  
  const hasSubject = normalizedText.includes('subject:');
  const hasGreeting = normalizedText.includes('dear') || normalizedText.includes('hello') || normalizedText.includes('respected');
  const hasClosing = normalizedText.includes('sincerely') || normalizedText.includes('regards') || normalizedText.includes('thanks');
  const hasSignature = metadata.signature ? normalizedText.includes(metadata.signature.toLowerCase()) : lines.length > 3;
  const hasBody = lines.length >= (1 + (hasSubject?1:0) + (hasGreeting?1:0) + (hasClosing?1:0));

  if (hasSubject) structureScore += 2;
  if (hasGreeting) structureScore += 2;
  if (hasBody) structureScore += 2;
  if (hasClosing) structureScore += 2;
  if (hasSignature) structureScore += 2;

  // 3. Spelling Evaluator Simulation
  const words = text.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?\n]/g, "").split(/\s+/).filter(Boolean);
  let spellingErrors = 0;
  words.forEach(w => {
    const cleanW = w.toLowerCase();
    if (cleanW.length > 3 && !pseudoDictionary.has(cleanW) && !keywords.some(k => k.toLowerCase().includes(cleanW))) {
      // Basic rule to simulate penalty
      if (cleanW.length % 7 === 0) spellingErrors++; 
    }
  });
  const spellingScore = Math.max(0, 20 - (spellingErrors * 2));

  // 4. Grammar Evaluator Simulation (Sentence structure, initial capitalization)
  let grammarErrors = 0;
  const sentences = text.split(/[.!?]+/).map(s => s.trim()).filter(Boolean);
  sentences.forEach(s => {
    if (s.length > 0 && s[0] !== s[0].toUpperCase()) {
      grammarErrors++;
    }
  });
  if (words.length < 40) grammarErrors += 2; // Word limit penalty simulation
  const grammarScore = Math.max(0, 40 - (grammarErrors * 4));

  const finalScore = grammarScore + spellingScore + keywordScore + structureScore;

  return {
    grammar: grammarScore,
    spelling: spellingScore,
    keywordScore,
    structureScore,
    finalScore,
    missingKeywords
  };
}

export function evaluatePassage(original, user) {
  if (!user || user.trim().length === 0) {
    return { keywordScore: 0, similarityScore: 0, grammar: 0, spelling: 0, finalScore: 0, missingKeywords: [], similarityPct: 0 };
  }

  const cleanTokens = (t) => t.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?\n]/g, "").split(/\s+/).filter(Boolean);
  
  const origWords = cleanTokens(original);
  const userWords = cleanTokens(user);

  // Focus on significant content keywords (length > 4)
  const keyTokens = Array.from(new Set(origWords.filter(w => w.length > 4)));
  let matchedKeys = 0;
  const missingKeywords = [];

  keyTokens.forEach(token => {
    if (userWords.includes(token)) {
      matchedKeys++;
    } else {
      missingKeywords.push(token);
    }
  });

  const keywordScore = keyTokens.length ? Math.round((matchedKeys / keyTokens.length) * 40) : 40;

  // Compute standard Word-level Intersection (Content Similarity)
  const origSet = new Set(origWords);
  let intersectionCount = 0;
  userWords.forEach(w => {
    if (origSet.has(w)) intersectionCount++;
  });
  
  const similarityPct = origWords.length ? Math.min(100, Math.round((intersectionCount / origWords.length) * 100)) : 100;
  const similarityScore = Math.round((similarityPct / 100) * 40);

  // Basic Grammar/Spelling check for memory reproduction
  let errorCount = 0;
  userWords.forEach(w => {
    if (!origSet.has(w) && w.length > 3 && !pseudoDictionary.has(w)) {
      errorCount++;
    }
  });

  const spelling = Math.max(0, 10 - errorCount);
  const grammar = user.split(/[.!?]+/).filter(Boolean).some(s => s.trim()[0] !== s.trim()[0].toUpperCase()) ? 7 : 10;

  const finalScore = keywordScore + similarityScore + grammar + spelling;

  return {
    keywordScore,
    similarityScore,
    grammar,
    spelling,
    finalScore,
    missingKeywords,
    similarityPct
  };
}