你目前的课堂进度是 **self、实例属性和实例方法**。先把这三者连起来：对象保存自己的数据，实例方法通过 `self` 读取或修改这些数据。能独立完成第一阶段练习后，再学习创建对象时的初始化，随后进入封装、继承和多态。

当前学习起点是 self、实例属性和实例方法。先完成自测，再勾选掌握清单；课堂进度与独立掌握情况分别记录。

# 学习路线和使用方法

| 阶段 | 学习重点 | 进入下一阶段前能做到 |
| --- | --- | --- |
| 当前重点 | self、实例属性、实例方法 | 自己写出两个学生对象，并只修改其中一个的年龄 |
| 下一步 | 构造方法与初始化 | 用 `Student("小明", 18)` 完成属性初始化 |
| 后续学习 | 封装 | 通过方法检查数据是否合理 |
| 后续学习 | 继承 | 复用父类方法，并为子类增加属性 |
| 后续学习 | 多态 | 对不同对象调用同名方法，解释不同结果 |

每次用 20 至 30 分钟学习一小节，按“先预测输出 → 运行 → 改一个条件 → 自己重写”的顺序练习。以下每个完整 Python 代码块都可以单独复制到一个 `.py` 文件，用 Python 3 运行，例如 `python3 lesson.py`；预期输出紧随其后。代码可复制或下载后用 Python 3 运行，网页不直接执行 Python。

# 第一阶段 理解 self 和对象自己的数据

## 用学生档案理解类与对象

把 `Student` 类想象成学生档案的统一模板；`s1`、`s2` 分别指向按模板建立的两份具体档案。姓名、年龄是档案中的数据，也就是属性；介绍自己、长大一岁是对象的行为，也就是方法。`self` 像方法执行时手里拿着的那份档案，决定这一行代码处理哪个学生。

| 写法 | 读法 |
| --- | --- |
| `class Student:` | 定义学生类 |
| `s1 = Student()` | 创建一个学生实例，让变量 s1 指向它 |
| `s1.name` | s1 所指对象的 name 属性 |
| `self.name` | 当前方法接收到的对象的 name 属性 |
| `s1.introduce()` | 调用 s1 的 introduce 方法 |

## 从 self 到实例属性和实例方法

先暂时手动给对象添加属性，方便看清“数据属于谁”。

```python
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
```

```text
我是小明，今年18岁
我是小红，今年20岁
19 20
我是小明，今年19岁
```

`s1.grow_up()` 调用时，Python 把 `s1` 所指的对象自动作为第一个参数传入，所以 `self.age += 1` 修改的是它的年龄。调用 `s2.introduce()` 时，方法中的 `self` 则接收到 `s2` 所指的对象。在这个普通实例方法示例中，`s1.introduce()` 与 `Student.introduce(s1)` 的效果相同。

**self 是约定的参数名，不是关键字。** 定义普通实例方法时，第一个参数通常写 `self`；通过实例调用时，不再手动传入它。两个对象可以分别保存自己的实例属性；若你把同一个可变对象赋给它们，它们也可能共享那份数据。

## 方法参数和实例属性的区别

形参像临时递来的便签，`self.name` 像档案里保存的姓名。把便签上的内容写进档案，需要显式赋值。

```python
class Student:
    def rename(self, name):
        old_name = self.name
        self.name = name
        return old_name

s = Student()
s.name = "小明"
print(s.rename("小林"))
print(s.name)
```

```text
小明
小林
```

`name` 是本次调用的参数，`old_name` 是方法内的局部变量，`self.name` 是保存在对象上的属性。方法结束后，后续方法仍可通过对象读取更新后的 `self.name`。`return` 把结果交给调用者；`print` 负责显示结果。没有执行带值的 `return` 时，方法返回 `None`。

## 第一阶段练习

1. **追踪 self**：在第一个例子中，`s1.grow_up()` 内的 `self` 对应谁？把该调用换成 `s2.grow_up()`，最后两人的年龄分别是多少？先写答案再运行。
2. **独立编写**：给 `Student` 写一个 `study(self, subject)` 方法，返回“姓名正在学习科目”。创建小明和小红两个对象，分别学习 Python 和数学。
3. **找错**：有人在方法里写 `name = "小林"`，却发现 `s.name` 没变。解释原因，并写出修改对象属性的语句。

完成标准：不用看例子，能解释一次方法调用中 `self` 的对象身份，并区分 `subject` 与 `self.name`。

# 第二阶段 构造方法与初始化

## 创建对象时填写必需信息

手动填档案容易漏写年龄，后来访问 `self.age` 就可能出现 `AttributeError`。`__init__` 像新生登记：创建对象时立即填写基本信息。

课堂常把 `__init__` 称为“构造方法”。更准确地说，它是**初始化方法**：实例创建后，Python 自动调用它来设置初始状态；真正创建实例涉及 `__new__`，现阶段先掌握 `__init__` 即可。它应返回 `None`，通常不写 `return`。

```python
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
```

```text
小明：18岁
小红：20岁
```

