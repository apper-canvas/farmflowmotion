import transactionsData from "@/services/mockData/transactions.json";
import farmService from "@/services/api/farmService";

class TransactionService {
  constructor() {
    this.transactions = [...transactionsData];
  }

  async getAll() {
    await this.delay();
    const farms = await farmService.getAll();
    const farmMap = farms.reduce((acc, farm) => {
      acc[farm.Id] = farm;
      return acc;
    }, {});

    return this.transactions.map(transaction => ({
      ...transaction,
      farmName: farmMap[transaction.farmId]?.name || "Unknown Farm"
    }));
  }

  async getById(id) {
    await this.delay();
    const transaction = this.transactions.find(t => t.Id === parseInt(id));
    if (!transaction) {
      throw new Error(`Transaction with ID ${id} not found`);
    }
    
    const farms = await farmService.getAll();
    const farm = farms.find(f => f.Id === parseInt(transaction.farmId));
    
    return {
      ...transaction,
      farmName: farm?.name || "Unknown Farm"
    };
  }

  async getByFarmId(farmId) {
    await this.delay();
    return this.transactions.filter(t => t.farmId === farmId.toString());
  }

  async create(transactionData) {
    await this.delay();
    const newTransaction = {
      ...transactionData,
      Id: Math.max(...this.transactions.map(t => t.Id), 0) + 1
    };
    this.transactions.push(newTransaction);
    
    const farms = await farmService.getAll();
    const farm = farms.find(f => f.Id === parseInt(newTransaction.farmId));
    
    return {
      ...newTransaction,
      farmName: farm?.name || "Unknown Farm"
    };
  }

  async update(id, transactionData) {
    await this.delay();
    const index = this.transactions.findIndex(t => t.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Transaction with ID ${id} not found`);
    }
    
    this.transactions[index] = {
      ...this.transactions[index],
      ...transactionData,
      Id: parseInt(id)
    };
    
    const farms = await farmService.getAll();
    const farm = farms.find(f => f.Id === parseInt(this.transactions[index].farmId));
    
    return {
      ...this.transactions[index],
      farmName: farm?.name || "Unknown Farm"
    };
  }

  async delete(id) {
    await this.delay();
    const index = this.transactions.findIndex(t => t.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Transaction with ID ${id} not found`);
    }
    
    this.transactions.splice(index, 1);
    return true;
  }

  delay() {
    return new Promise(resolve => setTimeout(resolve, 300));
  }
}

export default new TransactionService();