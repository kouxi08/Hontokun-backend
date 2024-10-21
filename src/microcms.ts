import { createClient } from "microcms-js-sdk";

import { config } from 'dotenv';

config();

type Quiz = {
    id: string;
    title: string;
    content: string;
    images: string[];
    question: string;
    explanation: string;
    answer: string;
    level: number;
    choices: string;
}

const client = createClient({
    serviceDomain: process.env.SERVICE_DOMAIN || "",
    apiKey: process.env.API_KEY || "" ,
});

export const Request = async () => {
    try {
        const quiz = await client.get<{ contents: Quiz[] }>({endpoint: "quiz"})
        return quiz.contents;
    }catch (err) {
        return []
    }
}

export default Request