import { DevToolsLive } from "@/DevTool";
import { SqlClient, SqlClientLive } from "@/SqlClient";
import { Console, Effect, Layer, ManagedRuntime, Stream } from "effect";

const main = Effect.gen(function* () {
  yield* Console.log("\n✍️ Scratchpad\n\n");

  const sql = yield* SqlClient;

  yield* sql.query("CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT)");
  for (let i = 0; i < 30; i++) {
    yield* sql.query("INSERT INTO users (name) VALUES (?)", `User ${i}`);
  }

  yield* sql
    .stream<{ id: number; name: string }>("SELECT * FROM users")
    .pipe(Stream.runForEach(Effect.log));
});

const MainLayer = Layer.mergeAll(
  DevToolsLive,
  SqlClientLive,
  // Add more layers as needed
);

const RuntimeServer = ManagedRuntime.make(MainLayer);

RuntimeServer.runPromise(main).catch(console.error);
