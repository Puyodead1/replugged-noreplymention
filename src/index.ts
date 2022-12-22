import { Injector, webpack } from "replugged";

const inject = new Injector();

export async function start(): Promise<void> {
  const mod = await webpack.waitForModule<{
    fE: (args: any) => void;
  }>(webpack.filters.bySource(/\w+=\w+\.shouldMention,\w+=\w+\.showMentionToggle/));
  if (!mod) {
    console.error("[NoReplyMention] Failed to find module, cannot continue!");
    return;
  }

  inject.before(mod, "fE", ([args], _) => {
    args.shouldMention = false;
    return args;
  });
}

export function stop(): void {
  inject.uninjectAll();
}
