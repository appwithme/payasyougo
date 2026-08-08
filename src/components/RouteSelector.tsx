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
import { COLORS, SPACING, RADIUS } from '../theme/colors';
import { type } from '../theme/typography';
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
          <Text style={styles.selectorLabel}>From</Text>
          <Text style={[styles.selectorValue, !from && styles.placeholder]}>
            {from || 'Select pickup'}
          </Text>
        </View>
        <Ionicons name="chevron-down" size={18} color={COLORS.textMuted} />
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
          <Text style={styles.selectorLabel}>To</Text>
          <Text style={[styles.selectorValue, !to && styles.placeholder]}>
            {to || (from ? 'Select destination' : 'Pick origin first')}
          </Text>
        </View>
        <Ionicons name="chevron-down" size={18} color={COLORS.textMuted} />
      </TouchableOpacity>

      {from && to && !currentRoute && (
        <View style={styles.noRoute}>
          <Ionicons name="alert-circle-outline" size={16} color={COLORS.error} />
          <Text style={styles.noRouteText}>No route for this combination</Text>
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
              {openPicker === 'from' ? 'Pickup' : 'Destination'}
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
                  <Text style={styles.optionText}>{item}</Text>
                  <Ionicons name="chevron-forward" size={16} color={COLORS.textMuted} />
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
  },
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    minHeight: 120,
  },
  loadingText: { ...type.caption },
  errorText: {
    ...type.caption,
    color: COLORS.error,
    textAlign: 'center',
    marginTop: 6,
  },
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.xs,
  },
  dotFrom: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.ink,
    marginRight: SPACING.md,
  },
  dotTo: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.primary,
    marginRight: SPACING.md,
  },
  connectorLine: {
    width: 1,
    height: 20,
    backgroundColor: COLORS.border,
    marginLeft: 4.5,
    marginVertical: 2,
  },
  selectorContent: { flex: 1 },
  selectorLabel: { ...type.caption, fontSize: 12 },
  selectorValue: {
    ...type.bodyBold,
    marginTop: 2,
  },
  placeholder: {
    color: COLORS.textMuted,
    fontFamily: 'DMSans_400Regular',
  },
  noRoute: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.md,
    gap: 6,
  },
  noRouteText: {
    ...type.caption,
    color: COLORS.error,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(27, 43, 75, 0.4)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    padding: SPACING.xl,
    paddingBottom: 40,
    maxHeight: '60%',
  },
  modalHandle: {
    width: 36,
    height: 4,
    backgroundColor: COLORS.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: SPACING.lg,
  },
  modalTitle: {
    ...type.subheading,
    marginBottom: SPACING.md,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  optionText: { ...type.bodyBold },
});

export default RouteSelector;
