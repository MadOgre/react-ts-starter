// Sample resource: rename or replace Item when you start a real app.
export interface Item {
  id: string;
  name: string;
  description: string;
}

export type CreateItemInput = Omit<Item, "id">;

export type UpdateItemInput = Partial<CreateItemInput>;
