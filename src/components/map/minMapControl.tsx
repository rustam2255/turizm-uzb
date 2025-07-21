import {
    MapContainer,
    Rectangle,
    TileLayer,
    useMap,
    useMapEvent,
  } from 'react-leaflet';
  import { useCallback, useEffect, useMemo, useState } from 'react';
  import type { LatLngBounds, Map as LeafletMap } from 'leaflet';
  
  const POSITION_CLASSES = {
    bottomleft: 'leaflet-bottom leaflet-left',
    bottomright: 'leaflet-bottom leaflet-right',
    topleft: 'leaflet-top leaflet-left',
    topright: 'leaflet-top leaflet-right',
  };
  
  const BOUNDS_STYLE = { weight: 1 };
  
  interface MinimapBoundsProps {
    parentMap: LeafletMap;
    zoom: number;
  }
  
  function MinimapBounds({ parentMap, zoom }: MinimapBoundsProps) {
    const minimap = useMap();
    const [bounds, setBounds] = useState<LatLngBounds>(parentMap.getBounds());
  
    const onClick = useCallback(
      (e: any) => {
        parentMap.setView(e.latlng, parentMap.getZoom());
      },
      [parentMap]
    );
  
    useMapEvent('click', onClick);
  
    useEffect(() => {
      const updateBounds = () => {
        setBounds(parentMap.getBounds());
        minimap.setView(parentMap.getCenter(), zoom);
      };
  
      parentMap.on('move', updateBounds);
      parentMap.on('zoom', updateBounds);
  
      return () => {
        parentMap.off('move', updateBounds);
        parentMap.off('zoom', updateBounds);
      };
    }, [parentMap, minimap, zoom]);
  
    return <Rectangle bounds={bounds} pathOptions={BOUNDS_STYLE} />;
  }
  
  interface MinimapControlProps {
    position?: keyof typeof POSITION_CLASSES;
    zoom?: number;
  }
  
  function MinimapControl({ position = 'topright', zoom = 0 }: MinimapControlProps) {
    const parentMap = useMap();
  
    const minimap = useMemo(() => (
      <MapContainer
        style={{ height: 80, width: 80 }}
        center={parentMap.getCenter()}
        zoom={zoom}
        dragging={false}
        doubleClickZoom={false}
        scrollWheelZoom={false}
        attributionControl={false}
        zoomControl={false}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <MinimapBounds parentMap={parentMap} zoom={zoom} />
      </MapContainer>
    ), [parentMap, zoom]);
  
    const positionClass = POSITION_CLASSES[position];
  
    return (
      <div className={positionClass}>
        <div className="leaflet-control leaflet-bar">{minimap}</div>
      </div>
    );
  }
  
  export default MinimapControl;
  