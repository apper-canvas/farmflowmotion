class FarmService {
  constructor() {
    this.tableName = 'farm_c';
    this.apperClient = null;
    this.initializeClient();
  }

  initializeClient() {
    if (typeof window !== 'undefined' && window.ApperSDK) {
      const { ApperClient } = window.ApperSDK;
      this.apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
    }
  }

  async getAll() {
    if (!this.apperClient) this.initializeClient();
    
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "location_c"}},
          {"field": {"Name": "size_c"}},
          {"field": {"Name": "soil_type_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "weather_summary_c"}}
        ]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data.map(farm => ({
        Id: farm.Id,
        name: farm.name_c || '',
        location: farm.location_c || '',
        size: farm.size_c || 0,
        soilType: farm.soil_type_c || '',
        createdAt: farm.created_at_c || new Date().toISOString(),
        weatherSummary: farm.weather_summary_c || ''
      }));
    } catch (error) {
      console.error("Error fetching farms:", error);
      return [];
    }
  }

  async getById(id) {
    if (!this.apperClient) this.initializeClient();
    
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "location_c"}},
          {"field": {"Name": "size_c"}},
          {"field": {"Name": "soil_type_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "weather_summary_c"}}
        ]
      };
      
      const response = await this.apperClient.getRecordById(this.tableName, id, params);
      
      if (!response?.data) {
        throw new Error(`Farm with ID ${id} not found`);
      }
      
      return {
        Id: response.data.Id,
        name: response.data.name_c || '',
        location: response.data.location_c || '',
        size: response.data.size_c || 0,
        soilType: response.data.soil_type_c || '',
        createdAt: response.data.created_at_c || new Date().toISOString(),
        weatherSummary: response.data.weather_summary_c || ''
      };
    } catch (error) {
      console.error(`Error fetching farm ${id}:`, error);
      throw error;
    }
  }

  async create(farmData) {
    if (!this.apperClient) this.initializeClient();
    
    try {
      const params = {
        records: [{
          name_c: farmData.name || '',
          location_c: farmData.location || '',
          size_c: parseFloat(farmData.size) || 0,
          soil_type_c: farmData.soilType || 'loam',
          created_at_c: new Date().toISOString(),
          weather_summary_c: farmData.weatherSummary || ''
        }]
      };
      
      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      const createdRecord = response.results?.[0]?.data;
      if (createdRecord) {
        return {
          Id: createdRecord.Id,
          name: createdRecord.name_c || '',
          location: createdRecord.location_c || '',
          size: createdRecord.size_c || 0,
          soilType: createdRecord.soil_type_c || '',
          createdAt: createdRecord.created_at_c || new Date().toISOString(),
          weatherSummary: createdRecord.weather_summary_c || ''
        };
      }
      
      throw new Error("Failed to create farm");
    } catch (error) {
      console.error("Error creating farm:", error);
      throw error;
    }
  }

  async update(id, farmData) {
    if (!this.apperClient) this.initializeClient();
    
    try {
      const params = {
        records: [{
          Id: parseInt(id),
          name_c: farmData.name || '',
          location_c: farmData.location || '',
          size_c: parseFloat(farmData.size) || 0,
          soil_type_c: farmData.soilType || 'loam',
          weather_summary_c: farmData.weatherSummary || ''
        }]
      };
      
      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      const updatedRecord = response.results?.[0]?.data;
      if (updatedRecord) {
        return {
          Id: updatedRecord.Id,
          name: updatedRecord.name_c || '',
          location: updatedRecord.location_c || '',
          size: updatedRecord.size_c || 0,
          soilType: updatedRecord.soil_type_c || '',
          createdAt: updatedRecord.created_at_c || new Date().toISOString(),
          weatherSummary: updatedRecord.weather_summary_c || ''
        };
      }
      
      throw new Error("Failed to update farm");
    } catch (error) {
      console.error("Error updating farm:", error);
      throw error;
    }
  }

  async delete(id) {
    if (!this.apperClient) this.initializeClient();
    
    try {
      const params = { 
        RecordIds: [parseInt(id)]
      };
      
      const response = await this.apperClient.deleteRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.results?.[0]?.success || false;
    } catch (error) {
      console.error("Error deleting farm:", error);
      throw error;
    }
  }
}

export default new FarmService();