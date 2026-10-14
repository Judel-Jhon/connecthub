import { Ionicons } from '@expo/vector-icons';
import { Href, router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  Linking,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { BottomNavBar } from '../components/BottomNavBar';
import {
  EMERGENCY_TYPE_COLORS,
  EMERGENCY_TYPE_ICONS,
  EMERGENCY_TYPE_LABELS,
  EmergencyAlert,
  MOCK_CONCERNS,
  MOCK_EMERGENCY_ALERTS,
  STATUS_COLORS,
  STATUS_LABELS,
} from '../constants/connectHubData';

export default function AdminDashboardScreen() {
  const [emergencyAlerts, setEmergencyAlerts] = useState<EmergencyAlert[]>([...MOCK_EMERGENCY_ALERTS]);

  useFocusEffect(
    useCallback(() => {
      setEmergencyAlerts([...MOCK_EMERGENCY_ALERTS]);
    }, [])
  );

  const markResponding = (id: string) => {
    const found = MOCK_EMERGENCY_ALERTS.find((a) => a.id === id);
    if (found) found.status = 'responding';
    setEmergencyAlerts([...MOCK_EMERGENCY_ALERTS]);
  };

  const markResolved = (id: string) => {
    const found = MOCK_EMERGENCY_ALERTS.find((a) => a.id === id);
    if (found) found.status = 'resolved';
    setEmergencyAlerts([...MOCK_EMERGENCY_ALERTS]);
  };

  const openMap = (lat: number, lng: number) => {
    Linking.openURL(`https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}&zoom=16`);
  };

  const totalConcerns = MOCK_CONCERNS.length;
  const pendingConcerns = MOCK_CONCERNS.filter((c) => c.status === 'pending');
  const underReview = MOCK_CONCERNS.filter((c) => c.status === 'under-review');
  const inProgress = MOCK_CONCERNS.filter((c) => c.status === 'in-progress');
  const resolved = MOCK_CONCERNS.filter((c) => c.status === 'resolved');
  const aiProcessed = MOCK_CONCERNS.filter((c) => c.aiSuggestedCategory);
  const activeSOSCount = emergencyAlerts.filter((a) => a.status !== 'resolved').length;

  return (
    <SafeAreaView style={s.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#3730A3" />

      {/* ── Premium Hero Header ── */}
      <View style={s.heroHeader}>
        {/* Top row */}
        <View style={s.heroTop}>
          <View>
            <Text style={s.heroGreeting}>ConnectHub Admin</Text>
            <Text style={s.heroTitle}>Dashboard</Text>
          </View>
          <TouchableOpacity
            style={s.heroAvatar}
            onPress={() => router.push('/profile' as Href)}
          >
            <Text style={s.heroAvatarText}>AD</Text>
          </TouchableOpacity>
        </View>

        {/* SOS Alert Banner — only when active */}
        {activeSOSCount > 0 && (
          <TouchableOpacity
            style={s.sosBanner}
            onPress={() => router.push('/admin-emergency' as Href)}
            activeOpacity={0.85}
          >
            <View style={s.sosBannerLeft}>
              <View style={s.sosDot} />
              <Ionicons name="alert-circle" size={20} color="#FFF" />
              <Text style={s.sosBannerText}>
                {activeSOSCount} Active SOS Alert{activeSOSCount > 1 ? 's' : ''} — Tap to respond
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="rgba(255,255,255,0.7)" />
          </TouchableOpacity>
        )}

        {/* Quick Stats */}
        <View style={s.heroStatsRow}>
          <View style={s.heroStat}>
            <Text style={s.heroStatNum}>{totalConcerns}</Text>
            <Text style={s.heroStatLabel}>Total</Text>
          </View>
          <View style={s.heroStatDivider} />
          <View style={s.heroStat}>
            <Text style={[s.heroStatNum, { color: '#FDE68A' }]}>{pendingConcerns.length}</Text>
            <Text style={s.heroStatLabel}>Pending</Text>
          </View>
          <View style={s.heroStatDivider} />
          <View style={s.heroStat}>
            <Text style={[s.heroStatNum, { color: '#93C5FD' }]}>{inProgress.length}</Text>
            <Text style={s.heroStatLabel}>Active</Text>
          </View>
          <View style={s.heroStatDivider} />
          <View style={s.heroStat}>
            <Text style={[s.heroStatNum, { color: '#6EE7B7' }]}>{resolved.length}</Text>
            <Text style={s.heroStatLabel}>Resolved</Text>
          </View>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* ── Quick Action Cards ── */}
        <View style={s.sectionRow}>
          <Text style={s.sectionTitle}>Quick Actions</Text>
        </View>
        <View style={s.quickActions}>
          <TouchableOpacity
            style={[s.qaCard, { backgroundColor: '#EEF2FF' }]}
            onPress={() => router.push('/admin-concerns' as Href)}
            activeOpacity={0.85}
          >
            <View style={[s.qaIcon, { backgroundColor: '#4F46E5' }]}>
              <Ionicons name="chatbox-ellipses" size={20} color="#FFF" />
            </View>
            <Text style={[s.qaLabel, { color: '#3730A3' }]}>All{'\n'}Concerns</Text>
            <View style={s.qaBadge}>
              <Text style={[s.qaBadgeText, { color: '#4F46E5' }]}>{totalConcerns}</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[s.qaCard, { backgroundColor: '#FFFBEB' }]}
            onPress={() => router.push('/admin-concerns' as Href)}
            activeOpacity={0.85}
          >
            <View style={[s.qaIcon, { backgroundColor: '#F59E0B' }]}>
              <Ionicons name="time" size={20} color="#FFF" />
            </View>
            <Text style={[s.qaLabel, { color: '#92400E' }]}>Needs{'\n'}Review</Text>
            <View style={s.qaBadge}>
              <Text style={[s.qaBadgeText, { color: '#F59E0B' }]}>{pendingConcerns.length}</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[s.qaCard, { backgroundColor: '#FFF1F2' }]}
            onPress={() => router.push('/admin-emergency' as Href)}
            activeOpacity={0.85}
          >
            <View style={[s.qaIcon, { backgroundColor: '#EF4444' }]}>
              <Ionicons name="alert-circle" size={20} color="#FFF" />
            </View>
            <Text style={[s.qaLabel, { color: '#991B1B' }]}>SOS{'\n'}Center</Text>
            <View style={s.qaBadge}>
              <Text style={[s.qaBadgeText, { color: '#EF4444' }]}>{activeSOSCount}</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* ── AI Stats Card ── */}
        <View style={s.sectionRow}>
          <Text style={s.sectionTitle}>AI Processing</Text>
          <Text style={s.sectionLink}>Today</Text>
        </View>
        <View style={s.aiCard}>
          <View style={s.aiCardLeft}>
            <View style={s.aiIconWrap}>
              <Ionicons name="sparkles" size={22} color="#10B981" />
            </View>
            <View>
              <Text style={s.aiCardTitle}>AI-Assisted Review</Text>
              <Text style={s.aiCardSub}>Human-in-the-Loop Framework</Text>
            </View>
          </View>
          <View style={s.aiCardRight}>
            <Text style={s.aiPercent}>
              {Math.round((aiProcessed.length / Math.max(totalConcerns, 1)) * 100)}%
            </Text>
            <Text style={s.aiRatio}>{aiProcessed.length}/{totalConcerns}</Text>
          </View>
        </View>
        {/* Progress bar */}
        <View style={s.aiProgressBg}>
          <View
            style={[
              s.aiProgressFill,
              { width: `${Math.round((aiProcessed.length / Math.max(totalConcerns, 1)) * 100)}%` },
            ]}
          />
        </View>

        {/* ── Status Breakdown ── */}
        <View style={[s.sectionRow, { marginTop: 8 }]}>
          <Text style={s.sectionTitle}>Status Breakdown</Text>
        </View>
        <View style={s.statusGrid}>
          {[
            { label: 'Pending', count: pendingConcerns.length, color: '#F59E0B', bg: '#FFFBEB', icon: 'time-outline' },
            { label: 'Under Review', count: underReview.length, color: '#6366F1', bg: '#EEF2FF', icon: 'eye-outline' },
            { label: 'In Progress', count: inProgress.length, color: '#0EA5E9', bg: '#E0F2FE', icon: 'sync-outline' },
            { label: 'Resolved', count: resolved.length, color: '#10B981', bg: '#ECFDF5', icon: 'checkmark-circle-outline' },
          ].map((item) => (
            <View key={item.label} style={[s.statusCard, { backgroundColor: item.bg }]}>
              <View style={[s.statusCardIcon, { backgroundColor: item.color + '20' }]}>
                <Ionicons name={item.icon as any} size={18} color={item.color} />
              </View>
              <Text style={[s.statusCardNum, { color: item.color }]}>{item.count}</Text>
              <Text style={s.statusCardLabel}>{item.label}</Text>
            </View>
          ))}
        </View>

        {/* ── Active SOS Alerts ── */}
        {emergencyAlerts.length > 0 && (
          <>
            <View style={s.sectionRow}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <View style={s.sosSectionDot} />
                <Text style={[s.sectionTitle, { color: '#DC2626' }]}>SOS Alerts</Text>
              </View>
              <TouchableOpacity onPress={() => router.push('/admin-emergency' as Href)}>
                <Text style={[s.sectionLink, { color: '#EF4444' }]}>View All →</Text>
              </TouchableOpacity>
            </View>

            <View style={{ paddingHorizontal: 20 }}>
              {emergencyAlerts.slice(0, 3).map((alert) => {
                const color = EMERGENCY_TYPE_COLORS[alert.type];
                const icon = EMERGENCY_TYPE_ICONS[alert.type];
                const isActive = alert.status === 'active';
                const isResponding = alert.status === 'responding';
                const statusColor = isActive ? '#EF4444' : isResponding ? '#F59E0B' : '#10B981';
                const statusBg = isActive ? '#FEF2F2' : isResponding ? '#FFFBEB' : '#F0FDF4';
                const cardBorder = isActive ? '#FECACA' : isResponding ? '#FDE68A' : '#BBF7D0';

                return (
                  <View key={alert.id} style={[s.sosCard, { backgroundColor: statusBg, borderColor: cardBorder }]}>
                    <View style={[s.sosCardAccent, { backgroundColor: color }]} />
                    <View style={s.sosCardBody}>
                      {/* Type + Status */}
                      <View style={s.sosCardHeader}>
                        <View style={[s.sosTypeIcon, { backgroundColor: color + '20' }]}>
                          <Ionicons name={icon as any} size={18} color={color} />
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={s.sosTypeName}>{EMERGENCY_TYPE_LABELS[alert.type]}</Text>
                          <Text style={s.sosReporter}>{alert.reportedBy} · {alert.timestamp}</Text>
                        </View>
                        <View style={[s.sosStatusPill, { backgroundColor: statusColor }]}>
                          <Text style={s.sosStatusText}>
                            {isActive ? 'Active' : isResponding ? 'Responding' : 'Resolved'}
                          </Text>
                        </View>
                      </View>

                      {/* Location */}
                      <TouchableOpacity
                        style={s.sosLocation}
                        onPress={() => openMap(alert.latitude, alert.longitude)}
                        activeOpacity={0.8}
                      >
                        <Ionicons name="location" size={12} color="#EF4444" />
                        <Text style={s.sosLocationText} numberOfLines={1}>{alert.locationLabel}</Text>
                        <Ionicons name="open-outline" size={11} color="#94A3B8" />
                      </TouchableOpacity>

                      {/* Actions */}
                      {alert.status !== 'resolved' && (
                        <View style={s.sosActions}>
                          {alert.status === 'active' && (
                            <TouchableOpacity
                              style={[s.sosActionBtn, { backgroundColor: '#F59E0B' }]}
                              onPress={() => markResponding(alert.id)}
                            >
                              <Text style={s.sosActionText}>Responding</Text>
                            </TouchableOpacity>
                          )}
                          <TouchableOpacity
                            style={[s.sosActionBtn, { backgroundColor: '#10B981' }]}
                            onPress={() => markResolved(alert.id)}
                          >
                            <Text style={s.sosActionText}>Resolve</Text>
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>
                  </View>
                );
              })}
              {emergencyAlerts.length > 3 && (
                <TouchableOpacity
                  style={s.viewMoreBtn}
                  onPress={() => router.push('/admin-emergency' as Href)}
                >
                  <Text style={s.viewMoreText}>View {emergencyAlerts.length - 3} more alerts →</Text>
                </TouchableOpacity>
              )}
            </View>
          </>
        )}

        {/* ── Pending Review Queue ── */}
        <View style={s.sectionRow}>
          <Text style={s.sectionTitle}>Needs Review</Text>
          <TouchableOpacity onPress={() => router.push('/admin-concerns' as Href)}>
            <Text style={s.sectionLink}>View All →</Text>
          </TouchableOpacity>
        </View>

        <View style={{ paddingHorizontal: 20 }}>
          {pendingConcerns.length === 0 ? (
            <View style={s.emptyState}>
              <Ionicons name="checkmark-done-circle" size={52} color="#10B981" />
              <Text style={s.emptyTitle}>All Clear!</Text>
              <Text style={s.emptyText}>All concerns have been reviewed.</Text>
            </View>
          ) : (
            pendingConcerns.slice(0, 4).map((concern) => (
              <TouchableOpacity
                key={concern.id}
                style={s.concernCard}
                activeOpacity={0.88}
                onPress={() =>
                  router.push({
                    pathname: '/admin-review' as any,
                    params: { id: concern.id },
                  })
                }
              >
                <View style={s.concernCardTop}>
                  <Text style={s.concernTitle} numberOfLines={2}>{concern.title}</Text>
                  <View style={[s.statusBadge, { backgroundColor: STATUS_COLORS[concern.status] + '20' }]}>
                    <Text style={[s.statusBadgeText, { color: STATUS_COLORS[concern.status] }]}>
                      {STATUS_LABELS[concern.status]}
                    </Text>
                  </View>
                </View>
                <View style={s.concernMeta}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <Ionicons name="person-outline" size={12} color="#94A3B8" />
                    <Text style={s.concernMetaText}>{concern.submittedBy}</Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <Ionicons name="calendar-outline" size={12} color="#94A3B8" />
                    <Text style={s.concernMetaText}>{concern.dateSubmitted}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={14} color="#CBD5E1" />
                </View>
                {concern.aiSuggestedCategory && (
                  <View style={s.aiBadge}>
                    <Ionicons name="sparkles" size={11} color="#10B981" />
                    <Text style={s.aiBadgeText}>AI suggestion · {concern.aiConfidence}% confidence</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>

      <BottomNavBar variant="admin" />
    </SafeAreaView>
  );
}

// ── Styles ─────────────────────────────────────────────────────
const s = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F8FAFC' },

  // Hero
  heroHeader: {
    backgroundColor: '#3730A3',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 22,
  },
  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  heroGreeting: { fontSize: 13, color: '#A5B4FC', fontWeight: '600' },
  heroTitle: { fontSize: 28, fontWeight: '900', color: '#FFF', letterSpacing: -0.5 },
  heroAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  heroAvatarText: { color: '#FFF', fontWeight: '800', fontSize: 15 },

  // SOS Banner
  sosBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#B91C1C',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#EF4444',
  },
  sosBannerLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  sosDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FCA5A5',
  },
  sosBannerText: { color: '#FFF', fontSize: 13, fontWeight: '700' },

  // Hero Stats
  heroStatsRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.25)',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 8,
    justifyContent: 'space-around',
  },
  heroStat: { alignItems: 'center' },
  heroStatNum: { fontSize: 22, fontWeight: '900', color: '#FFF' },
  heroStatLabel: {
    fontSize: 10,
    color: '#A5B4FC',
    fontWeight: '600',
    marginTop: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  heroStatDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.15)' },

  // Sections
  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 24,
    marginBottom: 14,
  },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#0F172A', letterSpacing: -0.3 },
  sectionLink: { fontSize: 13, color: '#4F46E5', fontWeight: '700' },

  // Quick Actions
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
  },
  qaCard: {
    flex: 1,
    borderRadius: 18,
    padding: 14,
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: 'transparent',
    minHeight: 110,
  },
  qaIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  qaLabel: {
    fontSize: 12,
    fontWeight: '800',
    lineHeight: 17,
    flex: 1,
  },
  qaBadge: {
    marginTop: 6,
    backgroundColor: 'rgba(0,0,0,0.06)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  qaBadgeText: { fontSize: 13, fontWeight: '900' },

  // AI Card
  aiCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginHorizontal: 20,
    borderWidth: 1,
    borderColor: '#BBF7D0',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  aiCardLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  aiIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#ECFDF5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  aiCardTitle: { fontSize: 15, fontWeight: '800', color: '#0F172A' },
  aiCardSub: { fontSize: 11, color: '#64748B', marginTop: 2 },
  aiCardRight: { alignItems: 'flex-end' },
  aiPercent: { fontSize: 26, fontWeight: '900', color: '#10B981' },
  aiRatio: { fontSize: 12, color: '#64748B', marginTop: -2 },
  aiProgressBg: {
    height: 6,
    backgroundColor: '#ECFDF5',
    marginHorizontal: 20,
    borderRadius: 3,
    marginTop: 10,
    overflow: 'hidden',
  },
  aiProgressFill: {
    height: 6,
    backgroundColor: '#10B981',
    borderRadius: 3,
  },

  // Status Grid
  statusGrid: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 10,
  },
  statusCard: {
    flex: 1,
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
  },
  statusCardIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusCardNum: { fontSize: 20, fontWeight: '900' },
  statusCardLabel: { fontSize: 9, color: '#64748B', fontWeight: '700', textTransform: 'uppercase', marginTop: 2, letterSpacing: 0.2, textAlign: 'center' },

  // SOS section dot
  sosSectionDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#EF4444',
  },

  // SOS Cards (compact, dashboard view)
  sosCard: {
    flexDirection: 'row',
    borderRadius: 18,
    marginBottom: 12,
    borderWidth: 1.5,
    overflow: 'hidden',
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  sosCardAccent: { width: 5 },
  sosCardBody: { flex: 1, padding: 14 },
  sosCardHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  sosTypeIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sosTypeName: { fontSize: 14, fontWeight: '800', color: '#0F172A' },
  sosReporter: { fontSize: 11, color: '#64748B', marginTop: 1 },
  sosStatusPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  sosStatusText: { fontSize: 9, fontWeight: '800', color: '#FFF', textTransform: 'uppercase', letterSpacing: 0.5 },
  sosLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#FFF',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  sosLocationText: { flex: 1, fontSize: 11, color: '#334155', fontWeight: '500' },
  sosActions: { flexDirection: 'row', gap: 6 },
  sosActionBtn: {
    flex: 1,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sosActionText: { color: '#FFF', fontSize: 12, fontWeight: '800' },

  viewMoreBtn: {
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    borderRadius: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  viewMoreText: { color: '#EF4444', fontSize: 13, fontWeight: '700' },

  // Concern Cards
  concernCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 2,
  },
  concernCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
    gap: 10,
  },
  concernTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    flex: 1,
    lineHeight: 20,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    alignSelf: 'flex-start',
    flexShrink: 0,
  },
  statusBadgeText: { fontSize: 10, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.3 },
  concernMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    justifyContent: 'space-between',
  },
  concernMetaText: { fontSize: 11, color: '#64748B' },
  aiBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 8,
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  aiBadgeText: { fontSize: 11, color: '#15803D', fontWeight: '700' },

  // Empty state
  emptyState: { alignItems: 'center', padding: 40 },
  emptyTitle: { fontSize: 18, fontWeight: '800', color: '#0F172A', marginTop: 16, marginBottom: 4 },
  emptyText: { fontSize: 14, color: '#94A3B8', textAlign: 'center' },
});
