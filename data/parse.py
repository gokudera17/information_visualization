with open("./git-log_tensorflow.txt", "r") as f:
    lines = f.readlines()

title = False
info = False
file_modify = False

f = open("./git-log_tensorflow.csv", "w")

for line in lines:
    if title == False:
        f.write("Author_Name,Author_Date,Committer_Name,Committer_Date,Commit,File_changed,Insertions,Deletions\n")
        title = True

    elif info == False:
        x = line.rstrip("\n").split(",")
        n1 = x[0]
        d1 = x[1]
        n2 = x[2]
        d2 = x[3]
        c = x[4:]
        c = " ".join(c).replace("\t", " ").replace(";", " ")
        output = n1 + "," + d1 + "," + n2 + "," + d2 + "," + c
        info = True

    elif file_modify == False:
        if line[0] != " ":
            x = line.rstrip("\n").split(",")
            n1 = x[0]
            d1 = x[1]
            n2 = x[2]
            d2 = x[3]
            c = x[4:]
            c = " ".join(c)
            output = n1 + "," + d1 + "," + n2 + "," + d2 + "," + c
            info = True

        elif line.rstrip("\n")[-1] == ")":
            strings = line.rstrip("\n").split(",")
            changed = 0
            insertion = 0
            deletion = 0

            for string in strings:
                s = string.lstrip(" ").rstrip(" ").split(" ")

                if len(s) == 3:
                    changed = int(s[0])
                else:
                    if s[1] == "insertions(+)":
                        insertion = int(s[0])
                    
                    if s[1] == "deletions(-)":
                        deletion = int(s[0])
            
            output += ","
            output += str(changed)
            output += ","
            output += str(insertion)
            output += ","
            output += str(deletion)
            f.write(output + "\n")
            file_modify = True

    else:
        info = False
        file_modify = False

f.close()


