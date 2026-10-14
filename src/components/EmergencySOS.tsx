import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Animated,
  Pressable,
  ActivityIndicator,
  Platform,
  Alert,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LeafletMap } from './LeafletMap';
import * as Location from 'expo-location';
import {
  EmergencyType,
  EMERGENCY_TYPE_LABELS,
  EMERGENCY_TYPE_COLORS,
  MOCK_EMERGENCY_ALERTS,
  MOCK_CURRENT_USER,
} from '../constants/connectHubData';
import { AuthStore } from '../constants/authStore';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ── Emergency type options ─────────────────────────────────
const EMERGENCY_TYPES: { type: EmergencyType; label: string; icon: string; desc: string }[] = [
  { type: 'fire', label: 'Fire', icon: 'flame', desc: 'Fire or smoke emergency' },
  { type: 'police', label: 'Police', icon: 'shield', desc: 'Security / criminal threat' },
  { type: 'medical', label: 'Medical', icon: 'medkit', desc: 'Injury or health emergency' },
  { type: 'accident', label: 'Accident', icon: 'warning', desc: 'Vehicle / physical accident' },
];

interface Props {
  /** Callback when an alert has been successfully submitted */
  onAlertSent?: () => void;
}

export function EmergencySOS({ onAlertSent }: Props) {
  const [modalVisible, setModalVisible] = useState(false);
  const [step, setStep] = useState<'select' | 'confirm' | 'locating' | 'success'>('select');
  const [selectedType, setSelectedType] = useState<EmergencyType | null>(null);
  const [holdProgress] = useState(new Animated.Value(0));
  const [holding, setHolding] = useState(false);
  const [location, setLocation] = useState<{ lat: number; lng: number; label: string } | null>(null);

  const holdAnimation = useRef<Animated.CompositeAnimation | null>(null);
  const holdFired = useRef(false);
  // Use useState so Animated.Value is stable without accessing ref.current during render
  const [pulseAnim] = useState(() => new Animated.Value(1));
  const [buttonShake] = useState(() => new Animated.Value(0));

  // Pulse the main SOS button
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.08, duration: 900, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 900, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [pulseAnim]);

  const openModal = () => {
    setStep('select');
    setSelectedType(null);
    setLocation(null);
    holdProgress.setValue(0);
    holdFired.current = false;
    setModalVisible(true);
  };

  const closeModal = () => {
    holdAnimation.current?.stop();
    holdProgress.setValue(0);
    setHolding(false);
    holdFired.current = false;
    setModalVisible(false);
  };

  // ── Hold-to-confirm mechanics ─────────────────────────────
  const onHoldStart = () => {
    if (!selectedType || holdFired.current) return;
    setHolding(true);
    holdFired.current = false;
    holdAnimation.current = Animated.timing(holdProgress, {
      toValue: 1,
      duration: 3000,
      useNativeDriver: false,
    });
    holdAnimation.current.start(({ finished }) => {
      if (finished) {
        holdFired.current = true;
        setHolding(false);
        triggerEmergency();
      }
    });
  };

  const onHoldEnd = () => {
    if (holdFired.current) return;
    holdAnimation.current?.stop();
    holdProgress.setValue(0);
    setHolding(false);
    // Shake to hint "not held long enough"
    Animated.sequence([
      Animated.timing(buttonShake, { toValue: 8, duration: 60, useNativeDriver: true }),
      Animated.timing(buttonShake, { toValue: -8, duration: 60, useNativeDriver: true }),
      Animated.timing(buttonShake, { toValue: 6, duration: 60, useNativeDriver: true }),
      Animated.timing(buttonShake, { toValue: 0, duration: 60, useNativeDriver: true }),
    ]).start();
  };

  // ── GPS + Submit ──────────────────────────────────────────
  const triggerEmergency = useCallback(async () => {
    setStep('locating');
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      let lat = 8.0730; // JRMSU fallback coords (Dipolog City)
      let lng = 123.2736;
      let label = 'JRMSU Campus, Dipolog City';

      if (status === 'granted') {
        const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
        lat = pos.coords.latitude;
        lng = pos.coords.longitude;
        // Reverse geocode using Nominatim (no API key needed)
        try {
          const geo = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
            { headers: { 'User-Agent': 'ConnectHub-Emergency/1.0' } }
          );
          const geoData = await geo.json();
          label = geoData.display_name
            ? geoData.display_name.split(',').slice(0, 3).join(',')
            : `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
        } catch {
          label = `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
        }
      }

      setLocation({ lat, lng, label });

      // Submit to mock store
      const now = new Date();
      const pad = (n: number) => String(n).padStart(2, '0');
      const timestamp = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
      const dateStr = now.toLocaleDateString('en-PH', {
        month: 'short', day: 'numeric', year: 'numeric',
      });

      // Get the actual logged-in user for the alert
      const reporter = AuthStore.getUser() ?? MOCK_CURRENT_USER;

      MOCK_EMERGENCY_ALERTS.unshift({
        id: `sos-${Date.now()}`,
        type: selectedType!,
        reportedBy: reporter.name,
        reporterAvatar: reporter.avatar,
        latitude: lat,
        longitude: lng,
        locationLabel: label,
        dateReported: dateStr,
        timestamp,
        status: 'active',
      });

      setStep('success');
      onAlertSent?.();
    } catch {
      Alert.alert('Error', 'Could not get location. Please try again.');
      setStep('select');
    }
  }, [selectedType, onAlertSent]);

  // ── Hold progress bar interpolation ──────────────────────
  const progressWidth = holdProgress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <>
      {/* ── Floating SOS Button ───────────────────── */}
      <Animated.View
        style={[
          styles.sosButtonWrap,
          { transform: [{ scale: pulseAnim }] },
        ]}
      >
        <TouchableOpacity
          style={styles.sosButton}
          onPress={openModal}
          activeOpacity={0.85}
          accessible
          accessibilityLabel="Emergency SOS Button"
          accessibilityRole="button"
        >
          <View style={styles.sosInner}>
            <Ionicons name="alert-circle" size={28} color="#FFF" />
            <Text style={styles.sosLabel}>SOS</Text>
          </View>
        </TouchableOpacity>
      </Animated.View>

      {/* ── Emergency Modal ───────────────────────── */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={closeModal}
      >
        <View style={styles.overlay}>
          {/* Backdrop */}
          <TouchableOpacity style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} onPress={closeModal} />

          <View style={styles.sheet}>
            {/* ── Header ── */}
            <View style={styles.sheetHeader}>
              <View style={styles.sheetHandle} />
              <View style={styles.sheetTitleRow}>
                <View style={styles.sosIconSmall}>
                  <Ionicons name="alert-circle" size={20} color="#EF4444" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.sheetTitle}>Emergency SOS</Text>
                  <Text style={styles.sheetSubtitle}>
                    Your location will be sent to emergency services
                  </Text>
                </View>
                <TouchableOpacity onPress={closeModal} style={styles.closeBtn}>
                  <Ionicons name="close" size={20} color="#64748B" />
                </TouchableOpacity>
              </View>
            </View>

            {/* ── Step: Select type ── */}
            {step === 'select' && (
              <>
                <Text style={styles.stepLabel}>Select Emergency Type</Text>
                <View style={styles.typeGrid}>
                  {EMERGENCY_TYPES.map((et) => {
                    const isActive = selectedType === et.type;
                    const color = EMERGENCY_TYPE_COLORS[et.type];
                    return (
                      <TouchableOpacity
                        key={et.type}
                        style={[
                          styles.typeCard,
                          isActive && { borderColor: color, backgroundColor: color + '12' },
                        ]}
                        onPress={() => setSelectedType(et.type)}
                        activeOpacity={0.8}
                      >
                        <View style={[styles.typeIcon, { backgroundColor: color + '20' }]}>
                          <Ionicons name={et.icon as any} size={26} color={color} />
                        </View>
                        <Text style={[styles.typeLabel, isActive && { color }]}>{et.label}</Text>
                        <Text style={styles.typeDesc}>{et.desc}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                {/* Security warning */}
                <View style={styles.warningBox}>
                  <Ionicons name="information-circle-outline" size={16} color="#92400E" />
                  <Text style={styles.warningText}>
                    False emergency reports are a violation of campus policy and may result in disciplinary action.
                  </Text>
                </View>

                {/* Hold-to-send button */}
                <View style={{ marginTop: 16 }}>
                  <Animated.View style={{ transform: [{ translateX: buttonShake }] }}>
                    <Pressable
                      onPressIn={onHoldStart}
                      onPressOut={onHoldEnd}
                      disabled={!selectedType}
                      style={[
                        styles.holdButton,
                        !selectedType && styles.holdButtonDisabled,
                      ]}
                    >
                      <View style={styles.holdProgressBg}>
                        <Animated.View
                          style={[
                            styles.holdProgressFill,
                            { width: progressWidth },
                          ]}
                        />
                      </View>
                      <View style={styles.holdButtonContent}>
                        <Ionicons
                          name={holding ? 'radio-button-on' : 'radio-button-off'}
                          size={20}
                          color={selectedType ? '#FFF' : '#CBD5E1'}
                        />
                        <Text style={[styles.holdButtonText, !selectedType && { color: '#94A3B8' }]}>
                          {holding
                            ? 'Hold… sending SOS'
                            : selectedType
                            ? `Hold 3s to send — ${EMERGENCY_TYPE_LABELS[selectedType]}`
                            : 'Select an emergency type first'}
                        </Text>
                      </View>
                    </Pressable>
                  </Animated.View>
                  {selectedType && (
                    <Text style={styles.holdHint}>
                      Press and hold the button for 3 seconds to confirm
                    </Text>
                  )}
                </View>
              </>
            )}

            {/* ── Step: Locating ── */}
            {step === 'locating' && (
              <View style={styles.locatingWrap}>
                <ActivityIndicator size="large" color="#EF4444" />
                <Text style={styles.locatingTitle}>Getting your location…</Text>
                <Text style={styles.locatingDesc}>
                  Fetching GPS coordinates and sending alert to emergency services.
                </Text>
              </View>
            )}

            {/* ── Step: Success ── */}
            {step === 'success' && location && (
              <>
                <View style={styles.successHeader}>
                  <View style={styles.successIcon}>
                    <Ionicons name="checkmark-circle" size={40} color="#10B981" />
                  </View>
                  <Text style={styles.successTitle}>SOS Alert Sent!</Text>
                  <Text style={styles.successDesc}>
                    {selectedType && EMERGENCY_TYPE_LABELS[selectedType]} alert has been dispatched.{'\n'}
                    Emergency services have been notified.
                  </Text>
                </View>

                {/* Interactive Leaflet Map */}
                <View style={styles.mapWrap}>
                  <Text style={styles.mapLabel}>📍 Your Pinned Location</Text>
                  <LeafletMap
                    latitude={location.lat}
                    longitude={location.lng}
                    height={200}
                    zoom={16}
                    label={location.label}
                  />
                  <View style={[styles.coordRow, { marginTop: 10 }]}>
                    <Ionicons name="location-outline" size={14} color="#64748B" />
                    <Text style={styles.coordText} numberOfLines={2}>
                      {location.label}
                    </Text>
                  </View>
                  <View style={styles.coordRow}>
                    <Ionicons name="navigate-outline" size={14} color="#64748B" />
                    <Text style={styles.coordText}>
                      {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                    </Text>
                  </View>
                </View>

                {/* Sent-to row */}
                <View style={styles.sentToRow}>
                  <Text style={styles.sentToLabel}>Alert sent to:</Text>
                  <View style={styles.sentToItems}>
                    <View style={styles.sentToChip}>
                      <Ionicons name="flame" size={12} color="#EF4444" />
                      <Text style={[styles.sentToChipText, { color: '#EF4444' }]}>Fire Station</Text>
                    </View>
                    <View style={styles.sentToChip}>
                      <Ionicons name="shield" size={12} color="#1D4ED8" />
                      <Text style={[styles.sentToChipText, { color: '#1D4ED8' }]}>Police Station</Text>
                    </View>
                    <View style={styles.sentToChip}>
                      <Ionicons name="medkit" size={12} color="#10B981" />
                      <Text style={[styles.sentToChipText, { color: '#10B981' }]}>Medical Team</Text>
                    </View>
                  </View>
                </View>

                <TouchableOpacity style={styles.doneBtn} onPress={closeModal}>
                  <Text style={styles.doneBtnText}>Done</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </>
  );
}

// ── Styles ────────────────────────────────────────────────────
const styles = StyleSheet.create({
  // Floating button
  sosButtonWrap: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    zIndex: 100,
  },
  sosButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 14,
    elevation: 12,
    borderWidth: 3,
    borderColor: '#FCA5A5',
  },
  sosInner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  sosLabel: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
    marginTop: 1,
  },

  // Overlay + Sheet
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 28,
    maxHeight: '92%',
  },
  sheetHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E2E8F0',
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 16,
  },
  sheetHeader: {
    marginBottom: 8,
  },
  sheetTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 4,
  },
  sosIconSmall: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#FEF2F2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  sheetSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Type grid
  stepLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#475569',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 14,
    marginTop: 8,
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
  },
  typeCard: {
    width: (SCREEN_WIDTH - 60) / 2,
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 14,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    alignItems: 'flex-start',
  },
  typeIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  typeLabel: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 3,
  },
  typeDesc: {
    fontSize: 11,
    color: '#64748B',
    lineHeight: 15,
  },

  // Warning box
  warningBox: {
    flexDirection: 'row',
    gap: 8,
    backgroundColor: '#FFFBEB',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#FDE68A',
    alignItems: 'flex-start',
  },
  warningText: {
    flex: 1,
    fontSize: 12,
    color: '#92400E',
    lineHeight: 17,
  },

  // Hold button
  holdButton: {
    backgroundColor: '#EF4444',
    height: 56,
    borderRadius: 16,
    overflow: 'hidden',
    justifyContent: 'center',
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  holdButtonDisabled: {
    backgroundColor: '#F1F5F9',
    shadowOpacity: 0,
    elevation: 0,
  },
  holdProgressBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.12)',
  },
  holdProgressFill: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    backgroundColor: '#B91C1C',
    borderRadius: 16,
  },
  holdButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingHorizontal: 20,
  },
  holdButtonText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  holdHint: {
    textAlign: 'center',
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 8,
  },

  // Locating step
  locatingWrap: {
    alignItems: 'center',
    paddingVertical: 40,
    gap: 16,
  },
  locatingTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  locatingDesc: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
  },

  // Success step
  successHeader: {
    alignItems: 'center',
    paddingTop: 16,
    marginBottom: 20,
  },
  successIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#ECFDF5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
    borderWidth: 3,
    borderColor: '#6EE7B7',
  },
  successTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 8,
  },
  successDesc: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
  },

  // Map
  mapWrap: {
    marginBottom: 16,
  },
  mapLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  mapContainer: {
    height: 160,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#E2E8F0',
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  mapPlaceholder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
  },
  mapPin: {
    position: 'absolute',
    alignSelf: 'center',
    top: '40%',
    zIndex: 10,
  },
  coordRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    marginBottom: 4,
  },
  coordText: {
    flex: 1,
    fontSize: 12,
    color: '#475569',
    lineHeight: 17,
  },

  // Sent to
  sentToRow: {
    marginBottom: 20,
  },
  sentToLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  sentToItems: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  sentToChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  sentToChipText: {
    fontSize: 12,
    fontWeight: '700',
  },

  // Done button
  doneBtn: {
    backgroundColor: '#10B981',
    height: 52,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
  },
  doneBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '800',
  },
});
