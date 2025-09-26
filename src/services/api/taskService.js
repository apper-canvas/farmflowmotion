class TaskService {
  constructor() {
    this.tableName = 'task_c';
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
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "completed_at_c"}},
          {"field": {"Name": "farm_id_c"}},
          {"field": {"Name": "crop_id_c"}}
        ]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data.map(task => ({
        Id: task.Id,
        title: task.title_c || '',
        description: task.description_c || '',
        dueDate: task.due_date_c,
        priority: task.priority_c || 'medium',
        completed: task.completed_c || false,
        completedAt: task.completed_at_c,
        farmId: task.farm_id_c?.Id?.toString() || '',
        farmName: task.farm_id_c?.Name || 'Unknown Farm',
        cropId: task.crop_id_c?.Id?.toString() || null,
        cropName: task.crop_id_c?.Name || null
      }));
    } catch (error) {
      console.error("Error fetching tasks:", error);
      return [];
    }
  }

  async getById(id) {
    if (!this.apperClient) this.initializeClient();
    
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "completed_at_c"}},
          {"field": {"Name": "farm_id_c"}},
          {"field": {"Name": "crop_id_c"}}
        ]
      };
      
      const response = await this.apperClient.getRecordById(this.tableName, id, params);
      
      if (!response?.data) {
        throw new Error(`Task with ID ${id} not found`);
      }
      
      return {
        Id: response.data.Id,
        title: response.data.title_c || '',
        description: response.data.description_c || '',
        dueDate: response.data.due_date_c,
        priority: response.data.priority_c || 'medium',
        completed: response.data.completed_c || false,
        completedAt: response.data.completed_at_c,
        farmId: response.data.farm_id_c?.Id?.toString() || '',
        farmName: response.data.farm_id_c?.Name || 'Unknown Farm',
        cropId: response.data.crop_id_c?.Id?.toString() || null,
        cropName: response.data.crop_id_c?.Name || null
      };
    } catch (error) {
      console.error(`Error fetching task ${id}:`, error);
      throw error;
    }
  }

  async getUpcoming(limit = 5) {
    if (!this.apperClient) this.initializeClient();
    
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "completed_at_c"}},
          {"field": {"Name": "farm_id_c"}},
          {"field": {"Name": "crop_id_c"}}
        ],
        where: [
          {"FieldName": "completed_c", "Operator": "EqualTo", "Values": [false]},
          {"FieldName": "due_date_c", "Operator": "GreaterThanOrEqualTo", "Values": [new Date().toISOString()]}
        ],
        orderBy: [{"fieldName": "due_date_c", "sorttype": "ASC"}],
        pagingInfo: {"limit": limit, "offset": 0}
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data.map(task => ({
        Id: task.Id,
        title: task.title_c || '',
        description: task.description_c || '',
        dueDate: task.due_date_c,
        priority: task.priority_c || 'medium',
        completed: task.completed_c || false,
        completedAt: task.completed_at_c,
        farmId: task.farm_id_c?.Id?.toString() || '',
        farmName: task.farm_id_c?.Name || 'Unknown Farm',
        cropId: task.crop_id_c?.Id?.toString() || null,
        cropName: task.crop_id_c?.Name || null
      }));
    } catch (error) {
      console.error("Error fetching upcoming tasks:", error);
      return [];
    }
  }

  async create(taskData) {
    if (!this.apperClient) this.initializeClient();
    
    try {
      const params = {
        records: [{
          title_c: taskData.title || '',
          description_c: taskData.description || '',
          due_date_c: taskData.dueDate,
          priority_c: taskData.priority || 'medium',
          completed_c: false,
          completed_at_c: null,
          farm_id_c: parseInt(taskData.farmId),
          ...(taskData.cropId ? { crop_id_c: parseInt(taskData.cropId) } : {})
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
          title: createdRecord.title_c || '',
          description: createdRecord.description_c || '',
          dueDate: createdRecord.due_date_c,
          priority: createdRecord.priority_c || 'medium',
          completed: createdRecord.completed_c || false,
          completedAt: createdRecord.completed_at_c,
          farmId: createdRecord.farm_id_c?.Id?.toString() || '',
          farmName: createdRecord.farm_id_c?.Name || 'Unknown Farm',
          cropId: createdRecord.crop_id_c?.Id?.toString() || null,
          cropName: createdRecord.crop_id_c?.Name || null
        };
      }
      
      throw new Error("Failed to create task");
    } catch (error) {
      console.error("Error creating task:", error);
      throw error;
    }
  }

  async update(id, taskData) {
    if (!this.apperClient) this.initializeClient();
    
    try {
      const updateData = {
        Id: parseInt(id),
        title_c: taskData.title || '',
        description_c: taskData.description || '',
        due_date_c: taskData.dueDate,
        priority_c: taskData.priority || 'medium',
        farm_id_c: parseInt(taskData.farmId)
      };
      
      if (taskData.cropId) {
        updateData.crop_id_c = parseInt(taskData.cropId);
      }
      
      if (taskData.hasOwnProperty('completed')) {
        updateData.completed_c = taskData.completed;
        updateData.completed_at_c = taskData.completed ? new Date().toISOString() : null;
      }
      
      const params = { records: [updateData] };
      
      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      const updatedRecord = response.results?.[0]?.data;
      if (updatedRecord) {
        return {
          Id: updatedRecord.Id,
          title: updatedRecord.title_c || '',
          description: updatedRecord.description_c || '',
          dueDate: updatedRecord.due_date_c,
          priority: updatedRecord.priority_c || 'medium',
          completed: updatedRecord.completed_c || false,
          completedAt: updatedRecord.completed_at_c,
          farmId: updatedRecord.farm_id_c?.Id?.toString() || '',
          farmName: updatedRecord.farm_id_c?.Name || 'Unknown Farm',
          cropId: updatedRecord.crop_id_c?.Id?.toString() || null,
          cropName: updatedRecord.crop_id_c?.Name || null
        };
      }
      
      throw new Error("Failed to update task");
    } catch (error) {
      console.error("Error updating task:", error);
      throw error;
    }
  }

  async complete(id) {
    const currentTask = await this.getById(id);
    return this.update(id, {
      ...currentTask,
      completed: !currentTask.completed
    });
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
      console.error("Error deleting task:", error);
      throw error;
    }
  }
}

export default new TaskService();