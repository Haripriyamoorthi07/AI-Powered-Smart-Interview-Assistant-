const { GoogleGenerativeAI } = require('@google/generative-ai');

// Check if API key is provided, if not warn and run in Mock Mode
const hasApiKey = !!process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'YOUR_GEMINI_API_KEY';
let genAI = null;

if (hasApiKey) {
  genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
} else {
  console.warn('====================================================================');
  console.warn('WARNING: GEMINI_API_KEY is not set. The application is running in AI MOCK MODE.');
  console.warn('Questions, evaluations, and resume feedback will be simulated using smart algorithms.');
  console.warn('Set GEMINI_API_KEY in backend/.env to connect to the live Gemini API.');
  console.warn('====================================================================');
}

// Helper to clean JSON markdown wrappers
const cleanJsonResponse = (text) => {
  try {
    const match = text.match(/\{[\s\S]*\}/);
    if (match) {
      return JSON.parse(match[0]);
    }
    const arrayMatch = text.match(/\[[\s\S]*\]/);
    if (arrayMatch) {
      return JSON.parse(arrayMatch[0]);
    }
    return JSON.parse(text);
  } catch (err) {
    console.error('Failed to parse Gemini JSON output. Raw text was:', text);
    throw new Error('Invalid JSON format returned by AI');
  }
};

/**
 * Generate a set of interview questions
 */
const generateQuestions = async (role, difficulty, type, count = 5) => {
  if (!hasApiKey || !genAI) {
    return getMockQuestions(role, difficulty, type, count);
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = `
      You are an expert interviewer. Generate exactly ${count} interview questions for a candidate applying for the role of ${role} at a ${difficulty} difficulty level.
      The interview type is ${type}.
      
      Return ONLY a JSON array of strings, where each string is a question. Do not include any explanations, introduction, or other text outside the JSON array.
      Example format:
      [
        "Question 1?",
        "Question 2?"
      ]
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return cleanJsonResponse(text);
  } catch (error) {
    console.error('Gemini API Error in generateQuestions:', error);
    console.log('Falling back to mock questions...');
    return getMockQuestions(role, difficulty, type, count);
  }
};

/**
 * Evaluate a single answer
 */
const evaluateAnswer = async (question, answer, role, difficulty, type) => {
  if (!hasApiKey || !genAI) {
    return getMockEvaluation(question, answer, role, difficulty, type);
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = `
      You are an expert interviewer. Evaluate this candidate's answer for the following question.
      
      Job Role: ${role}
      Difficulty: ${difficulty}
      Interview Type: ${type}
      
      Question: "${question}"
      Candidate's Answer: "${answer}"
      
      Perform a comprehensive analysis. Return ONLY a valid JSON object matching the following structure:
      {
        "score": 85, // Numeric score out of 100
        "strengths": "Provide a paragraph describing the key strengths of this answer.",
        "weaknesses": "Provide a paragraph describing the weaknesses, inaccuracies, or missing details.",
        "improvements": "Provide specific recommendations on how the candidate can improve this answer.",
        "sampleAnswer": "Write an exemplary, high-quality sample response for this question suitable for the role and level.",
        "confidence": 90, // Estimated numeric confidence score out of 100 based on word usage, phrasing, and response completeness
        "communication": "A short paragraph analyzing the communication style, tone, clarity, and articulation.",
        "technical": "A short paragraph analyzing the technical correctness and depth of knowledge shown."
      }
      
      Do not include any explanation or extra text outside of the JSON object.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return cleanJsonResponse(text);
  } catch (error) {
    console.error('Gemini API Error in evaluateAnswer:', error);
    console.log('Falling back to mock evaluation...');
    return getMockEvaluation(question, answer, role, difficulty, type);
  }
};

/**
 * Analyze a resume text
 */
