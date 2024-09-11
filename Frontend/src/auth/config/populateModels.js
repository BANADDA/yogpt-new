import { initializeApp } from 'firebase/app';
import { collection, doc, getFirestore, writeBatch } from 'firebase/firestore';
import { firebaseConfig } from './firebase-config.js'; // Ensure the correct path and file extension

const models = [
  {
    name: 'GPT2',
    id: 'openai-community/gpt2',
    description: 'Text Generation',
    lastUsed: null,
    usageCount: 0
  },
  {
    name: 'GPT-2 Medium',
    id: 'openai-community/gpt2-medium',
    description: 'Text Generation',
    lastUsed: null,
    usageCount: 0
  },
  {
    name: 'GPT-2 Large',
    id: 'openai-community/gpt2-large',
    description: 'Text Generation',
    lastUsed: null,
    usageCount: 0
  },
  {
    name: 'LLaMA-2 7B',
    id: 'openlm-research/open_llama_7b_v2',
    description: 'Text Generation',
    lastUsed: null,
    usageCount: 0
  },
  {
    name: 'LLaMA-2 13B',
    id: 'openlm-research/open_llama_13b',
    description: 'Text Generation',
    lastUsed: null,
    usageCount: 0
  },
  {
    name: 'NousResearch llama2',
    id: 'NousResearch/Llama-2-7b-chat-hf',
    description: 'Text Generation',
    lastUsed: null,
    usageCount: 0
  },
  {
    name: 'OpenELM 270M',
    id: 'apple/OpenELM-270M',
    description: 'Text Generation',
    lastUsed: null,
    usageCount: 0
  },
  {
    name: 'OpenELM 450M',
    id: 'apple/OpenELM-450M',
    description: 'Text Generation',
    lastUsed: null,
    usageCount: 0
  },
  {
    name: 'OpenELM 3B',
    id: 'apple/OpenELM-3B',
    description: 'Text Generation',
    lastUsed: null,
    usageCount: 0
  },
];

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const sanitizeName = (name) => name.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();

const populateModels = async () => {
  const batch = writeBatch(db);
  const modelsCollection = collection(db, 'models');
  
  models.forEach((model) => {
    const sanitizedModelName = sanitizeName(model.name);
    const modelRef = doc(modelsCollection, sanitizedModelName);
    batch.set(modelRef, model);
  });

  await batch.commit();
  console.log('Models have been added to Firestore.');
};

populateModels().catch((error) => {
  console.error('Error populating models:', error);
});
