import ora from 'ora';
import chalk from 'chalk';
import boxen from 'boxen';
import { join } from 'path';
import { existsSync } from 'fs';
import { execFileSync } from 'child_process';

const allowedServices = ['users', 'videos', 'reaction', 'channel', 'comments', 'views'];

const serviceName = process.argv[2];
const migrationName = process.argv[3];

const error = (msg: string) => {
  console.error(chalk.red.bold('✖ ') + chalk.red(msg));
  process.exit(1);
};

if (!serviceName || !migrationName) {
  error(`Usage: yarn prisma:generate:migrations <serviceName> <migrationName>`);
}

if (!allowedServices.includes(serviceName)) {
  error(
    `Unrecognized service name. Allowed services: ${allowedServices.map((s) => chalk.cyan(s)).join(', ')}`,
  );
}

if (!/^[a-zA-Z0-9-_]+$/.test(migrationName)) {
  error('Invalid migration name. Only letters, numbers, dash, and underscore allowed.');
}

const cwd = join(__dirname, '..', 'apps', serviceName);

if (!existsSync(cwd)) {
  error(`Service directory not found:\n${chalk.gray(cwd)}`);
}

console.log(
  boxen(
    `${chalk.bold.magenta('Prisma Migration Generator')}\n\n` +
      `${chalk.gray('Service:')} ${chalk.yellow(serviceName)}\n` +
      `${chalk.gray('Migration:')} ${chalk.yellow(migrationName)}`,
    { padding: 1, borderColor: 'magenta', borderStyle: 'round' },
  ),
);

const spinner = ora({
  text: `Running migration '${chalk.yellow(migrationName)}' for service '${chalk.yellow(serviceName)}'...`,
  spinner: 'dots',
}).start();

try {
  execFileSync('npx', ['prisma', 'migrate', 'dev', '--name', migrationName], {
    stdio: ['ignore', 'ignore', 'inherit'],
    cwd,
    env: {
      ...process.env,
      PRISMA_HIDE_UPDATE_MESSAGE: 'true', // hide update check
    },
  });

  spinner.succeed(`Migration '${migrationName}' applied successfully`);

  console.log(
    boxen(
      `${chalk.green.bold('Success!')}\n\n` +
        `${chalk.gray('Service:')} ${chalk.cyan(serviceName)}\n` +
        `${chalk.gray('Migration:')} ${chalk.cyan(migrationName)}`,
      { padding: 1, borderColor: 'green', borderStyle: 'round' },
    ),
  );
} catch (err) {
  spinner.fail(`Migration '${migrationName}' failed`);
  error((err as Error).message);
}
