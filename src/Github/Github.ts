import {
  GitHubCommit,
  GitHubCommitDetails,
  GitHubFileContent,
  GitHubRateLimit,
  GitHubRepository,
  GitHubTree,
} from "@/types/GitHub";
import {
  FetchHttpClient,
  HttpClientRequest,
  HttpClientResponse,
} from "@effect/platform";
import { Array, Effect, pipe } from "effect";
import { GithubHttpClient } from "./GithubHttpClient";

export class Github extends Effect.Service<Github>()("app/Github", {
  dependencies: [FetchHttpClient.layer],
  effect: Effect.gen(function* () {
    const httpsClient = yield* GithubHttpClient;
    const getRepository = Effect.fn("Github.getRepository")(
      (owner: string, repo: string) =>
        httpsClient
          .get(`/repos/${owner}/${repo}`)
          .pipe(
            Effect.andThen(HttpClientResponse.schemaBodyJson(GitHubRepository)),
          ),
    );

    const getAllFiles = Effect.fn("Github.getAllFiles")(
      (owner: string, repo: string) =>
        httpsClient
          .get(`/repos/${owner}/${repo}/git/trees/main?recursive=1`)
          .pipe(
            Effect.catchAll(() =>
              httpsClient.get(
                `/repos/${owner}/${repo}/git/trees/master?recursive=1`,
              ),
            ),
            Effect.andThen(HttpClientResponse.schemaBodyJson(GitHubTree)),
          ),
    );

    const getRateLimit = Effect.fn("Github.getRateLimit")(() =>
      httpsClient
        .get(`/rate_limit`)
        .pipe(
          Effect.andThen(HttpClientResponse.schemaBodyJson(GitHubRateLimit)),
        ),
    );

    const getCommits = Effect.fn("Github.getCommits")(
      (
        owner: string,
        repo: string,
        {
          since,
          page,
          path,
          per_page,
          until,
        }: {
          since?: Date;
          until?: Date;
          page?: number;
          path?: string;
          per_page?: number;
        },
      ) =>
        pipe(
          HttpClientRequest.get(`/repos/${owner}/${repo}/commits`).pipe(
            page
              ? HttpClientRequest.setUrlParam("page", String(page))
              : (a) => a,
            per_page
              ? HttpClientRequest.setUrlParam("per_page", String(per_page))
              : (a) => a,
            since
              ? HttpClientRequest.setUrlParam("since", since.toISOString())
              : (a) => a,
            until
              ? HttpClientRequest.setUrlParam("until", until.toISOString())
              : (a) => a,
            path ? HttpClientRequest.setUrlParam("path", path) : (a) => a,
          ),
          httpsClient.execute,
          Effect.andThen(HttpClientResponse.schemaBodyJson(GitHubCommit.Array)),
        ),
    );

    const getCommitDetails = Effect.fn("Github.getCommitDetails")(
      (owner: string, repo: string, sha: string) =>
        httpsClient
          .get(`/repos/${owner}/${repo}/commits/${sha}`)
          .pipe(
            Effect.andThen(
              HttpClientResponse.schemaBodyJson(GitHubCommitDetails),
            ),
          ),
    );

    const getFileContent = Effect.fn("Github.getFileContent")(
      (owner: string, repo: string, path: string, ref?: string) =>
        pipe(
          HttpClientRequest.get(
            `/repos/${owner}/${repo}/contents/${path}`,
          ).pipe(ref ? HttpClientRequest.setUrlParam("ref", ref) : (a) => a),
          httpsClient.execute,
          Effect.andThen(HttpClientResponse.schemaBodyJson(GitHubFileContent)),
        ),
    );

    const getAllCommits = Effect.fn("Github.getAllCommits")((
      owner: string,
      repo: string,
      options?: {
        since?: Date;
        until?: Date;
        maxCommits?: number;
      },
    ) => {
      const maxCommits = options?.maxCommits || 100_000;
      const perPage = 100;
      const maxPages = Math.min(50, Math.ceil(maxCommits / perPage)); // Safety limit

      return pipe(
        Effect.all(
          Array.makeBy(maxPages, (pageIndex) =>
            getCommits(owner, repo, {
              since: options?.since,
              until: options?.until,
              page: pageIndex + 1,
              per_page: perPage,
            }),
          ),
          { concurrency: 10 },
        ),
        Effect.map((pages) => {
          // Stop when we get a page with fewer commits than requested (indicates end)
          const finalCommits = [];
          for (const pageCommits of pages) {
            finalCommits.push(...pageCommits);
            if (pageCommits.length < perPage) break;
            if (finalCommits.length >= maxCommits) break;
          }
          return finalCommits.slice(0, maxCommits);
        }),
      );
    });
    return {
      getRepository,
      getAllFiles,
      getRateLimit,
      getCommits,
      getCommitDetails,
      getFileContent,
      getAllCommits,
    } as const;
  }),
  accessors: true,
}) {}
