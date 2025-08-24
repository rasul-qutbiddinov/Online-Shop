import { useQuery } from "@tanstack/react-query";
import api from "@/api/axios"; // axios instance (default export)

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

export const useCustomerOrders = (email?: string) => {
  return useQuery<OrdersResponse>({
    queryKey: ["customerOrders", email], // ✅ har bir user uchun alohida cache
    queryFn: async () => {
      const { data } = await api.get<OrdersResponse>(
        `/orders/customer/${encodeURIComponent(email!)}`,
        {
          headers: { "Accept-Language": "uz" },
        },
      );
      return data;
    },
    enabled: Boolean(email), // ✅ email bo‘lsa query ishlaydi
    staleTime: 1000 * 60 * 2, // 2 daqiqa cache valid
    gcTime: 1000 * 60 * 10, // 10 daqiqadan keyin garbage collect
  });
};
