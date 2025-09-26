class CropService {
  constructor() {
    this.tableName = 'crop_c';
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
          {"field": {"Name": "variety_c"}},
          {"field": {"Name": "planting_date_c"}},
          {"field": {"Name": "expected_harvest_c"}},
          {"field": {"Name": "area_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "farm_id_c"}}
        ]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data.map(crop => ({
        Id: crop.Id,
        name: crop.name_c || '',
        variety: crop.variety_c || '',
        plantingDate: crop.planting_date_c,
        expectedHarvest: crop.expected_harvest_c,
        area: crop.area_c || 0,
        status: crop.status_c || 'planted',
        farmId: crop.farm_id_c?.Id?.toString() || '',
        farmName: crop.farm_id_c?.Name || 'Unknown Farm'
      }));
    } catch (error) {
      console.error("Error fetching crops:", error);
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
          {"field": {"Name": "variety_c"}},
          {"field": {"Name": "planting_date_c"}},
          {"field": {"Name": "expected_harvest_c"}},
          {"field": {"Name": "area_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "farm_id_c"}}
        ]
      };
      
      const response = await this.apperClient.getRecordById(this.tableName, id, params);
      
      if (!response?.data) {
        throw new Error(`Crop with ID ${id} not found`);
      }
      
      return {
        Id: response.data.Id,
        name: response.data.name_c || '',
        variety: response.data.variety_c || '',
        plantingDate: response.data.planting_date_c,
        expectedHarvest: response.data.expected_harvest_c,
        area: response.data.area_c || 0,
        status: response.data.status_c || 'planted',
        farmId: response.data.farm_id_c?.Id?.toString() || '',
        farmName: response.data.farm_id_c?.Name || 'Unknown Farm'
      };
    } catch (error) {
      console.error(`Error fetching crop ${id}:`, error);
      throw error;
    }
  }

  async getByFarmId(farmId) {
    if (!this.apperClient) this.initializeClient();
    
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "variety_c"}},
          {"field": {"Name": "planting_date_c"}},
          {"field": {"Name": "expected_harvest_c"}},
          {"field": {"Name": "area_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "farm_id_c"}}
        ],
        where: [{"FieldName": "farm_id_c", "Operator": "EqualTo", "Values": [parseInt(farmId)]}]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data.map(crop => ({
        Id: crop.Id,
        name: crop.name_c || '',
        variety: crop.variety_c || '',
        plantingDate: crop.planting_date_c,
        expectedHarvest: crop.expected_harvest_c,
        area: crop.area_c || 0,
        status: crop.status_c || 'planted',
        farmId: crop.farm_id_c?.Id?.toString() || '',
        farmName: crop.farm_id_c?.Name || 'Unknown Farm'
      }));
    } catch (error) {
      console.error("Error fetching crops by farm:", error);
      return [];
    }
  }

  async create(cropData) {
    if (!this.apperClient) this.initializeClient();
    
    try {
      const params = {
        records: [{
          name_c: cropData.name || '',
          variety_c: cropData.variety || '',
          planting_date_c: cropData.plantingDate,
          expected_harvest_c: cropData.expectedHarvest,
          area_c: parseFloat(cropData.area) || 0,
          status_c: cropData.status || 'planted',
          farm_id_c: parseInt(cropData.farmId)
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
          variety: createdRecord.variety_c || '',
          plantingDate: createdRecord.planting_date_c,
          expectedHarvest: createdRecord.expected_harvest_c,
          area: createdRecord.area_c || 0,
          status: createdRecord.status_c || 'planted',
          farmId: createdRecord.farm_id_c?.Id?.toString() || '',
          farmName: createdRecord.farm_id_c?.Name || 'Unknown Farm'
        };
      }
      
      throw new Error("Failed to create crop");
    } catch (error) {
      console.error("Error creating crop:", error);
      throw error;
    }
  }

  async update(id, cropData) {
    if (!this.apperClient) this.initializeClient();
    
    try {
      const params = {
        records: [{
          Id: parseInt(id),
          name_c: cropData.name || '',
          variety_c: cropData.variety || '',
          planting_date_c: cropData.plantingDate,
          expected_harvest_c: cropData.expectedHarvest,
          area_c: parseFloat(cropData.area) || 0,
          status_c: cropData.status || 'planted',
          farm_id_c: parseInt(cropData.farmId)
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
          variety: updatedRecord.variety_c || '',
          plantingDate: updatedRecord.planting_date_c,
          expectedHarvest: updatedRecord.expected_harvest_c,
          area: updatedRecord.area_c || 0,
          status: updatedRecord.status_c || 'planted',
          farmId: updatedRecord.farm_id_c?.Id?.toString() || '',
          farmName: updatedRecord.farm_id_c?.Name || 'Unknown Farm'
        };
      }
      
      throw new Error("Failed to update crop");
    } catch (error) {
      console.error("Error updating crop:", error);
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
      console.error("Error deleting crop:", error);
      throw error;
    }
  }
}

export default new CropService();