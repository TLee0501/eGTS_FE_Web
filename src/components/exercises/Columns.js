import {format} from 'date-fns'

const COLUMNS = [
    {
        Header: 'Tên',
        accessor: 'name'
    },
    {
        Header: 'Ngày Tạo',
        accessor: 'createDate',
        disableGlobalFilter: true,
        Cell: ({ value }) => {return format(new Date(value), 'dd/MM/yyyy')}
    },
    {
        Header: 'Video Link',
        accessor: 'video',
        disableGlobalFilter: true,
        disableSortBy: true,
        Cell: ({ value }) => (
            <a href={value} target="_blank" rel="noopener noreferrer">
                {value}
            </a>
        )
    }
]

export default COLUMNS;