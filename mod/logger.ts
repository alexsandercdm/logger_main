import { colors } from "./deps.ts";

/** Define os níveis de log disponíveis. */
export enum LogLevel {
  DEBUG = "DEBUG",
  INFO = "INFO",
  WARN = "WARN",
  ERROR = "ERROR",
}

/** Opções de configuração para a instância do Logger. */
export interface LoggerOptions {
  /** O nível mínimo de log a ser exibido. Mensagens com nível inferior serão ignoradas. */
  minLogLevel?: LogLevel;
}

const levelMap = {
  [LogLevel.DEBUG]: { text: "DEBUG", color: colors.gray, value: 0 },
  [LogLevel.INFO]: { text: "INFO", color: colors.cyan, value: 1 },
  [LogLevel.WARN]: { text: "WARN", color: colors.yellow, value: 2 },
  [LogLevel.ERROR]: { text: "ERROR", color: colors.red, value: 3 },
};

/**
 * Uma classe de logger estilizada e configurável.
 */
export class Logger {
  private options: Required<LoggerOptions>;
  private minLogLevelValue: number;

  /**
   * Cria uma nova instância do Logger.
   * @param options Opções de configuração para o logger.
   */
  constructor(options: LoggerOptions = {}) {
    this.options = {
      minLogLevel: options.minLogLevel || LogLevel.DEBUG,
    };
    this.minLogLevelValue = levelMap[this.options.minLogLevel].value;
  }

  /**
   * Registra uma mensagem com um nível de log específico.
   * Este é o método principal usado pelos outros métodos de atalho (debug, info, etc.).
   * @param level O nível do log (e.g., LogLevel.INFO).
   * @param message A mensagem principal a ser registrada.
   * @param args Argumentos adicionais a serem registrados junto com a mensagem.
   */
  public log(level: LogLevel, message: string, ...args: unknown[]): void {
    if (levelMap[level].value < this.minLogLevelValue) {
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

  /**
   * Registra uma mensagem de depuração.
   * @param message A mensagem de depuração.
   * @param args Argumentos adicionais.
   */
  public debug(message: string, ...args: unknown[]) {
    this.log(LogLevel.DEBUG, message, ...args);
  }

  /**
   * Registra uma mensagem informativa.
   * @param message A mensagem informativa.
   * @param args Argumentos adicionais.
   */
  public info(message: string, ...args: unknown[]) {
    this.log(LogLevel.INFO, message, ...args);
  }

  /**
   * Registra uma mensagem de aviso.
   * @param message A mensagem de aviso.
   * @param args Argumentos adicionais.
   */
  public warn(message: string, ...args: unknown[]) {
    this.log(LogLevel.WARN, message, ...args);
  }

  /**
   * Registra uma mensagem de erro.
   * @param message A mensagem de erro.
   * @param args Argumentos adicionais.
   */
  public error(message: string, ...args: unknown[]) {
    this.log(LogLevel.ERROR, message, ...args);
  }
}
