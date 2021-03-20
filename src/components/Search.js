import React from "react";

import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
} from "@reach/combobox";
import "./../assets/styles/index.css";
import { center } from "../constants";

export default function Search({panTo}) {
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      location: { lat: () => center.lat, lng: () => center.lng },
      radius: 200 * 1000,
    },
  });
  return (
    <Combobox
      className={"search"}
      onSelect={async (address) => {
        setValue(address, false)
        clearSuggestions()
        try {
          const results = await getGeocode({address: address})
          const { lat, lng } = await getLatLng(results[0]);
          panTo({lat, lng})
        } catch (e) {
          console.log('error', e)
        }

        console.log(address);
      }}
    >
      <ComboboxInput
        value={value}
        onChange={(event) => {
          setValue(event.target.value);
        }}
        disabled={!ready}
        placeholder={"Enter an adress"}
      />
      <ComboboxPopover>
        {status === "OK" &&
          data.map(({ id, description }) => (
            <ComboboxOption key={id} value={description} />
          ))}
      </ComboboxPopover>
    </Combobox>
  )
}
