-- Create Table item
CREATE IF NOT EXISTS TABLE item (
    id NUMERIC PRIMARY KEY,
    task VARCHAR(250) NOT NULL,
    priority NUMERIC NOT NULL,
    date TIMESTAMP DEFAULT NOW()
);

-- Insert initial set of items
INSERT INTO item (id, task, priority, date)
VALUES (1, 'Prepare Coffee', 1, '2021-05-01'),
    (2, 'Boil Eggs', 2, '2021-05-01'),
    (3, 'Buy Milk', 3, '2021-05-01'),
    ON CONFLICT DO NOTHING;

-- Create Table user
CREATE TABLE "user" (
    id NUMERIC PRIMARY KEY,
    first_name VARCHAR(250) NOT NULL,
    last_name NUMERIC NOT NULL
);

-- Insert initial set of users
INSERT INTO 'user' (id, first_name, last_name)
VALUES (1, 'John', 'Doe'),
    (2, 'Brad', 'Gabson'),
    (3, 'Allen', 'Ray'),
    ON CONFLICT DO NOTHING;