创建 `Student("小红", 20)` 时，实例自动传给 `self`，字符串传给 `name`，数字传给 `age`。`self.name = name` 左边是对象属性，右边是收到的参数；同名是为了表达清楚，它们不是同一个存储位置。默认值 `age=18` 允许调用者省略年龄。

## 避免不同学生共用一份列表

每个学生应有自己的课程表，因此在每次初始化时新建列表。

```python
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
```

```text
['Python']
[]
```

写在类体中的 `courses = []` 是类属性，实例未单独设置同名属性时会访问到那一个列表；对它执行 `append` 可能影响多个实例。也先避免把可变列表写成默认参数，如 `courses=[]`。当前记住“每个人自己的列表，在 `__init__` 中用 `self.courses = []` 新建”即可。

## 第二阶段练习

4. 写 `Book` 类，用 `__init__(self, title, pages)` 保存书名和页数；写 `describe()` 返回“Python入门 共200页”。创建两本不同的书，确认属性互不覆盖。

完成标准：能在创建对象的一行代码中传入初始数据，并解释 `self.title = title` 两边的含义。

# 第三阶段 封装数据和操作规则

## 用校园卡理解封装

校园卡有余额，也有充值和消费的规则。把余额和操作余额的方法放在一起，调用者通过清楚的方法使用它，这就是封装的一部分。重点是让对象负责维护合理的状态。

Python 的 `_balance` 单下划线表示“内部使用”的约定，不会阻止外部访问。双下划线如 `__balance` 会触发名称改写，主要用于减少子类中的名称冲突，也不是绝对私有或安全屏障。

```python
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
```

```text
True
True
False
38
```

这个入门例子约定传入整数金额。余额不足时返回 `False`，余额保持原值。使用 `spend(12)` 可以执行检查；直接给内部余额赋值会绕过这些规则。后续可学习 `@property`，用属性访问的写法实现读取或赋值检查。

## 第三阶段练习

5. 新建一张卡，依次充值 30、消费 8、消费 50、充值 -5。预测每次返回值与最终余额。再给类增加 `can_afford(self, amount)`，返回是否能支付一个正金额，调用它时不扣款。

完成标准：能说明“把数据藏起来”和“让方法维护规则”有什么关系，并验证失败操作不改变余额。

# 第四阶段 通过继承扩展已有类

## 用人员与学生理解继承

学生是一种人员，都有姓名和自我介绍行为；学生还多出学号。继承可以复用共同部分，再增加子类特有的数据。先判断是否存在“是一种”的关系：学生是一种人员；校园卡属于学生，通常更适合保存为属性。

```python
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
```

```text
我是小明
小明正在学习 Python
S001
```

`class Student(Person)` 表示 `Student` 继承 `Person`。子类没有定义 `introduce`，于是可以使用继承的方法。子类自己定义了 `__init__`，这里通过 `super().__init__(name)` 调用父类的初始化逻辑，完成姓名赋值。在这个单继承例子中，`super()` 可以先理解为“接着调用父类的实现”。

## 第四阶段练习

6. 参照示例写 `Teacher(Person)`，初始化时保存姓名和课程 `subject`；写 `teach()` 返回“王老师正在教数学”。保留对继承的 `introduce()` 的调用。

完成标准：能说出父类负责哪些数据、子类增加哪些数据，并解释省略这里的 `super().__init__(name)` 为什么会导致姓名未初始化。

# 第五阶段 同一种调用表现出多态

## 用自我介绍理解多态

课堂点名时，老师发出同一个要求“介绍自己”，学生和教师可以给出不同内容。程序也可以只调用 `introduce()`，由具体对象决定执行哪个实现。

```python
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
```

```text
我是学生小明
我是教师王老师
```

子类提供自己的同名方法叫**方法重写**。`greet` 的写法没有变化，结果随传入对象变化，这展示了多态。这里两个子类继承了父类的初始化方法，所以可以直接传入姓名。

Python 还支持“鸭子类型”：另一个类即使不继承 `Person`，只要提供了适用的 `introduce()`，也可用于这里的 `greet`。如果缺少该方法，调用时会失败；不是任意对象都能传入。

## 第五阶段练习

7. 增加 `Robot` 类，不继承 `Person`，但提供 `introduce(self)` 返回“我是学习助手”。把 `Robot()` 也交给 `greet`。解释为什么不必在 `greet` 中为机器人增加 `if` 分支。

完成标准：能区分“继承用于复用共同逻辑”“重写用于提供新实现”“多态是相同调用对应不同表现”。

# 常见错误与排查方法

| 现象 | 先检查什么 | 修改方向 |
| --- | --- | --- |
| 方法调用时提示参数数量不对 | 定义是否遗漏 self，调用时是否又手动传了 self | 定义 `def study(self, subject)`，调用 `s.study("Python")` |
| 提示对象没有 name 或 age | 是否先初始化，属性拼写是否一致 | 在初始化方法中统一赋值，检查 `name` 与 `Name` |
| 改了 name 但对象没变 | 写的是局部变量还是实例属性 | 需要保存到对象时使用 `self.name = name` |
| 两个对象的课程一起变化 | 是否共用了类属性列表或同一个列表对象 | 需要各自保存时，在初始化中分别新建列表 |
| 打印方法结果得到 None | 方法是否只 print，没有 return | 需要调用者取得结果时使用 return |
| 子类缺少父类属性 | 子类的初始化是否执行了父类所需逻辑 | 在本指南的例子中调用 `super().__init__(name)` |

