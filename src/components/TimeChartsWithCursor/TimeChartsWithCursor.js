import { Box, Heading } from '@chakra-ui/react';
import React from 'react';
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

import { convertUTCSecondsToFormattedDate } from '../../utilities/date';

const translateValuesToTimeseries = (timestamps, values) => {
    return timestamps.map(function (timestamp, i) {
        return { x: timestamp, y: values[i] };
    });
};

const RulerCursor = ({ yLabel, valuePreffix, x, y, datum, dx, dy }) => (
    <g>
        <rect
            x={x}
            y={25}
            width="0.3"
            dx={dx}
            dy={dy + 20}
            height="60"
            fill="var(--chakra-colors-blue-500)"
            strokeWidth={0}
        />
        <text x={x + 3} y={y - 25} fontSize="5">
            {`Date: ${convertUTCSecondsToFormattedDate(datum.x)}`}
        </text>
        <text x={x + 3} y={y - 15} fontSize="5">
            {`${yLabel}: ${datum.y}${valuePreffix}`}
        </text>
    </g>
);

export function TimeLineChartWithCursor(props) {
    const valuePreffix = props.valuePreffix ? props.valuePreffix : '';

    return (
        <Box>
            {props.title ? (
                <Heading as="h3" size="md">
                    {props.title}
                </Heading>
            ) : (
                ''
            )}

            <VictoryChart
                theme={VictoryTheme.grayscale}
                domain={{ y: props.yDomain }}
                height={100}
                padding={{ top: 40, bottom: 20, left: 35, right: 10 }}
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
                                    <RulerCursor
                                        yLabel={props.yLabel}
                                        valuePreffix={valuePreffix}
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
                    data={translateValuesToTimeseries(
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
        </Box>
    );
}

export function TimeStackedChartWithCursor(props) {
    return (
        <Box>
            <Heading as="h3" size="md">
                {props.title}
            </Heading>
            <VictoryChart height={150} scale={{ x: 'time' }}>
                <VictoryLegend
                    x={50}
                    y={30}
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
                        data={translateValuesToTimeseries(
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
                        data={translateValuesToTimeseries(
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
