name = input("Enter your name: ")
if name == "":
    print("name cannot be empty")
    name = input("Enter your name: ")
else:
    print(f"Welcome {name}")
