/* Radar chart design created by Nadieh Bremer - VisualCinnamon.com */


/* Set-Up */


var margin = { top: 100, right: 100, bottom: 100, left: 100 },
    width = Math.min(700, window.innerWidth - 10) - margin.left - margin.right,
    height = Math.min(width, window.innerHeight - margin.top - margin.bottom - 20);


/* Data */

/* EX : 
var data = [
          [ // 1
            {axis:"A",value:0.22},
            {axis:"B",value:0.50}
          ],[ // 2
            {axis:"A",value:0.27},
            {axis:"B",value:0.50}
          ],[// 3
            {axis:"A",value:0.26},
            {axis:"B",value:0.50}
          ]
        ];
*/

var data = [
    [ //Top1
        { axis: "File Changed Score", value: 11 }, //0.10
        { axis: "Insertions Score", value: 11 },
        { axis: "Deletions Score", value: 11 },
        { axis: "Issues Score", value: 10 }
    ],
    [ //Top2
        { axis: "File Changed Score", value: 8 }, //0.10
        { axis: "Insertions Score", value: 1 },
        { axis: "Deletions Score", value: 10 },
        { axis: "Issues Score", value: 1 }
    ],
    [ //Top 3
        { axis: "File Changed Score", value: 9 }, //0.10
        { axis: "Insertions Score", value: 8 },
        { axis: "Deletions Score", value: 1 },
        { axis: "Issues Score", value: 1 }
    ]
];

/* Draw the Chart */

var color = d3.scale.ordinal()
    .range(["#FF60AF", "#F9F900", "#7373B9"]);

//var color = d3.scale.ordinal()
//    .range([d3.interpolateYlGnBu(0), d3.interpolateYlGnBu(0.25), d3.interpolateYlGnBu(0.5), d3.interpolateYlGnBu(0.75), d3.interpolateYlGnBu(1)]);

var radarChartOptions = {
    w: width,
    h: height,
    margin: margin,
    maxValue: 11,
    /* 控制範圍 */
    levels: 11,
    roundStrokes: true,
    color: color
};

/*Call function to draw the Radar chart */
RadarChart(".radarChart", data, radarChartOptions);