const analyzeResume = async (resumeText) => {
  if (!hasApiKey || !genAI) {
    return getMockResumeAnalysis(resumeText);
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = `
      You are an expert ATS (Applicant Tracking System) parser and technical recruiter.
      Analyze the following text extracted from a resume:
      
      "${resumeText}"
      
      Perform a rigorous analysis. Identify key skills present, common industry skills/keywords that are missing for a modern tech role, give an overall score (0-100) and provide concrete recommendations for improvement.
      
      Return ONLY a valid JSON object matching this structure:
      {
        "skills": ["Skill 1", "Skill 2", "Skill 3"], // List up to 10 key skills identified in the resume
        "missingKeywords": ["Keyword 1", "Keyword 2"], // List up to 8 critical keywords or skills missing for modern software/data roles
        "score": 75, // Overall ATS score out of 100
        "suggestions": [
          "Provide concrete suggestion 1",
          "Provide concrete suggestion 2",
          "Provide concrete suggestion 3"
        ] // List of actionable suggestions
      }
      
      Do not include any text outside the JSON object.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return cleanJsonResponse(text);
  } catch (error) {
    console.error('Gemini API Error in analyzeResume:', error);
    console.log('Falling back to mock resume analysis...');
    return getMockResumeAnalysis(resumeText);
  }
};

// ==========================================
// MOCK FALLBACKS AND DATA GENERATORS
// ==========================================

const getMockQuestions = (role, difficulty, type, count) => {
  const db = {
    'Software Engineer': {
      'Technical Interview': [
        "Explain the difference between process and thread.",
        "How do you design a highly scalable RESTful API?",
        "What is the time complexity of searching in a Binary Search Tree, and how does it change if the tree is unbalanced?",
        "What is the difference between SQL and NoSQL databases, and when would you use which?",
        "Explain the concept of Dependency Injection and its benefits.",
        "What is a memory leak, and how do you prevent it in high-level programming languages?",
        "Explain how Git rebase works and how it differs from Git merge."
      ],
      'HR Interview': [
        "Tell me about yourself.",
        "Why do you want to join our company?",
        "Where do you see yourself in five years?",
        "How do you handle conflict in a team environment?",
        "Describe your ideal work environment.",
        "What are your greatest professional strengths and weaknesses?"
      ],
      'Behavioral Interview': [
        "Tell me about a time you faced a difficult technical challenge and how you overcame it.",
        "Describe a situation where you had to work with a difficult teammate.",
        "Tell me about a time you made a mistake at work and how you handled it.",
        "Describe a time you had to meet a tight deadline under pressure.",
        "Tell me about a time you took the lead on a project."
      ],
      'Coding Interview': [
        "Write a function to reverse a linked list.",
        "Given an array of integers, return indices of the two numbers such that they add up to a specific target.",
        "Implement a function to check if a binary tree is balanced.",
        "Write an algorithm to merge intervals that overlap.",
        "Explain how you would write a function to search for a word in a 2D grid of characters."
      ]
    },
    'Web Developer': {
      'Technical Interview': [
        "Explain the difference between client-side rendering (CSR) and server-side rendering (SSR).",
        "What is the CSS box model, and how does box-sizing: border-box affect it?",
        "Explain JavaScript closures and provide a common use case.",
        "What are web vitals, and how do you optimize a page's Loading Performance (LCP)?",
        "How do CORS (Cross-Origin Resource Sharing) headers protect web applications?",
        "What is the virtual DOM in React, and how does the reconciliation algorithm work?"
      ]
    }
  };

  // Fallback defaults
  const defaultQuestions = [
    `Can you explain your experience and background relative to the ${role} position?`,
    `What are the most challenging aspects of working at an ${difficulty} level in your experience?`,
    `How do you keep up to date with new trends and developments in ${role}?`,
    `Describe a project you worked on recently that represents your best work.`,
    `What is your approach to solving problems when you run into blocker details or system bugs?`,
    `How do you prioritize tasks when working on multiple projects with competing deadlines?`
  ];

  const roleQuestions = db[role] || db['Software Engineer'];
  const typeQuestions = roleQuestions[type] || defaultQuestions;

  // Shuffle and pick count
  const shuffled = [...typeQuestions].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

const getMockEvaluation = (question, answer, role, difficulty, type) => {
  const answerLength = answer ? answer.trim().length : 0;
  
  if (answerLength < 10) {
    return {
      score: 15,
      strengths: "The answer was very brief, which shows you were brief, but it does not convey enough context.",
      weaknesses: "Your response is too short to demonstrate capability. It lacks details, structure, and professional terminology.",
      improvements: "Try using the STAR method (Situation, Task, Action, Result) to explain your points in detail. Elaborate on your technical approach.",
      sampleAnswer: "A great answer would be: 'In my experience, when tackling this issue, I start by outlining the requirements... For example, in my last project, I implemented X which resulted in Y% improvement...'",
      confidence: 20,
      communication: "Extremely minimal communication. Ensure you write at least 2-3 complete sentences.",
      technical: "Inadequate detail to assess technical knowledge."
    };
  }

  // Calculate simulated score based on word count & keywords
  const words = answer.toLowerCase().split(/\s+/);
  const wordCount = words.length;
  
  // Basic score metrics
  let score = 50 + Math.min(wordCount * 0.4, 25);
  
  const keywords = ['structure', 'experience', 'react', 'node', 'scale', 'database', 'design', 'process', 'api', 'test', 'team', 'agile', 'git', 'deploy', 'performance', 'query', 'optimize', 'index', 'secure'];
  let matchedCount = 0;
  keywords.forEach(kw => {
    if (answer.toLowerCase().includes(kw)) {
      score += 1.5;
      matchedCount++;
    }
  });
  
  score = Math.min(Math.round(score), 98);
  const confidence = Math.min(Math.round(45 + (wordCount * 0.3) + (matchedCount * 2)), 95);

  return {
    score,
    strengths: `You demonstrated a practical understanding of the core concepts related to "${question.substring(0, 30)}...". Your answer is structured logically and you used relevant industry terms which helps build credibility.`,
    weaknesses: `The response could benefit from more specific technical metrics (e.g. percentages, database load metrics) or real-life project examples. You also glossed over potential edge cases or optimization hurdles.`,
    improvements: `To improve, explicitly state the technologies you used (e.g. MongoDB, Redis, AWS) and the exact metrics of success. Structure your answer using the STAR format: specify the Situation, explain the Task, describe your Actions, and detail the measurable Results.`,
    sampleAnswer: `Here is a strong response for reference: "In my previous project, we encountered a similar scenario. I approached this by first analyzing the system bottleneck using APM tools. We decided to implement redis caching layer for our read-heavy endpoints, which reduced SQL query load by 40% and improved latency from 300ms to 45ms. In addition, I set up unit tests using Jest to ensure no regressions occurred during deployment."`,
    confidence,
    communication: `Your communication style is ${wordCount > 50 ? 'detailed and professional' : 'concise, but clear'}. Your sentences are structured correctly and you communicate your thoughts with a good flow.`,
    technical: `Shows solid technical concepts. You successfully hit ${matchedCount} key industry concepts. Adding more depth about data structures, security precautions, and optimization strategies would elevate this to an advanced level.`
  };
};

const getMockResumeAnalysis = (resumeText) => {
  const text = resumeText.toLowerCase();
  
  const skillDb = [
    { name: 'JavaScript', keywords: ['javascript', 'js', 'es6'] },
    { name: 'React', keywords: ['react', 'reactjs', 'redux'] },
    { name: 'Node.js', keywords: ['node', 'nodejs', 'express'] },
    { name: 'MongoDB', keywords: ['mongo', 'mongodb', 'mongoose'] },
    { name: 'Python', keywords: ['python', 'django', 'flask'] },
    { name: 'SQL', keywords: ['sql', 'postgres', 'mysql', 'database'] },
    { name: 'Git', keywords: ['git', 'github', 'version control'] },
    { name: 'Docker', keywords: ['docker', 'container', 'kubernetes'] },
    { name: 'AWS', keywords: ['aws', 's3', 'ec2', 'cloud'] },
    { name: 'HTML & CSS', keywords: ['html', 'css', 'sass', 'tailwind'] },
    { name: 'TypeScript', keywords: ['typescript', 'ts'] },
    { name: 'Machine Learning', keywords: ['ml', 'machine learning', 'pytorch', 'tensorflow'] }
  ];

  const detectedSkills = [];
  const missingKeywords = [];

  skillDb.forEach(skill => {
    const hasSkill = skill.keywords.some(kw => text.includes(kw));
    if (hasSkill) {
      detectedSkills.push(skill.name);
    } else {
      missingKeywords.push(skill.name);
    }
  });

  // Ensure lists are not empty
  if (detectedSkills.length === 0) {
    detectedSkills.push('HTML', 'CSS', 'JavaScript (Basic)');
  }
  if (missingKeywords.length === 0) {
    missingKeywords.push('Docker', 'Kubernetes', 'CI/CD');
  }

  // Calculate score
  const score = Math.round(45 + (detectedSkills.length * 4.5));

  return {
    skills: detectedSkills.slice(0, 10),
    missingKeywords: missingKeywords.slice(0, 7),
    score: Math.min(score, 95),
    suggestions: [
      "Add quantifiable achievements to your project descriptions (e.g. 'boosted performance by 25%', 'reduced server latency by 50ms').",
      "Incorporate missing core technologies like " + missingKeywords.slice(0, 3).join(', ') + " if you have experience with them, to pass automated ATS filters.",
      "Reformat your header to ensure contact links (LinkedIn, GitHub) are easily clickable by recruiting managers.",
      "Dedicate a clear 'Technical Skills' section categorized by languages, frameworks, databases, and tools."
    ]
  };
};

module.exports = {
  generateQuestions,
  evaluateAnswer,
  analyzeResume
};
