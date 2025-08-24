/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "@/api/axios";

// 🛒 Order item modeli
interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

// ➕ Order yaratish uchun yuboriladigan payload
export interface CreateOrderPayload {
  customerName: string;
  customerEmail: string;
  phone?: string;
  address?: string;
  orderItems: {
    productId: number;
    quantity: number;
  }[];
}

// 🔙 Backenddan qaytadigan order modeli
export interface OrderResponse {
  id: number;
  customerName: string;
  customerEmail: string;
  orderDate: string;
  status: "PENDING" | "CONFIRMED" | "DELIVERED" | "CANCELLED";
  totalAmount: number;
  orderItems: OrderItem[];
}

export const useCreateOrder = (options?: any) => {
  const queryClient = useQueryClient();

  return useMutation<OrderResponse, Error, CreateOrderPayload>({
    mutationFn: async (data: CreateOrderPayload) => {
      const res = await axios.post<{
        success: boolean;
        message: string;
        data: OrderResponse;
      }>("/orders", data, {
        headers: { "Accept-Language": "uz" },
      });
      return res.data.data;
    },
    onSuccess: (data, variables, context) => {
      // 🟢 Orders listni yangilash
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === "orders", 
      });

      // Tashqi callback ham ishlasin
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
