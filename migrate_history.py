"""
数据库迁移脚本 - 添加账号历史记录表
"""
import sqlite3
import os

# 数据库路径
db_path = os.path.join(os.path.dirname(__file__), 'instance', 'accounts.db')

print(f"数据库路径: {db_path}")

# 连接数据库
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# 检查表是否已存在
cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='account_history'")
if cursor.fetchone():
    print("account_history 表已存在，无需迁移")
else:
    # 创建账号历史记录表
    cursor.execute('''
        CREATE TABLE account_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            account_id INTEGER NOT NULL,
            field_name VARCHAR(50) NOT NULL,
            old_value TEXT,
            new_value TEXT,
            changed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (account_id) REFERENCES accounts(id)
        )
    ''')
    
    # 创建索引以加速查询
    cursor.execute('CREATE INDEX idx_account_history_account_id ON account_history(account_id)')
    cursor.execute('CREATE INDEX idx_account_history_changed_at ON account_history(changed_at)')
    
    conn.commit()
    print("数据库迁移成功！account_history 表已创建")

conn.close()
