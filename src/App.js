import React, {useEffect, useState} from "react";
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
import mapStyles from "./styles/mapStyles";
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

    const options = {
        styles: mapStyles,
        disableDefaultUI: true,
        zoomControl: true,
    }

    const {isLoaded, loadError} = useLoadScript({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
        libraries
    })

    const [markers, setMarkers] = useState([])

    if (loadError) return "Error loading maps"
    if (!isLoaded) return "Loading maps "


    return (
        <section>
            <h1 className={'title'}>Thunders <span role="img" aria-label="fireworks">🎆</span></h1>
            <GoogleMap
                mapContainerStyle={mapContainerStyle}
                zoom={8}
                z center={center}
                options={options}
                onClick={(event) => {
                    setMarkers(current => [
                        ...current, {
                            lat: event.latLng.lat(),
                            lng: event.latLng.lng(),
                            time: new Date()
                        }
                    ])
                }}
            >

            </GoogleMap>
            <pre>{JSON.stringify(markers, null, 2)}</pre>
        </section>
    )
}

export default App;
