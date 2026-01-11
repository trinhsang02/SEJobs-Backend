import natural from "natural";

const TfIdf = natural.TfIdf;
const tokenizer = new natural.WordTokenizer();

/**
 * Chuyển text thành TF-IDF vector
 * Sử dụng thư viện natural để tính TF-IDF
 */
export async function tfidfVectorize(text: string): Promise<number[]> {
    if (!text || text.trim() === "") return [];

    try {
        const tfidf = new TfIdf();
        const cleanedText = text.toLowerCase().replace(/[^\w\s]/g, " ");
        tfidf.addDocument(cleanedText);

        const vector: number[] = [];
        const terms = tokenizer.tokenize(cleanedText) || [];
        const uniqueTerms = [...new Set(terms)];

        uniqueTerms.forEach((term) => {
            tfidf.tfidfs(term, (i, measure) => {
                if (i === 0) vector.push(measure);
            });
        });

        return vector;
    } catch (error) {
        console.error("Error in tfidfVectorize:", error);
        return [];
    }
}

/**
 * Simple word vectorization (fallback)
 * Tạo term frequency vector đơn giản
 */
export function simpleVectorize(text: string): number[] {
    if (!text || text.trim() === "") return [];

    try {
        const cleanedText = text.toLowerCase().replace(/[^\w\s]/g, " ");
        const tokens = tokenizer.tokenize(cleanedText) || [];
        const uniqueTokens = [...new Set(tokens)];

        // Term frequency vector
        return uniqueTokens.map((term) => {
            const count = tokens.filter((t) => t === term).length;
            return count / tokens.length;
        });
    } catch (error) {
        console.error("Error in simpleVectorize:", error);
        return [];
    }
}

/**
 * Normalize vector về đơn vị length
 */
export function normalizeVector(vector: number[]): number[] {
    if (vector.length === 0) return [];

    const magnitude = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));

    if (magnitude === 0) return vector;

    return vector.map((val) => val / magnitude);
}

/**
 * Chuyển array of IDs thành binary multi-hot vector
 */
export function multiHotEncode(ids: number[], maxId: number = 1000): number[] {
    const vector = new Array(maxId).fill(0);
    ids.forEach((id) => {
        if (id > 0 && id < maxId) {
            vector[id] = 1;
        }
    });
    return vector;
}
