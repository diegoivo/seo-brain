#!/usr/bin/env node
import getPort from "get-port";
import { spawn } from "node:child_process";

const port = await getPort();
console.log(`▶ Next.js dev em http://localhost:${port}`);

const next = spawn("next", ["dev", "-p", String(port)], {
  stdio: "inherit",
  env: { ...process.env, PORT: String(port) },
});

next.on("exit", code => process.exit(code ?? 0));
