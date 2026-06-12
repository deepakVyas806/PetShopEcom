export interface PaginationMeta {
  page:       number;
  limit:      number;
  totalCount: number;
  totalPages: number;
  hasMore:    boolean;
}

export function parsePagination(
  query: { page?: string | number; limit?: string | number },
  defaultLimit = 20
): { page: number; limit: number; skip: number } {
  const page  = Math.max(1, parseInt(String(query.page  ?? 1),           10));
  const limit = Math.min(100, Math.max(1, parseInt(String(query.limit ?? defaultLimit), 10)));
  return { page, limit, skip: (page - 1) * limit };
}

export function paginationMeta(page: number, limit: number, totalCount: number): PaginationMeta {
  const totalPages = Math.ceil(totalCount / limit);
  return { page, limit, totalCount, totalPages, hasMore: page < totalPages };
}
