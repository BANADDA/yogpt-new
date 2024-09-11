import { initializeApp } from 'firebase/app';
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, getFirestore, query, setDoc, updateDoc, where } from 'firebase/firestore';
import { getStorage, ref, uploadBytes } from 'firebase/storage';

const sanitizeId = (id) => id.replace(/\//g, '|');

const firebaseConfig = {
    apiKey: "AIzaSyD1w5Q5sN1rrwOq8lHPtmVg_pqalwYrLEE",
    authDomain: "echo-fe663.firebaseapp.com",
    projectId: "echo-fe663",
    storageBucket: "echo-fe663.appspot.com",
    messagingSenderId: "242213821849",
    appId: "1:242213821849:web:9061001fa288c50249c708",
    measurementId: "G-22D29K0Y6C"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const provider = new GoogleAuthProvider();
const auth = getAuth(app);
const db = getFirestore(app);
const firestore = getFirestore(app);
const storage = getStorage(app);  // Initialize storage

// Google Sign-In function
const signInWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, provider);
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        console.log('User signed in: ', user);
        return user;
    } catch (error) {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        console.error('Error signing in with Google: ', error);
        throw error;
    }
};

// Save chat history
const saveChatHistory = async (userId, id, chatHistory) => {
    const sanitizedId = sanitizeId(id);
    const chatRef = doc(db, 'chatHistories', `${userId}_${sanitizedId}`);
    console.log(`Saving chat histories for userId: ${userId}, modelId: ${id}`);
    console.log('Chat histories to save:', chatHistory);
    try {
        await setDoc(chatRef, { chatHistories: chatHistory }, { merge: true });
        console.log('Chat histories saved successfully.');
    } catch (error) {
        console.error('Error saving chat histories:', error);
    }
};

// Retrieve chat history
const getChatHistory = async (userId, id) => {
    const sanitizedId = sanitizeId(id);
    const chatRef = doc(db, 'chatHistories', `${userId}_${sanitizedId}`);
    console.log(`Retrieving chat histories for userId: ${userId}, modelId: ${id}`);
    try {
        const chatDoc = await getDoc(chatRef);
        if (chatDoc.exists()) {
            console.log('Chat histories retrieved successfully:', chatDoc.data().chatHistories);
            return chatDoc.data().chatHistories;
        } else {
            console.log('No chat histories found.');
            return [];
        }
    } catch (error) {
        console.error('Error retrieving chat histories:', error);
        return [];
    }
};

// Function to save deployed model information
async function saveDeployedModel(jobId, modelId, serverUrl, modelName) {
    const user = auth.currentUser;
    if (!user) {
        console.log("No user is currently signed in.");
        return;
    }

    try {
        // Add a new document with a generated ID to the 'deployed_models' collection
        const docRef = await addDoc(collection(db, 'deployed_models'), {
            userId: user.uid, // Use the UID of the signed-in user
            jobId: jobId,
            modelId: modelId,
            serverUrl: serverUrl,
            modelName: modelName,
            deployedAt: new Date() // Timestamp for when the model is deployed
        });
        console.log("Deployed model saved with ID: ", docRef.id);
    } catch (e) {
        console.error("Error saving deployed model: ", e);
    }
}

// Function to fetch a completed job by jobId
async function fetchCompletedJobById(jobId) {
    try {
        console.log(`Fetching completed job with jobId: ${jobId}`); // Debugging log
        const q = query(collection(db, 'completed_jobs'), where('jobId', '==', jobId));
        const querySnapshot = await getDocs(q);
        console.log(`Query snapshot size: ${querySnapshot.size}`); // Debugging log
        if (!querySnapshot.empty) {
            const docSnap = querySnapshot.docs[0];
            console.log('Completed job data:', docSnap.data()); // Debugging log
            return docSnap.data();
        } else {
            console.log('No such document!');
            return null;
        }
    } catch (error) {
        console.error('Error fetching completed job:', error);
        throw error;
    }
}

// Function to fetch all training jobs for the currently logged-in user
async function fetchTrainingJobsForUser() {
    const user = auth.currentUser;
    if (user) {
        try {
            const querySnapshot = await getDocs(query(collection(db, 'training_jobs'), where('userId', '==', user.uid)));
            const trainingJobs = querySnapshot.docs.map(doc => ({
                docId: doc.id, // Include the document ID here
                ...doc.data()
            }));
            return trainingJobs;
        } catch (error) {
            console.error("Error fetching training jobs:", error);
            return [];
        }
    } else {
        console.log("No user is currently signed in.");
        return [];
    }
}

// Function to add a new training job metadata
async function addTrainingJobMetadata(docId, modelId, datasetId, imageTag, computeRequirements) {
    try {
        const docRef = await addDoc(collection(db, 'trainingJobs'), {
            modelId: modelId,
            datasetId: datasetId,
            imageTag: imageTag,
            computeRequirements: computeRequirements,
            trainingStatus: 'Pending', // Initial status
            createdAt: new Date() // Client-side timestamp
        });
        console.log("Metadata document written with ID: ", docRef.id);
        return docRef.id; // return the document ID
    } catch (error) {
        console.error("Error adding document: ", error);
        throw new Error("Failed to add training job metadata.");
    }
}

