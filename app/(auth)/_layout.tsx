import { Slot, usePathname, useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';

export default function AuthLayout() {
  const pathname = usePathname();
  const router = useRouter();
  const scheme = useColorScheme() ?? 'light';
  const c = Colors[scheme];

  const isLoginActive = pathname.includes('/login');
  const isRegisterActive = pathname.includes('/register');

  return (
    <SafeAreaView style={[s.root, { backgroundColor: c.background }]} edges={['top']}>
      {/* Tab Bar */}
      <View style={[s.tabBar, { borderBottomColor: c.border }]}>
        <TouchableOpacity style={s.tab} onPress={() => router.replace('/(auth)/login')}>
          <Text style={[s.tabLabel, { color: isLoginActive ? c.tint : c.icon }]}>
            Sign In
          </Text>
          {isLoginActive && <View style={[s.indicator, { backgroundColor: c.tint }]} />}
        </TouchableOpacity>

        <TouchableOpacity style={s.tab} onPress={() => router.replace('/(auth)/register')}>
          <Text style={[s.tabLabel, { color: isRegisterActive ? c.tint : c.icon }]}>
            Sign Up
          </Text>
          {isRegisterActive && <View style={[s.indicator, { backgroundColor: c.tint }]} />}
        </TouchableOpacity>
      </View>

      <View style={s.content}>
        <Slot />
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1 },
  tabBar: { flexDirection: 'row', borderBottomWidth: 1 },
  tab: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 16 },
  tabLabel: { fontSize: 15, fontWeight: '700' },
  indicator: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 3, borderTopLeftRadius: 3, borderTopRightRadius: 3 },
  content: { flex: 1 },
});
