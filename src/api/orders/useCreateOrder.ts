/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, type UseMutationResult } from "@tanstack/react-query";
import api from "../axios";

// Individual order item
export interface OrderItemPayload {
  productId: number | string;
  quantity: number;
}

// Full order payload
export interface OrderPayload {
  customerName: string;
  customerEmail: string;
  orderItems: OrderItemPayload[];
}

// Response from API
export interface OrderResponse {
  success: boolean;
  message: string;
  data: {
    id: number;
    customerName: string;
    customerEmail: string;
    orderDate: string;
    status: string;
    totalAmount: number;
    orderItems: {
      id: number;
      productId: number;
      productName: string;
      quantity: number;
      unitPrice: number;
      totalPrice: number;
    }[];
  };
}

// Hook
export const useCreateOrder = (): UseMutationResult<
  OrderResponse,
  any,
  OrderPayload
> => {
  return useMutation<OrderResponse, any, OrderPayload>({
    mutationFn: async (payload: OrderPayload) => {
      // ✅ Frontend validation
      if (!payload.customerName || !payload.customerEmail) {
        throw new Error("Iltimos, ism va email maydonlarini to‘ldiring.");
      }
      if (!payload.orderItems || payload.orderItems.length === 0) {
        throw new Error("Buyurtma uchun kamida bitta mahsulot kerak.");
      }

      const res = await api.post<OrderResponse>("/orders", payload, {
        headers: { "Accept-Language": "uz" },
      });

      return res.data;
    },
  });
};
