"""
主页面路由
负责渲染前端页面
"""
from flask import Blueprint, send_from_directory, current_app
import os

main_bp = Blueprint('main', __name__)


@main_bp.route('/')
def index():
    """
    首页路由
    返回编译后的 React 前端页面
    """
    return send_from_directory(current_app.static_folder, 'index.html')


@main_bp.route('/assets/<path:filename>')
def serve_assets(filename):
    """
    静态资源路由
    服务 JS、CSS 等资源文件
    """
    assets_path = os.path.join(current_app.static_folder, 'assets')
    return send_from_directory(assets_path, filename)
