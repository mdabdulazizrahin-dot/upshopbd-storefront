
-- Add unique constraint on session_id to prevent duplicates
ALTER TABLE abandoned_checkouts ADD CONSTRAINT abandoned_checkouts_session_id_unique UNIQUE (session_id);
