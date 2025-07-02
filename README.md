# Deno Stylish Logger

Uma biblioteca de logging simples, plug-and-play e estilizada para Deno e Oak.

## Instalação

```typescript
import { Logger, oakLogger } from "[https://deno.land/x/logger_main@v1.0.0/mod.ts](https://deno.land/x/logger_main@v1.0.0/mod.ts)";
```
*(Substitua `loggerMain` pelo nome real do seu módulo)*

## Uso

```typescript
import { Application } from "[https://deno.land/x/oak/mod.ts](https://deno.land/x/oak/mod.ts)";
import { Logger, oakLogger } from "[https://deno.land/x/logger_main/mod.ts](https://deno.land/x/logger_main/mod.ts)";

const logger = new Logger();
const app = new Application();

app.use(oakLogger(logger));

// ... seu código de rotas

await app.listen({ port: 8000 });
```