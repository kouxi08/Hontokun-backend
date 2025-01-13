import { MySql2Database } from 'drizzle-orm/mysql2';
import { quiz } from '../database/cms/types/response';
import * as QuizRepository from '../repository/quiz';
import * as QuizLogRepository from '../repository/quizLog';
import { Choice } from '../model/quiz/choice';
import { Quiz } from '../model/quiz/quiz';

export const createQuiz = async (
  db: MySql2Database,
  quiz: quiz<'get'>
): Promise<void> => {
  const quizData = mapQuizData(quiz);
  return await QuizRepository.createQuiz(db, quizData);
};

export const updateQuiz = async (
  db: MySql2Database,
  quiz: quiz<'get'>
): Promise<void> => {
  const quizData = mapQuizData(quiz);
  return await QuizRepository.updateQuiz(db, quizData);
};

// 共通のデータ変換関数
const mapQuizData = (quiz: quiz<'get'>): Quiz => {
  const choices = quiz.choices ? quiz.choices!.split('\n').map((choice) => {
    return Choice.create({
      id: null,
      name: choice,
      createdAt: new Date(quiz.createdAt),
      updatedAt: new Date(quiz.updatedAt),
    });
  }) : [];

  return Quiz.create({
    id: quiz.id,
    title: quiz.title,
    content: quiz.content,
    tier: quiz.tier,
    imageUrl: quiz.image?.url ?? null,
    imageHeight: quiz.image?.height ?? null,
    imageWidth: quiz.image?.width ?? null,
    question: quiz.question,
    newsUrl: quiz.newsUrl,
    type: quiz.type[0],
    choices,
    answer: quiz.answer,
    explanation: quiz.explanation,
    hint: quiz.hint,
    keyword: quiz.keyword,
    isDeleted: quiz.isDeleted,
    createdAt: new Date(quiz.createdAt),
    updatedAt: new Date(quiz.updatedAt),
    publishedAt: new Date(quiz.publishedAt),
    revisedAt: new Date(quiz.revisedAt),
  });
};

export const getQuizzes = async (
  db: MySql2Database,
  userId: string,
  tier: number
): Promise<Quiz[]> => {
  // クイズを取得
  const solvedQuizIds = await QuizLogRepository.getSolvedQuizIds(db, userId);
  const quizzes = await QuizRepository.getQuizzesByTier(db, tier, solvedQuizIds);
  return quizzes;
};
