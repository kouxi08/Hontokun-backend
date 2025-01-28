# DB 設計

## バックエンド

### user

ユーザ

| カラム名     | 説明                         | PK  | FK  | 型           | NOT NULL | INDEX | default | AUTO INCREMENT | Unique |
| ------------ | ---------------------------- | --- | --- | ------------ | -------- | ----- | ------- | -------------- | ------ |
| id           | ユーザID                     | ◯   |     | CHAR(36)     | ◯        |       |         |                |        |
| firebase_uid | Firebase AuthenticationのUID |     |     | VARCHAR(128) | ◯        | ◯     |         |                | ◯      |
| nickname     | ニックネーム                 |     |     | VARCHAR(20)  | ◯        |       |         |                |        |
| birthday     | 生年月日                     |     |     | DATE         |          |       |         |                |        |
| level        | レベル                       |     |     | INT          | ◯        |       | 1       |                |        |
| experience   | 経験値                       |     |     | INT          | ◯        |       | 0       |                |        |
| costume_id   | 着せ替えID                   |     |     | CHAR(36)     | ◯        |       |         |                |        |
| created_at   | 作成日時                     |     |     | DATETIME     | ◯        |       |         |                |        |
| updated_at   | 更新日時                     |     |     | DATETIME     | ◯        |       |         |                |        |

### quiz_set_log

クイズセットログ

| カラム名     | 説明             | PK  | FK  | 型       | NOT NULL | INDEX | default | AUTO INCREMENT | Unique |
| ------------ | ---------------- | --- | --- | -------- | -------- | ----- | ------- | -------------- | ------ |
| id           | クイズセットID   | ◯   |     | CHAR(36) | ◯        | ◯     |         |                |        |
| user_id      | ユーザID         |     | ◯   | CHAR(36) | ◯        | ◯     |         |                |        |
| quiz_mode_id | 問題モードID     |     | ◯   | CHAR(36) | ◯        |       |         |                |        |
| created_at   | 作成日時（解答） |     |     | DATETIME | ◯        |       |         |                |        |
| updated_at   | 更新日時         |     |     | DATETIME | ◯        |       |         |                |        |

### quiz_log

クイズログ

| カラム名        | 説明               | PK  | FK  | 型       | NOT NULL | INDEX | default | AUTO INCREMENT | Unique |
| --------------- | ------------------ | --- | --- | -------- | -------- | ----- | ------- | -------------- | ------ |
| id              | クイズログID       | ◯   |     | CHAR(36) | ◯        |       |         |                |        |
| quiz_id         | クイズID           |     |     | CHAR(36) | ◯        |       |         |                |        |
| quiz_set_log_id | クイズセットログID |     | ◯   | CHAR(36) | ◯        | ◯     |         |                |        |
| user_answer     | ユーザの解答       |     |     | TEXT     | ◯        |       |         |                |        |
| time            | 解答タイム         |     |     | INT      |          |       |         |                |        |
| is_correct      | 正誤フラグ         |     |     | BOOLEAN  | ◯        |       |         |                |        |
| created_at      | 作成日時           |     |     | DATETIME | ◯        |       |         |                |        |
| updated_at      | 更新日時           |     |     | DATETIME | ◯        |       |         |                |        |

### quiz_mode

| カラム名    | 説明         | PK  | FK  | 型           | NOT NULL | INDEX | default | AUTO INCREMENT | Unique |
| ----------- | ------------ | --- | --- | ------------ | -------- | ----- | ------- | -------------- | ------ |
| id          | 問題モードID | ◯   |     | CHAR(36)     | ◯        |       |         |                |        |
| name        | 名前         |     |     | VARCHAR(20)  | ◯        |       |         |                |        |
| description | 説明         |     |     | VARCHAR(100) | ◯        |       |         |                |        |
| is_public   | 公開フラグ   |     |     | BOOLEAN      | ◯        |       |         |                |        |
| created_at  | 作成日時     |     |     | DATETIME     | ◯        |       |         |                |        |
| updated_at  | 更新日時     |     |     | DATETIME     | ◯        |       |         |                |        |

### user_costumes

ユーザが所持している着せ替え

| カラム名   | 説明           | PK  | FK  | 型       | NOT NULL | INDEX | default | AUTO INCREMENT | Unique |
| ---------- | -------------- | --- | --- | -------- | -------- | ----- | ------- | -------------- | ------ |
| user_id    | ユーザID       | ◯   | ◯   | CHAR(36) | ◯        |       |         |                |        |
| costume_id | コスチュームID | ◯   |     | CHAR(36) | ◯        | ◯     |         |                |        |
| created_at | 作成日時       |     |     | DATETIME | ◯        |       |         |                |        |
| updated_at | 更新日時       |     |     | DATETIME | ◯        |       |         |                |        |

### quiz

