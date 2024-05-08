import { Example } from './exampleModel';

export const examples: Example[] = [
  { id: 1, name: 'Alice', email: 'alice@example.com', age: 42, createdAt: new Date(), updatedAt: new Date() },
  { id: 2, name: 'Bob', email: 'bob@example.com', age: 21, createdAt: new Date(), updatedAt: new Date() },
];

export const exampleRepository = {
  findAllAsync: async (): Promise<Example[]> => {
    return examples;
  },

  findByIdAsync: async (id: number): Promise<Example | null> => {
    return examples.find((example) => example.id === id) || null;
  },
};
