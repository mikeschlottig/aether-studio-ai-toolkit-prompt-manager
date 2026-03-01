import { DurableObject } from 'cloudflare:workers';
import type { SessionInfo, Prompt, Script } from './types';
import type { Env } from './core-utils';
export class AppController extends DurableObject<Env> {
  private sessions = new Map<string, SessionInfo>();
  private prompts: Prompt[] = [];
  private scripts: Script[] = [];
  private loaded = false;
  constructor(ctx: DurableObjectState, env: Env) {
    super(ctx, env);
  }
  private async ensureLoaded(): Promise<void> {
    if (!this.loaded) {
      const storedSessions = await this.ctx.storage.get<Record<string, SessionInfo>>('sessions') || {};
      this.sessions = new Map(Object.entries(storedSessions));
      this.prompts = await this.ctx.storage.get<Prompt[]>('prompts') || [];
      this.scripts = await this.ctx.storage.get<Script[]>('scripts') || [];
      this.loaded = true;
    }
  }
  private async persistSessions(): Promise<void> {
    await this.ctx.storage.put('sessions', Object.fromEntries(this.sessions));
  }
  async addSession(sessionId: string, title?: string): Promise<void> {
    await this.ensureLoaded();
    const now = Date.now();
    this.sessions.set(sessionId, {
      id: sessionId,
      title: title || `Chat ${new Date(now).toLocaleDateString()}`,
      createdAt: now,
      lastActive: now
    });
    await this.persistSessions();
  }
  async removeSession(sessionId: string): Promise<boolean> {
    await this.ensureLoaded();
    const deleted = this.sessions.delete(sessionId);
    if (deleted) await this.persistSessions();
    return deleted;
  }
  async updateSessionActivity(sessionId: string): Promise<void> {
    await this.ensureLoaded();
    const session = this.sessions.get(sessionId);
    if (session) {
      session.lastActive = Date.now();
      await this.persistSessions();
    }
  }
  async updateSessionTitle(sessionId: string, title: string): Promise<boolean> {
    await this.ensureLoaded();
    const session = this.sessions.get(sessionId);
    if (session) {
      session.title = title;
      await this.persistSessions();
      return true;
    }
    return false;
  }
  async listSessions(): Promise<SessionInfo[]> {
    await this.ensureLoaded();
    return Array.from(this.sessions.values()).sort((a, b) => b.lastActive - a.lastActive);
  }
  async getSessionCount(): Promise<number> {
    await this.ensureLoaded();
    return this.sessions.size;
  }
  async clearAllSessions(): Promise<number> {
    await this.ensureLoaded();
    const count = this.sessions.size;
    this.sessions.clear();
    await this.persistSessions();
    return count;
  }
  // Workspace Asset Management
  async getPrompts(): Promise<Prompt[]> {
    await this.ensureLoaded();
    return this.prompts;
  }
  async savePrompts(prompts: Prompt[]): Promise<void> {
    await this.ensureLoaded();
    this.prompts = prompts;
    await this.ctx.storage.put('prompts', prompts);
  }
  async getScripts(): Promise<Script[]> {
    await this.ensureLoaded();
    return this.scripts;
  }
  async saveScripts(scripts: Script[]): Promise<void> {
    await this.ensureLoaded();
    this.scripts = scripts;
    await this.ctx.storage.put('scripts', scripts);
  }
  async purgeWorkspace(): Promise<void> {
    await this.ensureLoaded();
    this.prompts = [];
    this.scripts = [];
    this.sessions.clear();
    await this.ctx.storage.delete(['prompts', 'scripts', 'sessions']);
  }
}