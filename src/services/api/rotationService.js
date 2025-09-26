import rotationsData from "@/services/mockData/rotations.json";
import farmService from "@/services/api/farmService";
import cropService from "@/services/api/cropService";

class RotationService {
  constructor() {
    this.rotations = [...rotationsData];
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

    return this.rotations.map(rotation => ({
      ...rotation,
      farmName: farmMap[rotation.farmId]?.name || "Unknown Farm",
      cropName: cropMap[rotation.cropId]?.name || "Unknown Crop",
      variety: cropMap[rotation.cropId]?.variety || ""
    }));
  }

  async getById(id) {
    await this.delay();
    const rotation = this.rotations.find(r => r.Id === parseInt(id));
    if (!rotation) {
      throw new Error(`Rotation with ID ${id} not found`);
    }
    
    const farms = await farmService.getAll();
    const crops = await cropService.getAll();
    const farm = farms.find(f => f.Id === parseInt(rotation.farmId));
    const crop = crops.find(c => c.Id === parseInt(rotation.cropId));
    
    return {
      ...rotation,
      farmName: farm?.name || "Unknown Farm",
      cropName: crop?.name || "Unknown Crop",
      variety: crop?.variety || ""
    };
  }

  async getByFarmId(farmId) {
    await this.delay();
    const rotations = this.rotations.filter(r => r.farmId === farmId.toString());
    const crops = await cropService.getAll();
    
    const cropMap = crops.reduce((acc, crop) => {
      acc[crop.Id] = crop;
      return acc;
    }, {});

    return rotations.map(rotation => ({
      ...rotation,
      cropName: cropMap[rotation.cropId]?.name || "Unknown Crop",
      variety: cropMap[rotation.cropId]?.variety || ""
    }));
  }

  async getByYear(year) {
    await this.delay();
    const yearStart = new Date(year, 0, 1);
    const yearEnd = new Date(year, 11, 31);
    
    return this.rotations.filter(rotation => {
      const rotationDate = new Date(rotation.plannedDate);
      return rotationDate >= yearStart && rotationDate <= yearEnd;
    });
  }

  async create(rotationData) {
    await this.delay();
    const newRotation = {
      ...rotationData,
      Id: Math.max(...this.rotations.map(r => r.Id), 0) + 1
    };
    this.rotations.push(newRotation);
    
    const farms = await farmService.getAll();
    const crops = await cropService.getAll();
    const farm = farms.find(f => f.Id === parseInt(newRotation.farmId));
    const crop = crops.find(c => c.Id === parseInt(newRotation.cropId));
    
    return {
      ...newRotation,
      farmName: farm?.name || "Unknown Farm",
      cropName: crop?.name || "Unknown Crop",
      variety: crop?.variety || ""
    };
  }

  async update(id, rotationData) {
    await this.delay();
    const index = this.rotations.findIndex(r => r.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Rotation with ID ${id} not found`);
    }
    
    this.rotations[index] = {
      ...this.rotations[index],
      ...rotationData,
      Id: parseInt(id)
    };
    
    const farms = await farmService.getAll();
    const crops = await cropService.getAll();
    const farm = farms.find(f => f.Id === parseInt(this.rotations[index].farmId));
    const crop = crops.find(c => c.Id === parseInt(this.rotations[index].cropId));
    
    return {
      ...this.rotations[index],
      farmName: farm?.name || "Unknown Farm",
      cropName: crop?.name || "Unknown Crop",
      variety: crop?.variety || ""
    };
  }

  async delete(id) {
    await this.delay();
    const index = this.rotations.findIndex(r => r.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Rotation with ID ${id} not found`);
    }
    
    this.rotations.splice(index, 1);
    return true;
  }

  delay() {
    return new Promise(resolve => setTimeout(resolve, 400));
  }
}

const rotationService = new RotationService();
export default rotationService;