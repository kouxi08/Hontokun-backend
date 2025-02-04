import { eq } from 'drizzle-orm';
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
      // 既存データを確認
      const existingMode = await db
        .select()
        .from(quizModeTable)
        .where(eq(quizModeTable.name, mode.name))
        .limit(1);

      if (existingMode.length > 0) {
        // データが存在する場合は update
        await db
          .update(quizModeTable)
          .set({
            description: mode.description,
            isPublic: mode.isPublic,
          })
          .where(eq(quizModeTable.name, mode.name));
        console.log('success: updated mode values');
      } else {
        // データが存在しない場合は insert
        await db.insert(quizModeTable).values(mode);
        console.log('success: inserted initial mode values');
      }
    } catch (error) {
      console.error(`Error inserting mode: ${mode.name}`, error);
    }
  }

};

seedQuizModeTable()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Error inserting mode values:', err);
    process.exit(1);
  });
