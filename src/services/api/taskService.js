import tasksData from "@/services/mockData/tasks.json";
import farmService from "@/services/api/farmService";
import cropService from "@/services/api/cropService";

class TaskService {
  constructor() {
    this.tasks = [...tasksData];
  }

  async getAll() {
    await this.delay();
    const farms = await farmService.getAll();
    const crops = await cropService.getAll();
    
    const farmMap = farms.reduce((acc, farm) => {
      acc[farm.Id] = farm;
      return acc;
    }, {});

    const cropMap = crops.reduce((acc, crop) => {
      acc[crop.Id] = crop;
      return acc;
    }, {});

    return this.tasks.map(task => ({
      ...task,
      farmName: farmMap[task.farmId]?.name || "Unknown Farm",
      cropName: task.cropId ? (cropMap[task.cropId]?.name || "Unknown Crop") : null
    }));
  }

  async getById(id) {
    await this.delay();
    const task = this.tasks.find(t => t.Id === parseInt(id));
    if (!task) {
      throw new Error(`Task with ID ${id} not found`);
    }
    
    const farms = await farmService.getAll();
    const crops = await cropService.getAll();
    const farm = farms.find(f => f.Id === parseInt(task.farmId));
    const crop = task.cropId ? crops.find(c => c.Id === parseInt(task.cropId)) : null;
    
    return {
      ...task,
      farmName: farm?.name || "Unknown Farm",
      cropName: crop?.name || null
    };
  }

  async getUpcoming(limit = 5) {
    await this.delay();
    const allTasks = await this.getAll();
    const upcomingTasks = allTasks
      .filter(task => !task.completed && new Date(task.dueDate) >= new Date())
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
      .slice(0, limit);
    
    return upcomingTasks;
  }

  async create(taskData) {
    await this.delay();
    const newTask = {
      ...taskData,
      Id: Math.max(...this.tasks.map(t => t.Id), 0) + 1,
      completed: false,
      completedAt: null
    };
    this.tasks.push(newTask);
    
    const farms = await farmService.getAll();
    const crops = await cropService.getAll();
    const farm = farms.find(f => f.Id === parseInt(newTask.farmId));
    const crop = newTask.cropId ? crops.find(c => c.Id === parseInt(newTask.cropId)) : null;
    
    return {
      ...newTask,
      farmName: farm?.name || "Unknown Farm",
      cropName: crop?.name || null
    };
  }

  async update(id, taskData) {
    await this.delay();
    const index = this.tasks.findIndex(t => t.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Task with ID ${id} not found`);
    }
    
    this.tasks[index] = {
      ...this.tasks[index],
      ...taskData,
      Id: parseInt(id)
    };
    
    const farms = await farmService.getAll();
    const crops = await cropService.getAll();
    const farm = farms.find(f => f.Id === parseInt(this.tasks[index].farmId));
    const crop = this.tasks[index].cropId ? crops.find(c => c.Id === parseInt(this.tasks[index].cropId)) : null;
    
    return {
      ...this.tasks[index],
      farmName: farm?.name || "Unknown Farm",
      cropName: crop?.name || null
    };
  }

  async complete(id) {
    await this.delay();
    const index = this.tasks.findIndex(t => t.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Task with ID ${id} not found`);
    }
    
    this.tasks[index] = {
      ...this.tasks[index],
      completed: !this.tasks[index].completed,
      completedAt: !this.tasks[index].completed ? null : new Date().toISOString()
    };
    
    const farms = await farmService.getAll();
    const crops = await cropService.getAll();
    const farm = farms.find(f => f.Id === parseInt(this.tasks[index].farmId));
    const crop = this.tasks[index].cropId ? crops.find(c => c.Id === parseInt(this.tasks[index].cropId)) : null;
    
    return {
      ...this.tasks[index],
      farmName: farm?.name || "Unknown Farm",
      cropName: crop?.name || null
    };
  }

  async delete(id) {
    await this.delay();
    const index = this.tasks.findIndex(t => t.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Task with ID ${id} not found`);
    }
    
    this.tasks.splice(index, 1);
    return true;
  }

  delay() {
    return new Promise(resolve => setTimeout(resolve, 300));
  }
}

export default new TaskService();