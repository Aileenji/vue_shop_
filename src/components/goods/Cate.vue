<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">商品管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 搜索区 -->
      <el-row>
        <el-button type="primary" @click="showAddCateDialog"
          >添加分类</el-button
        >
      </el-row>
      <el-row>
        <!-- 用户列表区 -->

        <tree-table
          :data="CateList"
          :columns="columns"
          :selection-type="false"
          :expand-type="false"
          :show-index="true"
          border
          :show-row-hover="false"
        >
          <!-- 是否有效 -->
          <template slot="isok" slot-scope="scope">
            <i
              class="el-icon-success"
              v-if="scope.row.cat_deleted === false"
              style="color: lightgreen"
            ></i>
            <i class="el-icon-error" v-else style="color: red"></i>
          </template>
          <!-- 排序 -->
          <template slot="order" slot-scope="scope">
            <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
            <el-tag
              type="success"
              size="mini"
              v-else-if="scope.row.cat_level === 1"
              >二级</el-tag
            >
            <el-tag type="warning" size="mini" v-else>三级</el-tag>
          </template>
          <!-- 操作 -->
          <template slot="opt" slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini">
              编辑
            </el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini">
              删除
            </el-button>
          </template>
        </tree-table>
        <!-- 分页 -->
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum"
          :page-sizes="[1, 2, 3, 5]"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </el-row>
    </el-card>

    <!-- 添加分类页面 -->
    <el-dialog
      title="添加用户"
      :visible="dialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <el-form
        :model="addCate"
        :rules="rules"
        ref="addCateRef"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCate.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <el-cascader
            v-model="selectedKeys"
            expand-trigger="hover"
            :options="parentList"
            :props="cascaderProps"
            clearable
            change-on-select
            @change="handleChange"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCateConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      CateList: [],
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5,
      },
      total: 0,
      columns: [
        {
          label: "分类名称",
          prop: "cat_name",
        },
        {
          label: "是否有效",
          type: "template",
          template: "isok",
        },
        {
          label: "排序",
          type: "template",
          template: "order",
        },
        {
          label: "操作",
          type: "template",
          template: "opt",
        },
      ],
      addCate: {
        cat_name: "",
        cat_pid: 0,
        //分类等级
        cat_level: 0,
      },
      dialogVisible: false,
      rules: {
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
        ],
      },
      parentList: [],
      cascaderProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
      },
      selectedKeys: [],
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get("categories", {
        params: this.queryInfo,
      });

      if (res.meta.status !== 200) {
        return this.$message.error("获取列表失败");
      }
      this.CateList = res.data.result;
      this.total = res.data.total;
      //   console.log(res);
    },
    handleSizeChange(newsize) {
      this.queryInfo.pagesize = newsize;
      this.getCateList();
    },
    handleCurrentChange(newpage) {
      this.queryInfo.pagenum = newpage;
      this.getCateList();
    },
    //点击添加分类按钮
    showAddCateDialog() {
      this.getParentCateList();
      this.dialogVisible = true;
    },
    // 添加分类确认按钮
    addCateConfirm() {
      this.$refs.addCateRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.post("categories", this.addCate);
        if (res.meta.status !== 201) {
          return this.$message.error("添加数据失败");
        }

        this.$message.success("添加成功");
        this.getCateList()
        this.dialogVisible = false;
       
      });
    },
    //关闭添加分类界面
    addDialogClosed() {
      this.$refs.addCateRef.resetFields();
      this.selectedKeys = [];
      this.addCate.cat_pid = 0;
      this.addCate.cat_level = 0;
    },
    //获取父级分类数据列表
    async getParentCateList() {
      const { data: res } = await this.$http.get("categories", {
        params: { type: 2 },
      });
      if (res.meta.status !== 200) {
        return this.$message.error("获取数据失败");
      }

      this.parentList = res.data;
    },
    //选择项发生变化出发
    handleChange() {
      if (this.selectedKeys.length > 0) {
        this.addCate.cat_pid = this.selectedKeys[this.selectedKeys.length - 1];
        this.addCate.cat_level = this.selectedKeys.length;
        return;
      } else {
        this.addCate.cat_pid = 0;
        this.addCate.cat_level = 0;
      }
    },
  },
};
</script>

<style lang="less" scoped>
.zk-table {
  margin-top: 15px;
}
.el-cascader {
  width: 100%;
}
</style>