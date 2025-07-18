import {
  executeQuery,
  executeQueryWithAutoPagination,
} from "@datocms/cda-client";
import { Config, Data, Effect, Layer, Redacted } from "effect";

type QueryVariables = Record<string, unknown>;

class DatoFailure extends Data.TaggedError("DatoFailure")<{
  message: string;
  error: unknown;
}> {}

const DatoContentConfig = Config.all({
  token: Config.redacted("DATOCMS_API_TOKEN"),
  environment: Config.string("DATOCMS_API_ENV").pipe(
    Config.withDefault("main"),
  ),
  includeDrafts: Config.boolean("DATOCMS_INCLUDE_DRAFTS").pipe(
    Config.withDefault(true),
  ),
});

export class DatoCMS extends Effect.Service<DatoCMS>()("app/DatoCMS", {
  effect: Effect.gen(function* () {
    const config = yield* DatoContentConfig;

    const query = (
      query: string,
      options?: {
        variables?: QueryVariables;
      },
    ) =>
      Effect.tryPromise({
        try: () =>
          executeQuery(query, {
            ...config,
            token: Redacted.value(config.token),
            variables: options?.variables,
          }),
        catch: (error) =>
          new DatoFailure({
            message: "Failed to execute query",
            error,
          }),
      });

    const queryWithPagination = (
      query: string,
      options?: {
        variables?: QueryVariables;
      },
    ) =>
      Effect.tryPromise({
        try: () =>
          executeQueryWithAutoPagination(query, {
            ...config,
            token: Redacted.value(config.token),
            variables: options?.variables,
          }),
        catch: (error) =>
          new DatoFailure({
            message: "Failed to execute query with pagination",
            error,
          }),
      });

    return {
      query,
      queryWithPagination,
    } as const;
  }),
  accessors: true,
}) {}

export const DatoCMSLive = DatoCMS.Default;

export const DatoCMSTest = Layer.succeed(
  DatoCMS,
  DatoCMS.make({
    query: () => Effect.die("Test query not implemented"),
    queryWithPagination: () =>
      Effect.die("Test query with pagination not implemented"),
  }),
);
