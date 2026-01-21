"""
账号历史记录模型
记录账号字段的修改历史
"""
from app import db
from datetime import datetime


class AccountHistory(db.Model):
    """账号修改历史记录"""
    __tablename__ = 'account_history'
    
    id = db.Column(db.Integer, primary_key=True)
    account_id = db.Column(db.Integer, db.ForeignKey('accounts.id'), nullable=False)
    field_name = db.Column(db.String(50), nullable=False)  # 字段名：password/secret/recovery
    old_value = db.Column(db.Text)  # 修改前的值
    new_value = db.Column(db.Text)  # 修改后的值
    changed_at = db.Column(db.DateTime, default=datetime.now)  # 修改时间
    
    # 关联账号
    account = db.relationship('Account', backref=db.backref('history', lazy='dynamic'))
    
    def to_dict(self):
        """转换为字典"""
        return {
            'id': self.id,
            'accountId': self.account_id,
            'fieldName': self.field_name,
            'oldValue': self.old_value,
            'newValue': self.new_value,
            'changedAt': self.changed_at.strftime('%Y-%m-%d %H:%M:%S') if self.changed_at else None
        }
    
    @staticmethod
    def get_field_display_name(field_name):
        """获取字段的中文显示名称"""
        names = {
            'password': '密码',
            'secret': '2FA密钥',
            'recovery': '恢复邮箱'
        }
        return names.get(field_name, field_name)
