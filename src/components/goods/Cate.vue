<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">商品管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 搜索区 -->

      <el-button type="primary">添加分类</el-button>

      <!-- 用户列表区 -->

      <el-table :data="CateList" style="width: 100%" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column
          prop="username"
          label="分类名称"
          width="180"
        ></el-table-column>
        <el-table-column
          prop="email"
          label="是否有效"
          width="180"
        ></el-table-column>
        <el-table-column prop="mobile" label="排序"> </el-table-column>

        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-tooltip
              class="item"
              effect="dark"
              content="修改"
              placement="top-start"
              :enterable="false"
            >
              <el-button
                type="primary"
                icon="el-icon-edit"
                circle
                size="mini"
                
              ></el-button>
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              content="删除"
              placement="top-start"
              :enterable="false"
            >
              <!-- 删除确认框 -->
              <el-popconfirm
                icon="el-icon-info"
                icon-color="red"
                title="确定删除该用户吗？"
                @confirm="deleteUser(scope.row.id)"
              >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  circle
                  size="mini"
                  slot="reference"
                ></el-button>
              </el-popconfirm>
            </el-tooltip>
            
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <!-- <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum"
          :page-sizes="[1, 2, 3, 5]"
          :page-size="queryInfo.pagesize"
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
      CateList: [],
    };
  },
};
</script>

<style lang="less" scoped>
</style>