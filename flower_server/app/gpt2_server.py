import logging
import socket

import flwr as fl
import torch
from transformers import GPT2LMHeadModel, GPT2Tokenizer


# Load GPT-2 model
def load_gpt2_model():
    model = GPT2LMHeadModel.from_pretrained("gpt2")
    tokenizer = GPT2Tokenizer.from_pretrained("gpt2")
    return model, tokenizer

# Define functions to get and set model parameters
def get_model_parameters(model):
    return [val.cpu().numpy() for val in model.state_dict().values()]

def set_model_parameters(model, parameters):
    params_dict = zip(model.state_dict().keys(), parameters)
    state_dict = {k: torch.tensor(v) for k, v in params_dict}
    model.load_state_dict(state_dict, strict=True)

# Check if the server is already running on the specified port
def is_server_running(host="localhost", port=5050):
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
        result = sock.connect_ex((host, port))
        return result == 0  # Returns True if the connection is successful
    
logging.basicConfig(level=logging.DEBUG)

# Start the GPT-2 Federated Server
def start_gpt2_server(client_id):
    if is_server_running():
        print(f"Server is already running on port 5050. Skipping server start.")
        return
    
    print(f"Starting GPT-2 server for client ID: {client_id}")
    
    model, tokenizer = load_gpt2_model()

    # Define an evaluation function within the same scope as the model
    def evaluate(parameters, config):
        set_model_parameters(model, parameters)
        # Example placeholder logic for evaluation
        loss = 0.0  # Your actual evaluation logic should be placed here
        accuracy = 0.0  # Add accuracy calculation here
        return loss, {"accuracy": accuracy}

    strategy = fl.server.strategy.FedAvg(
        min_available_clients=2,
        evaluate_fn=evaluate,  # Correctly passing the evaluation function
        on_fit_config_fn=lambda rnd: {"rnd": rnd},  # Fit config for each round
    )

    # Start the Flower server
    fl.server.start_server(
        server_address="localhost:5050",
        config=fl.server.ServerConfig(num_rounds=5, round_timeout=60),  # Set a longer timeout
        strategy=strategy,
    )

