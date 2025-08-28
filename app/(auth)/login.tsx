import { useRouter } from 'expo-router';
import { Button } from 'native-base';
import React, { useState } from 'react';
import {
  Alert,
  TextInput as RNTextInput,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { api } from '../../lib/api';
import { saveTokens } from '../../lib/session';
import { authStyles } from '../../styles/auth.styles';

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
  const styles = authStyles;

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
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back</Text>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Username</Text>
        <RNTextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#9ca3af"
          value={formData.username}
          onChangeText={(text) => handleChange('username', text)}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
        />
      </View>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Password</Text>
        <RNTextInput
          style={styles.input}
          placeholder="Enter your password"
          placeholderTextColor="#9ca3af"
          value={formData.password}
          onChangeText={(text) => handleChange('password', text)}
          secureTextEntry
          autoCapitalize="none"
        />
      </View>
      
      <TouchableOpacity 
        style={styles.forgotPassword}
        onPress={() => {}}
      >
        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
      </TouchableOpacity>
      
      <Button 
        style={styles.button} 
        onPress={handleSubmit}
        isLoading={loading}
        isLoadingText="Logging in..."
        _text={styles.buttonText}
      >
        Login
      </Button>
      
      <View style={styles.signupContainer}>
        <Text style={styles.signupText}>Don't have an account? </Text>
        <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
          <Text style={[styles.signupText, styles.signupLink]}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LoginScreen;
