"""
API 路由模块
提供账号管理的 RESTful API
"""
from flask import Blueprint, request, jsonify
from app.services.account_service import AccountService
from app.services.auth_service import AuthService
from app.models.account_history import AccountHistory

api_bp = Blueprint('api', __name__)


def get_client_ip():
    """获取客户端真实 IP"""
    if request.headers.get('X-Forwarded-For'):
        return request.headers.get('X-Forwarded-For').split(',')[0].strip()
    return request.remote_addr or '127.0.0.1'


def success_response(data=None, message='操作成功'):
    """成功响应格式"""
    return jsonify({
        'success': True,
        'data': data,
        'message': message
    })


def error_response(message='操作失败', code=400):
    """错误响应格式"""
    return jsonify({
        'success': False,
        'data': None,
        'message': message
    }), code


@api_bp.route('/accounts', methods=['GET'])
def get_accounts():
    """
    获取所有账号列表
    
    Query Params:
        search: 搜索关键词（可选）
    
    Returns:
        账号列表
    """
    search = request.args.get('search', '')
    accounts = AccountService.get_all_accounts(search)
    return success_response(data=accounts)


@api_bp.route('/accounts', methods=['POST'])
def create_account():
    """
    创建单个账号
    
    Request Body:
        email: 邮箱账号
        password: 登录密码
        recovery: 恢复邮箱
        secret: 2FA 密钥
        remark: 备注
    
    Returns:
        创建的账号信息
    """
    data = request.get_json()
    if not data:
        return error_response('请求数据为空')
    
    # 验证必填字段
    if not data.get('email') or not data.get('password'):
        return error_response('邮箱和密码为必填项')
    
    try:
        account = AccountService.create_account(data)
        return success_response(data=account, message='账号创建成功')
    except ValueError as e:
        return error_response(str(e))
    except Exception as e:
        return error_response(f'创建失败: {str(e)}', 500)


@api_bp.route('/accounts/batch', methods=['POST'])
def batch_import():
    """
    批量导入账号
    
    Request Body:
        accounts: 账号列表数组
    
    Returns:
        导入结果统计
    """
    data = request.get_json()
    if not data or 'accounts' not in data:
        return error_response('请求数据格式错误')
    
    accounts = data.get('accounts', [])
    if not accounts:
        return error_response('导入列表为空')
    
    try:
        result = AccountService.batch_import(accounts)
        return success_response(
            data=result,
            message=f"成功导入 {result['success_count']} 个账号"
        )
    except Exception as e:
        return error_response(f'批量导入失败: {str(e)}', 500)


@api_bp.route('/accounts/<int:account_id>', methods=['PUT'])
def update_account(account_id):
    """
    更新账号信息
    
    Path Params:
        account_id: 账号ID
    
    Request Body:
        email: 邮箱账号
        password: 登录密码
        recovery: 恢复邮箱
        secret: 2FA 密钥
        remark: 备注
    
    Returns:
        更新后的账号信息
    """
    data = request.get_json()
    if not data:
        return error_response('请求数据为空')
    
    try:
        account = AccountService.update_account(account_id, data)
        if account is None:
            return error_response('账号不存在', 404)
        return success_response(data=account, message='账号更新成功')
    except ValueError as e:
        return error_response(str(e))
    except Exception as e:
        return error_response(f'更新失败: {str(e)}', 500)


@api_bp.route('/accounts/<int:account_id>', methods=['DELETE'])
def delete_account(account_id):
    """
    删除账号
    
    Path Params:
        account_id: 账号ID
    
    Returns:
        删除结果
    """
    try:
        success = AccountService.delete_account(account_id)
        if not success:
            return error_response('账号不存在', 404)
        return success_response(message='账号已删除')
    except Exception as e:
        return error_response(f'删除失败: {str(e)}', 500)


