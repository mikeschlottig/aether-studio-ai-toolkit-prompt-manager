import { create } from 'zustand';
import { persist } from 'zustand/middleware';
export interface Prompt {
  id: string;
  name: string;
  content: string;
  tags: string[];
  version: string;
  updatedAt: number;
}
export interface Script {
  id: string;
  name: string;
  code: string;
  language: 'python' | 'javascript' | 'sql';
  description: string;
  updatedAt: number;
}
interface AppState {
  prompts: Prompt[];
  scripts: Script[];
  addPrompt: (prompt: Omit<Prompt, 'id' | 'updatedAt'>) => void;
  updatePrompt: (id: string, updates: Partial<Prompt>) => void;
  deletePrompt: (id: string) => void;
  addScript: (script: Omit<Script, 'id' | 'updatedAt'>) => void;
  updateScript: (id: string, updates: Partial<Script>) => void;
  deleteScript: (id: string) => void;
}
export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      prompts: [
        {
          id: '1',
          name: 'Senior UI Architect',
          content: 'You are an expert UI/UX architect with 15 years of experience in React and Tailwind CSS...',
          tags: ['System', 'Design'],
          version: 'v1.4',
          updatedAt: Date.now() - 7200000,
        },
        {
          id: '2',
          name: 'SQL Query Optimizer',
          content: 'Analyze the following SQL query for performance bottlenecks and suggest optimizations...',
          tags: ['DevTools', 'Database'],
          version: 'v1.0',
          updatedAt: Date.now() - 86400000,
        },
      ],
      scripts: [
        {
          id: '1',
          name: 'Data Processor',
          code: 'def process_data(data):\n    return [x * 2 for x in data if x > 0]',
          language: 'python',
          description: 'Simple multiplier filter for numeric arrays.',
          updatedAt: Date.now() - 3600000,
        },
      ],
      addPrompt: (p) => set((state) => ({
        prompts: [{ ...p, id: crypto.randomUUID(), updatedAt: Date.now() }, ...state.prompts]
      })),
      updatePrompt: (id, updates) => set((state) => ({
        prompts: state.prompts.map((p) => p.id === id ? { ...p, ...updates, updatedAt: Date.now() } : p)
      })),
      deletePrompt: (id) => set((state) => ({
        prompts: state.prompts.filter((p) => p.id !== id)
      })),
      addScript: (s) => set((state) => ({
        scripts: [{ ...s, id: crypto.randomUUID(), updatedAt: Date.now() }, ...state.scripts]
      })),
      updateScript: (id, updates) => set((state) => ({
        scripts: state.scripts.map((s) => s.id === id ? { ...s, ...updates, updatedAt: Date.now() } : s)
      })),
      deleteScript: (id) => set((state) => ({
        scripts: state.scripts.filter((s) => s.id !== id)
      })),
    }),
    {
      name: 'aether-studio-storage',
    }
  )
);