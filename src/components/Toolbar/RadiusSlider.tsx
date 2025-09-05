import { useAppContext } from "../../context/AppContext";
import { Slider, SliderControl } from "@chakra-ui/react";

const marks = [
    { value: 500, label: "500m" },
    { value: 1000, label: "1km" },
    { value: 1500, label: "1.5km" },
    { value: 2000, label: "2km" },
];


const marks2 = [
  { value: 0, label: "0%" },
  { value: 50, label: "50%" },
  { value: 100, label: "100%" },
]

const RadiusSlider = () => {
    const { radius, setRadius, setFlagSlider } = useAppContext();

    //check styles
    return (
        <div className="slider"> 
            <Slider.Root
                value={[radius]} //intial value of 1000
                min={500}
                max={2000}
                step={500}
                onValueChange={e => setRadius(e.value[0])}   
                onValueChangeEnd={() => setFlagSlider(true)}
                defaultValue={[40]}
                width="12dvw"
            >
              <Slider.Control>
                <Slider.Track>
                  <Slider.Range />
                </Slider.Track>
                <Slider.Thumbs />
                <Slider.Marks marks={marks} />
              </Slider.Control>
            </Slider.Root>
        </div>
    );
};

export default RadiusSlider;