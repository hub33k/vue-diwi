-- user.surql
-- ===========================================================================
DEFINE TABLE IF NOT EXISTS user SCHEMALESS;

DEFINE FIELD IF NOT EXISTS email ON TABLE user TYPE string ASSERT string::is::email($value);
DEFINE INDEX IF NOT EXISTS userEmailIndex ON TABLE user COLUMNS email UNIQUE;

DEFINE FIELD IF NOT EXISTS username ON TABLE user TYPE string;
DEFINE INDEX IF NOT EXISTS userUsernameIndex ON TABLE user COLUMNS username UNIQUE;

DEFINE FIELD IF NOT EXISTS password_hash ON TABLE user TYPE string;

DEFINE FIELD IF NOT EXISTS name ON TABLE user TYPE option<string>;
DEFINE FIELD IF NOT EXISTS refresh_token ON TABLE user TYPE option<string>;

DEFINE FIELD IF NOT EXISTS created_at ON TABLE user READONLY TYPE datetime VALUE time::now();
DEFINE FIELD IF NOT EXISTS updated_at ON TABLE user TYPE datetime DEFAULT time::now() VALUE time::now();

-- note.surql
-- ===========================================================================
DEFINE TABLE IF NOT EXISTS note SCHEMALESS;

DEFINE FIELD IF NOT EXISTS user_id ON TABLE note TYPE record<user>;

DEFINE FIELD IF NOT EXISTS title ON TABLE note TYPE string;
DEFINE FIELD IF NOT EXISTS content ON TABLE note TYPE string;
DEFINE FIELD IF NOT EXISTS tags ON TABLE note TYPE array<string>;

DEFINE FIELD IF NOT EXISTS created_at ON TABLE note READONLY TYPE datetime VALUE time::now();
DEFINE FIELD IF NOT EXISTS updated_at ON TABLE note TYPE datetime DEFAULT time::now() VALUE time::now();
