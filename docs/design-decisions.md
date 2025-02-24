# Design Decisions

## Why make a CLI tool?

We're in the early days of AI-native software development.

I want to give my coding agents a lot of agency over my codebases and so far, MCP looks like the best way to do that in IDEs like Cursor.

## Why clone a template worker and deploy it to your own Cloudflare account?

- I don't like the idea of using MCP servers I didn't make.
- I also wanted to be able to update my MCP servers whenever I want and have them deployed to my own Cloudflare account.
- My agent should use tools I make.
- I wanted something that would spin up an MCP server and throw it on Cloudflare with a single command.
- Also if you make a MCP server using create-mcp, you can use the --clone command to allow anyone to clone your MCP server and deploy it to their own Cloudflare account and extend it with whatever tools they want.

## Why not run MCP servers locally?

This is just personal preference, but I hate the DX of running MCP servers locally. Rapidly deploying the worker every time I make a change and reloading Cursor just feels so much better.

## Why Cloudflare Workers?

I just love the platform. Fast deployments and the DX is fantastic if you can live with workerd instead of Node.js. I use tools like Queues and KV all the time - they've completely replaced so many SaaS products I used to pay for before I got cloudflare-pilled.
