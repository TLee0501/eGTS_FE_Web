const COLUMNS = [
    {
        Header: 'PT',
        accessor: 'hasPt',
        disableGlobalFilter: true,
        Cell: ({ value }) => {
            return (
                <center>
                    <input type="checkbox" checked={value} readOnly placeholder="Có PT?"/>
                </center>
            )
        },
        disableSortBy: true,
        width: 30
    },
    {
        Header: 'NE',
        accessor: 'hasNe',
        disableGlobalFilter: true,
        Cell: ({ value }) => {
            return (
                <center>
                    <input type="checkbox" checked={value} readOnly placeholder="Có NE?"/>
                </center>
            )
        },
        disableSortBy: true,
        width: 30
    },
    {
        Header: 'Tổng giá',
        accessor: 'price',
        Cell: ({ value }) => {
            return Number(value).toLocaleString() + ' đ'
        },
        width: 80
    }
]

export default COLUMNS;