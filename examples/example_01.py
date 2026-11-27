class Student:
    def introduce(self):
        return f"我是{self.name}，今年{self.age}岁"

    def grow_up(self):
        self.age += 1

s1 = Student()
s1.name = "小明"
s1.age = 18

s2 = Student()
s2.name = "小红"
s2.age = 20

print(s1.introduce())
print(s2.introduce())
s1.grow_up()
print(s1.age, s2.age)
print(Student.introduce(s1))
