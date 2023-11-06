<template>
    <div class="page-header">
        <NuxtLink to="/" class="page-header-link">
            Back
        </NuxtLink>
    <h2>{{ title }}</h2>
    </div>
</template>
<script lang="ts">
export default defineNuxtComponent({
    name: 'PageHeader',
    props: ['title'],
    setup(props) {
        const title = props.title;
        return {title}
    }
})
</script>
<style scoped>
.page-header {
    position:absolute;
    width: 100%;
    top: 40px;
    display:flex;
    flex-direction: row;
    z-index: 1;
}
.page-header-link {
    padding-left: 1%;
    padding-right: 1%;
    margin-top: 28px;
}
.page-header h2 {
    padding-left: 4%;
    padding-right: 1%;
}
</style>
