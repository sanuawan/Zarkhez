import React, { useState, useEffect, useRef } from 'react';
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
  ActivityIndicator,
  Linking,
  TextInput,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import LinearGradient from 'react-native-linear-gradient';
import firestore from '@react-native-firebase/firestore';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { useUser } from '../contexts/UserContext';
import Header from '../components/Header';
import BottomNavBar from '../components/BottomNavBar';
import { styles } from './styles/ScheduleScreen.styles';

const { width } = Dimensions.get('window');

const daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const fullDayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const fullDayNamesUrdu = ['پیر', 'منگل', 'بدھ', 'جمعرات', 'جمعہ', 'ہفتہ', 'اتوار'];

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];
const urduMonths = [
  'جنوری', 'فروری', 'مارچ', 'اپریل', 'مئی', 'جون',
  'جولائی', 'اگست', 'ستمبر', 'اکتوبر', 'نومبر', 'دسمبر'
];

interface ScheduleDocument {
  id: string;
  activeUser: string;
  assignedTo: string;
  repeatType: 'today' | 'weekly' | 'custom';
  daysOfWeek?: number[]; // 0=Monday, 6=Sunday
  scheduleDate?: any;
  startTime: any;
  endTime: any;
  startMinutes: number;
  endMinutes: number;
  status: 'pending' | 'running' | 'completed' | 'cancelled';
  cancelReason?: string;
  createdAt: any;
  updatedAt?: any;
}

