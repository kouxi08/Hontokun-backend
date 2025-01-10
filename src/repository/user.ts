import { MySql2Database } from "drizzle-orm/mysql2";
import { User } from "../model/user/user";
import { insertUserSchema } from "../database/mysql/validators/userValidator";
import { usersTable } from "../database/mysql/schema/schema";
import { eq } from "drizzle-orm";
import { AuthError } from "../core/error";

export const createUser = async (
  db: MySql2Database,
  user: User
): Promise<User> => {
  const validatedUser = insertUserSchema.parse(user);

  const userExists = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.firebaseUid, validatedUser.firebaseUid))
    .execute();
  if (userExists.length > 0) {
    throw new AuthError("User already exists");
  }

  await db.insert(usersTable).values(validatedUser);

  return validatedUser;
}