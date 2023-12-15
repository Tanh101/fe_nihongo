export type AnswerType = {
  id: number;
  question_id: number;
  content: string;
};

export type QuestionType = {
  id: number;
  vocabulary_id: number;
  content: string;
  meaning: string;
  status: string;
  deleted_at: null;
  created_at: Date;
  updated_at: Date;
  type: string;
  answers: AnswerType[];
};

export type JapaneseLesson = {
  lessonId: number;
  lessonTitle: string;
  lessonDescription: string;
  lessonImage: string;
  status: string;
};

export type FlashCardInstance = {
  id: string;
  word: string;
  definition: string;
};

export type FlashCardDeck = {
  id: string;
  name: string;
  description: string;
  flashCardInstances: FlashCardInstance[];
};

export type Topic = {
  topicId: number;
  topicName: string;
  topicImage: string;
  lessons: JapaneseLesson[];
};

export type WordMeaning = {
  id: number;
  word_id: number;
  meaning: string;
  example: string;
  example_meaning: string;
  image: string | null;
  created_at: string;
  updated_at: string;
};

export type Word = {
  id: number;
  word: string;
  pronunciation: string;
  sino_vietnamese: string;
  means: WordMeaning[];
};

export type Vocabulary = {
  id: number;
  lesson_id: number;
  user_id: number;
  word_id: number;
  status: string;
  deleted_at: null;
  created_at: Date;
  updated_at: Date;
  word: Word;
  questions: QuestionType[];
};
