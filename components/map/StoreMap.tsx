"use client";

import { useState } from "react";
import Map, { Marker, NavigationControl } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { MapPin } from "lucide-react";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || "";

// Davao City Coordinates
const DAVAO_COORDINATES = {
  longitude: 125.6077,
  latitude: 7.0731,
  zoom: 14
};

export default function StoreMap() {
  const [viewState, setViewState] = useState(DAVAO_COORDINATES);
  const [activeCanvas, setActiveCanvas] = useState<'macro' | 'micro'>('macro');

  if (!MAPBOX_TOKEN) {
    return (
      <div className="w-full h-[500px] bg-gray-100 rounded-3xl flex items-center justify-center border-2 border-dashed border-gray-300">
        <div className="text-center p-6">
          <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-heading font-medium text-gray-600 mb-2">Map Configuration Required</h3>
          <p className="text-gray-500 text-sm max-w-md mx-auto">
            Please add NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN to your .env file to enable the interactive double-canvas mapping module.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[500px] rounded-3xl overflow-hidden shadow-lg border border-gray-100">
      <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur p-1 rounded-lg flex shadow-sm">
        <button
          onClick={() => {
            setActiveCanvas('macro');
            setViewState({ ...DAVAO_COORDINATES, zoom: 14 });
          }}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            activeCanvas === 'macro' ? 'bg-brand-black text-white' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Macro View (City)
        </button>
        <button
          onClick={() => {
            setActiveCanvas('micro');
            setViewState({ ...DAVAO_COORDINATES, zoom: 18 });
          }}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            activeCanvas === 'micro' ? 'bg-brand-black text-white' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Micro View (Store)
        </button>
      </div>

      <Map
        {...viewState}
        onMove={evt => setViewState(evt.viewState)}
        mapStyle={activeCanvas === 'macro' ? "mapbox://styles/mapbox/light-v11" : "mapbox://styles/mapbox/dark-v11"}
        mapboxAccessToken={MAPBOX_TOKEN}
      >
        <NavigationControl position="bottom-right" />
        
        <Marker longitude={DAVAO_COORDINATES.longitude} latitude={DAVAO_COORDINATES.latitude} anchor="bottom">
          <div className="relative group cursor-pointer">
            <div className="absolute -inset-4 bg-brand-gold/20 rounded-full animate-ping" />
            <div className="relative bg-brand-gold w-8 h-8 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
              <MapPin className="w-4 h-4 text-white" />
            </div>
            
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max px-3 py-1 bg-brand-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity">
              Maharlika Republic Hub
            </div>
          </div>
        </Marker>
      </Map>
    </div>
  );
}
