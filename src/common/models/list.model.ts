export interface ListResponse<T> {
  data: T[];
  total: number;
  pages: number;
  page: number;
}

export const emptyListResponse: ListResponse<any> = { data: [], total: 0, pages: 0, page: 0 };
