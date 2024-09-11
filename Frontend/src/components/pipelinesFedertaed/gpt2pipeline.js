export const gpt2Pipeline = `
# Install necessary packages for the GPT-2 fine-tuning pipeline
pip install flwr transformers datasets torch

import flwr as fl
from transformers import GPT2LMHeadModel, GPT2Tokenizer, Trainer, TrainingArguments, DataCollatorForLanguageModeling
from datasets import load_dataset
import numpy as np
import torch

# Define functions to get and set model parameters
def get_model_parameters(model):
    return [val.cpu().numpy() for val in model.state_dict().values()]

def set_model_parameters(model, parameters):
    params_dict = zip(model.state_dict().keys(), parameters)
    state_dict = {k: torch.tensor(v) for k, v in params_dict}
    model.load_state_dict(state_dict, strict=True)

# Load the GPT-2 model and tokenizer
model_name = "gpt2"
model = GPT2LMHeadModel.from_pretrained(model_name)
tokenizer = GPT2Tokenizer.from_pretrained(model_name)

# Placeholder for the assigned client ID
client_id = None

# Federated learning client class
class GPT2Client(fl.client.NumPyClient):
    def __init__(self, client_id):
        self.client_id = client_id
        self.train_dataset = load_dataset_client(client_id)

    def get_parameters(self):
        return get_model_parameters(model)

    def fit(self, parameters, config):
        set_model_parameters(model, parameters)

        # Data collator for language modeling
        data_collator = DataCollatorForLanguageModeling(tokenizer=tokenizer, mlm=False)

        # Training arguments
        training_args = TrainingArguments(
            output_dir="./output",
            overwrite_output_dir=True,
            num_train_epochs=1,
            per_device_train_batch_size=4,
            save_steps=10_000,
            save_total_limit=2,
            logging_dir='./logs',
        )

        # Trainer instance
        trainer = Trainer(
            model=model,
            args=training_args,
            data_collator=data_collator,
            train_dataset=self.train_dataset,
        )

        # Train model
        trainer.train()

        # Return updated parameters
        return get_model_parameters(model), len(self.train_dataset), {}

    def evaluate(self, parameters, config):
        set_model_parameters(model, parameters)
        loss = 0.0  # Placeholder for evaluation, can be extended
        return float(loss), len(self.train_dataset), {"accuracy": 0.0}  # Placeholder

# Function to load dataset for specific clients
def load_dataset_client(client_id):
    if client_id == 1:
        data = "client1_data.txt"
    elif client_id == 2:
        data = "client2_data.txt"
    else:
        raise ValueError("Invalid client ID")
    train_dataset = load_dataset('text', data_files={'train': data}, split='train')
    return train_dataset

# Start Flower client with API key and receive client ID from the server
if __name__ == "__main__":
    api_key = "CLIENT_Access_Token"  # Replace with your actual Access Token

    # Add the API key to the request headers
    headers = {"API-Key": api_key}

    # Connect to the server and fetch the assigned client ID
    client_info = fl.client.start_numpy_client(
        server_address="localhost:5040", 
        client=GPT2Client(client_id),  # Pass placeholder client ID
        grpc_headers=headers,  # Passing the API key in headers
    )

    # Extract assigned client ID
    client_id = client_info.get("client_id")
    print(f"Received client ID: {client_id}")
`;
