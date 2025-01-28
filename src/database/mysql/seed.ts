import { db } from '../../server.js';
import { quizModeTable } from './schema/schema.js';

const seedQuizModeTable = async (): Promise<void> => {
  const modes = [
    {
      name: 'バトル',
      description: '指名手配猫を捕まえよう！',
      isPublic: true,
    },
    {
      name: 'スピード',
      description: '3分で何問解ける？',
      isPublic: true,
    },
    {
      name: 'ランク',
      description: '最強の探偵に！',
      isPublic: true,
    },
    {
      name: 'ムゲン',
      description: '練習に最適',
      isPublic: true,
    },
    {
      name: 'トリセツ',
      description: '初めて遊ぶ人向け',
      isPublic: true,
    },
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
};

seedQuizModeTable()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Error inserting mode values:', err);
    process.exit(1);
  });
