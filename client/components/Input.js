import React, { useState } from 'react';
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';

const Input = () => {
  const [location, setLocation] = useState('');

  const handleSelect = async (value) => {
    const result = await geocodeByAddress(value);
    setLocation(value);
    const s = await getLatLng(result[0]);
    console.log(s);
    const [city, country] = value.split(',');
    console.log({ city, country });
  };
  return (
    <PlacesAutocomplete
      value={location}
      onChange={setLocation}
      onSelect={handleSelect}
      searchOptions={{ types: ['(cities)'] }}
    >
      {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => {
        const inputProps = getInputProps({ placeholder: 'Enter destination...', autoFocus: true });
        const suggestionsToRender = suggestions.map((suggestion, index) => {
          const style = {
            backgroundColor: suggestion.active ? '#41b6e6' : '#fff',
            cursor: 'pointer',
          };
          const key = suggestion.description;
          const props = {
            ...getSuggestionItemProps(suggestion, { style }),
            key: suggestion.description,
          };
          return <div {...props}>{suggestion.description}</div>;
        });

        return (
          <div>
            <input {...inputProps} />
            {loading && <div>Loading...</div>}
            {suggestionsToRender}
          </div>
        );
      }}
    </PlacesAutocomplete>
  );
};
export default Input;
