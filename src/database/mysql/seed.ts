import { and, eq } from 'drizzle-orm';
import { DEFAULT_COSTUME_ID } from '../../core/constants.js';
import { db } from '../../server.js';
import {
  quizModeTable,
  userCostumesTable,
  usersTable,
} from './schema/schema.js';

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
      const exists = await db
        .select()
        .from(quizModeTable)
        .where(eq(quizModeTable.name, mode.name));
      if (exists.length > 0) {
        console.log(`Mode ${mode.name} already exists, skipping...`);
        continue;
      }
      await db.insert(quizModeTable).values(mode);
      console.log(`Inserted mode: ${mode.name}`);
    } catch (error) {
      console.error(`Error inserting mode: ${mode.name}`, error);
    }
  }
  console.log('Success: inserted mode values');
};

/**
 * デフォルトのきせかえ情報をユーザに紐付ける
 */
const seedUserCostumeTable = async (): Promise<void> => {
  const costumeId = DEFAULT_COSTUME_ID;
  const userIds = await db.select({ id: usersTable.id }).from(usersTable);
  for (const user of userIds) {
    const exists = await db
      .select()
      .from(userCostumesTable)
      .where(
        and(
          eq(userCostumesTable.userId, user.id),
          eq(userCostumesTable.costumeId, costumeId)
        )
      );
    if (exists.length === 0) {
      await db.insert(userCostumesTable).values({
        userId: user.id,
        costumeId,
      });
    }
  }
  console.log('Success: inserted user costume values');
};

const main = async () => {
  try {
    await seedQuizModeTable();
    await seedUserCostumeTable();
    console.log('Seeding completed successfully.');
  } catch (error) {
    console.error('Seeding failed:', error);
  } finally {
    process.exit(0);
  }
};

main();
