BEGIN;

-- Drop all tables if they exist
DROP TABLE IF EXISTS public."Ratings" CASCADE;
DROP TABLE IF EXISTS public."Members" CASCADE;
DROP TABLE IF EXISTS public."Groups" CASCADE;
DROP TABLE IF EXISTS public."Favorites" CASCADE;
DROP TABLE IF EXISTS public."Accounts" CASCADE;

-- Recreate tables
BEGIN;


CREATE TABLE IF NOT EXISTS public."Accounts"
(
    ac_id integer NOT NULL,
    email character varying(255) COLLATE pg_catalog."default" NOT NULL,
    password character varying(255) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT "Accounts_pkey" PRIMARY KEY (ac_id)
);

CREATE TABLE IF NOT EXISTS public."Favorites"
(
    fa_id integer NOT NULL,
    ac_id integer NOT NULL,
    movie character varying COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT "Favorites_pkey" PRIMARY KEY (fa_id)
);

CREATE TABLE IF NOT EXISTS public."Groups"
(
    gr_id integer NOT NULL,
    owner integer NOT NULL,
    name character varying COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT "Groups_pkey" PRIMARY KEY (gr_id)
);

CREATE TABLE IF NOT EXISTS public."Members"
(
    me_id integer NOT NULL,
    "group" integer NOT NULL,
    member integer NOT NULL,
    CONSTRAINT "Members_pkey" PRIMARY KEY (me_id)
);

CREATE TABLE IF NOT EXISTS public."Ratings"
(
    ra_id integer NOT NULL,
    movie character varying COLLATE pg_catalog."default" NOT NULL,
    stars smallint NOT NULL DEFAULT 0,
    text character varying COLLATE pg_catalog."default",
    "time" timestamp with time zone NOT NULL,
    ac_id integer NOT NULL,
    CONSTRAINT "Ratings_pkey" PRIMARY KEY (ra_id)
);

ALTER TABLE IF EXISTS public."Favorites"
    ADD CONSTRAINT ac_id FOREIGN KEY (ac_id)
    REFERENCES public."Accounts" (ac_id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;


ALTER TABLE IF EXISTS public."Groups"
    ADD CONSTRAINT ac_id FOREIGN KEY (owner)
    REFERENCES public."Accounts" (ac_id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;


ALTER TABLE IF EXISTS public."Members"
    ADD CONSTRAINT ac_id FOREIGN KEY (member)
    REFERENCES public."Accounts" (ac_id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;


ALTER TABLE IF EXISTS public."Members"
    ADD CONSTRAINT gr_id FOREIGN KEY ("group")
    REFERENCES public."Groups" (gr_id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;


ALTER TABLE IF EXISTS public."Ratings"
    ADD CONSTRAINT ac_id FOREIGN KEY (ac_id)
    REFERENCES public."Accounts" (ac_id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;

END;

-- Insert test data
INSERT INTO public."Accounts" (ac_id, email, password) VALUES
(1, 'john.doe@example.com', 'password123'),
(2, 'jane.smith@example.com', 'password456');

INSERT INTO public."Favorites" (fa_id, ac_id, movie) VALUES
(1, 1, 'Inception'),
(2, 2, 'The Matrix');

INSERT INTO public."Groups" (gr_id, owner, name) VALUES
(1, 1, 'Film Critics'),
(2, 2, 'Sci-Fi Fans');

INSERT INTO public."Members" (me_id, "group", member) VALUES
(1, 1, 1),
(2, 1, 2),
(3, 2, 2);

INSERT INTO public."Ratings" (ra_id, movie, stars, text, "time", ac_id) VALUES
(1, 'Inception', 5, 'Amazing movie!', '2024-11-14 21:39:00+02', 1),
(2, 'The Matrix', 4, 'Very good.', '2024-11-14 21:40:00+02', 2);

END;