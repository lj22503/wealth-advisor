import { create } from 'zustand';
import type { Client, Holding, Fund } from '@/types';

interface AppState {
  // 当前用户
  currentUser: any | null;
  setCurrentUser: (user: any) => void;

  // 当前选中的客户
  selectedClient: Client | null;
  setSelectedClient: (client: Client | null) => void;

  // 数据缓存
  clients: Client[];
  setClients: (clients: Client[]) => void;

  holdings: Record<string, Holding[]>; // keyed by clientId
  setHoldings: (clientId: string, holdings: Holding[]) => void;

  funds: Fund[];
  setFunds: (funds: Fund[]) => void;

  // UI 状态
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;

  loading: boolean;
  setLoading: (loading: boolean) => void;

  error: string | null;
  setError: (error: string | null) => void;
}

export const useAppStore = create<AppState>((set) => ({
  // 当前用户
  currentUser: null,
  setCurrentUser: (user) => set({ currentUser: user }),

  // 当前选中的客户
  selectedClient: null,
  setSelectedClient: (client) => set({ selectedClient: client }),

  // 数据缓存
  clients: [],
  setClients: (clients) => set({ clients }),

  holdings: {},
  setHoldings: (clientId, holdings) =>
    set((state) => ({
      holdings: {
        ...state.holdings,
        [clientId]: holdings,
      },
    })),

  funds: [],
  setFunds: (funds) => set({ funds }),

  // UI 状态
  sidebarCollapsed: false,
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),

  loading: false,
  setLoading: (loading) => set({ loading }),

  error: null,
  setError: (error) => set({ error }),
}));
