import { Slot, usePathname, useRouter } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AuthLayout() {
  const pathname = usePathname();
  const router = useRouter();

  // Determine which tab is active based on the current route
  const isLoginActive = pathname.includes('/login');
  const isRegisterActive = pathname.includes('/register');

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-zinc-950" edges={['top']}>
      {/* Custom Tab Bar */}
      <View className="flex-row border-b border-zinc-200 dark:border-zinc-800">
        <TouchableOpacity
          className="flex-1 items-center justify-center py-4"
          onPress={() => router.replace('/(auth)/login')}
        >
          <Text
            className={`text-[15px] font-bold ${isLoginActive ? 'text-blue-600 dark:text-blue-500' : 'text-zinc-500 dark:text-zinc-400'
              }`}
          >
            Login
          </Text>
          {/* Active Indicator Line */}
          {isLoginActive && (
            <View className="absolute bottom-0 h-[3px] w-full bg-blue-600 dark:bg-blue-500 rounded-t-full" />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          className="flex-1 items-center justify-center py-4"
          onPress={() => router.replace('/(auth)/register')}
        >
          <Text
            className={`text-[15px] font-bold ${isRegisterActive ? 'text-blue-600 dark:text-blue-500' : 'text-zinc-500 dark:text-zinc-400'
              }`}
          >
            Register
          </Text>
          {/* Active Indicator Line */}
          {isRegisterActive && (
            <View className="absolute bottom-0 h-[3px] w-full bg-blue-600 dark:bg-blue-500 rounded-t-full" />
          )}
        </TouchableOpacity>
      </View>

      {/* Renders the current selected screen (login or register) */}
      <View className="flex-1">
        <Slot />
      </View>
    </SafeAreaView>
  );
}
