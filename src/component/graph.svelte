<script>

    import * as d3 from 'd3';
  
    export let data;
    export let point;
    export let width = 640;
    export let height = 400;
    export let marginTop = 20;
    export let marginRight = 20;
    export let marginBottom = 30;
    export let marginLeft = 40;
  
    let gx;
    let gy;


    let interval = [
        {x: 0, y: 0, ci_minus: 0.4, ci_plus: 0.6},
        {x: 0.5, y: 0.2, ci_minus: 0.4, ci_plus: 0.6},
        {x: 1, y: 0.3, ci_minus: 0.6, ci_plus: 0.7},
        {x: 2, y: 0.55, ci_minus: 0.65, ci_plus: 0.7},
        {x: 3, y: 0.65, ci_minus: 0.6, ci_plus: 0.75},
    ]

  
    $: x = d3.scaleLinear([0, data.length - 1], [marginLeft, width - marginRight]);
    $: y = d3.scaleLinear(d3.extent([0,1]), [height - marginBottom, marginTop]);
    $: line = d3.line((d, i) => x(i), y);
    $: d3.select(gy).call(d3.axisLeft(y));
    $: d3.select(gx).call(d3.axisBottom(x));

    $: d3.select("svg").append("div")
        .classed("svg-container", true) //container class to make it responsive
        .append("svg")
        //responsive SVG needs these 2 attributes and no width and height attr
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("viewBox", `0 0 ${width} ${height}`)
        //class to make it responsive
        .classed("svg-content-responsive", true); 

    d3.csv("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/data_IC.csv",function(data) {
        console.log(data)
        d3.select("#viz").append("path")
        .datum(data)
        .attr("fill", "#cce5df")
        .attr("stroke", "none")
        .attr("d", d3.area()
            .x(function(d) { return x(d.x) })   
            .y0(function(d) { return y(d.CI_right) })
            .y1(function(d) { return y(d.CI_left) })
        )
    })

    const area = d3.area().x((d) => x(d.x)).y0((d) => y(d.ci_minus)).y1((d) => y(d.ci_plus))
    const li = d3.line((d) => x(d.x), (d) => y(d.y));

</script>

<div class='graph-container'>
    <svg id="viz" viewBox={`0 0 ${width} ${height}`}>
        <g class="scale x" bind:this={gx} transform="translate(0,{height - marginBottom})" />
        <g class="scale y" bind:this={gy} transform="translate({marginLeft},0)" />

        <!-- <path class="line" fill="none" stroke="currentColor" stroke-width="1.5" d={line(data)} /> -->
        <g class="point" fill="white" stroke="currentColor" stroke-width="1.5">
            {#each point as p, i}
                <circle key={i} cx={x(p[0])} cy={y(p[1])} r="5" fill="white" />
            {/each}
        </g>

        <path class="area" fill="#00ffaacc" stroke="currentColor" stroke-width="0" d={area(interval)} />
        <path class="line" fill="none" stroke="currentColor" stroke-width="1.5" d={li(interval)} />

    </svg>
</div>

<style lang="scss">
    .graph-container {
        display: inline-block;
        position: relative;
        width: 100%;
        vertical-align: top;
        overflow: hidden;
        > svg {
            g.scale {
                font-size: 1rem;
            }
            g.point circle {
                fill: red;
                stroke: none;
            }
            g.path.point-line {
                stroke: green;
                stroke-width: 2;
            }
        }
    }
</style>