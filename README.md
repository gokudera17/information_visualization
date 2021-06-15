# information_visualization
2021 Spring, Infoirmation Visualization <br>
National Chengchi University


## Dataset

### Git Log
The command `git log` is to show the commit logs.

<br>

List commits that are reachable by following the `parent` links from the given commit(s), 
but exclude commits that are reachable from the one(s) given with a `^` in front of them. 
The output is given in reverse chronological order by default.

<br>

Follow the command below, you can get the commit logs of our experiment repo `tensorflow`,
and store the data to `data/git-log_tensorflow.txt`:

```bash
git clone https://github.com/tensorflow/tensorflow.git
cd tensorflow
git log --pretty=format:"%an,%ad,%cn,%cd,%s" --stat > ../data/git-log_tensorflow.txt
cd ../ && rm -rf tensorflow/
```

After getting the raw git-log data, we use `data/parse.py` to transform the format to `csv` file.

```bash
cd data/
python3 parse.py
cd ../
```

Then, we can use `data/stat.py` and `data/stat-v2` to get the files `data/git-log-tensorflow.json`, 
`data/git-log-tensorflow-stat.csv`, and `data/git-log-tensorflow-stat-v2.csv`

```bash
cd data/
python3 stat.py
python3 stat-v2.py
cd ../
```

After that, you can get the dataset with foemats that we need.



## https://github.com/d3/d3-scale-chromatic

* d3.interpolateYlGnBu(t) <>
* d3.schemeYlGnBu[k]
