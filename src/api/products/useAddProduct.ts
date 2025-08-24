/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "@/api/axios";

interface AddProductPayload {
  name: string;
  price: number;
  stock: number;
  category: string;
  isActive?: boolean;
}

interface AddProductResponse {
  success: boolean;
  message: string;
  data: any;
}

const addProduct = async (payload: AddProductPayload, lang: string = "uz") => {
  const res = await axios.post<AddProductResponse>("/products", payload, {
    headers: { "Accept-Language": lang },
  });
  return res.data;
};

export const useAddProduct = ({
  onSuccess,
  onError,
}: {
  onSuccess?: () => void;
  onError?: () => void;
} = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["add-product"],
    mutationFn: (payload: AddProductPayload) => addProduct(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      onSuccess?.();
    },
    onError: () => {
      onError?.();
    },
  });
};
