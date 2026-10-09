import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, usePathname, Href } from 'expo-router';
import { MOCK_EMERGENCY_ALERTS } from '../constants/connectHubData';

interface BottomNavBarProps {
  variant?: 'stakeholder' | 'admin';
}

export function BottomNavBar({ variant = 'stakeholder' }: BottomNavBarProps) {
  const pathname = usePathname();

  const isCurrent = (path: string) => {
    if (path === '/' && (pathname === '/' || pathname === '/index')) return true;
    return pathname === path || pathname.startsWith(path + '/');
  };

  // Active SOS alert count for the admin badge
  const activeAlerts = MOCK_EMERGENCY_ALERTS.filter((a) => a.status !== 'resolved').length;

  if (variant === 'admin') {
    return (
      <View style={s.bottomNav}>
        {/* Dashboard */}
        <TouchableOpacity
          style={[s.navItem, isCurrent('/admin-dashboard') && s.navItemActive]}
          onPress={() => router.push('/admin-dashboard' as Href)}
        >
          <Ionicons
            name={isCurrent('/admin-dashboard') ? 'stats-chart' : 'stats-chart-outline'}
            size={22}
            color={isCurrent('/admin-dashboard') ? '#4F46E5' : '#64748B'}
          />
          <Text style={[s.navLabel, isCurrent('/admin-dashboard') && s.navLabelActive]}>
            Dashboard
          </Text>
        </TouchableOpacity>

        {/* Concerns */}
        <TouchableOpacity
          style={[s.navItem, isCurrent('/admin-concerns') && s.navItemActive]}
          onPress={() => router.push('/admin-concerns' as Href)}
        >
          <Ionicons
            name={isCurrent('/admin-concerns') ? 'chatbox-ellipses' : 'chatbox-ellipses-outline'}
            size={22}
            color={isCurrent('/admin-concerns') ? '#4F46E5' : '#64748B'}
          />
          <Text style={[s.navLabel, isCurrent('/admin-concerns') && s.navLabelActive]}>
            Concerns
          </Text>
        </TouchableOpacity>

        {/* Emergency (center, highlighted) */}
        <TouchableOpacity
          style={[s.navItem, s.emergencyNavItem, isCurrent('/admin-emergency') && s.emergencyNavItemActive]}
          onPress={() => router.push('/admin-emergency' as Href)}
        >
          <View style={[s.emergencyIconWrap, isCurrent('/admin-emergency') && s.emergencyIconWrapActive]}>
            <Ionicons name="alert-circle" size={26} color={isCurrent('/admin-emergency') ? '#FFF' : '#EF4444'} />
            {activeAlerts > 0 && (
              <View style={s.emergencyBadge}>
                <Text style={s.emergencyBadgeText}>{activeAlerts > 9 ? '9+' : activeAlerts}</Text>
              </View>
            )}
          </View>
          <Text style={[s.navLabel, isCurrent('/admin-emergency') ? { color: '#EF4444', fontWeight: '800' } : { color: '#EF4444' }]}>
            SOS
          </Text>
        </TouchableOpacity>

        {/* Notifications */}
        <TouchableOpacity
          style={[s.navItem, isCurrent('/notifications') && s.navItemActive]}
          onPress={() => router.push('/notifications' as Href)}
        >
          <View>
            <Ionicons
              name={isCurrent('/notifications') ? 'notifications' : 'notifications-outline'}
              size={22}
              color={isCurrent('/notifications') ? '#4F46E5' : '#64748B'}
            />
            <View style={s.notifDot} />
          </View>
          <Text style={[s.navLabel, isCurrent('/notifications') && s.navLabelActive]}>
            Alerts
          </Text>
        </TouchableOpacity>

        {/* Profile */}
        <TouchableOpacity
          style={[s.navItem, isCurrent('/profile') && s.navItemActive]}
          onPress={() => router.push('/profile' as Href)}
        >
          <Ionicons
            name={isCurrent('/profile') ? 'person' : 'person-outline'}
            size={22}
            color={isCurrent('/profile') ? '#4F46E5' : '#64748B'}
          />
          <Text style={[s.navLabel, isCurrent('/profile') && s.navLabelActive]}>
            Profile
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  // ── Stakeholder nav ──────────────────────────────────────────
  return (
    <View style={s.bottomNav}>
      <TouchableOpacity
        style={[s.navItem, isCurrent('/') && s.navItemActive]}
        onPress={() => router.push('/' as Href)}
      >
        <Ionicons
          name={isCurrent('/') ? 'home' : 'home-outline'}
          size={22}
          color={isCurrent('/') ? '#4F46E5' : '#64748B'}
        />
        <Text style={[s.navLabel, isCurrent('/') && s.navLabelActive]}>Home</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[s.navItem, isCurrent('/submit-concern') && s.navItemActive]}
        onPress={() => router.push('/submit-concern' as Href)}
      >
        <Ionicons
          name={isCurrent('/submit-concern') ? 'add-circle' : 'add-circle-outline'}
          size={22}
          color={isCurrent('/submit-concern') ? '#4F46E5' : '#64748B'}
        />
        <Text style={[s.navLabel, isCurrent('/submit-concern') && s.navLabelActive]}>
          Submit
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[s.navItem, isCurrent('/my-concerns') && s.navItemActive]}
        onPress={() => router.push('/my-concerns' as Href)}
      >
        <Ionicons
          name={isCurrent('/my-concerns') ? 'document-text' : 'document-text-outline'}
          size={22}
          color={isCurrent('/my-concerns') ? '#4F46E5' : '#64748B'}
        />
        <Text style={[s.navLabel, isCurrent('/my-concerns') && s.navLabelActive]}>
          Concerns
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[s.navItem, isCurrent('/notifications') && s.navItemActive]}
        onPress={() => router.push('/notifications' as Href)}
      >
        <View>
          <Ionicons
            name={isCurrent('/notifications') ? 'notifications' : 'notifications-outline'}
            size={22}
            color={isCurrent('/notifications') ? '#4F46E5' : '#64748B'}
          />
          <View style={s.notifDot} />
        </View>
        <Text style={[s.navLabel, isCurrent('/notifications') && s.navLabelActive]}>
          Alerts
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[s.navItem, isCurrent('/profile') && s.navItemActive]}
        onPress={() => router.push('/profile' as Href)}
      >
        <Ionicons
          name={isCurrent('/profile') ? 'person' : 'person-outline'}
          size={22}
          color={isCurrent('/profile') ? '#4F46E5' : '#64748B'}
        />
        <Text style={[s.navLabel, isCurrent('/profile') && s.navLabelActive]}>
          Profile
        </Text>
      </TouchableOpacity>
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────
const s = StyleSheet.create({
  bottomNav: {
    position: 'absolute',
    bottom: 24,
    left: 16,
    right: 16,
    height: 66,
    backgroundColor: '#FFFFFF',
    borderRadius: 32,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 18,
    elevation: 10,
    paddingHorizontal: 4,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  navItemActive: {
    backgroundColor: 'rgba(79, 70, 229, 0.1)',
  },
  navLabel: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '600',
    marginTop: 3,
  },
  navLabelActive: {
    color: '#4F46E5',
    fontWeight: '700',
  },
  notifDot: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
    borderWidth: 1.5,
    borderColor: '#FFF',
  },

  // Emergency nav button
  emergencyNavItem: {
    paddingHorizontal: 8,
  },
  emergencyNavItemActive: {},
  emergencyIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FEF2F2',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FCA5A5',
    marginBottom: -2,
  },
  emergencyIconWrapActive: {
    backgroundColor: '#EF4444',
    borderColor: '#EF4444',
  },
  emergencyBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#0F172A',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 3,
    borderWidth: 2,
    borderColor: '#FFF',
  },
  emergencyBadgeText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#FFF',
  },
});
