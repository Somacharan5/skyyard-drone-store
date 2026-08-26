import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';

const CartContext = createContext(null);
const STORAGE_KEY = 'dd_cart';

function readStoredCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(readStoredCart);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = useCallback((product, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === product.id);
      const maxQty = product.stock ?? 99;
      if (existing) {
        return prev.map((i) =>
          i.productId === product.id ? { ...i, qty: Math.min(i.qty + qty, maxQty) } : i
        );
      }
      return [
        ...prev,
        {
          productId: product.id,
          name: product.name,
          slug: product.slug,
          price: product.price,
          imageKey: product.imageKey,
          imageVariant: product.imageVariant,
          stock: product.stock,
          qty: Math.min(qty, maxQty),
        },
      ];
    });
  }, []);

  const removeItem = useCallback((productId) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  }, []);

  const updateQty = useCallback((productId, qty) => {
    setItems((prev) =>
      prev.map((i) =>
        i.productId === productId ? { ...i, qty: Math.max(1, Math.min(qty, i.stock ?? 99)) } : i
      )
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const { subtotal, count } = useMemo(() => {
    return items.reduce(
      (acc, i) => ({ subtotal: acc.subtotal + i.price * i.qty, count: acc.count + i.qty }),
      { subtotal: 0, count: 0 }
    );
  }, [items]);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQty, clearCart, subtotal, count }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
