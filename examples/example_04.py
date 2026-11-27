class Student:
    def __init__(self, name):
        self.name = name
        self.courses = []

    def add_course(self, course):
        self.courses.append(course)

s1 = Student("小明")
s2 = Student("小红")
s1.add_course("Python")
print(s1.courses)
print(s2.courses)
