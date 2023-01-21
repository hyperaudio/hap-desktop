import path from 'path';
import process from 'process';
import fs from 'fs';
import { spawn } from 'child_process';
import { app, dialog } from 'electron';

import { publishServerInfo } from './index';

function findServer() {
  const possibilities = [
    // In packaged app
    path.join(process.resourcesPath, 'server', 'server.py'),
    path.join(process.resourcesPath, 'server', 'server.exe'),

    // In development
    path.join(process.cwd(), '../server', 'server.py'),
    path.join(process.cwd(), 'server', 'server.exe'),
  ];

  console.log({ possibilities });

  for (const path of possibilities) {
    if (fs.existsSync(path)) {
      console.log({ path });
      return path;
    }
  }

  return null;
}

function getServerProcess() {
  if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
    console.log(process.cwd() + '/../server');

    return spawn('poetry', ['run', 'python', 'run.py'], {
      stdio: 'pipe',
      cwd: process.cwd() + '/../server',
      env: { ...process.env },
      shell: process.platform == 'win32',
    });
  }

  const path = findServer();

  if (path === null) {
    console.log({
      type: 'error',
      message:
        'Failed to find local executable for server.',
    });

    app.quit();

    return null;
  }

  console.log('Starting server from', path);

  return spawn(path, {
    stdio: 'pipe',
    env: { ...process.env },
  });
}

let serverProcess = null;

function startServer() {
  serverProcess = getServerProcess();
  if (!serverProcess) return;

  serverProcess.stdout.on('data', (data: Buffer) => {
    console.log('server-stdout', data.toString());

    try {
      const { msg, port } = JSON.parse(data.toString());
      if (msg == 'server_starting') publishServerInfo({ state: 'starting', port });
    } catch (e) {
      console.log('error decoding stdout', e);
    }
  });

  serverProcess.stderr.on('data', (data: Buffer) => {
    console.log(`server-stderr: \n${data}`);
    console.log(data.toString());
  });

  serverProcess.on('close', (code: number | null) => {
    if (code == 0) {
      publishServerInfo({ state: 'stopped' });
    } else {
      publishServerInfo({ state: `exited - error code ${code}` });
    }

    serverProcess = null;

    console.log(`child process exited with code ${code}`);
  });
}

startServer();
