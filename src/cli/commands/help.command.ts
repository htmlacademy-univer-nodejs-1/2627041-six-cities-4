import chalk from 'chalk';
import { Command } from './command.interface.js';

export class HelpCommand implements Command {
  public getName(): string {
    return '--help';
  }

  public async execute(..._parameters: string[]): Promise<void> {
    console.info(`
        ${chalk.yellow(
    'Программа для подготовки данных для REST API сервера.')}\n
        ${chalk.green('Пример:')}
            cli.js --<command> [--arguments]
        ${chalk.blue('Команды:')}
            --version:                        # выводит номер версии
            --help:                           # печатает этот текст
            --import <path> <login> <pwd> <host> <db_name> <salt>:                  # импортирует данные из TSV и сохраняет в бд
            --generate <n> <filepath> <url>   # Генерирует n наборов данных, получемые с json-сервера по пути url и записывает в TSV
    `);
  }
}
