import { sql } from "drizzle-orm";
import {
  boolean,
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

    /**
     * Street address for the estimate visit. The quote form only asks for a
     * city, so this is usually null at insert and filled in during the SMS
     * conversation — a visit cannot be booked without it, and it is also the
     * input to travel-zone clustering.
     */
    address: text("address"),

    /**
     * TCPA record. Storing a boolean would be worthless in a dispute: what
     * matters is when they agreed and to exactly what wording, so the copy
     * itself is snapshotted rather than referenced by version number (the
     * form text will be edited, and old rows must keep what was shown then).
     *
     * ⚠️ **Currently never written.** The opt-in checkbox was removed on
     * 2026-09-08: the system is notify-only, nothing texts customers, and a
     * box reading "text me about scheduling my estimate" was a promise the
     * site does not keep. The columns stay for the deferred customer-facing
     * work; if that returns, restore the checkbox and the snapshot together —
     * consent without a stored record of the exact wording is worth nothing.
     */
    smsConsentAt: timestamp("sms_consent_at", { withTimezone: true }),
    smsConsentText: text("sms_consent_text"),
    smsConsentIp: text("sms_consent_ip"),

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

/* ------------------------------------------------------------------------ *
 * SMS appointment setting
 *
 * The lead pipeline's missing middle: a lead comes in, an AI texter books an
 * estimate visit on Steve's calendar, and the outcome of that visit feeds the
 * review sequence above. Same architectural discipline as the review system —
 * duplicate sends are impossible at the database level, not merely guarded.
 * ------------------------------------------------------------------------ */

/**
 * Where the *conversation* is. Deliberately separate from `leads.status`,
 * which tracks the commercial funnel (new → contacted → quoted → won/lost).
 * Conflating them loses information: a lead can be `contacted` while the
 * thread is `escalated`, and a `booked` thread is still commercially `new`.
 *
 * The terminal states below the happy path are not edge cases — most leads
 * end in one of them, and a state machine that models only booking leaves
 * everything else piled in one bucket where the pipeline view is useless.
 */
export type ConversationState =
  // Happy path
  | "queued"
  | "texted"
  | "engaged"
  | "collecting_address"
  | "slots_proposed"
  | "booked"
  | "confirmed"
  | "completed"
  // Terminal
  | "no_response"
  | "out_of_area"
  | "not_interested"
  | "wants_call"
  | "escalated"
  | "opted_out";

/** States where no further automated outbound may be sent. */
export const CLOSED_CONVERSATION_STATES = [
  "completed",
  "no_response",
  "out_of_area",
  "not_interested",
  "opted_out",
] as const;

export type MessageDirection = "inbound" | "outbound";
export type MessageStatus = "queued" | "sent" | "delivered" | "failed" | "received";

export type AppointmentStatus =
  | "confirmed"
  | "rescheduled"
  | "cancelled"
  | "completed"
  | "no_show";

/** What actually came of the visit. Feeds `leads.status` and the review sequence. */
export type AppointmentOutcome = "won" | "quoted" | "lost";

export type ReminderKind = "confirmation" | "day_before" | "same_day";

export type PhoneSuppressionReason = "stop" | "manual" | "carrier_block" | "invalid";

export const smsConversations = pgTable(
  "sms_conversations",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    leadId: uuid("lead_id")
      .notNull()
      .references(() => leads.id, { onDelete: "cascade" }),

    /** E.164, normalised on write. The join key for every inbound webhook. */
    phone: text("phone").notNull(),

    state: text("state").$type<ConversationState>().notNull().default("queued"),

    /**
     * The escalation kill switch. Once Steve replies himself this goes false
     * and the AI goes silent — two voices texting one customer from the same
     * number is the worst thing this system can do. Deliberately a separate
     * flag from `state`, because escalation can happen from any state and
     * must survive whatever the state moves to afterwards.
     */
    aiEnabled: boolean("ai_enabled").notNull().default(true),
    escalatedAt: timestamp("escalated_at", { withTimezone: true }),
    escalatedReason: text("escalated_reason"),

    /**
     * Follow-up cadence for non-responders: 3 outbound touches, then stop.
     * Past three, complaint rates climb and carriers start filtering the
     * number — the cost of over-texting is paid by every future lead, not
     * just this one. Any inbound reply clears `nextTouchAt`.
     */
    touchesSent: integer("touches_sent").notNull().default(0),
    nextTouchAt: timestamp("next_touch_at", { withTimezone: true }),

    lastInboundAt: timestamp("last_inbound_at", { withTimezone: true }),
    lastOutboundAt: timestamp("last_outbound_at", { withTimezone: true }),

    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    // One thread per lead.
    uniqueIndex("sms_conversations_lead_idx").on(table.leadId),
    /**
     * At most one LIVE thread per phone number. A duplicate form submission
     * creates two leads, and without this the same person gets two AI texters
     * talking over each other. Partial so a repeat customer months later
     * still gets a fresh thread.
     *
     * ⚠️ The predicate lists closed states literally — Postgres cannot read
     * CLOSED_CONVERSATION_STATES. Adding a terminal state means editing both
     * and generating a migration.
     */
    uniqueIndex("sms_conversations_live_phone_idx")
      .on(table.phone)
      .where(
        sql`${table.state} not in ('completed','no_response','out_of_area','not_interested','opted_out')`,
      ),
    // The dispatcher's hot path: threads with a touch due.
    index("sms_conversations_due_idx").on(table.state, table.nextTouchAt),
  ],
);

