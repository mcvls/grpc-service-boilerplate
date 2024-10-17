export function generatePaginatedSql(
  selectString: string,
  fromString: string,
  whereString: string,
  page: number,
  rowsPerPage: number,
) {
  const offSet = (page - 1) * rowsPerPage;
  const paginatedSql = `SELECT COUNT(1) AS totalRows 
  FROM ${fromString} 
  WHERE ${whereString};
  SELECT ${selectString} 
  FROM ${fromString} 
  WHERE ${whereString} 
  LIMIT ${rowsPerPage}
  OFFSET ${offSet};
  `;

  return paginatedSql;
}

export function generatePaginatedSqlGroupBy(
  selectString: string,
  fromString: string,
  whereString: string,
  groupByString: string,
  orderByString: string,
  page: number,
  rowsPerPage: number,
) {
  const offSet = (page - 1) * rowsPerPage;
  const paginatedSql = `SELECT COUNT(1) AS totalRows 
  FROM (SELECT ${selectString} 
        FROM ${fromString} 
      WHERE ${whereString}
      GROUP BY ${groupByString}
      ORDER BY ${groupByString}
  ) SUBQUERY;
  SELECT ${selectString} 
  FROM ${fromString} 
  WHERE ${whereString} 
  GROUP BY ${groupByString}
  ORDER BY ${orderByString}
  LIMIT ${rowsPerPage}
  OFFSET ${offSet};
  `;

  return paginatedSql;
}
