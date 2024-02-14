<script>
	import { onMount } from 'svelte';
    import * as paper from 'paper';

    export let path;
    export let updatePath;
    export let updateIsDrawing;
    export let isDrawing;

    let drawing;
    let canvas;

    $: drawing = isDrawing;

    onMount(() => {

		paper.setup(canvas);

        let tool = new paper.Tool();
		//var path = new paper.Path();

		tool.onMouseDown = function(event) {
			path = new paper.Path();
			path.strokeColor = 'white';
			path.add(event.point);
		}

		tool.onMouseDrag = function(event) {
            if(!drawing) return;
			path.add(event.point);
		}

        tool.onMouseUp = function(event) {
            if(!drawing) return;
            //path.toShape()
            path.simplify(0.5);
            path.clearHandles();
            path.closed = true;

            let poly = [];
            for(let segment of path.segments) {
                console.log();
                let point = segment.point;
                poly.push({x: point.x, y: point.y})
            }
            updatePath(poly);
            updateIsDrawing(false);
        }

        tool.onKeyDown = function(event) {
            console.log(event)
            if(event.key === "escape") {
                updateIsDrawing(false);
            }
        }

	});


</script>

<div class="draw-wrapper">
    <span>Click and drag to draw a polygon. Press Escape to exit.</span>
    <canvas class="canvas" bind:this={canvas} />
</div>

<style lang="scss">
    .draw-wrapper {
        position: absolute;
        z-index: 100000;
        display: flex;
        width: 100vw;
        flex-direction: column;
        align-items: center;

        > span {
            margin-top: 5vh;
            width: 40%;
            text-align: center;
            font-size: 1.7rem;
            background: white;
            padding: 0.5rem;
            border-radius: 0.25rem;
            z-index: 1;
        }
    }
    .canvas {
        width: 100vw;
        height: 100vh;
        left: 0vw;
        top: 0vh;
        position: absolute;
        background: #33333366;
        filter: none !important;
        //z-index: 100000;
        //backdrop-filter: contrast(0.5);
    }
</style>