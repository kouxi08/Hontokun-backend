import { createClient } from "microcms-js-sdk";

import { config } from 'dotenv';

config();

interface Props  {
    contents: Quiz
};

interface Quiz  {
    id: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    revisedAt: string;
    title: number;
    content: string;
    images: Images[];
    question: string;
    explanation: string;
    answer: string;
    level: number;
    choices: string[];
}

interface Images {
    url: string;
    height: number;
    width: number;
};


const client = createClient({
    serviceDomain: process.env.SERVICE_DOMAIN || "",
    apiKey: process.env.API_KEY || "" ,
});

export const Request = async () => {
    try {
        const quiz = await client.get<Props>({ endpoint: "quiz" });
        const data: Quiz = await quiz.contents;
        console.log(data);
        return {
            data
        };
    } catch (err) {
        console.error("Failed to fetch quizzes:", err);
        return {
            quiz: [],
        };
    }
};


export default Request