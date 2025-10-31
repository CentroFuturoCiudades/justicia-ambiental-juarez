import {
    ThemeLayer,
    LensLayer,
    ComplementaryLayers,
    SelectedLayers,
} from "../../layers";
import { TileLayer } from "@deck.gl/geo-layers";
import { BitmapLayer } from "deck.gl";

const Layers = () => {
    const { layers: themeLayers } = ThemeLayer();
    const { layers: lensLayers } = LensLayer();
    const { layers: complementaryLayers } = ComplementaryLayers();
    const { layers: selectedLayers } = SelectedLayers();

    const openStreetMapLayer = new TileLayer({
        //data: "https://c.tile.openstreetmap.org/{z}/{x}/{y}.png",
        data: "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        minZoom: 9,
        maxZoom: 14,
        tileSize: 256,
        renderSubLayers: (props) => {
            const {
            bbox: { west, south, east, north }
            } = props.tile;

            return new BitmapLayer(props, {
            data: null,
            image: props.data,
            bounds: [west, south, east, north]
            });
        }
    });

    const layers: any[] = [
     //   ...[openStreetMapLayer],    //first layer is osm base map
        ...themeLayers,
        ...complementaryLayers,
        ...lensLayers,
        ...selectedLayers
    ];

    return { layers };
};

export default Layers;