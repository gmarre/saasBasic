import React, { useMemo, useState } from 'react';
import { useTable, useSortBy, useRowSelect, Column, TableInstance, HeaderGroup } from 'react-table';

type Producer = {
  id: string;
  firstname: string;
  shopname: string;
  theme: string;
  lat: number;
  lgt: number;
};

type ProducerTableProps = {
  producers: Producer[];
};

const ProducerTable: React.FC<ProducerTableProps> = ({ producers }) => {
  const columns: Column<Producer>[] = useMemo(
    () => [
      {
        Header: 'Prénom',
        accessor: 'firstname',
      },
      {
        Header: 'Nom du magasin',
        accessor: 'shopname',
      },
      {
        Header: 'Thème',
        accessor: 'theme',
      },
      {
        Header: 'Latitude',
        accessor: 'lat',
      },
      {
        Header: 'Longitude',
        accessor: 'lgt',
      },
    ],
    []
  );

  const data = useMemo(() => producers, [producers]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state: { selectedRowIds },
  }: TableInstance<Producer> = useTable(
    { columns, data },
    useSortBy,
    useRowSelect,
    hooks => {
      hooks.visibleColumns.push(columns => [
        {
          id: 'selection',
          Header: ({ getToggleAllRowsSelectedProps }) => (
            <div>
              <input type="checkbox" {...getToggleAllRowsSelectedProps()} />
            </div>
          ),
          Cell: ({ row }) => (
            <div>
              <input type="checkbox" {...row.getToggleRowSelectedProps()} />
            </div>
          ),
        },
        ...columns,
      ]);
    }
  );

  const [showMenu, setShowMenu] = useState(false);
  
  const [selectedThemes, setSelectedThemes] = useState<string[]>([]);

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    if (selectedThemes.includes(value)) {
      setSelectedThemes(selectedThemes.filter(theme => theme !== value));
    } else {
      setSelectedThemes([...selectedThemes, value]);
    }
  };

  const filteredRows = useMemo(() => {
    if (selectedThemes.length === 0) return rows;
    return rows.filter(row => selectedThemes.includes(row.values.theme));
  }, [rows, selectedThemes]);

  return (
    <div>
      <table {...getTableProps()} style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
              <th
                {...column.getHeaderProps(column.getSortByToggleProps())}
                style={{ borderBottom: '2px solid black', padding: '10px', cursor: 'pointer', position: 'relative' }}
                onMouseEnter={() => setShowMenu(true)}
                onMouseLeave={() => setShowMenu(false)}
              >
                {column.render('Header')}
                <span>
                  {column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ''}
                </span>
                {/* Ajoutez ici les cases à cocher */}
                {showMenu && column.id === 'theme' && (
                  <div style={{ display: 'flex', flexDirection: 'column', position: 'absolute', gap: '5px', whiteSpace: 'nowrap', top: '100%', left: '0', width: '100%',fontSize: '0.6rem', background: 'rgba(255, 255, 255, 0.8)', padding: '5px', borderRadius: '5px', boxShadow: '0px 0px 1px rgba(0, 0, 0, 0.1)' }}>
                    {Array.from(new Set(data.map(producer => producer.theme))).map(theme => (
                      <label key={theme}>
                        <input
                          type="checkbox"
                          value={theme}
                          onChange={handleCheckboxChange}
                          checked={selectedThemes.includes(theme)}
                        />
                        | {theme} |<br /> 
                      </label>
                      
                    ))}
                  </div>
                )}
              </th>
             ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {filteredRows.map(row => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => (
                  <td {...cell.getCellProps()} style={{ padding: '10px', borderBottom: '1px solid gray' }}>
                    {cell.render('Cell')}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ProducerTable;
