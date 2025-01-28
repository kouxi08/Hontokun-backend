import type { Quiz } from '../../../model/quiz/quiz';
import type { components as OpenapiComponents } from '../../../openapi/schema';

type OpenAPIQuiz = OpenapiComponents['schemas']['Quiz'];

export const convertQuizToAPI = (quiz: Quiz): OpenAPIQuiz => {
  return {
    id: quiz.id,
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
    correctAnswer: quiz.answer,
    hint: quiz.hint,
    keyword: quiz.keyword,
  };
};
