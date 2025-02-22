# create-mcp

A CLI tool that quickly scaffolds and deploys a Model Control Protocol (MCP) server to Cloudflare Workers so you can start adding new tools to your Cursor Agent in minutes. This is super useful if you want to add API wrapper tools to your Cursor Agent instantly.

## Prerequisites

- A Cloudflare account with [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/) installed
- Claude Desktop App installed (because it uses [workers-mcp](https://github.com/cloudflare/workers-mcp) under the hood)

## Instructions

Make sure you are logged in to Wrangler by running `wrangler login`.

Create a new MCP server, just run:

```bash
bun create mcp
```

You can also pass a name to the server by running `bun create mcp <server-name>`.

## The tool will

- Clone the template repository
- Install dependencies
- Initialize a Git repository
- Deploy it to Cloudflare Workers
- Configure the MCP server with Claude Desktop
- Copy the MCP server command to your clipboard so you can paste it into Cursor

## Development

To start hacking on your MCP server just run:

```bash
cd <server-name>
bun dev
```

## Writing MCP Tools

Start by editing the `src/index.ts` file. Each method in the `MyWorker` class becomes an MCP tool that can be used by your Cursor Agent.

### Function to Tool Conversion

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

This function is automatically converted into an MCP tool where:

- The JSDoc comment's first line becomes the tool's description
- The `@param` tags become the tool's parameters, preserving their types and descriptions
- The function name is prefixed with "mcp_" in your Cursor Agent (e.g., `mcp_sayHello`)

To add new tools, simply add new methods to the `MyWorker` class following this pattern:

1. Write a clear JSDoc comment describing what the tool does
2. Document parameters using `@param` tags with types and descriptions
3. Implement the function logic
4. Deploy your changes
5. Click the refresh button in Cursor and you should see your new tool.

## Deployment

Deployment to Cloudflare Workers happens automatically during setup. For subsequent deployments:

```bash
bun run deploy
```

## Why Cloudflare Workers?

Honestly? Vibes and good DX. Also deployments are blazing fast.

I don't like running MCP servers locally, and I'm pretty sure most of you don't either. Now you don't have to run a node process if you just want to create and use minimal API wrapper MCP tools in Cursor.

All you have to do is write functions. Put your descriptions and params in JSDoc comments and it just works.

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
