import { colors } from "./deps.ts";

export enum LogLevel {
  DEBUG = "DEBUG",
  INFO = "INFO",
  WARN = "WARN",
  ERROR = "ERROR",
}

export interface LoggerOptions {
  minLogLevel?: LogLevel;
}

const levelMap = {
  [LogLevel.DEBUG]: { text: "DEBUG", color: colors.gray },
  [LogLevel.INFO]: { text: "INFO", color: colors.cyan },
  [LogLevel.WARN]: { text: "WARN", color: colors.yellow },
  [LogLevel.ERROR]: { text: "ERROR", color: colors.red },
};

export class Logger {
  private options: Required<LoggerOptions>;

  constructor(options: LoggerOptions = {}) {
    this.options = {
      minLogLevel: options.minLogLevel || LogLevel.DEBUG,
    };
  }

  public log(level: LogLevel, message: string, ...args: unknown[]): void {
    if (level < this.options.minLogLevel) {
      return;
    }

    const timestamp = new Date().toISOString();
    const levelInfo = levelMap[level];

    const formattedMessage = `${colors.gray(timestamp)} [${
      levelInfo.color(levelInfo.text)
    }] - ${message}`;

    console.log(
      formattedMessage,
      ...args.map((arg) =>
        typeof arg === "string" ? arg : Deno.inspect(arg, { colors: true })
      ),
    );
  }

  public debug(message: string, ...args: unknown[]) {
    this.log(LogLevel.DEBUG, message, ...args);
  }

  public info(message: string, ...args: unknown[]) {
    this.log(LogLevel.INFO, message, ...args);
  }

  public warn(message: string, ...args: unknown[]) {
    this.log(LogLevel.WARN, message, ...args);
  }

  public error(message: string, ...args: unknown[]) {
    this.log(LogLevel.ERROR, message, ...args);
  }
}
