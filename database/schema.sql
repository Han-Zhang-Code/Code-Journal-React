set client_min_messages to warning;

-- DANGER: this is NOT how to do it in the real world.
-- `drop schema` INSTANTLY ERASES EVERYTHING.
drop schema "public" cascade;

create schema "public";
create table "public"."users" (
  "userId"         serial,
  "username"       text           not null,
  "hashedPassword" text           not null,
  "createdAt"      timestamptz(6) not null default now(),
  primary key ("userId"),
  unique ("username")
);
CREATE TABLE "public"."code-journal" (
	"entryId" serial NOT NULL,
	"html" TEXT,
	"css" TEXT,
	"javascript" TEXT,
	"title" TEXT NOT NULL,
	"imageUrl" TEXT NOT NULL,
	"description" TEXT NOT NULL,
  "createdAt"      timestamptz(6) not null default now(),
  "userId" INTEGER not null,
  "shared" BOOLEAN not null,
  "sharedEdit" BOOLEAN not null,
	CONSTRAINT "code-journal_pk" PRIMARY KEY ("entryId"),
    foreign key ("userId")
   references "users" ("userId")
) WITH (
  OIDS=FALSE
);
CREATE TABLE "public"."comments" (
  "commentsId" serial NOT NULL,
	"userId" int NOT NULL,
  "entryId" int NOT NULL,
	"comments" TEXT,
  primary key ("commentsId"),
  FOREIGN KEY ("entryId") REFERENCES "code-journal"("entryId"),
  FOREIGN KEY ("userId") REFERENCES "users"("userId")
) WITH (
  OIDS=FALSE
);
