/* src/components/Event/EventListDataGrid.js */
import React from "react";
import EventGrid from "./EventGrid";

const EventListDataGrid = ({
  events,
  searchQuery,
  setSearchQuery,
  dateFilter,
  setDateFilter,
  locationFilter,
  setLocationFilter,
  availableLocations,
  registeredEvents,
  handleRegister,
  handleRSVP,
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
      registeredEvents={registeredEvents}
      handleRegister={handleRegister}
      handleRSVP={handleRSVP}
      showFilters={showFilters}
      showActions={true}
      isListMode={true}
    />
  );
};

export default EventListDataGrid;
