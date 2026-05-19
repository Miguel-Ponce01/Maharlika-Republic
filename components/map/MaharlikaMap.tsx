"use client";

import { useState, useMemo, useCallback } from "react";
import Map, { Marker, Popup, NavigationControl, Source, Layer } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { MapPin, Info, Navigation2 } from "lucide-react";
import storeLayout from "@/lib/store-layout.geojson";

const DAVAO_COORDINATES = {
  longitude: 125.6111,
  latitude: 7.0825,
  zoom: 16,
  pitch: 0,
  bearing: 0
};

export default function MaharlikaMap() {
  const [viewState, setViewState] = useState(DAVAO_COORDINATES);
  const [activeCanvas, setActiveCanvas] = useState<'macro' | 'micro'>('macro');
  const [showPopup, setShowPopup] = useState(false);
  const [hoverInfo, setHoverInfo] = useState<{feature: any, x: number, y: number} | null>(null);

  const isMicroView = activeCanvas === 'micro' || viewState.zoom >= 18;

  // Layer styles for indoor GeoJSON
  const indoorLayerStyle = useMemo<any>(() => ({
    id: "indoor-zones",
    type: "fill" as const,
    paint: {
      "fill-color": [
        "case",
        ["boolean", ["feature-state", "hover"], false],
        "#B47C2E", // brand-gold
        "#E5E7EB" // gray-200
      ],
      "fill-opacity": 0.6,
      "fill-outline-color": "#1A1C1E"
    }
  }), []);

  const onHover = useCallback((event: any) => {
    const {
      features,
      point: { x, y }
    } = event;
    const hoveredFeature = features && features[0];

    setHoverInfo(hoveredFeature ? { feature: hoveredFeature, x, y } : null);
  }, []);

  return (
    <div className="relative w-full h-[600px] rounded-3xl overflow-hidden shadow-2xl border border-gray-200 group">
      
      {/* View Toggle Controls */}
      <div className="absolute top-6 left-6 z-10 bg-white/80 backdrop-blur-md p-1.5 rounded-xl shadow-lg border border-white/50 flex transition-all">
        <button
          onClick={() => {
            setActiveCanvas('macro');
            setViewState({ ...DAVAO_COORDINATES, zoom: 14 });
          }}
          className={`px-5 py-2.5 text-sm font-medium rounded-lg transition-all duration-300 ${
            !isMicroView ? 'bg-[#1A1C1E] text-white shadow-md' : 'text-gray-600 hover:bg-white/50'
          }`}
        >
          Macro View
        </button>
        <button
          onClick={() => {
            setActiveCanvas('micro');
            setViewState({ ...DAVAO_COORDINATES, zoom: 19, pitch: 45 });
          }}
          className={`px-5 py-2.5 text-sm font-medium rounded-lg transition-all duration-300 ${
            isMicroView ? 'bg-[#1A1C1E] text-white shadow-md' : 'text-gray-600 hover:bg-white/50'
          }`}
        >
          Indoor Layout
        </button>
      </div>

      <Map
        {...viewState}
        onMove={evt => setViewState(evt.viewState)}
        mapStyle={isMicroView ? "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json" : "https://tiles.openfreemap.org/styles/liberty"}
        interactiveLayerIds={isMicroView ? ['indoor-zones'] : undefined}
        onMouseMove={isMicroView ? onHover : undefined}
        onMouseLeave={isMicroView ? () => setHoverInfo(null) : undefined}
      >
        <NavigationControl 
          position="bottom-right" 
          showCompass={true} 
          showZoom={true} 
          visualizePitch={true}
        />
        
        {/* Macro View Marker */}
        {!isMicroView && (
          <Marker 
            longitude={DAVAO_COORDINATES.longitude} 
            latitude={DAVAO_COORDINATES.latitude} 
            anchor="bottom"
            onClick={(e: any) => {
              e.originalEvent.stopPropagation();
              setShowPopup(true);
            }}
          >
            <div className="relative cursor-pointer transition-transform hover:scale-110">
              <div className="absolute -inset-6 bg-brand-gold/20 rounded-full animate-ping" />
              <div className="relative bg-gradient-to-br from-brand-gold to-yellow-600 w-12 h-12 rounded-full flex items-center justify-center shadow-xl border-4 border-white">
                <MapPin className="w-6 h-6 text-white" />
              </div>
            </div>
          </Marker>
        )}
 
        {/* Macro View Popup */}
        {!isMicroView && showPopup && (
          <Popup
            anchor="top"
            longitude={DAVAO_COORDINATES.longitude}
            latitude={DAVAO_COORDINATES.latitude}
            onClose={() => setShowPopup(false)}
            closeButton={false}
            className="maharlika-popup"
            offset={20}
          >
            <div className="bg-white/80 backdrop-blur-md p-4 rounded-2xl shadow-xl min-w-[200px] border border-white">
              <h3 className="font-heading font-bold text-lg text-brand-black mb-1">Maharlika Republic</h3>
              <p className="text-sm text-gray-600 flex items-center gap-1 mb-3">
                <Info className="w-3 h-3" />
                Open Today: 10AM - 9PM
              </p>
              <button className="w-full py-2 bg-[#1A1C1E] text-white text-sm font-medium rounded-lg flex items-center justify-center gap-2 hover:bg-black transition-colors">
                <Navigation2 className="w-4 h-4" />
                Get Directions
              </button>
            </div>
          </Popup>
        )}
 
        {/* Micro View (Indoor Layout) */}
        {isMicroView && (
          <Source type="geojson" data={storeLayout}>
            <Layer {...indoorLayerStyle} />
          </Source>
        )}
      </Map>
 
      {/* Micro View Tooltip */}
      {isMicroView && hoverInfo && (
        <div
          className="absolute z-50 pointer-events-none bg-[#1A1C1E] text-white px-3 py-1.5 rounded-lg text-sm font-medium shadow-xl transform -translate-x-1/2 -translate-y-full mt-[-10px]"
          style={{ left: hoverInfo.x, top: hoverInfo.y }}
        >
          {hoverInfo.feature.properties.name}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-[#1A1C1E]"></div>
        </div>
      )}
 
      {/* Global override for maplibre popup container to make it truly blurred and borderless */}
      <style jsx global>{`
        .maplibre-gl-popup-content, .mapboxgl-popup-content {
          background: transparent !important;
          box-shadow: none !important;
          padding: 0 !important;
        }
        .maplibre-gl-popup-tip, .mapboxgl-popup-tip {
          display: none !important;
        }
        .maplibregl-ctrl-group {
          background: rgba(255, 255, 255, 0.9) !important;
          backdrop-filter: blur(8px) !important;
          border-radius: 12px !important;
          border: none !important;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06) !important;
          overflow: hidden !important;
        }
        .maplibregl-ctrl-group button {
          width: 36px !important;
          height: 36px !important;
        }
      `}</style>
    </div>
  );
}
