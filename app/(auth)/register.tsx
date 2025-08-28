import { useRouter } from 'expo-router';
import { Button } from 'native-base';
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  TextInput as RNTextInput,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { api } from '../../lib/api';

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

      if (response.data?.success) {
        Alert.alert(
          'Registration Successful',
          'Your account has been created successfully. Please log in.',
          [
            {
              text: 'OK',
              onPress: () => router.replace('/(auth)/login'),
            },
          ]
        );
      }
    } catch (error) {
      console.error('Signup error:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderInputField = (
    label: string,
    field: keyof SignUpData,
    options: {
      secureTextEntry?: boolean;
      keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
      autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
    } = {}
  ) => (
    <View className="mb-4 w-full max-w-[400px] self-center">
      <Text className="text-xs text-gray-600 mb-1 font-medium">{label}</Text>
      <RNTextInput
        className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-3 text-gray-800 h-11 w-full"
        value={formData[field] as string}
        onChangeText={(text) => handleChange(field, text)}
        placeholder={`Enter your ${label.toLowerCase()}`}
        secureTextEntry={options.secureTextEntry}
        keyboardType={options.keyboardType || 'default'}
        autoCapitalize={options.autoCapitalize || 'none'}
      />
    </View>
  );

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-white"
    >
      <ScrollView 
        contentContainerStyle={{ flexGrow: 1, padding: 20 }}
        keyboardShouldPersistTaps="handled"
      >
        <Text className="text-3xl font-bold mb-6 text-center text-gray-800">Create Account</Text>
        
        <View className="flex-row mb-4 w-full max-w-[400px] self-center">
          <View className="flex-1 mr-2">
            {renderInputField('First Name', 'firstName', { autoCapitalize: 'words' })}
          </View>
          <View className="flex-1 ml-2">
            {renderInputField('Last Name', 'lastName', { autoCapitalize: 'words' })}
          </View>
        </View>

        {renderInputField('Email', 'email', { keyboardType: 'email-address' })}
        {renderInputField('Phone', 'phone', { keyboardType: 'phone-pad' })}
        {renderInputField('Age', 'age', { keyboardType: 'numeric' })}
        
        <View className="mb-4 w-full max-w-[400px] self-center">
          <Text className="text-xs text-gray-600 mb-1 font-medium">Gender</Text>
          <View className="flex-row">
            {['Male', 'Female', 'Other'].map((gender) => (
              <TouchableOpacity
                key={gender}
                className={`flex-1 items-center justify-center py-3 mx-1 rounded-lg border ${
                  formData.gender === gender 
                    ? 'bg-blue-50 border-blue-500' 
                    : 'bg-gray-50 border-gray-200'
                }`}
                onPress={() => handleChange('gender', gender)}
              >
                <Text 
                  className={`text-sm ${
                    formData.gender === gender ? 'text-blue-600 font-semibold' : 'text-gray-700'
                  }`}
                >
                  {gender}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {renderInputField('Password', 'password', { secureTextEntry: true })}
        {renderInputField('Confirm Password', 'confirmPassword', { secureTextEntry: true })}

        <Button
          onPress={handleSubmit}
          isLoading={loading}
          className="bg-sky-500 rounded-lg h-12 justify-center mt-2 mb-4 w-full max-w-[400px] self-center"
          _text={{ className: "text-white font-semibold text-base" }}
        >
          {loading ? 'Creating Account...' : 'Create Account'}
        </Button>

        <View className="flex-row justify-center mt-2 mb-5">
          <Text className="text-gray-600 text-xs">Already have an account? </Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
            <Text className="text-sky-500 font-semibold text-xs">Log in</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;