export function cosineSimilarity(a: number[], b: number[]): number {
    const dot = a.reduce((sum, ai, i) => sum + ai * b[i], 0);
    const normA = Math.sqrt(a.reduce((sum, ai) => sum + ai * ai, 0));
    const normB = Math.sqrt(b.reduce((sum, bi) => sum + bi * bi, 0));
    if (normA === 0 || normB === 0) return 0;
    return dot / (normA * normB);
}

export function calculateAverageScore(scores: number[]): number {
    return scores.length > 0
        ? scores.reduce((sum, s) => sum + s, 0) / scores.length
        : 0;
}