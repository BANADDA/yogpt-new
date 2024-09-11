const LLMs_10B = [
  {
    id: "model-10b-01",
    name: "TextSynth",
    imageUrl: "./static/img/llm1.png",
    parameters: "10B",
    base: "Transformer",
    trainingDataSize: "100TB",
    mainApplication: "General Text Generation",
    uniqueFeatures: "Optimized for low-latency responses."
  },
  {
    id: "model-10b-02",
    name: "NarrativeGen",
    imageUrl: "./static/img/llm2.png",
    parameters: "10B",
    base: "BERT",
    trainingDataSize: "150TB",
    mainApplication: "Story Generation",
    uniqueFeatures: "Specialized in creating engaging narratives."
  },
  {
    id: "model-10b-03",
    name: "CodeCraft",
    imageUrl: "./static/img/llm3.png",
    parameters: "10B",
    base: "Transformer",
    trainingDataSize: "80TB",
    mainApplication: "Code Generation",
    uniqueFeatures: "Fine-tuned for multiple programming languages."
  },
  {
    id: "model-10b-04",
    name: "QueryMaster",
    imageUrl: "./static/img/llm4.png",
    parameters: "10B",
    base: "Transformer",
    trainingDataSize: "90TB",
    mainApplication: "Question Answering",
    uniqueFeatures: "Specializes in precise answers to complex queries."
  },
  {
    id: "model-10b-05",
    name: "LyricistAI",
    imageUrl: "./static/img/llm5.png",
    parameters: "10B",
    base: "Transformer",
    trainingDataSize: "50TB",
    mainApplication: "Song Lyric Generation",
    uniqueFeatures: "Generates catchy and creative song lyrics."
  },
  {
    id: "model-10b-06",
    name: "DataDive",
    imageUrl: "./static/img/llm6.png",
    parameters: "10B",
    base: "Transformer",
    trainingDataSize: "70TB",
    mainApplication: "Data Analysis",
    uniqueFeatures: "Performs deep data analysis and visualization."
  },
  {
    id: "model-10b-07",
    name: "ChatBuddy",
    imageUrl: "./static/img/llm7.png",
    parameters: "10B",
    base: "Transformer",
    trainingDataSize: "120TB",
    mainApplication: "Conversational AI",
    uniqueFeatures: "Highly engaging and natural conversational agent."
  },
  {
    id: "model-10b-08",
    name: "HealthGuide",
    imageUrl: "./static/img/llm8.png",
    parameters: "10B",
    base: "Transformer",
    trainingDataSize: "85TB",
    mainApplication: "Medical Assistance",
    uniqueFeatures: "Provides medical information and preliminary diagnoses."
  },
  {
    id: "model-10b-09",
    name: "EduTutor",
    imageUrl: "./static/img/llm9.png",
    parameters: "10B",
    base: "Transformer",
    trainingDataSize: "95TB",
    mainApplication: "Educational Content",
    uniqueFeatures: "Tailors learning content for individual needs."
  },
  {
    id: "model-10b-10",
    name: "FinanceForecaster",
    imageUrl: "./static/img/llm10.png",
    parameters: "10B",
    base: "Transformer",
    trainingDataSize: "110TB",
    mainApplication: "Financial Forecasting",
    uniqueFeatures: "Analyzes market trends for investment insights."
  } 
];

const LLMs_20B = [
  {
    id: "model-20b-01",
    name: "DeepComprehend",
    imageUrl: "./static/img/llm6.png",
    parameters: "20B",
    base: "Transformer-XL",
    trainingDataSize: "200TB",
    mainApplication: "Reading Comprehension",
    uniqueFeatures: "Advanced understanding of complex texts."
  },
  {
    id: "model-20b-02",
    name: "PolyglotAI",
    imageUrl: "https://via.placeholder.com/150",
    parameters: "20B",
    base: "GPT",
    trainingDataSize: "250TB",
    mainApplication: "Language Translation",
    uniqueFeatures: "High accuracy in less common languages."
  },
  {
    id: "model-20b-03",
    name: "FactFinder",
    imageUrl: "https://via.placeholder.com/150",
    parameters: "20B",
    base: "BERT",
    trainingDataSize: "180TB",
    mainApplication: "Information Retrieval",
    uniqueFeatures: "Integrates with databases for real-time data."
  },
  {
    id: "model-20b-04",
    name: "CreativeCanvas",
    imageUrl: "https://via.placeholder.com/150",
    parameters: "20B",
    base: "Transformer",
    trainingDataSize: "220TB",
    mainApplication: "Art and Design",
    uniqueFeatures: "Generates innovative designs and art concepts."
  },
  {
    id: "model-20b-05",
    name: "EcoPredictor",
    imageUrl: "https://via.placeholder.com/150",
    parameters: "20B",
    base: "Transformer",
    trainingDataSize: "190TB",
    mainApplication: "Environmental Forecasting",
    uniqueFeatures: "Predicts climate patterns and environmental changes."
  },
  {
    id: "model-20b-06",
    name: "LegalEagle",
    imageUrl: "https://via.placeholder.com/150",
    parameters: "20B",
    base: "Transformer",
    trainingDataSize: "210TB",
    mainApplication: "Legal Analysis",
    uniqueFeatures: "Provides insights into legal documents and cases."
  },
  {
    id: "model-20b-07",
    name: "ScriptSmith",
    imageUrl: "https://via.placeholder.com/150",
    parameters: "20B",
    base: "Transformer",
    trainingDataSize: "230TB",
    mainApplication: "Screenwriting",
    uniqueFeatures: "Crafts compelling scripts for movies and TV shows."
  },
  {
    id: "model-20b-08",
    name: "MindMeld",
    imageUrl: "https://via.placeholder.com/150",
    parameters: "20B",
    base: "Transformer",
    trainingDataSize: "240TB",
    mainApplication: "Psychological Support",
    uniqueFeatures: "Offers emotional support and counseling advice."
  },
  {
    id: "model-20b-09",
    name: "SportAnalytix",
    imageUrl: "https://via.placeholder.com/150",
    parameters: "20B",
    base: "Transformer",
    trainingDataSize: "260TB",
    mainApplication: "Sports Analysis",
    uniqueFeatures: "Provides detailed sports analytics and predictions."
  },
  {
    id: "model-20b-10",
    name: "InnovationEngine",
    imageUrl: "https://via.placeholder.com/150",
    parameters: "20B",
    base: "Transformer",
    trainingDataSize: "270TB",
    mainApplication: "Innovation and Research",
    uniqueFeatures: "Generates novel ideas and research directions."
  }  
];

