<script>

    export let selectedCoordinates;

</script>

<div class={'modal'}>
    <h1>{`${selectedCoordinates.lat}, ${selectedCoordinates.lng}`}</h1>
</div>

<style>
    .modal {
        background: white;
        border-radius: 10px;
        box-shadow: 0px 0px 20px #00000033;
        position: absolute;
        top: 8vh;
        right: 8vh;
        height: 82vh;
        width: 35vw;
        padding: 2rem;
        box-sizing: border-box;
    }
</style>