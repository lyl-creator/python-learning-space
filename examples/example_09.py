class Book:
    def __init__(self, title, pages):
        self.title = title
        self.pages = pages

    def describe(self):
        return f"{self.title} 共{self.pages}页"

b1 = Book("Python入门", 200)
b2 = Book("数学故事", 120)
print(b1.describe())
print(b2.describe())
