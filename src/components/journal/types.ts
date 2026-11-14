export type ArticleId = "chiroso" | "buying" | "urrao";
export type Block = { h2?: string; p: string[] };
export type ArticleContent = Record<ArticleId, Block[]>;
