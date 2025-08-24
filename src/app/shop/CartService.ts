// utils/CartService.ts
export type CartItem = {
  id: number;
  name: string;
  price: number;
  stock: number;
  quantity: number;
};

const CART_KEY = "cart_items";

// LocalStorage-dan olish
export const getCart = (): CartItem[] => {
  const stored = localStorage.getItem(CART_KEY);
  return stored ? JSON.parse(stored) : [];
};

// Qo‘shish
export const addToCart = (product: CartItem) => {
  const cart = getCart();
  const exists = cart.find((item) => item.id === product.id);

  if (exists) {
    exists.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  return cart;
};

// O‘chirish
export const removeFromCart = (id: number) => {
  const cart = getCart().filter((item) => item.id !== id);
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  return cart;
};

// Quantity yangilash
export const updateQuantity = (id: number, quantity: number) => {
  const cart = getCart().map((item) =>
    item.id === id ? { ...item, quantity } : item,
  );
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  return cart;
};
