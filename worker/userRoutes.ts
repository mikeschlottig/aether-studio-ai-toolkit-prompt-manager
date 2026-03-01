import { Hono } from "hono";
import { getAgentByName } from 'agents';
import { ChatAgent } from './agent';
import { API_RESPONSES } from './config';
import { Env, getAppController, registerSession, unregisterSession } from "./core-utils";
export function coreRoutes(app: Hono<{ Bindings: Env }>) {
    app.all('/api/chat/:sessionId/*', async (c) => {
        try {
            const sessionId = c.req.param('sessionId');
            const agent = await getAgentByName<Env, ChatAgent>(c.env.CHAT_AGENT, sessionId);
            const url = new URL(c.req.url);
            url.pathname = url.pathname.replace(`/api/chat/${sessionId}`, '');
            return agent.fetch(new Request(url.toString(), {
                method: c.req.method,
                headers: c.req.header(),
                body: c.req.method === 'GET' || c.req.method === 'DELETE' ? undefined : c.req.raw.body
            }));
        } catch (error) {
            console.error('Agent routing error:', error);
            return c.json({ success: false, error: API_RESPONSES.AGENT_ROUTING_FAILED }, { status: 500 });
        }
    });
}
export function userRoutes(app: Hono<{ Bindings: Env }>) {
    app.get('/api/sessions', async (c) => {
        const controller = getAppController(c.env);
        const sessions = await controller.listSessions();
        return c.json({ success: true, data: sessions });
    });
    app.post('/api/sessions', async (c) => {
        const body = await c.req.json();
        const sessionId = body.sessionId || crypto.randomUUID();
        const controller = getAppController(c.env);
        await controller.addSession(sessionId, body.title);
        return c.json({ success: true, data: { sessionId } });
    });
    app.delete('/api/sessions/:sessionId', async (c) => {
        const sessionId = c.req.param('sessionId');
        const controller = getAppController(c.env);
        const deleted = await controller.removeSession(sessionId);
        return c.json({ success: true, deleted });
    });
    // Unified Asset Management
    app.get('/api/prompts', async (c) => {
        const controller = getAppController(c.env);
        const prompts = await controller.getPrompts();
        return c.json({ success: true, data: prompts });
    });
    app.post('/api/prompts', async (c) => {
        const prompts = await c.req.json();
        const controller = getAppController(c.env);
        await controller.savePrompts(prompts);
        return c.json({ success: true });
    });
    app.get('/api/scripts', async (c) => {
        const controller = getAppController(c.env);
        const scripts = await controller.getScripts();
        return c.json({ success: true, data: scripts });
    });
    app.post('/api/scripts', async (c) => {
        const scripts = await c.req.json();
        const controller = getAppController(c.env);
        await controller.saveScripts(scripts);
        return c.json({ success: true });
    });
    app.delete('/api/workspace/purge', async (c) => {
        const controller = getAppController(c.env);
        await controller.purgeWorkspace();
        return c.json({ success: true, message: 'Workspace purged' });
    });
}