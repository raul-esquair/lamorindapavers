import {
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  date,
} from "drizzle-orm/pg-core";

/**
 * Lifecycle of a review request. `active` is the only state the scheduler
 * will send for.
 */
export type RequestStatus = "active" | "stopped";

/**
 * Why a sequence stopped. `responded` is the kill switch firing from the
 * /feedback page; `complete` means all three touches went out normally.
 */
export type StoppedReason =
  | "responded"
  | "manual"
  | "unsubscribed"
  | "bounced"
  | "complete";

export type SuppressionReason = "unsubscribed" | "bounced" | "complained" | "manual";

export type LeadStatus = "new" | "contacted" | "quoted" | "won" | "lost";

export const reviewRequests = pgTable(
  "review_requests",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    /** URL-safe token used in /feedback?t=… — never sequential, never PII. */
    token: text("token").notNull(),

    name: text("name").notNull(),
    email: text("email").notNull(),
    phone: text("phone"),
    projectType: text("project_type"),

    /** When the job actually finished (for warranty + context in copy). */
    completedAt: date("completed_at"),
    /**
     * When touch 1 fires. Deliberately separate from completedAt so a
     * backfill of old jobs doesn't fire all three touches at once.
     */
    startAt: date("start_at").notNull(),

    status: text("status").$type<RequestStatus>().notNull().default("active"),
    stoppedReason: text("stopped_reason").$type<StoppedReason>(),
    stoppedAt: timestamp("stopped_at", { withTimezone: true }),

    /** Set by the kill switch the moment a face is clicked. */
    respondedAt: timestamp("responded_at", { withTimezone: true }),
    rating: integer("rating"),

    notes: text("notes"),

    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("review_requests_token_idx").on(table.token),
    // The scheduler's hot path: active rows whose next touch may be due.
    index("review_requests_due_idx").on(table.status, table.startAt),
    index("review_requests_email_idx").on(table.email),
  ],
);

/**
 * One row per email actually sent. Separate table rather than a JSON array so
 * the unique index below makes a duplicate send impossible at the database
 * level — not merely unlikely in application code.
 */
export const reviewTouches = pgTable(
  "review_touches",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    requestId: uuid("request_id")
      .notNull()
      .references(() => reviewRequests.id, { onDelete: "cascade" }),
    /** 1, 2 or 3. */
    n: integer("n").notNull(),
    sentAt: timestamp("sent_at", { withTimezone: true }).notNull().defaultNow(),
    /** Resend message id, for tracing a specific send. */
    providerId: text("provider_id"),
  },
  (table) => [uniqueIndex("review_touches_request_n_idx").on(table.requestId, table.n)],
);

/**
 * Email-level suppression. Deliberately NOT a flag on review_requests: an
 * unsubscribe has to outlive the request it came from, or the next project
 * for that customer would email them again.
 */
export const emailSuppressions = pgTable("email_suppressions", {
  email: text("email").primaryKey(),
  reason: text("reason").$type<SuppressionReason>().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

/**
 * Quote submissions. Today these exist only as an email in Steve's inbox —
 * persisting them is what makes "which pages produce work" answerable.
 */
export const leads = pgTable(
  "leads",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    email: text("email").notNull(),
    phone: text("phone"),
    city: text("city"),
    service: text("service"),
    timeline: text("timeline"),
    details: text("details"),

    /** Attribution: the page the quote was submitted from. */
    sourcePath: text("source_path"),
    /** "modal" | "contact-page" — which surface produced it. */
    sourceKind: text("source_kind"),

    status: text("status").$type<LeadStatus>().notNull().default("new"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("leads_created_idx").on(table.createdAt)],
);

export type ReviewRequest = typeof reviewRequests.$inferSelect;
export type NewReviewRequest = typeof reviewRequests.$inferInsert;
export type ReviewTouch = typeof reviewTouches.$inferSelect;
export type Lead = typeof leads.$inferSelect;
export type NewLead = typeof leads.$inferInsert;
