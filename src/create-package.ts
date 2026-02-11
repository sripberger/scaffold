#!/usr/bin/env node
import cp from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";

import decamelize from "decamelize";
import {join as desmJoin} from "desm";
import {LogLevel, Scaffold} from "simple-scaffold";


const dirname = desmJoin(import.meta.url);

async function main(): Promise<void> {
	await Scaffold({ // eslint-disable-line new-cap
		name: inferPackageName(),
		output: ".",
		templates: [path.join(dirname, "templates", "package")],
		logLevel: LogLevel.none,
	});

	// npm will not publish any file named .gitignore, so we need to name it differently in the
	// scaffold, then rename it after the scaffold is created so git will use it.
	await fs.rename("gitignore", ".gitignore");

	await installDeps("dev");
	await installDeps("prod");
}

function inferPackageName(): string {
	const parentDir = path.basename(process.cwd());
	return decamelize(parentDir).replace(/[^a-z0-9]+/g, "-");
}

async function installDeps(depsType: "dev" | "prod"): Promise<void> {
	const depsFile = path.join(dirname, "dependencies", depsType);
	const depsText = await fs.readFile(depsFile, {encoding: "utf8"});
	const deps = depsText
		.split("\n")
		.map((l) => l.trim())
		.filter((l) => l !== "" && !l.startsWith("#"));

	if (deps.length > 0) {
		const installArgs = ["install"];
		if (depsType === "dev") installArgs.push("--save-dev");
		installArgs.push(...deps);
		cp.spawnSync("npm", installArgs, {stdio: "inherit"});
	}
}

main().catch((err) => console.error(err)); // eslint-disable-line no-console
