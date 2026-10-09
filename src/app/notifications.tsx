import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { BottomNavBar } from '../components/BottomNavBar';
import { MOCK_NOTIFICATIONS, NotificationType } from '../constants/connectHubData';

const NOTIF_CONFIG: Record<NotificationType, { icon: string; color: string; bg: string; label: string }> = {
  status_update: { icon: 'sync-circle', color: '#0EA5E9', bg: '#E0F2FE', label: 'Status Update' },
  response: { icon: 'chatbubble-ellipses', color: '#4F46E5', bg: '#EEF2FF', label: 'Response' },
  announcement: { icon: 'megaphone', color: '#F59E0B', bg: '#FEF3C7', label: 'Announcement' },
  system: { icon: 'information-circle', color: '#10B981', bg: '#ECFDF5', label: 'System' },
};

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState([...MOCK_NOTIFICATIONS]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const markRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  return (
    <SafeAreaView style={s.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#4338CA" />

      {/* ── Hero Header ── */}
      <View style={s.heroHeader}>
        <View style={s.heroTop}>
          <View>
            <Text style={s.heroTitle}>Notifications</Text>
            <Text style={s.heroSub}>
              {unreadCount > 0 ? `${unreadCount} unread message${unreadCount > 1 ? 's' : ''}` : 'All caught up ✓'}
            </Text>
          </View>
          {unreadCount > 0 && (
            <TouchableOpacity style={s.markAllBtn} onPress={markAllRead}>
              <Ionicons name="checkmark-done" size={16} color="#FFF" />
              <Text style={s.markAllText}>Mark all read</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Unread badge strip */}
        {unreadCount > 0 && (
          <View style={s.unreadStrip}>
            <View style={s.unreadDot} />
            <Text style={s.unreadStripText}>
              You have {unreadCount} unread notification{unreadCount > 1 ? 's' : ''}
            </Text>
          </View>
        )}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100, paddingTop: 16 }}
      >
        {notifications.length === 0 ? (
          <View style={s.emptyState}>
            <Ionicons name="notifications-off-outline" size={56} color="#CBD5E1" />
            <Text style={s.emptyTitle}>No notifications</Text>
            <Text style={s.emptyText}>You&apos;re all caught up!</Text>
          </View>
        ) : (
          <View style={{ paddingHorizontal: 20, gap: 10 }}>
            {notifications.map((notif) => {
              const cfg = NOTIF_CONFIG[notif.type];
              return (
                <TouchableOpacity
                  key={notif.id}
                  style={[s.card, !notif.isRead && s.cardUnread]}
                  activeOpacity={0.88}
                  onPress={() => {
                    markRead(notif.id);
                    if (notif.relatedId?.startsWith('c')) {
                      router.push({
                        pathname: '/concern-detail' as any,
                        params: { id: notif.relatedId },
                      });
                    }
                  }}
                >
                  {/* Unread accent bar */}
                  {!notif.isRead && <View style={[s.cardAccent, { backgroundColor: cfg.color }]} />}

                  {/* Icon */}
                  <View style={[s.iconWrap, { backgroundColor: cfg.bg }]}>
                    <Ionicons name={cfg.icon as any} size={22} color={cfg.color} />
                  </View>

                  {/* Content */}
                  <View style={s.cardContent}>
                    <View style={s.cardTitleRow}>
                      <Text style={[s.cardTitle, !notif.isRead && s.cardTitleUnread]}>
                        {notif.title}
                      </Text>
                      {!notif.isRead && <View style={[s.unreadPip, { backgroundColor: cfg.color }]} />}
                    </View>
                    <Text style={s.cardMessage} numberOfLines={2}>{notif.message}</Text>
                    <View style={s.cardFooter}>
                      <View style={[s.typeBadge, { backgroundColor: cfg.bg }]}>
                        <Text style={[s.typeBadgeText, { color: cfg.color }]}>{cfg.label}</Text>
                      </View>
                      <Text style={s.cardTime}>{notif.date}</Text>
                    </View>
                  </View>

                  {/* Chevron */}
                  {notif.relatedId?.startsWith('c') && (
                    <Ionicons name="chevron-forward" size={16} color="#CBD5E1" style={{ alignSelf: 'center' }} />
                  )}
                </TouchableOpacity>
              );
            })}
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
    paddingBottom: 20,
  },
  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  heroTitle: { fontSize: 24, fontWeight: '800', color: '#FFF', letterSpacing: -0.5 },
  heroSub: { fontSize: 12, color: '#A5B4FC', marginTop: 2, fontWeight: '500' },
  markAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.18)',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  markAllText: { color: '#FFF', fontSize: 12, fontWeight: '700' },
  unreadStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(0,0,0,0.18)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginTop: 14,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FDE68A',
  },
  unreadStripText: { color: '#E0E7FF', fontSize: 12, fontWeight: '600' },

  // Cards
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFF',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 12,
    overflow: 'hidden',
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  cardUnread: {
    backgroundColor: '#F5F7FF',
    borderColor: '#C7D2FE',
  },
  cardAccent: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
  },
  iconWrap: {
    width: 46,
    height: 46,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
    marginLeft: 4,
  },
  cardContent: { flex: 1 },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
    flex: 1,
  },
  cardTitleUnread: {
    fontWeight: '800',
    color: '#0F172A',
  },
  unreadPip: {
    width: 8,
    height: 8,
    borderRadius: 4,
    flexShrink: 0,
  },
  cardMessage: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 18,
    marginBottom: 8,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  typeBadgeText: { fontSize: 10, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.3 },
  cardTime: { fontSize: 11, color: '#94A3B8' },

  // Empty
  emptyState: { alignItems: 'center', padding: 60 },
  emptyTitle: { fontSize: 18, fontWeight: '800', color: '#0F172A', marginTop: 16, marginBottom: 4 },
  emptyText: { fontSize: 14, color: '#94A3B8' },
});
