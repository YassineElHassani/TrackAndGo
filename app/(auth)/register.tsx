import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RegisterScreen() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleRegister = () => {
        // Basic validation could be here
        // Redirect to main app or back to login
        router.replace('/(tabs)');
    };

    return (
        <SafeAreaView className="flex-1 bg-white dark:bg-zinc-950">
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1 }}
                    keyboardShouldPersistTaps="handled"
                    className="px-6 pt-12 pb-8"
                >
                    {/* Form Section */}
                    <View className="space-y-5 pt-4">
                        {/* Name Input */}
                        <View>
                            <Text className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2 ml-1">
                                Full Name
                            </Text>
                            <View className="flex-row items-center bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl px-4 h-14">
                                <Ionicons name="person-outline" size={20} color="#9ca3af" />
                                <TextInput
                                    className="flex-1 ml-3 text-base text-zinc-900 dark:text-white"
                                    placeholder="John Doe"
                                    placeholderTextColor="#9ca3af"
                                    value={name}
                                    onChangeText={setName}
                                />
                            </View>
                        </View>

                        {/* Email Input */}
                        <View className="mt-5">
                            <Text className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2 ml-1">
                                Email Address
                            </Text>
                            <View className="flex-row items-center bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl px-4 h-14">
                                <Ionicons name="mail-outline" size={20} color="#9ca3af" />
                                <TextInput
                                    className="flex-1 ml-3 text-base text-zinc-900 dark:text-white"
                                    placeholder="name@example.com"
                                    placeholderTextColor="#9ca3af"
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    value={email}
                                    onChangeText={setEmail}
                                />
                            </View>
                        </View>

                        {/* Password Input */}
                        <View className="mt-5">
                            <Text className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2 ml-1">
                                Password
                            </Text>
                            <View className="flex-row items-center bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl px-4 h-14">
                                <Ionicons name="lock-closed-outline" size={20} color="#9ca3af" />
                                <TextInput
                                    className="flex-1 ml-3 text-base text-zinc-900 dark:text-white"
                                    placeholder="Create a password"
                                    placeholderTextColor="#9ca3af"
                                    secureTextEntry={!showPassword}
                                    value={password}
                                    onChangeText={setPassword}
                                />
                                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} className="p-2 -mr-2">
                                    <Ionicons
                                        name={showPassword ? "eye-off-outline" : "eye-outline"}
                                        size={22}
                                        color="#9ca3af"
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>

                    {/* Register Button */}
                    <TouchableOpacity
                        onPress={handleRegister}
                        className="bg-blue-600 rounded-2xl h-14 items-center justify-center shadow-md shadow-blue-500/20 active:opacity-80 mt-8"
                    >
                        <Text className="text-white font-bold text-lg">
                            Sign Up
                        </Text>
                    </TouchableOpacity>

                    {/* Divider */}
                    <View className="flex-row items-center mt-10 mb-8">
                        <View className="flex-1 h-[1px] bg-zinc-200 dark:bg-zinc-800" />
                        <Text className="mx-4 text-zinc-500 dark:text-zinc-400 font-medium text-sm">
                            Or continue with
                        </Text>
                        <View className="flex-1 h-[1px] bg-zinc-200 dark:bg-zinc-800" />
                    </View>

                    {/* Social Buttons */}
                    <View className="flex-row gap-4">
                        <TouchableOpacity className="flex-1 flex-row items-center justify-center bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl h-14 active:opacity-70">
                            <Ionicons name="logo-google" size={20} color={Platform.OS === 'ios' ? '#000' : '#DB4437'} />
                            <Text className="ml-2 font-bold text-zinc-700 dark:text-zinc-300">Google</Text>
                        </TouchableOpacity>
                        <TouchableOpacity className="flex-1 flex-row items-center justify-center bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl h-14 active:opacity-70">
                            <Ionicons name="logo-apple" size={20} color={Platform.OS === 'ios' ? '#000' : '#FFF'} />
                            <Text className="ml-2 font-bold text-zinc-700 dark:text-zinc-300">Apple</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Spacer */}
                    <View className="flex-1 min-h-[40px]" />

                    {/* Login Link */}
                    <View className="flex-row justify-center mt-auto pb-4">
                        <Text className="text-zinc-600 dark:text-zinc-400 text-base font-medium">
                            Already have an account?{' '}
                        </Text>
                        <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
                            <Text className="text-blue-600 dark:text-blue-400 font-bold text-base">
                                Sign in
                            </Text>
                        </TouchableOpacity>
                    </View>

                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
