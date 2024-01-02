export type AnswerType = {
  id: string;
  question_id: string;
  content: string;
};

export type CreateAnswerType = {
  id: string;
  question_id: string;
  content: string;
  is_correct: number;
};
export type CreateQuestionType = {
  id: string;
  vocabulary_id: string;
  content: string;
  meaning: string;
  status: string;
  deleted_at: null;
  created_at: Date;
  updated_at: Date;
  type: string;
  answers: CreateAnswerType[];
};

export type QuestionType = {
  id: string;
  vocabulary_id: string;
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
  lessonId: string;
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
  cards: FlashCardInstance[];
  word_count: number;
};

export type Topic = {
  topicId: string;
  topicName: string;
  topicImage: string;
  lessons: JapaneseLesson[];
};

export type WordMeaning = {
  id: string;
  word_id: string;
  meaning: string;
  example: string;
  example_meaning: string;
  image: string | null;
  created_at: string;
  updated_at: string;
};

export type Word = {
  id: string;
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
