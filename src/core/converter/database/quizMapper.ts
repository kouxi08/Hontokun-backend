import { Choice } from '../../../model/quiz/choice.js';
import { Quiz } from '../../../model/quiz/quiz.js';
import type { SelectQuizWithChoices } from '../../../types/quiz';

export const convertDatabaseToQuiz = (
  quizList: SelectQuizWithChoices[][]
): Quiz[] => {
  const flatQuizList = quizList.flat();

  const quizMap = flatQuizList.reduce<
    Record<string, { quiz: SelectQuizWithChoices['quiz']; choices: Choice[] }>
  >((acc, item) => {
    if (!acc[item.quiz.id]) {
      acc[item.quiz.id] = {
        quiz: item.quiz,
        choices: [],
      };
    }
    if (item.choice) {
      acc[item.quiz.id]?.choices.push(
        Choice.create({
          ...item.choice,
          createdAt: new Date(item.choice.createdAt),
          updatedAt: new Date(item.choice.updatedAt),
        })
      );
    }
    return acc;
  }, {});

  return Object.values(quizMap).map(({ quiz, choices }) => {
    return Quiz.create({
      ...quiz,
      type: quiz.type as Quiz['type'],
      choices,
    });
  });
};
