"""
TOTP 工具模块
提供 2FA 验证码生成功能
"""
import time
import pyotp


def generate_totp(secret):
    """
    生成 TOTP 验证码
    
    Args:
        secret: TOTP 密钥（Base32 编码）
    
    Returns:
        6 位数字验证码字符串
    
    Raises:
        ValueError: 密钥无效
    """
    if not secret:
        raise ValueError('TOTP 密钥不能为空')
    
    try:
        # 清理密钥中的空格
        secret = secret.replace(' ', '').upper()
        totp = pyotp.TOTP(secret)
        return totp.now()
    except Exception as e:
        raise ValueError(f'无效的 TOTP 密钥: {str(e)}')


def get_remaining_seconds():
    """
    获取当前 TOTP 验证码的剩余有效时间
    
    Returns:
        剩余秒数（1-30）
    """
    return 30 - (int(time.time()) % 30)


def verify_totp(secret, code):
    """
    验证 TOTP 验证码
    
    Args:
        secret: TOTP 密钥
        code: 用户输入的验证码
    
    Returns:
        验证是否成功
    """
    if not secret or not code:
        return False
    
    try:
        secret = secret.replace(' ', '').upper()
        totp = pyotp.TOTP(secret)
        return totp.verify(code)
    except Exception:
        return False
