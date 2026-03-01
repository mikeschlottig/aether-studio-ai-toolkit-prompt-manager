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
  isHydrated: boolean;
  prompts: Prompt[];
  scripts: Script[];
  skills: Skill[];
  customTools: CustomTool[];
  shortcuts: Shortcut[];
  setCommandPaletteOpen: (open: boolean) => void;
  initialize: () => Promise<void>;
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
const syncWithServer = async (endpoint: string, data: any) => {
  try {
    await fetch(`/api/${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  } catch (e) {
    console.error(`Failed to sync ${endpoint}`, e);
  }
};
export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      isCommandPaletteOpen: false,
      isHydrated: false,
      prompts: [],
      scripts: [],
      skills: [],
      customTools: [],
      shortcuts: [
        { id: 'toggle-sidebar', action: 'Toggle Sidebar', key: 'b' },
        { id: 'new-chat', action: 'New Chat', key: 'n' },
        { id: 'command-palette', action: 'Command Palette', key: 'k' },
      ],
      setCommandPaletteOpen: (open) => set({ isCommandPaletteOpen: open }),
      initialize: async () => {
        try {
          const [pRes, sRes] = await Promise.all([
            fetch('/api/prompts').then(r => r.json()),
            fetch('/api/scripts').then(r => r.json())
          ]);
          if (pRes.success) set({ prompts: pRes.data });
          if (sRes.success) set({ scripts: sRes.data });
          set({ isHydrated: true });
        } catch (e) {
          console.error('Initialization failed', e);
        }
      },
      addPrompt: (p) => {
        const newPrompts = [{ ...p, id: crypto.randomUUID(), updatedAt: Date.now() }, ...get().prompts];
        set({ prompts: newPrompts });
        syncWithServer('prompts', newPrompts);
      },
      updatePrompt: (id, updates) => {
        const newPrompts = get().prompts.map((p) => p.id === id ? { ...p, ...updates, updatedAt: Date.now() } : p);
        set({ prompts: newPrompts });
        syncWithServer('prompts', newPrompts);
      },
      deletePrompt: (id) => {
        const newPrompts = get().prompts.filter((p) => p.id !== id);
        set({ prompts: newPrompts });
        syncWithServer('prompts', newPrompts);
      },
      addScript: (s) => {
        const newScripts = [{ ...s, id: crypto.randomUUID(), updatedAt: Date.now() }, ...get().scripts];
        set({ scripts: newScripts });
        syncWithServer('scripts', newScripts);
      },
      updateScript: (id, updates) => {
        const newScripts = get().scripts.map((s) => s.id === id ? { ...s, ...updates, updatedAt: Date.now() } : s);
        set({ scripts: newScripts });
        syncWithServer('scripts', newScripts);
      },
      deleteScript: (id) => {
        const newScripts = get().scripts.filter((s) => s.id !== id);
        set({ scripts: newScripts });
        syncWithServer('scripts', newScripts);
      },
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
      name: 'aether-studio-persistence-v4',
    }
  )
);