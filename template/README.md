# MCP Server

This is a Model Control Protocol (MCP) server bootstrapped using the [create-mcp](https://github.com/zueai/create-mcp) CLI.

## Installation

Run the automated setup script that will clone the worker and deploy it to your Cloudflare account:

```bash
bun create mcp --clone https://github.com/your-username/mcp-server-name
```

## Development

First, run the development server:

```bash
bun dev
```

Open Cursor and paste the MCP server command that was copied to your clipboard during setup. Don't forget to reload your Cursor window to use the updated tools.

## How to create new MCP tools

To create new MCP tools, add methods to the `MyWorker` class in `src/index.ts`. Each function will automatically become an MCP tool that your agent can use.

Example:

```typescript
/**
 * A warm, friendly greeting from your MCP server.
 * @param name {string} the name of the person we are greeting.
 * @return {string} the contents of our greeting.
 */
sayHello(name: string) {
    return `Hello from an MCP Worker, ${name}!`;
}
```

The JSDoc comments are important:

- First line becomes the tool's description
- `@param` tags define the tool's parameters with types and descriptions
- `@return` tag specifies the return value and type

## Deploying Changes

When you're ready to deploy your changes:

```bash
bun run deploy
```

Then reload your Cursor window to use the updated tools.

## About

This MCP server is deployed on [Cloudflare Workers](https://workers.cloudflare.com), providing:

- Edge computing performance
- Automatic scaling
- Zero cold starts
- Global distribution

## Learn More

To learn more about MCP and create-mcp, check out the following resources:

- [Model Control Protocol Documentation](https://modelcontextprotocol.io) - learn about MCP features and API.
- [create-mcp Documentation](https://github.com/zueai/create-mcp) - learn about create-mcp features and API.
- [workers-mcp](https://github.com/zueai/workers-mcp) - the underlying MCP implementation for Cloudflare Workers.

## Deploy on Cloudflare

To deploy your MCP server on Cloudflare, run the following command:

```bash
bun run deploy
```

Check out the [Cloudflare Workers documentation](https://developers.cloudflare.com/workers/) for more details.
