<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">订单管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            class="input-with-select"
            clearable
            @clear="getOrderList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getOrderList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col>
          <el-table :data="OrderList" style="width: 100%" border>
            <el-table-column type="index" label="#"> </el-table-column>
            <el-table-column label="订单编号" prop="order_number">
            </el-table-column>
            <el-table-column label="订单价格（元）" prop="order_price">
            </el-table-column>
            <el-table-column label="是否付款" prop="pay_status">
              <template slot-scope="scope">
                <el-tag type="danger" v-if="scope.row.pay_status === '0'"
                  >未付款</el-tag
                >
                <el-tag type="success" v-else>已付款</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="是否发货" prop="is_send"> </el-table-column>
            <el-table-column label="创建时间" prop="create_time">
              <template slot-scope="scope">
                {{ scope.row.create_time | dataFoemat }}
              </template>
            </el-table-column>
            <el-table-column label="操作" prop="desc">
              <template slot-scope="scope">
                <span slot="footer" class="dialog-footer">
                  <el-button
                    type="primary"
                    icon="el-icon-edit"
                    size="mini"
                    @click="editOrder(scope.row)"
                  ></el-button>
                  <el-button
                    type="success"
                    icon="el-icon-location"
                    size="mini"
                    @click="showProgress(scope.row)"
                  ></el-button>
                </span>
              </template>
            </el-table-column>
          </el-table>
        </el-col>

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
      </el-row>
    </el-card>

    <!-- 修改界面 -->
    <el-dialog
      title="修改信息"
      :visible.sync="dialogVisible"
      width="50%"
     
    >
      <span>这是一段信息</span>
     
    </el-dialog>
    <!-- 物流界面 -->
    <el-dialog
      title="物流"
      :visible="progressVisible"
      width="50%"
      :before-close="handleCloseProgress"
    >
      <el-timeline :reverse="true">
        <el-timeline-item
          v-for="(activity, index) in progressList"
          :key="index"
          :timestamp="activity.time"
        >
          {{ activity.context }}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 5,
      },
      total: 0,
      OrderList: [],
      progressVisible: false,
      dialogVisible: false,
      progressList:[]
    };
  },
  created() {
    this.getOrderList();
  },
  methods: {
    //获取订单列表
    async getOrderList() {
      const { data: res } = await this.$http.get("orders", {
        params: this.queryInfo,
      });
      if (res.meta.status !== 200) {
        this.$message.error("获取商品列表失败");
      }
      this.OrderList = res.data.goods;
      this.total = res.data.total;
      console.log(res);
    },
    //编辑订单
    editOrder() {},
    // 显示物流界面
    async showProgress(row) {
        console.log(row)
      this.progressVisible = true;
        const{data:res} = await this.$http.get(`/kuaidi/${row.order_id}`)
        this.progressList = res.data
        console.log(res)
    },
    handleSizeChange(newsize) {
      this.queryInfo.pagesize = newsize;
      this.getOrderList();
    },
    handleCurrentChange(newpage) {
      this.queryInfo.pagenum = newpage;
      this.getOrderList();
    },
    //关闭物流界面
    handleCloseProgress() {
        this.progressVisible=false
    },
  },
};
</script>

<style lang="less" scoped>
</style>