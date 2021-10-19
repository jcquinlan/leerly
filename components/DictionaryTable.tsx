import React from 'react';
import styled from 'styled-components';
import { useTable, usePagination } from 'react-table';
import { Dictionary } from 'types';
import { Colors, devices } from './styled';
import { WORD_COMPLETION_NUMBER } from '../constants';

const MiniProgressBar = (props) => {
    const { progress } = props;

    const containerStyles = {
        height: 10,
        width: '100%',
        maxWidth: 100,
        backgroundColor: "#eee",
        borderRadius: 50,
    }

    const fillerStyles = {
        height: '100%',
        width: `${progress}%`,
        backgroundColor: Colors.Primary,
        borderRadius: 'inherit',
    }

    return (
        <div style={containerStyles}>
            <div style={fillerStyles}></div>
        </div>
    );
};

const columns = [
    {
        Header: 'Word',
        accessor: 'word',
    },
    {
        Header: '# of times seen',
        accessor: 'count',
    },
    {
        Header: 'Progress',
        Cell: props => {
            if (props.cell.row.original.completed) {
                return <div style={{color: '#fff', fontWeight: 300}}>Completed</div>
            }
            return <div style={{display: 'flex', justifyContent: 'center'}}>
                <MiniProgressBar progress={props.cell.row.values.count / WORD_COMPLETION_NUMBER * 100} />
            </div>
        }
    }
];

const DictionaryTable = ({ dictionary }: { dictionary: Dictionary }) => {
    const data = dictionary;
    const tableInstance = useTable({
        columns,
        data,
        initialState: {
            pageIndex: 0,
            pageSize: 40
        }
    }, usePagination);

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        page,
        canPreviousPage,
        canNextPage,
        pageOptions,
        pageCount,
        gotoPage,
        nextPage,
        previousPage,
        state: { pageIndex },
    } = tableInstance

    return (
        <>
            <DictionaryTableElement {...getTableProps()}>
                <thead>
                    {headerGroups.map(headerGroup => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map(column => (
                                <th {...column.getHeaderProps()}>
                                    {column.render('Header')}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>

                <tbody {...getTableBodyProps()}>
                    {page.map((row, i) => {
                        prepareRow(row);

                        return (
                            <WordRow
                                seen={row.values.count > 0}
                                completed={row.original.completed}
                                greyBackground={i % 2 === 0}
                                {...row.getRowProps()}>
                                {row.cells.map(cell => {
                                    return (
                                        <WordRowCell {...cell.getCellProps()}>
                                            {cell.render('Cell')}
                                        </WordRowCell>
                                    )
                                })}
                            </WordRow>
                        )
                    })}
                </tbody>
            </DictionaryTableElement>

            <Pagination>
                <ButtonWrapper>
                    <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
                        {'<<'}
                    </button>
                    <button onClick={() => previousPage()} disabled={!canPreviousPage}>
                        {'<'}
                    </button>
                    <button onClick={() => nextPage()} disabled={!canNextPage}>
                        {'>'}
                    </button>
                    <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
                        {'>>'}
                    </button>
                </ButtonWrapper>

                <PageCountWrapper>
                    Page{' '}
                    <strong>
                        {pageIndex + 1} of {pageOptions.length}
                    </strong>{' '}
                </PageCountWrapper>

                <span>
                    | Go to page:{' '}
                    <input
                        type="number"
                        defaultValue={pageIndex + 1}
                        onChange={e => {
                            const page = e.target.value ? Number(e.target.value) - 1 : 0
                            gotoPage(page)
                        }}
                        style={{ width: '100px' }}
                    />
                </span>
            </Pagination>
        </>
    );
}

export default DictionaryTable;

const DictionaryTableElement = styled.table`
    width: 100%;
`;

interface WordRowProps {
    seen: boolean;
    completed: boolean;
    greyBackground: boolean;
}
const WordRow = styled.tr<WordRowProps>`
    ${props => props.greyBackground ? `
        background-color: #efefef;
    `: ``}

    ${props => props.seen ? `
        background-color: ${Colors.PrimaryLight};
    `: ``}

    ${props => props.completed ? `
        color: white;
        background-color: ${Colors.Primary};
    `: ``}
`;

const WordRowCell = styled.td`
    padding: 5px;
    text-align: center;
`;

const Pagination = styled.div`
    margin-top: 20px;
    display: flex;
    align-items: center;
    flex-direction: column;

    button {
        margin-right: 5px;
        cursor: pointer;
        background-color: ${Colors.Primary};
        color: #fff;
        border: none;
        padding: 5px 10px;
        border-radius: 8px;
    }

    @media ${devices.mobileL} {
        flex-direction: row;
        justify-content: center;
    }
`;

const ButtonWrapper = styled.div`
    margin-right: 10px;
`;

const PageCountWrapper = styled.div`
    margin: 10px 0;
    margin-right: 10px;
`;
