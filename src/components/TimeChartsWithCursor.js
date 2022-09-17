import { Box, Text } from '@chakra-ui/react';
import React, { useState } from 'react';
import {
    VictoryArea,
    VictoryAxis,
    VictoryChart,
    VictoryGroup,
    VictoryLegend,
    VictoryLine,
    VictoryPortal,
    VictoryStack,
    VictoryTheme,
    VictoryTooltip,
    VictoryVoronoiContainer,
} from 'victory';

import { convertUTCSecondsToFormattedDate } from '../utilities/date';

class TimeValuePair {
    constructor(timestamp = -1, value = NaN) {
        this.timestamp = timestamp;
        this.value = value;
    }
}

const translateTimestampValuesToVictoryProps = (timestamps, values) => {
    return timestamps.map(function (timestamp, i) {
        return { x: timestamp, y: values[i] };
    });
};

const NofifyingVerticalCursor = ({
    x,
    y,
    datum,
    dx,
    dy,
    setTimeValueUnderCursorMethod,
}) => {
    setTimeValueUnderCursorMethod(new TimeValuePair(datum.x, datum.y));

    return (
        <g>
            <rect
                x={x}
                y={15}
                width="0.3"
                dx={dx}
                dy={dy + 20}
                height="70"
                fill="var(--chakra-colors-blue-500)"
                strokeWidth={0}
            />
        </g>
    );
};

export function ChartTitle(props) {
    return props.title ? (
        <Text
            size="md"
            color={'var(--chakra-colors-white)'}
            backgroundColor={'var(--chakra-colors-blue-500)'}
            padding={2}
            width="max-content"
        >
            Chart:{' '}
            <Text display={'inline'} fontWeight={900}>
                {props.title}
            </Text>
        </Text>
    ) : (
        ''
    );
}

export function TimeLineChartWithCursor(props) {
    const [cursorTimeValuePair, setCursorTimeValuePair] = useState(
        new TimeValuePair()
    );

    const valuePreffix = props.valuePreffix ? props.valuePreffix : '';

    return (
        <Box>
            <ChartTitle title={props.title} />
            <VictoryChart
                theme={VictoryTheme.grayscale}
                domain={{ y: props.yDomain }}
                height={100}
                padding={{ top: 20, bottom: 20, left: 35, right: 10 }}
                scale={{ x: 'time' }}
                containerComponent={
                    <VictoryVoronoiContainer
                        labels={() => ' '}
                        labelComponent={
                            <VictoryTooltip
                                style={{
                                    fontSize: 4,
                                }}
                                flyoutComponent={
                                    <NofifyingVerticalCursor
                                        setTimeValueUnderCursorMethod={
                                            setCursorTimeValuePair
                                        }
                                    />
                                }
                            />
                        }
                    />
                }
                style={{ parent: { cursor: 'col-resize' } }}
            >
                <VictoryAxis style={{ tickLabels: { fontSize: 6 } }} />
                <VictoryAxis
                    dependentAxis
                    orientation="left"
                    style={{ tickLabels: { fontSize: 6 } }}
                    tickFormat={t => `${t}${valuePreffix}`}
                />

                <VictoryLine
                    data={translateTimestampValuesToVictoryProps(
                        props.timestamps,
                        props.values
                    )}
                    style={{
                        data: {
                            stroke: 'var(--chakra-colors-blue-500)',
                            strokeWidth: 1,
                        },
                    }}
                />
            </VictoryChart>

            <Box
                marginTop={4}
                opacity={cursorTimeValuePair.timestamp === -1 ? 0 : 1}
            >
                <Text>
                    <Text as="b" fontWeight={900}>
                        Date at Cursor:
                    </Text>{' '}
                    {convertUTCSecondsToFormattedDate(
                        cursorTimeValuePair.timestamp
                    )}
                </Text>
                <Text>
                    <Text as="b" fontWeight={900}>
                        {props.yLabel} at Cursor:
                    </Text>{' '}
                    {cursorTimeValuePair.value}
                    {valuePreffix}
                </Text>
            </Box>
        </Box>
    );
}

export function TimeStackedChartWithCursor(props) {
    return (
        <Box>
            <ChartTitle title={props.title} />
            <VictoryChart
                padding={{ top: 30, bottom: 20, left: 35, right: 10 }}
                height={150}
                scale={{ x: 'time' }}
            >
                <VictoryLegend
                    x={50}
                    y={10}
                    orientation="horizontal"
                    symbolSpacer={5}
                    gutter={20}
                    style={{
                        labels: { fontSize: 6 },
                    }}
                    data={[
                        {
                            name: props.upperValuesLabel,
                            symbol: { fill: 'var(--chakra-colors-red-500)' },
                        },
                        {
                            name: props.bottomValuesLabel,
                            symbol: { fill: 'var(--chakra-colors-green-500)' },
                        },
                    ]}
                />

                <VictoryAxis
                    style={{
                        tickLabels: { fontSize: 6 },
                    }}
                />
                <VictoryAxis
                    dependentAxis
                    orientation="left"
                    style={{
                        tickLabels: { fontSize: 6 },
                    }}
                />

                <VictoryStack
                    colorScale={[
                        'var(--chakra-colors-red-500)',
                        'var(--chakra-colors-green-500)',
                    ]}
                    style={{
                        data: { strokeWidth: 0 },
                    }}
                >
                    <VictoryGroup
                        data={translateTimestampValuesToVictoryProps(
                            props.timestamps,
                            props.upperValues
                        )}
                    >
                        <VictoryArea />
                        <VictoryPortal>
                            <VictoryLine />
                        </VictoryPortal>
                    </VictoryGroup>
                    <VictoryGroup
                        data={translateTimestampValuesToVictoryProps(
                            props.timestamps,
                            props.bottomValues
                        )}
                    >
                        <VictoryArea />
                        <VictoryPortal>
                            <VictoryLine />
                        </VictoryPortal>
                    </VictoryGroup>
                </VictoryStack>
            </VictoryChart>
        </Box>
    );
}
