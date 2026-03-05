import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function TabAuthScreen() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome back!</Text>

            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={[styles.button, styles.loginButton]}
                    onPress={() => router.push('/(auth)/login')}
                >
                    <Text style={[styles.buttonText, styles.loginText]}>Login</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.button, styles.registerButton]}
                    onPress={() => router.push('/(auth)/register')}
                >
                    <Text style={[styles.buttonText, styles.registerText]}>Register</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 40,
        color: '#333',
    },
    buttonContainer: {
        width: '100%',
        gap: 15,
    },
    button: {
        width: '100%',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    loginButton: {
        backgroundColor: '#2f95dc',
    },
    registerButton: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: '#2f95dc',
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '600',
    },
    loginText: {
        color: '#fff',
    },
    registerText: {
        color: '#2f95dc',
    },
});
