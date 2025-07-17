import { Schema } from "effect";

export const GitHubTreeBlobNode = Schema.Struct({
  type: Schema.Literal("blob"),
  path: Schema.String,
  mode: Schema.String,
  sha: Schema.String,
  size: Schema.Number,
  url: Schema.String,
});
export const GitHubTreeDirNode = Schema.Struct({
  type: Schema.Literal("tree"),
  path: Schema.String,
  mode: Schema.String,
  sha: Schema.String,
  url: Schema.String,
});

export class GitHubTree extends Schema.Class<GitHubTree>("GitHubTree")({
  sha: Schema.String,
  url: Schema.String,
  tree: Schema.Array(Schema.Union(GitHubTreeBlobNode, GitHubTreeDirNode)),
}) {
  static Array = Schema.Array(this);
}

const CommitSummary = Schema.Struct({
  author: Schema.Struct({
    name: Schema.String,
    email: Schema.String,
    date: Schema.Union(Schema.Date, Schema.DateFromSelf),
  }),
  committer: Schema.Struct({
    name: Schema.String,
    email: Schema.String,
    date: Schema.Union(Schema.Date, Schema.DateFromSelf),
  }),
  message: Schema.String,
  tree: Schema.Struct({
    sha: Schema.String,
    url: Schema.String,
  }),
  url: Schema.String,
  comment_count: Schema.Number,
  verification: Schema.NullOr(
    Schema.Struct({
      verified: Schema.Boolean,
      reason: Schema.String,
      signature: Schema.NullOr(Schema.String),
      payload: Schema.NullOr(Schema.String),
      verified_at: Schema.NullOr(
        Schema.Union(Schema.Date, Schema.DateFromSelf),
      ),
    }),
  ),
});

const CommitAuthor = Schema.Struct({
  login: Schema.String,
  id: Schema.Number,
  node_id: Schema.String,
  avatar_url: Schema.String,
  gravatar_id: Schema.String,
  url: Schema.String,
  html_url: Schema.String,
  followers_url: Schema.String,
  following_url: Schema.String,
  gists_url: Schema.String,
  starred_url: Schema.String,
  subscriptions_url: Schema.String,
  organizations_url: Schema.String,
  repos_url: Schema.String,
  events_url: Schema.String,
  received_events_url: Schema.String,
  type: Schema.String,
  user_view_type: Schema.String,
  site_admin: Schema.Boolean,
});

const Committer = Schema.Struct({
  login: Schema.String,
  id: Schema.Number,
  node_id: Schema.String,
  avatar_url: Schema.String,
  gravatar_id: Schema.String,
  url: Schema.String,
  html_url: Schema.String,
  followers_url: Schema.String,
  following_url: Schema.String,
  gists_url: Schema.String,
  starred_url: Schema.String,
  subscriptions_url: Schema.String,
  organizations_url: Schema.String,
  repos_url: Schema.String,
  events_url: Schema.String,
  received_events_url: Schema.String,
  type: Schema.String,
  user_view_type: Schema.String,
  site_admin: Schema.Boolean,
});

export class GitHubCommit extends Schema.Class<GitHubCommit>("GitHubCommit")({
  sha: Schema.String,
  node_id: Schema.String,
  commit: CommitSummary,
  url: Schema.String,
  html_url: Schema.String,
  comments_url: Schema.String,
  author: Schema.NullOr(CommitAuthor),
  committer: Schema.NullOr(Committer),
  parents: Schema.Array(
    Schema.Struct({
      sha: Schema.String,
      url: Schema.String,
      html_url: Schema.String,
    }),
  ),
}) {
  static Array = Schema.Array(this);
}

export class GitHubCommitDetails extends Schema.Class<GitHubCommitDetails>(
  "GitHubCommitDetails",
)({
  ...GitHubCommit.fields,
  stats: Schema.Struct({
    total: Schema.Number,
    additions: Schema.Number,
    deletions: Schema.Number,
  }),
  files: Schema.Array(
    Schema.Struct({
      sha: Schema.String,
      filename: Schema.String,
      status: Schema.String,
      additions: Schema.Number,
      deletions: Schema.Number,
      changes: Schema.Number,
      blob_url: Schema.String,
      raw_url: Schema.String,
      contents_url: Schema.String,
      patch: Schema.optional(Schema.String),
    }),
  ),
}) {
  static Array = Schema.Array(this);
}

