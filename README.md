# create-mcp

A CLI tool that quickly scaffolds and deploys a Model Control Protocol (MCP) server to Cloudflare Workers so you can start adding new tools to your Cursor Agent in minutes. This is super useful if you want to add API wrapper tools to your Cursor Agent instantly.

## Prerequisites

- A Cloudflare account with [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/) installed
- Claude Desktop App installed (because it uses [workers-mcp](https://github.com/cloudflare/workers-mcp) under the hood)

## Instructions

Make sure you are logged in to Wrangler:

```bash
wrangler login
```

Create a new MCP server, just run:

```bash
bun create mcp
```

You can also pass a name to the server:

```bash
bun create mcp <server-name>
```

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
bun dev    # starts local development server
```

## Deployment

Deployment to Cloudflare Workers happens automatically during setup. For subsequent deployments:

```bash
bun run deploy
```

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
