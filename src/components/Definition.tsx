export type AnswerType = {
  id: number;
  text: string;
};

export type QuestionType = {
  id: number;
  text: string;
  answers: AnswerType[];
};

export type JapaneseLesson = {
  id: number;
  name: string;
  description: string;
  pictureUrl: string;
  status: string;
};

export type FlashCardInstance = {
  id: number;
  kanji: string;
  definition: string;
  hiragana: string;
};

export type FlashCardDeck = {
  id: number;
  name: string;
  flashCardInstances: FlashCardInstance[];
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
}

export type Word = {
  id: number;
  word: string;
  pronunciation: string;
  sino_vietnamese: string;
  means: WordMeaning[];
}
