class RotationService {
  constructor() {
    this.tableName = 'rotation_c';
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
          {"field": {"Name": "planned_date_c"}},
          {"field": {"Name": "previous_crop_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "farm_id_c"}},
          {"field": {"Name": "crop_id_c"}}
        ]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data.map(rotation => ({
        Id: rotation.Id,
        plannedDate: rotation.planned_date_c,
        previousCrop: rotation.previous_crop_c || '',
        status: rotation.status_c || '',
        notes: rotation.notes_c || '',
        farmId: rotation.farm_id_c?.Id?.toString() || '',
        farmName: rotation.farm_id_c?.Name || 'Unknown Farm',
        cropId: rotation.crop_id_c?.Id?.toString() || '',
        cropName: rotation.crop_id_c?.Name || 'Unknown Crop',
        variety: '' // Note: variety comes from crop record, not rotation
      }));
    } catch (error) {
      console.error("Error fetching rotations:", error);
      return [];
    }
  }

  async getById(id) {
    if (!this.apperClient) this.initializeClient();
    
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "planned_date_c"}},
          {"field": {"Name": "previous_crop_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "farm_id_c"}},
          {"field": {"Name": "crop_id_c"}}
        ]
      };
      
      const response = await this.apperClient.getRecordById(this.tableName, id, params);
      
      if (!response?.data) {
        throw new Error(`Rotation with ID ${id} not found`);
      }
      
      return {
        Id: response.data.Id,
        plannedDate: response.data.planned_date_c,
        previousCrop: response.data.previous_crop_c || '',
        status: response.data.status_c || '',
        notes: response.data.notes_c || '',
        farmId: response.data.farm_id_c?.Id?.toString() || '',
        farmName: response.data.farm_id_c?.Name || 'Unknown Farm',
        cropId: response.data.crop_id_c?.Id?.toString() || '',
        cropName: response.data.crop_id_c?.Name || 'Unknown Crop',
        variety: '' // Note: variety comes from crop record, not rotation
      };
    } catch (error) {
      console.error(`Error fetching rotation ${id}:`, error);
      throw error;
    }
  }

  async getByFarmId(farmId) {
    if (!this.apperClient) this.initializeClient();
    
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "planned_date_c"}},
          {"field": {"Name": "previous_crop_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "farm_id_c"}},
          {"field": {"Name": "crop_id_c"}}
        ],
        where: [{"FieldName": "farm_id_c", "Operator": "EqualTo", "Values": [parseInt(farmId)]}]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data.map(rotation => ({
        Id: rotation.Id,
        plannedDate: rotation.planned_date_c,
        previousCrop: rotation.previous_crop_c || '',
        status: rotation.status_c || '',
        notes: rotation.notes_c || '',
        farmId: rotation.farm_id_c?.Id?.toString() || '',
        farmName: rotation.farm_id_c?.Name || 'Unknown Farm',
        cropId: rotation.crop_id_c?.Id?.toString() || '',
        cropName: rotation.crop_id_c?.Name || 'Unknown Crop',
        variety: '' // Note: variety comes from crop record, not rotation
      }));
    } catch (error) {
      console.error("Error fetching rotations by farm:", error);
      return [];
    }
  }

  async getByYear(year) {
    if (!this.apperClient) this.initializeClient();
    
    try {
      const yearStart = `${year}-01-01`;
      const yearEnd = `${year}-12-31`;
      
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "planned_date_c"}},
          {"field": {"Name": "previous_crop_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "farm_id_c"}},
          {"field": {"Name": "crop_id_c"}}
        ],
        where: [
          {"FieldName": "planned_date_c", "Operator": "GreaterThanOrEqualTo", "Values": [yearStart]},
          {"FieldName": "planned_date_c", "Operator": "LessThanOrEqualTo", "Values": [yearEnd]}
        ]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data.map(rotation => ({
        Id: rotation.Id,
        plannedDate: rotation.planned_date_c,
        previousCrop: rotation.previous_crop_c || '',
        status: rotation.status_c || '',
        notes: rotation.notes_c || '',
        farmId: rotation.farm_id_c?.Id?.toString() || '',
        farmName: rotation.farm_id_c?.Name || 'Unknown Farm',
        cropId: rotation.crop_id_c?.Id?.toString() || '',
        cropName: rotation.crop_id_c?.Name || 'Unknown Crop',
        variety: ''
      }));
    } catch (error) {
      console.error("Error fetching rotations by year:", error);
      return [];
    }
  }

  async create(rotationData) {
    if (!this.apperClient) this.initializeClient();
    
    try {
      const params = {
        records: [{
          planned_date_c: rotationData.plannedDate,
          previous_crop_c: rotationData.previousCrop || '',
          status_c: rotationData.status || '',
          notes_c: rotationData.notes || '',
          farm_id_c: parseInt(rotationData.farmId),
          crop_id_c: parseInt(rotationData.cropId)
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
          plannedDate: createdRecord.planned_date_c,
          previousCrop: createdRecord.previous_crop_c || '',
          status: createdRecord.status_c || '',
          notes: createdRecord.notes_c || '',
          farmId: createdRecord.farm_id_c?.Id?.toString() || '',
          farmName: createdRecord.farm_id_c?.Name || 'Unknown Farm',
          cropId: createdRecord.crop_id_c?.Id?.toString() || '',
          cropName: createdRecord.crop_id_c?.Name || 'Unknown Crop',
          variety: ''
        };
      }
      
      throw new Error("Failed to create rotation");
    } catch (error) {
      console.error("Error creating rotation:", error);
      throw error;
    }
  }

  async update(id, rotationData) {
    if (!this.apperClient) this.initializeClient();
    
    try {
      const params = {
        records: [{
          Id: parseInt(id),
          planned_date_c: rotationData.plannedDate,
          previous_crop_c: rotationData.previousCrop || '',
          status_c: rotationData.status || '',
          notes_c: rotationData.notes || '',
          farm_id_c: parseInt(rotationData.farmId),
          crop_id_c: parseInt(rotationData.cropId)
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
          plannedDate: updatedRecord.planned_date_c,
          previousCrop: updatedRecord.previous_crop_c || '',
          status: updatedRecord.status_c || '',
          notes: updatedRecord.notes_c || '',
          farmId: updatedRecord.farm_id_c?.Id?.toString() || '',
          farmName: updatedRecord.farm_id_c?.Name || 'Unknown Farm',
          cropId: updatedRecord.crop_id_c?.Id?.toString() || '',
          cropName: updatedRecord.crop_id_c?.Name || 'Unknown Crop',
          variety: ''
        };
      }
      
      throw new Error("Failed to update rotation");
    } catch (error) {
      console.error("Error updating rotation:", error);
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
      console.error("Error deleting rotation:", error);
      throw error;
    }
  }
}

const rotationService = new RotationService();
export default rotationService;