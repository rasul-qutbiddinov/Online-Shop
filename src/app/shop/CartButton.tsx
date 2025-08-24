import { useState } from "react";
import { Button } from "antd";
import {
  PlusOutlined,
  MinusOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import type { Product } from "@/api/products/useGetProducts";
import { CartModal } from "./CartModal";
import { useCart } from "@/context/CartContext"; // ✅ endi contextdan keladi

type CartButtonProps = {
  product: Product;
};

export const CartButton = ({ product }: CartButtonProps) => {
  const { items, add, update, remove } = useCart();
  const [open, setOpen] = useState(false);

  const inCartItem = items.find((i) => i.id === product.id);
  const quantity = inCartItem?.quantity || 0;

  const handleAddToCart = () => {
    add(product, 1);
  };

  const increaseQuantity = () => {
    if (quantity < product.stock) {
      update(product.id, quantity + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      update(product.id, quantity - 1);
    } else if (quantity === 1) {
      remove(product.id);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {inCartItem ? (
        <>
          {/* Quantity control */}
          <div className="flex items-center gap-2">
            <Button
              icon={<MinusOutlined />}
              onClick={decreaseQuantity}
              disabled={quantity <= 0}
            />
            <span className="px-2">{quantity}</span>
            <Button
              icon={<PlusOutlined />}
              onClick={increaseQuantity}
              disabled={quantity >= product.stock}
            />
          </div>

          {/* Cart button */}
          <Button
            type="default"
            icon={<ShoppingCartOutlined />}
            onClick={() => setOpen(true)}
            className="flex items-center justify-center gap-1 rounded border px-3 py-1 hover:bg-gray-100"
          >
            Savatga o‘tish
          </Button>

          {/* Modal */}
          <CartModal open={open} onClose={() => setOpen(false)} />
        </>
      ) : (
        <Button type="primary" onClick={handleAddToCart}>
          + Savatga qo‘shish
        </Button>
      )}
    </div>
  );
};
