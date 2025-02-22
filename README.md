# create-mcp

A CLI tool that sets up a Model Control Protocol (MCP) server and deploys it to Cloudflare Workers so you can start making new tools for your Cursor Agent in minutes.

> Just write TypeScript functions with JSDoc comments to give your agent MCP tools.

## Prerequisites

- A Cloudflare account with [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/) installed. You can make sure you are logged in to Wrangler by running `wrangler login`.
- Claude Desktop App installed (because it uses workers-mcp under the hood)

## Instructions

To create a new MCP server, just run:

```bash
bun create mcp
```

You can also pass a name to the server: `bun create mcp <server-name>`.

## What this CLI does

- Clones the template worker repository into `<current-dir>/<server-name>`
- Installs dependencies
- Initializes a Git repository
- Sets up the MCP server using [workers-mcp](https://github.com/cloudflare/workers-mcp)
- Deploys a Cloudflare Worker with the same name as the server
- Adds it to Claude Desktop
- Copies the MCP server command to your clipboard so you can paste it into Cursor

## Development

To start hacking on your MCP server:

```bash
cd <server-name>
bun dev
```

## How to Use

Just add functions to the `MyWorker` class in `src/index.ts`.

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

Honestly? Vibes and good DX. Also deployments are blazing fast.

I don't like running MCP servers locally, and I'm pretty sure you don't either. Now you don't have to run a node process if you just want to create and use minimal API wrapper MCP tools in Cursor.

All you have to do is write functions. Put your descriptions and params in JSDoc comments and it just works.

## Contributing

Contributions and feedback are extremely welcome! Please feel free to submit a Pull Request or open an issue!
