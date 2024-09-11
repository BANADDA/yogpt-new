import sys
import os
import uvicorn
import click

# Add the current directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

@click.group()
def cli():
    pass

@cli.command()
def start():
    """Start the YoGPT server."""
    uvicorn.run(
        "app.main:app",  
        host="127.0.0.1",
        port=8000,
        log_level="info",
        reload=True
    )

if __name__ == "__main__":
    cli()
