import { Injector, webpack } from "replugged";
import { AnyFunction } from "replugged/dist/types";

const inject = new Injector();

export async function start(): Promise<void> {
  const mod = await webpack.waitForModule<{ [key: string]: AnyFunction }>(
    webpack.filters.bySource(/\w+=\w+\.shouldMention,\w+=\w+\.showMentionToggle/),
  );
  if (!mod) {
    console.error("[NoReplyMention] Failed to find module, cannot continue!");
    return;
  }
  console.log(mod);

  const fnName = Object.entries(mod).find(([_, v]) =>
    v.toString()?.match(/CREATE_PENDING_REPLY/),
  )?.[0];
  if (!fnName) {
    console.error("[NoReplyMention] Failed to find function, cannot continue!");
    return;
  }

  inject.before(mod, fnName, ([args], _) => {
    args.shouldMention = false;
    return args;
  });
}

export function stop(): void {
  inject.uninjectAll();
}
