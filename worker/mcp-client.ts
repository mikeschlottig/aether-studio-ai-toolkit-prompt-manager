import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { SSEClientTransport } from '@modelcontextprotocol/sdk/client/sse.js';
import type { MCPServer } from './types';
interface MCPServerConfig {
  name: string;
  sseUrl: string;
}
export class MCPManager {
  private clients: Map<string, Client> = new Map();
  private transports: Map<string, SSEClientTransport> = new Map();
  private toolMap: Map<string, string> = new Map();
  private serverConfigs: MCPServerConfig[] = [];
  private initialized = false;
  /**
   * Dynamically update the servers available to the agent.
   * Closes existing connections to avoid memory leaks or stale tools.
   */
  async setServers(servers: MCPServer[]) {
    // Only refresh if the configs have actually changed or we haven't initialized
    const newConfigs = servers.map(s => ({ name: s.name, sseUrl: s.url }));
    const hasChanged = JSON.stringify(this.serverConfigs) !== JSON.stringify(newConfigs);
    if (!hasChanged && this.initialized) return;
    // Shutdown current connections
    for (const [name, client] of this.clients.entries()) {
      try {
        const transport = this.transports.get(name);
        if (transport) await transport.close();
      } catch (e) {
        console.error(`Error closing transport for ${name}:`, e);
      }
    }
    this.clients.clear();
    this.transports.clear();
    this.toolMap.clear();
    this.serverConfigs = newConfigs;
    this.initialized = false;
    await this.initialize();
  }
  async initialize() {
    if (this.initialized) return;
    for (const serverConfig of this.serverConfigs) {
      try {
        const transport = new SSEClientTransport(new URL(serverConfig.sseUrl));
        const client = new Client({
          name: 'aether-studio-agent',
          version: '1.0.0'
        }, {
          capabilities: {}
        });
        await client.connect(transport);
        this.clients.set(serverConfig.name, client);
        this.transports.set(serverConfig.name, transport);
        const toolsResult = await client.listTools();
        if (toolsResult?.tools) {
          for (const tool of toolsResult.tools) {
            this.toolMap.set(tool.name, serverConfig.name);
          }
        }
        console.log(`Connected to MCP server: ${serverConfig.name}`);
      } catch (error) {
        console.error(`Failed to connect to MCP server ${serverConfig.name}:`, error);
      }
    }
    this.initialized = true;
  }
  async getToolDefinitions() {
    await this.initialize();
    const allTools = [];
    for (const [serverName, client] of this.clients.entries()) {
      try {
        const toolsResult = await client.listTools();
        if (toolsResult?.tools) {
          for (const tool of toolsResult.tools) {
            allTools.push({
              type: 'function' as const,
              function: {
                name: tool.name,
                description: tool.description || '',
                parameters: tool.inputSchema || {
                  type: 'object',
                  properties: {},
                  required: []
                }
              }
            });
          }
        }
      } catch (error) {
        console.error(`Error getting tools from ${serverName}:`, error);
      }
    }
    return allTools;
  }
  async executeTool(toolName: string, args: Record<string, unknown>): Promise<string> {
    await this.initialize();
    const serverName = this.toolMap.get(toolName);
    if (!serverName) {
      throw new Error(`Tool ${toolName} not found in any MCP server`);
    }
    const client = this.clients.get(serverName);
    if (!client) {
      throw new Error(`Client for server ${serverName} not available`);
    }
    try {
      const result = await client.callTool({
        name: toolName,
        arguments: args
      });
      if (result.isError) {
        throw new Error(`Tool execution failed: ${Array.isArray(result.content) ? result.content.map((c: any) => c.text).join('\n') : 'Unknown error'}`);
      }
      if (Array.isArray(result.content)) {
        return result.content
          .filter((c: any) => c.type === 'text')
          .map((c: any) => c.text)
          .join('\n');
      }
      return 'No content returned';
    } catch (error) {
      throw new Error(`Tool execution failed: ${String(error)}`);
    }
  }
}
export const mcpManager = new MCPManager();