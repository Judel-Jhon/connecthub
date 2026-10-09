import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Linking,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import { globalStyles } from '../styles/globalStyles';
import { BottomNavBar } from '../components/BottomNavBar';
import {
  MOCK_EMERGENCY_ALERTS,
  EMERGENCY_TYPE_LABELS,
  EMERGENCY_TYPE_COLORS,
  EMERGENCY_TYPE_ICONS,
  EmergencyAlert,
  EmergencyType,
} from '../constants/connectHubData';

const TYPE_FILTERS: { label: string; value: EmergencyType | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: '🔥 Fire', value: 'fire' },
  { label: '🛡 Police', value: 'police' },
  { label: '🩺 Medical', value: 'medical' },
  { label: '⚠️ Accident', value: 'accident' },
];

const STATUS_FILTERS: { label: string; value: 'all' | 'active' | 'responding' | 'resolved' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Responding', value: 'responding' },
  { label: 'Resolved', value: 'resolved' },
];

export default function AdminEmergencyScreen() {
  const [alerts, setAlerts] = useState<EmergencyAlert[]>([...MOCK_EMERGENCY_ALERTS]);
  const [typeFilter, setTypeFilter] = useState<EmergencyType | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'responding' | 'resolved'>('all');

  useFocusEffect(
    useCallback(() => {
      setAlerts([...MOCK_EMERGENCY_ALERTS]);
    }, [])
  );

  const markResponding = (id: string) => {
    const found = MOCK_EMERGENCY_ALERTS.find((a) => a.id === id);
    if (found) found.status = 'responding';
    setAlerts([...MOCK_EMERGENCY_ALERTS]);
  };

  const markResolved = (id: string) => {
    const found = MOCK_EMERGENCY_ALERTS.find((a) => a.id === id);
    if (found) found.status = 'resolved';
    setAlerts([...MOCK_EMERGENCY_ALERTS]);
  };

  const markActive = (id: string) => {
    const found = MOCK_EMERGENCY_ALERTS.find((a) => a.id === id);
    if (found) found.status = 'active';
    setAlerts([...MOCK_EMERGENCY_ALERTS]);
  };

  const openMap = (lat: number, lng: number) => {
    Linking.openURL(`https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}&zoom=16`);
  };

  const filteredAlerts = alerts.filter((a) => {
    const matchType = typeFilter === 'all' || a.type === typeFilter;
    const matchStatus = statusFilter === 'all' || a.status === statusFilter;
    return matchType && matchStatus;
  });

  const activeCount = alerts.filter((a) => a.status === 'active').length;
  const respondingCount = alerts.filter((a) => a.status === 'responding').length;
  const resolvedCount = alerts.filter((a) => a.status === 'resolved').length;

  return (
    <SafeAreaView style={globalStyles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#B91C1C" />

      {/* ── Hero Header ── */}
      <View style={s.heroHeader}>
        <View style={s.heroTop}>
          <View>
            <Text style={s.heroTitle}>Emergency Center</Text>
            <Text style={s.heroSub}>Real-time SOS alert management</Text>
          </View>
          {activeCount > 0 && (
            <View style={s.heroBadge}>
              <View style={s.heroBadgeDot} />
              <Text style={s.heroBadgeText}>{activeCount} Active</Text>
            </View>
          )}
        </View>

        {/* Stats row */}
        <View style={s.heroStats}>
          <View style={s.heroStat}>
            <Text style={s.heroStatNum}>{alerts.length}</Text>
            <Text style={s.heroStatLabel}>Total</Text>
          </View>
          <View style={s.heroStatDivider} />
          <View style={s.heroStat}>
            <Text style={[s.heroStatNum, { color: '#FCA5A5' }]}>{activeCount}</Text>
            <Text style={s.heroStatLabel}>Active</Text>
          </View>
          <View style={s.heroStatDivider} />
          <View style={s.heroStat}>
            <Text style={[s.heroStatNum, { color: '#FDE68A' }]}>{respondingCount}</Text>
            <Text style={s.heroStatLabel}>Responding</Text>
          </View>
          <View style={s.heroStatDivider} />
          <View style={s.heroStat}>
            <Text style={[s.heroStatNum, { color: '#6EE7B7' }]}>{resolvedCount}</Text>
            <Text style={s.heroStatLabel}>Resolved</Text>
          </View>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* ── Type Filter ── */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={globalStyles.categoryScroll}
        >
          {TYPE_FILTERS.map((f) => (
            <TouchableOpacity
              key={f.value}
              style={[globalStyles.pill, typeFilter === f.value && globalStyles.pillActive]}
              onPress={() => setTypeFilter(f.value)}
            >
              <Text style={[globalStyles.pillText, typeFilter === f.value && globalStyles.pillTextActive]}>
                {f.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* ── Status Filter ── */}
        <View style={s.statusFilters}>
          {STATUS_FILTERS.map((f) => {
            const isActive = statusFilter === f.value;
            const color =
              f.value === 'active' ? '#EF4444' :
              f.value === 'responding' ? '#F59E0B' :
              f.value === 'resolved' ? '#10B981' : '#4F46E5';
            return (
              <TouchableOpacity
                key={f.value}
                style={[s.statusChip, isActive && { backgroundColor: color, borderColor: color }]}
                onPress={() => setStatusFilter(f.value)}
              >
                <Text style={[s.statusChipText, isActive && { color: '#FFF' }]}>{f.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* ── Count ── */}
        <View style={globalStyles.sectionTitleRow}>
          <Text style={globalStyles.sectionTitle}>
            {filteredAlerts.length === 0 ? 'No Alerts' : `${filteredAlerts.length} Alert${filteredAlerts.length > 1 ? 's' : ''}`}
          </Text>
          {filteredAlerts.length > 0 && (
            <Text style={[globalStyles.sectionLink, { color: '#EF4444' }]}>
              {filteredAlerts.filter((a) => a.status !== 'resolved').length} unresolved
            </Text>
          )}
        </View>

        {/* ── Alert Cards ── */}
        <View style={{ paddingHorizontal: 20 }}>
          {filteredAlerts.length === 0 ? (
            <View style={globalStyles.emptyState}>
              <Ionicons name="shield-checkmark" size={56} color="#10B981" />
              <Text style={[globalStyles.emptyStateText, { fontSize: 18, fontWeight: '700', color: '#0F172A', marginTop: 16 }]}>
                All Clear!
              </Text>
              <Text style={[globalStyles.emptyStateText, { marginTop: 4 }]}>
                No emergency alerts matching your filters.
              </Text>
            </View>
          ) : (
            filteredAlerts.map((alert) => <AlertCard
              key={alert.id}
              alert={alert}
              onMarkResponding={markResponding}
              onMarkResolved={markResolved}
              onMarkActive={markActive}
              onOpenMap={openMap}
            />)
          )}
        </View>
      </ScrollView>

      <BottomNavBar variant="admin" />
    </SafeAreaView>
  );
}

// ── Alert Card Component ───────────────────────────────────────
function AlertCard({
  alert,
  onMarkResponding,
  onMarkResolved,
  onMarkActive,
  onOpenMap,
}: {
  alert: EmergencyAlert;
  onMarkResponding: (id: string) => void;
  onMarkResolved: (id: string) => void;
  onMarkActive: (id: string) => void;
  onOpenMap: (lat: number, lng: number) => void;
}) {
  const color = EMERGENCY_TYPE_COLORS[alert.type];
  const icon = EMERGENCY_TYPE_ICONS[alert.type];
  const isActive = alert.status === 'active';
  const isResponding = alert.status === 'responding';
  const isResolved = alert.status === 'resolved';

  const statusColor = isActive ? '#EF4444' : isResponding ? '#F59E0B' : '#10B981';
  const statusBg = isActive ? '#FEF2F2' : isResponding ? '#FFFBEB' : '#F0FDF4';
  const borderColor = isActive ? '#FECACA' : isResponding ? '#FDE68A' : '#BBF7D0';

  return (
    <View style={[s.alertCard, { borderColor, backgroundColor: statusBg }]}>
      {/* Top accent bar */}
      <View style={[s.alertAccent, { backgroundColor: color }]} />

      {/* Header */}
      <View style={s.alertHeader}>
        <View style={[s.alertTypeIcon, { backgroundColor: color + '18' }]}>
          <Ionicons name={icon as any} size={24} color={color} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={s.alertTypeName}>{EMERGENCY_TYPE_LABELS[alert.type]}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2 }}>
            <View style={[s.miniAvatar, { backgroundColor: color + '20' }]}>
              <Text style={[s.miniAvatarText, { color }]}>{alert.reporterAvatar}</Text>
            </View>
            <Text style={s.alertReporter}>{alert.reportedBy}</Text>
          </View>
        </View>
        <View style={[s.statusPill, { backgroundColor: statusColor }]}>
          <View style={[s.statusDot, isActive && s.statusDotPulse]} />
          <Text style={s.statusPillText}>
            {isActive ? 'ACTIVE' : isResponding ? 'RESPONDING' : 'RESOLVED'}
          </Text>
        </View>
      </View>

      {/* Time */}
      <View style={s.timeRow}>
        <Ionicons name="time-outline" size={13} color="#94A3B8" />
        <Text style={s.timeText}>{alert.dateReported} at {alert.timestamp}</Text>
      </View>

      {/* Location */}
      <TouchableOpacity
        style={s.locationRow}
        onPress={() => onOpenMap(alert.latitude, alert.longitude)}
        activeOpacity={0.8}
      >
        <View style={s.locationIconWrap}>
          <Ionicons name="location" size={16} color="#EF4444" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={s.locationText} numberOfLines={2}>{alert.locationLabel}</Text>
          <Text style={s.coordsText}>
            {alert.latitude.toFixed(5)}, {alert.longitude.toFixed(5)}
          </Text>
        </View>
        <View style={s.mapBadge}>
          <Ionicons name="map-outline" size={12} color="#4F46E5" />
          <Text style={s.mapBadgeText}>Open Map</Text>
        </View>
      </TouchableOpacity>

      {/* Divider */}
      <View style={s.divider} />

      {/* Action buttons */}
      <View style={s.actions}>
        {isActive && (
          <TouchableOpacity
            style={[s.actionBtn, { backgroundColor: '#F59E0B' }]}
            onPress={() => onMarkResponding(alert.id)}
            activeOpacity={0.85}
          >
            <Ionicons name="radio-button-on" size={15} color="#FFF" />
            <Text style={s.actionBtnText}>Responding</Text>
          </TouchableOpacity>
        )}
        {isResponding && (
          <TouchableOpacity
            style={[s.actionBtn, { backgroundColor: '#EF4444', flex: 0.48 }]}
            onPress={() => onMarkActive(alert.id)}
            activeOpacity={0.85}
          >
            <Ionicons name="arrow-undo" size={15} color="#FFF" />
            <Text style={s.actionBtnText}>Revert</Text>
          </TouchableOpacity>
        )}
        {!isResolved && (
          <TouchableOpacity
            style={[s.actionBtn, { backgroundColor: '#10B981' }]}
            onPress={() => onMarkResolved(alert.id)}
            activeOpacity={0.85}
          >
            <Ionicons name="checkmark-circle" size={15} color="#FFF" />
            <Text style={s.actionBtnText}>Mark Resolved</Text>
          </TouchableOpacity>
        )}
        {isResolved && (
          <View style={[s.actionBtn, { backgroundColor: '#ECFDF5', flex: 1 }]}>
            <Ionicons name="checkmark-done-circle" size={15} color="#10B981" />
            <Text style={[s.actionBtnText, { color: '#10B981' }]}>Resolved</Text>
          </View>
        )}
      </View>
    </View>
  );
}

// ── Styles ─────────────────────────────────────────────────────
const s = StyleSheet.create({
  // Hero
  heroHeader: {
    backgroundColor: '#991B1B',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
    marginBottom: 8,
  },
  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 18,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFF',
    letterSpacing: -0.5,
  },
  heroSub: {
    fontSize: 13,
    color: '#FCA5A5',
    fontWeight: '500',
    marginTop: 2,
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  heroBadgeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FCA5A5',
  },
  heroBadgeText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFF',
  },
  heroStats: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 16,
    padding: 16,
    justifyContent: 'space-around',
  },
  heroStat: {
    alignItems: 'center',
  },
  heroStatNum: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFF',
  },
  heroStatLabel: {
    fontSize: 11,
    color: '#FCA5A5',
    fontWeight: '600',
    marginTop: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  heroStatDivider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },

  // Status filters
  statusFilters: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 8,
    marginBottom: 20,
    flexWrap: 'wrap',
  },
  statusChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFF',
  },
  statusChipText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
  },

  // Alert card
  alertCard: {
    borderRadius: 20,
    marginBottom: 16,
    borderWidth: 1.5,
    overflow: 'hidden',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  alertAccent: {
    height: 4,
    width: '100%',
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    paddingBottom: 10,
  },
  alertTypeIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertTypeName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  alertReporter: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  miniAvatar: {
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  miniAvatarText: {
    fontSize: 8,
    fontWeight: '800',
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.7)',
  },
  statusDotPulse: {
    backgroundColor: '#FFF',
  },
  statusPillText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#FFF',
    letterSpacing: 0.5,
  },

  // Time row
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  timeText: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '500',
  },

  // Location
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginHorizontal: 16,
    marginBottom: 14,
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  locationIconWrap: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: '#FEF2F2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 12,
    color: '#334155',
    fontWeight: '600',
    lineHeight: 17,
  },
  coordsText: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  mapBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
  },
  mapBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#4F46E5',
  },

  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginHorizontal: 16,
    marginBottom: 12,
  },

  // Actions
  actions: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    paddingBottom: 14,
  },
  actionBtn: {
    flex: 1,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  actionBtnText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '700',
  },
});
