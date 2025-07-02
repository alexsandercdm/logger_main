// middleware.ts

import { colors, type Context, type Middleware } from "./deps.ts";
import type { Logger } from "./logger.ts";

/**
 * Cria um middleware para o Oak que registra informações sobre cada requisição HTTP.
 *
 * O middleware captura detalhes como o endereço IP do cliente, o método HTTP, a URL,
 * o status da resposta e o tempo de processamento. O nível do log (INFO, WARN, ERROR)
 * é determinado pelo código de status da resposta.
 *
 * @example
 * ```ts
 * import { Application } from "https://deno.land/x/oak/mod.ts";
 * import { Logger, oakLogger } from "https://deno.land/x/logger_main/mod.ts";
 *
 * const logger = new Logger();
 * const app = new Application();
 *
 * // Adiciona o middleware de log ao pipeline do Oak
 * app.use(oakLogger(logger));
 *
 * // ... seu código de rotas
 *
 * await app.listen({ port: 8000 });
 * ```
 *
 * @param logger Uma instância da classe `Logger` que será usada para registrar as mensagens.
 * @returns Uma função de middleware compatível com o Oak.
 */
export function oakLogger(logger: Logger): Middleware {
  return async (ctx: Context, next: () => Promise<unknown>) => {
    const startTime = Date.now();
    await next();
    const duration = Date.now() - startTime;

    const ip = ctx.request.ip;
    const userAgent = ctx.request.headers.get("user-agent") || "-";

    const { method, url } = ctx.request;
    const status = ctx.response.status;

    // Formata a mensagem do log de acesso
    const logMessage = `${colors.yellow(ip)} - "${userAgent}" - ${colors.bold(method)} ${url.pathname} - ${
      colors.bold(String(status))
    } (${duration}ms)`;

    if (status >= 500) {
      logger.error(logMessage);
    } else if (status >= 400) {
      logger.warn(logMessage);
    } else {
      logger.info(logMessage);
    }
  };
}
