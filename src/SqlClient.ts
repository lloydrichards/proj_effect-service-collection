import { Database } from "bun:sqlite";
import { Config, Effect, Layer, Schema, Stream } from "effect";

export type SqlParam = string | number | bigint | boolean | null | Uint8Array;

export class SqlError extends Schema.TaggedError<SqlError>()("SqlError", {
  cause: Schema.Defect,
}) {}

const SqlClientConfig = Config.all({
  filename: Config.string("SQL_LITE_FILENAME").pipe(
    Config.withDefault(":memory:"),
  ),
});

export class SqlClient extends Effect.Service<SqlClient>()("SqlClient", {
  scoped: Effect.gen(function* () {
    const config = yield* SqlClientConfig;
    const db = yield* Effect.acquireRelease(
      Effect.sync(() => new Database(config.filename)),
      (db) => Effect.sync(() => db.close()),
    );

    const use = Effect.fn("SqlClient.use")(
      <A>(f: (db: Database) => A): Effect.Effect<A, SqlError> =>
        Effect.try({
          try: () => f(db),
          catch: (cause) => new SqlError({ cause }),
        }),
    );

    const query = <A = unknown>(
      sql: string,
      ...params: Array<SqlParam>
    ): Effect.Effect<Array<A>, SqlError> =>
      use((db) => {
        if (params.length === 0) {
          const stmt = db.query(sql);
          return stmt.all() as A[];
        }
        const stmt = db.query(sql);
        return stmt.all(...params) as A[];
      }).pipe(Effect.withSpan("SqlClient.query", { attributes: { sql } }));

    const stream = <A = unknown>(
      sql: string,
      ...params: Array<SqlParam>
    ): Stream.Stream<A, SqlError> =>
      use((db) => {
        if (params.length === 0) {
          const stmt = db.query(sql);
          return Stream.fromIterable(stmt.iterate() as Iterable<A>);
        }
        const stmt = db.query(sql);
        return Stream.fromIterable(stmt.iterate(...params) as Iterable<A>);
      }).pipe(
        Stream.unwrap,
        Stream.withSpan("SqlClient.stream", { attributes: { sql } }),
      );

    return {
      use,
      query,
      stream,
    } as const;
  }),
}) {}

export const SqlClientLive = SqlClient.Default;

export const SqlClientTest = Layer.succeed(
  SqlClient,
  SqlClient.make({
    use: () => Effect.die("Test use not implemented"),
    query: () => Effect.die("Test query not implemented"),
    stream: () => Stream.die("Test stream not implemented"),
  }),
);
