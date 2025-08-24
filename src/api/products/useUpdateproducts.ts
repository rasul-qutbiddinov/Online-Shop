/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "@/api/axios";

interface UpdateProductResponse {
  success: boolean;
  message: string;
  data: any;
}

interface UpdateProductPayload {
  id: number;
  name?: string;
  price?: number;
  stock?: number;
  category?: string;
  isActive?: boolean;
}

const updateProduct = async (
  payload: UpdateProductPayload,
  lang: string = "uz",
) => {
  const res = await axios.put<UpdateProductResponse>(
    `/products/${payload.id}`,
    payload,
    {
      headers: { "Accept-Language": lang },
    },
  );
  return res.data;
};

export const useUpdateProduct = ({
  onSuccess,
  onError,
}: {
  onSuccess?: () => void;
  onError?: () => void;
} = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["update-product"],
    mutationFn: (payload: UpdateProductPayload) => updateProduct(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      onSuccess?.();
    },
    onError: () => {
      onError?.();
    },
  });
};
