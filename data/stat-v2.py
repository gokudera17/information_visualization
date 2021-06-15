data = list()

with open("./git-log-tensorflow-stat.csv", "r") as f:
    f.readline()

    while True:
        line = f.readline()

        if line == "":
            break

        name, year, quarter, files, insertions, deletions = line.rstrip("\n").split(",")
        quarters = year + "-" + quarter
        data.append([name, quarters, files, insertions, deletions])

with open("./git-log-tensorflow-stat-v2.csv", "w") as f:
    f.write("Name,Quarter,File_Changed,Insertions,Deletions\n")

    for d in data:
        f.write(",".join(d) + "\n")


