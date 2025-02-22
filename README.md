# create-mcp

A CLI tool that sets up a Model Control Protocol (MCP) server and deploys it to Cloudflare Workers so you can start making new tools for your Cursor Agent in minutes.

This is super useful if you want to add MCP tools to your Cursor Agent to call APIs or other services.

## Prerequisites

- A Cloudflare account with [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/) installed
- Claude Desktop App installed (because it uses [workers-mcp](https://github.com/cloudflare/workers-mcp) under the hood)

## Instructions

Make sure you are logged in to Wrangler by running `wrangler login`.

Create a new MCP server, just run:

```bash
bun create mcp
```

You can also pass a name to the server: `bun create mcp <server-name>`.

## The tool will

- Clone the template repository
- Install dependencies
- Initialize a Git repository
- Set up the MCP server
- Deploy a Cloudflare Workers with the same name as the server
- Add it to Claude Desktop
- Copy the MCP server command to your clipboard so you can paste it into Cursor

## Development

To start hacking on your MCP server:

```bash
cd <server-name>
bun dev
```

## How to write MCP tools

Edit the `src/index.ts` file to add new tools. Each method in the `MyWorker` class becomes an MCP tool that can be used by your Cursor Agent.

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

- The JSDoc comment's first line is the tool's description
- The `@param` tags are the tool's parameters, with their types and descriptions
- The `@return` tag is the tool's return value, with its type

To add a new tool:

1. Add a new method to the `MyWorker` class
2. Deploy your changes with `bun run deploy`
3. Click the refresh button in Cursor.

You should see your new tool.

## Deployment

Deployment to Cloudflare Workers happens automatically during setup.

For subsequent deployments:

```bash
bun run deploy
```

## Why Cloudflare Workers?

Honestly? Vibes and good DX. Also deployments are blazing fast.

I don't like running MCP servers locally, and I'm pretty sure you don't either. Now you don't have to run a node process if you just want to create and use minimal API wrapper MCP tools in Cursor.

All you have to do is write functions. Put your descriptions and params in JSDoc comments and it just works.

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
