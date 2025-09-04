import {
    ThemeLayer,
    LensLayer,
    ComplementaryLayers,
    SelectedLayers,
} from "../../layers";

const Layers = () => {
    const { layers: themeLayers } = ThemeLayer();
    const { layers: lensLayers } = LensLayer();
    const { layers: complementaryLayers } = ComplementaryLayers();
    const { layers: selectedLayers } = SelectedLayers();

    const layers: any[] = [
        ...themeLayers,
        ...complementaryLayers,
        ...lensLayers,
        ...selectedLayers
    ];

    return { layers };
};

export default Layers;