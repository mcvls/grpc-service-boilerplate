import { Inject, Injectable } from '@nestjs/common';
import mysql, { RowDataPacket } from 'mysql2';
import { PoolConnection } from 'mysql2/promise';
import PaginatedResult from './database.types';
import {
  generatePaginatedSql,
  generatePaginatedSqlGroupBy,
} from './sql.helper';
import {
  DATABASE_CONFIG_OPTIONS,
  DatabaseOptions,
} from './database-options.type';

@Injectable()
export class DbService {
  private pool: mysql.Pool;
  constructor(
    @Inject(DATABASE_CONFIG_OPTIONS) private options: DatabaseOptions,
  ) {
    this.pool = mysql.createPool({
      host: this.options.host,
      port: this.options.port,
      user: this.options.username,
      password: this.options.password,
      database: this.options.database,
      connectionLimit: this.options.connectionLimit,
      waitForConnections: true,
      queueLimit: 0,
      multipleStatements: true,
      decimalNumbers: true,
      supportBigNumbers: true,
      bigNumberStrings: true,
    });
  }

  private mapToModel<T>(type: new () => T, rows: RowDataPacket[]): T[] {
    const ret: T[] = [];
    if (rows?.length) {
      const obj = new type();
      const properties = Object.getOwnPropertyNames(obj);
      rows.forEach((e) => {
        const toObj = {};
        properties.forEach((prop) => {
          if (e.hasOwnProperty(prop)) toObj[prop] = e[prop];
        });
        ret.push(toObj as T);
      });
    }
    return ret;
  }

  async queryToModel<T>(
    type: new () => T,
    sql: string,
    params?: any[] | null,
  ): Promise<T[]> {
    const promisePool = this.pool.promise();
    const con = await promisePool.getConnection();
    let retRows: RowDataPacket[];
    await con
      .execute(sql, params)
      .then(([rows]) => {
        retRows = rows as unknown as RowDataPacket[];
      })
      .catch((error) => {
        throw error;
      })
      .finally(() => con.release());

    const ret = this.mapToModel(type, retRows);

    return ret;
  }

  async queryToModelPaginated<T>(
    type: new () => T,
    selectString: string,
    fromString: string,
    whereString: string,
    page = 1,
    rowsPerPage = 20,
    params?: any[] | null,
    groupByString = '',
    orderByString = '',
  ): Promise<PaginatedResult<T>> {
    let ret: any;
    const promisePool = this.pool.promise();
    const con = await promisePool.getConnection();
    let sql = '';

    if (groupByString) {
      sql = generatePaginatedSqlGroupBy(
        selectString,
        fromString,
        whereString,
        groupByString,
        orderByString,
        page,
        rowsPerPage,
      );
    } else {
      sql = generatePaginatedSql(
        selectString,
        fromString,
        whereString,
        page,
        rowsPerPage,
      );
    }

    if (params) {
      params = params.concat(params);
    }
    await con
      .query<RowDataPacket[][]>(sql, params)
      .then(([rows]) => {
        const res: PaginatedResult<T> = {
          Rows: this.mapToModel(type, rows[1]),
          TotalCount: rows[0][0].totalRows,
        };
        ret = res;
      })
      .catch((error) => {
        throw error;
      })
      .finally(() => con.release());

    return ret;
  }

  async execute(sql: string, params?: any[] | null, bulk?: boolean | false) {
    const promisePool = this.pool.promise();
    const con = await promisePool.getConnection();
    let ret: any;
    if (!bulk) {
      await con
        .execute(sql, params)
        .then(([rows]) => {
          ret = rows;
        })
        .catch((error) => {
          throw error;
        })
        .finally(() => con.release());
    } else {
      await con
        .query(sql, params)
        .then(([rows]) => {
          ret = rows;
        })
        .catch((error) => {
          throw error;
        })
        .finally(() => con.release());
    }

    return ret;
  }

  async getTransactionConnection() {
    const promisePool = this.pool.promise();
    const con = await promisePool.getConnection();
    await con.beginTransaction().catch((error) => {
      con.release();
      throw error;
    });
    return con;
  }

  async executeTransaction(
    con: PoolConnection,
    sql: string,
    params?: any[] | null,
    bulk?: boolean | false,
  ) {
    let ret: any;
    if (!bulk) {
      await con
        .execute(sql, params)
        .then(([rows]) => {
          ret = rows;
        })
        .catch((error) => {
          con.rollback();
          con.release();
          throw error;
        });
    } else {
      await con
        .query(sql, params)
        .then(([rows]) => {
          ret = rows;
        })
        .catch((error) => {
          con.rollback();
          con.release();
          throw error;
        });
    }

    return ret;
  }

  async commitTransactionConnection(con: PoolConnection) {
    await con
      .commit()
      .catch((error) => {
        con.rollback();
        throw error;
      })
      .finally(() => con.release());
  }
}
