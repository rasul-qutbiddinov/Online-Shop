import { useQuery } from "@tanstack/react-query";
import axios from "@/api/axios";

// ================= TYPES =================
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
  status: "PENDING" | "CONFIRMED" | "DELIVERED" | "CANCELLED";
  totalAmount: number;
  orderItems: OrderItem[];
}

export interface OrdersListResponse {
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  content: Order[];
  first: boolean;
  last: boolean;
  empty: boolean;
}

interface FetchOrdersParams {
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: "asc" | "desc";
  customerName?: string; // 🔍 mijoz bo‘yicha qidirish
  status?: string; // 🟢 holat filter
}

// ================= API FUNCS =================
const fetchOrders = async ({
  page = 0,
  size = 10,
  sortBy = "orderDate",
  sortDir = "desc",
  customerName,
  status,
}: FetchOrdersParams) => {
  const res = await axios.get<{
    success: boolean;
    message: string;
    data: OrdersListResponse;
  }>("/orders", {
    params: { page, size, sortBy, sortDir, customerName, status },
    headers: { "Accept-Language": "uz" },
  });

  return res.data.data;
};

const fetchOrderById = async (id: string | number) => {
  const res = await axios.get<{
    success: boolean;
    message: string;
    data: Order;
  }>(`/orders/${id}`, {
    headers: { "Accept-Language": "uz" },
  });

  return res.data.data;
};

// ================= HOOKS =================
export const useGetOrders = ({
  page,
  size,
  sortBy = "orderDate",
  sortDir = "desc",
  customerName,
  status,
}: FetchOrdersParams) => {
  return useQuery<OrdersListResponse>({
    queryKey: ["orders", page, size, sortBy, sortDir, customerName, status],
    queryFn: () =>
      fetchOrders({ page, size, sortBy, sortDir, customerName, status }),
    meta: { keepPreviousData: true },
  });
};

export const useGetOrder = (id: string | number) => {
  return useQuery<Order>({
    queryKey: ["order", id],
    queryFn: () => fetchOrderById(id),
    enabled: !!id, // faqat id bo‘lsa ishlaydi
  });
};
