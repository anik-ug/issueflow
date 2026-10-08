import { spawn } from 'node:child_process';

const commands = [
  ['run', 'dev', '--prefix', 'backend'],
  ['run', 'dev', '--prefix', 'frontend']
];

const children = commands.map((args) => spawn('npm', args, {
  stdio: 'inherit',
  shell: process.platform === 'win32'
}));

const stop = () => children.forEach((child) => child.kill('SIGTERM'));
process.on('SIGINT', stop);
process.on('SIGTERM', stop);
children.forEach((child) => child.on('exit', (code) => {
  if (code && code !== 130) process.exitCode = code;
}));