const SecurityStatus = Schema.Struct({
  status: Schema.String,
});
const RepositoryOwner = Schema.Struct({
  login: Schema.String,
  id: Schema.Number,
  node_id: Schema.String,
  avatar_url: Schema.String,
  gravatar_id: Schema.String,
  url: Schema.String,
  html_url: Schema.String,
  followers_url: Schema.String,
  following_url: Schema.String,
  gists_url: Schema.String,
  starred_url: Schema.String,
  subscriptions_url: Schema.String,
  organizations_url: Schema.String,
  repos_url: Schema.String,
  events_url: Schema.String,
  received_events_url: Schema.String,
  type: Schema.String,
  user_view_type: Schema.String,
  site_admin: Schema.Boolean,
});
const RepositoryPermissions = Schema.Struct({
  admin: Schema.Boolean,
  maintain: Schema.Boolean,
  push: Schema.Boolean,
  triage: Schema.Boolean,
  pull: Schema.Boolean,
});
const Organization = Schema.Struct({
  login: Schema.String,
  id: Schema.Number,
  node_id: Schema.String,
  avatar_url: Schema.String,
  gravatar_id: Schema.String,
  url: Schema.String,
  html_url: Schema.String,
  followers_url: Schema.String,
  following_url: Schema.String,
  gists_url: Schema.String,
  starred_url: Schema.String,
  subscriptions_url: Schema.String,
  organizations_url: Schema.String,
  repos_url: Schema.String,
  events_url: Schema.String,
  received_events_url: Schema.String,
  type: Schema.String,
  user_view_type: Schema.String,
  site_admin: Schema.Boolean,
});
export class GitHubRepository extends Schema.Class<GitHubRepository>(
  "GitHubRepository",
)({
  id: Schema.Number,
  node_id: Schema.String,
  name: Schema.String,
  full_name: Schema.String,
  private: Schema.Boolean,
  owner: RepositoryOwner,
  html_url: Schema.String,
  description: Schema.NullOr(Schema.String),
  fork: Schema.Boolean,
  url: Schema.String,
  forks_url: Schema.String,
  keys_url: Schema.String,
  collaborators_url: Schema.String,
  teams_url: Schema.String,
  hooks_url: Schema.String,
  issue_events_url: Schema.String,
  events_url: Schema.String,
  assignees_url: Schema.String,
  branches_url: Schema.String,
  tags_url: Schema.String,
  blobs_url: Schema.String,
  git_tags_url: Schema.String,
  git_refs_url: Schema.String,
  trees_url: Schema.String,
  statuses_url: Schema.String,
  languages_url: Schema.String,
  stargazers_url: Schema.String,
  contributors_url: Schema.String,
  subscribers_url: Schema.String,
  subscription_url: Schema.String,
  commits_url: Schema.String,
  git_commits_url: Schema.String,
  comments_url: Schema.String,
  issue_comment_url: Schema.String,
  contents_url: Schema.String,
  compare_url: Schema.String,
  merges_url: Schema.String,
  archive_url: Schema.String,
  downloads_url: Schema.String,
  issues_url: Schema.String,
  pulls_url: Schema.String,
  milestones_url: Schema.String,
  notifications_url: Schema.String,
  labels_url: Schema.String,
  releases_url: Schema.String,
  deployments_url: Schema.String,
  created_at: Schema.DateFromString,
  updated_at: Schema.DateFromString,
  pushed_at: Schema.DateFromString,
  git_url: Schema.String,
  ssh_url: Schema.String,
  clone_url: Schema.String,
  svn_url: Schema.String,
  homepage: Schema.NullOr(Schema.String),
  size: Schema.Number,
  stargazers_count: Schema.Number,
  watchers_count: Schema.Number,
  language: Schema.String,
  has_issues: Schema.Boolean,
  has_projects: Schema.Boolean,
  has_downloads: Schema.Boolean,
  has_wiki: Schema.Boolean,
  has_pages: Schema.Boolean,
  has_discussions: Schema.Boolean,
  forks_count: Schema.Number,
  mirror_url: Schema.NullOr(Schema.String),
  archived: Schema.Boolean,
  disabled: Schema.Boolean,
  open_issues_count: Schema.Number,
  license: Schema.NullOr(
    Schema.Struct({
      key: Schema.String,
      name: Schema.String,
      spdx_id: Schema.String,
      url: Schema.String,
      node_id: Schema.String,
    }),
  ),
  allow_forking: Schema.Boolean,
  is_template: Schema.Boolean,
  web_commit_signoff_required: Schema.Boolean,
  topics: Schema.Array(Schema.String),
  visibility: Schema.String,
  forks: Schema.Number,
  open_issues: Schema.Number,
  watchers: Schema.Number,
  default_branch: Schema.String,
  permissions: RepositoryPermissions,
  temp_clone_token: Schema.String,
  allow_squash_merge: Schema.Boolean,
  allow_merge_commit: Schema.Boolean,
  allow_rebase_merge: Schema.Boolean,
  allow_auto_merge: Schema.Boolean,
  delete_branch_on_merge: Schema.Boolean,
  allow_update_branch: Schema.Boolean,
  use_squash_pr_title_as_default: Schema.Boolean,
  squash_merge_commit_message: Schema.String,
  squash_merge_commit_title: Schema.String,
  merge_commit_message: Schema.String,
  merge_commit_title: Schema.String,
  custom_properties: Schema.Record({
    key: Schema.String,
    value: Schema.Any,
  }),
  organization: Organization,
  security_and_analysis: Schema.Record({
    key: Schema.String,
    value: SecurityStatus,
  }),
  network_count: Schema.Number,
  subscribers_count: Schema.Number,
}) {}

export class GitHubFileContent extends Schema.Class<GitHubFileContent>(
  "GitFileContent",
)({
  name: Schema.String,
  path: Schema.String,
  sha: Schema.String,
  size: Schema.Number,
  url: Schema.String,
  html_url: Schema.String,
  git_url: Schema.String,
  download_url: Schema.String,
  type: Schema.String,
  content: Schema.String,
  encoding: Schema.String,
  _links: Schema.Struct({
    self: Schema.String,
    git: Schema.String,
    html: Schema.String,
  }),
}) {}

const DateFromSeconds = Schema.transform(Schema.Number, Schema.DateFromSelf, {
  decode: (n) => new Date(n * 1000),
  encode: (d) => Math.floor(d.getTime() / 1000),
});

export class GitHubRateLimit extends Schema.Class<GitHubRateLimit>(
  "GitHubRateLimit",
)({
  rate: Schema.Struct({
    limit: Schema.Number,
    used: Schema.Number,
    remaining: Schema.Number,
    reset: DateFromSeconds,
  }),
}) {}
