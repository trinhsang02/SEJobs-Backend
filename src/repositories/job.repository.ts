import { supabase } from "@/config/supabase";
import { NotFoundError } from "@/utils/errors";
import _ from "lodash";
import { CreateJobDto } from "@/dtos/job/CreateJob.dto";
import { UpdateJobDto } from "@/dtos/job/UpdateJob.dto";
import { QueryJobsDto } from "@/dtos/job/QueryJobs.dto";

/**
 * JobRepository
 *
 * - Uses normalized tables: jobs, companies, locations, job_locations, categories, experiences
 * - Provides paginated listing with simple filters (keyword, city, category_id, experience_id)
 * - Create/update/delete operations will handle company upsert and location linking.
 *
 * Note: This is written to work with Supabase/PostgREST. Some complex operations are
 * implemented as multiple sequential queries because Supabase JS client doesn't expose
 * multi-statement transactions easily in this setup.
 */

export class JobRepository {
  private db = supabase;
  public readonly jobFields = `id, external_id, url, title, category_id, experience_id, salary_from, salary_to, salary_text, salary_currency, deadline, publish, updated_at, created_at`;

  /**
   * Find jobs with pagination and filters.
   * query: { page, per_page, keyword, city_id, category_id, exp_id }
   *
   * Returns { data: any[], pagination: { page, limit, total, total_pages } }
   */
  async findAll(query: QueryJobsDto) {
    const page = _.toInteger(_.get(query, "page", 1)) || 1;
    const perPage = _.toInteger(_.get(query, "per_page", 20)) || 20;
    const keyword = _.get(query, "keyword");
    const cityId = _.get(query, "city_id"); // not used directly; kept for compatibility
    const categoryId = _.get(query, "category_id");
    const expId = _.get(query, "exp_id");

    const from = (page - 1) * perPage;
    const to = from + perPage - 1;

    // Build base select that returns job + company + locations array
    // Using foreign table selects: company and job_locations -> locations(full_name)
    const select = `${this.jobFields}, companies(name,logo,url), job_locations!inner(locations(full_name))`;

    let dbQuery = this.db.from("jobs").select(select, { count: "exact" });

    if (keyword) {
      // search title and company name
      // ilike on title
      dbQuery = dbQuery.or(`title.ilike.%${keyword}%,companies.name.ilike.%${keyword}%`);
    }

    if (categoryId) {
      dbQuery = dbQuery.eq("category_id", categoryId);
    }

    if (expId) {
      dbQuery = dbQuery.eq("experience_id", expId);
    }

    // city filter: the locations selection returns multiple rows per job because of join,
    // so we filter jobs by existence of location.full_name ilike city fragment.
    // We can use related table filter syntax: job_locations.locations.full_name=ilike.*
    if (cityId) {
      // If caller provides a city name or id, attempt to match by full_name contenst.
      // Accept both numeric id or string. If numeric, filter by locations.id
      if (_.isInteger(_.toNumber(cityId)) && _.toString(cityId) === _.toString(_.toNumber(cityId))) {
        dbQuery = dbQuery.eq("job_locations.location_id", cityId);
      } else {
        dbQuery = dbQuery.ilike("job_locations.locations.full_name", `%${cityId}%`);
      }
    }

    const { data, error, count } = await dbQuery.range(from, to);

    if (error) throw error;

    // Post-process to aggregate locations per job into array (because join returns one row per location)
    const normalized = this.aggregateLocations(data || []);

    return {
      data: normalized,
      pagination: {
        page,
        limit: perPage,
        total: count || 0,
        total_pages: count ? Math.ceil(count / perPage) : 0,
      },
    };
  }

  /**
   * Aggregate locations returned by supabase join into a single job record with locations array
   */
  private aggregateLocations(rows: any[]) {
    if (!rows || rows.length === 0) return [];

    const map = new Map<number, any>();

    for (const row of rows) {
      const jobId = row.id;
      const company = row.companies
        ? { name: row.companies.name, logo: row.companies.logo, url: row.companies.url }
        : null;

      const locationObj = _.get(row, "job_locations.locations");
      const locationName = locationObj ? locationObj.full_name : null;

      if (!map.has(jobId)) {
        const base = {
          id: row.id,
          external_id: row.external_id,
          url: row.url,
          title: row.title,
          company,
          salary: {
            from: row.salary_from,
            to: row.salary_to,
            text: row.salary_text,
            currency: row.salary_currency,
          },
          category_id: row.category_id,
          experience_id: row.experience_id,
          deadline: row.deadline,
          updated_at: row.updated_at,
          publish: row.publish,
          created_at: row.created_at,
          locations: locationName ? [locationName] : [],
        };
        map.set(jobId, base);
      } else {
        const existing = map.get(jobId);
        if (locationName && !existing.locations.includes(locationName)) {
          existing.locations.push(locationName);
        }
      }
    }

    return Array.from(map.values());
  }

