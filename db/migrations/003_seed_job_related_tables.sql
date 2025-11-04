-- Seed job_levels
INSERT INTO job_levels (name) VALUES
  ('entry level'),
  ('mid level'),
  ('senior level'),
  ('director'),
  ('VP or above');

-- Seed required_skills
INSERT INTO required_skills (name) VALUES
  ('Reactjs'),
  ('Nextjs'),
  ('Nodejs'),
  ('Javascript'),
  ('Typescript'),
  ('HTML'),
  ('CSS'),
  ('Vuejs'),
  ('Angular'),
  ('Python'),
  ('Java'),
  ('C#'),
  ('C++'),
  ('Go'),
  ('SQL'),
  ('MongoDB'),
  ('PostgreSQL'),
  ('MySQL'),
  ('Docker'),
  ('Kubernetes'),
  ('AWS'),
  ('Azure'),
  ('GCP'),
  ('Redis'),
  ('GraphQL'),
  ('REST API'),
  ('CI/CD'),
  ('Jest'),
  ('Testing Library'),
  ('SASS'),
  ('LESS'),
  ('Webpack'),
  ('Babel');

-- Seed employment_types
INSERT INTO employment_types (name) VALUES
  ('full-time'),
  ('part-time'),
  ('remote'),
  ('internship'),
  ('hybrid'),
  ('contract');

-- Seed categories
INSERT INTO categories (name) VALUES
  ('design'),
  ('sales'),
  ('marketing'),
  ('business'),
  ('human resource'),
  ('finance'),
  ('engineering'),
  ('technology');