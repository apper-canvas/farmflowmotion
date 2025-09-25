import cropsData from "@/services/mockData/crops.json";
import farmService from "@/services/api/farmService";

class CropService {
  constructor() {
    this.crops = [...cropsData];
  }

  async getAll() {
    await this.delay();
    const farms = await farmService.getAll();
    const farmMap = farms.reduce((acc, farm) => {
      acc[farm.Id] = farm;
      return acc;
    }, {});

    return this.crops.map(crop => ({
      ...crop,
      farmName: farmMap[crop.farmId]?.name || "Unknown Farm"
    }));
  }

  async getById(id) {
    await this.delay();
    const crop = this.crops.find(c => c.Id === parseInt(id));
    if (!crop) {
      throw new Error(`Crop with ID ${id} not found`);
    }
    
    const farms = await farmService.getAll();
    const farm = farms.find(f => f.Id === parseInt(crop.farmId));
    
    return {
      ...crop,
      farmName: farm?.name || "Unknown Farm"
    };
  }

  async getByFarmId(farmId) {
    await this.delay();
    return this.crops.filter(c => c.farmId === farmId.toString());
  }

  async create(cropData) {
    await this.delay();
    const newCrop = {
      ...cropData,
      Id: Math.max(...this.crops.map(c => c.Id), 0) + 1
    };
    this.crops.push(newCrop);
    
    const farms = await farmService.getAll();
    const farm = farms.find(f => f.Id === parseInt(newCrop.farmId));
    
    return {
      ...newCrop,
      farmName: farm?.name || "Unknown Farm"
    };
  }

  async update(id, cropData) {
    await this.delay();
    const index = this.crops.findIndex(c => c.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Crop with ID ${id} not found`);
    }
    
    this.crops[index] = {
      ...this.crops[index],
      ...cropData,
      Id: parseInt(id)
    };
    
    const farms = await farmService.getAll();
    const farm = farms.find(f => f.Id === parseInt(this.crops[index].farmId));
    
    return {
      ...this.crops[index],
      farmName: farm?.name || "Unknown Farm"
    };
  }

  async delete(id) {
    await this.delay();
    const index = this.crops.findIndex(c => c.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Crop with ID ${id} not found`);
    }
    
    this.crops.splice(index, 1);
    return true;
  }

  delay() {
    return new Promise(resolve => setTimeout(resolve, 300));
  }
}

export default new CropService();