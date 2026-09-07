export type MutationType = 'IN' | 'OUT' | 'TRANSFER';

export interface Mutation {
  id: string;
  type: MutationType;
  itemId: string;
  qty: number;
  sourceRackId?: string | null;
  destinationRackId?: string | null;
  notes?: string;
  createdAt: string;
  
  item?: { name: string; sku: string };
  sourceRack?: { code: string; warehouse: { name: string } };
  destinationRack?: { code: string; warehouse: { name: string } };
}

export type CreateMutationsPayload = Omit<Mutation, 'id' | 'createdAt' | 'item' | 'sourceRack' | 'destinationRack'>;