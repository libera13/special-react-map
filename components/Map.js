import Head from "next/head";
import React, { useCallback, useRef, useState } from "react";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import { formatRelative } from "date-fns";

import "@reach/combobox/styles.css";
import mapStyles from "./../styles/mapStyles";
import { center, libraries } from "./constants";
import Search from "./Search";
import { Locate } from "./Locate";
import { useQuery, useMutation, useQueryClient } from "react-query";

const mapContainerStyle = {
  width: "100%",
  height: "100vh",
};
const options = {
  styles: mapStyles,
  disableDefaultUI: true,
  zoomControl: true,
};

class markerDTO {
  constructor({ latitude, longitude, createdAt }) {
    this.lat = latitude;
    this.lng = longitude;
    this.time = createdAt;
  }
}

async function fetchSightingsRequest() {
  const response = await fetch("api/sightings");
  const data = await response.json();
  const { sightings } = data;
  return sightings.map((item) => new markerDTO(item));
}

async function createSighting(newSighting) {
  return fetch("/api/sightings/create", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sighting: newSighting }),
  });
}

function Map() {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries,
  });
  const queryClient = useQueryClient();

  const mapRef = useRef();

  const mutate = useMutation(createSighting, {
    onMutate: async (newData) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries("sightings");

      // Snapshot the previous value
      const previousSightings = queryClient.getQueryData("sightings");

      // Optimistically update to the new value
      queryClient.setQueryData("sightings", (prev) => [
        ...prev,
        new markerDTO({ ...newData, createdAt: new Date().toISOString() }),
      ]);

      // Return a context object with the snapshotted value
      return { previousSightings };
    },
    onError: (err, newTodo, context) => {
      queryClient.setQueryData("todos", context.previousSightings);
    },
    onSettled: () => {
      queryClient.invalidateQueries("sightings");
    },
  });

  const onMapClick = useCallback((event) => {
    mutate.mutate({
      latitude: event.latLng.lat(),
      longitude: event.latLng.lng(),
    });
  }, []);
  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);
  const panTo = useCallback(({ lat, lng }) => {
    mapRef.current.panTo({ lat, lng });
    mapRef.current.setZoom(14);
  }, []);

  const { data: markers = [] } = useQuery("sightings", fetchSightingsRequest);

  const [selected, setSelected] = useState(null);

  if (loadError) return "Error loading maps";
  if (!isLoaded) return "Loading maps ";

  return (
    <section>
      <Head>
        <title>Create Next Map</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1 className={"title"}>
        Thunders{" "}
        <span role="img" aria-label="fireworks">
          🎆
        </span>
      </h1>

      <Search panTo={panTo} />

      <Locate panTo={panTo} />

      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={8}
        z
        center={center}
        options={options}
        onClick={onMapClick}
        onLoad={onMapLoad}
      >
        {markers.length &&
          markers.map((marker) => (
            <Marker
              key={marker.time}
              position={{ lat: Number.parseFloat(marker.lat), lng: Number.parseFloat(marker.lng) }}
              icon={{
                url:
                  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAABmJLR0QA/wD/AP+gvaeTAAADXklEQVRoge3YWWhdRRzH8U/qbnpLamOrxT6oVRLrgtVoUdC6tbWi1RdBa1Hq8iJF0DyID4KiaNzAF6UFQYkLFotLKyXuiojbg6BiUawNYt0VI1YEt4f/hJ6E3uXce+5NHs4XLtyZMzPn95/5z3/+cygpKSkpKSkpmXZ0FTDGvliKAczDLmzDCL4tYPyGmNFC330wiK9xK7rxBX7DMnyKJ3FoixrbysF4C1vRV6VNtzBwB07rkK5cHIj3ca/GXPNM/IBTU/kwDOGjVL8Nj2Bx4Urr8KBwmTyswpe4Fj+LSTgFc3EMbsQ3wsAi9m1dFuInzGmi79NCbH+V5wcJdx1qTlo+7hCz2QwVsQK1mI1RHdhTH3bgJddgU7sGPwoniTOi0q6XJHpECD8dx2OvIgZdgc9ECH0HrxUxaAO8IiLjJ/ge67QQBC4Th92yQqQ1Tx/eFdEyN/PwIxYVqagFKvgc5+XtOIj1hctpjTV4Pm+njbi0eC0tMV+NJLRa0ngA/miLnOpchffwcvptN3Ff/J105eIB3FyEugY5FlvsDrV9eMnEUH8uPqg2QLWQtkTkU4vwp5iJK2q0r8aoWNlREcq70v+RTJuZ2Cyi5HfChZ7IlMfZildxXx5D4DExI6uTMYc3YcgY/sHvWJD6j4l8bZxHMZxEzsKzuF5kxeNUxGm/KmnJZch+InItxVP4qo7of0WQGEvl88XJnGUYOzPlq0Vaf1sqj4i9sB2HCFe6p857wd41nv0lNuBiXChSlFr8JzbpGE4WKfud6dlC3ISHM+2PEzN8caZuSMz4LtyOXxsxol304E30pnKvSG0WZNp043V7vgb3p2fntFFjXbrEvWM8Q54pVmlyhnCJyKM24q5M/ZV4UbjVlHKDyAqIjxPPYblYjRNNdOVZuF+k7ftjA+5W2907wgCesTuAnIW3hTHrxf18eab9GXgcRwrXu6hjSmvQgzfEdXUyvcKY6zJ1c1L7NSJlP6LdAhtlGGuFoGwasURs/MkRb5NYhYdEmJ82rBb+vQMrU906IXj2pLZrRYi+vGPqcrJS7IWKSDFusecDdwOO7qCuXMwXsX9A+P7ZnRZQxMewGXgBH+MEEU531uwxTRnELyK9mPIzoFn6xdfDC6ZaSKvMFV/mS0pKSkpy8T8fc57eC6x6YgAAAABJRU5ErkJggg==",
              }}
              onClick={() => setSelected(marker)}
            />
          ))}

        {selected ? (
          <InfoWindow
            position={{ lat: selected.lat, lng: selected.lng }}
            onCloseClick={() => setSelected(null)}
          >
            <div>
              <h2>Lighten report</h2>
              <p>Spotted {formatRelative(new Date(selected.time), new Date())}</p>
            </div>
          </InfoWindow>
        ) : null}
      </GoogleMap>
    </section>
  );
}

export default Map;
