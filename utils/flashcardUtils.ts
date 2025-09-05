import type { CertificationType, Flashcard } from "@/constants/lessons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const FLASHCARD_STORAGE_KEY = "user_flashcard_progress_v1";

type FlashcardProgress = {
  [cardId: string]: {
    lastReviewed: string;
    timesReviewed: number;
    isMastered: boolean;
  };
};

export async function getFlashcardProgress(): Promise<FlashcardProgress> {
  const progress = await AsyncStorage.getItem(FLASHCARD_STORAGE_KEY);
  return progress ? JSON.parse(progress) : {};
}

export async function updateFlashcardProgress(cardId: string, isCorrect: boolean) {
  const progress = await getFlashcardProgress();
  const now = new Date().toISOString();
  
  progress[cardId] = {
    lastReviewed: now,
    timesReviewed: (progress[cardId]?.timesReviewed || 0) + 1,
    isMastered: isCorrect,
  };

  await AsyncStorage.setItem(FLASHCARD_STORAGE_KEY, JSON.stringify(progress));
  return progress[cardId];
}

export async function resetFlashcardProgress() {
  await AsyncStorage.removeItem(FLASHCARD_STORAGE_KEY);
}

export function filterFlashcardsByCertification(
  cards: Flashcard[],
  cert: CertificationType
): Flashcard[] {
  return cards.filter((card) => card.certification === cert);
}

export function filterFlashcardsByCategory(
  cards: Flashcard[],
  category: string
): Flashcard[] {
  return cards.filter((card) => card.category === category);
}

export function getRandomFlashcard(
  cards: Flashcard[],
  filter?: {
    cert?: CertificationType;
  }
): Flashcard {
  let filtered = [...cards];
  
  if (filter?.cert) {
    filtered = filtered.filter(card => card.certification === filter.cert);
  }

  if (filtered.length === 0) {
    throw new Error('No flashcards match the specified filters');
  }

  return filtered[Math.floor(Math.random() * filtered.length)];
}
