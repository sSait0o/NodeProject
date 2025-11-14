--
-- PostgreSQL database dump
--

\restrict tZkLjd0aU7eDWI1D38xt2ECUgcci3T0A9TgTDoG2LxmpUh8vdrJvQ4jnLh1eyKK

-- Dumped from database version 16.4
-- Dumped by pg_dump version 16.11 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: depots; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.depots (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    nom text NOT NULL,
    adresse text NOT NULL
);


ALTER TABLE public.depots OWNER TO postgres;

--
-- Name: mouvements; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.mouvements (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    type text NOT NULL,
    quantite integer NOT NULL,
    produit_id uuid NOT NULL,
    date timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT mouvements_quantite_check CHECK ((quantite > 0)),
    CONSTRAINT mouvements_type_check CHECK ((type = ANY (ARRAY['IN'::text, 'OUT'::text])))
);


ALTER TABLE public.mouvements OWNER TO postgres;

--
-- Name: produits; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.produits (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    nom text NOT NULL,
    code text NOT NULL,
    quantite integer DEFAULT 0 NOT NULL,
    depot_id uuid NOT NULL,
    CONSTRAINT produits_quantite_check CHECK ((quantite >= 0))
);


ALTER TABLE public.produits OWNER TO postgres;

--
-- Data for Name: depots; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.depots (id, nom, adresse) FROM stdin;
dada4382-2b81-4f6a-b3b7-792f2fbcafc6	Dépôt Nord	1 rue du Nord
\.


--
-- Data for Name: mouvements; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.mouvements (id, type, quantite, produit_id, date) FROM stdin;
76de13fd-bf3f-4df4-9207-3d347fdd11ed	IN	10	9d4a5486-1ae6-46ca-a728-5283b6e7f371	2025-11-14 10:11:41.217522+01
e506d29b-162d-42fb-8781-8195a99f63d7	OUT	5	9d4a5486-1ae6-46ca-a728-5283b6e7f371	2025-11-14 10:12:15.499656+01
\.


--
-- Data for Name: produits; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.produits (id, nom, code, quantite, depot_id) FROM stdin;
9d4a5486-1ae6-46ca-a728-5283b6e7f371	Paracétamol 500mg	PARA500	155	dada4382-2b81-4f6a-b3b7-792f2fbcafc6
\.


--
-- Name: depots depots_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.depots
    ADD CONSTRAINT depots_pkey PRIMARY KEY (id);


--
-- Name: mouvements mouvements_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mouvements
    ADD CONSTRAINT mouvements_pkey PRIMARY KEY (id);


--
-- Name: produits produits_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.produits
    ADD CONSTRAINT produits_code_key UNIQUE (code);


--
-- Name: produits produits_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.produits
    ADD CONSTRAINT produits_pkey PRIMARY KEY (id);


--
-- Name: mouvements mouvements_produit_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mouvements
    ADD CONSTRAINT mouvements_produit_id_fkey FOREIGN KEY (produit_id) REFERENCES public.produits(id) ON DELETE CASCADE;


--
-- Name: produits produits_depot_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.produits
    ADD CONSTRAINT produits_depot_id_fkey FOREIGN KEY (depot_id) REFERENCES public.depots(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict tZkLjd0aU7eDWI1D38xt2ECUgcci3T0A9TgTDoG2LxmpUh8vdrJvQ4jnLh1eyKK

