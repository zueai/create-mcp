# create-mcp

A CLI tool that sets up a [Model Control Protocol (MCP)](https://modelcontextprotocol.io) server and deploys it to Cloudflare Workers so you can start making new tools for your Cursor Agent in minutes.

> Just write TypeScript functions with JSDoc comments to give your agent MCP tools.

## Prerequisites

- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/) installed and logged in with your Cloudflare account.
- Claude Desktop App installed. (This will be removed soon)

## Instructions

To scaffold and deploy a new MCP server, just run:

```bash
bun create mcp
```

You can also pass a name directly to the command: `bun create mcp --name <server-name>`.

## What this CLI does

- Clones the template worker repository into `<current-dir>/<server-name>`
- Installs dependencies
- Initializes a Git repository
- Deploys a Hello World MCP server to your Cloudflare account
- Adds it to Claude Desktop
- Copies the MCP server command to your clipboard so you can paste it into Cursor

## How to Use

Just add functions to the `MyWorker` class in `src/index.ts`. Each function will compile into an MCP tool.

For example:

```typescript
/**
 * A warm, friendly greeting from your new Workers MCP server.
 * @param name {string} the name of the person we are greeting.
 * @return {string} the contents of our greeting.
 */
sayHello(name: string) {
    return `Hello from an MCP Worker, ${name}!`;
}
```

- The first line is the tool's description.
- The `@param` tags are the tool's params, with types and descriptions.
- The `@return` tag is the tool's return value, with its type.

## Deploying Changes

1. Redeploy the worker:

```bash
bun run deploy
```

2. Reload your Cursor window.

Now you can ask your agent to use the new tool!

## Why Cloudflare Workers?

Vibes, great DX, and blazing fast deployments.

I don't like running MCP servers locally, and I'm pretty sure you don't either. Now we don't have to run node processes to use simple MCP tools in Cursor that call APIs.

All you have to do is write functions. Put your descriptions and params in JSDoc comments and it just works.

## Example Servers made with create-mcp

- [Neon](https://github.com/zueai/neon-mcp)
- [Cloudflare](https://github.com/zueai/cloudflare-api-mcp)
- [Vercel](https://github.com/zueai/vercel-api-mcp)
- [WorkOS](https://github.com/zueai/workos-mcp)

You can clone and deploy any MCP server made with create-mcp to your own Cloudflare account:

```bash
bun create mcp --clone <github-url>
```

## Contributing

Contributions and feedback are extremely welcome! Please feel free to submit a Pull Request or open an issue!

## Acknowledgements

This project would not be possible without [workers-mcp](https://github.com/cloudflare/workers-mcp) made by [@geelen](https://github.com/geelen)
