import { useMapEvents, Marker, Popup } from 'react-leaflet';
import { useEffect, useRef, useState } from 'react';
import type { LatLngExpression } from 'leaflet';
import L from "leaflet"

const UserLocationMarker = () => {


  const userIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
  const [position, setPosition] = useState<LatLngExpression | null>(null);
  const [locationFound, setLocationFound] = useState(false);
  const [locationDenied, setLocationDenied] = useState(false);
  const retryRef = useRef<NodeJS.Timeout | null>(null);

  const map = useMapEvents({
    locationfound(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
      map.flyTo(e.latlng, map.getZoom());
      setLocationFound(true);
      if (retryRef.current) {
        clearInterval(retryRef.current);
      }
    },
    locationerror(e) {
      console.warn("Joylashuv topilmadi yoki ruxsat berilmagan:", e.message);
      setLocationDenied(true);
    }
  });

  useEffect(() => {
    if (!locationFound && !locationDenied) {
      retryRef.current = setInterval(() => {
        map.locate({
          setView: false,
          maxZoom: 16,
          watch: false,
        });
      }, 3000);

      return () => {
        if (retryRef.current) clearInterval(retryRef.current);
      };
    }
  }, [locationFound, locationDenied, map]);

  if (!position) return null;

  return (
    <Marker position={position} icon={userIcon} >
      <Popup>Siz shu yerda turibsiz</Popup>
    </Marker>
  );
};

export default UserLocationMarker;
