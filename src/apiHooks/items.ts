import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createItem, deleteItem, getItem, getItems, updateItem } from "@/api";
import type { UpdateItemInput } from "@/interfaces";

const itemsQueryKey = ["items"] as const;

export const useItems = () =>
  useQuery({ queryKey: itemsQueryKey, queryFn: getItems });

export const useItem = (id: string) =>
  useQuery({ queryKey: [...itemsQueryKey, id], queryFn: () => getItem(id) });

// Each mutation invalidates the Item list once it succeeds, so it refetches.
export const useCreateItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createItem,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: itemsQueryKey }),
  });
};

export const useUpdateItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateItemInput }) => updateItem(id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: itemsQueryKey }),
  });
};

export const useDeleteItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteItem,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: itemsQueryKey }),
  });
};
