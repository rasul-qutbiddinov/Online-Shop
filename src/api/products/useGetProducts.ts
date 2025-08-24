// hooks/useGetProducts.ts
import { useQuery } from "@tanstack/react-query";
import axios from "@/api/axios";

export interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  category: string;
  isActive: boolean;
  createdAt: string;
}

export interface ProductsListResponse {
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  content: Product[];
}

interface FetchProductsParams {
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: "asc" | "desc";
  name?: string; // search filter
  category?: string; // category filter
  isActive?: boolean; // new filter
}

const fetchProducts = async ({
  page = 0,
  size = 10,
  sortBy = "id",
  sortDir = "asc",
  name,
  category,
  isActive, // qo‘shildi
}: FetchProductsParams) => {
  const res = await axios.get<{
    success: boolean;
    message: string;
    data: ProductsListResponse;
  }>("/products", {
    params: { page, size, sortBy, sortDir, name, category, isActive },
    headers: { "Accept-Language": "uz" },
  });

  return res.data.data;
};

export const useGetProducts = ({
  page,
  size,
  sortBy = "id",
  sortDir = "asc",
  name,
  category,
  isActive, // qo‘shildi
}: FetchProductsParams) => {
  return useQuery<ProductsListResponse>({
    queryKey: [
      "products",
      page,
      size,
      sortBy,
      sortDir,
      name,
      category,
      isActive,
    ],
    queryFn: () =>
      fetchProducts({ page, size, sortBy, sortDir, name, category, isActive }),
    meta: { keepPreviousData: true },
  });
};