| カラム名     | 説明            | PK  | FK  | 型           | NOT NULL | default | Unique |                      |
| ------------ | --------------- | --- | --- | ------------ | -------- | ------- | ------ | -------------------- |
| id           | コンテンツID    | ◯   |     | CHAR(36)     | ◯        |         |        |                      |
| title        | タイトル        |     |     | VARCHAR(50)  | ◯        |         |        |                      |
| content      | 本文            |     |     | TEXT         | ◯        |         |        |                      |
| tier         | 難易度          |     |     | INT          | ◯        |         |        | 最小値：1, 最大値：5 |
| image_url    | 画像URL         |     |     | VARCHAR(255) |          |         |        |                      |
| image_height | 画像の横幅      |     |     | INT          |          |         |        |                      |
| image_width  | 画像の縦幅      |     |     | INT          |          |         |        |                      |
| question     | 質問文          |     |     | TEXT         | ◯        |         |        |                      |
| news_url     | 元ニュースのURL |     |     | TEXT         |          |         |        |                      |
| type         | クイズタイプ    |     |     | VARCHAR(20)  | ◯        |         |        |                      |
| answer       | 解答            |     |     | TEXT         | ◯        |         |        |                      |
| explanation  | 解説            |     |     | TEXT         | ◯        |         |        |                      |
| hint         | ヒント          |     |     | TEXT         | ◯        |         |        |                      |
| keyword      | キーワード      |     |     | TEXT         | ◯        |         |        |                      |
| is_deleted   | 削除フラグ      |     |     | BOOLEAN      | ◯        | False   |        |                      |
| created_at   | 作成日時        |     |     | DATETIME     | ◯        |         |        |                      |
| updated_at   | 更新日時        |     |     | DATETIME     | ◯        |         |        |                      |

### choices

| カラム名   | 説明     | PK  | FK  | 型          | NOT NULL | INDEX | default | Unique | AUTO INCREMENT |
| ---------- | -------- | --- | --- | ----------- | -------- | ----- | ------- | ------ | -------------- |
| id         |          | ◯   |     | INT         | ◯        |       |         |        | ◯              |
| quiz_id    |          |     | ◯   | CHAR(36)    | ◯        |       |         |        |                |
| name       |          |     |     | VARCHAR(50) | ◯        |       |         |        |                |
| created_at | 作成日時 |     |     | DATETIME    | ◯        |       |         |        |                |
| updated_at | 更新日時 |     |     | DATETIME    | ◯        |       |         |        |                |

---

## MicroCMS

### クイズ

| フィールドID | 表示名          | PK  | FK  | 型                                 | NOT NULL | default | Unique |           |
| ------------ | --------------- | --- | --- | ---------------------------------- | -------- | ------- | ------ | --------- |
| contents_id  | コンテンツID    | ◯   |     | CHAR(36)                           | ◯        |         |        |           |
| title        | タイトル        |     |     | VARCHAR(50)                        | ◯        |         |        |           |
| content      | 本文            |     |     | TEXT                               | ◯        |         |        |           |
| tier         | 難易度          |     |     | INT                                | ◯        |         |        | 最小値：1 |
| 最大値：5    |
| image        | 画像            |     |     | Image                              | ◯        |         |        |           |
| question     | 質問文          |     |     | TEXT                               | ◯        |         |        |           |
| news_url     | 元ニュースのURL |     |     | TEXT                               |          |         |        |           |
| choices      | 選択肢          |     |     | TEXT[]                             |          |         |        |           |
| type         | クイズタイプ    |     |     | ENUM(’TRUE_OR_FALSE’, ‘SELECTION’) | ◯        |         |        |           |
| answer       | 解答            |     |     | TEXT                               | ◯        |         |        |           |
| explanation  | 解説            |     |     | TEXT                               | ◯        |         |        |           |
| hint         | ヒント          |     |     | TEXT                               | ◯        |         |        |           |
| keyword      | キーワード      |     |     | TEXT                               | ◯        |         |        |           |
| is_deleted   | 削除フラグ      |     |     | BOOLEAN                            | ◯        | False   |        |           |
| created_at   | 作成日時        |     |     | DATETIME                           | ◯        |         |        |           |
| updated_at   | 更新日時        |     |     | DATETIME                           | ◯        |         |        |           |

### キャラクター

| フィールドID | 表示名       | PK  | FK  | 型                        | NOT NULL | default | Unique |
| ------------ | ------------ | --- | --- | ------------------------- | -------- | ------- | ------ |
| contents_id  | コンテンツID | ◯   |     | CHAR(36)                  |          | ◯       |        |
| images       | 画像         |     |     | VARCHAR(255)              |          | ◯       |        |
| name         | 名前         |     |     | VARCHAR(50)               |          | ◯       |        |
| lines        | セリフ       |     |     | TEXT[]                    |          | ◯       |        |
| category     | カテゴリ     |     |     | ENUM(’COSTUME’, ‘WANTED’) |          | ◯       |        |
| created_at   | 作成日時     |     |     | DATETIME                  |          | ◯       |        |
| updated_at   | 更新日時     |     |     | DATETIME                  |          | ◯       |        |
