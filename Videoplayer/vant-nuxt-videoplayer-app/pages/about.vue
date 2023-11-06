<template>
    <div id="about-page">
        <header>
            <PageHeader :title="pageTitle"></PageHeader>
        </header>
        <div id="about-container">
            <p class="about-content-p">This is an example of how to use Capacitor Video Player plugin</p>
        </div>
    </div>
</template>
<script lang="ts">
export default defineNuxtComponent({
    name: "about",
    alias: "/about",
    setup() {
        const pageTitle = "About Page";
        return {pageTitle}
    }
});
</script>
<style scoped>
#about-page {
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    display: flex;
    position: absolute;
    z-index: 1;   
}
#about-container {
    position: absolute;
    top: 96px;
    left: 0;
    right: 0;
    bottom: 0;
}
.about-content-p {
    padding: 2%;
}
</style>
