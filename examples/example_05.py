class CampusCard:
    def __init__(self, owner):
        self.owner = owner
        self._balance = 0  # 用整数表示元

    def recharge(self, amount):
        if amount <= 0:
            return False
        self._balance += amount
        return True

    def spend(self, amount):
        if amount <= 0 or amount > self._balance:
            return False
        self._balance -= amount
        return True

    def get_balance(self):
        return self._balance

card = CampusCard("小明")
print(card.recharge(50))
print(card.spend(12))
print(card.spend(100))
print(card.get_balance())
