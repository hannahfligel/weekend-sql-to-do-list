CREATE TABLE todo (
	id SERIAL PRIMARY KEY,
	task VARCHAR NOT NULL,
	category VARCHAR NOT NULL,
	due_date VARCHAR NOT NULL,
	status VARCHAR DEFAULT 'not started'
	);