/**
 * Full transcript, inbound and outbound. Every message the customer sees is
 * a row here — an AI that texts customers without a durable log of what it
 * said is not debuggable and not defensible.
 */
export const smsMessages = pgTable(
  "sms_messages",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    conversationId: uuid("conversation_id")
      .notNull()
      .references(() => smsConversations.id, { onDelete: "cascade" }),

    direction: text("direction").$type<MessageDirection>().notNull(),
    body: text("body").notNull(),

    /**
     * Twilio's message SID. Unique because **Twilio retries webhooks** — a
     * retried delivery must be a no-op, not a second inbound message the AI
     * replies to again. Same reasoning as review_touches (request_id, n):
     * make the duplicate impossible in the database rather than unlikely in
     * application code. Nullable (Postgres allows many NULLs in a unique
     * index) so a queued-but-unsent row is legal.
     */
    providerSid: text("provider_sid"),
    status: text("status").$type<MessageStatus>().notNull().default("queued"),
    errorMessage: text("error_message"),

    /** Which model wrote it. Null for templated copy or a human reply. */
    aiModel: text("ai_model"),

    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("sms_messages_provider_sid_idx").on(table.providerSid),
    // Transcript fetch, oldest first.
    index("sms_messages_thread_idx").on(table.conversationId, table.createdAt),
  ],
);

/**
 * A booked estimate visit. `conversationId` is nullable so Steve can add one
 * by hand from the dashboard without inventing a fake SMS thread.
 */
export const appointments = pgTable(
  "appointments",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    leadId: uuid("lead_id")
      .notNull()
      .references(() => leads.id, { onDelete: "cascade" }),
    conversationId: uuid("conversation_id").references(() => smsConversations.id, {
      onDelete: "set null",
    }),

    startAt: timestamp("start_at", { withTimezone: true }).notNull(),
    endAt: timestamp("end_at", { withTimezone: true }).notNull(),

    /** A site visit needs a street address, not a city. */
    address: text("address").notNull(),
    city: text("city"),
    /** Travel zone at booking time — see lib/appointments/availability.ts. */
    zone: text("zone"),

    status: text("status").$type<AppointmentStatus>().notNull().default("confirmed"),

    /**
     * Google Calendar event id. The join key for reschedules, cancellations
     * and the reconciliation pass that catches Steve moving an appointment
     * from his phone. Adding this later would mean fuzzy-matching timestamps,
     * so it exists from the first migration.
     */
    calendarEventId: text("calendar_event_id"),

    confirmedAt: timestamp("confirmed_at", { withTimezone: true }),
    cancelledAt: timestamp("cancelled_at", { withTimezone: true }),

    /** Captured by texting Steve after the visit window passes. */
    outcome: text("outcome").$type<AppointmentOutcome>(),
    outcomeAt: timestamp("outcome_at", { withTimezone: true }),

    notes: text("notes"),

    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("appointments_calendar_event_idx").on(table.calendarEventId),
    // Reminder dispatch + the reconciliation pass both scan upcoming rows.
    index("appointments_upcoming_idx").on(table.status, table.startAt),
    index("appointments_lead_idx").on(table.leadId),
  ],
);

/**
 * One row per reminder actually sent. A table rather than a counter for the
 * same reason review_touches is: the unique index makes "texted them the
 * day-before reminder twice" impossible, and a reminder sent twice is the
 * failure mode people actually notice.
 */
export const appointmentReminders = pgTable(
  "appointment_reminders",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    appointmentId: uuid("appointment_id")
      .notNull()
      .references(() => appointments.id, { onDelete: "cascade" }),
    kind: text("kind").$type<ReminderKind>().notNull(),
    sentAt: timestamp("sent_at", { withTimezone: true }).notNull().defaultNow(),
    providerSid: text("provider_sid"),
  },
  (table) => [uniqueIndex("appointment_reminders_kind_idx").on(table.appointmentId, table.kind)],
);

/**
 * Phone-level opt-out. Separate table from email_suppressions rather than a
 * shared "contacts" table, for the reason that one already exists: a STOP has
 * to outlive the lead it came from, or the same person's next project texts
 * them again. Keyed by E.164 phone.
 */
export const smsSuppressions = pgTable("sms_suppressions", {
  phone: text("phone").primaryKey(),
  reason: text("reason").$type<PhoneSuppressionReason>().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type SmsConversation = typeof smsConversations.$inferSelect;
export type NewSmsConversation = typeof smsConversations.$inferInsert;
export type SmsMessage = typeof smsMessages.$inferSelect;
export type NewSmsMessage = typeof smsMessages.$inferInsert;
export type Appointment = typeof appointments.$inferSelect;
export type NewAppointment = typeof appointments.$inferInsert;
export type AppointmentReminder = typeof appointmentReminders.$inferSelect;
