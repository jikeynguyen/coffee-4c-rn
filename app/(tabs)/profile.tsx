import { Ionicons } from '@expo/vector-icons';
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";

const Profile = () => {
  // Mock user data - replace with your actual user data
  const userData = {
    name: 'John Doe',
    email: 'john.doe@example.com',
  };

  return (
    <ScrollView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="h-40 relative">
        <View className="justify-center items-center -bottom-16">
          <View className="w-32 h-32 rounded-full bg-white p-1">
            <Image
              source={{ uri: 'https://randomuser.me/api/portraits/men/1.jpg' }}
              className="w-full h-full rounded-full"
            />
          </View>
        </View>
      </View>

      {/* Profile Info */}
      <View className="mt-20 px-5">
        <View className="flex-row justify-between items-center">
          <View>
            <Text className="text-2xl font-bold text-gray-900">{userData.name}</Text>
            <Text className="text-gray-500">{userData.email}</Text>
          </View>
          <TouchableOpacity className="bg-brand px-4 py-2 rounded-full">
            <Text className="text-white font-medium">Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Menu Items */}
        <View className="mt-6 bg-white rounded-xl p-4 space-y-4">
          <TouchableOpacity className="flex-row items-center justify-between py-3 border-b border-gray-100">
            <View className="flex-row items-center">
              <Ionicons name="person-outline" size={24} color="#4B5563" />
              <Text className="ml-3 text-gray-700">Account Settings</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center justify-between py-3 border-b border-gray-100">
            <View className="flex-row items-center">
              <Ionicons name="notifications-outline" size={24} color="#4B5563" />
              <Text className="ml-3 text-gray-700">Notifications</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center justify-between py-3 border-b border-gray-100">
            <View className="flex-row items-center">
              <Ionicons name="help-circle-outline" size={24} color="#4B5563" />
              <Text className="ml-3 text-gray-700">Help & Support</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity 
            className="flex-row items-center justify-between py-3"
            onPress={() => {}}
          >
            <View className="flex-row items-center">
              <Ionicons name="log-out-outline" size={24} color="#EF4444" />
              <Text className="ml-3 text-red-500">Sign Out</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default Profile;
