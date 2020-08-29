import React, { useState } from 'react';
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';

const Input = ({ setQuery }) => {
  const [location, setLocation] = useState('');
  const handleSelect = async (value) => {
    setLocation(value);
    const result = await geocodeByAddress(value);
    const { lat, lng } = await getLatLng(result[0]);
    const arr = value.split(',');
    const query = {
      lat,
      lng,
      city_name: arr[0],
      country_name: arr[arr.length - 1].trim(),
    };
    sessionStorage.setItem('query', JSON.stringify(query));
    setQuery(query);

    document.title = value;
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
