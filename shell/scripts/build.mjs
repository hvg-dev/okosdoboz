import { spawn } from 'node:child_process';
import { writeFile, rm } from 'node:fs/promises';
import path from 'node:path';
import { shellRoot, readConfig, copyAssets } from './assets.mjs';

const config = await readConfig(process.env.SHELL_ORIGIN || 'http://localhost:3000');
await rm(path.join(shellRoot, 'dist'), { recursive: true, force: true, maxRetries: 3 });
const parcel = path.join(shellRoot, 'node_modules/parcel/lib/bin.js');
const child = spawn(process.execPath, [parcel, 'build', 'index.html', '--dist-dir', 'dist', '--public-url', './'], { cwd: shellRoot, stdio: 'inherit', env: { ...process.env, PARCEL_WORKERS: '2' } });
const exitCode = await new Promise(resolve => child.on('exit', resolve));
if (exitCode !== 0) process.exit(exitCode || 1);
await copyAssets(path.join(shellRoot, 'dist'), config);
await writeFile(path.join(shellRoot, 'dist/shell-config.json'), JSON.stringify(config, null, 2) + '\n');