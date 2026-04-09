import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { NavBar } from '../components/NavBar';
import { travelAPI } from '../services/api';
import L from 'leaflet';
import { ArrowLeft } from 'lucide-react';

// Fix Leaflet blank marker issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const customOrangeIcon = new L.Icon({
  iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

export function RouteMap() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [routeData, setRouteData] = useState(null);

  useEffect(() => {
    // Simulated fetch or actual API
    const fetchRoute = async () => {
      try {
        const res = await travelAPI.getById(id);
        setRouteData(res.data);
      } catch (err) {
        console.warn('Using mock route data', err);
        setRouteData({
          sourceName: 'சென்னை', sourceCoords: [13.0827, 80.2707],
          destName: 'மதுரை', destCoords: [9.9252, 78.1198],
          stops: [
            { name: 'விழுப்புரம்', coords: [11.9401, 79.4861] },
            { name: 'திருச்சி', coords: [10.7905, 78.7047] }
          ]
        });
      }
    };
    fetchRoute();
  }, [id]);

  if (!routeData) return <div className="min-h-screen text-center pt-20">Loading Map...</div>;

  const positions = [
    routeData.sourceCoords,
    ...routeData.stops.map(s => s.coords),
    routeData.destCoords
  ];

  return (
    <div className="h-screen flex flex-col bg-transparent">
      <NavBar />
      
      <div className="flex-1 relative">
         <button onClick={() => navigate(-1)} className="absolute top-4 left-4 z-[400] glassmorphism p-2 rounded-full shadow-md text-primary"><ArrowLeft size={24}/></button>
         
         <MapContainer center={routeData.sourceCoords} zoom={7} scrollWheelZoom={true} className="w-full h-full z-10 border-b">
           <TileLayer
             attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
             url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
           />
           
           <Marker position={routeData.sourceCoords}>
             <Popup><strong className="text-primary">{routeData.sourceName} (புறப்பாடு)</strong></Popup>
           </Marker>
           
           {routeData.stops.map((stop, i) => (
             <Marker key={i} position={stop.coords}>
               <Popup>{stop.name}</Popup>
             </Marker>
           ))}

           <Marker position={routeData.destCoords} icon={customOrangeIcon}>
             <Popup><strong className="text-brandOrange">{routeData.destName} (வருகை)</strong></Popup>
           </Marker>
           
           <Polyline pathOptions={{ color: '#1A56DB', weight: 4, dashArray: '10, 10' }} positions={positions} />
         </MapContainer>

         {/* Bottom Sheet Summary */}
         <div className="absolute bottom-0 left-0 w-full glassmorphism border-t border-white/40 rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.1)] z-[400] p-6 max-h-[300px] overflow-y-auto">
            <h3 className="text-xl font-bold text-brandDarkText mb-4">பயண வழி</h3>
            <div className="flex items-center space-x-4 mb-2">
               <div className="w-4 h-4 rounded-full bg-primary"></div>
               <span className="font-bold text-lg">{routeData.sourceName}</span>
            </div>
            <div className="border-l-2 border-dashed border-gray-300 ml-2 pl-6 py-2 space-y-4">
               {routeData.stops.map((s, i) => (
                 <div key={i} className="flex items-center space-x-2 text-brandMutedText">
                   <div className="w-2 h-2 rounded-full bg-gray-400 -ml-[29px]"></div>
                   <span className="font-semibold">{s.name}</span>
                 </div>
               ))}
            </div>
            <div className="flex items-center space-x-4 mt-2">
               <div className="w-4 h-4 rounded-full bg-brandOrange"></div>
               <span className="font-bold text-lg">{routeData.destName}</span>
            </div>
         </div>
      </div>
    </div>
  );
}
