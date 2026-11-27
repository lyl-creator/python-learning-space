class Person:
    def __init__(self, name):
        self.name = name

    def introduce(self):
        return f"我是{self.name}"

class Student(Person):
    def __init__(self, name, student_id):
        super().__init__(name)
        self.student_id = student_id

    def study(self):
        return f"{self.name}正在学习 Python"

s = Student("小明", "S001")
print(s.introduce())
print(s.study())
print(s.student_id)
