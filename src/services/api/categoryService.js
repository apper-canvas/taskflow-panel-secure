import categoriesData from '../mockData/categories.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class CategoryService {
  constructor() {
    this.categories = [...categoriesData];
  }

  async getAll() {
    await delay(250);
    return [...this.categories];
  }

  async getById(id) {
    await delay(200);
    const category = this.categories.find(c => c.id === id);
    return category ? { ...category } : null;
  }

  async create(categoryData) {
    await delay(300);
    const newCategory = {
      id: Date.now().toString(),
      name: categoryData.name || 'New Category',
      color: categoryData.color || '#6366F1',
      icon: categoryData.icon || 'Folder',
      taskCount: 0
    };
    this.categories.push(newCategory);
    return { ...newCategory };
  }

  async update(id, updates) {
    await delay(300);
    const index = this.categories.findIndex(c => c.id === id);
    if (index === -1) throw new Error('Category not found');
    
    this.categories[index] = {
      ...this.categories[index],
      ...updates
    };
    return { ...this.categories[index] };
  }

  async delete(id) {
    await delay(250);
    const index = this.categories.findIndex(c => c.id === id);
    if (index === -1) throw new Error('Category not found');
    
    const deletedCategory = this.categories.splice(index, 1)[0];
    return { ...deletedCategory };
  }

  async updateTaskCount(categoryId, count) {
    await delay(100);
    const category = this.categories.find(c => c.id === categoryId);
    if (category) {
      category.taskCount = count;
      return { ...category };
    }
    return null;
  }
}

export default new CategoryService();