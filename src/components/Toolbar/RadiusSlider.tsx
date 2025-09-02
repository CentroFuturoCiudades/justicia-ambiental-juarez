import { useAppContext } from "../../context/AppContext";
import { Slider, SliderControl } from "@chakra-ui/react";

const RadiusSlider = () => {
    const { radius, setRadius } = useAppContext();

    return (
        <div className="slider">
            <Slider.Root 
                className="slider__root"
                value={[radius]} //intial value of 2000
                min={500}
                max={2000}
                step={500}
                onValueChange={details => setRadius(details.value[0])}
            >
                <SliderControl>
                    <Slider.Track className="slider__track" >
                        <Slider.Range className="slider__range" />
                    </Slider.Track>
                    <Slider.Thumbs className="slider__thumb" />
                </SliderControl>
            </Slider.Root>
        </div>
    );
};

export default RadiusSlider;