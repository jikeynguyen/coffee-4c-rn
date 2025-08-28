import { useRouter } from 'expo-router';
import { Button } from 'native-base';
import React, { useState } from 'react';
import {
  Alert,
  TextInput as RNTextInput,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { api } from '../../lib/api';
import { saveTokens } from '../../lib/session';

const isValidUsername = (username: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^\+?[1-9]\d{1,14}$/; // E.164 format
  return emailRegex.test(username) || phoneRegex.test(username);
};

interface LoginData {
  username: string;
  password: string;
}

const LoginScreen = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<LoginData>({
    username: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (field: keyof LoginData, value: string) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleSubmit = async () => {
    if (!formData.username || !formData.password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      
      const response = await api.post('/auth/user', {
        username: formData.username,
        password: formData.password,
      }).catch(error => {
        if (error.response?.status === 401) {
          Alert.alert(
            'Login Failed',
            'Invalid email or password. Please try again.'
          );
        } else if (error.response?.status === 400) {
          Alert.alert(
            'Error',
            error.response.data?.message || 'Invalid request. Please check your input.'
          );
        } else if (error.response?.status === 422) {
          const errorMessage = error.response.data?.message || 'Validation failed. Please check your input.';
          Alert.alert('Validation Error', errorMessage);
        } else if (error.response?.status === 404) {
          Alert.alert(
            'Error',
            'The requested resource was not found. Please check the endpoint.'
          );
        } else {
          Alert.alert(
            'Error',
            error.response?.data?.message || 'An error occurred during login. Please try again.'
          );
        }
        throw error;
      });

      if (response.data?.data?.accessToken) {
        const { accessToken, refreshToken } = response.data.data;
        await saveTokens(accessToken, refreshToken);
        router.replace('/(tabs)');
      } else {
        console.log('Unexpected response format:', response.data);
        Alert.alert('Error', 'Unexpected response from server');
      }
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="flex-1 bg-white p-5">
      <View className="flex-1 justify-center">
        <Text className="text-3xl font-bold mb-5 text-center text-gray-800">Welcome Back</Text>
        
        <View className="w-full max-w-[400px] self-center mb-4">
          <Text className="text-xs text-gray-600 mb-1 font-medium">Email or Phone</Text>
          <RNTextInput
            className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-3 text-gray-800 h-11 w-full"
            value={formData.username}
            onChangeText={(text) => handleChange('username', text)}
            placeholder="Enter your email or phone"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View className="w-full max-w-[400px] self-center mb-6">
          <Text className="text-xs text-gray-600 mb-1 font-medium">Password</Text>
          <RNTextInput
            className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-3 text-gray-800 h-11 w-full"
            value={formData.password}
            onChangeText={(text) => handleChange('password', text)}
            placeholder="Enter your password"
            secureTextEntry
          />
          <TouchableOpacity className="self-end mt-2">
            <Text className="text-blue-500 text-sm">Forgot Password?</Text>
          </TouchableOpacity>
        </View>

        <Button
          onPress={handleSubmit}
          isLoading={loading}
          className="bg-sky-500 rounded-lg h-12 justify-center mt-2 mb-4"
          _text={{ className: "text-white font-semibold text-base" }}
        >
          {loading ? 'Logging in...' : 'Login'}
        </Button>

        <View className="flex-row justify-center mt-4 mb-5">
          <Text className="text-gray-600 text-xs">Don't have an account? </Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
            <Text className="text-sky-500 font-semibold text-xs">Sign up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default LoginScreen;
