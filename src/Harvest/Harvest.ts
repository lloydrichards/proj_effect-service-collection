import { Project, TeamMember, TimeEntry } from "@/types/Harvest";
import {
  FetchHttpClient,
  HttpClientRequest,
  HttpClientResponse,
} from "@effect/platform";
import { Array, Effect, pipe, RateLimiter } from "effect";
import { HarvestHttpClient } from "./HarvestHttpClient";

const HarvestRateLimiter = RateLimiter.make({
  interval: "1 minutes",
  limit: 90,
});

export class Harvest extends Effect.Service<Harvest>()("app/Harvest", {
  dependencies: [FetchHttpClient.layer],
  effect: Effect.gen(function* () {
    const httpsClient = yield* HarvestHttpClient;

    const getPageEntries = (
      { year, user }: { year: number; user?: string },
      page: number,
    ) =>
      pipe(
        HttpClientRequest.get("/time_entries").pipe(
          HttpClientRequest.setUrlParam("from", `${year}-01-01`),
          HttpClientRequest.setUrlParam("to", `${year}-12-31`),
          HttpClientRequest.setUrlParam("page", page.toString()),
          user ? HttpClientRequest.setUrlParam("user_id", user) : (a) => a,
        ),
        httpsClient.execute,
        Effect.andThen(HttpClientResponse.schemaBodyJson(TimeEntry.Page)),
      );

    const allEntries = Effect.fn("Harvest.allEntries")(
      (year: number, user?: string) =>
        Effect.flatMap(HarvestRateLimiter, (limiter) =>
          pipe(
            getPageEntries({ year, user }, 1),
            Effect.andThen(({ total_pages }) =>
              Effect.all(
                Array.makeBy(total_pages, (x) =>
                  limiter(getPageEntries({ year, user }, x + 1)),
                ),
                { concurrency: "unbounded" },
              ),
            ),
            Effect.map((entries) =>
              entries.flatMap(({ time_entries }) => time_entries),
            ),
          ),
        ),
    );

    const allProjects = Effect.fn("Harvest.allProjects")(() =>
      httpsClient.get("/projects").pipe(
        Effect.andThen(HttpClientResponse.schemaBodyJson(Project.Page)),
        Effect.andThen((response) => response.projects),
      ),
    );

    const allTeamMembers = Effect.fn("Harvest.allTeamMembers")(() =>
      httpsClient.get("/users").pipe(
        Effect.andThen(HttpClientResponse.schemaBodyJson(TeamMember.Page)),
        Effect.andThen((response) => response.users),
      ),
    );

    return {
      allEntries,
      allProjects,
      allTeamMembers,
      getPageEntries,
    } as const;
  }),
  accessors: true,
}) {}
