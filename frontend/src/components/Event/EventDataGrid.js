import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { TextField, InputAdornment, MenuItem } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { format, parseISO } from 'date-fns';

const EventDataGrid = ({
    events,
    searchQuery,
    setSearchQuery,
    dateFilter,
    setDateFilter,
    locationFilter,
    setLocationFilter,
    availableLocations,
    onEdit, // Optional edit handler
    onDelete, // Optional delete handler
    showFilters = true,
}) => {

    const columns = [
        { field: 'id', headerName: 'ID', width: 90 },
        { field: 'title', headerName: 'Title', width: 150 },
        { field: 'description', headerName: 'Description', width: 200 },
        {
            field: 'date',
            headerName: 'Date and Time',
            width: 180,
            renderCell: (params) => {
                const dateStr = params.value;
                if (dateStr) {
                    try {
                        const date = parseISO(dateStr);
                        return <span>{format(date, 'yyyy-MM-dd HH:mm')}</span>;
                    } catch (error) {
                        console.error('Date parsing error:', error);
                        return <span>Invalid date</span>;
                    }
                }
                return <span>No date provided</span>;
            },
        },
        { field: 'location', headerName: 'Location', width: 150 },
        ...(onEdit && onDelete ? [{
            field: 'actions',
            headerName: 'Actions',
            width: 150,
            renderCell: (params) => (
                <div>
                    <button className="event-button" onClick={() => onEdit(params.row)}>Edit</button>
                    <button className="event-button delete-button" onClick={() => onDelete(params.id)}>Delete</button>
                </div>
            ),
        }] : []),
    ];

    return (
        <>
            {showFilters && (
                <div className="filter-container">
                    <TextField
                        label="Search Events"
                        variant="outlined"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="search-bar"
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        }}
                    />
                    <TextField
                        label="Filter by Date"
                        type="date"
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                        className="date-filter"
                    />
                    <TextField
                        select
                        label="Location"
                        value={locationFilter}
                        onChange={(e) => setLocationFilter(e.target.value)}
                        className="location-filter"
                    >
                        <MenuItem value="">All Locations</MenuItem>
                        {availableLocations.map(loc => (
                            <MenuItem key={loc} value={loc}>{loc}</MenuItem>
                        ))}
                    </TextField>
                </div>
            )}
            <div className="datagrid-container">
                <DataGrid
                    rows={events}
                    columns={columns}
                    pageSize={5}
                    rowsPerPageOptions={[5, 10, 20]}
                    autoHeight
                    disableSelectionOnClick
                    style={{ borderRadius: '8px', backgroundColor: '#FFFFFF' }}
                />
            </div>
        </>
    );
};

export default EventDataGrid;
