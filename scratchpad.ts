import { DevTools } from "@effect/experimental";
import { BunSocket } from "@effect/platform-bun";
import { Console, Effect, Layer, ManagedRuntime } from "effect";

const main = Effect.gen(function* () {
  yield* Console.log("\n✍️ Scratchpad\n\n");
});

const DevToolsLive = DevTools.layerWebSocket().pipe(
  Layer.provide(BunSocket.layerWebSocketConstructor),
);

const MainLayer = Layer.mergeAll(
  DevToolsLive,
  // Add more layers as needed
);

const RuntimeServer = ManagedRuntime.make(MainLayer);

RuntimeServer.runPromise(main).catch(console.error);
