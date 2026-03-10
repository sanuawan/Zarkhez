import React from 'react';
import { View } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';

interface Props {
  data: { day: string; usage: number }[];
}

const AreaChartComponent = ({ data }: Props) => {
  const chartData = data.map(item => ({
    value: item.usage,
    label: item.day,
  }));

  return (
    <View style={{ height: 160 }}>
      <LineChart
        data={chartData}
        areaChart
        curved
        startFillColor="#1F7A63"
        startOpacity={0.3}
        endFillColor="#1F7A63"
        endOpacity={0}
        thickness={2.5}
        color="#1F7A63"
        hideRules
        yAxisTextStyle={{ color: '#8aabb3', fontSize: 10 }}
        xAxisLabelTextStyle={{ color: '#8aabb3', fontSize: 10 }}
        hideYAxisText={false}
        hideDataPoints={false}
        dataPointsColor="#1F7A63"
        dataPointsRadius={3}
        focusedDataPointColor="#FFD166"
        focusedDataPointRadius={5}
        spacing={40}
        initialSpacing={10}
        endSpacing={10}
        yAxisThickness={0}
        xAxisThickness={0}
        yAxisLabelWidth={30}
        formatYLabel={(value) => `${value}`}
        adjustToWidth
      />
    </View>
  );
};

export default AreaChartComponent;