import { MapLayer } from "react-leaflet";
import L from "leaflet";
import "leaflet-routing-machine";
import "leaflet-control-geocoder";
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import { withLeaflet } from "react-leaflet";

class Routing extends MapLayer {
  createLeafletElement() {
    const { map, route } = this.props;
    var formattedRoute= [];
    for (var entry = 0; entry < route.length-1; entry++) {
      if(entry!== 0){
        if(route[entry-1][0]!==route[entry][0] || route[entry-1][1]!==route[entry][1]){
          formattedRoute.push(L.latLng(route[entry][0],route[entry][1]))
        }
      }
      else{
      formattedRoute.push(L.latLng(route[entry][0],route[entry][1]))
      }
    }
    
    let leafletElement = L.Routing.control({
      waypoints: formattedRoute,
      geocoder: L.Control.Geocoder.nominatim()
    }).addTo(map.leafletElement);
    return leafletElement.getPlan();
  }
}
export default withLeaflet(Routing);
