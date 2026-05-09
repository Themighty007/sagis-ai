import { create } from "zustand";

export interface Student {
  id: string;
  name: string;
  scores: Record<string, Record<string, number>>;
  attendance: number;
  intelligence: {
    average: number;
    rank: number;
    strongSubjects: string[];
    weakSubjects: string[];
    feedback: Record<string, string>;
  };
}

interface Analytics {
  overallAverage: number;
  subjectPerformance: { name: string; avg: number }[];
}

interface State {
  students: Student[];
  analytics: Analytics | null;
  loading: boolean;
  view: 'landing' | 'dashboard';
  dashboardTab: 'command' | 'risk' | 'students' | 'curriculum';
  selectedStudent: Student | null;
  fetchData: () => Promise<void>;
  setSelectedStudent: (student: Student | null) => void;
  setView: (view: 'landing' | 'dashboard') => void;
  setDashboardTab: (tab: 'command' | 'risk' | 'students' | 'curriculum') => void;
}

export const useStore = create<State>((set) => ({
  students: [],
  analytics: null,
  loading: false,
  view: 'landing',
  dashboardTab: 'command',
  selectedStudent: null,
  fetchData: async () => {
    set({ loading: true });
    try {
      const res = await fetch("/api/students");
      const data = await res.json();
      set({ 
        students: data.students || [], 
        analytics: data.classAnalytics || null,
        loading: false 
      });
    } catch (e) {
      console.error("Failed to fetch student data", e);
      set({ loading: false });
    }
  },
  setSelectedStudent: (student) => set({ selectedStudent: student }),
  setView: (view) => set({ view }),
  setDashboardTab: (dashboardTab) => set({ dashboardTab }),
}));
