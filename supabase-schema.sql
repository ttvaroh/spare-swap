-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.listings (
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  title text,
  description text,
  image text,
  tags ARRAY,
  owner text,
  status text DEFAULT 'Available'::text,
  owner_id uuid,
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  location text,
  CONSTRAINT listings_pkey PRIMARY KEY (id),
  CONSTRAINT listings_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES auth.users(id)
);
CREATE TABLE public.messages (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  sender_id uuid,
  message text,
  request_id uuid DEFAULT gen_random_uuid(),
  CONSTRAINT messages_pkey PRIMARY KEY (id),
  CONSTRAINT messages_request_id_fkey FOREIGN KEY (request_id) REFERENCES public.requests(id),
  CONSTRAINT messages_sender_id_fkey FOREIGN KEY (sender_id) REFERENCES auth.users(id)
);
CREATE TABLE public.requests (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  listing_id uuid NOT NULL,
  requester_id uuid,
  status text DEFAULT 'pending'::text,
  CONSTRAINT requests_pkey PRIMARY KEY (id),
  CONSTRAINT requests_listing_id_fkey FOREIGN KEY (listing_id) REFERENCES public.listings(id),
  CONSTRAINT requests_requester_id_fkey FOREIGN KEY (requester_id) REFERENCES auth.users(id)
);