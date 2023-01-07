import { Injector, Logger, webpack } from "replugged";
import { AnyFunction } from "replugged/dist/types";

const inject = new Injector();

export async function start(): Promise<void> {
  const logger = Logger.plugin("NoReplyMention");

  const injectionMod = await webpack.waitForModule<{ [key: string]: AnyFunction }>(
    webpack.filters.bySource(/\w+=\w+\.shouldMention,\w+=\w+\.showMentionToggle/),
  );
  if (!injectionMod) {
    logger.error("Failed to find module, cannot continue!");
    return;
  }

  const fnName = Object.entries(injectionMod).find(([_, v]) =>
    v.toString()?.match(/CREATE_PENDING_REPLY/),
  )?.[0];
  if (!fnName) {
    logger.error("Failed to find function, cannot continue!");
    return;
  }

  inject.before(injectionMod, fnName, ([args], _) => {
    args.shouldMention = false;
    return args;
  });
}

export function stop(): void {
  inject.uninjectAll();
}
