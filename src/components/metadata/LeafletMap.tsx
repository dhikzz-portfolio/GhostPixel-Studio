import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './LeafletMap.css';
import L from 'leaflet';

const icon = L.divIcon({ className: 'gps-marker', html: '<span>●</span>', iconSize: [22, 22], iconAnchor: [11, 11] });

export function LeafletMap({ latitude, longitude }: { latitude: number; longitude: number }) {
  return <div className="leaflet-shell"><MapContainer center={[latitude, longitude]} zoom={13} scrollWheelZoom className="leaflet-map"><TileLayer attribution="&copy; OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/><Marker position={[latitude, longitude]} icon={icon}><Popup><b>Image GPS location</b><br />{latitude.toFixed(6)}, {longitude.toFixed(6)}</Popup></Marker></MapContainer><small>Map tiles are external network requests and may reveal the displayed location to the tile provider. Image data and metadata are not uploaded.</small></div>;
}
