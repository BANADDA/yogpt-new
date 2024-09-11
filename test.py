import logging

import flwr as fl
import numpy as np
import requests
import torch
from datasets import load_dataset
from transformers import (DataCollatorForLanguageModeling, GPT2LMHeadModel,
                          GPT2Tokenizer, Trainer, TrainingArguments)


def get_model_parameters(model):
    return [val.cpu().numpy() for val in model.state_dict().values()]

def set_model_parameters(model, parameters):
    params_dict = zip(model.state_dict().keys(), parameters)
    state_dict = {k: torch.tensor(v) for k, v in params_dict}
    model.load_state_dict(state_dict, strict=True)

model_name = "gpt2"
model = GPT2LMHeadModel.from_pretrained(model_name)
tokenizer = GPT2Tokenizer.from_pretrained(model_name)

class GPT2Client(fl.client.NumPyClient):
    def __init__(self, client_id):
        self.client_id = client_id
        self.train_dataset = load_dataset_client()
        
    def get_parameters(self, config):
        print("Client is sending parameters")
        return get_model_parameters(model)
    
    def fit(self, parameters, config):
        set_model_parameters(model, parameters)

        data_collator = DataCollatorForLanguageModeling(tokenizer=tokenizer, mlm=False)

        training_args = TrainingArguments(
            output_dir="./output",
            overwrite_output_dir=True,
            num_train_epochs=1,
            per_device_train_batch_size=4,
            save_steps=10_000,
            save_total_limit=2,
            logging_dir='./logs',
        )

        trainer = Trainer(
            model=model,
            args=training_args,
            data_collator=data_collator,
            train_dataset=self.train_dataset,
        )

        trainer.train()
        return get_model_parameters(model), len(self.train_dataset), {}

    def evaluate(self, parameters, config):
        set_model_parameters(model, parameters)
        loss = 0.0
        return float(loss), len(self.train_dataset), {"accuracy": 0.0}

def load_dataset_client():
    data = r"./client1_data.txt"
    train_dataset = load_dataset('text', data_files={'train': data}, split='train')
    return train_dataset

def get_client_id_from_fastapi():
    api_key = "dzh_openai-community_gpt2_20240911_1522_x25"
    url = "http://127.0.0.1:8000/start-training"

    response = requests.post(url, headers={"API-Key": api_key})

    if response.status_code == 200:
        client_id = response.json().get("client_id")
        print(f"Client ID received from FastAPI: {client_id}")
        return client_id
    else:
        print(f"Error: {response.status_code}, {response.text}")
        exit(1)

logging.basicConfig(level=logging.INFO)

def start_flower_client(client_id):
    logging.info("Connecting to Flower server...")
    client = GPT2Client(client_id)
    
    try:
        fl.client.start_client(
            server_address="localhost:5050",
            client=client
        )
    except Exception as e:
        logging.error(f"An error occurred: {e}")

if __name__ == "__main__":
    client_id = get_client_id_from_fastapi()
    start_flower_client(client_id)
