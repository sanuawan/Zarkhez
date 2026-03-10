import React from 'react';
import { View } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';

interface Props {
  data: { label: string; value: number }[];
  color?: string;
  gradient?: boolean;
}

const BarChartComponent = ({ data, color = '#6ED3B5', gradient = true }: Props) => {
  const chartData = data.map(item => ({
    value: item.value,
    label: item.label,
    frontColor: color,
    gradientColor: gradient ? '#1F7A63' : undefined,
  }));

  return (
    <View style={{ height: 150 }}>
      <BarChart
        data={chartData}
        barWidth={28}
        spacing={20}
        initialSpacing={15}
        yAxisThickness={0}
        xAxisThickness={0}
        hideRules
        yAxisTextStyle={{ color: '#8aabb3', fontSize: 10 }}
        xAxisLabelTextStyle={{ color: '#8aabb3', fontSize: 10 }}
        yAxisLabelWidth={30}
        formatYLabel={(value) => `${value}`}
        barBorderRadius={6}
        showGradient={gradient}
        gradientColor="#1F7A63"
        noOfSections={4}
        stepValue={10}
        maxValue={Math.max(...data.map(d => d.value)) + 10}
      />
    </View>
  );
};

export default BarChartComponent;