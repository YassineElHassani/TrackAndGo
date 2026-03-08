import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

export default function TabLayout() {
    return (
        <Tabs screenOptions={{ tabBarActiveTintColor: '#2563EB' }}>
            <Tabs.Screen
                name="index"
                options={{
                    title: 'My Route',
                    tabBarIcon: ({ color }) => <Ionicons name="list" size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="map"
                options={{
                    title: 'Map',
                    tabBarIcon: ({ color }) => <Ionicons name="map" size={24} color={color} />,
                }}
            />
            {/* Hide the old auth screen from the tab bar — it is kept as a file
                  only to avoid a missing-screen warning during transition */}
            <Tabs.Screen
                name="auth"
                options={{ href: null }}
            />
        </Tabs>
    );
}
