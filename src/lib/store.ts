import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Prompt, Script, MCPServer } from '../../worker/types';
export type { Prompt, Script, MCPServer };
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
  mcpServers: MCPServer[];
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
  addMCPServer: (server: Omit<MCPServer, 'id' | 'updatedAt'>) => void;
  updateMCPServer: (id: string, updates: Partial<MCPServer>) => void;
  deleteMCPServer: (id: string) => void;
  updateShortcut: (id: string, key: string) => void;
}
const syncWithServer = async (endpoint: string, data: any) => {
  try {
    const response = await fetch(`/api/${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error(`Sync failed: ${response.status}`);
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
      mcpServers: [],
      shortcuts: [
        { id: 'toggle-sidebar', action: 'Toggle Sidebar', key: 'b' },
        { id: 'new-chat', action: 'New Chat', key: 'n' },
        { id: 'command-palette', action: 'Command Palette', key: 'k' },
      ],
      setCommandPaletteOpen: (open) => set({ isCommandPaletteOpen: open }),
      initialize: async () => {
        try {
          const [pRes, sRes, mRes] = await Promise.all([
            fetch('/api/prompts').then(r => r.json()).catch(() => ({ success: false })),
            fetch('/api/scripts').then(r => r.json()).catch(() => ({ success: false })),
            fetch('/api/mcp').then(r => r.json()).catch(() => ({ success: false }))
          ]);
          if (pRes.success) set({ prompts: pRes.data || [] });
          if (sRes.success) set({ scripts: sRes.data || [] });
          if (mRes.success) set({ mcpServers: mRes.data || [] });
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
      addSkill: (s) => {
        const newSkills = [{ ...s, id: crypto.randomUUID(), updatedAt: Date.now() }, ...get().skills];
        set({ skills: newSkills });
      },
      updateSkill: (id, updates) => {
        const newSkills = get().skills.map((s) => s.id === id ? { ...s, ...updates, updatedAt: Date.now() } : s);
        set({ skills: newSkills });
      },
      deleteSkill: (id) => {
        const newSkills = get().skills.filter((s) => s.id !== id);
        set({ skills: newSkills });
      },
      addCustomTool: (t) => {
        const newTools = [{ ...t, id: crypto.randomUUID(), updatedAt: Date.now() }, ...get().customTools];
        set({ customTools: newTools });
      },
      updateCustomTool: (id, updates) => {
        const newTools = get().customTools.map((t) => t.id === id ? { ...t, ...updates, updatedAt: Date.now() } : t);
        set({ customTools: newTools });
      },
      deleteCustomTool: (id) => {
        const newTools = get().customTools.filter((t) => t.id !== id);
        set({ customTools: newTools });
      },
      addMCPServer: (s) => {
        const newServers = [{ ...s, id: crypto.randomUUID(), updatedAt: Date.now() }, ...get().mcpServers];
        set({ mcpServers: newServers });
        syncWithServer('mcp', newServers);
      },
      updateMCPServer: (id, updates) => {
        const newServers = get().mcpServers.map((s) => s.id === id ? { ...s, ...updates, updatedAt: Date.now() } : s);
        set({ mcpServers: newServers });
        syncWithServer('mcp', newServers);
      },
      deleteMCPServer: (id) => {
        const newServers = get().mcpServers.filter((s) => s.id !== id);
        set({ mcpServers: newServers });
        syncWithServer('mcp', newServers);
      },
      updateShortcut: (id, key) => set((state) => ({
        shortcuts: state.shortcuts.map((s) => s.id === id ? { ...s, key } : s)
      })),
    }),
    {
      name: 'aether-studio-persistence-v5',
    }
  )
);