import React from 'react';
import { View } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';

interface Props {
  data: { label: string; value: number }[];
}

const LineChartComponent = ({ data }: Props) => {
  const chartData = data.map(item => ({
    value: item.value,
    label: item.label,
  }));

  return (
    <View style={{ height: 140 }}>
      <LineChart
        data={chartData}
        thickness={2.5}
        color="#FFD166"
        hideRules
        yAxisTextStyle={{ color: '#8aabb3', fontSize: 10 }}
        xAxisLabelTextStyle={{ color: '#8aabb3', fontSize: 10 }}
        hideYAxisText={false}
        hideDataPoints={false}
        dataPointsColor="#FFD166"
        dataPointsRadius={5}
        focusedDataPointColor="#1F7A63"
        focusedDataPointRadius={7}
        spacing={40}
        initialSpacing={15}
        yAxisThickness={0}
        xAxisThickness={0}
        yAxisLabelWidth={30}
        formatYLabel={(value) => `${value}`}
        maxValue={Math.max(...data.map(d => d.value)) + 200}
        stepValue={500}
        noOfSections={4}
        adjustToWidth
      />
    </View>
  );
};

export default LineChartComponent;