import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Service2 } from '@/interface';
import { useGetService2Query } from '@/services/api';
import { useEffect, useState } from 'react';
import { t } from 'i18next';


// Marker ikonkalari uchun ranglar
const categoryColors: { [key: string]: string } = {
  H: 'red',
  M: 'blue',
  A: 'green',
  D: 'brown',
  R: 'pink',
  E: 'cyan',
  P: 'grey',
  Sh: 'orange',
  B: 'yellow',
  S: 'black',
  T: 'violet'
};
const categoryLabels = [
  { key: "H", color: "bg-red-700", label: t("mapLabel.H") },
  { key: "M", color: "bg-blue-500", label: t("mapLabel.M") },
  { key: "A", color: "bg-green-600", label: t("mapLabel.A") },
  { key: "Sh", color: "bg-orange-500", label: t("mapLabel.Sh") },
  { key: "B", color: "bg-yellow-500", label: t("mapLabel.B") },
  { key: "S", color: "bg-black", label: t("mapLabel.S") },
  { key: "T", color: "bg-violet-500", label: t("mapLabel.T") },
  { key: "D", color: "bg-amber-700", label: t("mapLabel.D") },   // qo‘shimcha
  { key: "R", color: "bg-pink-500", label: t("mapLabel.R") },
  { key: "E", color: "bg-indigo-500", label: t("mapLabel.E") },
  { key: "P", color: "bg-fuchsia-500", label: t("mapLabel.P") },
];
// yordamchi funksiya
const normalizeCoords = (
  latitude: number | null | undefined,
  longitude: number | null | undefined
): [number, number] => {
  // Toshkentni fallback
  const fallback: [number, number] = [41.264812, 69.230273];

  if (typeof latitude !== "number" || typeof longitude !== "number") {
    return fallback;
  }

  // Leaflet faqat [lat, lng] formatini kutadi
  return [latitude, longitude];
};


// Custom marker ikonka yaratish
const createCustomIcon = (color: string) => {
  return new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });
};


const Map: React.FC = () => {
  const { data: services, isLoading, error } = useGetService2Query();
  const [zoom, setZoom] = useState(7);
  useEffect(() => {


    const handleResize = () => {
      if (window.innerWidth < 768) {
        setZoom(5); // mobile
      } else {
        setZoom(7); // desktop
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  if (isLoading) return <div className="text-center  text-xl">Yuklanmoqda...</div>;
  if (error) return <div className="text-center text-red-500">Xatolik yuz berdi!</div>;


  return (
    <div className="h-screen relative w-full">
      <MapContainer
        center={[41.3775, 64.5853]} // O‘zbekiston markazi
        zoom={zoom} // butun respublikani ko‘rsatadi
        className="h-full relative   w-full">
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {services?.map((service: Service2) => (
          <Marker
            key={service.id}
            position={normalizeCoords(service.longitude, service.latitude)}
            icon={createCustomIcon(categoryColors[service.category] || 'blue')}
          >
            <Popup>
              <div className="flex flex-col space-y-2">
                <h3 className="font-bold text-lg">{service.name}</h3>
                <p>Telefon: {service.phone}</p>
                <div className="flex text-white space-x-2">
                  <a
                    href={`https://yandex.com/maps/?ll=${service.longitude},${service.latitude}&z=16`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-sky-900 text-white px-3 py-1  hover:bg-sky-400"
                  >
                    Yandex Maps
                  </a>
                  <a
                    href={`https://www.google.com/maps?q=${service.latitude},${service.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-sky-900 text-white px-3 py-1  hover:bg-sky-400"
                  >
                    Google Maps
                  </a>
                  <a
                    href={`geo:${service.latitude},${service.longitude}`}
                    className="bg-sky-900 text-white px-3 py-1  hover:bg-sky-400"
                  >
                    Mobil Navigatsiya
                  </a>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
        <div className='bg-white md:h-[400px]  p-5 z-9999 md:w-[400px] w-full absolute left-0 bottom-0 overflow-y-auto'>
          <div className='grid grid-cols-2 gap-8'>
            {categoryLabels.map((cat) => (
              <div key={cat.key} className='flex gap-3 items-center'>
                <div className={`${cat.color} w-5 h-5`}></div>
                <p className='text-sm font-semibold'>{cat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </MapContainer >

    </div >
  );
};

export default Map;