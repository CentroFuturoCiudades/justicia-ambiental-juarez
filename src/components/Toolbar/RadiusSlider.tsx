import { useAppContext } from "../../context/AppContext";
import { Slider } from "@chakra-ui/react";

const marks = [
    { value: 500, label: "500m" },
    { value: 1000, label: "1km" },
    { value: 1500, label: "1.5km" },
    { value: 2000, label: "2km" },
];

const RadiusSlider = () => {
  const { radius, setRadius, setFlagSlider } = useAppContext();
  const min = 500;
  const max = 2000;
  const step = 500;

  //check styles
  return (
      <div className="slider"> 
          <Slider.Root
              value={[radius]} //intial value of 2000
              min={min}
              max={max}
              step={step}
              onValueChange={e => setRadius(e.value[0])}   
              onValueChangeEnd={() => setFlagSlider(true)}
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