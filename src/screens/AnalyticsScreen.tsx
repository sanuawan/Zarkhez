import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView, Dimensions, TextInput, StatusBar, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import firestore from '@react-native-firebase/firestore';
import { LineChart, PieChart } from 'react-native-chart-kit'; 
import { styles } from './styles/AnalyticsScreen.styles';
import { useLanguage } from '../contexts/LanguageContext';

const screenWidth = Dimensions.get("window").width;

const AnalyticsScreen = () => {
  const navigation = useNavigation();
  const [filter, setFilter] = useState<'weekly' | 'monthly'>('weekly');
  const [motorHP, setMotorHP] = useState('10'); 
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();
  
  const [data, setData] = useState({
    paid: 0, pending: 0, totalUnits: 0,
    graphLabels: [], graphValues: []
  });

  

  useEffect(() => {
    const hp = parseFloat(motorHP) || 0;
    const kwFactor = 0.746;

    const unsubscribe = firestore().collection('billing_history').onSnapshot(snap => {
      let pSum = 0, pendSum = 0, uSum = 0;
      const wUnits: any = { Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0 };
      const mUnits: any = { Jan:0, Feb:0, Mar:0, Apr:0, May:0, Jun:0, Jul:0, Aug:0, Sep:0, Oct:0, Nov:0, Dec:0 };

      snap.forEach(doc => {
        const d = doc.data();
        const dur = parseFloat(d.duration || 0);
        const amt = parseFloat(d.billAmount || 0);
        const ts = d.timestamp?.toDate();

        if (d.status === 'paid') pSum += amt; else pendSum += amt;

        const units = (hp * kwFactor) * (dur / 60);
        uSum += units;

        if (ts) {
          const dName = ts.toLocaleDateString('en-US', { weekday: 'short' });
          const mName = ts.toLocaleDateString('en-US', { month: 'short' });
          if (filter === 'weekly') wUnits[dName] += units;
          else mUnits[mName] += units;
        }
      });

      setData({
        paid: pSum, pending: pendSum, totalUnits: uSum,
        graphLabels: filter === 'weekly' ? Object.keys(wUnits) : Object.keys(mUnits),
        graphValues: filter === 'weekly' ? Object.values(wUnits) : Object.values(mUnits)
      });
      setLoading(false);
    });
    return () => unsubscribe();
  }, [filter, motorHP]);

  const chartConfig = {
    backgroundColor: "#FFF",
    backgroundGradientFrom: "#FFF",
    backgroundGradientTo: "#FFF",
    decimalPlaces: 1,
    color: (opacity = 1) => `rgba(31, 122, 99, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(100, 100, 100, ${opacity})`,
    propsForDots: { r: "4", strokeWidth: "2", stroke: "#1F7A63" }
  };

  if (loading) return <View style={{flex:1, justifyContent:'center'}}><ActivityIndicator size="large" color="#1F7A63" /></View>;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      {/* KeyboardAvoidingView lagaya hai taake HP input keyboard ke nechy na chhupe */}
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{flex: 1}}>
        <ScrollView showsVerticalScrollIndicator={false}>
          
          <LinearGradient colors={['#1F7A63', '#2a9d82']} style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <Text style={styles.backText}>{t('analytics.backBilling')}</Text>
            </TouchableOpacity>
            <Text style={styles.mainTitle}>{t('analytics.title')}</Text>
            
            <View style={styles.toggleRow}>
              <TouchableOpacity style={[styles.toggleButton, filter === 'weekly' && styles.toggleActive]} onPress={() => setFilter('weekly')}>
                <Text style={[styles.toggleText, filter === 'weekly' && styles.toggleTextActive]}>{t('analytics.weeklyFlow')}</Text></TouchableOpacity>
              <TouchableOpacity style={[styles.toggleButton, filter === 'monthly' && styles.toggleActive]} onPress={() => setFilter('monthly')}>
                <Text style={[styles.toggleText, filter === 'monthly' && styles.toggleTextActive]}>{t('analytics.monthlyFlow')}</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>

          <View style={styles.content}>
            
            {/* 1. Recovery Graph (Paid/Pending) */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>{t('analytics.recoveryStatus')}</Text>
              <PieChart
                data={[
                  { name: t('analytics.paid'), population: data.paid, color: "#1F7A63", legendFontColor: "#555" }, // <--- YAHAN CHANGE
                  { name: t('analytics.pending'), population: data.pending, color: "#E63946", legendFontColor: "#555" } 
                ]}
                width={screenWidth - 40} height={180} chartConfig={chartConfig} accessor={"population"} backgroundColor={"transparent"} paddingLeft={"15"} absolute
              />
            </View>

            {/* 2. Usage Graph (Scrollable kWh) */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>{filter === 'weekly' ? t('analytics.weeklyUnits') : t('analytics.yearlyUnits')}</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <LineChart
                  data={{ labels: data.graphLabels, datasets: [{ data: data.graphValues }] }}
                  width={filter === 'weekly' ? screenWidth - 40 : screenWidth * 2.5}
                  height={220} chartConfig={chartConfig} bezier fromZero
                  style={{ borderRadius: 16, marginTop: 10 }}
                />
              </ScrollView>
              <View style={styles.unitBox}>
                 <Text style={styles.unitLabel}>{t('analytics.totalConsumption')}</Text>
                 <Text style={styles.unitValue}>{data.totalUnits.toFixed(2)} kWh</Text>
              </View>
            </View>

            {/* 3. Motor Setup (Input) */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>{t('analytics.motorConfig')}</Text>
              <View style={styles.inputRow}>
                <Text style={{color: '#555', fontWeight: '500'}}>{t('analytics.enterHP')}</Text>
                <TextInput 
                  style={styles.input} 
                  keyboardType="numeric" 
                  value={motorHP} 
                  onChangeText={setMotorHP}
                  placeholder={t('analytics.hpPlaceholder')}
                />
              </View>
            </View>

            {/* 4. Bottom Summary */}
            <View style={styles.profitCard}>
              <Text style={{color: 'rgba(255,255,255,0.8)', fontSize: 14}}>{t('analytics.totalPending')}</Text> 
              <Text style={styles.profitValue}>Rs {data.pending.toFixed(0)}</Text>
              <View style={styles.footerRow}>
                <Text style={{color: '#FFD166', fontWeight: 'bold'}}>{t('analytics.paid')}: Rs {data.paid}</Text> 
                 <Text style={{color: '#FFF'}}>Units: {data.totalUnits.toFixed(1)}</Text>
              </View>
            </View>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default AnalyticsScreen;