import React from "react";
import {
    GoogleMap,
    useLoadScript,
    Marker,
    InfoWindow,
} from "@react-google-maps/api";
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
import {formatRelative} from "date-fns";

import "@reach/combobox/styles.css";
// import mapStyles from "./mapStyles";
import logo from './logo.svg';
import './App.css';

const libraries = ['places']
function App() {

    const mapContainerStyle = {
        width: "100vh",
        height: "100vh",
    }

    const center = {
        lat: 46.201339,
        lng: 6.147120
    }



    const {isLoaded, loadError} = useLoadScript({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
        libraries
    })

    if (loadError) return "Error loading maps"
    if (!isLoaded) return "Loading maps "


    return (
        <section>
            <GoogleMap
                mapContainerStyle={mapContainerStyle}
                zoom={8}
                center={center}
            >

            </GoogleMap>
            hej
        </section>
    )
}

export default App;
