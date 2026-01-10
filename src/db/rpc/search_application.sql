drop function if exists public.search_application(
  integer[], integer, applicationstatus[], integer, integer, text, text, integer, integer
);

create or replace function public.search_application(
  q_ids        integer[] default null,
  q_user_id    integer default null,
  q_statuses   applicationstatus[] default null,
  q_company_id integer default null,
  q_job_id     integer default null,
  q_sort_by    text default 'created_at',
  q_sort_dir   text default 'desc',
  q_page       integer default 1,
  q_limit      integer default 10
)
returns table (
  id bigint,
  user_id bigint,
  full_name text,
  email text,
  phone text,
  previous_job text,
  linkedin_url text,
  portfolio_url text,
  additional_information text,
  resume_url text,
  status applicationstatus,
  submitted_at timestamptz,
  reviewed_at timestamptz,
  feedback text,
  created_at timestamptz,
  updated_at timestamptz,
  total bigint,
  job jsonb,
  company jsonb
)
language sql
security definer
stable
as $$
  select
    a.id,
    a.user_id,
    a.full_name,
    a.email,
    a.phone,
    a.previous_job,
    a.linkedin_url,
    a.portfolio_url,
    a.additional_information,
    a.resume_url,
    a.status,
    a.submitted_at,
    a.reviewed_at,
    a.feedback,
    a.created_at,
    a.updated_at,
    count(*) over() as total,

    -- full job object
    jsonb_build_object(
      'id', j.id,
      'external_id', j.external_id,
      'website_url', j.website_url,
      'company_id', j.company_id,
      'title', j.title,
      'working_time', j.working_time,
      'salary_from', j.salary_from,
      'salary_to', j.salary_to,
      'salary_text', j.salary_text,
      'salary_currency', j.salary_currency,
      'job_posted_at', j.job_posted_at,
      'job_deadline', j.job_deadline,
      'apply_reasons', j.apply_reasons,
      'status', j.status,
      'quantity', j.quantity,
      'created_at', j.created_at,
      'updated_at', j.updated_at,
      'company_branches', (
        select jsonb_agg(
          jsonb_build_object(
            'id', cb.id,
            'name', cb.name,
            'company_id', cb.company_id,
            'address', cb.address,
            'ward', case
              when w.id is null then null
              else jsonb_build_object(
                'id', w.id,
                'name', w.name
              )
            end,
            'province', case
              when p.id is null then null
              else jsonb_build_object(
                'id', p.id,
                'name', p.name
              )
            end,
            'country', case
              when ct.id is null then null
              else jsonb_build_object(
                'id', ct.id,
                'name', ct.name
              )
            end
          )
        )
        from job_company_branches jcb
        join company_branches cb on cb.id = jcb.company_branch_id
        left join wards w on w.id = cb.ward_id
        left join provinces p on p.id = cb.province_id
        left join countries ct on ct.id = cb.country_id
        where jcb.job_id = j.id
      ),
      'levels', (
        select jsonb_agg(
          jsonb_build_object(
            'id', l.id,
            'name', l.name
          )
        )
        from job_levels jl
        join levels l on l.id = jl.level_id
        where jl.job_id = j.id
      ),
      'categories', (
        select jsonb_agg(
          jsonb_build_object(
            'id', cat.id,
            'name', cat.name
          )
        )
        from job_categories jc
        join categories cat on cat.id = jc.category_id
        where jc.job_id = j.id
      ),
      'skills', (
        select jsonb_agg(
          jsonb_build_object(
            'id', skill.id,
            'name', skill.name
          )
        )
        from job_skills js
        join skills skill on skill.id = js.skill_id
        where js.job_id = j.id
      )
    ) as job,

    -- company object
    jsonb_build_object(
      'id', c.id,
      'name', c.name,
      'logo', c.logo,
      'created_at', c.created_at,
      'updated_at', c.updated_at
    ) as company
  from public.applications a
  join public.jobs j on j.id = a.job_id
  join public.companies c on c.id = a.company_id
  where
    (q_ids        is null or a.id = any(q_ids))
    and (q_user_id    is null or a.user_id = q_user_id)
    and (q_statuses   is null or a.status = any(q_statuses))
    and (q_company_id is null or a.company_id = q_company_id)
    and (q_job_id     is null or a.job_id = q_job_id)
  order by
    case when q_sort_by = 'id'            and q_sort_dir = 'asc'  then j.id end asc,
    case when q_sort_by = 'id'            and q_sort_dir = 'desc' then j.id end desc,

    case when q_sort_by = 'created_at'    and q_sort_dir = 'asc'  then j.created_at end asc,
    case when q_sort_by = 'created_at'    and q_sort_dir = 'desc' then j.created_at end desc,

    a.id desc
  limit q_limit
  offset (q_page - 1) * q_limit;
$$;


select * from public.search_application(
  null,
  null,
  array['Applied', 'Offered']::applicationstatus[],
  null,
  null
);