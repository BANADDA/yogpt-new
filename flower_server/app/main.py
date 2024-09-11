import logging
import uuid
from fastapi import FastAPI, Header, HTTPException
from firebase_admin import firestore
from app.auth import authenticate_client  # Import authentication logic
from app.gpt2_server import start_gpt2_server  # Import GPT-2 server start function

# Initialize logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

app = FastAPI()

# Initialize Firestore client
db = firestore.client()

@app.post("/start-training")
def start_training(api_key: str = Header(None)):
    """
    This endpoint starts the model training after authenticating the client.
    """
    logging.info("Received request to start training with API key: %s", api_key)

    # Step 1: Authenticate the client and get the model_id
    try:
        logging.info("Authenticating client with API key: %s", api_key)
        model_id = authenticate_client(api_key)  # No need to pass model_id; it's derived from Firestore
        logging.info("Client authenticated successfully. Model ID: %s", model_id)
    except HTTPException as e:
        logging.error("Authentication failed: %s", str(e))
        raise

    # Step 2: Assign a unique client ID after authentication
    client_id = str(uuid.uuid4())  # Generate a UUID for uniqueness
    logging.info("Generated unique client ID: %s", client_id)

    # Step 3: Save the client ID, model_id, and user_id in Firestore (optional)
    client_data = {
        "client_id": client_id,
        "model_id": model_id,
    }
    try:
        db.collection("active_clients").document(client_id).set(client_data)  # Store client details in Firestore
        logging.info("Stored client data in Firestore for client ID: %s", client_id)
    except Exception as e:
        logging.error("Failed to store client data in Firestore: %s", str(e))
        raise HTTPException(status_code=500, detail="Failed to store client data in Firestore")

    # Step 4: Start the correct model server based on model_id
    if model_id == "openai-community/gpt2":
        logging.info("Starting GPT-2 server for client ID: %s", client_id)
        start_gpt2_server(client_id)  # Pass the client ID to the model server
        logging.info("GPT-2 training started for client ID: %s", client_id)
        return {"message": "GPT-2 training started.", "client_id": client_id}
    else:
        logging.error("Model ID not found: %s", model_id)
        raise HTTPException(status_code=404, detail="Model not found")

@app.get("/")
def read_root():
    logging.info("Received request for root endpoint.")
    return {"message": "Welcome to the YoGPT Flower Server"}
