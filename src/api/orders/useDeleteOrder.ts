/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation } from "@tanstack/react-query";
import api from "@/api/axios";

interface DeleteOrderParams {
  id: number;
  lang?: string;
}

export const useDeleteOrder = (options?: {
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}) => {
  return useMutation({
    mutationFn: async ({ id, lang = "uz" }: DeleteOrderParams) => {
      const res = await api.delete(`/orders/${id}`, {
        headers: { "Accept-Language": lang },
      });
      return res.data;
    },
    ...options,
  });
};
