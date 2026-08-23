'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

export type CartLine = { productId: string; qty: number };

type CartContextValue = {
  lines: CartLine[];
  add: (productId: string, stock: number) => void;
  setQty: (productId: string, qty: number, stock: number) => void;
  remove: (productId: string) => void;
  clear: () => void;
  count: number;
  qtyFor: (productId: string) => number;
};

const STORAGE_KEY = 'dkeramik-cart';
const CartContext = createContext<CartContextValue | null>(null);

function loadCart(): CartLine[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CartLine[];
    return Array.isArray(parsed) ? parsed.filter((l) => l.productId && l.qty > 0) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const skipPersist = useRef(true);

  useEffect(() => {
    setLines(loadCart());
  }, []);

  useEffect(() => {
    if (skipPersist.current) {
      skipPersist.current = false;
      return;
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      /* ignore */
    }
  }, [lines]);

  const add = useCallback((productId: string, stock: number) => {
    setLines((prev) => {
      const existing = prev.find((l) => l.productId === productId);
      if (!existing) {
        return [...prev, { productId, qty: Math.min(1, stock) }].filter((l) => l.qty > 0);
      }
      const qty = Math.min(existing.qty + 1, stock);
      return prev.map((l) => (l.productId === productId ? { ...l, qty } : l));
    });
  }, []);

  const setQty = useCallback((productId: string, qty: number, stock: number) => {
    const next = Math.max(0, Math.min(qty, stock));
    setLines((prev) => {
      if (next === 0) return prev.filter((l) => l.productId !== productId);
      if (!prev.some((l) => l.productId === productId)) {
        return [...prev, { productId, qty: next }];
      }
      return prev.map((l) => (l.productId === productId ? { ...l, qty: next } : l));
    });
  }, []);

  const remove = useCallback((productId: string) => {
    setLines((prev) => prev.filter((l) => l.productId !== productId));
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const count = lines.reduce((sum, l) => sum + l.qty, 0);
  const qtyFor = useCallback(
    (productId: string) => lines.find((l) => l.productId === productId)?.qty ?? 0,
    [lines],
  );

  const value = useMemo(
    () => ({ lines, add, setQty, remove, clear, count, qtyFor }),
    [lines, add, setQty, remove, clear, count, qtyFor],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
}
