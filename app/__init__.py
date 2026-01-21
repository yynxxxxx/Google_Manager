"""
Flask 应用工厂模块
创建和配置 Flask 应用实例
"""
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import os

# 初始化数据库扩展
db = SQLAlchemy()


def create_app(config_name=None):
    """
    应用工厂函数
    
    Args:
        config_name: 配置名称（development/production/testing）
    
    Returns:
        Flask 应用实例
    """
    app = Flask(__name__, 
                static_folder='../static',
                static_url_path='/static')
    
    # 加载配置
    from app.config import config
    config_name = config_name or os.environ.get('FLASK_ENV', 'development')
    app.config.from_object(config[config_name])
    
    # 初始化扩展
    db.init_app(app)
    CORS(app)  # 开发阶段允许跨域
    
    # 注册蓝图
    from app.routes.main import main_bp
    from app.routes.api import api_bp
    
    app.register_blueprint(main_bp)
    app.register_blueprint(api_bp, url_prefix='/api')
    
    # 创建数据库表
    with app.app_context():
        db.create_all()
    
    return app