@api_bp.route('/accounts/<int:account_id>/status', methods=['PATCH'])
def toggle_status(account_id):
    """
    切换账号状态
    
    Path Params:
        account_id: 账号ID
    
    Returns:
        更新后的账号信息
    """
    try:
        account = AccountService.toggle_status(account_id)
        if account is None:
            return error_response('账号不存在', 404)
        return success_response(data=account, message='状态已更新')
    except Exception as e:
        return error_response(f'状态更新失败: {str(e)}', 500)


@api_bp.route('/accounts/<int:account_id>/sold', methods=['PATCH'])
def toggle_sold_status(account_id):
    """
    切换账号出售状态
    
    Path Params:
        account_id: 账号ID
    
    Returns:
        更新后的账号信息
    """
    try:
        account = AccountService.toggle_sold_status(account_id)
        if account is None:
            return error_response('账号不存在', 404)
        return success_response(data=account, message='出售状态已更新')
    except Exception as e:
        return error_response(f'出售状态更新失败: {str(e)}', 500)


@api_bp.route('/accounts/<int:account_id>/2fa', methods=['GET'])
def get_2fa_code(account_id):
    """
    获取账号的 2FA 验证码
    
    Path Params:
        account_id: 账号ID
    
    Returns:
        当前的 TOTP 验证码和剩余有效时间
    """
    try:
        result = AccountService.get_2fa_code(account_id)
        if result is None:
            return error_response('账号不存在或未配置 2FA 密钥', 404)
        return success_response(data=result)
    except Exception as e:
        return error_response(f'获取验证码失败: {str(e)}', 500)


@api_bp.route('/accounts/<int:account_id>/history', methods=['GET'])
def get_account_history(account_id):
    """
    获取账号修改历史记录
    
    Path Params:
        account_id: 账号ID
    
    Returns:
        账号的修改历史列表
    """
    try:
        # 获取该账号的所有历史记录，按时间倒序
        history = AccountHistory.query.filter_by(account_id=account_id)\
            .order_by(AccountHistory.changed_at.desc()).all()
        
        return success_response(data=[h.to_dict() for h in history])
    except Exception as e:
        return error_response(f'获取历史记录失败: {str(e)}', 500)


@api_bp.route('/auth/login', methods=['POST'])
def login():
    """
    管理员登录验证
    
    Request Body:
        password: 管理员密码
    
    Returns:
        登录结果
    """
    client_ip = get_client_ip()
    
    # 检查 IP 是否被封禁
    is_banned, remaining = AuthService.is_ip_banned(client_ip)
    if is_banned:
        hours = remaining // 3600
        minutes = (remaining % 3600) // 60
        return error_response(f'您的 IP 已被封禁，剩余时间：{hours}小时{minutes}分钟', 403)
    
    data = request.get_json()
    if not data or 'password' not in data:
        return error_response('请输入密码')
    
    password = data.get('password', '')
    salt = data.get('salt', '')
    
    # 验证盐值
    if not salt or not AuthService.verify_salt(salt):
        return error_response('安全验证失败，请刷新页面重试', 400)
    
    if AuthService.verify_password(password):
        # 登录成功，清除失败记录
        AuthService.clear_failed_attempts(client_ip)
        return success_response(message='登录成功')
    else:
        # 登录失败，记录尝试
        is_now_banned, remaining_attempts = AuthService.record_failed_attempt(client_ip)
        
        if is_now_banned:
            return error_response('密码错误次数过多，您的 IP 已被封禁 24 小时', 403)
        else:
            return error_response(f'密码错误，还剩 {remaining_attempts} 次尝试机会', 401)


@api_bp.route('/auth/check', methods=['GET'])
def check_auth():
    """
    检查 IP 是否被封禁（前端用于显示登录页时检查）
    
    Returns:
        封禁状态
    """
    client_ip = get_client_ip()
    is_banned, remaining = AuthService.is_ip_banned(client_ip)
    
    if is_banned:
        hours = remaining // 3600
        minutes = (remaining % 3600) // 60
        return jsonify({
            'success': False,
            'banned': True,
            'message': f'您的 IP 已被封禁，剩余时间：{hours}小时{minutes}分钟'
        })
    
    return jsonify({
        'success': True,
        'banned': False
    })
