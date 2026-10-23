import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Product } from "./data/catalog";

export type BagLine = { product: Product; quantity: number };

type StoreValue = {
  bag: BagLine[];
  bagOpen: boolean;
  setBagOpen: (open: boolean) => void;
  addToBag: (product: Product) => void;
  removeFromBag: (id: string) => void;
  setQuantity: (id: string, quantity: number) => void;
  bagCount: number;
  bagTotal: number;
};

const StoreContext = createContext<StoreValue | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [bag, setBag] = useState<BagLine[]>(() => {
    try {
      const cached = localStorage.getItem("drip-essential-bag");
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  });
  const [bagOpen, setBagOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("drip-essential-bag", JSON.stringify(bag));
  }, [bag]);

  const value = useMemo<StoreValue>(() => ({
    bag,
    bagOpen,
    setBagOpen,
    addToBag: (product) => {
      setBag((current) => {
        const found = current.find((line) => line.product.id === product.id);
        return found
          ? current.map((line) => line.product.id === product.id ? { ...line, quantity: line.quantity + 1 } : line)
          : [...current, { product, quantity: 1 }];
      });
      setBagOpen(true);
    },
    removeFromBag: (id) => setBag((current) => current.filter((line) => line.product.id !== id)),
    setQuantity: (id, quantity) => setBag((current) => quantity < 1
      ? current.filter((line) => line.product.id !== id)
      : current.map((line) => line.product.id === id ? { ...line, quantity } : line)),
    bagCount: bag.reduce((sum, line) => sum + line.quantity, 0),
    bagTotal: bag.reduce((sum, line) => sum + line.product.price * line.quantity, 0),
  }), [bag, bagOpen]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const value = useContext(StoreContext);
  if (!value) throw new Error("useStore must be used inside StoreProvider");
  return value;
}
