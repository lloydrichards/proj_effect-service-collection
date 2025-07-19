import { HttpClient, HttpClientRequest } from "@effect/platform";
import { Config, Effect, flow, pipe } from "effect";

export const HarvestConfig = Config.all({
  accessToken: Config.redacted("HARVEST_ACCESS_TOKEN"),
  accountId: Config.string("HARVEST_ACCOUNT_ID"),
});

export const HarvestHttpClient = Effect.Do.pipe(
  Effect.bind("config", () => HarvestConfig),
  Effect.bind("httpClient", () => HttpClient.HttpClient),
  Effect.map(({ config, httpClient }) =>
    pipe(
      httpClient,
      HttpClient.mapRequest(
        flow(
          HttpClientRequest.prependUrl("https://api.harvestapp.com/v2"),
          HttpClientRequest.acceptJson,
          HttpClientRequest.bearerToken(config.accessToken),
          HttpClientRequest.setHeader("Harvest-Account-Id", config.accountId),
          HttpClientRequest.setHeader("User-Agent", "Harvest API")
        )
      )
    )
  )
);
