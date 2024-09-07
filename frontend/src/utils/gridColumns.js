// src/utils/gridColumns.js
import { format, parseISO } from "date-fns";

export const getCommonColumns = () => [
  { field: "id", headerName: "ID", width: 90 },
  { field: "title", headerName: "Title", width: 150 },
  { field: "description", headerName: "Description", width: 200 },
  {
    field: "date",
    headerName: "Date and Time",
    width: 180,
    renderCell: (params) => {
      const dateStr = params.value;
      if (dateStr) {
        try {
          const date = parseISO(dateStr);
          return <span>{format(date, "yyyy-MM-dd HH:mm")}</span>;
        } catch (error) {
          console.error("Date parsing error:", error);
          return <span>Invalid date</span>;
        }
      }
      return <span>No date provided</span>;
    },
  },
  { field: "location", headerName: "Location", width: 150 },
];
