<template>
	<div class="side-menu">
		<el-menu theme="dark" :default-active="$route.path" class="el-menu-vertical-demo" :router="true" :collapse="isCollapse">
			<nav-item
					v-for="item in tree"
					:item="item"
					:key="item.id">
			</nav-item>
		</el-menu>
	</div>
</template>

<script>
    import ajax from 'common/ajax.js'
    import ajaxUrls from 'common/ajaxUrls.js'
    import resStatus from 'common/resStatus.js'
    import navItem from './navItem.vue'
	export default{
		data(){
			return{
				tree: []
			}
		},
		created(){
		    this.getTree();
		},
		methods: {
		    getTree(){
                this.tree = this.$menuTreeData;
			}
		},
		props:{
            isCollapse: {
                type: Boolean
			}
		},
		components:{
            navItem
		}
	}
</script>

<style lang="scss">
</style>