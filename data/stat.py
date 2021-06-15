import json

with open("./git-log_tensorflow.csv", "r") as f:
    f.readline()
    authors = dict()

    while True:
        line = f.readline()

        if line == "":
            break

        author, author_date, committer, committer_date, commit, file_changed, insertions, deletions = line.rstrip("\n").split(",")
        
        try:
            year = int(author_date.split()[4])
            month = author_date.split()[1]
            file_changed = int(file_changed)
            insertions = int(insertions)
            deletions = int(deletions)
            """
            print("Author:", author)
            print("Author Year:", year)
            print("Author Month:", month)
            print("File Changed:", file_changed)
            print("Insertions:", insertions)
            print("Deletions:", deletions)
            break
            """
            if author not in authors.keys():
                authors[author] = dict()
            if year not in authors[author].keys():
                authors[author][year] = {
                    "Q1": {"files": 0, "insertions": 0, "deletions": 0},
                    "Q2": {"files": 0, "insertions": 0, "deletions": 0},
                    "Q3": {"files": 0, "insertions": 0, "deletions": 0},
                    "Q4": {"files": 0, "insertions": 0, "deletions": 0},
                }
            if month == "Jan" or month == "Feb" or month == "Mar":
                authors[author][year]["Q1"]["files"] += file_changed
                authors[author][year]["Q1"]["insertions"] += insertions
                authors[author][year]["Q1"]["deletions"] += deletions
            elif month == "Apr" or month == "May" or month == "Jun":
                authors[author][year]["Q2"]["files"] += file_changed
                authors[author][year]["Q2"]["insertions"] += insertions
                authors[author][year]["Q2"]["deletions"] += deletions
            elif month == "Jul" or month == "Aug" or month == "Sep":
                authors[author][year]["Q3"]["files"] += file_changed
                authors[author][year]["Q3"]["insertions"] += insertions
                authors[author][year]["Q3"]["deletions"] += deletions
            elif month == "Oct" or month == "Nov" or month == "Dec":
                authors[author][year]["Q4"]["files"] += file_changed
                authors[author][year]["Q4"]["insertions"] += insertions
                authors[author][year]["Q4"]["deletions"] += deletions
        except:
            continue


with open("./git-log-tensorflow.json", "w") as f:
    json.dump(authors, f)


with open("./git-log-tensorflow-stat.csv", "w") as f:
    f.write("Name,Year,Quarter,File_Changed,Insertions,Deletions\n")

    for name in authors.keys():
        #for year in authors[name].keys():
        for year in [2021, 2020, 2019, 2018]:
            try:
                f.write(name + "," + str(year) + ",Q4," + str(authors[name][year]["Q4"]["files"]) + "," + str(authors[name][year]["Q4"]["insertions"]) + "," + str(authors[name][year]["Q4"]["deletions"]) + "\n")
                f.write(name + "," + str(year) + ",Q3," + str(authors[name][year]["Q3"]["files"]) + "," + str(authors[name][year]["Q3"]["insertions"]) + "," + str(authors[name][year]["Q3"]["deletions"]) + "\n")
                f.write(name + "," + str(year) + ",Q2," + str(authors[name][year]["Q2"]["files"]) + "," + str(authors[name][year]["Q2"]["insertions"]) + "," + str(authors[name][year]["Q2"]["deletions"]) + "\n")
                f.write(name + "," + str(year) + ",Q1," + str(authors[name][year]["Q1"]["files"]) + "," + str(authors[name][year]["Q1"]["insertions"]) + "," + str(authors[name][year]["Q1"]["deletions"]) + "\n")
            except:
                f.write(name + "," + str(year) + ",Q4," + "0,0,0\n");
                f.write(name + "," + str(year) + ",Q3," + "0,0,0\n");
                f.write(name + "," + str(year) + ",Q2," + "0,0,0\n");
                f.write(name + "," + str(year) + ",Q1," + "0,0,0\n");



print(len(authors))
for name in authors.keys():
    print(name, authors[name])
    break