  /**
   * Find one job by id
   */
  async findOne(jobId: number) {
    if (!jobId) throw new Error("jobId is required");

    const select = `${this.jobFields}, companies(name,logo,url), job_locations!inner(locations(full_name))`;
    const { data, error } = await this.db.from("jobs").select(select).eq("id", jobId);

    if (error) throw error;

    const rows = data || [];
    if (rows.length === 0) return null;

    // aggregate locations
    const [job] = this.aggregateLocations(rows);
    return job;
  }

  /**
   * Create a job.
   * - company: if provided, upsert company (by external_id or name)
   * - locations: array of full_name strings; create or reuse locations and link via job_locations
   */
  async create(input: CreateJobDto) {
    const {
      external_id,
      url,
      title,
      company,
      company_id,
      category_id,
      experience_id,
      salary_from,
      salary_to,
      salary_text,
      salary_currency,
      locations,
      deadline,
      publish,
      updated_at,
    } = input;

    let usedCompanyId = company_id || null;

    // Upsert company if company payload provided
    if (company) {
      const whereClause = company.external_id ? { external_id: company.external_id } : { name: company.name };
      // try to find existing (typed result to satisfy TS)
      const findCompanyRes = (await this.db.from("companies").select("id").match(whereClause).limit(1)) as {
        data: Array<{ id: number }> | null;
        error: any;
      };
      if (findCompanyRes.error) throw findCompanyRes.error;

      const existingCompanies = findCompanyRes.data || [];

      if (existingCompanies.length > 0) {
        const firstCompany = existingCompanies[0];
        if (!firstCompany) throw new Error("Failed to read existing company");
        usedCompanyId = firstCompany.id;
        // optional update
        await this.db
          .from("companies")
          .update({
            logo: company.logo || null,
            url: company.url || null,
          })
          .eq("id", usedCompanyId);
      } else {
        const newCompanyRes = (await this.db
          .from("companies")
          .insert([
            {
              external_id: company.external_id || null,
              name: company.name,
              logo: company.logo || null,
              url: company.url || null,
            },
          ])
          .select("id")
          .single()) as { data: { id: number } | null; error: any };

        if (newCompanyRes.error) throw newCompanyRes.error;
        if (!newCompanyRes.data) throw new Error("Failed to create company");
        usedCompanyId = newCompanyRes.data.id;
      }
    }

    // Insert job
    const { data: createdJob, error: jobErr } = await this.db
      .from("jobs")
      .insert([
        {
          external_id: external_id || null,
          url: url || null,
          title,
          company_id: usedCompanyId,
          category_id: category_id || null,
          experience_id: experience_id || null,
          salary_from: salary_from || null,
          salary_to: salary_to || null,
          salary_text: salary_text || null,
          salary_currency: salary_currency || null,
          deadline: deadline || null,
          publish: publish || null,
          updated_at: updated_at || new Date().toISOString(),
        },
      ])
      .select("id")
      .single();

    if (jobErr) throw jobErr;

    const jobId = createdJob.id;

    // Handle locations linking
    if (Array.isArray(locations) && locations.length > 0) {
      for (const fullName of locations) {
        // find or insert location (typed results and explicit string param)
        const findLocRes = (await this.db.from("locations").select("id").eq("full_name", fullName).limit(1)) as {
          data: Array<{ id: number }> | null;
          error: any;
        };
        if (findLocRes.error) throw findLocRes.error;

        let locationId: number;
        const found = findLocRes.data || [];
        if (found.length > 0) {
          const firstLoc = found[0];
          if (!firstLoc) throw new Error("Failed to read existing location");
          locationId = firstLoc.id;
        } else {
          const [cityPart, districtPart] = (fullName || "").split(":").map((s: string) => s.trim());
          const newLocRes = (await this.db
            .from("locations")
            .insert([
              {
                city: cityPart || null,
                district: districtPart || null,
                full_name: fullName,
              },
            ])
            .select("id")
            .single()) as { data: { id: number } | null; error: any };
          if (newLocRes.error) throw newLocRes.error;
          if (!newLocRes.data) throw new Error("Failed to create location");
          locationId = newLocRes.data.id;
        }

        // insert into job_locations (ignore conflict)
        const { error: jlErr } = await this.db.from("job_locations").insert([
          {
            job_id: jobId,
            location_id: locationId,
          },
        ]);
        if (jlErr) {
          // If unique constraint fails, continue
          if (!jlErr.message.includes("duplicate key value")) throw jlErr;
        }
      }
    }

    return this.findOne(jobId);
  }

