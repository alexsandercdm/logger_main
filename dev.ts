// dev.ts

import { Application } from "https://deno.land/x/oak@v17.1.4/application.ts";
import { Logger, LogLevel } from "./mod/logger.ts";
import { Router } from "https://deno.land/x/oak@v17.1.4/router.ts";
import { oakLogger } from "./mod/middleware.ts";


// 1. Instancie seu logger com as configurações desejadas
const myLogger = new Logger({ minLogLevel: LogLevel.DEBUG });

// 2. Instancie o App do Oak
const app = new Application();
const router = new Router();

// Log de inicialização usando nossa lib
myLogger.info("Iniciando o servidor...");

// 3. Use o middleware, passando a instância do logger
app.use(oakLogger(myLogger));

// Definindo algumas rotas para teste
router.get("/", (ctx) => {
  myLogger.debug("Acessando a rota principal /");
  ctx.response.body = "Olá, mundo do Log!";
});

router.get("/user/:id", (ctx) => {
  myLogger.info(`Buscando usuário: ${ctx.params.id}`);
  ctx.response.body = { id: ctx.params.id, name: "Usuário Teste" };
});

router.get("/error", (ctx) => {
  myLogger.error("Esta rota vai gerar um erro!");
  ctx.response.status = 500;
  ctx.response.body = "Erro interno do servidor.";
});

app.use(router.routes());
app.use(router.allowedMethods());

const port = 8000;
myLogger.info(`Servidor rodando na porta ${port}`);

await app.listen({ port });