/* src/components/Event/EventDataGrid.js */
import React from "react";
import EventGrid from "./EventGrid";

const EventDataGrid = ({
  events,
  searchQuery,
  setSearchQuery,
  dateFilter,
  setDateFilter,
  locationFilter,
  setLocationFilter,
  availableLocations,
  onEdit,
  onDelete,
  showFilters = true,
}) => {
  return (
    <EventGrid
      events={events}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      dateFilter={dateFilter}
      setDateFilter={setDateFilter}
      locationFilter={locationFilter}
      setLocationFilter={setLocationFilter}
      availableLocations={availableLocations}
      onEdit={onEdit}
      onDelete={onDelete}
      showFilters={showFilters}
      showActions={true}
    />
  );
};

export default EventDataGrid;
