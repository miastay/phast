<script>

    export let selectionData;

</script>

<div class={'modal'}>
    <h1>{`${selectionData.hex}`}</h1>
    <h3>{`${selectionData.latlng.lat}, ${selectionData.latlng.lng}`}</h3>
    <span>{JSON.stringify(selectionData.properties)}</span>
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