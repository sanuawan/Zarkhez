import React from 'react';
import { View, Text } from 'react-native';
import { styles } from '../screens/styles/UserDetailScreen.styles';
interface Props {
  session: {
    date: string;
    start: string;
    stop: string;
    duration: string;
    bill: number;
  };
}

const TimelineItem = ({ session }: Props) => {
  return (
    <View style={styles.timelineItem}>
      <View style={styles.timelineDot}>
        <Text style={styles.clockIcon}>⏱️</Text>
      </View>
      <View style={styles.timelineCard}>
        <View style={styles.cardHeader}>
          <View style={styles.dateBadge}>
            <Text style={styles.dateText}>{session.date}</Text>
          </View>
          <Text style={styles.billAmount}>Rs {session.bill}</Text>
        </View>
        <View style={styles.timeRow}>
          <View style={styles.timeBlock}>
            <Text style={styles.timeLabel}>Start</Text>
            <Text style={styles.timeValue}>{session.start}</Text>
          </View>
          <View style={styles.timeSeparator} />
          <View style={styles.timeBlock}>
            <Text style={styles.timeLabel}>Stop</Text>
            <Text style={styles.timeValue}>{session.stop}</Text>
          </View>
          <View style={styles.durationBadge}>
            <Text style={styles.durationIcon}>⚡</Text>
            <Text style={styles.durationText}>{session.duration}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default TimelineItem;