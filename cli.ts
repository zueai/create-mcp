#!/usr/bin/env bun
import { execSync } from "node:child_process"
import { cp, mkdir, readFile, writeFile } from "node:fs/promises"
import { join } from "node:path"
import { fileURLToPath } from "node:url"
import npmWhich from "npm-which"
import pc from "picocolors"
import prompts from "prompts"
import yargs from "yargs"
import { hideBin } from "yargs/helpers"

const __dirname = fileURLToPath(new URL(".", import.meta.url))

const PACKAGE_MANAGERS = {
	bun: "bun install",
	npm: "npm install",
	pnpm: "pnpm install",
	yarn: "yarn"
} as const

type PackageManager = keyof typeof PACKAGE_MANAGERS

interface Args {
	name?: string
	clone?: string
}

async function getProjectDetails() {
	// Parse command line arguments
	const argv = (await yargs(hideBin(process.argv))
		.usage("Usage: $0 --name <name> [options]")
		.option("name", {
			type: "string",
			describe: "Name of the MCP server"
		})
		.option("clone", {
			type: "string",
			describe: "GitHub URL of an existing MCP server to clone"
		})
		.example([
			["$0 --name my-server", "Create a new MCP server"],
			[
				"$0 --name my-server --clone https://github.com/user/repo",
				"Clone an existing MCP server"
			]
		])
		.help().argv) as Args

	const isCloning = !!argv.clone
	const githubUrl = argv.clone || ""
	let projectName = argv.name || ""

	if (isCloning && !githubUrl) {
		console.error(pc.red("GitHub URL is required when using --clone flag"))
		process.exit(1)
	}

	if (isCloning && !projectName) {
		// Extract repo name from GitHub URL
		const repoName = githubUrl.split("/").pop()?.replace(".git", "") || ""

		// Ask for project name with repo name as default
		const response = await prompts({
			type: "text",
			name: "projectName",
			message: "What is the name of your MCP server?",
			initial: repoName,
			validate: (value) =>
				value.length > 0 ? true : "Project name is required"
		})

		projectName = response.projectName
	} else if (!projectName) {
		const response = await prompts({
			type: "text",
			name: "projectName",
			message: "What is the name of your MCP server?",
			validate: (value) =>
				value.length > 0 ? true : "Project name is required"
		})

		projectName = response.projectName
	}

	if (!projectName) {
		console.error(pc.red("Project name is required"))
		process.exit(1)
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
			{ title: "yarn", value: "yarn" }
		]
	})

	if (!packageManager) {
		console.error(pc.red("Package manager selection is required"))
		process.exit(1)
	}

	return { projectName, packageManager, githubUrl, isCloning }
}

async function setupProjectFiles(projectName: string) {
	const targetDir = join(process.cwd(), projectName)
	const templateDir = join(__dirname, "template")

	// Create project directory
	await mkdir(targetDir, { recursive: true })

	// Copy template files
	await cp(templateDir, targetDir, {
		recursive: true
	})

	return targetDir
}

async function updateConfigurations(targetDir: string, projectName: string) {
	// Update package.json with new name
	const pkgPath = join(targetDir, "package.json")
	const pkg = JSON.parse(await readFile(pkgPath, "utf-8"))
	pkg.name = projectName
	await writeFile(pkgPath, JSON.stringify(pkg, null, 2))

	// Update wrangler.jsonc with new name
	const wranglerPath = join(targetDir, "wrangler.jsonc")
	let wranglerContent = await readFile(wranglerPath, "utf-8")
	wranglerContent = wranglerContent.replace(
		/"name":\s*"[^"]*"/,
		`"name": "${projectName}"`
	)
	await writeFile(wranglerPath, wranglerContent)

	// Update README.md heading and clone command
	const readmePath = join(targetDir, "README.md")
	let readmeContent = await readFile(readmePath, "utf-8")
	readmeContent = readmeContent.replace(/^# [^\n]+/, `# ${projectName}`)
	readmeContent = readmeContent.replace(
		/bun create mcp --clone https:\/\/github\.com\/[^/]+\/[^/\n]+/,
		`bun create mcp --clone https://github.com/your-username/${projectName}`
	)
	await writeFile(readmePath, readmeContent)
}

function setupDependencies(targetDir: string, packageManager: PackageManager) {
	// Initialize git repo with main branch
	execSync("git init -b main", { cwd: targetDir })

	// Install dependencies
	console.log(pc.cyan("\n⚡️ Installing dependencies..."))
	execSync(PACKAGE_MANAGERS[packageManager], {
		cwd: targetDir,
		stdio: "inherit"
	})
}

function setupMCPAndWorkers(targetDir: string, packageManager: PackageManager) {
	console.log(
		pc.cyan("\n⚡️ Setting up MCP and deploying to Cloudflare Workers...")
	)
	const setupCommand =
		packageManager === "npm"
			? "npx"
			: packageManager === "yarn"
				? "yarn dlx"
				: packageManager === "pnpm"
					? "pnpm dlx"
					: "bunx"

	execSync(`${setupCommand} workers-mcp setup`, {
		cwd: targetDir,
		stdio: "inherit"
	})
}