const newTrainingJob = async (jobData) => {
    try {
        // Add a new document with a generated ID to the 'fine_tuning_jobs' collection
        const docRef = await addDoc(collection(db, 'fine_tuning_jobs'), {
            ...jobData,
            createdAt: new Date(),
            status: 'pending'
        });
        return { message: 'Job added successfully', jobId: docRef.id };
    } catch (error) {
        console.error('Error adding training job to Firestore:', error);
        throw new Error('Failed to add training job');
    }
};

// Function to add a new training job
async function addTrainingJob(modelName, modelId, datasetId, gpu, licenseSelected, domain, jobStatus) {
    const user = auth.currentUser;

    console.log('User', user.uid);

    if (user) {
        try {
            // Add a new document with a generated ID to the 'training_jobs' collection
            const docRef = await addDoc(collection(db, 'training_jobs'), {
                userId: user.uid, // Use the UID of the signed-in user
                modelName: modelName,
                modelId: modelId,
                datasetId: datasetId,
                gpu: gpu,
                licenseSelected: licenseSelected,
                domain: domain,
                jobStatus: jobStatus
            });
            console.log("Document written with ID: ", docRef.id);
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    } else {
        console.log("No user is currently signed in.");
    }
}

// Inside firebase-config.js or a relevant module
async function updateTrainingJobStatus(docId, status) {
    try {
        const docRef = doc(db, 'training_jobs', docId); // Use the docId directly
        await updateDoc(docRef, { jobStatus: status });
        console.log('Job status updated to', status);
    } catch (error) {
        console.error('Error updating job status:', error);
    }
}

// Function to handle the submission of a new fine-tuning job
async function submitFineTuningJob(jobData, uploadedTrainingFile, uploadedValidationFile) {
    const user = auth.currentUser;
    if (!user) {
        console.log("No user is currently signed in.");
        return;
    }

    try {
        // Adding the job data to Firestore
        const docRef = await addDoc(collection(db, 'fine_tuning_jobs'), {
            ...jobData,
            userId: user.uid,  // Linking the job to the current user
            createdAt: new Date(),  // Timestamp for when the job is created
            status: "pending" // Default status
        });

        console.log("Fine-tuning job submitted with ID:", docRef.id);

        // If there's an uploaded training file, handle the file upload
        if (uploadedTrainingFile) {
            const trainingStorageRef = ref(storage, `uploads/${user.uid}/${uploadedTrainingFile.name}`);
            await uploadBytes(trainingStorageRef, uploadedTrainingFile);
            console.log("Uploaded training file:", uploadedTrainingFile.name);
            // Save the training file path after successful upload
            await updateDoc(docRef, { trainingFilePath: trainingStorageRef.fullPath });
        }

        // If there's an uploaded validation file, handle the file upload
        if (uploadedValidationFile) {
            const validationStorageRef = ref(storage, `uploads/${user.uid}/${uploadedValidationFile.name}`);
            await uploadBytes(validationStorageRef, uploadedValidationFile);
            console.log("Uploaded validation file:", uploadedValidationFile.name);
            // Save the validation file path after successful upload
            await updateDoc(docRef, { validationFilePath: validationStorageRef.fullPath });
        }
    } catch (error) {
        console.error("Error submitting fine-tuning job:", error);
    }
}

async function userJobs() {
    const user = auth.currentUser;
    if (!user) {
        console.log("No user is currently signed in.");
        return [];
    }

    try {
        // Query Firestore collection for fine-tuning jobs belonging to the current user
        const querySnapshot = await getDocs(query(collection(db, 'fine_tuning_jobs'), where('userId', '==', user.uid)));

        const jobsData = [];
        querySnapshot.forEach((doc) => {
            // Get data of each job
            const job = doc.data();
            // Include document ID for reference if needed
            job.id = doc.id;
            jobsData.push(job);
        });

        return jobsData;
    } catch (error) {
        console.error("Error fetching fine-tuning jobs:", error);
        return [];
    }
}

async function fetchJobs() {
    return await userJobs(); 
}

// Function to delete a fine-tuning job
async function deleteFineTuningJob(docId) {
    console.log("Deleting job: ", docId);
    try {
        const docRef = doc(db, 'fine_tuning_jobs', docId);
        await deleteDoc(docRef);
        console.log('Fine-tuning job deleted with ID:', docId);
    } catch (error) {
        console.error('Error deleting fine-tuning job:', error);
    }
}

export {
    addTrainingJob,
    addTrainingJobMetadata,
    auth,
    db, deleteFineTuningJob,
    fetchCompletedJobById,
    fetchJobs,
    fetchTrainingJobsForUser, firebaseConfig, firestore, getChatHistory,
    newTrainingJob,
    saveChatHistory,
    saveDeployedModel,
    signInWithGoogle, // Export the sign-in function
    submitFineTuningJob,
    updateTrainingJobStatus,
    userJobs
};

