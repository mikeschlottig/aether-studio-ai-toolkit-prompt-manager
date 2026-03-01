# Aether Studio

[cloudflarebutton]

A production-ready **Cloudflare Workers** template for building **AI agent chat applications** with intelligent tool usage, multi-model support, and **Model Context Protocol (MCP)** integration. Features real-time streaming conversations, session management via Durable Objects, and seamless Cloudflare deployment.

## 🚀 Features

- **Cloudflare Agents SDK** - Stateful agent management with Durable Objects
- **Official MCP TypeScript SDK** - Production MCP server integration
- **Multi-Model Support** - GPT-4o, Gemini 2.0/2.5, Claude (via Cloudflare AI Gateway)
- **Intelligent Tool Calling** - Automatic tool usage (D1, R2, Workers, Web browsing)
- **Real MCP Servers** - Cloudflare documentation, bindings, observability, browser tools
- **React + Vite** - Fast frontend with hot module replacement
- **Production UI** - Tailwind CSS + Shadcn/UI + Framer Motion
- **Session Management** - Persistent conversations with control plane Durable Object
- **Streaming Chat** - Real-time responses with tool visualization
- **TypeScript** - Full type safety end-to-end
- **Observability** - Built-in Cloudflare analytics and logging

## 🛠️ Tech Stack

| Frontend | Backend | Infrastructure |
|----------|---------|----------------|
| React 18 | Cloudflare Workers | Durable Objects |
| Vite 6 | Hono | Cloudflare MCP |
| Tailwind CSS | Agents SDK | Wrangler CLI |
| Shadcn/UI | OpenAI SDK | Bun Runtime |
| Framer Motion | MCP SDK | |

## 📦 Quick Start

### Prerequisites

- [Bun](https://bun.sh/) >= 1.0.0
- Cloudflare account
- Cloudflare AI Gateway configured (Gateway URL + API Key)

### Installation

```bash
# Clone the repo (or use the deploy button above)
git clone <your-repo-url>
cd aether-studio

# Install dependencies
bun install

# Copy environment template and add your keys
cp .env.example .env
# Edit .env with your CF_AI_BASE_URL and CF_AI_API_KEY

# Generate Cloudflare Workers types
bun run cf-typegen
```

### Development

```bash
# Start dev server (frontend + worker proxy)
bun run dev

# Open http://localhost:3000
```

### Build & Deploy

```bash
# Build for production
bun run build

# Deploy to Cloudflare
bun run deploy
```

## 📖 Usage

### Chat API

The template provides a complete chat system out of the box:

```
POST /api/chat/:sessionId/chat
{
  "message": "What's the weather in New York?",
  "model": "google-ai-studio/gemini-2.5-flash",
  "stream": true
}

GET /api/chat/:sessionId/messages
DELETE /api/chat/:sessionId/clear
POST /api/chat/:sessionId/model
```

### Session Management

```
GET /api/sessions          # List sessions
POST /api/sessions          # Create new session
DELETE /api/sessions/:id    # Delete session
PUT /api/sessions/:id/title # Rename session
```

### Extending Agents

1. **Add custom tools** in `worker/tools.ts`
2. **New MCP servers** in `worker/mcp-client.ts`
3. **Custom routes** in `worker/userRoutes.ts`

### MCP Tools (Built-in)

- **Cloudflare Docs**: Search official documentation
- **Cloudflare Browser**: Web browsing and content extraction
- **Cloudflare Bindings**: Query D1 databases, R2 buckets, Workers KV
- **Cloudflare Observability**: Worker analytics and metrics

## 🏗️ Architecture

```
Frontend (React + Vite)
     ↓ API Routes
Worker (Hono)
     ↓ Durable Objects
├── ChatAgent (CHAT_AGENT) - Conversation state + OpenAI
├── AppController (APP_CONTROLLER) - Session management
└── MCP Manager - Tool execution + servers
```

## ⚙️ Configuration

Edit `wrangler.jsonc`:

```json
{
  "vars": {
    "CF_AI_BASE_URL": "https://gateway.ai.cloudflare.com/v1/YOUR_ACCOUNT_ID/YOUR_GATEWAY_ID/openai",
    "CF_AI_API_KEY": "your-cloudflare-api-key"
  }
}
```

**Optional**: Add `SERPAPI_KEY` for web search tools.

## 🚀 Deployment

Deploy to Cloudflare Workers in **one command**:

```bash
bun run deploy
```

[cloudflarebutton]

**Production Ready Features**:
- Zero-config SPA asset handling
- Observability enabled
- Automatic Workers types generation
- Session persistence via Durable Objects

## 📱 Frontend Customization

1. **Routes**: Edit `src/main.tsx`
2. **Components**: `src/components/ui/*` (Shadcn)
3. **Chat Service**: `src/lib/chat.ts` (use existing APIs)
4. **Pages**: `src/pages/*` + `<Link to="/path" />`

**Key Integration Points**:
```tsx
// Use existing chat service
import { chatService } from '@/lib/chat';

// Send message with streaming
const response = await chatService.sendMessage(
  "Hello!", 
  "google-ai-studio/gemini-2.5-flash",
  (chunk) => onMessageChunk(chunk)
);
```

## 🤝 Contributing

1. Fork and clone
2. `bun install`
3. `bun run dev`
4. Create feature branch
5. PR to `main`

**Keep these files unchanged**:
```
- worker/index.ts (Core routing)
- wrangler.jsonc (DO bindings)
- vite.config.ts (Cloudflare plugin)
```

## 🔮 Roadmap

- [x] Multi-model support (Gemini 2.x)
- [x] MCP production servers
- [x] Streaming chat
- [ ] Voice input
- [ ] File uploads
- [ ] RAG integration

## 📄 License

MIT License - see [LICENSE](LICENSE) © [Your Name]