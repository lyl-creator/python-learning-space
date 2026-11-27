class Student:
    def rename(self, name):
        old_name = self.name
        self.name = name
        return old_name

s = Student()
s.name = "小明"
print(s.rename("小林"))
print(s.name)