const ScheduleScreen: React.FC = () => {
  const { t, language } = useLanguage();
  const { isDark } = useTheme();
  const { user } = useUser();
  const navigation = useNavigation();
  const scrollViewRef = useRef<ScrollView>(null);
  const nameInputRef = useRef<View>(null);

  const [activeTab, setActiveTab] = useState('schedule');
  const [schedules, setSchedules] = useState<ScheduleDocument[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [listenerError, setListenerError] = useState<string | null>(null);

  const [filterStatus, setFilterStatus] = useState<string>('all');

  const [assignedTo, setAssignedTo] = useState('');

  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const [scheduleType, setScheduleType] = useState<'today' | 'weekly' | 'custom'>('today');

  const [selectedDays, setSelectedDays] = useState<number[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [showCalendar, setShowCalendar] = useState(false);

  // ========== COUNTDOWN STATE ==========
  const [topScheduleId, setTopScheduleId] = useState<string | null>(null);
  const [countdownText, setCountdownText] = useState<string>('');

  // ========== HELPER FUNCTIONS ==========
  const getMinutesFromMidnight = (date: Date): number => {
    return date.getHours() * 60 + date.getMinutes();
  };

  const getMidnightDate = (date: Date): Date => {
    const midnight = new Date(date);
    midnight.setHours(0, 0, 0, 0);
    return midnight;
  };

  const formatDaysOfWeek = (days: number[]): string => {
    const names = language === 'ur' ? fullDayNamesUrdu : fullDayNames;
    return days.map(d => names[d]).join(', ');
  };

  // ========== GET EFFECTIVE NEXT RUN TIME FOR WEEKLY ==========
  const getNextRunTimeForWeekly = (schedule: ScheduleDocument): Date | null => {
    if (!schedule.daysOfWeek || schedule.daysOfWeek.length === 0) return null;
    const now = new Date();
    const currentDay = (now.getDay() + 6) % 7; // Monday=0
    const currentMinutes = getMinutesFromMidnight(now);
    const startMin = schedule.startMinutes;
    const days = schedule.daysOfWeek;

    // Check if today is in days and time is after now
    if (days.includes(currentDay) && startMin >= currentMinutes) {
      // today, later
      const next = new Date(now);
      next.setHours(0, 0, 0, 0);
      next.setMinutes(startMin);
      return next;
    } else {
      // find next day after today
      let nextDay = null;
      for (let i = 1; i <= 7; i++) {
        const candidate = (currentDay + i) % 7;
        if (days.includes(candidate)) {
          nextDay = candidate;
          break;
        }
      }
      if (nextDay === null) return null;
      const next = new Date(now);
      next.setDate(now.getDate() + ((nextDay + 7 - currentDay) % 7));
      next.setHours(0, 0, 0, 0);
      next.setMinutes(startMin);
      return next;
    }
  };

  // ========== GET EFFECTIVE START TIME FOR SORTING ==========
  const getEffectiveStartTime = (schedule: ScheduleDocument): Date | null => {
    // Only ignore completed for non-weekly schedules
    if (
      schedule.status === 'cancelled' ||
      (schedule.status === 'completed' && schedule.repeatType !== 'weekly')
    ) {
      return null;
    }
    if (schedule.repeatType === 'weekly') {
      return getNextRunTimeForWeekly(schedule);
    } else {
      // today or custom
      return schedule.startTime.toDate();
    }
  };

  // ========== FIREBASE LISTENER ==========
  useEffect(() => {
    if (!user?.name) {
      setIsFetching(false);
      return;
    }

    const subscriber = firestore()
      .collection('schedules')
      .where('activeUser', '==', user.name)
      .onSnapshot(
        snapshot => {
          const scheduleList: ScheduleDocument[] = [];
          snapshot.forEach(doc => {
            scheduleList.push({
              id: doc.id,
              ...doc.data()
            } as ScheduleDocument);
          });
          setSchedules(scheduleList);
          setIsFetching(false);
          setListenerError(null);
        },
        error => {
          console.error('Firestore snapshot error:', error);
          setListenerError(error.message);
          setIsFetching(false);
          // @ts-ignore
          if (error.code === 'failed-precondition') {
            const match = error.message.match(/(https:\/\/console\.firebase\.google\.com[^\s]+)/);
            if (match) {
              Alert.alert(
                language === 'ur' ? 'انڈیکس درکار ہے' : 'Index Required',
                language === 'ur'
                  ? 'ڈیٹا بیس کو انڈیکس کی ضرورت ہے۔ نیچے دیے گئے لنک پر کلک کریں اور انڈیکس بنا دیں۔'
                  : 'Database requires an index. Click the link below to create it.',
                [
                  { text: language === 'ur' ? 'منسوخ' : 'Cancel', style: 'cancel' },
                  {
                    text: language === 'ur' ? 'انڈیکس بنائیں' : 'Create Index',
                    onPress: () => Linking.openURL(match[0]),
                  },
                ]
              );
            } else {
              Alert.alert(
                language === 'ur' ? 'غلطی' : 'Error',
                language === 'ur' ? 'ڈیٹا لوڈ کرنے میں مسئلہ' : 'Error loading data'
              );
            }
          } else {
            Alert.alert(
              language === 'ur' ? 'غلطی' : 'Error',
              language === 'ur' ? 'شیڈول لوڈ کرنے میں مسئلہ' : 'Error loading schedules'
            );
          }
        }
      );

    return () => subscriber();
  }, [user?.name, language]);

  // ========== BACK HANDLER ==========
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      navigation.navigate('Home' as never);
      return true;
    });
    return () => backHandler.remove();
  }, [navigation]);

  const handleTabPress = (tab: string) => {
    setActiveTab(tab);
    if (tab === 'home') navigation.navigate('Home' as never);
    if (tab === 'soil') navigation.navigate('CropSoil' as never);
    if (tab === 'billing') navigation.navigate('Billing' as never);
    if (tab === 'alerts') navigation.navigate('Alerts' as never);
  };

  // ========== TIME PICKERS ==========
  const onStartTimeChange = (event: any, time?: Date) => {
    setShowStartPicker(false);
    if (time) {
      setStartTime(time);
      const newEndTime = new Date(time);
      newEndTime.setHours(newEndTime.getHours() + 1);
      setEndTime(newEndTime);
    }
  };

  const onEndTimeChange = (event: any, time?: Date) => {
    setShowEndPicker(false);
    if (time) setEndTime(time);
  };

  // ========== REFRESH CURRENT TIME ==========
  const refreshCurrentTime = () => {
    const now = new Date();
    setStartTime(now);
    const newEnd = new Date(now);
    newEnd.setHours(newEnd.getHours() + 1);
    setEndTime(newEnd);
  };

  // ========== FORMATTING ==========
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

  const formatFirestoreTime = (timestamp: any) => {
    if (!timestamp) return '';
    return formatTime(timestamp.toDate());
  };

  const formatFirestoreDate = (timestamp: any) => {
    if (!timestamp) return '';
    const date = timestamp.toDate();
    return date.toLocaleDateString(language === 'ur' ? 'ur-PK' : 'en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatDateOnly = (date: Date) => {
    return date.toLocaleDateString(language === 'ur' ? 'ur-PK' : 'en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const calculateDuration = () => {
    const startMin = getMinutesFromMidnight(startTime);
    const endMin = getMinutesFromMidnight(endTime);

    let diffMinutes;
    if (endMin >= startMin) {
      diffMinutes = endMin - startMin;
    } else {
      diffMinutes = 1440 - startMin + endMin;
    }

    const diffHours = Math.floor(diffMinutes / 60);
    const diffMins = diffMinutes % 60;

    if (language === 'ur') {
      if (diffHours > 0 && diffMins > 0) return `${diffHours} گھنٹے ${diffMins} منٹ`;
      if (diffHours > 0) return `${diffHours} گھنٹے`;
      return `${diffMins} منٹ`;
    } else {
      if (diffHours > 0 && diffMins > 0) return `${diffHours}h ${diffMins}m`;
      if (diffHours > 0) return `${diffHours}h`;
      return `${diffMins}m`;
    }
  };

  // ========== CALENDAR FUNCTIONS ==========
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const days = [];
    for (let i = 0; i < firstDayOfMonth; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(new Date(year, month, i));
    return days;
  };

  const isDateSelected = (date: Date) =>
    selectedDates.some(d =>
      d.getDate() === date.getDate() &&
      d.getMonth() === date.getMonth() &&
      d.getFullYear() === date.getFullYear()
    );

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
    newMonth.setMonth(newMonth.getMonth() + (direction === 'next' ? 1 : -1));
    setCurrentMonth(newMonth);
  };

  const formatMonthYear = (date: Date) => {
    if (language === 'ur') {
      return `${urduMonths[date.getMonth()]} ${date.getFullYear()}`;
    }
    return `${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  // ========== WEEKLY DAY TOGGLE ==========
  const toggleDay = (dayIndex: number) => {
    if (selectedDays.includes(dayIndex)) {
      setSelectedDays(selectedDays.filter(d => d !== dayIndex));
    } else {
      setSelectedDays([...selectedDays, dayIndex]);
    }
  };

  // ========== VALIDATION ==========
  const validateSchedule = async (): Promise<{ valid: boolean; conflict?: ScheduleDocument; conflictDay?: number }> => {
    if (!user?.name) {
      Alert.alert(
        language === 'ur' ? 'صارف کا نام درکار ہے' : 'User Required',
        language === 'ur' ? 'براہ کرم لاگ ان کریں' : 'Please login first'
      );
      return { valid: false };
    }

    if (!assignedTo.trim()) {
      Alert.alert(
        language === 'ur' ? 'نام درکار ہے' : 'Name Required',
        language === 'ur' ? 'براہ کرم نام لکھیں' : 'Please enter a name'
      );
      // Scroll to name input
      nameInputRef.current?.measureLayout(
        scrollViewRef.current?.getInnerViewNode(),
        (x, y) => {
          scrollViewRef.current?.scrollTo({ y: y - 100, animated: true });
        },
        () => { }
      );
      return { valid: false };
    }

    // Basic validation: end time must be after start time (considering midnight)
    if (endTime <= startTime && getMinutesFromMidnight(endTime) > getMinutesFromMidnight(startTime)) {
      // allowed, crosses midnight
    } else if (endTime <= startTime) {
      Alert.alert(
        language === 'ur' ? 'غلط وقت' : 'Invalid Time',
        language === 'ur' ? 'اختتامی وقت شروع کے بعد ہونا چاہیے' : 'End time must be after start time'
      );
      return { valid: false };
    }

    // Today mode: start time cannot be in the past
    if (scheduleType === 'today') {
      const now = new Date();
      if (startTime < now) {
        Alert.alert(
          language === 'ur' ? 'غلط وقت' : 'Invalid Time',
          language === 'ur' ? 'شروع کا وقت ماضی میں نہیں ہو سکتا' : 'Start time cannot be in the past'
        );
        return { valid: false };
      }
    }

    // Count future schedules
    const futureCount = schedules.filter(s => s.status === 'pending' || s.status === 'running').length;
    let newSchedulesCount = 0;
    if (scheduleType === 'custom') {
      newSchedulesCount = selectedDates.length;
    } else {
      newSchedulesCount = 1;
    }

    if (!editingId && futureCount + newSchedulesCount > 20) {
      Alert.alert(
        language === 'ur' ? 'حد سے زیادہ' : 'Limit Exceeded',
        language === 'ur' ? 'آپ صرف 20 مستقبل کے شیڈول رکھ سکتے ہیں' : 'You can only have 20 future schedules'
      );
      return { valid: false };
    }

    const newStartMin = getMinutesFromMidnight(startTime);
    const newEndMin = getMinutesFromMidnight(endTime);

    const timesOverlap = (s1: number, e1: number, s2: number, e2: number): boolean => {
      const intervals1: { start: number; end: number }[] = [];
      if (e1 < s1) {
        intervals1.push({ start: s1, end: 1440 });
        intervals1.push({ start: 0, end: e1 });
      } else {
        intervals1.push({ start: s1, end: e1 });
      }

      const intervals2: { start: number; end: number }[] = [];
      if (e2 < s2) {
        intervals2.push({ start: s2, end: 1440 });
        intervals2.push({ start: 0, end: e2 });
      } else {
        intervals2.push({ start: s2, end: e2 });
      }

      for (const i1 of intervals1) {
        for (const i2 of intervals2) {
          if (i1.start < i2.end && i1.end > i2.start) return true;
        }
      }
      return false;
    };

    const allExisting = schedules.filter(s => !(editingId && s.id === editingId));

    if (scheduleType === 'today') {
      const today = getMidnightDate(new Date());
      for (const ex of allExisting) {
        if (ex.repeatType === 'today') {
          const exDate = getMidnightDate(ex.startTime.toDate());
          if (exDate.getTime() === today.getTime()) {
            if (timesOverlap(newStartMin, newEndMin, ex.startMinutes, ex.endMinutes)) {
              return { valid: false, conflict: ex };
            }
          }
        } else if (ex.repeatType === 'weekly') {
          const todayIndex = (new Date().getDay() + 6) % 7;
          if (ex.daysOfWeek?.includes(todayIndex)) {
            if (timesOverlap(newStartMin, newEndMin, ex.startMinutes, ex.endMinutes)) {
              return { valid: false, conflict: ex };
            }
          }
        } else if (ex.repeatType === 'custom') {
          const exDate = getMidnightDate(ex.scheduleDate.toDate());
          if (exDate.getTime() === today.getTime()) {
            if (timesOverlap(newStartMin, newEndMin, ex.startMinutes, ex.endMinutes)) {
              return { valid: false, conflict: ex };
            }
          }
        }
      }
    } else if (scheduleType === 'weekly') {
      if (selectedDays.length === 0) {
        Alert.alert(
          language === 'ur' ? 'دن منتخب کریں' : 'Select Days',
          language === 'ur' ? 'کم از کم ایک دن چنیں' : 'Please select at least one day'
        );
        return { valid: false };
      }

      // Helper to get intervals of a schedule on a specific day (Monday-based)
      const getIntervalsOnDay = (day: number, sch: ScheduleDocument): { start: number; end: number }[] => {
        const intervals: { start: number; end: number }[] = [];
        if (sch.repeatType === 'weekly' && sch.daysOfWeek) {
          const startM = sch.startMinutes;
          const endM = sch.endMinutes;
          if (endM >= startM) {
            // normal interval
            if (sch.daysOfWeek.includes(day)) {
              intervals.push({ start: startM, end: endM });
            }
          } else {
            // crosses midnight
            if (sch.daysOfWeek.includes(day)) {
              intervals.push({ start: startM, end: 1440 });
            }
            if (sch.daysOfWeek.includes((day - 1 + 7) % 7)) {
              intervals.push({ start: 0, end: endM });
            }
          }
        } else if (sch.repeatType === 'today') {
          // today applies only on its specific date, but for weekly validation we only care about day-of-week
          // if that date's day-of-week matches 'day'
          const date = sch.startTime.toDate();
          const dateDay = (date.getDay() + 6) % 7;
          if (dateDay === day) {
            const startM = sch.startMinutes;
            const endM = sch.endMinutes;
            if (endM >= startM) {
              intervals.push({ start: startM, end: endM });
            } else {
              // crosses midnight on that date – on that day it has first part, and next day has second part.
              // For today, we only consider the part that lies on the date itself. The next day part belongs to a different date, so not relevant for day-of-week check unless that next day's day-of-week is also being checked.
              // To be safe, we'll include both parts but note that the next day part would only matter if the next day's day-of-week is also being checked. Since we are checking per day, we'll just include the part on this day.
              intervals.push({ start: startM, end: 1440 }); // part on this day
              // The second part [0, endM) belongs to the next day, which will be handled when we check that day.
            }
          }
        } else if (sch.repeatType === 'custom') {
          const date = sch.scheduleDate.toDate();
          const dateDay = (date.getDay() + 6) % 7;
          if (dateDay === day) {
            const startM = sch.startMinutes;
            const endM = sch.endMinutes;
            if (endM >= startM) {
              intervals.push({ start: startM, end: endM });
            } else {
              intervals.push({ start: startM, end: 1440 });
              // second part on next day
            }
          }
        }
        return intervals;
      };

      // Determine all days that the new schedule affects (including next day if it crosses midnight)
      const newAffectedDays = new Set<number>();
      selectedDays.forEach(d => newAffectedDays.add(d));
      if (newEndMin < newStartMin) {
        // crosses midnight, also affects next day for each selected day
        selectedDays.forEach(d => newAffectedDays.add((d + 1) % 7));
      }

      for (const day of Array.from(newAffectedDays)) {
        const newIntervals = getIntervalsOnDay(day, {
          repeatType: 'weekly',
          daysOfWeek: selectedDays,
          startMinutes: newStartMin,
          endMinutes: newEndMin,
        } as ScheduleDocument); // we only use these fields

        for (const ex of allExisting) {
          const exIntervals = getIntervalsOnDay(day, ex);
          for (const ni of newIntervals) {
            for (const ei of exIntervals) {
              if (ni.start < ei.end && ni.end > ei.start) {
                return { valid: false, conflict: ex, conflictDay: day };
              }
            }
          }
        }
      }
    } else if (scheduleType === 'custom') {
      if (selectedDates.length === 0) {
        Alert.alert(
          language === 'ur' ? 'تاریخ منتخب کریں' : 'Select Dates',
          language === 'ur' ? 'کم از کم ایک تاریخ چنیں' : 'Please select at least one date'
        );
        return { valid: false };
      }

      const today = getMidnightDate(new Date());
      for (const date of selectedDates) {
        if (getMidnightDate(date) < today) {
          Alert.alert(
            language === 'ur' ? 'غلط تاریخیں' : 'Invalid Dates',
            language === 'ur' ? 'ماضی کی تاریخیں منتخب نہیں کر سکتے' : 'Past dates not allowed'
          );
          return { valid: false };
        }
      }

      for (const date of selectedDates) {
        const dateMidnight = getMidnightDate(date);
        const dayIndex = (date.getDay() + 6) % 7;

        for (const ex of allExisting) {
          if (ex.repeatType === 'today') {
            const exDate = getMidnightDate(ex.startTime.toDate());
            if (exDate.getTime() === dateMidnight.getTime()) {
              if (timesOverlap(newStartMin, newEndMin, ex.startMinutes, ex.endMinutes)) {
                return { valid: false, conflict: ex };
              }
            }
          } else if (ex.repeatType === 'weekly') {
            if (ex.daysOfWeek?.includes(dayIndex)) {
              if (timesOverlap(newStartMin, newEndMin, ex.startMinutes, ex.endMinutes)) {
                return { valid: false, conflict: ex };
              }
            }
          } else if (ex.repeatType === 'custom') {
            const exDateMidnight = getMidnightDate(ex.scheduleDate.toDate());
            if (exDateMidnight.getTime() === dateMidnight.getTime()) {
              if (timesOverlap(newStartMin, newEndMin, ex.startMinutes, ex.endMinutes)) {
                return { valid: false, conflict: ex };
              }
            }
          }
        }
      }
    }

    return { valid: true };
  };

// ========== SAVE/UPDATE ==========
  const handleSaveSchedule = async () => {
    try {
      setIsLoading(true);
      const validation = await validateSchedule();
      if (!validation.valid) {
        if (validation.conflict) {
          const conflict = validation.conflict;
          let conflictMsg = '';
          if (scheduleType === 'weekly' && validation.conflictDay !== undefined) {
            const dayName = language === 'ur' ? fullDayNamesUrdu[validation.conflictDay] : fullDayNames[validation.conflictDay];
            conflictMsg = language === 'ur'
              ? `${dayName} کو ${formatFirestoreTime(conflict.startTime)} – ${formatFirestoreTime(conflict.endTime)} پر پہلے سے شیڈول ہے`
              : `Conflict on ${dayName} at ${formatFirestoreTime(conflict.startTime)} – ${formatFirestoreTime(conflict.endTime)}`;
          } else {
            conflictMsg = language === 'ur'
              ? `${formatFirestoreTime(conflict.startTime)} – ${formatFirestoreTime(conflict.endTime)} پر پہلے سے شیڈول ہے`
              : `Conflict with schedule at ${formatFirestoreTime(conflict.startTime)} – ${formatFirestoreTime(conflict.endTime)}`;
          }
          Alert.alert(
            language === 'ur' ? 'ٹکراؤ' : 'Conflict',
            conflictMsg
          );
        }
        setIsLoading(false);
        return;
      }

      const startMinutes = getMinutesFromMidnight(startTime);
      const endMinutes = getMinutesFromMidnight(endTime);

      // --- FIX 1 & 2: CORRECTLY HANDLE DATES & MIDNIGHT ROLLOVER ---
      let finalStartDate = new Date(startTime);
      let finalEndDate = new Date(startTime);
      finalEndDate.setHours(endTime.getHours(), endTime.getMinutes(), 0, 0);

      // If weekly, shift the base date to the FIRST upcoming selected day
      if (scheduleType === 'weekly' && selectedDays.length > 0) {
        const now = new Date();
        const currentDay = (now.getDay() + 6) % 7; // Monday=0
        const currentMinutes = getMinutesFromMidnight(now);

        let daysToAdd = -1;
        // Find the closest upcoming day from selectedDays
        for (let i = 0; i <= 7; i++) {
          const checkDay = (currentDay + i) % 7;
          if (selectedDays.includes(checkDay)) {
            if (i === 0 && startMinutes > currentMinutes) {
              daysToAdd = 0; // Today, and time hasn't passed yet
              break;
            } else if (i > 0) {
              daysToAdd = i; // Future day
              break;
            }
          }
        }
        
        // Fallback: If only today is selected but the time already passed, shift to next week
        if (daysToAdd === -1) daysToAdd = 7; 

        finalStartDate.setDate(now.getDate() + daysToAdd);
        finalEndDate = new Date(finalStartDate);
        finalEndDate.setHours(endTime.getHours(), endTime.getMinutes(), 0, 0);
      }

      // Handle midnight rollover safely
      if (endMinutes < startMinutes) {
        finalEndDate.setDate(finalStartDate.getDate() + 1);
      }

      const baseData: any = {
        activeUser: user!.name,
        assignedTo: assignedTo.trim(),
        startTime: firestore.Timestamp.fromDate(finalStartDate), // Now correctly shifted
        endTime: firestore.Timestamp.fromDate(finalEndDate),     // Rollover fix applied
        startMinutes,
        endMinutes,
        status: 'pending',
      };

      if (scheduleType === 'today') {
        baseData.repeatType = 'today';
        if (editingId) {
          await firestore().collection('schedules').doc(editingId).update({
            ...baseData,
            updatedAt: firestore.FieldValue.serverTimestamp(),
          });
        } else {
          await firestore().collection('schedules').add({
            ...baseData,
            createdAt: firestore.FieldValue.serverTimestamp(),
          });
        }
        Alert.alert(
          language === 'ur' ? 'محفوظ ہو گیا' : 'Saved',
          getScheduleInfo(),
          [{ text: 'OK', onPress: resetForm }]
        );
      } else if (scheduleType === 'weekly') {
        baseData.repeatType = 'weekly';
        baseData.daysOfWeek = selectedDays;
        if (editingId) {
          await firestore().collection('schedules').doc(editingId).update({
            ...baseData,
            updatedAt: firestore.FieldValue.serverTimestamp(),
          });
        } else {
          await firestore().collection('schedules').add({
            ...baseData,
            createdAt: firestore.FieldValue.serverTimestamp(),
          });
        }
        Alert.alert(
          language === 'ur' ? 'محفوظ ہو گیا' : 'Saved',
          getScheduleInfo(),
          [{ text: 'OK', onPress: resetForm }]
        );
      } else if (scheduleType === 'custom') {
        if (editingId) {
          const scheduleDate = firestore.Timestamp.fromDate(getMidnightDate(selectedDates[0]));
          const startDateTime = new Date(selectedDates[0]);
          startDateTime.setHours(startTime.getHours(), startTime.getMinutes(), 0, 0);
          let endDateTime = new Date(selectedDates[0]);
          endDateTime.setHours(endTime.getHours(), endTime.getMinutes(), 0, 0);
          if (endMinutes < startMinutes) {
            endDateTime.setDate(endDateTime.getDate() + 1);
          }

          await firestore().collection('schedules').doc(editingId).update({
            ...baseData,
            repeatType: 'custom',
            scheduleDate,
            startTime: firestore.Timestamp.fromDate(startDateTime),
            endTime: firestore.Timestamp.fromDate(endDateTime),
            updatedAt: firestore.FieldValue.serverTimestamp(),
          });
          Alert.alert(
            language === 'ur' ? 'اپ ڈیٹ ہو گیا' : 'Updated',
            getScheduleInfo(),
            [{ text: 'OK', onPress: resetForm }]
          );
        } else {
          const batch = firestore().batch();
          for (const date of selectedDates) {
            const scheduleDate = firestore.Timestamp.fromDate(getMidnightDate(date));
            const startDateTime = new Date(date);
            startDateTime.setHours(startTime.getHours(), startTime.getMinutes(), 0, 0);
            let endDateTime = new Date(date);
            endDateTime.setHours(endTime.getHours(), endTime.getMinutes(), 0, 0);
            if (endMinutes < startMinutes) {
              endDateTime.setDate(endDateTime.getDate() + 1);
            }

            const docRef = firestore().collection('schedules').doc();
            batch.set(docRef, {
              ...baseData,
              repeatType: 'custom',
              scheduleDate,
              startTime: firestore.Timestamp.fromDate(startDateTime),
              endTime: firestore.Timestamp.fromDate(endDateTime),
              createdAt: firestore.FieldValue.serverTimestamp(),
            });
          }
          await batch.commit();
          Alert.alert(
            language === 'ur' ? 'محفوظ ہو گیا' : 'Saved',
            language === 'ur'
              ? `${selectedDates.length} شیڈول محفوظ ہو گئے`
              : `${selectedDates.length} schedules saved`,
            [{ text: 'OK', onPress: resetForm }]
          );
        }
      }
    } catch (error) {
      console.error('Save error:', error);
      Alert.alert(
        language === 'ur' ? 'غلطی' : 'Error',
        language === 'ur' ? 'محفوظ کرنے میں مسئلہ' : 'Error saving schedule'
      );
    } finally {
      setIsLoading(false);
    }
  };

  // ========== EDIT ==========
  const handleEditSchedule = (schedule: ScheduleDocument) => {
    setEditingId(schedule.id);
    setAssignedTo(schedule.assignedTo);
    setStartTime(schedule.startTime.toDate());
    setEndTime(schedule.endTime.toDate());
    setScheduleType(schedule.repeatType);

    if (schedule.repeatType === 'weekly' && schedule.daysOfWeek) {
      setSelectedDays(schedule.daysOfWeek);
      setShowCalendar(false);
    } else if (schedule.repeatType === 'custom' && schedule.scheduleDate) {
      setSelectedDates([schedule.scheduleDate.toDate()]);
      setShowCalendar(true);
    } else {
      setSelectedDays([]);
      setSelectedDates([]);
      setShowCalendar(false);
    }

    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  };

  // ========== DELETE ==========
  const handleDeleteSchedule = (id: string) => {
    Alert.alert(
      language === 'ur' ? 'تصدیق' : 'Confirm',
      language === 'ur' ? 'کیا آپ یہ شیڈول حذف کرنا چاہتے ہیں؟' : 'Delete this schedule?',
      [
        { text: language === 'ur' ? 'منسوخ' : 'Cancel', style: 'cancel' },
        {
          text: language === 'ur' ? 'حذف کریں' : 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setIsLoading(true);
              await firestore().collection('schedules').doc(id).delete();
              if (editingId === id) resetForm();
              Alert.alert(
                language === 'ur' ? 'کامیاب' : 'Success',
                language === 'ur' ? 'حذف ہو گیا' : 'Deleted'
              );
            } catch (error) {
              console.error('Delete error:', error);
              Alert.alert(
                language === 'ur' ? 'غلطی' : 'Error',
                language === 'ur' ? 'حذف کرنے میں مسئلہ' : 'Error deleting'
              );
            } finally {
              setIsLoading(false);
            }
          },
        },
      ]
    );
  };

  const resetForm = () => {
    setAssignedTo('');
    setStartTime(new Date());
    setEndTime(new Date());
    setScheduleType('today');
    setSelectedDays([]);
    setSelectedDates([]);
    setShowCalendar(false);
    setEditingId(null);
  };

  const getScheduleInfo = () => {
    const start = formatTime(startTime);
    const end = formatTime(endTime);
    const duration = calculateDuration();
    if (scheduleType === 'today') {
      return language === 'ur'
        ? `آج کا شیڈول\n${start} سے ${end}\nمدت: ${duration}`
        : `Today\n${start} to ${end}\nDuration: ${duration}`;
    } else if (scheduleType === 'weekly') {
      const daysStr = selectedDays.map(d => (language === 'ur' ? fullDayNamesUrdu[d] : fullDayNames[d])).join(', ');
      return language === 'ur'
        ? `ہفتہ وار (${daysStr})\n${start} سے ${end}\nمدت: ${duration}`
        : `Weekly (${daysStr})\n${start} to ${end}\nDuration: ${duration}`;
    } else {
      return language === 'ur'
        ? `کسٹم\n${start} سے ${end}\nمدت: ${duration}\nتاریخیں: ${selectedDates.length}`
        : `Custom\n${start} to ${end}\nDuration: ${duration}\nDates: ${selectedDates.length}`;
    }
  };

  const getScheduleTypeText = (schedule: ScheduleDocument) => {
    if (schedule.repeatType === 'today') return language === 'ur' ? 'آج' : 'Today';
    if (schedule.repeatType === 'weekly') return language === 'ur' ? 'ہفتہ وار' : 'Weekly';
    return language === 'ur' ? 'کسٹم' : 'Custom';
  };

  const getDayStatus = (schedule: ScheduleDocument, dayIndex: number): 'pending' | 'running' | 'completed' | 'cancelled' | 'none' => {
    if (!schedule.daysOfWeek?.includes(dayIndex)) return 'none';
    if (schedule.status === 'cancelled') return 'cancelled';

    const now = new Date();
    const todayIndex = (now.getDay() + 6) % 7;

    if (dayIndex !== todayIndex) return 'pending';

    const start = schedule.startTime.toDate();
    const end = schedule.endTime.toDate();
    const todayStart = new Date(now);
    todayStart.setHours(start.getHours(), start.getMinutes(), 0, 0);
    const todayEnd = new Date(now);
    todayEnd.setHours(end.getHours(), end.getMinutes(), 0, 0);
    if (end.getHours() < start.getHours() || (end.getHours() === start.getHours() && end.getMinutes() < start.getMinutes())) {
      todayEnd.setDate(todayEnd.getDate() + 1);
    }

    if (now >= todayStart && now < todayEnd) return 'running';
    if (now >= todayEnd) return 'completed';
    return 'pending';
  };

  // ========== SORTING AND COUNTDOWN LOGIC ==========
  const getSortedSchedules = (list: ScheduleDocument[]) => {
    const statusPriority: { [key: string]: number } = {
      running: 0,
      pending: 1,
      completed: 2,
      cancelled: 3,
    };

    return [...list].sort((a, b) => {
      const aPriority = statusPriority[a.status] ?? 99;
      const bPriority = statusPriority[b.status] ?? 99;
      if (aPriority !== bPriority) return aPriority - bPriority;

      // For completed and cancelled, sort by createdAt desc
      if (a.status === 'completed' || a.status === 'cancelled') {
        const aTime = a.createdAt?.toDate().getTime() || 0;
        const bTime = b.createdAt?.toDate().getTime() || 0;
        return bTime - aTime;
      }

      // For pending and running, get effective start time
      const aEff = getEffectiveStartTime(a);
      const bEff = getEffectiveStartTime(b);
      const aTime = aEff ? aEff.getTime() : Infinity;
      const bTime = bEff ? bEff.getTime() : Infinity;
      return aTime - bTime;
    });
  };

  useEffect(() => {
    if (schedules.length === 0) {
      setTopScheduleId(null);
      setCountdownText('');
      return;
    }

    const sorted = getSortedSchedules(schedules);
    const top = sorted[0];
    setTopScheduleId(top.id);

    const updateCountdown = () => {
      const now = new Date();

      if (top.status === 'running') {
        const end = top.endTime.toDate();
        if (now < end) {
          const remainingMs = end.getTime() - now.getTime();
          const hours = Math.floor(remainingMs / (1000 * 60 * 60));
          const minutes = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));
          if (language === 'ur') {
            setCountdownText(`${hours}گھنٹے ${minutes}منٹ میں ختم`);
          } else {
            setCountdownText(`Ends in ${hours}h ${minutes}m`);
          }
        } else {
          setCountdownText('');
        }
      } else if (top.status === 'pending') {
        const effStart = getEffectiveStartTime(top);
        if (effStart && now < effStart) {
          const remainingMs = effStart.getTime() - now.getTime();
          const hours = Math.floor(remainingMs / (1000 * 60 * 60));
          const minutes = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));
          if (language === 'ur') {
            setCountdownText(`${hours}گھنٹے ${minutes}منٹ میں شروع`);
          } else {
            setCountdownText(`Starts in ${hours}h ${minutes}m`);
          }
        } else {
          setCountdownText('');
        }
      } else {
        setCountdownText('');
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 30000); // every minute

    return () => clearInterval(interval);
  }, [schedules, language]);

  const renderScheduleItem = (schedule: ScheduleDocument) => {
    const statusColor = schedule.status === 'pending' ? '#f59e0b' :
      schedule.status === 'running' ? '#10b981' :
        schedule.status === 'completed' ? '#6b7280' : '#ef4444';
    const statusBg = schedule.status === 'pending' ? '#fef3c7' :
      schedule.status === 'running' ? '#d1fae5' :
        schedule.status === 'completed' ? '#f3f4f6' : '#fee2e2';
    const statusText = schedule.status === 'pending' ? (language === 'ur' ? 'منتظر' : 'Pending') :
      schedule.status === 'running' ? (language === 'ur' ? 'چل رہا' : 'Running') :
        schedule.status === 'completed' ? (language === 'ur' ? 'مکمل' : 'Completed') :
          (language === 'ur' ? 'منسوخ' : 'Cancelled');

    const isTop = schedule.id === topScheduleId;

    return (
      <View key={schedule.id} style={[styles.savedScheduleCard, isDark && styles.savedScheduleCardDark]}>
        <LinearGradient
          colors={isDark ? ['#1f2937', '#111827'] : ['#fff', '#f9fafb']}
          style={styles.savedScheduleGradient}
        >
          {isTop && countdownText ? (
            <View style={styles.topBadge}>
              <Text style={styles.topBadgeText}>{countdownText}</Text>
            </View>
          ) : null}

          <View style={styles.savedScheduleHeader}>
            <View style={styles.savedScheduleType}>
              <Text style={styles.savedScheduleTypeIcon}>
                {schedule.repeatType === 'today' ? '🎯' : schedule.repeatType === 'weekly' ? '📆' : '📅'}
              </Text>
              <Text style={[styles.savedScheduleTypeText, isDark && styles.savedScheduleTypeTextDark]}>
                {getScheduleTypeText(schedule)}
              </Text>
            </View>
            <View style={[styles.savedScheduleStatus, { backgroundColor: statusBg }]}>
              <View style={[styles.savedScheduleStatusDot, { backgroundColor: statusColor }]} />
              <Text style={{ color: statusColor, fontSize: 12, fontWeight: '500' }}>{statusText}</Text>
            </View>
          </View>

          <Text style={[styles.savedScheduleAssignedTo, isDark && styles.savedScheduleAssignedToDark]}>
            👤 {schedule.assignedTo}
          </Text>

          {schedule.repeatType === 'weekly' && schedule.daysOfWeek && (
            <View style={styles.weeklyDaysContainer}>
              {fullDayNames.map((day, idx) => {
                const dayStatus = getDayStatus(schedule, idx);
                let dayBgColor = '#f3f4f6';
                if (schedule.daysOfWeek?.includes(idx)) {
                  if (dayStatus === 'running') dayBgColor = '#fbbf24';
                  else if (dayStatus === 'completed') dayBgColor = '#86efac';
                  else if (dayStatus === 'cancelled') dayBgColor = '#fca5a5';
                  else dayBgColor = '#bfdbfe';
                }
                return (
                  <View key={idx} style={[styles.weeklyDayChip, { backgroundColor: dayBgColor }]}>
                    <Text style={styles.weeklyDayText}>
                      {language === 'ur' ? fullDayNamesUrdu[idx].substring(0, 2) : day.substring(0, 3)}
                    </Text>
                  </View>
                );
              })}
            </View>
          )}

          {schedule.repeatType === 'custom' && schedule.scheduleDate && (
            <View style={styles.savedScheduleDateContainer}>
              <Text style={[styles.savedScheduleDateLabel, isDark && styles.savedScheduleDateLabelDark]}>
                {language === 'ur' ? 'تاریخ:' : 'Date:'}
              </Text>
              <Text style={[styles.savedScheduleDateValue, isDark && styles.savedScheduleDateValueDark]}>
                {formatFirestoreDate(schedule.scheduleDate)}
              </Text>
            </View>
          )}

          <View style={styles.savedScheduleTimes}>
            <View style={styles.savedScheduleTimeBlock}>
              <Text style={[styles.savedScheduleTimeLabel, isDark && styles.savedScheduleTimeLabelDark]}>
                {language === 'ur' ? 'شروع' : 'Start'}
              </Text>
              <Text style={[styles.savedScheduleTimeValue, isDark && styles.savedScheduleTimeValueDark]}>
                {formatFirestoreTime(schedule.startTime)}
              </Text>
            </View>
            <Text style={[styles.savedScheduleTimeSeparator, isDark && styles.savedScheduleTimeSeparatorDark]}>—</Text>
            <View style={styles.savedScheduleTimeBlock}>
              <Text style={[styles.savedScheduleTimeLabel, isDark && styles.savedScheduleTimeLabelDark]}>
                {language === 'ur' ? 'اختتام' : 'End'}
              </Text>
              <Text style={[styles.savedScheduleTimeValue, isDark && styles.savedScheduleTimeValueDark]}>
                {formatFirestoreTime(schedule.endTime)}
              </Text>
            </View>
          </View>

          {schedule.cancelReason && (
            <Text style={[styles.cancelReason, isDark && styles.cancelReasonDark]}>
              ⚠️ {schedule.cancelReason}
            </Text>
          )}

          <View style={styles.savedScheduleFooter}>
            <Text style={[styles.savedScheduleDate, isDark && styles.savedScheduleDateDark]}>
              {formatFirestoreDate(schedule.createdAt)}
            </Text>
            <View style={styles.savedScheduleActions}>
              <TouchableOpacity
                style={[styles.savedScheduleEditBtn, isDark && styles.savedScheduleEditBtnDark]}
                onPress={() => handleEditSchedule(schedule)}
              >
                <Text style={styles.savedScheduleEditBtnText}>{language === 'ur' ? 'ترمیم' : 'Edit'}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.savedScheduleDeleteBtn, isDark && styles.savedScheduleDeleteBtnDark]}
                onPress={() => handleDeleteSchedule(schedule.id)}
              >
                <Text style={styles.savedScheduleDeleteBtnText}>{language === 'ur' ? 'حذف کریں' : 'Delete'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>
      </View>
    );
  };

  const days = getDaysInMonth(currentMonth);

  const filteredSchedules = schedules.filter(s =>
    filterStatus === 'all' ? true : s.status === filterStatus
  );

  const sortedSchedules = getSortedSchedules(filteredSchedules);

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <Header showLogout={false} />

      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Centered title */}
        <View style={styles.titleWrapper}>
          <Text style={[styles.centeredTitle, isDark && styles.centeredTitleDark]}>
            ⏰ {t('schedule.waterSchedule')}
          </Text>
        </View>

        {editingId && (
          <View style={[styles.editingIndicator, isDark && styles.editingIndicatorDark]}>
            <Text style={[styles.editingIndicatorText, isDark && styles.editingIndicatorTextDark]}>
              {language === 'ur' ? '⚠️ ترمیم موڈ' : '⚠️ Edit Mode'}
            </Text>
            <TouchableOpacity onPress={resetForm}>
              <Text style={[styles.editingCancel, isDark && styles.editingCancelDark]}>
                {language === 'ur' ? 'منسوخ' : 'Cancel'}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Name input */}
        <View ref={nameInputRef} collapsable={false} style={[styles.card, isDark && styles.cardDark]}>
          <Text style={[styles.sectionTitle, isDark && styles.sectionTitleDark]}>
            👤 {language === 'ur' ? 'نام' : 'Name'}
          </Text>
          <TextInput
            style={[styles.input, isDark && styles.inputDark]}
            placeholder={language === 'ur' ? 'نام لکھیں' : 'Enter name'}
            placeholderTextColor={isDark ? '#9ca3af' : '#9ca3af'}
            value={assignedTo}
            onChangeText={setAssignedTo}
          />
        </View>

        {/* Repeat type buttons */}
        <View style={[styles.card, isDark && styles.cardDark, { marginTop: 8 }]}>
          <Text style={[styles.sectionTitle, isDark && styles.sectionTitleDark]}>
            🔁 {language === 'ur' ? 'دہرائیں' : 'Repeat'}
          </Text>
          <View style={styles.scheduleTypeContainer}>
            <TouchableOpacity
              style={[
                styles.scheduleTypeButton,
                scheduleType === 'today' && styles.scheduleTypeButtonActive,
                isDark && scheduleType === 'today' && styles.scheduleTypeButtonActiveDark
              ]}
              onPress={() => { setScheduleType('today'); setShowCalendar(false); }}
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

            <TouchableOpacity
              style={[
                styles.scheduleTypeButton,
                scheduleType === 'weekly' && styles.scheduleTypeButtonActive,
                isDark && scheduleType === 'weekly' && styles.scheduleTypeButtonActiveDark
              ]}
              onPress={() => { setScheduleType('weekly'); setShowCalendar(false); }}
            >
              <Text style={styles.scheduleTypeButtonIcon}>📆</Text>
              <Text style={[
                styles.scheduleTypeButtonText,
                isDark && styles.scheduleTypeButtonTextDark,
                scheduleType === 'weekly' && styles.scheduleTypeButtonTextActive
              ]}>
                {language === 'ur' ? 'ہفتہ وار' : 'Weekly'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.scheduleTypeButton,
                scheduleType === 'custom' && styles.scheduleTypeButtonActive,
                isDark && scheduleType === 'custom' && styles.scheduleTypeButtonActiveDark
              ]}
              onPress={() => { setScheduleType('custom'); setShowCalendar(true); }}
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

        {/* Weekly day selector */}
        {scheduleType === 'weekly' && (
          <View style={[styles.card, isDark && styles.cardDark]}>
            <Text style={[styles.sectionTitle, isDark && styles.sectionTitleDark]}>
              {language === 'ur' ? 'دن منتخب کریں' : 'Select Days'}
            </Text>
            <View style={styles.daysSelector}>
              {fullDayNames.map((day, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.dayChip,
                    selectedDays.includes(index) && styles.dayChipSelected,
                    isDark && selectedDays.includes(index) && styles.dayChipSelectedDark
                  ]}
                  onPress={() => toggleDay(index)}
                >
                  <Text style={[
                    styles.dayChipText,
                    selectedDays.includes(index) && styles.dayChipTextSelected,
                    isDark && styles.dayChipTextDark
                  ]}>
                    {language === 'ur' ? fullDayNamesUrdu[index].substring(0, 2) : day.substring(0, 3)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Calendar for custom */}
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

            <View style={styles.daysOfWeek}>
              {daysOfWeek.map((day, i) => (
                <Text key={i} style={[styles.dayOfWeek, isDark && styles.dayOfWeekDark]}>{day}</Text>
              ))}
            </View>

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
                      disabled={getMidnightDate(date) < getMidnightDate(new Date())}
                    >
                      <Text style={[
                        styles.dateText,
                        isDark && styles.dateTextDark,
                        isDateSelected(date) && styles.dateTextSelected,
                        date.getDay() === 0 && styles.sundayText,
                        getMidnightDate(date) < getMidnightDate(new Date()) && styles.pastDate
                      ]}>
                        {date.getDate()}
                      </Text>
                      {isDateSelected(date) && <View style={styles.dateSelectedIndicator} />}
                    </TouchableOpacity>
                  ) : (
                    <View style={styles.emptyCell} />
                  )}
                </View>
              ))}
            </View>

            {selectedDates.length > 0 && (
              <Text style={[styles.selectedDatesCount, isDark && styles.selectedDatesCountDark]}>
                {language === 'ur' ? `منتخب تاریخیں: ${selectedDates.length}` : `Selected dates: ${selectedDates.length}`}
              </Text>
            )}
          </View>
        )}

        {/* Time banner with refresh button inside */}
        <View style={[styles.timeBannerCard, isDark && styles.timeBannerCardDark]}>
          <LinearGradient
            colors={isDark ? ['#065f46', '#047857'] : ['#d1fae5', '#a7f3d0']}
            style={styles.timeBannerGradient}
          >
            <View style={styles.timeBannerHeader}>
              <Text style={[styles.timeBannerTitle, isDark && styles.timeBannerTitleDark]}>
                {language === 'ur' ? 'پانی کا وقت' : 'Water Time'}
              </Text>
              <TouchableOpacity onPress={refreshCurrentTime} style={styles.timeRefreshButton}>
                <Text style={[styles.timeRefreshIcon, isDark && styles.timeRefreshIconDark]}>🔄</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.timeBannerTimes}>
              <View style={styles.timeBannerItem}>
                <Text style={[styles.timeBannerLabel, isDark && styles.timeBannerLabelDark]}>
                  {language === 'ur' ? 'شروع' : 'Start'}
                </Text>
                <TouchableOpacity onPress={() => setShowStartPicker(true)}>
                  <Text style={[styles.timeBannerValue, isDark && styles.timeBannerValueDark]}>
                    {formatTimeCompact(startTime)}
                  </Text>
                </TouchableOpacity>
              </View>
              <Text style={[styles.timeBannerSeparator, isDark && styles.timeBannerSeparatorDark]}>—</Text>
              <View style={styles.timeBannerItem}>
                <Text style={[styles.timeBannerLabel, isDark && styles.timeBannerLabelDark]}>
                  {language === 'ur' ? 'اختتام' : 'End'}
                </Text>
                <TouchableOpacity onPress={() => setShowEndPicker(true)}>
                  <Text style={[styles.timeBannerValue, isDark && styles.timeBannerValueDark]}>
                    {formatTimeCompact(endTime)}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <Text style={[styles.timeBannerDuration, isDark && styles.timeBannerDurationDark]}>
              ⏱️ {calculateDuration()}
            </Text>
          </LinearGradient>
        </View>

        {/* Save button */}
        <TouchableOpacity
          style={[styles.saveButton, isDark && styles.saveButtonDark, isLoading && styles.saveButtonDisabled]}
          onPress={handleSaveSchedule}
          disabled={isLoading}
        >
          <LinearGradient
            colors={isDark ? ['#059669', '#047857'] : ['#10b981', '#059669']}
            style={styles.saveButtonGradient}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <>
                <Text style={styles.saveButtonIcon}>💾</Text>
                <Text style={styles.saveButtonText}>
                  {editingId ? (language === 'ur' ? 'اپ ڈیٹ کریں' : 'Update') : t('schedule.saveSchedule')}
                </Text>
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>

        {/* Filter */}
        <View style={[styles.card, isDark && styles.cardDark, styles.filterCard]}>
          <Text style={[styles.sectionTitle, isDark && styles.sectionTitleDark]}>
            {language === 'ur' ? '📋 محفوظ کردہ شیڈولز' : '📋 Saved Schedules'}
          </Text>
          <View style={styles.filterContainer}>
            <Text style={[styles.filterLabel, isDark && styles.filterLabelDark]}>
              {language === 'ur' ? 'فلٹر:' : 'Filter:'}
            </Text>
            <TouchableOpacity
              style={[styles.filterButton, isDark && styles.filterButtonDark]}
              onPress={() => {
                const options = ['all', 'pending', 'running', 'completed'];
                const labels = language === 'ur'
                  ? ['سب', 'منتظر', 'چل رہا', 'مکمل']
                  : ['All', 'Pending', 'Running', 'Completed'];
                Alert.alert(
                  language === 'ur' ? 'فلٹر منتخب کریں' : 'Select Filter',
                  '',
                  options.map((opt, idx) => ({
                    text: labels[idx],
                    onPress: () => setFilterStatus(opt),
                  }))
                );
              }}
            >
              <Text style={[styles.filterButtonText, isDark && styles.filterButtonTextDark]}>
                {filterStatus === 'all' ? (language === 'ur' ? 'سب' : 'All') :
                  filterStatus === 'pending' ? (language === 'ur' ? 'منتظر' : 'Pending') :
                    filterStatus === 'running' ? (language === 'ur' ? 'چل رہا' : 'Running') :
                      (language === 'ur' ? 'مکمل' : 'Completed')}
              </Text>
              <Text style={[styles.filterArrow, isDark && styles.filterArrowDark]}>▼</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Saved schedules list */}
        <View style={[styles.savedSection, isDark && styles.savedSectionDark]}>
          {isFetching ? (
            <View style={[styles.loadingContainer, isDark && styles.loadingContainerDark]}>
              <ActivityIndicator size="large" color={isDark ? '#34d399' : '#10b981'} />
              <Text style={[styles.loadingText, isDark && styles.loadingTextDark]}>
                {language === 'ur' ? 'لوڈ ہو رہا ہے...' : 'Loading...'}
              </Text>
            </View>
          ) : listenerError ? (
            <View style={[styles.emptyContainer, isDark && styles.emptyContainerDark]}>
              <Text style={[styles.emptyIcon, isDark && styles.emptyIconDark]}>⚠️</Text>
              <Text style={[styles.emptyTitle, isDark && styles.emptyTitleDark]}>
                {language === 'ur' ? 'ڈیٹا بیس کی خرابی' : 'Database Error'}
              </Text>
              <Text style={[styles.emptySubtitle, isDark && styles.emptySubtitleDark]}>
                {language === 'ur' ? 'براہ کرم انڈیکس بنا دیں' : 'Please create the required index'}
              </Text>
            </View>
          ) : sortedSchedules.length === 0 ? (
            <View style={[styles.emptyContainer, isDark && styles.emptyContainerDark]}>
              <Text style={[styles.emptyIcon, isDark && styles.emptyIconDark]}>📅</Text>
              <Text style={[styles.emptyTitle, isDark && styles.emptyTitleDark]}>
                {language === 'ur' ? 'کوئی شیڈول نہیں' : 'No Schedules'}
              </Text>
              <Text style={[styles.emptySubtitle, isDark && styles.emptySubtitleDark]}>
                {language === 'ur' ? 'اوپر والے فارم سے نیا بنائیں' : 'Create one using the form above'}
              </Text>
            </View>
          ) : (
            <View style={styles.savedList}>
              {sortedSchedules.map(schedule => renderScheduleItem(schedule))}
            </View>
          )}
        </View>

        {/* Time pickers */}
        {showStartPicker && (
          <DateTimePicker
            value={startTime}
            mode="time"
            display="spinner"
            onChange={onStartTimeChange}
            themeVariant={isDark ? 'dark' : 'light'}
          />
        )}
        {showEndPicker && (
          <DateTimePicker
            value={endTime}
            mode="time"
            display="spinner"
            onChange={onEndTimeChange}
            themeVariant={isDark ? 'dark' : 'light'}
          />
        )}
      </ScrollView>

      <BottomNavBar activeTab={activeTab} onTabPress={handleTabPress} />
    </View>
  );
};

export default ScheduleScreen;