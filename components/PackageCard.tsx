import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import type { Package } from '@/types';

interface Props {
  pkg: Package;
}

export default function PackageCard({ pkg }: Props) {
  const router = useRouter();
  const scheme = useColorScheme() ?? 'light';
  const isDark = scheme === 'dark';
  const c = Colors[scheme];

  const bgColor = isDark ? '#18212F' : '#FFFFFF';
  const textColor = isDark ? '#F1F5F9' : '#111827';
  const mutedColor = isDark ? '#94A3B8' : '#6B7280';
  const borderColor = isDark ? '#2D3A4A' : '#E5E7EB';

  const isDelivered = pkg.status === 'delivered';
  const isFailed = pkg.status === 'failed';
  
  let statusColor = '#3B82F6'; // pending blue
  let statusText = 'Pending';
  if (isDelivered) {
    statusColor = '#10B981'; // green
    statusText = 'Delivered';
  } else if (isFailed) {
    statusColor = '#EF4444'; // red
    statusText = 'Failed';
  }

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={[
        styles.card,
        { backgroundColor: bgColor, borderColor: borderColor, ...(isDark && { borderTopColor: borderColor }) },
      ]}
      onPress={() => router.push(`/package/${pkg.id}`)}
    >
      <View style={styles.header}>
        <View style={styles.trackingContainer}>
          <Ionicons name="cube-outline" size={20} color={mutedColor} />
          <Text style={[styles.trackingNumber, { color: textColor }]}>
            {pkg.trackingNumber}
          </Text>
        </View>
        <View style={[styles.badge, { backgroundColor: statusColor + '20' }]}>
          <Text style={[styles.badgeText, { color: statusColor }]}>
            {statusText}
          </Text>
        </View>
      </View>

      <View style={styles.body}>
        <Text style={[styles.recipient, { color: textColor }]}>
          {pkg.recipientName}
        </Text>
        <View style={styles.addressRow}>
          <Ionicons name="location-outline" size={16} color={mutedColor} />
          <Text style={[styles.address, { color: mutedColor }]} numberOfLines={1}>
            {pkg.address}, {pkg.city}
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.timeRow}>
          <Ionicons name="time-outline" size={16} color={mutedColor} />
          <Text style={[styles.time, { color: mutedColor }]}>
            {new Date(pkg.scheduledTime).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={mutedColor} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  trackingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  trackingNumber: {
    fontSize: 14,
    fontWeight: '600',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  body: {
    marginBottom: 16,
  },
  recipient: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  address: {
    fontSize: 14,
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 12,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  time: {
    fontSize: 14,
    fontWeight: '500',
  },
});