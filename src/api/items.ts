import type { CreateItemInput, Item, UpdateItemInput } from "@/interfaces";
import { apiClient } from "./apiClient";
import { mockAdapter } from "./mockAdapter";

// MOCK: once a real backend exists, delete `mockItems` and `findMockItem` below,
// the `mockAdapter` import above and every `adapter` option.
const mockItems: Item[] = [
  { id: "1", name: "First Item", description: "A sample Item from the mock." },
  { id: "2", name: "Second Item", description: "Another sample Item." },
  { id: "3", name: "Third Item", description: "Replace Item with your own resource." },
];

// The matching mock Item, or a fixed one carrying the requested id.
const findMockItem = (id: string) => mockItems.find((item) => item.id === id) ?? { ...mockItems[0], id };

export const getItems = async () => {
  const { data } = await apiClient.get<Item[]>("/items", {
    adapter: mockAdapter(mockItems), // MOCK
  });
  return data;
};

export const getItem = async (id: string) => {
  const { data } = await apiClient.get<Item>(`/items/${id}`, {
    adapter: mockAdapter(findMockItem(id)), // MOCK
  });
  return data;
};

export const createItem = async (input: CreateItemInput) => {
  const { data } = await apiClient.post<Item>("/items", input, {
    adapter: mockAdapter({ ...input, id: crypto.randomUUID() }), // MOCK
  });
  return data;
};

export const updateItem = async (id: string, input: UpdateItemInput) => {
  const { data } = await apiClient.patch<Item>(`/items/${id}`, input, {
    adapter: mockAdapter({ ...findMockItem(id), ...input }), // MOCK
  });
  return data;
};

export const deleteItem = async (id: string) => {
  await apiClient.delete(`/items/${id}`, {
    adapter: mockAdapter(undefined), // MOCK
  });
};
