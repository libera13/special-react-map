import React, { useCallback, useRef, useState } from "react";
import "@reach/combobox/styles.css";
import Map from "../components/Map";
import { useQuery, QueryClientProvider, QueryClient } from "react-query";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Map />
    </QueryClientProvider>
  );
}

export default App;
