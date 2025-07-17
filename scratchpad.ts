import { DevToolsLive } from "@/DevTool";
import { Console, Effect, Layer, ManagedRuntime } from "effect";

const main = Effect.gen(function* () {
  yield* Console.log("\n✍️ Scratchpad\n\n");
});

const MainLayer = Layer.mergeAll(
  DevToolsLive,
  // Add more layers as needed
);

const RuntimeServer = ManagedRuntime.make(MainLayer);

RuntimeServer.runPromise(main).catch(console.error);
