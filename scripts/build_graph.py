import re
import json

nodes = {}
links = []
with open("../data/git-log_tensorflow.txt") as fin:
    fin.readline()
    index = 0
    for line in fin:
        if line == "\n" or "Merge" in line:
            continue
        author, *others = line.split(",")
        if author not in nodes:
            nodes.update(
                {
                    author: {
                        "id": len(nodes),
                        "type": "author",
                    }
                }
            )
        modules = []
        line = fin.readline()
        while "|" in line:
            module, mutation = line.split("|")
            module = module.strip()
            if module not in nodes:
                nodes.update({module: {"id": len(nodes), "type": "file"}})
            weight = mutation.strip()
            m = re.search(r"(?P<weight>\d+).*", weight)
            if m is None:
                line = fin.readline()
                continue
            modules.append((module, m.group("weight")))
            links.append(
                {
                    "source": nodes[author]["id"],
                    "target": nodes[module]["id"],
                    "weight": int(m.group("weight")),
                }
            )
            line = fin.readline()
        index += 1
        if index == 40:
            break

graph = {
    "nodes": [
        {"name": name, "id": attributes["id"], "type": attributes["type"]}
        for name, attributes in nodes.items()
    ],
    "links": links,
}
with open("../data/network.json", "wt") as fout:
    json.dump(graph, fout, indent=2)