const LLMs_30B = [
  {
    id: "model-30b-01",
    name: "LangMaster",
    imageUrl: "https://via.placeholder.com/150",
    parameters: " 30B",
    base: "GPT",
    trainingDataSize: "500TB",
    mainApplication: "Multilingual Translation",
    uniqueFeatures: "Supports over 100 languages with high accuracy."
  },
  {
    id: "model-30b-02",
    name: "EmotionIQ",
    imageUrl: "https://via.placeholder.com/150",
    parameters: " 30B",
    base: "Transformer",
    trainingDataSize: "400TB",
    mainApplication: "Emotion Detection",
    uniqueFeatures: "Advanced sentiment analysis capabilities."
  },
  {
    id: "model-30b-03",
    name: "QuantumMind",
    imageUrl: "https://via.placeholder.com/150",
    parameters: " 30B",
    base: "Transformer",
    trainingDataSize: "450TB",
    mainApplication: "Scientific Research",
    uniqueFeatures: "Optimized for processing complex scientific data."
  },
  {
    id: "model-30b-04",
    name: "BioInfer",
    imageUrl: "https://via.placeholder.com/150",
    parameters: " 30B",
    base: "Transformer",
    trainingDataSize: "550TB",
    mainApplication: "Biological Research",
    uniqueFeatures: "Accelerates genetic and molecular research."
  },
  {
    id: "model-30b-05",
    name: "CyberGuard",
    imageUrl: "https://via.placeholder.com/150",
    parameters: " 30B",
    base: "Transformer",
    trainingDataSize: "470TB",
    mainApplication: "Cybersecurity",
    uniqueFeatures: "Enhances threat detection and security protocols."
  },
  {
    id: "model-30b-06",
    name: "UrbanPlanner",
    imageUrl: "https://via.placeholder.com/150",
    parameters: " 30B",
    base: "Transformer",
    trainingDataSize: "480TB",
    mainApplication: "City Planning",
    uniqueFeatures: "Optimizes urban development and infrastructure planning."
  },
  {
    id: "model-30b-07",
    name: "AstroAid",
    imageUrl: "https://via.placeholder.com/150",
    parameters: " 30B",
    base: "Transformer",
    trainingDataSize: "460TB",
    mainApplication: "Astronomy and Space Exploration",
    uniqueFeatures: "Supports astronomical research and space mission planning."
  },
  {
    id: "model-30b-08",
    name: "AgriGrow",
    imageUrl: "https://via.placeholder.com/150",
    parameters: " 30B",
    base: "Transformer",
    trainingDataSize: "520TB",
    mainApplication: "Agriculture",
    uniqueFeatures: "Improves crop yields and farming techniques."
  },
  {
    id: "model-30b-09",
    name: "MetaThinker",
    imageUrl: "https://via.placeholder.com/150",
    parameters: " 30B",
    base: "Transformer",
    trainingDataSize: "500TB",
    mainApplication: "Philosophical Reasoning",
    uniqueFeatures: "Engages in deep philosophical discussions and analysis."
  },
  {
    id: "model-30b-10",
    name: "HistoryHive",
    imageUrl: "https://via.placeholder.com/150",
    parameters: " 30B",
    base: "Transformer",
    trainingDataSize: "490TB",
    mainApplication: "Historical Analysis",
    uniqueFeatures: "Provides insights into historical events and contexts."
  }  
];

export { LLMs_10B, LLMs_20B, LLMs_30B };
