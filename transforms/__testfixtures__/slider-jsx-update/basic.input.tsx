import {
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
} from "@chakra-ui/core";

function CustomSlider() {
  return (
    <Slider defaultValue={30}>
      <SliderTrack />
      <SliderFilledTrack height="24px" bg="red.300" />
      <SliderThumb />
    </Slider>
  );
}
