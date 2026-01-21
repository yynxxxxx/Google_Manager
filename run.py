"""
应用启动入口
"""
import os
from app import create_app

# 确保实例目录存在
instance_path = os.path.join(os.path.dirname(__file__), 'instance')
if not os.path.exists(instance_path):
    os.makedirs(instance_path)

# 创建应用实例
app = create_app()

if __name__ == '__main__':
    print('=' * 50)
    print('谷歌账号管理系统启动中...')
    print('访问地址: http://localhost:8002')
    print('=' * 50)
    app.run(host='0.0.0.0', port=8002, debug=True)
