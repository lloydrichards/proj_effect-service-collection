import { Console, Effect, Layer, ManagedRuntime, Stream } from "effect";
import { DevToolsLive } from "@/DevTool";
import { FileStorage } from "@/FileStorage";
import { SqlClient } from "@/SqlClient";

const main = Effect.gen(function* () {
  yield* Console.log("\n✍️ Scratchpad\n\n");

  const sql = yield* SqlClient;
  const fs = yield* FileStorage;

  yield* sql.query("CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT)");
  for (let i = 0; i < 30; i++) {
    yield* sql.query("INSERT INTO users (name) VALUES (?)", `User ${i}`);
  }

  const users = yield* sql
    .stream<{ id: number; name: string }>("SELECT * FROM users")
    .pipe(Stream.runCollect);

  yield* fs.write("users.json", JSON.stringify([...users], null, 2));

  yield* Console.log("✅ Users saved to users.json");
});

const MainLayer = Layer.mergeAll(
  DevToolsLive,
  SqlClient.Default,
  FileStorage.Default
  // Add more layers as needed
);

const RuntimeServer = ManagedRuntime.make(MainLayer);

RuntimeServer.runPromise(main).catch(console.error);
