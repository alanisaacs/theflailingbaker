-- Initialize tfb database; assumes db has already been created

CREATE TABLE tools (
	id SERIAL PRIMARY KEY,
	name TEXT,
	description TEXT,
	notes TEXT
);

INSERT INTO tools (name) VALUES ('');

CREATE TABLE procedure (
	step_id SERIAL PRIMARY KEY,
	step INTEGER,
	name TEXT,
	description TEXT,
	notes TEXT
);

INSERT INTO procedure (name) VALUES ('');

CREATE TABLE substeps (
	substep_id SERIAL PRIMARY KEY,
	step_id INTEGER,
	substep INTEGER,
	description TEXT,
	CONSTRAINT fk_step_id 
		FOREIGN KEY(step_id)
			REFERENCES procedure(step_id)
);

INSERT INTO substeps (substep) VALUES (1);

CREATE TABLE variables (
	variable_id SERIAL PRIMARY KEY,
	step_id INTEGER,
	name TEXT,
	description TEXT,
	notes TEXT,
	CONSTRAINT fk_step_id 
		FOREIGN KEY(step_id)
			REFERENCES procedure(step_id)
);

INSERT INTO variables (name) VALUES ('');

CREATE TABLE metrics (
	metric_id SERIAL PRIMARY KEY,
	step_id INTEGER,
	name TEXT,
	description TEXT,
	notes TEXT,
	CONSTRAINT fk_step_id 
		FOREIGN KEY(step_id)
			REFERENCES procedure(step_id)
);

INSERT INTO metrics (name) VALUES ('');

CREATE TABLE users (
	id SERIAL PRIMARY KEY,
	username VARCHAR(64),
	password VARCHAR(1024)
);