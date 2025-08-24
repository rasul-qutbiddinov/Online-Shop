/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "@/api/axios";

interface DeleteProductResponse {
  success: boolean;
  message: string;
  data: any;
}

const deleteProduct = async (id: number, lang: string = "uz") => {
  const res = await axios.delete<DeleteProductResponse>(`/products/${id}`, {
    headers: {
      "Accept-Language": lang,
    },
  });
  return res.data;
};

export const useDeleteProduct = ({
  onSuccess,
  onError,
}: {
  onSuccess?: () => void;
  onError?: () => void;
} = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["delete-product"],
    mutationFn: ({ id, lang = "uz" }: { id: number; lang?: string }) =>
      deleteProduct(id, lang),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      onSuccess?.();
    },
    onError: () => {
      onError?.();
    },
  });
};
