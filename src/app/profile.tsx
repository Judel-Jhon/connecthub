import React, { useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Switch,
  StatusBar,
  StyleSheet,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, Href } from 'expo-router';
import { BottomNavBar } from '../components/BottomNavBar';
import { MOCK_CURRENT_USER, MOCK_CONCERNS } from '../constants/connectHubData';
import { AuthStore } from '../constants/authStore';

const QUICK_LINKS = [
  { label: 'My Concerns', icon: 'document-text-outline', color: '#4F46E5', route: '/my-concerns' as Href },
  { label: 'Submit Concern', icon: 'add-circle-outline', color: '#10B981', route: '/submit-concern' as Href },
  { label: 'Announcements', icon: 'megaphone-outline', color: '#F59E0B', route: '/announcements' as Href },
  { label: 'Notifications', icon: 'notifications-outline', color: '#0EA5E9', route: '/notifications' as Href },
];

export default function ProfileScreen() {
  // Use the logged-in user from AuthStore; fall back to mock if not set
  const user = AuthStore.getUser() ?? MOCK_CURRENT_USER;
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailNotifs, setEmailNotifs] = useState(false);
  const [smsNotifs, setSmsNotifs] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'settings'>('overview');

  const totalConcerns = MOCK_CONCERNS.filter((c) => c.submittedBy === user.name).length;
  const resolvedConcerns = MOCK_CONCERNS.filter(
    (c) => c.submittedBy === user.name && c.status === 'resolved'
  ).length;
  const activeConcerns = MOCK_CONCERNS.filter(
    (c) => c.submittedBy === user.name && (c.status === 'in-progress' || c.status === 'under-review')
  ).length;

  const handleLogout = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log Out',
        style: 'destructive',
        onPress: () => {
          AuthStore.logout();
          router.replace('/login' as Href);
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={s.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#4338CA" />

      {/* ── Hero Header ── */}
      <View style={s.heroHeader}>
        <View style={s.heroTop}>
          <View>
            <Text style={s.heroTitle}>Profile</Text>
            <Text style={s.heroSub}>Account & Preferences</Text>
          </View>
          <TouchableOpacity style={s.logoutIconBtn} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={20} color="#FCA5A5" />
          </TouchableOpacity>
        </View>

        {/* Avatar + Info */}
        <View style={s.avatarSection}>
          <View style={s.avatarWrap}>
            <Text style={s.avatarText}>{user.avatar}</Text>
            <View style={s.avatarOnline} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={s.userName}>{user.name}</Text>
            <Text style={s.userEmail}>{user.email}</Text>
            {user.department && (
              <View style={s.deptChip}>
                <Ionicons name="business-outline" size={11} color="#A5B4FC" />
                <Text style={s.deptText}>{user.department}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Stats */}
        <View style={s.heroStats}>
          <View style={s.heroStat}>
            <Text style={s.heroStatNum}>{totalConcerns}</Text>
            <Text style={s.heroStatLabel}>Submitted</Text>
          </View>
          <View style={s.heroStatDivider} />
          <View style={s.heroStat}>
            <Text style={[s.heroStatNum, { color: '#93C5FD' }]}>{activeConcerns}</Text>
            <Text style={s.heroStatLabel}>Active</Text>
          </View>
          <View style={s.heroStatDivider} />
          <View style={s.heroStat}>
            <Text style={[s.heroStatNum, { color: '#6EE7B7' }]}>{resolvedConcerns}</Text>
            <Text style={s.heroStatLabel}>Resolved</Text>
          </View>
          <View style={s.heroStatDivider} />
          <View style={s.heroStat}>
            <Text style={[s.heroStatNum, { color: '#FDE68A' }]}>
              {totalConcerns > 0 ? Math.round((resolvedConcerns / totalConcerns) * 100) : 0}%
            </Text>
            <Text style={s.heroStatLabel}>Rate</Text>
          </View>
        </View>
      </View>

      {/* ── Tab Bar ── */}
      <View style={s.tabBar}>
        {(['overview', 'settings'] as const).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[s.tabItem, activeTab === tab && s.tabItemActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Ionicons
              name={tab === 'overview' ? 'person-outline' : 'settings-outline'}
              size={16}
              color={activeTab === tab ? '#4F46E5' : '#94A3B8'}
            />
            <Text style={[s.tabText, activeTab === tab && s.tabTextActive]}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* ── Overview Tab ── */}
        {activeTab === 'overview' && (
          <View style={{ paddingHorizontal: 20 }}>
            {/* Account Info */}
            <Text style={s.groupLabel}>Account Information</Text>
            <View style={s.infoCard}>
              {[
                { label: 'Full Name', value: user.name, icon: 'person-outline' },
                { label: 'Email Address', value: user.email, icon: 'mail-outline' },
                { label: 'Department', value: user.department || 'Not specified', icon: 'business-outline' },
                { label: 'Role', value: 'Stakeholder', icon: 'shield-checkmark-outline', valueColor: '#4F46E5' },
              ].map((item, i, arr) => (
                <View key={item.label} style={[s.infoRow, i < arr.length - 1 && s.infoRowBorder]}>
                  <View style={s.infoIconWrap}>
                    <Ionicons name={item.icon as any} size={16} color="#64748B" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={s.infoLabel}>{item.label}</Text>
                    <Text style={[s.infoValue, item.valueColor ? { color: item.valueColor, fontWeight: '800' } : {}]}>
                      {item.value}
                    </Text>
                  </View>
                </View>
              ))}
            </View>

            {/* Quick Links */}
            <Text style={s.groupLabel}>Quick Links</Text>
            <View style={s.quickLinksGrid}>
              {QUICK_LINKS.map((link) => (
                <TouchableOpacity
                  key={link.label}
                  style={s.quickLinkCard}
                  onPress={() => router.push(link.route)}
                  activeOpacity={0.85}
                >
                  <View style={[s.quickLinkIcon, { backgroundColor: link.color + '15' }]}>
                    <Ionicons name={link.icon as any} size={22} color={link.color} />
                  </View>
                  <Text style={s.quickLinkLabel}>{link.label}</Text>
                  <Ionicons name="chevron-forward" size={14} color="#CBD5E1" />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* ── Settings Tab ── */}
        {activeTab === 'settings' && (
          <View style={{ paddingHorizontal: 20 }}>
            <Text style={s.groupLabel}>Notification Preferences</Text>
            <View style={s.infoCard}>
              {[
                {
                  label: 'Push Notifications',
                  sub: 'Get alerts for status updates and responses',
                  icon: 'notifications-outline',
                  color: '#4F46E5',
                  value: notificationsEnabled,
                  setter: setNotificationsEnabled,
                },
                {
                  label: 'Email Notifications',
                  sub: 'Receive concern updates via email',
                  icon: 'mail-outline',
                  color: '#10B981',
                  value: emailNotifs,
                  setter: setEmailNotifs,
                },
                {
                  label: 'SMS Notifications',
                  sub: 'Text alerts for critical updates',
                  icon: 'chatbubble-outline',
                  color: '#F59E0B',
                  value: smsNotifs,
                  setter: setSmsNotifs,
                },
              ].map((item, i, arr) => (
                <View key={item.label} style={[s.settingRow, i < arr.length - 1 && s.infoRowBorder]}>
                  <View style={[s.settingIconWrap, { backgroundColor: item.color + '15' }]}>
                    <Ionicons name={item.icon as any} size={18} color={item.color} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={s.settingLabel}>{item.label}</Text>
                    <Text style={s.settingSub}>{item.sub}</Text>
                  </View>
                  <Switch
                    value={item.value}
                    onValueChange={item.setter}
                    trackColor={{ false: '#E2E8F0', true: item.color }}
                    thumbColor="#FFFFFF"
                  />
                </View>
              ))}
            </View>

            <Text style={s.groupLabel}>Account</Text>
            <View style={s.infoCard}>
              <TouchableOpacity style={[s.settingRow, { borderBottomWidth: 0 }]} onPress={handleLogout}>
                <View style={[s.settingIconWrap, { backgroundColor: '#FEF2F2' }]}>
                  <Ionicons name="log-out-outline" size={18} color="#EF4444" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[s.settingLabel, { color: '#EF4444' }]}>Log Out</Text>
                  <Text style={s.settingSub}>Sign out of your ConnectHub account</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color="#EF4444" />
              </TouchableOpacity>
            </View>

            <Text style={s.versionText}>ConnectHub v1.0.0 · HISCPF Framework</Text>
          </View>
        )}
      </ScrollView>

      <BottomNavBar variant="stakeholder" />
    </SafeAreaView>
  );
}

// ── Styles ────────────────────────────────────────────────────
const s = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F8FAFC' },

  // Hero
  heroHeader: {
    backgroundColor: '#4338CA',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 22,
  },
  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 18,
  },
  heroTitle: { fontSize: 24, fontWeight: '800', color: '#FFF', letterSpacing: -0.5 },
  heroSub: { fontSize: 12, color: '#A5B4FC', marginTop: 2, fontWeight: '500' },
  logoutIconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },

  // Avatar section
  avatarSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 18,
  },
  avatarWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.35)',
  },
  avatarText: { color: '#FFF', fontSize: 24, fontWeight: '900' },
  avatarOnline: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: '#4338CA',
  },
  userName: { fontSize: 18, fontWeight: '800', color: '#FFF', marginBottom: 2 },
  userEmail: { fontSize: 12, color: '#C7D2FE', marginBottom: 6 },
  deptChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.12)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  deptText: { fontSize: 11, color: '#A5B4FC', fontWeight: '600' },

  // Hero stats
  heroStats: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.22)',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 8,
    justifyContent: 'space-around',
  },
  heroStat: { alignItems: 'center' },
  heroStatNum: { fontSize: 20, fontWeight: '900', color: '#FFF' },
  heroStatLabel: {
    fontSize: 10,
    color: '#A5B4FC',
    fontWeight: '600',
    marginTop: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  heroStatDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.15)' },

  // Tab bar
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingHorizontal: 20,
  },
  tabItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 14,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabItemActive: { borderBottomColor: '#4F46E5' },
  tabText: { fontSize: 14, fontWeight: '600', color: '#94A3B8' },
  tabTextActive: { color: '#4F46E5', fontWeight: '800' },

  // Group label
  groupLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#94A3B8',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginTop: 24,
    marginBottom: 10,
  },

  // Info card
  infoCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14 },
  infoRowBorder: { borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  infoIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoLabel: { fontSize: 11, color: '#94A3B8', fontWeight: '600', marginBottom: 2 },
  infoValue: { fontSize: 15, color: '#0F172A', fontWeight: '600' },

  // Quick links grid
  quickLinksGrid: { gap: 8 },
  quickLinkCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 1,
  },
  quickLinkIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickLinkLabel: { flex: 1, fontSize: 15, fontWeight: '700', color: '#0F172A' },

  // Settings rows
  settingRow: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14 },
  settingIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingLabel: { fontSize: 15, fontWeight: '700', color: '#0F172A', marginBottom: 2 },
  settingSub: { fontSize: 12, color: '#94A3B8' },

  versionText: { textAlign: 'center', color: '#CBD5E1', fontSize: 12, marginTop: 24, marginBottom: 8 },
});
