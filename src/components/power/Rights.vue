<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">权限管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-table :data="rightsList" style="width: 100%" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column
          prop="authName"
          label="权限名称"
          width="180"
        ></el-table-column>
        <el-table-column prop="path" label="路径" width="180">
          <template slot-scope="scope">
            <el-tag type="success">{{ scope.row.path }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="level" label="权限等级">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level == 0">一级</el-tag>
            <el-tag type="success" v-else-if="scope.row.level == 1"
              >二级</el-tag
            >
            <el-tag type="warning" v-else>三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <!-- <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination> -->
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rightsList: [],
      total:0,
      pagenum:1,
      pagesize:10
    };
  },
  created() {
    this.getRightList();
  },
  methods: {
    async getRightList() {
      const { data: res } = await this.$http.get("rights/list");
      if (res.meta.status !== 200) {
        this.$message.error("获取权限列表失败");
      }
      this.rightsList = res.data;
      this.total = res.data.length
        console.log(res);
    },
    handleSizeChange(newsize){

    },
    handleCurrentChange(newpage){

    }
  },
};
</script>

<style lang="less" scoped>
</style>