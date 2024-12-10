BEGIN;

-- Drop all tables if they exist
DROP TABLE IF EXISTS public."Ratings" CASCADE;
DROP TABLE IF EXISTS public."Members" CASCADE;
DROP TABLE IF EXISTS public."Groups" CASCADE;
DROP TABLE IF EXISTS public."Favorites" CASCADE;
DROP TABLE IF EXISTS public."Accounts" CASCADE;
DROP TABLE IF EXISTS public."Shared" CASCADE;

-- Recreate tables
CREATE TABLE IF NOT EXISTS public."Accounts"
(
    ac_id SERIAL NOT NULL,
    email character varying(255) COLLATE pg_catalog."default" NOT NULL,
    password character varying(255) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT "Accounts_pkey" PRIMARY KEY (ac_id)
);

CREATE TABLE IF NOT EXISTS public."Favorites"
(
    fa_id SERIAL NOT NULL,
    ac_id integer NOT NULL,
    mo_id integer NOT NULL,
    movie character varying COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT "Favorites_pkey" PRIMARY KEY (fa_id)
);

CREATE TABLE IF NOT EXISTS public."Groups"
(
    gr_id SERIAL NOT NULL,
    owner integer NOT NULL,
    name character varying COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT "Groups_pkey" PRIMARY KEY (gr_id)
);

CREATE TABLE IF NOT EXISTS public."Members"
(
    me_id SERIAL NOT NULL,
    "group" integer NOT NULL,
    member integer NOT NULL,
    is_pending boolean default true,
    CONSTRAINT "Members_pkey" PRIMARY KEY (me_id)
);

CREATE TABLE IF NOT EXISTS public."Ratings"
(
    ra_id SERIAL NOT NULL,
    mo_id integer NOT NULL,
    movie character varying COLLATE pg_catalog."default" NOT NULL,
    stars smallint NOT NULL DEFAULT 0,
    text character varying COLLATE pg_catalog."default",
    "time" timestamp with time zone NOT NULL,
    ac_id integer NOT NULL,
    CONSTRAINT "Ratings_pkey" PRIMARY KEY (ra_id)
);

CREATE TABLE IF NOT EXISTS public."Shared"
(
    sh_id SERIAL NOT NULL,
    ac_id INTEGER NOT NULL,
    gr_id INTEGER NOT NULL,
    title VARCHAR(255) NOT NULL, 
    type VARCHAR(255) NOT NULL,
    img VARCHAR(255),
    location VARCHAR(255), 
    time TIMESTAMP, 
    date DATE,
    shared_at TIMESTAMP DEFAULT NOW(),  
    CONSTRAINT "Shared_pkey" PRIMARY KEY (sh_id)
);

ALTER TABLE IF EXISTS public."Favorites"
    ADD CONSTRAINT favorites_ac_id FOREIGN KEY (ac_id)
    REFERENCES public."Accounts" (ac_id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE CASCADE;

ALTER TABLE IF EXISTS public."Groups"
    ADD CONSTRAINT groups_ac_id FOREIGN KEY (owner)
    REFERENCES public."Accounts" (ac_id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE CASCADE;

ALTER TABLE IF EXISTS public."Members"
    ADD CONSTRAINT members_ac_id FOREIGN KEY (member)
    REFERENCES public."Accounts" (ac_id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE CASCADE;

ALTER TABLE IF EXISTS public."Members"
    ADD CONSTRAINT members_gr_id FOREIGN KEY ("group")
    REFERENCES public."Groups" (gr_id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE CASCADE;

ALTER TABLE IF EXISTS public."Ratings"
    ADD CONSTRAINT ratings_ac_id FOREIGN KEY (ac_id)
    REFERENCES public."Accounts" (ac_id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE CASCADE;

ALTER TABLE public."Shared"
    ADD CONSTRAINT shared_ac_id FOREIGN KEY (ac_id)
    REFERENCES public."Accounts" (ac_id)
    ON UPDATE NO ACTION
    ON DELETE CASCADE;

ALTER TABLE public."Shared"
    ADD CONSTRAINT shared_gr_id FOREIGN KEY (gr_id)
    REFERENCES public."Groups" (gr_id)
    ON UPDATE NO ACTION
    ON DELETE CASCADE;

END;