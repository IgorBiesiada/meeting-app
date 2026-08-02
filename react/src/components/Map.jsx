import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'; 

export default function Map() {
  
  const position = [51.83488, 19.77538];

  return (
    
    <div className="h-full w-full z-0">
      <MapContainer 
        center={position} 
        zoom={6} 
        className="h-full w-full"
        zoomControl={false} 
      >
        <TileLayer
          
          
            url="https://api.maptiler.com/maps/basic-v2-dark/{z}/{x}/{y}.png?key=0So7mobgCjFics4kmK7N"
            attribution='&copy; <a href="https://www.maptiler.com/">MapTiler</a>'

        />
        
        
        <Marker position={[51.107885, 17.038538]}> 
          <Popup className="text-gray-900">
            Przykładowe spotkanie w <b>Django</b>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}