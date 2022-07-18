<template>
  <div>
    <div>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item><a href="/">商品管理</a></el-breadcrumb-item>
        <el-breadcrumb-item>商品列表</el-breadcrumb-item>
      </el-breadcrumb>
      <el-card>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-input
              placeholder="请输入内容"
              v-model="queryInfo.query"
              class="input-with-select"
              clearable
              @clear="getGoodsList"
            >
              <el-button
                slot="append"
                icon="el-icon-search"
                @click="getGoodsList"
              ></el-button>
            </el-input>
          </el-col>
          <el-col :span="4">
            <el-button type="primary" @click="goAddGoods">添加商品</el-button>
          </el-col>
        </el-row>

        <el-table :data="goodsList" style="width: 100%" border>
          <el-table-column type="index" label="#"> </el-table-column>
          <el-table-column label="商品名称" prop="goods_name">
          </el-table-column>
          <el-table-column label="商品价格（元）" prop="goods_price">
          </el-table-column>
          <el-table-column label="商品重量" prop="goods_weight">
          </el-table-column>
          <el-table-column label="创建时间" prop="add_time">
            <template slot-scope="scope">
              {{ scope.row.add_time | dataFoemat }}
            </template>
          </el-table-column>
          <el-table-column label="操作" prop="desc">
            <template slot-scope="scope">
              <span slot="footer" class="dialog-footer">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="editGoods(scope.row)"
                  >编辑</el-button
                >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="deleteGoods(scope.row)"
                  >删除</el-button
                >
              </span>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页 -->
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum"
          :page-sizes="[5, 10, 15, 20]"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </el-card>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      goodsList: [],
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 5,
      },
      total: 0,
    };
  },
  created() {
    this.getGoodsList();
  },
  methods: {
    async getGoodsList() {
      const { data: res } = await this.$http.get("goods", {
        params: this.queryInfo,
      });
      if (res.meta.status !== 200) {
        this.$message.error("获取商品列表失败");
      }
      this.goodsList = res.data.goods;
      this.total = res.data.total;
      console.log(res);
    },
    // 修改商品
    editGoods(row) {},
    // 删除商品
    async deleteGoods(row) {
        console.log(row)
      const confirmResult=await this.$confirm("此操作将永久删除该商品, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).catch(err=>err)
      if(confirmResult !=='confirm'){
        return this.$message.error("取消了删除");
      }
      const { data: res } = await this.$http.delete(`goods/${row.goods_id}`);
      if (res.meta.status !== 200) {
        return this.$message.error("删除商品失败");
      }
      this.getGoodsList();
    },
    handleSizeChange(newsize) {
      this.queryInfo.pagesize = newsize;
      this.getGoodsList();
    },
    handleCurrentChange(newpage) {
      this.queryInfo.pagenum = newpage;
      this.getGoodsList();
    },
    //添加商品
    goAddGoods(){
        this.$router.push('/goods/add')
    }
  },
};
</script>

<style lang="less" scoped>
</style>