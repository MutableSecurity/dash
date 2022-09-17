import {
    Box,
    FormControl,
    FormHelperText,
    FormLabel,
    Input,
    InputGroup,
    InputLeftElement,
    Radio,
    RadioGroup,
    Slider,
    SliderFilledTrack,
    SliderThumb,
    SliderTrack,
    Stack,
} from '@chakra-ui/react';
import React from 'react';

export function AnnotatedTextInput(props) {
    return (
        <Box flex={props.flex}>
            <FormControl>
                <FormLabel fontWeight={900}>{props.title}</FormLabel>
                <InputGroup>
                    <InputLeftElement
                        pointerEvents="none"
                        children={props.icon}
                    />
                    <Input
                        type="{props.type}"
                        isDisabled
                        value={props.value}
                        placeholder={props.placeholder}
                    />
                </InputGroup>
                <FormHelperText>{props.description}</FormHelperText>
            </FormControl>
        </Box>
    );
}

export function AnnotatedRadioGroup(props) {
    var radioValues = props.radioLabels.map((label, key) => (
        <Radio value={key.toString()} key={key}>
            {label}
        </Radio>
    ));

    var value = props.radioValues.indexOf(props.value).toString();

    return (
        <FormControl>
            <FormLabel fontWeight={900}>{props.title}</FormLabel>
            <RadioGroup
                value={value}
                border="1px"
                borderColor="gray.200"
                borderRadius="base"
                padding={2}
            >
                <Stack direction="row">{radioValues}</Stack>
            </RadioGroup>
            <FormHelperText>{props.description}</FormHelperText>
        </FormControl>
    );
}

export function AnnotatedSlider(props) {
    const notifyChangedValue = function (newValue) {
        props.onChange(newValue);
    };

    return (
        <FormControl>
            <FormLabel fontWeight={900}>{props.title}</FormLabel>
            <Slider
                aria-label="slider-ex-1"
                defaultValue={5}
                min={props.min}
                max={props.max}
                step={props.step}
                onChange={notifyChangedValue}
                w="50%"
                isDisabled
            >
                <SliderTrack>
                    <SliderFilledTrack />
                </SliderTrack>
                <SliderThumb boxSize={10} backgroundColor="white">
                    <Box color="blue" fontWeight={300}>
                        {props.value}
                    </Box>
                </SliderThumb>
            </Slider>
            <FormHelperText>{props.description}</FormHelperText>
        </FormControl>
    );
}
