import { Container } from "@needle-di/core";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { FileService, filesModule } from "./features/files";
import { llmModule } from "./features/llm";
import { Cache } from "./shared/Cache";
import { Config } from "./shared/Config";
import { CronService } from "./shared/CronService";
import { DB, DB_SQL } from "./shared/Db";
import { HttpServer } from "./shared/HttpServer";
import { Migrator } from "./shared/migrations/Migrator";
import { OnDeinit } from "./shared/OnDeinit";
import { OnInit } from "./shared/OnInit";

export function createContainer(): Container {
  const container = new Container();

  // Shared
  container.bind(Config);
  container.bind(CronService);
  container.bind(Migrator);
  container.bind({
    provide: Cache,
    useFactory(container) {
      return new Cache(container.get(Config).ttlCacheSize);
    },
  });
  container.bind({
    provide: DB_SQL,
    useFactory() {
      return postgres(process.env.DATABASE_URL!, { onnotice: () => {} });
    },
  });
  container.bind({
    provide: DB,
    useFactory(container) {
      return drizzle(container.get(DB_SQL));
    },
  });
  container.bind(HttpServer);

  // Features
  container.bind(FileService);
  container.bindAll(filesModule);
  container.bindAll(llmModule);

  // Initables
  container.bind({
    multi: true,
    provide: OnInit,
    useClass: class implements OnInit {
      async init() {
        console.log("Example init hook, remove me later");
      }
    },
  });
  container.bind({
    multi: true,
    provide: OnInit,
    useExisting: FileService,
  });
  container.bind({
    multi: true,
    provide: OnInit,
    useExisting: HttpServer,
  });

  // De-initables
  container.bind({
    multi: true,
    provide: OnDeinit,
    useExisting: FileService,
  });
  container.bind({
    multi: true,
    provide: OnDeinit,
    useExisting: HttpServer,
  });

  return container;
}