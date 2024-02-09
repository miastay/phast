<script>

    let showTextLayers;

    function updateTextLayers() {
        let layers = document.map.getStyle().layers.filter((layer) => layer['source-layer'] === 'place')
        for(let layer of layers) {
            document.map.setLayoutProperty(layer.id, 'visibility', showTextLayers ? 'visible' : 'none');
        }
    }

</script>

<div class="settings-container">
    <label for="showTextLayers">Show Text Layers?</label>
    <input id="showTextLayers" type="checkbox" bind:checked={showTextLayers} on:change={updateTextLayers} value={true}/>
</div>

<style lang="scss">
    .settings-container {
        position: absolute;
        bottom: 20px;
        left: 200px;
    }
</style>