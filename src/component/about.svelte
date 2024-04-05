<script>
	import Logo from "./logo.svelte";
</script>

<div class="about">
    <h1><Logo /></h1>
    <h3><strong>PH</strong>ylogenetic <strong>A</strong>nalysis at <strong>S</strong>peedy <strong>T</strong>ime</h3>
    <p>
        To start, set the options at the top right to the metric and taxon you want to look at.
    </p>
    <p>
        This is a description of the program for users to be able to read in lieu of specific metrics so that we don't have a big white space when users start the application. This way we can describe useful information and context about the project at the right time, while also making the most of the whitespace on the page. This description should change once we decide exactly what information we want to convey to the user and finalize certain UX flows that are in development.
    </p>
</div>

<style lang="scss">
    .about {
        display: flex;
        flex-direction: column;
        align-items: center;
        align-self: center;
        gap: 2rem;
        padding: 2rem;
        box-sizing: border-box;
        h3 {
            font-weight: 300;
            strong {
                font-weight: 900;
            }
        }
    }
</style>