import React, { useState } from 'react';
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';

const normalize = async (string) => {
  const result = await geocodeByAddress(string);
  const { lat, lng } = await getLatLng(result[0]);
  const arr = string.split(',');
  const city_name = arr.shift();
  const country_name = arr.pop().trim();
  return { city_name, country_name, lat, lng };
};
const Input = ({ setQuery }) => {
  const [location, setLocation] = useState('');

  const handleSelect = async (input) => {
    setLocation(input);
    setQuery(await normalize(input));
    document.title = input;
    setLocation('');
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
