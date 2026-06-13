import { create } from 'zustand';

export interface Customer {
  id: string;
  name: string;
  city: string;
  totalSpent: number;
  lastOrder: string;
}

export interface Campaign {
  id: string;
  name: string;
  audience: string;
  status: 'Draft' | 'Sending' | 'Completed';
  sent: number;
  delivered: number;
  opened: number;
}

// 1. THIS IS THE BLUEPRINT. We must define initializeData here.
interface CrmState {
  customers: Customer[];
  campaigns: Campaign[];
  initializeData: () => Promise<void>; 
  addCampaign: (campaign: Campaign) => void;
  updateCampaignStats: (id: string, stats: Partial<Campaign>) => void;
}

// 2. THIS IS THE IMPLEMENTATION.
export const useCrmStore = create<CrmState>((set) => ({
  customers: [], 
  campaigns: [],
  
  initializeData: async () => {
    try {
      const response = await fetch('http://localhost:8000/api/customers');
      const data = await response.json();
      set({ customers: data });
    } catch (error) {
      console.error("Failed to fetch real customer dataset");
    }
  },

  addCampaign: (campaign) => 
    set((state) => ({ campaigns: [...state.campaigns, campaign] })),
    
  updateCampaignStats: (id, stats) =>
    set((state) => ({
      campaigns: state.campaigns.map(c => c.id === id ? { ...c, ...stats } : c)
    })),
}));