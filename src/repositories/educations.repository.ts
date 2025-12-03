import { supabase } from "@/config/supabase";
import { Education, EducationInsert, EducationUpdate } from "@/types/common";

export const EducationRepository = {
    async findOne(id: number): Promise<Education | null> {
        const { data, error } = await supabase.from("educations").select("*").eq("id", id).single();
        if (error) {
            if (error.code === "PGRST116") return null;
            throw error;
        }
        return data as Education;
    },

    async insert(payload: EducationInsert): Promise<Education> {
        const { data, error } = await supabase.from("educations").insert(payload).select().single();
        if (error) throw error;
        return data as Education;
    },

    async update(id: number, payload: EducationUpdate): Promise<Education> {
        const { data, error } = await supabase.from("educations").update(payload).eq("id", id).select().single();
        if (error) throw error;
        return data as Education;
    },

    async remove(id: number): Promise<void> {
        const { error } = await supabase.from("educations").delete().eq("id", id);
        if (error) throw error;
        return;
    },
};