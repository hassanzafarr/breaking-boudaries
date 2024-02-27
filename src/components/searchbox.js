// Inside your existing code, create a SearchBox component

import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";

const SearchBox = ({ mapsapi, onPlacesChanged, placeholder }) => {
  const searchInput = useRef(null);

  useEffect(() => {
    const searchBox = new mapsapi.places.SearchBox(searchInput.current);
    searchBox.addListener("places_changed", () => {
      if (onPlacesChanged) {
        onPlacesChanged(searchBox.getPlaces());
      }
    });

    return () => {
      mapsapi.event.clearInstanceListeners(searchBox);
    };
  }, [mapsapi, onPlacesChanged]);

  return (
    <input
      ref={searchInput}
      placeholder={placeholder}
      type="text"
      style={{
        width: "392px",
        height: "48px",
        fontSize: "20px",
        padding: "12px 104px 11px 64px",
      }}
    />
  );
};

SearchBox.propTypes = {
  mapsapi: PropTypes.shape({
    places: PropTypes.shape({
      SearchBox: PropTypes.func,
    }),
    event: PropTypes.shape({
      clearInstanceListeners: PropTypes.func,
    }),
  }).isRequired,
  placeholder: PropTypes.string,
  onPlacesChanged: PropTypes.func,
};

SearchBox.defaultProps = {
  placeholder: "Search...",
  onPlacesChanged: null,
};

export default SearchBox;
