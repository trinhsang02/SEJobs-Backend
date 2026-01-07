drop function if exists public.get_application(
  integer, integer, integer, integer
);

create or replace function public.get_application(
  q_id         integer default null,
  q_user_id    integer default null,
  q_company_id integer default null,
  q_job_id     integer default null
)
returns setof jsonb
language sql
stable
as $$
  select jsonb_build_object(
    'id', a.id,
    'user_id', a.user_id,
    'full_name', a.full_name,
    'email', a.email,
    'phone', a.phone,
    'previous_job', a.previous_job,
    'linkedin_url', a.linkedin_url,
    'portfolio_url', a.portfolio_url,
    'additional_information', a.additional_information,
    'resume_url', a.resume_url,
    'status', a.status,
    'submitted_at', a.submitted_at,
    'reviewed_at', a.reviewed_at,
    'feedback', a.feedback,
    'created_at', a.created_at,
    'updated_at', a.updated_at,

    -- job object
    'job', jsonb_build_object(
      'id', j.id,
      'title', j.title,
      'company_id', j.company_id,
      'created_at', j.created_at,
      'updated_at', j.updated_at
    ),

    -- company object
    'company', jsonb_build_object(
      'id', c.id,
      'name', c.name,
      'created_at', c.created_at,
      'updated_at', c.updated_at
    )
  )
  from public.applications a
  join public.jobs j on j.id = a.job_id
  join public.companies c on c.id = a.company_id
  where
    (q_id is null or a.id = q_id)
    and (q_user_id is null or a.user_id = q_user_id)
    and (q_company_id is null or a.company_id = q_company_id)
    and (q_job_id is null or a.job_id = q_job_id)
  order by a.submitted_at desc;
$$;
