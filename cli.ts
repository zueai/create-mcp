#!/usr/bin/env bun
import { execSync } from "node:child_process";
import { cp, mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import pc from "picocolors";
import prompts from "prompts";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

const PACKAGE_MANAGERS = {
	bun: "bun install",
	npm: "npm install",
	pnpm: "pnpm install",
	yarn: "yarn",
} as const;

type PackageManager = keyof typeof PACKAGE_MANAGERS;

async function main() {
	// Get project name from args or prompt
	let projectName = process.argv[2];

	if (!projectName) {
		const response = await prompts({
			type: "text",
			name: "projectName",
			message: "What is the name of your MCP server?",
			validate: (value) =>
				value.length > 0 ? true : "Project name is required",
		});

		projectName = response.projectName;
	}

	if (!projectName) {
		console.error(pc.red("Project name is required"));
		process.exit(1);
	}

	// Ask for package manager preference
	const { packageManager } = await prompts({
		type: "select",
		name: "packageManager",
		message: "Which package manager do you want to use?",
		choices: [
			{ title: "bun", value: "bun" },
			{ title: "npm", value: "npm" },
			{ title: "pnpm", value: "pnpm" },
			{ title: "yarn", value: "yarn" },
		],
	});

	if (!packageManager) {
		console.error(pc.red("Package manager selection is required"));
		process.exit(1);
	}

	const targetDir = join(process.cwd(), projectName);
	const templateDir = join(__dirname, "template");

	try {
		// Create project directory
		await mkdir(targetDir, { recursive: true });

		// Copy template files
		await cp(templateDir, targetDir, {
			recursive: true,
		});

		// Update package.json with new name
		const pkgPath = join(targetDir, "package.json");
		const pkg = JSON.parse(await readFile(pkgPath, "utf-8"));
		pkg.name = projectName;
		await writeFile(pkgPath, JSON.stringify(pkg, null, 2));

		// Update wrangler.jsonc with new name
		const wranglerPath = join(targetDir, "wrangler.jsonc");
		let wranglerContent = await readFile(wranglerPath, "utf-8");
		wranglerContent = wranglerContent.replace(
			/"name":\s*"[^"]*"/,
			`"name": "${projectName}"`,
		);
		await writeFile(wranglerPath, wranglerContent);

		// Initialize git repo with main branch
		execSync("git init -b main", { cwd: targetDir });

		// Install dependencies
		console.log(pc.cyan("\nInstalling dependencies..."));
		execSync(PACKAGE_MANAGERS[packageManager as PackageManager], {
			cwd: targetDir,
			stdio: "inherit", // Show installation progress
		});

		// Run MCP setup command using selected package manager
		console.log(
			pc.cyan("\nSetting up MCP and deploying to Cloudflare Workers..."),
		);
		const setupCommand =
			packageManager === "npm"
				? "npx"
				: packageManager === "yarn"
					? "yarn dlx"
					: packageManager === "pnpm"
						? "pnpm dlx"
						: "bunx";

		execSync(`${setupCommand} workers-mcp setup`, {
			cwd: targetDir,
			stdio: "inherit",
		});

		// Get the MCP command from Claude desktop config
		const homedir = process.env.HOME || process.env.USERPROFILE || "";
		const claudeConfigPath = join(
			homedir,
			"Library/Application Support/Claude/claude_desktop_config.json",
		);
		const claudeConfig = JSON.parse(await readFile(claudeConfigPath, "utf-8"));

		const mcpServer = claudeConfig.mcpServers[projectName];
		if (!mcpServer) {
			throw new Error("Could not find MCP server in Claude desktop config");
		}

		// Concatenate command and args
		const mcpCommand = [mcpServer.command, ...mcpServer.args].join(" ");

		// Copy command to clipboard
		execSync(`echo "${mcpCommand}" | pbcopy`);

		// Show command with nice spacing
		console.log("\n");
		console.log(
			pc.white(
				"Your MCP server command has been copied to clipboard. Here it is for reference:",
			),
		);
		console.log("\n");
		console.log(pc.cyan(mcpCommand));
		console.log("\n");
		console.log(
			pc.white(
				"Add it to Cursor by going to Settings -> Features -> MCP Servers",
			),
		);
		console.log("\n");

		// Ask if user wants to open in Cursor
		const { openInCursor } = await prompts({
			type: "confirm",
			name: "openInCursor",
			message: "Would you like to open the project in Cursor?",
			initial: true,
		});

		if (openInCursor) {
			execSync(`cursor ${targetDir}`, { stdio: "inherit" });
		}

		console.log(pc.green("\n✨ MCP server created successfully!"));
		if (!openInCursor) {
			console.log(pc.white("\nYou can open the project later with:"));
			console.log(pc.cyan(`  cursor ${targetDir}\n`));
		}
	} catch (error) {
		console.error(pc.red("Error creating project:"), error);
		process.exit(1);
	}
}

main().catch(console.error);
