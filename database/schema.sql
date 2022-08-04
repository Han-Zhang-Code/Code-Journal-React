set client_min_messages to warning;

-- DANGER: this is NOT how to do it in the real world.
-- `drop schema` INSTANTLY ERASES EVERYTHING.
drop schema "public" cascade;

create schema "public";

CREATE TABLE "public"."code-journal" (
	"entryId" serial NOT NULL,
	"html" TEXT,
	"css" TEXT,
	"javascript" TEXT,
	"title" TEXT NOT NULL,
	"imageUrl" TEXT NOT NULL,
	"description" TEXT NOT NULL,
  "createdAt"      timestamptz(6) not null default now(),
	CONSTRAINT "code-journal_pk" PRIMARY KEY ("entryId")
) WITH (
  OIDS=FALSE
);

create table "public"."users" (
  "userId"         serial,
  "username"       text           not null,
  "hashedPassword" text           not null,
  "createdAt"      timestamptz(6) not null default now(),
  primary key ("userId"),
  unique ("username")
);
