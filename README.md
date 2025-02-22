# create-mcp

[![smithery badge](https://smithery.ai/badge/@zueai/create-mcp)](https://smithery.ai/server/@zueai/create-mcp)

A CLI tool that sets up a Model Control Protocol (MCP) server and deploys it to Cloudflare Workers so you can start making new tools for your Cursor Agent in minutes.

This is super useful if you want to add MCP tools to your Cursor Agent to call APIs or other services.

## Prerequisites

- A Cloudflare account with [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/) installed. You can make sure you are logged in to Wrangler by running `wrangler login`.
- Claude Desktop App installed (because it uses [workers-mcp](https://github.com/cloudflare/workers-mcp) under the hood)

## Instructions

### Installing via Smithery

To install Create MCP for Claude Desktop automatically via [Smithery](https://smithery.ai/server/@zueai/create-mcp):

```bash
npx -y @smithery/cli install @zueai/create-mcp --client claude
```

To create a new MCP server, just run:

```bash
bun create mcp
```

You can also pass a name to the server: `bun create mcp <server-name>`.

## Development

To start hacking on your MCP server:

```bash
cd <server-name>
bun dev
```

## How to write MCP tools

Edit the `src/index.ts` file to add a new method to the `MyWorker` class, each method compiles into an MCP tool.

For example, in the `sayHello` function that you'll find in the `src/index.ts` file:

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

- The JSDoc comment's first line is the tool's description.
- The `@param` tags are the tool's parameters, with their types and descriptions.
- The `@return` tag is the tool's return value, with its type.

## Deploying Changes

1. Redeploy the worker:

```bash
bun run deploy
```

2. Refresh your Cursor Window and click the refresh icon next to the MCP server name.

Now you can ask your agent to use the new tool!

## Why Cloudflare Workers?

Honestly? Vibes and good DX. Also deployments are blazing fast.

I don't like running MCP servers locally, and I'm pretty sure you don't either. Now you don't have to run a node process if you just want to create and use minimal API wrapper MCP tools in Cursor.

All you have to do is write functions. Put your descriptions and params in JSDoc comments and it just works.

## What this CLI does

- Clone the template repository into `<current-dir>/<server-name>`
- Install dependencies
- Initialize a Git repository
- Set up the MCP server
- Deploy a Cloudflare Workers with the same name as the server
- Add it to Claude Desktop
- Copy the MCP server command to your clipboard so you can paste it into Cursor

## Contributing

Contributions and feedback are extremely welcome! Please feel free to submit a Pull Request or open an issue!
