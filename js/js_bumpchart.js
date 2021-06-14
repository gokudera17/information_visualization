
function bumpchart() {
    // bumpRadius = 13
    bumpRadius = 13;

    // padding = 25
    padding = 25;

    // margin = Object {left: 105, right: 105, top: 20, bottom: 50}
    margin = ({left: 150, right: 150, top: 20, bottom: 50});

    data = [];
    d3.csv("../data/git-log-tensorflow-stat-v2.csv", function(row){
        data.push({
            "Name": row.Name,
            "Quarter": row.Quarter,
            "File_Changed": +row.File_Changed,
            "Insertions": +row.Insertions,
            "Deletions": +row.Deletions
        });
    }).then(function() {
        data = data.slice(0,112);
        // console.log(data)
        // Names = Array[9]
        Names = Array.from(new Set(data.flatMap(d => [d.Name])));

        // Quarters = Array[14]
        Quarters = Array.from(new Set(data.flatMap(d => [d.Quarter])));
        Quarters = Quarters.reverse();

        // chartDate = Array[9]
        ChartData = () => {
            const ti = new Map(Names.map((Name, i) => [Name, i]));
            const qi = new Map(Quarters.map((Quarter, i) => [Quarter, i]));
            const matrix = Array.from(ti, () => new Array(Quarters.length).fill(null));

            for (const {Name, Quarter, File_Changed} of data)
                matrix[ti.get(Name)][qi.get(Quarter)] = {rank: 0, File_Changed: +File_Changed, next: null};

            matrix.forEach((d) => {
                for (let i = 0 ; i < d.length - 1 ; i++)
                    if(d[i]){
                        d[i].next = d[i + 1];
                    }
                });

            Quarters.forEach((d, i) => {
                const array = [];
                matrix.forEach((d) => array.push(d[i]));
                array.sort((a, b) => {
                    try{
                        return b.File_Changed - a.File_Changed;
                    }
                    catch{
                        return 0;
                    }
                });
                array.forEach((d, j) => {
                    if(d){
                        d.rank = j
                    }
                });
            });

            return matrix;
        }
        chartData = ChartData();

        // ranking = Array[9]
        Ranking = () => {
            const len = Quarters.length - 1;
            const ranking = chartData.map((d, i) => {
                if (d[0] && d[len]) {
                    return ({Name: Names[i], first: d[0].rank, last: d[len].rank});
                }
                else if (d[0]) {
                    return ({Name: Names[i], first: d[0].rank, last: 0});
                }
                else{
                    return ({Name: Names[i], first: 0, last: 0});
                }
            });
            return ranking;
        };
        ranking = Ranking();

        // drawAxis = f(g, x, y, axis, domain)
        drawAxis = (g, x, y, axis, domain) => {
            g.attr("transform", `translate(${x}, ${y})`)
                .call(axis)
                .selectAll(".tick text")
                .attr("font-size", "12px");

            if (!domain)
                g.select(".domain")
                    .remove();
        }

        // title = f(g)
        title = g => g.append("title")
            .text((d, i) => `${d.Name} - ${Quarters[i]}\nRank: ${d.File_Changed.rank + 1}\nFile_Changed: ${d.File_Changed.File_Changed}`);

        // seq = f(start, length)
        seq = (start, length) => Array.apply(null, {length: length}).map((d, i) => i + start);

        // left = Array[9]
        left = ranking.sort((a, b) => a.first - b.first).map((d) => d.Name);

        // right = Array[9]
        right = ranking.sort((a, b) => a.last - b.last).map((d) => d.Name);

        // width = 1120
        width = Quarters.length * 80;

        // height = 540
        height = Names.length * 60;

        // bx = f(i)
        bx = d3.scalePoint()
            .domain(seq(0, Quarters.length))
            .range([0, width - margin.left - margin.right - padding * 2]);

        // by = f(i)
        by = d3.scalePoint()
            .domain(seq(0, ranking.length))
            .range([margin.top, height - margin.bottom - padding]);

        // ax = f(i)
        ax = d3.scalePoint()
            .domain(Quarters)
            .range([margin.left + padding, width - margin.right - padding]);

        // y = f(i)
        y = d3.scalePoint()
            .range([margin.top, height - margin.bottom - padding]);

        // color = f(i)
        color = d3.scaleOrdinal(d3.schemeTableau10)
            .domain(seq(0, ranking.length));

        const svg = d3.select("div#bump-chart")
            .append("svg")
            .attr("cursor", "default")
            .attr("viewBox", [0, 0, width, height]);

        svg.append("g")
            .attr("transform", `translate(${margin.left + padding}, 0)`)
            .selectAll("path")
            .data(seq(0, Quarters.length))
            .join("path")
            .attr("stroke", "#ccc")
            .attr("stroke-width", 2)
            .attr("stroke-dasharray", "5,5")
            .attr("d", d => d3.line()([[bx(d), 0], [bx(d), height - margin.bottom]]));

        const series = svg.selectAll(".series")
            .data(chartData)
            .join("g")
            .attr("class", "series")
            .attr("opacity", 1)
            .attr("fill", d => {
                if (d[0]) {
                    return color(d[0].rank);
                }
            })
            .attr("stroke", d => {
                if (d[0]) {
                    return color(d[0].rank);
                }
            })
            .attr("transform", `translate(${margin.left + padding}, 0)`)
            .on("mouseover", highlight)
            .on("mouseout", restore);

        series.selectAll("path")
            .data(d => d)
            .join("path")
            .attr("d", (d, i) => {
                if ((d) && (d.next))
                    return d3.line()([[bx(i), by(d.rank)], [bx(i + 1), by(d.next.rank)]]);
            });

        const bumps = series.selectAll("g")
            .data((d, i) => d.map(v => {
                if (d[0]) {
                    return ({Name: Names[i], File_Changed: v, first: d[0].rank});
                }
                return ({Name: Names[i], File_Changed: v, first: 0});
            }))
            .join("g")
            .attr("transform", (d, i) => {
                if (d.File_Changed) {
                    return `translate(${bx(i)}, ${by(d.File_Changed.rank)})`
                }
            })
            .call(title);

        bumps.append("circle")
            .attr("r", bumpRadius);

        bumps.append("text")
            .attr("dy", "0.35em")
            .attr("fill", "white")
            .attr("stroke", "none")
            .attr("text-anchor", "middle")
            .style("font-weight", "bold")
            .style("font-size", "14px")
            .text(d => d.File_Changed.rank + 1);

        svg.append("g")
            .call(g => drawAxis(g, 0, height - margin.top - margin.bottom + padding, d3.axisBottom(ax), true));

        const leftY = svg.append("g")
            .call(g => drawAxis(g, margin.left, 0, d3.axisLeft(y.domain(left))));

        const rightY = svg.append("g")
            .call(g => drawAxis(g, width - margin.right, 0, d3.axisRight(y.domain(right))));

        return svg.node();


        function highlight(e, d) {
            this.parentNode.appendChild(this);
            series.filter(s => s !== d)
                .transition().duration(500)
                .attr("fill", "#odd")
                .attr("stroke", "#odd");
            markTick(leftY, 0);
            markTick(rightY, Quarters.length - 1);

            function markTick(axis, pos) {
                axis.selectAll(".tick text")
                    .filter((s, i) => {
                        if (d[pos]) {
                            return i === d[pos].rank;
                        }
                    })
                    .transition().duration(500)
                    .attr("font-weight", "bold")
                    .attr("fill", () => {
                        if (d[0]) {
                            return color(d[0].rank);
                        }
                    });
            }
        }

        function restore() {
            series.transition().duration(500)
                .attr("fill", s => {
                    if (s[0]) {
                        return color(s[0].rank);
                    }
                })
                .attr("stroke", s => {
                    if (s[0]) {
                        return color(s[0].rank)
                    }
                });
            restoreTicks(leftY);
            restoreTicks(rightY);

            function restoreTicks(axis) {
                axis.selectAll(".tick text")
                    .transition().duration(500)
                    .attr("font-weight", "normal")
                    .attr("fill", "black");
            }
        }
    });
}

// d3 = Object
//d3 = require("d3@6")


bumpchart()

