import { jaccardSimilarity, cosineSimilarity, overlapCoefficient } from "@/utils/similarity-metrics";

export interface FeatureVector {
    // Categorical features (arrays of IDs)
    categories: number[];
    skills: number[] | string[]; // Support both for flexibility
    levels: number[];
    employment_types: number[];

    // Text features (TF-IDF)
    textVector: number[];

    // Numerical features (normalized 0-1)
    salary: number;
    location: number[];

    // Weights cho từng feature group
    weights: {
        categories: number;
        skills: number;
        levels: number;
        employment_types: number;
        text: number;
        salary: number;
        location: number;
    };
}

export class SimilarityService {
    /**
     * Tính toán weighted similarity giữa 2 feature vectors
     * Kết hợp nhiều loại similarity metrics với weights khác nhau
     */
    calculateSimilarity(vector1: FeatureVector, vector2: FeatureVector): number {
        let totalScore = 0;

        // 1. Categorical features - Jaccard Similarity
        totalScore += this.jaccardSimilarity(vector1.categories, vector2.categories) * vector1.weights.categories;

        // Skills: Handle both string[] and number[]
        totalScore += this.skillsSimilarity(vector1.skills, vector2.skills) * vector1.weights.skills;

        totalScore += this.jaccardSimilarity(vector1.levels, vector2.levels) * vector1.weights.levels;

        totalScore +=
            this.jaccardSimilarity(vector1.employment_types, vector2.employment_types) *
            vector1.weights.employment_types;

        // 2. Text features - Cosine Similarity
        totalScore += this.cosineSimilarity(vector1.textVector, vector2.textVector) * vector1.weights.text;

        // 3. Location - Jaccard or exact match
        totalScore += this.jaccardSimilarity(vector1.location, vector2.location) * vector1.weights.location;

        // 4. Salary - Inverse distance
        totalScore += this.salarySimilarity(vector1.salary, vector2.salary) * vector1.weights.salary;

        return totalScore;
    }

    /**
     * Skills similarity - handle both string[] and number[]
     */
    private skillsSimilarity(skills1: number[] | string[], skills2: number[] | string[]): number {
        // If both are strings, compare as strings
        if (typeof skills1[0] === 'string' || typeof skills2[0] === 'string') {
            return this.jaccardSimilarityGeneric(skills1 as any[], skills2 as any[]);
        }
        // Otherwise use number comparison
        return this.jaccardSimilarity(skills1 as number[], skills2 as number[]);
    }

    /**
     * Generic Jaccard Similarity for any comparable type
     */
    private jaccardSimilarityGeneric<T>(arr1: T[], arr2: T[]): number {
        if (arr1.length === 0 && arr2.length === 0) return 1;
        if (arr1.length === 0 || arr2.length === 0) return 0;

        const set1 = new Set(arr1);
        const set2 = new Set(arr2);

        const intersection = new Set([...set1].filter((x) => set2.has(x)));
        const union = new Set([...set1, ...set2]);

        return intersection.size / union.size;
    }

    /**
     * Jaccard Similarity: |A ∩ B| / |A ∪ B|
     */
    private jaccardSimilarity(arr1: number[], arr2: number[]): number {
        if (arr1.length === 0 && arr2.length === 0) return 1;
        if (arr1.length === 0 || arr2.length === 0) return 0;

        const set1 = new Set(arr1);
        const set2 = new Set(arr2);

        const intersection = new Set([...set1].filter((x) => set2.has(x)));
        const union = new Set([...set1, ...set2]);

        return intersection.size / union.size;
    }

    /**
     * Cosine Similarity: (A · B) / (||A|| * ||B||)
     */
    private cosineSimilarity(vec1: number[], vec2: number[]): number {
        if (vec1.length === 0 || vec2.length === 0) return 0;

        // Đảm bảo cùng length
        const maxLen = Math.max(vec1.length, vec2.length);
        const v1 = [...vec1, ...Array(maxLen - vec1.length).fill(0)];
        const v2 = [...vec2, ...Array(maxLen - vec2.length).fill(0)];

        const dotProduct = v1.reduce((sum, val, i) => sum + val * v2[i], 0);
        const magnitude1 = Math.sqrt(v1.reduce((sum, val) => sum + val * val, 0));
        const magnitude2 = Math.sqrt(v2.reduce((sum, val) => sum + val * val, 0));

        if (magnitude1 === 0 || magnitude2 === 0) return 0;

        return dotProduct / (magnitude1 * magnitude2);
    }

    /**
     * Salary similarity - inverse of normalized distance
     */
    private salarySimilarity(salary1: number, salary2: number): number {
        if (salary1 === 0 && salary2 === 0) return 1;
        if (salary1 === 0 || salary2 === 0) return 0.5;

        const distance = Math.abs(salary1 - salary2);
        return Math.max(0, 1 - distance); // Vì đã normalize về 0-1
    }

    /**
     * Tính weighted similarity với custom weights
     */
    calculateWeightedSimilarity(
        vector1: FeatureVector,
        vector2: FeatureVector,
        customWeights?: Partial<FeatureVector["weights"]>
    ): number {
        const weights = { ...vector1.weights, ...customWeights };

        let totalScore = 0;

        totalScore += this.jaccardSimilarity(vector1.categories, vector2.categories) * weights.categories;
        totalScore += this.skillsSimilarity(vector1.skills, vector2.skills) * weights.skills;
        totalScore += this.jaccardSimilarity(vector1.levels, vector2.levels) * weights.levels;
        totalScore +=
            this.jaccardSimilarity(vector1.employment_types, vector2.employment_types) * weights.employment_types;
        totalScore += this.cosineSimilarity(vector1.textVector, vector2.textVector) * weights.text;
        totalScore += this.jaccardSimilarity(vector1.location, vector2.location) * weights.location;
        totalScore += this.salarySimilarity(vector1.salary, vector2.salary) * weights.salary;

        return totalScore;
    }
}

export default SimilarityService;
