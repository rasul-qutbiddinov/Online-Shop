/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "@/api/axios";

export interface UpdateOrderStatusPayload {
  status: "PENDING" | "CONFIRMED" | "DELIVERED" | "CANCELLED";
}

export interface OrderResponse {
  id: number;
  customerName: string;
  customerEmail: string;
  orderDate: string;
  status: "PENDING" | "CONFIRMED" | "DELIVERED" | "CANCELLED";
  totalAmount: number;
  orderItems: {
    id: number;
    productId: number;
    productName: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }[];
}

export const useUpdateOrderStatus = (options?: any) => {
  const queryClient = useQueryClient();

  return useMutation<
    OrderResponse,
    Error,
    { id: number; data: UpdateOrderStatusPayload }
  >({
    mutationFn: async ({ id, data }) => {
      const res = await axios.put<{
        success: boolean;
        message: string;
        data: OrderResponse;
      }>(`/orders/${id}/status`, data, {
        headers: { "Accept-Language": "uz" },
      });
      return res.data.data;
    },
    onSuccess: (data, variables, context) => {
      // 🔄 Orders list yangilansin
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === "orders",
      });

      if (options?.onSuccess) {
        options.onSuccess(data, variables, context);
      }
    },
    onError: (error, variables, context) => {
      if (options?.onError) {
        options.onError(error, variables, context);
      }
    },
  });
};
