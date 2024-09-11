class ModelService {
    static getModels() {
      const storedData = localStorage.getItem('hfModelsDetails');
      if (!storedData) {
        return [];
      }
      try {
        return JSON.parse(storedData);
      } catch (error) {
        console.error('Failed to parse models data from local storage:', error);
        return [];
      }
    }
  
    static getModelById(modelId) {
      const models = this.getModels();
      return models.find(model => model.modelId === modelId);
    }
  
    // New method to fetch all models, with optional filtering logic
    static fetchAll(filterFunc) {
      const models = this.getModels();
      if (filterFunc && typeof filterFunc === 'function') {
        return models.filter(filterFunc);
      }
      return models;
    }
  
    // Example additional utility function that could be useful
    static count() {
      return this.getModels().length;
    }
  }
  
  export default ModelService;
  