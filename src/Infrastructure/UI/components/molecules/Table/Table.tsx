import React from 'react';
import s from './Table.module.css';
import { Spinner } from '../../atoms/Spinner/Spinner';

interface Column {
  key: string;
  label: string;
  width?: string;
}

interface TableProps {
  columns: Column[];
  rows: Record<string, React.ReactNode>[];
  loading?: boolean;
  emptyMessage?: string;
}

export const Table: React.FC<TableProps> = ({ columns, rows, loading, emptyMessage = 'Sin datos' }) => {
  return (
    <div className={s.wrap}>
      {loading && <Spinner size="md" />}
      <table className={s.table}>
        <thead>
          <tr>
            {columns.map(c => (
              <th key={c.key} style={c.width ? { width: c.width } : undefined}>
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {!loading && !rows.length && (
            <tr>
              <td colSpan={columns.length}>{emptyMessage}</td>
            </tr>
          )}
          {!loading && rows.map((r, i) => (
            <tr key={i}>
              {columns.map(c => <td key={c.key}>{r[c.key]}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
