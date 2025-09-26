class TransactionService {
  constructor() {
    this.tableName = 'transaction_c';
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
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "amount_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "farm_id_c"}}
        ]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data.map(transaction => ({
        Id: transaction.Id,
        type: transaction.type_c || 'expense',
        category: transaction.category_c || '',
        amount: transaction.amount_c || 0,
        description: transaction.description_c || '',
        date: transaction.date_c,
        farmId: transaction.farm_id_c?.Id?.toString() || '',
        farmName: transaction.farm_id_c?.Name || 'Unknown Farm'
      }));
    } catch (error) {
      console.error("Error fetching transactions:", error);
      return [];
    }
  }

  async getById(id) {
    if (!this.apperClient) this.initializeClient();
    
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "amount_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "farm_id_c"}}
        ]
      };
      
      const response = await this.apperClient.getRecordById(this.tableName, id, params);
      
      if (!response?.data) {
        throw new Error(`Transaction with ID ${id} not found`);
      }
      
      return {
        Id: response.data.Id,
        type: response.data.type_c || 'expense',
        category: response.data.category_c || '',
        amount: response.data.amount_c || 0,
        description: response.data.description_c || '',
        date: response.data.date_c,
        farmId: response.data.farm_id_c?.Id?.toString() || '',
        farmName: response.data.farm_id_c?.Name || 'Unknown Farm'
      };
    } catch (error) {
      console.error(`Error fetching transaction ${id}:`, error);
      throw error;
    }
  }

  async getByFarmId(farmId) {
    if (!this.apperClient) this.initializeClient();
    
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "amount_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "farm_id_c"}}
        ],
        where: [{"FieldName": "farm_id_c", "Operator": "EqualTo", "Values": [parseInt(farmId)]}]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data.map(transaction => ({
        Id: transaction.Id,
        type: transaction.type_c || 'expense',
        category: transaction.category_c || '',
        amount: transaction.amount_c || 0,
        description: transaction.description_c || '',
        date: transaction.date_c,
        farmId: transaction.farm_id_c?.Id?.toString() || '',
        farmName: transaction.farm_id_c?.Name || 'Unknown Farm'
      }));
    } catch (error) {
      console.error("Error fetching transactions by farm:", error);
      return [];
    }
  }

  async create(transactionData) {
    if (!this.apperClient) this.initializeClient();
    
    try {
      const params = {
        records: [{
          type_c: transactionData.type || 'expense',
          category_c: transactionData.category || '',
          amount_c: parseFloat(transactionData.amount) || 0,
          description_c: transactionData.description || '',
          date_c: transactionData.date,
          farm_id_c: parseInt(transactionData.farmId)
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
          type: createdRecord.type_c || 'expense',
          category: createdRecord.category_c || '',
          amount: createdRecord.amount_c || 0,
          description: createdRecord.description_c || '',
          date: createdRecord.date_c,
          farmId: createdRecord.farm_id_c?.Id?.toString() || '',
          farmName: createdRecord.farm_id_c?.Name || 'Unknown Farm'
        };
      }
      
      throw new Error("Failed to create transaction");
    } catch (error) {
      console.error("Error creating transaction:", error);
      throw error;
    }
  }

  async update(id, transactionData) {
    if (!this.apperClient) this.initializeClient();
    
    try {
      const params = {
        records: [{
          Id: parseInt(id),
          type_c: transactionData.type || 'expense',
          category_c: transactionData.category || '',
          amount_c: parseFloat(transactionData.amount) || 0,
          description_c: transactionData.description || '',
          date_c: transactionData.date,
          farm_id_c: parseInt(transactionData.farmId)
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
          type: updatedRecord.type_c || 'expense',
          category: updatedRecord.category_c || '',
          amount: updatedRecord.amount_c || 0,
          description: updatedRecord.description_c || '',
          date: updatedRecord.date_c,
          farmId: updatedRecord.farm_id_c?.Id?.toString() || '',
          farmName: updatedRecord.farm_id_c?.Name || 'Unknown Farm'
        };
      }
      
      throw new Error("Failed to update transaction");
    } catch (error) {
      console.error("Error updating transaction:", error);
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
      console.error("Error deleting transaction:", error);
      throw error;
    }
  }
}

export default new TransactionService();