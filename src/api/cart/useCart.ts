// hooks/useCart.ts
import { useState, useEffect } from "react";

export interface CartItem {
  id: number;
  name: string;
  price: number;
  stock: number;
  quantity: number;
}

const STORAGE_KEY = "cart_items";

export const useCart = () => {
  const [items, setItems] = useState<CartItem[]>([]);

  // localStorage'dan boshlang'ich yuklash
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setItems(JSON.parse(saved));
  }, []);

  // har o‘zgarishda localStorage ga yozish
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const add = (product: Omit<CartItem, "quantity">, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        );
      }
      return [...prev, { ...product, quantity }];
    });
  };

  const update = (id: number, quantity: number) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item)),
    );
  };

  const remove = (id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const clear = () => setItems([]);

  return { items, add, update, remove, clear };
};
