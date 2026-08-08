import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Animated,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Button from '../../components/Button';
import { COLORS, SPACING, RADIUS, SHADOW } from '../../theme/colors';
import { type } from '../../theme/typography';

const PaymentSuccessScreen = ({ navigation, route }: { navigation: any; route: any }) => {
  const { transaction, driver } = route.params;
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 45,
        friction: 6,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const ReceiptRow = ({
    label,
    value,
    highlight = false,
  }: {
    label: string;
    value: string;
    highlight?: boolean;
  }) => (
    <View style={styles.receiptRow}>
      <Text style={styles.receiptLabel}>{label}</Text>
      <Text style={[styles.receiptValue, highlight && styles.receiptHighlight]}>{value}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.successSection}>
          <Animated.View style={[styles.checkCircle, { transform: [{ scale: scaleAnim }] }]}>
            <Ionicons name="checkmark" size={48} color={COLORS.white} />
          </Animated.View>

          <Animated.View style={{ opacity: fadeAnim, alignItems: 'center' }}>
            <Text style={styles.successTitle}>Payment sent</Text>
            <Text style={styles.successSubtitle}>
              Fare delivered to {driver?.name ?? 'the driver'}
            </Text>
          </Animated.View>
        </View>

        <Animated.View style={[styles.receipt, { opacity: fadeAnim }]}>
          <View style={styles.receiptHeader}>
            <Ionicons name="receipt-outline" size={22} color={COLORS.ink} />
            <Text style={styles.receiptTitle}>Receipt</Text>
          </View>

          <ReceiptRow label="Transaction" value={transaction.id} />
          <View style={styles.divider} />
          <ReceiptRow label="Route" value={`${transaction.from} → ${transaction.to}`} />
          <ReceiptRow label="Driver" value={driver?.name} />
          <ReceiptRow label="Driver ID" value={driver?.id} />
          <ReceiptRow label="Date" value={transaction.date} />
          <ReceiptRow label="Time" value={transaction.time} />
          <View style={styles.divider} />
          <ReceiptRow
            label="Amount paid"
            value={`GH₵${Number(transaction.amount).toFixed(2)}`}
            highlight
          />
          <ReceiptRow label="Status" value="Completed" />
        </Animated.View>

        <Animated.View style={[styles.buttons, { opacity: fadeAnim }]}>
          <Button
            title="View trip history"
            variant="secondary"
            onPress={() => {
              navigation.popToTop();
              navigation.navigate('TripHistory');
            }}
          />
          <Button title="Back to home" variant="ink" onPress={() => navigation.popToTop()} />
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scroll: { padding: SPACING.lg, paddingBottom: 40 },
  successSection: {
    alignItems: 'center',
    marginVertical: SPACING.xxl,
    gap: SPACING.lg,
  },
  checkCircle: {
    width: 96,
    height: 96,
    borderRadius: 32,
    backgroundColor: COLORS.success,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOW.md,
  },
  successTitle: { ...type.title, textAlign: 'center' },
  successSubtitle: { ...type.body, textAlign: 'center', marginTop: 6 },
  receipt: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.xl,
  },
  receiptHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  receiptTitle: { ...type.subheading },
  receiptRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
  },
  receiptLabel: { ...type.caption },
  receiptValue: {
    ...type.label,
    maxWidth: '60%',
    textAlign: 'right',
  },
  receiptHighlight: {
    fontFamily: 'Sora_700Bold',
    fontSize: 18,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: SPACING.sm,
  },
  buttons: { gap: SPACING.md },
});

export default PaymentSuccessScreen;
