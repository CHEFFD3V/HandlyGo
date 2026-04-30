import { View, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function LessonScreen() {
  const { lessonId, levelId } = useLocalSearchParams();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Level: {levelId}</Text>
      <Text>Lesson: {lessonId}</Text>
    </View>
  );
}