export const yogptContent = {
    whatIsYoGPT: "YoGPT is a powerful AI-driven platform designed to help users create, train, and deploy machine learning models with ease. Whether you are a beginner or a seasoned data scientist, YoGPT provides the tools and resources you need to build intelligent applications.",
    whatAreModels: "Models on YoGPT refer to machine learning models that are trained on specific datasets to perform tasks such as text generation, classification, and more. YoGPT supports various model architectures to cater to different needs.",
    howToCreateTrainingJob: "To create a training job on YoGPT, follow these steps: \n1. Navigate to the Dashboard.\n2. Click on 'Create New Job'.\n3. Select your dataset and model.\n4. Configure the training parameters.\n5. Submit the job and monitor the progress.",
    howToDeployModels: "Deploying models trained with YoGPT is straightforward. After training, you can deploy your model by navigating to the 'Deployed Models' section, selecting the trained model, and clicking 'Deploy'. Your model will be hosted and ready for inference.",
    howToStartInteracting: "To start interacting with your YoGPT, you can use the provided API endpoints or the web interface. The API documentation is available under the 'Docs' section, and the web interface offers a user-friendly way to interact with your models.",
    billingAndPricing: {
      overview: "YoGPT offers competitive pricing for both training jobs and inference. Below are the detailed pricing structures.",
      trainingPricing: [
        { model: 'OpenELM 270M', pricePerHour: '$0.50' },
        { model: 'OpenELM 450M', pricePerHour: '$0.75' },
        { model: 'OpenELM 3B', pricePerHour: '$1.00' },
      ],
      inferencePricing: [
        { model: 'GPT-2 Small', pricePerRequest: '$0.01' },
        { model: 'GPT-2 Medium', pricePerRequest: '$0.02' },
        { model: 'GPT-2 Large', pricePerRequest: '$0.03' },
        { model: 'GPT-2 XL', pricePerRequest: '$0.05' },
      ]
    }
  };
  