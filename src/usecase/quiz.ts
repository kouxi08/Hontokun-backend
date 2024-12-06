import { MySql2Database } from 'drizzle-orm/mysql2';
import { quiz } from '../database/cms/types/response';
import { Quiz } from '../model/quiz/quiz';
import * as Repository from '../repository/quiz';

export const createQuiz = async (
  db: MySql2Database,
  quiz: quiz<'get'>
): Promise<void> => {
  const quizData = mapQuizData(quiz);
  return await Repository.createQuiz(db, quizData);
};

export const updateQuiz = async (
  db: MySql2Database,
  quiz: quiz<'get'>
): Promise<void> => {
  const quizData = mapQuizData(quiz);
  console.log(quizData);
  return await Repository.updateQuiz(db, quizData);
};

// 共通のデータ変換関数
const mapQuizData = (quiz: quiz<'get'>): Quiz => {
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
    type: quiz.type,
    choices: quiz.choices ?? [],
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
