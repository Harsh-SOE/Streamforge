import ora from 'ora';
import chalk from 'chalk';
import boxen from 'boxen';
import { join } from 'path';
import { existsSync } from 'fs';
import { execFileSync } from 'child_process';

const allowedServices = ['users', 'videos', 'reaction', 'channel', 'comments', 'views'];

const serviceName = process.argv[2];

const error = (msg: string) => {
  console.error(chalk.red.bold('✖ ') + chalk.red(msg));
  process.exit(1);
};

if (!serviceName) {
  error('Usage: yarn prisma:init <serviceName>');
}

if (!allowedServices.includes(serviceName)) {
  error(
    `Invalid service name. Allowed services: ${allowedServices.map((s) => chalk.cyan(s)).join(', ')}`,
  );
}

const serviceRoot = join(__dirname, '..', 'apps', serviceName);
const prismaBinary = join(__dirname, '..', 'node_modules', '.bin', 'prisma');

if (!existsSync(prismaBinary)) {
  error('Prisma binary was not found in node_modules!');
}

console.log(
  boxen(
    `${chalk.bold.magenta('Prisma Init')} \n\n` +
      `${chalk.gray('Service:')} ${chalk.yellow(serviceName)}`,
    { padding: 1, borderColor: 'magenta', borderStyle: 'round' },
  ),
);

const spinner = ora({
  text: `Initializing Prisma for service '${chalk.yellow(serviceName)}'...`,
  spinner: 'dots',
}).start();

try {
  execFileSync(prismaBinary, ['init'], {
    stdio: 'inherit',
    cwd: serviceRoot,
    env: {
      ...process.env,
      PRISMA_HIDE_UPDATE_MESSAGE: 'true',
    },
  });

  spinner.succeed(`Prisma initialized successfully for '${serviceName}'`);

  console.log(
    boxen(
      `${chalk.green.bold('Success!')}\n\n` +
        `${chalk.gray('Service:')} ${chalk.cyan(serviceName)}`,
      { padding: 1, borderColor: 'green', borderStyle: 'round' },
    ),
  );
} catch (err) {
  spinner.fail(`Prisma initialization failed for '${serviceName}'`);
  error((err as Error).message);
}
