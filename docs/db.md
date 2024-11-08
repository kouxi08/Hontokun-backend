# DB 設計

## バックエンド

### user

ユーザ

| カラム名     | 説明                           | PK  | FK  | 型          | NOT NULL | INDEX | default | AUTO INCREMENT | Unique |
| ------------ | ------------------------------ | --- | --- | ----------- | -------- | ----- | ------- | -------------- | ------ |
| id           | ユーザ ID                      | ◯   |     | VARCHAR(36) | ◯        | ◯     |         |                | ◯      |
| firebase_uid | Firebase Authentication の UID |     |     | VARCHAR(36) | ◯        | ◯     |         |                | ◯      |
| nickname     | ニックネーム                   |     |     | VARCHAR(50) | ◯        |       |         |                |        |
| birthday     | 生年月日                       |     |     | DATE        |          |       |         |                |        |
| level        | レベル                         |     |     | INT         | ◯        |       | 0       |                |        |
| experience   | 経験値                         |     |     | INT         | ◯        |       | 0       |                |        |
| costume_id   | 着せ替え ID                    |     |     | VARCHAR(36) | ◯        |       |         |                |        |
| created_at   | 作成日時                       |     |     | DATETIME    | ◯        |       |         |                |        |
| updated_at   | 更新日時                       |     |     | DATETIME    | ◯        |       |         |                |        |

### quiz_set_log

クイズセットログ

| カラム名   | 説明             | PK  | FK  | 型          | NOT NULL | INDEX | default | AUTO INCREMENT | Unique |
| ---------- | ---------------- | --- | --- | ----------- | -------- | ----- | ------- | -------------- | ------ |
| id         | クイズセット ID  | ◯   |     | VARCHAR(36) | ◯        | ◯     |         |                | ◯      |
| user_id    | ユーザ ID        |     | ◯   | VARCHAR(36) | ◯        | ◯     |         |                |        |
| mode_id    | 問題モード ID    |     | ◯   | VARCHAR(36) | ◯        |       |         |                |        |
| created_at | 作成日時（解答） |     |     | DATETIME    | ◯        |       |         |                |        |
| updated_at | 更新日時         |     |     | DATETIME    | ◯        |       |         |                |        |

### quiz_log

クイズログ

| カラム名        | 説明                | PK  | FK  | 型          | NOT NULL | INDEX | default | AUTO INCREMENT | Unique |
| --------------- | ------------------- | --- | --- | ----------- | -------- | ----- | ------- | -------------- | ------ |
| id              | クイズログ ID       | ◯   |     | VARCHAR(36) | ◯        | ◯     |         |                | ◯      |
| quiz_id         | クイズ ID           |     |     | VARCHAR(36) | ◯        |       |         |                |        |
| quiz_set_log_id | クイズセットログ ID |     | ◯   | VARCHAR(36) | ◯        | ◯     |         |                |        |
| user_answer     | ユーザの解答        |     |     | TEXT        | ◯        |       |         |                |        |
| time            | 解答タイム          |     |     | INT         |          |       |         |                |        |
| is_correct      | 正答したかどうか    |     |     | BOOLEAN     | ◯        |       |         |                |        |
| created_at      | 作成日時            |     |     | DATETIME    | ◯        |       |         |                |        |
| updated_at      | 更新日時            |     |     | DATETIME    | ◯        |       |         |                |        |

### mode

| カラム名    | 説明          | PK  | FK  | 型           | NOT NULL | INDEX | default | AUTO INCREMENT | Unique |
| ----------- | ------------- | --- | --- | ------------ | -------- | ----- | ------- | -------------- | ------ |
| id          | 問題モード ID | ◯   |     | VARCHAR(36)  | ◯        | ◯     |         |                | ◯      |
| name        | 名前          |     |     | VARCHAR(50)  | ◯        |       |         |                |        |
| description | 説明          |     |     | VARCHAR(100) | ◯        |       |         |                |        |
| is_public   | 公開フラグ    |     |     | BOOLEAN      | ◯        |       |         |                |        |
| created_at  | 作成日時      |     |     | DATETIME     | ◯        |       |         |                |        |
| updated_at  | 更新日時      |     |     | DATETIME     | ◯        |       |         |                |        |

### user_costumes

ユーザが所持している着せ替え

| カラム名   | 説明            | PK  | FK  | 型          | NOT NULL | INDEX | default | AUTO INCREMENT | Unique |
| ---------- | --------------- | --- | --- | ----------- | -------- | ----- | ------- | -------------- | ------ |
| user_id    | ユーザ ID       | ◯   | ◯   | VARCHAR(36) | ◯        | ◯     |         |                |        |
| costume_id | コスチューム ID | ◯   |     | VARCHAR(36) | ◯        | ◯     |         |                |        |
| created_at | 作成日時        |     |     | DATETIME    | ◯        |       |         |                |        |

---

## MicroCMS

### クイズ

| フィールド ID | 表示名           | PK  | FK  | 型                                 | NOT NULL | default | Unique |
| ------------- | ---------------- | --- | --- | ---------------------------------- | -------- | ------- | ------ |
|               | コンテンツ ID    | ◯   |     | VARCHAR(36)                        |          |         | ◯      |
| title         | タイトル         |     |     | VARCHAR(100)                       |          |         |        |
| content       | 本文             |     |     | TEXT                               |          |         |        |
| tier          | 難易度           |     |     | INT                                |          |         |        |
| images        | 画像             |     |     | VARCHAR(255)                       |          |         |        |
| question      | 質問文           |     |     | TEXT                               |          |         |        |
| news_url      | 元ニュースの URL |     |     | TEXT                               |          |         |        |
| choices       | 選択肢           |     |     | TEXT[]                             |          |         |        |
| type          | クイズタイプ     |     |     | ENUM(’TRUE_OR_FALSE’, ‘SELECTION’) |          |         |        |
| answer        | 解答             |     |     | TEXT                               |          |         |        |
| explanation   | 解説             |     |     | TEXT                               |          |         |        |
| hint          | ヒント           |     |     | TEXT                               |          |         |        |
| keyword       | キーワード       |     |     | TEXT                               |          |         |        |
| isDeleted     | 削除フラグ       |     |     | BOOLEAN                            |          | False   |        |
| createdAt     | 作成日時         |     |     | DATETIME                           |          |         |        |
| updatedAt     | 更新日時         |     |     | DATETIME                           |          |         |        |

### キャラクター

| フィールド ID | 表示名        | PK  | FK  | 型                        | NOT NULL | default | Unique |
| ------------- | ------------- | --- | --- | ------------------------- | -------- | ------- | ------ |
|               | コンテンツ ID | ◯   |     | VARCHAR(36)               |          |         | ◯      |
| images        | 画像          |     |     | VARCHAR(255)              |          |         |        |
| name          | 名前          |     |     | VARCHAR(50)               |          |         |        |
| lines         | セリフ        |     |     | TEXT[]                    |          |         |        |
| category      | カテゴリ      |     |     | ENUM(’COSTUME’, ‘WANTED’) |          |         |        |
| createdAt     | 作成日時      |     |     | DATETIME                  |          |         |        |
| updatedAt     | 更新日時      |     |     | DATETIME                  |          |         |        |
