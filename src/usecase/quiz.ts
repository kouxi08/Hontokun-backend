import type { MySql2Database } from 'drizzle-orm/mysql2';
import type { quiz } from '../database/cms/types/response';
import { Choice } from '../model/quiz/choice.js';
import { Quiz } from '../model/quiz/quiz.js';
import * as QuizRepository from '../repository/quiz.js';
import * as QuizLogRepository from '../repository/quizLog.js';
import * as QuizModeRepository from '../repository/quizMode.js';
import {
  answerToBoolean,
  answerToString,
} from '../core/converter/api/answer.js';

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
  const choices = quiz.choices
    ? quiz.choices!.split('\n').map((choice) => {
        return Choice.create({
          id: null,
          name: choice,
          createdAt: new Date(quiz.createdAt),
          updatedAt: new Date(quiz.updatedAt),
        });
      })
    : [];

  return Quiz.create({
    ...quiz,
    answer: answerToString(quiz.answer),
    imageUrl: quiz.image?.url ?? null,
    imageHeight: quiz.image?.height ?? null,
    imageWidth: quiz.image?.width ?? null,
    type: quiz.type[0],
    choices,
    createdAt: new Date(quiz.createdAt),
    updatedAt: new Date(quiz.updatedAt),
    publishedAt: new Date(quiz.publishedAt),
    revisedAt: new Date(quiz.revisedAt),
  });
};

/**
 * 出題するクイズを取得する
 * @param db
 * @param userId ユーザID
 * @param tier 難易度
 * @returns 出題クイズリスト
 */
export const getQuizzes = async (
  db: MySql2Database,
  userId: string,
  tier: number
) => {
  // 出題済みクイズを取得
  const solvedQuizIds = await QuizLogRepository.getSolvedQuizIds(db, userId);
  // クイズを作成
  const quizzes = await QuizRepository.getQuizzesByTier(
    db,
    tier,
    solvedQuizIds
  );

  return quizzes.map((quiz, index) => {
    if (!quiz) {
      return null;
    }
    return {
      id: quiz.id,
      order: index + 1,
      news: {
        title: quiz.title,
        content: quiz.content,
        image: quiz.imageUrl!,
      },
      question: quiz.question,
      type: quiz.type,
      choices: quiz.choices.map((choice) => {
        return {
          id: choice.id,
          choice: choice.name,
        };
      }),
      correctAnswer: answerToBoolean(quiz.answer),
      hint: quiz.hint,
      keyword: quiz.keyword,
    };
  });
};

export const getAllQuizMode = async (db: MySql2Database) => {
  return await QuizModeRepository.getAllQuizMode(db);
};
