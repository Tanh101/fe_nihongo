import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { userModel } from '../../../Models/Users';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBan, faUnlock } from "@fortawesome/free-solid-svg-icons"
import customAxios from '../../../api/AxiosInstance';
import { Toastify } from '../../../toastify/Toastify';
import { useEffect, useState } from 'react';
interface DataTableProps {
    userdata: userModel[];
}

const BasicTable: React.FC<DataTableProps> = ({ userdata }) => {
    const [rows, setRows] = useState<userModel[]>(userdata);

    useEffect(() => {
        setRows(userdata);
    }, [userdata]);

    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 100 },
        { field: 'email', headerName: 'Email', width: 200 },
        { field: 'name', headerName: 'Name', width: 200 },
        {
            field: 'gender',
            headerName: 'Gender',
            type: 'string',
            width: 120,
        },
        {
            field: 'status',
            headerName: 'Status',
            type: 'string',
            width: 150,
        },
        {
            field: 'created_at',
            headerName: 'Created At',
            type: 'string',
            width: 150,
        },
        {
            field: 'actions',
            headerName: 'Actions',
            sortable: false,
            width: 100,
            renderCell: (params) => {
                const userId = params.row.id;

                const handleBanClick = () => {
                    const banUser = async () => {
                        const res = await customAxios.patch(`/dashboard/users/${userId}`, {
                            status: params.row.status === "active" ? "deleted" : "active",
                        });
                        if (res.status === 200) {
                            setRows((prev) => {
                                const newRows = [...prev];
                                const index = newRows.findIndex((row) => row.id === userId);
                                newRows[index].status = params.row.status === "active" ? "deleted" : "active";

                                return newRows;
                            });
                        }
                        else {
                            Toastify.error("Something went wrong");
                        }
                    }
                    banUser();
                };

                return (
                    <div className='flex flex-1 justify-start items-center px-3'>
                        <button onClick={handleBanClick}>
                            <FontAwesomeIcon icon={params.row.status === "active" ? faBan : faUnlock}
                                color={params.row.status === "active" ? '#eb4034' : '#34eb58'} size='xl' />
                        </button>
                    </div>
                );
            },
        },
    ];
    return (
        <div className='flex flex-1 items-center justify-center w-full' style={{ height: 400, width: '100%' }}>
            <div className='mx-1 border-none flex justify-center items-center text-center'>
                <DataGrid style={{ margin: "10 10", border: "none" }}
                    rows={rows}
                    columns={columns}
                    initialState={{
                        pagination: {
                            paginationModel: { page: 0, pageSize: 5 },
                        },
                    }}
                    pageSizeOptions={[5, 10]}
                />
            </div>
        </div>
    );
}

export default BasicTable;
