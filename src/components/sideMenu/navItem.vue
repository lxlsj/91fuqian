<template>
	<el-submenu v-if="item.childrens && item.childrens.length" :index="String(item.id)">
		<!-- 创建父级菜单 -->
		<template slot="title">
			<i v-if="item.menuIcon" :class="'el-icon-'+item.menuIcon"></i>
			<span slot="title">{{ item.menuName }}</span>
		</template>
		<!-- 创建子菜单 -->
		<nav-item
				v-for="subItem in item.childrens"
				:key="subItem.id"
				:item="subItem" >
		</nav-item>
	</el-submenu>
	<el-menu-item v-else :index="item.menuUrl">
		<i v-if="item.menuIcon" :class="'el-icon-'+item.menuIcon"></i>
		<span slot="title">{{ item.menuName }}</span>
	</el-menu-item>
</template>

<script>
	export default{
        name: 'navItem',
        props: ['item'],
		data(){
            return {}
		}
	}
</script>

<style lang="scss">
</style>