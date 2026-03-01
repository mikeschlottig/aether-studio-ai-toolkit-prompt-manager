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
export interface Skill {
  id: string;
  name: string;
  description: string;
  capability: string;
  updatedAt: number;
}
export interface CustomTool {
  id: string;
  name: string;
  type: 'json' | 'yaml' | 'baml' | 'worker';
  config: string;
  updatedAt: number;
}
export interface Shortcut {
  id: string;
  action: string;
  key: string;
}
interface AppState {
  isCommandPaletteOpen: boolean;
  prompts: Prompt[];
  scripts: Script[];
  skills: Skill[];
  customTools: CustomTool[];
  shortcuts: Shortcut[];
  setCommandPaletteOpen: (open: boolean) => void;
  addPrompt: (prompt: Omit<Prompt, 'id' | 'updatedAt'>) => void;
  updatePrompt: (id: string, updates: Partial<Prompt>) => void;
  deletePrompt: (id: string) => void;
  addScript: (script: Omit<Script, 'id' | 'updatedAt'>) => void;
  updateScript: (id: string, updates: Partial<Script>) => void;
  deleteScript: (id: string) => void;
  addSkill: (skill: Omit<Skill, 'id' | 'updatedAt'>) => void;
  updateSkill: (id: string, updates: Partial<Skill>) => void;
  deleteSkill: (id: string) => void;
  addCustomTool: (tool: Omit<CustomTool, 'id' | 'updatedAt'>) => void;
  updateCustomTool: (id: string, updates: Partial<CustomTool>) => void;
  deleteCustomTool: (id: string) => void;
  updateShortcut: (id: string, key: string) => void;
}
export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      isCommandPaletteOpen: false,
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
      skills: [
        {
          id: '1',
          name: 'Emotional Intelligence',
          description: 'Detects and adapts to the users emotional state in conversation.',
          capability: 'analyze_sentiment_and_adapt_tone()',
          updatedAt: Date.now(),
        }
      ],
      customTools: [],
      shortcuts: [
        { id: 'toggle-sidebar', action: 'Toggle Sidebar', key: 'b' },
        { id: 'new-chat', action: 'New Chat', key: 'n' },
        { id: 'command-palette', action: 'Command Palette', key: 'k' },
      ],
      setCommandPaletteOpen: (open) => set({ isCommandPaletteOpen: open }),
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
      addSkill: (s) => set((state) => ({
        skills: [{ ...s, id: crypto.randomUUID(), updatedAt: Date.now() }, ...state.skills]
      })),
      updateSkill: (id, updates) => set((state) => ({
        skills: state.skills.map((s) => s.id === id ? { ...s, ...updates, updatedAt: Date.now() } : s)
      })),
      deleteSkill: (id) => set((state) => ({
        skills: state.skills.filter((s) => s.id !== id)
      })),
      addCustomTool: (t) => set((state) => ({
        customTools: [{ ...t, id: crypto.randomUUID(), updatedAt: Date.now() }, ...state.customTools]
      })),
      updateCustomTool: (id, updates) => set((state) => ({
        customTools: state.customTools.map((t) => t.id === id ? { ...t, ...updates, updatedAt: Date.now() } : t)
      })),
      deleteCustomTool: (id) => set((state) => ({
        customTools: state.customTools.filter((t) => t.id !== id)
      })),
      updateShortcut: (id, key) => set((state) => ({
        shortcuts: state.shortcuts.map((s) => s.id === id ? { ...s, key } : s)
      })),
    }),
    {
      name: 'aether-studio-storage-v3',
    }
  )
);