import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { fetchRoutes } from '../services/routesService';
import { COLORS, FONT_SIZE, SPACING, RADIUS, SHADOW } from '../theme/colors';
import { RouteInfo } from '../types';

interface RouteSelection {
  from: string | null;
  to: string | null;
  route: RouteInfo | null;
}

const RouteSelector = ({ onRouteChange }: { onRouteChange: (selection: RouteSelection) => void }) => {
  const [from, setFrom] = useState<string | null>(null);
  const [to, setTo] = useState<string | null>(null);
  const [openPicker, setOpenPicker] = useState<'from' | 'to' | null>(null);
  const [locations, setLocations] = useState<string[]>([]);
  const [routes, setRoutes] = useState<RouteInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchRoutes();
        setLocations(data.locations);
        setRoutes(data.routes);
      } catch (err: any) {
        setError(err?.message || 'Failed to load routes');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const getRoute = (f: string | null, t: string | null) => {
    if (!f || !t) return null;
    return routes.find((r) => r.from === f && r.to === t) || null;
  };

  const handleSelect = (location: string) => {
    let newFrom = from;
    let newTo = to;

    if (openPicker === 'from') {
      newFrom = location;
      setFrom(location);
      if (location === to) {
        newTo = null;
        setTo(null);
      }
    } else {
      newTo = location;
      setTo(location);
    }
    setOpenPicker(null);

    const route = getRoute(newFrom, newTo);
    onRouteChange({ from: newFrom, to: newTo, route });
  };

  const currentRoute = getRoute(from, to);
  const toOptions = locations.filter((l) => l !== from);

  if (loading) {
    return (
      <View style={[styles.wrapper, styles.centered]}>
        <ActivityIndicator color={COLORS.ink} />
        <Text style={styles.loadingText}>Loading routes…</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.wrapper, styles.centered]}>
        <Ionicons name="cloud-offline-outline" size={22} color={COLORS.error} />
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity
        style={styles.selector}
        onPress={() => setOpenPicker('from')}
        activeOpacity={0.8}
      >
        <View style={styles.dotFrom} />
        <View style={styles.selectorContent}>
          <Text style={styles.selectorLabel}>FROM</Text>
          <Text style={[styles.selectorValue, !from && styles.placeholder]}>
            {from || 'Select pickup location'}
          </Text>
        </View>
        <Ionicons name="chevron-down" size={20} color={COLORS.textMuted} />
      </TouchableOpacity>

      <View style={styles.connectorLine} />

      <TouchableOpacity
        style={styles.selector}
        onPress={() => {
          if (from) setOpenPicker('to');
        }}
        activeOpacity={from ? 0.8 : 0.4}
      >
        <View style={styles.dotTo} />
        <View style={styles.selectorContent}>
          <Text style={styles.selectorLabel}>TO</Text>
          <Text style={[styles.selectorValue, !to && styles.placeholder]}>
            {to || (from ? 'Select destination' : 'Pick origin first')}
          </Text>
        </View>
        <Ionicons name="chevron-down" size={20} color={COLORS.textMuted} />
      </TouchableOpacity>

      {from && to && !currentRoute && (
        <View style={styles.noRoute}>
          <Ionicons name="alert-circle-outline" size={18} color={COLORS.error} />
          <Text style={styles.noRouteText}>No available route for this combination</Text>
        </View>
      )}

      <Modal
        visible={!!openPicker}
        transparent
        animationType="fade"
        onRequestClose={() => setOpenPicker(null)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => setOpenPicker(null)}
          activeOpacity={1}
        >
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>
              {openPicker === 'from' ? 'Select Pickup Location' : 'Select Destination'}
            </Text>
            <FlatList
              data={openPicker === 'to' ? toOptions : locations}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.optionRow}
                  onPress={() => handleSelect(item)}
                  activeOpacity={0.7}
                >
                  <Ionicons name="location-outline" size={24} color={COLORS.textPrimary} />
                  <Text style={styles.optionText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOW.sm,
  },
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    minHeight: 120,
  },
  loadingText: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZE.sm,
  },
  errorText: {
    color: COLORS.error,
    fontSize: FONT_SIZE.sm,
    textAlign: 'center',
    marginTop: 6,
  },
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.xs,
  },
  dotFrom: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: COLORS.textPrimary,
    marginRight: SPACING.md,
  },
  dotTo: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: COLORS.primary,
    marginRight: SPACING.md,
  },
  connectorLine: {
    width: 2,
    height: 24,
    backgroundColor: COLORS.border,
    marginLeft: 6,
    marginVertical: 4,
  },
  selectorContent: { flex: 1 },
  selectorLabel: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZE.xs,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  selectorValue: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
    marginTop: 2,
  },
  placeholder: {
    color: COLORS.textMuted,
    fontWeight: '500',
  },
  noRoute: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.md,
    backgroundColor: COLORS.errorLight,
    borderRadius: RADIUS.sm,
    padding: SPACING.sm,
  },
  noRouteText: {
    color: COLORS.error,
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
    marginLeft: SPACING.xs,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    padding: SPACING.xl,
    paddingBottom: 40,
    maxHeight: '60%',
  },
  modalHandle: {
    width: 48,
    height: 5,
    backgroundColor: COLORS.border,
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: SPACING.xl,
  },
  modalTitle: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZE.lg,
    fontWeight: '800',
    marginBottom: SPACING.md,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  optionText: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZE.md,
    marginLeft: SPACING.md,
    fontWeight: '700',
  },
});

export default RouteSelector;
