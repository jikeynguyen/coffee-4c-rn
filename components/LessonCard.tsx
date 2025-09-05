import { Flashcard } from "@/constants/lessons";
import { updateFlashcardProgress } from "@/utils/flashcardUtils";
import { Text, TouchableOpacity, View } from "react-native";

interface LessonCardProps {
  flashcard: Flashcard;
  onNext: (isCorrect: boolean) => void;
}

export default function LessonCard({ flashcard, onNext }: LessonCardProps) {
  const handleCardPress = async () => {
    await updateFlashcardProgress(flashcard.id, true);
    onNext(true);
  };

  return (
    <TouchableOpacity 
      className="flex-1 bg-green-50 h-[180px] rounded-2xl p-6 justify-between"
      activeOpacity={0.8}
      onPress={handleCardPress}
    >
      <Text className="text-black text-base leading-6">
        {flashcard.content}
      </Text>
      <View className="w-full">
        <View className="flex-row justify-between mt-auto">
          <View className="bg-black/10 px-3 py-1 rounded-full">
            <Text className="text-black text-xs opacity-80">
              {flashcard.certification}
            </Text>
          </View>
          <Text className="text-black/60 text-xs capitalize">
            {flashcard.category}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}