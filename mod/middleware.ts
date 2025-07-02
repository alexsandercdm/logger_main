// middleware.ts


import { colors, type Context, type Middleware } from "./deps.ts";
import type { Logger } from "./logger.ts";

// Função que cria o middleware. Recebe uma instância do nosso logger.
export function oakLogger(logger: Logger): Middleware {
  return async (ctx: Context, next: () => Promise<unknown>) => {
    const startTime = Date.now();
    
    // Deixa a requisição seguir seu fluxo normal
    await next();

    const duration = Date.now() - startTime;
    const { method, url } = ctx.request;
    const status = ctx.response.status;

    // Formata a mensagem do log de acesso
    const logMessage = `${colors.bold(method)} ${url.pathname} - ${colors.bold(String(status))} (${duration}ms)`;

    if (status >= 500) {
      logger.error(logMessage);
    } else if (status >= 400) {
      logger.warn(logMessage);
    } else {
      logger.info(logMessage);
    }
  };
}