看到报错时，先从最后一行确定错误类型，再回到报错行逐个核对“对象是谁、属性何时建立、参数传了几个”。

# 练习参考答案

先独立完成对应阶段，再对照这一节。能解释为什么这样写，比记住答案更有用。

## 第一阶段答案

第 1 题中，原调用的 `self` 对应 `s1` 所指对象。替换为 `s2.grow_up()` 后，小明 18 岁，小红 21 岁。第 3 题的 `name = "小林"` 只给局部变量赋值；在实例方法中要用 `self.name = "小林"`。

第 2 题的一种完整写法：

```python
class Student:
    def study(self, subject):
        return f"{self.name}正在学习{subject}"

s1 = Student()
s1.name = "小明"
s2 = Student()
s2.name = "小红"
print(s1.study("Python"))
print(s2.study("数学"))
```

```text
小明正在学习Python
小红正在学习数学
```

## 第二阶段答案

```python
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
```

```text
Python入门 共200页
数学故事 共120页
```

## 第三至第五阶段答案要点

第 5 题四次操作依次返回 `True、True、False、False`，最终余额为 22。`can_afford` 的方法体可写为 `return 0 < amount <= self._balance`；它只有判断，没有修改余额的赋值语句。

第 6 题的 `Teacher` 继承 `Person`，在 `__init__(self, name, subject)` 中依次执行 `super().__init__(name)` 和 `self.subject = subject`。`teach` 返回 `f"{self.name}正在教{self.subject}"`。用 `Teacher("王老师", "数学")` 创建对象；它仍可调用父类的 `introduce()`。

第 7 题的 `Robot.introduce` 返回指定文本即可。`greet` 只依赖传入对象具有可用的 `introduce()` 方法，因而无需按具体类名分支。新增调用会输出“我是学习助手”。

# 综合练习 学生与校园卡

当第五阶段也能独立完成后，把已有知识合起来：创建两名学生，每名学生在初始化时建立一张自己的校园卡；学生提供 `pay(amount)` 方法，内部调用该卡的 `spend(amount)`；研究生类 `GraduateStudent` 继承学生类，增加研究方向并重写自我介绍。

验收时检查以下结果：

- [ ] 给甲充值 50 元，乙的余额仍为 0。
- [ ] 甲消费 12 元后为 38 元，再消费 100 元失败，余额仍为 38。
- [ ] 普通学生和研究生放入同一列表，循环调用 `introduce()` 得到不同介绍。
- [ ] 能解释“研究生是一种学生”使用继承，“学生拥有校园卡”使用对象属性。

提示：卡对象可保存在 `self.card` 中。先完成学生和校园卡，再增加研究生；卡只需要作为属性保存，不必让学生继承校园卡。

# 知识点掌握情况清单

只有能离开示例、独立完成并说清原因时才勾选。遇到错题可以取消勾选，再记录下一次复习日期。

## 当前课堂内容

- [ ] 能用自己的话区分类、对象与指向对象的变量。
- [ ] 能指出一次实例方法调用中 self 对应哪个对象。
- [ ] 能解释普通实例方法示例中 `s.introduce()` 与 `Student.introduce(s)` 的关系。
- [ ] 能区分方法参数、局部变量和 `self.name`。
- [ ] 能创建两个对象，分别建立属性，只修改其中一个。
- [ ] 能写带额外参数的实例方法，并区分 print 与 return。
- [ ] 已独立完成练习 1 至 3，并能解释结果。

## 随课堂推进继续勾选

- [ ] 能用 `__init__` 初始化实例属性，并解释默认参数。
- [ ] 知道 `__init__` 负责初始化，不写返回对象的 return。
- [ ] 能为每个实例新建自己的列表，避免意外共享。
- [ ] 能用方法检查数据，说明单下划线和双下划线的含义。
- [ ] 能验证失败的消费或充值不会改变余额。
- [ ] 能定义子类，使用 super 完成所需的初始化。
- [ ] 能区分继承、方法重写与多态。
- [ ] 能解释鸭子类型依赖对象提供所需方法。
- [ ] 已独立完成练习 4 至 7。
- [ ] 已完成综合练习的四项验收。

## 课堂与复习记录

| 日期 | 课堂讲到哪里 | 自己能独立做到什么 | 卡点或错题 | 下一次复习 |
| --- | --- | --- | --- | --- |
| 2026 年 11 月 27 日 | self、实例属性、实例方法 | 完成练习后填写 | 记录最不确定的一点 | 自行填写 |
| 待填写 |  |  |  |  |

每次课堂结束后更新一行：记录老师新增的知识点，做一道对应阶段练习，再勾选实际通过的自测项。建议在学后次日复述概念，一周内换一组对象重写代码；复习时间可以随课表调整。

继续学习时可直接说：“课堂现在讲到___，我完成了练习___，卡在___。请围绕这个例子讲解，先让我预测输出，再给提示，最后补充一道同类题。”
