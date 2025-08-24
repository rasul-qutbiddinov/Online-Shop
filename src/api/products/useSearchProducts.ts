import { useQuery } from "@tanstack/react-query";
import axios from "@/api/axios";
import type { ProductsListResponse } from "@/api/products/useGetProducts";

interface SearchProductsParams {
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: "asc" | "desc";
  name?: string;
  category?: string;
}

const fetchProducts = async ({
  page = 0,
  size = 10,
  sortBy = "id",
  sortDir = "asc",
  name,
  category,
}: SearchProductsParams) => {
  const res = await axios.get<{
    success: boolean;
    message: string;
    data: ProductsListResponse;
  }>("/products/search", {
    params: { page, size, sortBy, sortDir, name, category },
    headers: { "Accept-Language": "uz" },
  });
  return res.data.data;
};

export const useProducts = (params: SearchProductsParams) => {
  return useQuery<ProductsListResponse>({
    queryKey: [
      "products",
      params.page,
      params.size,
      params.sortBy,
      params.sortDir,
      params.name,
      params.category,
    ],
    queryFn: () => fetchProducts(params),
  });
};
