class Person:
    def __init__(self, name):
        self.name = name

    def introduce(self):
        return f"我是{self.name}"

class Student(Person):
    def introduce(self):
        return f"我是学生{self.name}"

class Teacher(Person):
    def introduce(self):
        return f"我是教师{self.name}"

def greet(person):
    print(person.introduce())

for person in [Student("小明"), Teacher("王老师")]:
    greet(person)
