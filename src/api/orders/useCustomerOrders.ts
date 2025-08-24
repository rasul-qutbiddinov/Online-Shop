import { useQuery } from "@tanstack/react-query";
import api from "@/api/axios"; // default export bo‘lgani uchun {} ishlatmaymiz

export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Order {
  id: number;
  customerName: string;
  customerEmail: string;
  orderDate: string;
  status: string;
  totalAmount: number;
  orderItems: OrderItem[];
}

export interface OrdersResponse {
  success: boolean;
  message: string;
  data: Order[];
}

export const useCustomerOrders = (email: string) => {
  return useQuery<OrdersResponse>({
    queryKey: ["customerOrders", email],
    queryFn: async () => {
      const res = await api.get<OrdersResponse>(
        `/orders/customer/${encodeURIComponent(email)}`,
        {
          headers: { "Accept-Language": "uz" },
        },
      );
      return res.data;
    },
    enabled: !!email, // email bo‘lsa query ishlaydi
  });
};
