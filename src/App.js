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
import mapStyles from "./assets/styles/mapStyles";
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
                {markers.map(marker => (
                    <Marker key={marker.time.toISOString()}
                            position={{lat: marker.lat, lng: marker.lng}}
                            icon={{
                                url: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAABmJLR0QA/wD/AP+gvaeTAAADXklEQVRoge3YWWhdRRzH8U/qbnpLamOrxT6oVRLrgtVoUdC6tbWi1RdBa1Hq8iJF0DyID4KiaNzAF6UFQYkLFotLKyXuiojbg6BiUawNYt0VI1YEt4f/hJ6E3uXce+5NHs4XLtyZMzPn95/5z3/+cygpKSkpKSkpmXZ0FTDGvliKAczDLmzDCL4tYPyGmNFC330wiK9xK7rxBX7DMnyKJ3FoixrbysF4C1vRV6VNtzBwB07rkK5cHIj3ca/GXPNM/IBTU/kwDOGjVL8Nj2Bx4Urr8KBwmTyswpe4Fj+LSTgFc3EMbsQ3wsAi9m1dFuInzGmi79NCbH+V5wcJdx1qTlo+7hCz2QwVsQK1mI1RHdhTH3bgJddgU7sGPwoniTOi0q6XJHpECD8dx2OvIgZdgc9ECH0HrxUxaAO8IiLjJ/ge67QQBC4Th92yQqQ1Tx/eFdEyN/PwIxYVqagFKvgc5+XtOIj1hctpjTV4Pm+njbi0eC0tMV+NJLRa0ngA/miLnOpchffwcvptN3Ff/J105eIB3FyEugY5FlvsDrV9eMnEUH8uPqg2QLWQtkTkU4vwp5iJK2q0r8aoWNlREcq70v+RTJuZ2Cyi5HfChZ7IlMfZildxXx5D4DExI6uTMYc3YcgY/sHvWJD6j4l8bZxHMZxEzsKzuF5kxeNUxGm/KmnJZch+InItxVP4qo7of0WQGEvl88XJnGUYOzPlq0Vaf1sqj4i9sB2HCFe6p857wd41nv0lNuBiXChSlFr8JzbpGE4WKfud6dlC3ISHM+2PEzN8caZuSMz4LtyOXxsxol304E30pnKvSG0WZNp043V7vgb3p2fntFFjXbrEvWM8Q54pVmlyhnCJyKM24q5M/ZV4UbjVlHKDyAqIjxPPYblYjRNNdOVZuF+k7ftjA+5W2907wgCesTuAnIW3hTHrxf18eab9GXgcRwrXu6hjSmvQgzfEdXUyvcKY6zJ1c1L7NSJlP6LdAhtlGGuFoGwasURs/MkRb5NYhYdEmJ82rBb+vQMrU906IXj2pLZrRYi+vGPqcrJS7IWKSDFusecDdwOO7qCuXMwXsX9A+P7ZnRZQxMewGXgBH+MEEU531uwxTRnELyK9mPIzoFn6xdfDC6ZaSKvMFV/mS0pKSkpy8T8fc57eC6x6YgAAAABJRU5ErkJggg=="
                            }}
                    />
                ))}
            </GoogleMap>
            <pre>{JSON.stringify(markers, null, 2)}</pre>
        </section>
    )
}

export default App;
