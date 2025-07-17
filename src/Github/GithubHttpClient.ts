import { HttpClient, HttpClientRequest } from "@effect/platform";
import { Config, Effect, flow, pipe } from "effect";

export const GithubConfig = Config.all({
  token: Config.redacted("GITHUB_TOKEN"),
  baseUrl: Config.string("GITHUB_BASE_URL").pipe(
    Config.withDefault("https://api.github.com"),
  ),
});

export const GithubHttpClient = Effect.Do.pipe(
  Effect.bind("config", () => GithubConfig),
  Effect.bind("httpClient", () => HttpClient.HttpClient),
  Effect.map(({ config, httpClient }) =>
    pipe(
      httpClient,
      HttpClient.filterStatusOk,
      HttpClient.mapRequest(
        flow(
          HttpClientRequest.prependUrl(config.baseUrl),
          HttpClientRequest.acceptJson,
          HttpClientRequest.bearerToken(config.token),
          HttpClientRequest.setHeader("X-GitHub-Api-Version", "2022-11-28"),
          HttpClientRequest.setHeader("User-Agent", "Hotspot-Analyzer/1.0"),
        ),
      ),
    ),
  ),
);
