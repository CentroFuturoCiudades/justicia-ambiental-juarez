import {
    ThemeLayer,
    LensLayer,
    ComplementaryLayers,
    DissolvedLayer
} from "../../layers";

const Layers = () => {
    const { layers: themeLayers } = ThemeLayer();
    const { layers: lensLayers } = LensLayer();
    const { layers: complementaryLayers } = ComplementaryLayers();
    const { layers: dissolvedLayers } = DissolvedLayer();

    const layers: any[] = [
        ...themeLayers,
        ...complementaryLayers,
        ...lensLayers,
        ...dissolvedLayers
    ];

    return { layers };
};

export default Layers;