  /**
   * Update a job.
   * If company payload provided, upsert company similarly to create.
   * For locations, caller can provide full list (we'll replace links).
   */
  async update(jobId: number, input: UpdateJobDto) {
    if (!jobId) throw new Error("jobId is required");

    const existing = await this.db.from("jobs").select("id, updated_at").eq("id", jobId).maybeSingle();
    if (existing.error) throw existing.error;
    if (!existing.data) throw new NotFoundError({ message: `Job with ID ${jobId} not found` });

    // Optional optimistic concurrency check
    if (input.updated_at && input.updated_at !== existing.data.updated_at) {
      throw new Error("Record was modified by another user. Please refresh and try again.");
    }

    let usedCompanyId = input.company_id || null;

    if (input.company) {
      const company = input.company;
      const whereClause = company.external_id ? { external_id: company.external_id } : { name: company.name };
      const findCompanyRes = (await this.db.from("companies").select("id").match(whereClause).limit(1)) as {
        data: Array<{ id: number }> | null;
        error: any;
      };
      if (findCompanyRes.error) throw findCompanyRes.error;

      const existingCompanies = findCompanyRes.data || [];

      if (existingCompanies.length > 0) {
        const firstCompany = existingCompanies[0];
        if (!firstCompany) throw new Error("Failed to read existing company");
        usedCompanyId = firstCompany.id;
        await this.db
          .from("companies")
          .update({
            logo: company.logo || null,
            url: company.url || null,
            name: company.name,
            external_id: company.external_id || null,
          })
          .eq("id", usedCompanyId);
      } else {
        const newCompanyRes = (await this.db
          .from("companies")
          .insert([
            {
              external_id: company.external_id || null,
              name: company.name,
              logo: company.logo || null,
              url: company.url || null,
            },
          ])
          .select("id")
          .single()) as { data: { id: number } | null; error: any };
        if (newCompanyRes.error) throw newCompanyRes.error;
        if (!newCompanyRes.data) throw new Error("Failed to create company");
        usedCompanyId = newCompanyRes.data.id;
      }
    }

    const updatePayload: Record<string, any> = _.pickBy(
      {
        external_id: _.get(input, "external_id"),
        url: _.get(input, "url"),
        title: _.get(input, "title"),
        company_id: usedCompanyId,
        category_id: _.get(input, "category_id"),
        experience_id: _.get(input, "experience_id"),
        salary_from: _.get(input, "salary_from"),
        salary_to: _.get(input, "salary_to"),
        salary_text: _.get(input, "salary_text"),
        salary_currency: _.get(input, "salary_currency"),
        deadline: _.get(input, "deadline"),
        publish: _.get(input, "publish"),
        updated_at: new Date().toISOString(),
      },
      (v) => v !== undefined
    );

    const { data: updatedRows, error: updateErr } = await this.db
      .from("jobs")
      .update(updatePayload)
      .eq("id", jobId)
      .select("id");
    if (updateErr) throw updateErr;

    // Handle locations: if provided, replace links
    if (Array.isArray(input.locations)) {
      // delete existing links
      const { error: delErr } = await this.db.from("job_locations").delete().eq("job_id", jobId);
      if (delErr) throw delErr;

      for (const fullName of input.locations) {
        // find or create location (typed responses)
        const findLocRes = (await this.db.from("locations").select("id").eq("full_name", fullName).limit(1)) as {
          data: Array<{ id: number }> | null;
          error: any;
        };
        if (findLocRes.error) throw findLocRes.error;

        let locationId: number;
        const found = findLocRes.data || [];
        if (found.length > 0) {
          const firstLoc = found[0];
          if (!firstLoc) throw new Error("Failed to read existing location");
          locationId = firstLoc.id;
        } else {
          const [cityPart, districtPart] = (fullName || "").split(":").map((s: string) => s.trim());
          const newLocRes = (await this.db
            .from("locations")
            .insert([
              {
                city: cityPart || null,
                district: districtPart || null,
                full_name: fullName,
              },
            ])
            .select("id")
            .single()) as { data: { id: number } | null; error: any };
          if (newLocRes.error) throw newLocRes.error;
          if (!newLocRes.data) throw new Error("Failed to create location");
          locationId = newLocRes.data.id;
        }

        const { error: jlErr } = await this.db.from("job_locations").insert([
          {
            job_id: jobId,
            location_id: locationId,
          },
        ]);
        if (jlErr) {
          if (!jlErr.message.includes("duplicate key value")) throw jlErr;
        }
      }
    }

    return this.findOne(jobId);
  }

  /**
   * Delete job (cascades to job_locations due to FK)
   */
  async delete(jobId: number) {
    const { data, error } = await this.db.from("jobs").delete().eq("id", jobId).select(this.jobFields).maybeSingle();
    if (error) throw error;
    return data;
  }
}

export default new JobRepository();
