CREATE TABLE "appointment_reminders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"appointment_id" uuid NOT NULL,
	"kind" text NOT NULL,
	"sent_at" timestamp with time zone DEFAULT now() NOT NULL,
	"provider_sid" text
);
--> statement-breakpoint
CREATE TABLE "appointments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"lead_id" uuid NOT NULL,
	"conversation_id" uuid,
	"start_at" timestamp with time zone NOT NULL,
	"end_at" timestamp with time zone NOT NULL,
	"address" text NOT NULL,
	"city" text,
	"zone" text,
	"status" text DEFAULT 'confirmed' NOT NULL,
	"calendar_event_id" text,
	"confirmed_at" timestamp with time zone,
	"cancelled_at" timestamp with time zone,
	"outcome" text,
	"outcome_at" timestamp with time zone,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sms_conversations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"lead_id" uuid NOT NULL,
	"phone" text NOT NULL,
	"state" text DEFAULT 'queued' NOT NULL,
	"ai_enabled" boolean DEFAULT true NOT NULL,
	"escalated_at" timestamp with time zone,
	"escalated_reason" text,
	"touches_sent" integer DEFAULT 0 NOT NULL,
	"next_touch_at" timestamp with time zone,
	"last_inbound_at" timestamp with time zone,
	"last_outbound_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sms_messages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"conversation_id" uuid NOT NULL,
	"direction" text NOT NULL,
	"body" text NOT NULL,
	"provider_sid" text,
	"status" text DEFAULT 'queued' NOT NULL,
	"error_message" text,
	"ai_model" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sms_suppressions" (
	"phone" text PRIMARY KEY NOT NULL,
	"reason" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "leads" ADD COLUMN "address" text;--> statement-breakpoint
ALTER TABLE "leads" ADD COLUMN "sms_consent_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "leads" ADD COLUMN "sms_consent_text" text;--> statement-breakpoint
ALTER TABLE "leads" ADD COLUMN "sms_consent_ip" text;--> statement-breakpoint
ALTER TABLE "appointment_reminders" ADD CONSTRAINT "appointment_reminders_appointment_id_appointments_id_fk" FOREIGN KEY ("appointment_id") REFERENCES "public"."appointments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_lead_id_leads_id_fk" FOREIGN KEY ("lead_id") REFERENCES "public"."leads"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_conversation_id_sms_conversations_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "public"."sms_conversations"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sms_conversations" ADD CONSTRAINT "sms_conversations_lead_id_leads_id_fk" FOREIGN KEY ("lead_id") REFERENCES "public"."leads"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sms_messages" ADD CONSTRAINT "sms_messages_conversation_id_sms_conversations_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "public"."sms_conversations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "appointment_reminders_kind_idx" ON "appointment_reminders" USING btree ("appointment_id","kind");--> statement-breakpoint
CREATE UNIQUE INDEX "appointments_calendar_event_idx" ON "appointments" USING btree ("calendar_event_id");--> statement-breakpoint
CREATE INDEX "appointments_upcoming_idx" ON "appointments" USING btree ("status","start_at");--> statement-breakpoint
CREATE INDEX "appointments_lead_idx" ON "appointments" USING btree ("lead_id");--> statement-breakpoint
CREATE UNIQUE INDEX "sms_conversations_lead_idx" ON "sms_conversations" USING btree ("lead_id");--> statement-breakpoint
CREATE UNIQUE INDEX "sms_conversations_live_phone_idx" ON "sms_conversations" USING btree ("phone") WHERE "sms_conversations"."state" not in ('completed','no_response','out_of_area','not_interested','opted_out');--> statement-breakpoint
CREATE INDEX "sms_conversations_due_idx" ON "sms_conversations" USING btree ("state","next_touch_at");--> statement-breakpoint
CREATE UNIQUE INDEX "sms_messages_provider_sid_idx" ON "sms_messages" USING btree ("provider_sid");--> statement-breakpoint
CREATE INDEX "sms_messages_thread_idx" ON "sms_messages" USING btree ("conversation_id","created_at");