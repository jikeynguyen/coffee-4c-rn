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
import { authStyles } from '../../styles/auth.styles';

interface SignUpData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  age: string;
  gender: string;
  password: string;
  confirmPassword: string;
}

const RegisterScreen = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<SignUpData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    age: '',
    gender: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const styles = authStyles;

  const handleChange = (field: keyof SignUpData, value: string) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleSubmit = async () => {
    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (formData.password.length < 7) {
      Alert.alert('Error', 'Password must be at least 7 characters long');
      return;
    }

    try {
      setLoading(true);
      const userData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        age: parseInt(formData.age, 10),
        gender: formData.gender,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        username: formData.email,
      };

      console.log('Sending signup request with data:', userData);
      
      const response = await api.post('/users/signUp', userData).catch(error => {
        if (error.response?.status === 422) {
          const validationErrors = error.response.data?.errors || {};
          const errorMessages = Object.entries(validationErrors)
            .map(([field, messages]) => {
              const fieldName = field.charAt(0).toUpperCase() + field.slice(1);
              return `${fieldName}: ${(messages as string[]).join(', ')}`;
            })
            .join('\n');
          
          Alert.alert(
            'Validation Error',
            errorMessages || 'Please check your input and try again.'
          );
        } else if (error.response?.status === 500 && 
                  error.response?.data?.data?.includes('already exists')) {
          Alert.alert(
            'Email Already Registered',
            'This email is already registered. Please use a different email or try logging in.'
          );
        } else {
          const errorMessage = error.response?.data?.message || 'An error occurred during signup';
          Alert.alert('Error', errorMessage);
        }
        throw error;
      });
      
      if (response.status >= 200 && response.status < 300) {
        Alert.alert(
          'Success', 
          'Account created successfully! Please log in with your credentials.',
          [
            {
              text: 'OK',
              onPress: () => router.replace('/(auth)/login')
            }
          ]
        );
        // Add a fallback in case the alert is dismissed
        router.replace('/(auth)/login');
      }
    } catch (error: any) {
      console.error('Signup error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>First Name</Text>
        <RNTextInput
          style={styles.input}
          value={formData.firstName}
          onChangeText={(text) => handleChange('firstName', text)}
          placeholder="Enter your first name"
          placeholderTextColor="#9ca3af"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Last Name</Text>
        <RNTextInput
          style={styles.input}
          value={formData.lastName}
          onChangeText={(text) => handleChange('lastName', text)}
          placeholder="Enter your last name"
          placeholderTextColor="#9ca3af"
        />
      </View>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Email</Text>
        <RNTextInput
          style={styles.input}
          value={formData.email}
          onChangeText={(text) => handleChange('email', text)}
          placeholder="Enter your email"
          placeholderTextColor="#9ca3af"
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Phone</Text>
        <RNTextInput
          style={styles.input}
          value={formData.phone}
          onChangeText={(text) => handleChange('phone', text)}
          placeholder="Enter your phone number"
          placeholderTextColor="#9ca3af"
          keyboardType="phone-pad"
        />
      </View>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Age</Text>
        <RNTextInput
          style={styles.input}
          value={formData.age}
          onChangeText={(text) => handleChange('age', text.replace(/[^0-9]/g, ''))}
          placeholder="Enter your age"
          placeholderTextColor="#9ca3af"
          keyboardType="numeric"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Gender</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <TouchableOpacity 
            style={[
              styles.radioButton, 
              formData.gender === 'male' && styles.radioButtonSelected
            ]}
            onPress={() => handleChange('gender', 'male')}
          >
            <Text style={styles.radioText}>Male</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[
              styles.radioButton, 
              formData.gender === 'female' && styles.radioButtonSelected
            ]}
            onPress={() => handleChange('gender', 'female')}
          >
            <Text style={styles.radioText}>Female</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Password</Text>
        <RNTextInput
          style={styles.input}
          value={formData.password}
          onChangeText={(text) => handleChange('password', text)}
          placeholder="Create a password"
          placeholderTextColor="#9ca3af"
          secureTextEntry
        />
      </View>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Confirm Password</Text>
        <RNTextInput
          style={styles.input}
          value={formData.confirmPassword}
          onChangeText={(text) => handleChange('confirmPassword', text)}
          placeholder="Confirm your password"
          placeholderTextColor="#9ca3af"
          secureTextEntry
        />
      </View>
      
      <Button 
        style={styles.button} 
        onPress={handleSubmit}
        isLoading={loading}
        isLoadingText="Creating Account..."
        _text={styles.buttonText}
      >
        Create Account
      </Button>
      
      <View style={styles.signupContainer}>
        <Text style={styles.signupText}>Already have an account? </Text>
        <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
          <Text style={[styles.signupText, styles.signupLink]}>Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default RegisterScreen;