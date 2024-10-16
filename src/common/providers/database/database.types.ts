interface PaginatedResult<T> {
  Rows: T[];
  TotalCount: any;
}

export default PaginatedResult;
