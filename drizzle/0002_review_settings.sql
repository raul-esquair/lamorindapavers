CREATE TABLE "review_settings" (
	"id" text PRIMARY KEY NOT NULL,
	"paused" boolean DEFAULT false NOT NULL,
	"paused_at" timestamp with time zone,
	"resumed_at" timestamp with time zone,
	"email_count" integer,
	"gap_days_2" integer,
	"gap_days_3" integer,
	"skip_weekends" boolean,
	"repeat_window_days" integer,
	"templates" jsonb,
	"reply_to" text,
	"alert_emails" text,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
