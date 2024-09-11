import firebase_admin
from firebase_admin import credentials, firestore
from fastapi import HTTPException
import logging

# Initialize Firebase Admin SDK with your credentials
cred = credentials.Certificate("C:/Users/HP/Documents/flower/myowngpt/flower_server/firebase-service-account.json")
firebase_admin.initialize_app(cred)

# Initialize Firestore client
db = firestore.client()

def get_federated_token(api_key):
    """
    Fetch the federated token details from Firestore based on the API key.
    """
    logging.info(f"Fetching federated token for API key: {api_key}")
    
    # Correct Firestore `where` usage
    tokens_ref = db.collection('federated_tokens').where("accessToken", "==", api_key)
    tokens = tokens_ref.stream()

    token_data = None
    for token in tokens:
        token_data = token.to_dict()
        logging.info(f"Token found: {token_data}")
        return token_data

    logging.error("No token found for the provided API key")
    return None

def reconstruct_model_id_from_token(token):
    """
    Reconstruct the model ID from the given token format.
    """
    # Split the token by underscores
    parts = token.split('_')

    if len(parts) < 4:
        raise HTTPException(status_code=400, detail="Invalid token format")
    
    # Extract the model part, which is the second part after the user ID
    model_part = parts[1]  # This is the part corresponding to the model (e.g., "openai-community")
    model_name = parts[2]  # This is the part corresponding to the model name (e.g., "gpt2")
    
    # Join the two parts with a slash to recreate the modelId (e.g., "openai-community/gpt2")
    model_id = f"{model_part}/{model_name}"

    logging.info(f"Reconstructed model ID: {model_id}")
    return model_id.lower()

def authenticate_client(token):
    """
    Authenticate the client based on the token and model ID from Firestore.
    """
    logging.info(f"Authenticating token: {token}")
    
    token_data = get_federated_token(token)
    if token_data:
        # Reconstruct model_id from token and verify it matches the stored model_id
        reconstructed_model_id = reconstruct_model_id_from_token(token)
        logging.info(f"Reconstructed model ID: {reconstructed_model_id}")
        
        if token_data['modelId'] == reconstructed_model_id:
            logging.info(f"Authenticated client for model: {token_data['modelId']}")
            return token_data['modelId']
        else:
            logging.error(f"Unauthorized: Token does not belong to the requested model. Expected: {token_data['modelId']}, Got: {reconstructed_model_id}")
            raise HTTPException(status_code=403, detail="Unauthorized: Token does not belong to the requested model")
    else:
        logging.error("Unauthorized: Invalid API Token")
        raise HTTPException(status_code=401, detail="Unauthorized: Invalid API Token")
