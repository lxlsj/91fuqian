<template>
	<div id="appRoot">
		<sidebar>
			<router-view></router-view>
		</sidebar>
	</div>
</template>

<script>
    import sidebar from 'components/layout/sidebar.vue'
	export default{
		data(){
		    return {}
		},
        components:{
            sidebar
		}
	}
</script>

<style lang="scss">
</style>