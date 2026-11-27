class Student:
    def study(self, subject):
        return f"{self.name}正在学习{subject}"

s1 = Student()
s1.name = "小明"
s2 = Student()
s2.name = "小红"
print(s1.study("Python"))
print(s2.study("数学"))
