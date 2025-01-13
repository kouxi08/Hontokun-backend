import { db } from "../../server";
import { quizModeTable } from "./schema/schema";

const seedQuizModeTable = async (): Promise<void> => {
  const modes = [
    {
      name: 'battle',
      description: '指名手配猫を捕まえよう！',
      isPublic: true,
    },
    {
      name: 'speed',
      description: '3分で何問解ける？',
      isPublic: true
    },
    {
      name: 'survival',
      description: '最強の探偵に！',
      isPublic: true
    },
    {
      name: 'infinite',
      description: '練習に最適',
      isPublic: true
    },
    {
      name: 'practice',
      description: '初めて遊ぶ人向け',
      isPublic: true
    }
  ];

  for (const mode of modes) {
    try {
      const modeWithId = { ...mode, id: crypto.randomUUID() };
      await db.insert(quizModeTable).values(modeWithId);
      console.log(`Inserted mode: ${modeWithId.name}`);
    } catch (error) {
      console.error(`Error inserting mode: ${mode.name}`, error);
    }
  }

  console.log('Inserted initial mode values');
}

seedQuizModeTable()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Error inserting mode values:', err);
    process.exit(1);
  });