async function getMCPCommand(projectName: string) {
	const homedir = process.env.HOME || process.env.USERPROFILE || ""
	const claudeConfigPath = join(
		homedir,
		"Library/Application Support/Claude/claude_desktop_config.json"
	)
	const claudeConfig = JSON.parse(await readFile(claudeConfigPath, "utf-8"))

	const mcpServer = claudeConfig.mcpServers[projectName]
	if (!mcpServer) {
		throw new Error("Could not find MCP server in Claude desktop config")
	}

	return [mcpServer.command, ...mcpServer.args].join(" ")
}

async function handleFinalSteps(targetDir: string, mcpCommand: string) {
	// Copy command to clipboard
	execSync(`echo "${mcpCommand}" | pbcopy`)

	// Show command with nice spacing
	console.log("\n")
	console.log(
		pc.white(
			"Your MCP server command has been copied to clipboard. Here it is for reference:"
		)
	)
	console.log("\n")
	console.log(pc.cyan(mcpCommand))
	console.log("\n")
	console.log(
		pc.white(
			"Add it to Cursor by going to Settings -> Features -> MCP Servers"
		)
	)
	console.log("\n")

	// Ask if user wants to open in Cursor
	const { openInCursor } = await prompts({
		type: "confirm",
		name: "openInCursor",
		message: "Would you like to open the project in Cursor?",
		initial: true
	})

	if (openInCursor) {
		execSync(`cursor ${targetDir}`, { stdio: "inherit" })
	}

	console.log(pc.green("\n✨ MCP server created successfully!"))
	if (!openInCursor) {
		console.log(pc.white("\nYou can open the project later with:"))
		console.log(pc.cyan(`  cursor ${targetDir}\n`))
	}

	// Add closing message
	console.log(pc.cyan("Happy hacking! 🚀\n"))
}

async function cloneExistingServer(
	githubUrl: string,
	projectName: string,
	packageManager: PackageManager
) {
	const targetDir = join(process.cwd(), projectName)

	// Clone the repository
	console.log(pc.cyan("\n⚡️ Cloning repository..."))
	execSync(`git clone ${githubUrl} ${targetDir}`, { stdio: "inherit" })

	// Remove the .git folder and reinitialize the repository
	console.log(pc.cyan("\n⚡️ Initializing fresh git repository..."))
	execSync(`rm -rf ${join(targetDir, ".git")}`)
	execSync("git init -b main", { cwd: targetDir })

	// Update configurations with new name
	await updateConfigurations(targetDir, projectName)

	// Install dependencies
	console.log(pc.cyan("\n⚡️ Installing dependencies..."))
	execSync(PACKAGE_MANAGERS[packageManager], {
		cwd: targetDir,
		stdio: "inherit"
	})

	// Generate and upload secret
	console.log(pc.cyan("\n⚡️ Setting up MCP secret..."))
	const setupCommand =
		packageManager === "npm"
			? "npx"
			: packageManager === "yarn"
				? "yarn dlx"
				: packageManager === "pnpm"
					? "pnpm dlx"
					: "bunx"

	execSync(`${setupCommand} workers-mcp secret generate`, {
		cwd: targetDir,
		stdio: "inherit"
	})
	execSync(`${setupCommand} workers-mcp secret upload`, {
		cwd: targetDir,
		stdio: "inherit"
	})

	// Deploy the worker
	console.log(pc.cyan("\n⚡️ Deploying to Cloudflare Workers..."))
	execSync("bun run deploy", {
		cwd: targetDir,
		stdio: "inherit"
	})

	// Get the worker URL
	const { workerUrl } = await prompts({
		type: "text",
		name: "workerUrl",
		message:
			"Please enter the URL of your deployed worker (from the output above):",
		validate: (value) =>
			value.length > 0 ? true : "Worker URL is required"
	})

	if (!workerUrl) {
		console.error(pc.red("Worker URL is required"))
		process.exit(1)
	}

	// Get workers-mcp executable path
	const execPath = npmWhich(targetDir).sync("workers-mcp")

	// Construct MCP command
	const mcpCommand = [
		execPath,
		"run",
		projectName,
		workerUrl,
		targetDir
	].join(" ")

	return mcpCommand
}

async function main() {
	// Display welcome message
	console.log("\n")
	console.log(pc.bgCyan(pc.black(" ⚡️ Welcome to create-mcp CLI ")))

	try {
		const { projectName, packageManager, githubUrl, isCloning } =
			await getProjectDetails()

		let mcpCommand: string
		let targetDir: string

		if (isCloning && githubUrl) {
			mcpCommand = await cloneExistingServer(
				githubUrl,
				projectName,
				packageManager as PackageManager
			)
			targetDir = join(process.cwd(), projectName)
		} else {
			targetDir = await setupProjectFiles(projectName)
			await updateConfigurations(targetDir, projectName)
			setupDependencies(targetDir, packageManager as PackageManager)
			setupMCPAndWorkers(targetDir, packageManager as PackageManager)
			mcpCommand = await getMCPCommand(projectName)
		}

		await handleFinalSteps(targetDir, mcpCommand)
	} catch (error) {
		console.error(pc.red("Error creating project:"), error)
		process.exit(1)
	}
}

main().catch(console.error)
