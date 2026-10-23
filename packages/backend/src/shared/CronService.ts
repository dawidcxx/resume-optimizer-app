import { inject, injectable } from "@needle-di/core";
import { serializeError } from "serialize-error";
import { Logger } from "@/lib/Logger";
import { Config } from "@/shared/Config";

@injectable()
export class CronService {
  constructor(private readonly config = inject(Config)) {}

  register(jobId: string, everyMs: number, job: () => Promise<void>): () => void {
    if (!this.config.cronEnabled) {
      logger.info(`Cron job ${jobId} skipped: cron is disabled`);
      return () => {};
    }

    let isRunning = false;

    const run = () => {
      if (isRunning) {
        logger.warn(`Skipping cron job ${jobId}: previous invocation is still running`);
        return;
      }

      isRunning = true;
      const startedAt = Date.now();
      const slowJobWarningTimeout = setTimeout(() => {
        logger.warn(`Cron job ${jobId} has been running for more than 1000ms`);
      }, 1000);

      job()
        .catch((error) => {
          logger.error(`Error in cron job ${jobId}`, { error: serializeError(error) });
        })
        .finally(() => {
          clearTimeout(slowJobWarningTimeout);
          isRunning = false;
          const durationMs = Date.now() - startedAt;
          if (durationMs > 1000) {
            logger.warn(`Cron job ${jobId} completed in ${durationMs}ms`);
          }
        });
    };

    const timeout = setTimeout(run, 1000);
    const interval = setInterval(run, everyMs);

    logger.info(`Registered CronJob: '${jobId}'`, { jobId, everyMs });

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }
}

const logger = Logger.for(CronService);