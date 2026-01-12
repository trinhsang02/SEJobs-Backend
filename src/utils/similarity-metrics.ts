/**
 * Tính Jaccard Similarity giữa 2 arrays
 * Jaccard = |A ∩ B| / |A ∪ B|
 */
export function jaccardSimilarity(arr1: number[], arr2: number[]): number {
    if (arr1.length === 0 && arr2.length === 0) return 1;
    if (arr1.length === 0 || arr2.length === 0) return 0;

    const set1 = new Set(arr1);
    const set2 = new Set(arr2);

    const intersection = new Set([...set1].filter((x) => set2.has(x)));
    const union = new Set([...set1, ...set2]);

    return intersection.size / union.size;
}

/**
 * Tính Cosine Similarity giữa 2 vectors
 * Cosine = (A · B) / (||A|| * ||B||)
 */
export function cosineSimilarity(vec1: number[], vec2: number[]): number {
    if (vec1.length === 0 || vec2.length === 0) return 0;

    // Đảm bảo cùng length bằng cách padding zeros
    const maxLen = Math.max(vec1.length, vec2.length);
    const v1 = [...vec1, ...Array(maxLen - vec1.length).fill(0)];
    const v2 = [...vec2, ...Array(maxLen - vec2.length).fill(0)];

    // Dot product
    const dotProduct = v1.reduce((sum, val, i) => sum + val * v2[i], 0);

    // Magnitudes
    const magnitude1 = Math.sqrt(v1.reduce((sum, val) => sum + val * val, 0));
    const magnitude2 = Math.sqrt(v2.reduce((sum, val) => sum + val * val, 0));

    if (magnitude1 === 0 || magnitude2 === 0) return 0;

    return dotProduct / (magnitude1 * magnitude2);
}

/**
 * Tính Euclidean Distance giữa 2 vectors
 * Distance = sqrt(Σ(a_i - b_i)²)
 */
export function euclideanDistance(vec1: number[], vec2: number[]): number {
    if (vec1.length === 0 || vec2.length === 0) return Infinity;

    const maxLen = Math.max(vec1.length, vec2.length);
    const v1 = [...vec1, ...Array(maxLen - vec1.length).fill(0)];
    const v2 = [...vec2, ...Array(maxLen - vec2.length).fill(0)];

    const sumSquaredDiff = v1.reduce((sum, val, i) => {
        const diff = val - v2[i];
        return sum + diff * diff;
    }, 0);

    return Math.sqrt(sumSquaredDiff);
}

/**
 * Chuyển distance thành similarity score (0-1)
 */
export function distanceToSimilarity(distance: number, maxDistance: number = 10): number {
    if (distance === 0) return 1;
    if (distance >= maxDistance) return 0;
    return 1 - distance / maxDistance;
}

/**
 * Tính Overlap Coefficient
 * Overlap = |A ∩ B| / min(|A|, |B|)
 */
export function overlapCoefficient(arr1: number[], arr2: number[]): number {
    if (arr1.length === 0 && arr2.length === 0) return 1;
    if (arr1.length === 0 || arr2.length === 0) return 0;

    const set1 = new Set(arr1);
    const set2 = new Set(arr2);

    const intersection = new Set([...set1].filter((x) => set2.has(x)));
    const minSize = Math.min(set1.size, set2.size);

    return intersection.size / minSize;
}

/**
 * Tính Dice Coefficient (Sørensen–Dice coefficient)
 * Dice = 2 * |A ∩ B| / (|A| + |B|)
 */
export function diceCoefficient(arr1: number[], arr2: number[]): number {
    if (arr1.length === 0 && arr2.length === 0) return 1;
    if (arr1.length === 0 || arr2.length === 0) return 0;

    const set1 = new Set(arr1);
    const set2 = new Set(arr2);

    const intersection = new Set([...set1].filter((x) => set2.has(x)));

    return (2 * intersection.size) / (set1.size + set2.size);
}
