"""
认证服务模块
处理管理员登录和 IP 封禁逻辑
"""
import time
import hashlib
from threading import Lock

# 管理员密码（可以修改为您想要的密码）
ADMIN_PASSWORD = "admin123"

# IP 封禁配置
MAX_FAILED_ATTEMPTS = 3  # 最大失败次数
BAN_DURATION = 24 * 60 * 60  # 封禁时长（秒）= 24小时

# 盐值验证有效时间范围（秒）- 允许前后 60 秒的误差
SALT_VALID_RANGE = 10

# 存储登录尝试记录 {ip: {'attempts': 0, 'last_attempt': timestamp, 'banned_until': timestamp}}
login_attempts = {}
lock = Lock()


class AuthService:
    """认证服务类"""
    
    @staticmethod
    def is_ip_banned(ip):
        """
        检查 IP 是否被封禁
        
        Args:
            ip: 客户端 IP 地址
        
        Returns:
            (is_banned, remaining_seconds) 元组
        """
        with lock:
            if ip not in login_attempts:
                return False, 0
            
            record = login_attempts[ip]
            banned_until = record.get('banned_until', 0)
            
            if banned_until > time.time():
                remaining = int(banned_until - time.time())
                return True, remaining
            
            return False, 0
    
    @staticmethod
    def record_failed_attempt(ip):
        """
        记录失败的登录尝试
        
        Args:
            ip: 客户端 IP 地址
        
        Returns:
            (is_now_banned, remaining_attempts) 元组
        """
        with lock:
            current_time = time.time()
            
            if ip not in login_attempts:
                login_attempts[ip] = {
                    'attempts': 0,
                    'last_attempt': 0,
                    'banned_until': 0
                }
            
            record = login_attempts[ip]
            
            # 如果距离上次尝试超过1小时，重置计数
            if current_time - record['last_attempt'] > 3600:
                record['attempts'] = 0
            
            record['attempts'] += 1
            record['last_attempt'] = current_time
            
            if record['attempts'] >= MAX_FAILED_ATTEMPTS:
                record['banned_until'] = current_time + BAN_DURATION
                return True, 0
            
            remaining = MAX_FAILED_ATTEMPTS - record['attempts']
            return False, remaining
    
    @staticmethod
    def clear_failed_attempts(ip):
        """
        清除登录失败记录（登录成功后调用）
        
        Args:
            ip: 客户端 IP 地址
        """
        with lock:
            if ip in login_attempts:
                login_attempts[ip] = {
                    'attempts': 0,
                    'last_attempt': 0,
                    'banned_until': 0
                }
    
    @staticmethod
    def verify_password(password):
        """
        验证管理员密码
        
        Args:
            password: 提交的密码
        
        Returns:
            是否验证成功
        """
        return password == ADMIN_PASSWORD
    
    @staticmethod
    def generate_salt(timestamp):
        """
        根据时间戳生成盐值
        
        Args:
            timestamp: 时间戳
        
        Returns:
            MD5 哈希后的盐值
        """
        salt_base = str(timestamp - 2003)
        return hashlib.md5(salt_base.encode()).hexdigest()
    
    @staticmethod
    def verify_salt(salt):
        """
        验证盐值是否有效（允许前后 60 秒的时间误差）
        
        Args:
            salt: 客户端提交的盐值
        
        Returns:
            是否验证成功
        """
        current_timestamp = int(time.time())
        
        # 检查前后 SALT_VALID_RANGE 秒内的盐值
        for offset in range(-SALT_VALID_RANGE, SALT_VALID_RANGE + 1):
            expected_salt = AuthService.generate_salt(current_timestamp + offset)
            if salt == expected_salt:
                return True
        
        return False
    
    @staticmethod
    def get_ban_info():
        """
        获取当前封禁的 IP 信息（管理用）
        
        Returns:
            封禁的 IP 列表
        """
        with lock:
            current_time = time.time()
            banned = []
            for ip, record in login_attempts.items():
                if record.get('banned_until', 0) > current_time:
                    banned.append({
                        'ip': ip,
                        'banned_until': record['banned_until'],
                        'remaining': int(record['banned_until'] - current_time)
                    })
            return banned
