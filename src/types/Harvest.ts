import { Schema } from "effect";

export class Project extends Schema.Class<Project>("Project")({
  id: Schema.Number,
  name: Schema.String,
  code: Schema.NullOr(Schema.String),
  is_active: Schema.Boolean,
  is_billable: Schema.Boolean,
  is_fixed_fee: Schema.Boolean,
  bill_by: Schema.String,
  budget: Schema.NullOr(Schema.Number),
  budget_by: Schema.String,
  budget_is_monthly: Schema.Boolean,
  notify_when_over_budget: Schema.Boolean,
  over_budget_notification_percentage: Schema.Number,
  show_budget_to_all: Schema.Boolean,
  created_at: Schema.DateFromString,
  updated_at: Schema.DateFromString,
  starts_on: Schema.NullOr(Schema.DateFromString),
  ends_on: Schema.NullOr(Schema.DateFromString),
  over_budget_notification_date: Schema.NullOr(Schema.DateFromString),
  notes: Schema.NullOr(Schema.String),
  cost_budget: Schema.NullOr(Schema.Number),
  cost_budget_include_expenses: Schema.Boolean,
  hourly_rate: Schema.NullOr(Schema.Number),
  fee: Schema.NullOr(Schema.Number),
}) {
  static readonly Page = Schema.Struct({
    projects: Schema.Array(this),
    total_pages: Schema.Number,
    total_entries: Schema.Number,
    next_page: Schema.NullOr(Schema.Number),
    previous_page: Schema.NullOr(Schema.Number),
    page: Schema.Number,
  });
}

export class TeamMember extends Schema.Class<TeamMember>("TeamMember")({
  id: Schema.Number,
  first_name: Schema.String,
  last_name: Schema.String,
  email: Schema.String,
  telephone: Schema.String,
  timezone: Schema.String,
  weekly_capacity: Schema.Number,
  has_access_to_all_future_projects: Schema.Boolean,
  is_contractor: Schema.Boolean,
  is_active: Schema.Boolean,
  calendar_integration_enabled: Schema.Boolean,
  calendar_integration_source: Schema.Null,
  created_at: Schema.DateFromString,
  updated_at: Schema.DateFromString,
  can_create_projects: Schema.Boolean,
  default_hourly_rate: Schema.NullOr(Schema.Number),
  cost_rate: Schema.NullOr(Schema.Number),
  roles: Schema.Array(Schema.String),
  access_roles: Schema.Array(Schema.String),
  permissions_claims: Schema.Array(Schema.String),
  avatar_url: Schema.String,
}) {
  static readonly Page = Schema.Struct({
    users: Schema.Array(this),
    total_pages: Schema.Number,
    total_entries: Schema.Number,
    next_page: Schema.NullOr(Schema.Number),
    previous_page: Schema.NullOr(Schema.Number),
    page: Schema.Number,
  });
}

export class TimeEntry extends Schema.Class<TimeEntry>("TimeEntry")({
  id: Schema.Int,
  spent_date: Schema.DateFromString,
  hours: Schema.Number,
  hours_without_timer: Schema.Number,
  rounded_hours: Schema.Number,
  notes: Schema.NullOr(Schema.String),
  is_locked: Schema.Boolean,
  locked_reason: Schema.NullOr(Schema.String),
  is_closed: Schema.Boolean,
  is_billed: Schema.Boolean,
  timer_started_at: Schema.NullOr(Schema.String),
  started_time: Schema.NullOr(Schema.String),
  ended_time: Schema.NullOr(Schema.String),
  is_running: Schema.Boolean,
  billable: Schema.Boolean,
  budgeted: Schema.Boolean,
  billable_rate: Schema.NullOr(Schema.Number),
  cost_rate: Schema.NullOr(Schema.Number),
  created_at: Schema.DateFromString,
  updated_at: Schema.DateFromString,
  user: Schema.Struct({
    id: Schema.Int,
    name: Schema.String,
  }),
  client: Schema.Struct({
    id: Schema.Int,
    name: Schema.String,
    currency: Schema.String,
  }),
  project: Schema.Struct({
    id: Schema.Int,
    name: Schema.String,
    code: Schema.NullOr(Schema.String),
  }),
  task: Schema.Struct({
    id: Schema.Int,
    name: Schema.String,
  }),
  user_assignment: Schema.Struct({
    id: Schema.Int,
    is_project_manager: Schema.Boolean,
    is_active: Schema.Boolean,
    use_default_rates: Schema.Boolean,
    created_at: Schema.DateFromString,
    updated_at: Schema.DateFromString,
    hourly_rate: Schema.NullOr(Schema.Number),
  }),
  task_assignment: Schema.Struct({
    id: Schema.Int,
    billable: Schema.Boolean,
    is_active: Schema.Boolean,
    created_at: Schema.DateFromString,
    updated_at: Schema.DateFromString,
    hourly_rate: Schema.NullOr(Schema.Number),
    budget: Schema.NullOr(Schema.Number),
  }),
  invoice: Schema.NullOr(
    Schema.Struct({
      id: Schema.Int,
      number: Schema.String,
    })
  ),
  external_reference: Schema.NullOr(Schema.String),
}) {
  static readonly Page = Schema.Struct({
    time_entries: Schema.Array(this),
    total_pages: Schema.Number,
    total_entries: Schema.Number,
    next_page: Schema.NullOr(Schema.Number),
    previous_page: Schema.NullOr(Schema.Number),
    page: Schema.Number,
  });
}
