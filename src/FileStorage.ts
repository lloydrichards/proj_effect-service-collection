import { FileSystem } from "@effect/platform/FileSystem";
import { BunFileSystem } from "@effect/platform-bun";
import { Data, Effect } from "effect";

class FileStorageError extends Data.TaggedError("FileStorageError")<{
  message: string;
  cause?: unknown;
}> {}

export class FileStorage extends Effect.Service<FileStorage>()("FileStorage", {
  dependencies: [BunFileSystem.layer],
  effect: Effect.gen(function* () {
    const fs = yield* FileSystem;

    const read = Effect.fn("FileStorage.read")((filePath: string) =>
      fs.readFileString(filePath, "utf8").pipe(
        Effect.mapError(
          (error) =>
            new FileStorageError({
              message: `Failed to read file: ${filePath}`,
              cause: error,
            })
        )
      )
    );

    const write = Effect.fn("FileStorage.write")(
      (filePath: string, content: string) =>
        fs.writeFileString(filePath, content).pipe(
          Effect.mapError(
            (error) =>
              new FileStorageError({
                message: `Failed to write file: ${filePath}`,
                cause: error,
              })
          )
        )
    );

    const remove = Effect.fn("FileStorage.remove")((filePath: string) =>
      fs.remove(filePath).pipe(
        Effect.mapError(
          (error) =>
            new FileStorageError({
              message: `Failed to remove file: ${filePath}`,
              cause: error,
            })
        )
      )
    );

    return {
      read,
      write,
      remove,
    } as const;
  }),
}) {}
