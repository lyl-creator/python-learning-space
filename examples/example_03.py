class Student:
    def __init__(self, name, age=18):
        self.name = name
        self.age = age

    def introduce(self):
        return f"{self.name}：{self.age}岁"

s1 = Student("小明")
s2 = Student("小红", 20)
print(s1.introduce())
print(s2.introduce())
