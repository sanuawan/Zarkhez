// src/screens/ScheduleScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  BackHandler,
  Platform,
  Alert,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import LinearGradient from 'react-native-linear-gradient';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import Header from '../components/Header';
import BottomNavBar from '../components/BottomNavBar';
import { styles } from './styles/ScheduleScreen.styles';

const { width } = Dimensions.get('window');

// Days and months data
const daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const ScheduleScreen: React.FC = () => {
  const { t, language } = useLanguage();
  const { isDark } = useTheme();
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('schedule');

  // Time States
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  // Custom Dates Selection States
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [showCalendar, setShowCalendar] = useState(false);

  // Schedule Type
  const [scheduleType, setScheduleType] = useState<'today' | 'daily' | 'custom'>('today');

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        navigation.navigate('Home' as never);
        return true;
        
      }
    );

    return () => backHandler.remove();
  }, [navigation]);

  const handleTabPress = (tab: string) => {
    setActiveTab(tab);
    if (tab === 'home') navigation.navigate('Home' as never);
    if (tab === 'soil') navigation.navigate('CropSoil' as never);
    if (tab === 'billing') navigation.navigate('Billing' as never);
    if (tab === 'alerts') navigation.navigate('Alerts' as never);
  };

  const onStartTimeChange = (event: any, time?: Date) => {
    setShowStartPicker(false);
    if (time) {
      setStartTime(time);
      // Auto set end time 1 hour after
      const newEndTime = new Date(time);
      newEndTime.setHours(newEndTime.getHours() + 1);
      setEndTime(newEndTime);
    }
  };

  const onEndTimeChange = (event: any, time?: Date) => {
    setShowEndPicker(false);
    if (time) setEndTime(time);
  };

  const formatTime = (date: Date) => {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
    return `${hours}:${formattedMinutes} ${ampm}`;
  };

  const formatTimeCompact = (date: Date) => {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
    return `${hours}:${formattedMinutes}`;
  };

  const calculateDuration = () => {
    const diffMs = endTime.getTime() - startTime.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    if (language === 'ur') {
      if (diffHours > 0 && diffMinutes > 0) {
        return `${diffHours} گھنٹے ${diffMinutes} منٹ`;
      } else if (diffHours > 0) {
        return `${diffHours} گھنٹے`;
      } else {
        return `${diffMinutes} منٹ`;
      }
    } else {
      if (diffHours > 0 && diffMinutes > 0) {
        return `${diffHours}h ${diffMinutes}m`;
      } else if (diffHours > 0) {
        return `${diffHours}h`;
      } else {
        return `${diffMinutes}m`;
      }
    }
  };

  // Calendar Functions
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();

    const days = [];

    // Add empty cells for days before the first day of month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  };

  const isDateSelected = (date: Date) => {
    return selectedDates.some(selectedDate =>
      selectedDate.getDate() === date.getDate() &&
      selectedDate.getMonth() === date.getMonth() &&
      selectedDate.getFullYear() === date.getFullYear()
    );
  };

  const toggleDateSelection = (date: Date) => {
    if (isDateSelected(date)) {
      setSelectedDates(selectedDates.filter(d =>
        !(d.getDate() === date.getDate() &&
          d.getMonth() === date.getMonth() &&
          d.getFullYear() === date.getFullYear())
      ));
    } else {
      setSelectedDates([...selectedDates, date]);
    }
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newMonth = new Date(currentMonth);
    if (direction === 'prev') {
      newMonth.setMonth(newMonth.getMonth() - 1);
    } else {
      newMonth.setMonth(newMonth.getMonth() + 1);
    }
    setCurrentMonth(newMonth);
  };

  const formatMonthYear = (date: Date) => {
    if (language === 'ur') {
      const year = date.getFullYear();
      const monthIndex = date.getMonth();
      const urduMonths = [
        'جنوری', 'فروری', 'مارچ', 'اپریل', 'مئی', 'جون',
        'جولائی', 'اگست', 'ستمبر', 'اکتوبر', 'نومبر', 'دسمبر'
      ];
      return `${urduMonths[monthIndex]} ${year}`;
    }
    return `${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  const handleSaveSchedule = () => {
    // Check if end time is after start time
    if (endTime <= startTime) {
      Alert.alert(
        language === 'ur' ? 'غلط وقت' : 'Invalid Time',
        language === 'ur'
          ? 'اختتامی وقت شروع کے وقت کے بعد ہونا چاہیے۔'
          : 'End time must be after start time.',
        [{ text: language === 'ur' ? 'ٹھیک ہے' : 'OK' }]
      );
      return;
    }

    // Check for custom dates
    if (scheduleType === 'custom' && selectedDates.length === 0) {
      Alert.alert(
        language === 'ur' ? 'تاریخ منتخب کریں' : 'Select Dates',
        language === 'ur'
          ? 'براہ کرم کم از کم ایک تاریخ منتخب کریں۔'
          : 'Please select at least one date.',
        [{ text: language === 'ur' ? 'ٹھیک ہے' : 'OK' }]
      );
      return;
    }

    const scheduleInfo = getScheduleInfo();

    Alert.alert(
      language === 'ur' ? 'شیڈول محفوظ ہو گیا' : 'Schedule Saved',
      scheduleInfo,
      [{
        text: language === 'ur' ? 'ٹھیک ہے' : 'OK',
        onPress: () => console.log('Schedule Saved')
      }]
    );
  };

  const getScheduleInfo = () => {
    const start = formatTime(startTime);
    const end = formatTime(endTime);
    const duration = calculateDuration();

    if (scheduleType === 'today') {
      if (language === 'ur') {
        return `آج کا شیڈول\n${start} سے ${end} تک\nمدت: ${duration}`;
      }
      return `Today's Schedule\n${start} to ${end}\nDuration: ${duration}`;
    }
    else if (scheduleType === 'daily') {
      if (language === 'ur') {
        return `روزانہ شیڈول\n${start} سے ${end} تک\nمدت: ${duration}`;
      }
      return `Daily Schedule\n${start} to ${end}\nDuration: ${duration}`;
    }
    else {
      if (language === 'ur') {
        return `کسٹم شیڈول\n${start} سے ${end} تک\nمدت: ${duration}\nمنتخب تاریخیں: ${selectedDates.length}`;
      }
      return `Custom Schedule\n${start} to ${end}\nDuration: ${duration}\nSelected Dates: ${selectedDates.length}`;
    }
  };

  const getScheduleTypeText = (type: 'today' | 'daily' | 'custom') => {
    switch (type) {
      case 'today':
        return language === 'ur' ? 'آج' : 'Today';
      case 'daily':
        return language === 'ur' ? 'روزانہ' : 'Every day';
      case 'custom':
        return language === 'ur' ? 'کسٹم' : 'Custom';
      default:
        return '';
    }
  };

  const days = getDaysInMonth(currentMonth);

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      <Header showLogout={false} />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Title with Icon */}
        <View style={styles.titleContainer}>
          <View style={styles.titleIcon}>
            <Text style={styles.titleIconText}>⏰</Text>
          </View>
          <Text style={[styles.title, isDark && styles.titleDark]}>
            {t('schedule.waterSchedule')}
          </Text>
        </View>

        {/* Time Display Banner */}
        <View style={[styles.timeBannerCard, isDark && styles.timeBannerCardDark]}>
          <LinearGradient
            colors={isDark ? ['#1e40af', '#3730a3'] : ['#3b82f6', '#2563eb']}
            style={styles.timeBannerGradient}
          >
            <Text style={styles.timeBannerTitle}>
              {language === 'ur' ? 'پانی کا وقت' : 'Water Time'}
            </Text>
            <View style={styles.timeBannerTimes}>
              <View style={styles.timeBannerItem}>
                <Text style={styles.timeBannerLabel}>
                  {language === 'ur' ? 'شروع' : 'Start'}
                </Text>
                <TouchableOpacity onPress={() => setShowStartPicker(true)}>
                  <Text style={styles.timeBannerValue}>
                    {formatTimeCompact(startTime)}
                  </Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.timeBannerSeparator}>—</Text>

              <View style={styles.timeBannerItem}>
                <Text style={styles.timeBannerLabel}>
                  {language === 'ur' ? 'اختتام' : 'End'}
                </Text>
                <TouchableOpacity onPress={() => setShowEndPicker(true)}>
                  <Text style={styles.timeBannerValue}>
                    {formatTimeCompact(endTime)}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <Text style={styles.timeBannerDuration}>
              ⏱️ {calculateDuration()}
            </Text>
          </LinearGradient>
        </View>

        {/* Schedule Type Selection */}
        <View style={[styles.card, isDark && styles.cardDark]}>
          <Text style={[styles.sectionTitle, isDark && styles.sectionTitleDark]}>
            🔁 {language === 'ur' ? 'دہرائیں' : 'Repeat'}
          </Text>

          <View style={styles.scheduleTypeContainer}>
            {/* Today Button */}
            <TouchableOpacity
              style={[
                styles.scheduleTypeButton,
                scheduleType === 'today' && [styles.scheduleTypeButtonActive, isDark && styles.scheduleTypeButtonActiveDark]
              ]}
              onPress={() => {
                setScheduleType('today');
                setShowCalendar(false);
              }}
            >
              <Text style={styles.scheduleTypeButtonIcon}>🎯</Text> 
              <Text style={[
                styles.scheduleTypeButtonText,
                isDark && styles.scheduleTypeButtonTextDark,
                scheduleType === 'today' && styles.scheduleTypeButtonTextActive
              ]}>
                {language === 'ur' ? 'آج' : 'Today'}
              </Text>
            </TouchableOpacity>

            {/* Daily */}
            <TouchableOpacity
              style={[
                styles.scheduleTypeButton,
                scheduleType === 'daily' && [styles.scheduleTypeButtonActive, isDark && styles.scheduleTypeButtonActiveDark]
              ]}
              onPress={() => {
                setScheduleType('daily');
                setShowCalendar(false);
              }}
            >
              <Text style={styles.scheduleTypeButtonIcon}>🔄</Text>
              <Text style={[
                styles.scheduleTypeButtonText,
                isDark && styles.scheduleTypeButtonTextDark,
                scheduleType === 'daily' && styles.scheduleTypeButtonTextActive
              ]}>
                {language === 'ur' ? 'روزانہ' : 'Every day'}
              </Text>
            </TouchableOpacity>

            {/* Custom */}
            <TouchableOpacity
              style={[
                styles.scheduleTypeButton,
                scheduleType === 'custom' && [styles.scheduleTypeButtonActive, isDark && styles.scheduleTypeButtonActiveDark]
              ]}
              onPress={() => {
                setScheduleType('custom');
                setShowCalendar(true);
              }}
            >
              <Text style={styles.scheduleTypeButtonIcon}>📅</Text>
              <Text style={[
                styles.scheduleTypeButtonText,
                isDark && styles.scheduleTypeButtonTextDark,
                scheduleType === 'custom' && styles.scheduleTypeButtonTextActive
              ]}>
                {language === 'ur' ? 'کسٹم' : 'Custom'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Calendar for Custom Dates */}
        {scheduleType === 'custom' && showCalendar && (
          <View style={[styles.calendarCard, isDark && styles.calendarCardDark]}>
            <View style={styles.calendarHeader}>
              <TouchableOpacity onPress={() => navigateMonth('prev')}>
                <Text style={[styles.calendarNavButton, isDark && styles.calendarNavButtonDark]}>&lt;</Text>
              </TouchableOpacity>

              <Text style={[styles.calendarMonth, isDark && styles.calendarMonthDark]}>
                {formatMonthYear(currentMonth)}
              </Text>

              <TouchableOpacity onPress={() => navigateMonth('next')}>
                <Text style={[styles.calendarNavButton, isDark && styles.calendarNavButtonDark]}>&gt;</Text>
              </TouchableOpacity>
            </View>

            {/* Days of Week */}
            <View style={styles.daysOfWeek}>
              {daysOfWeek.map((day, index) => (
                <Text key={index} style={[styles.dayOfWeek, isDark && styles.dayOfWeekDark]}>
                  {day}
                </Text>
              ))}
            </View>

            {/* Calendar Grid */}
            <View style={styles.calendarGrid}>
              {days.map((date, index) => (
                <View key={index} style={styles.calendarCell}>
                  {date ? (
                    <TouchableOpacity
                      style={[
                        styles.dateButton,
                        isDateSelected(date) && styles.dateButtonSelected
                      ]}
                      onPress={() => toggleDateSelection(date)}
                      disabled={date < new Date(new Date().setHours(0, 0, 0, 0))}
                    >
                      <Text style={[
                        styles.dateText,
                        isDark && styles.dateTextDark,
                        isDateSelected(date) && styles.dateTextSelected,
                        date.getDay() === 0 && styles.sundayText,
                        date < new Date(new Date().setHours(0, 0, 0, 0)) && styles.pastDate
                      ]}>
                        {date.getDate()}
                      </Text>
                      {isDateSelected(date) && (
                        <View style={styles.dateSelectedIndicator} />
                      )}
                    </TouchableOpacity>
                  ) : (
                    <View style={styles.emptyCell} />
                  )}
                </View>
              ))}
            </View>

            {/* Selected Dates Count */}
            {selectedDates.length > 0 && (
              <Text style={[styles.selectedDatesCount, isDark && styles.selectedDatesCountDark]}>
                {language === 'ur'
                  ? `منتخب تاریخیں: ${selectedDates.length}`
                  : `Selected dates: ${selectedDates.length}`}
              </Text>
            )}
          </View>
        )}

        {/* Save Button */}
        <TouchableOpacity
          style={[styles.saveButton, isDark && styles.saveButtonDark]}
          onPress={handleSaveSchedule}
        >
          <LinearGradient
            colors={isDark ? ['#059669', '#047857'] : ['#10b981', '#059669']}
            style={styles.saveButtonGradient}
          >
            <Text style={styles.saveButtonIcon}>💾</Text>
            <Text style={styles.saveButtonText}>
              {t('schedule.saveSchedule')}
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Time Pickers */}
        {showStartPicker && (
          <DateTimePicker
            value={startTime}
            mode="time"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={onStartTimeChange}
            style={styles.timePicker}
            themeVariant={isDark ? 'dark' : 'light'}
          />
        )}

        {showEndPicker && (
          <DateTimePicker
            value={endTime}
            mode="time"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={onEndTimeChange}
            style={styles.timePicker}
            themeVariant={isDark ? 'dark' : 'light'}
          />
        )}
      </ScrollView>

      <BottomNavBar activeTab={activeTab} onTabPress={handleTabPress} />
    </View>
  );
};

export default ScheduleScreen;