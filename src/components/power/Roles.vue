<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">权限管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-button>添加角色</el-button>
      <el-table :data="roleList" style="width: 100%" border>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              :class="['bdbottom', i1 == 0 ? 'bdtop' : '', 'vcenter']"
              v-for="(item1, i1) in scope.row.children"
              :key="item1.id"
            >
              <!-- 渲染一级权限 -->
              <el-col :span="5" :gutter="20">
                <el-tag
                  closable
                  @close="removeRightById(scope.row, item1.id)"
                  >{{ item1.authName }}</el-tag
                >
                <i class="el-icon-caret-right"></i>
              </el-col>

              <!-- 渲染二三级权限 -->
              <el-col :span="19">
                <el-row
                  :class="[i2 == 0 ? '' : 'bdtop', 'vcenter']"
                  v-for="(item2, i2) in item1.children"
                  :key="item2.id"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRightById(scope.row, item2.id)"
                      >{{ item2.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18" class="vcenter">
                    <el-tag
                      type="warning"
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      closable
                      @close="removeRightById(scope.row, item3.id)"
                      >{{ item3.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#"> </el-table-column>
        <el-table-column label="角色名称" prop="roleName"> </el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"> </el-table-column>
        <el-table-column label="操作" prop="desc">
          <template slot-scope="scope">
            <span slot="footer" class="dialog-footer">
              <el-button type="primary" icon="el-icon-edit" size="mini"
                >编辑</el-button
              >
              <el-button type="danger" icon="el-icon-delete" size="mini"
                >删除</el-button
              >
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                @click="showSetRightDialog(scope.row)"
                >分配权限</el-button
              >
            </span>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 分配权限对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="setRightDialogVisible"
      width="50%"
      @close="setRightDialogClosed"
    >
      <el-tree
        :data="rightsList"
        :props="rihgtProps"
        show-checkbox
        node-key="id"
        default-expand-all
        ref="treeRef"
        :default-checked-keys="defaultKey"
      >
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      roleList: [],
      setRightDialogVisible: false,
      rightsList: [],
      rihgtProps: {
        children: "children",
        label: "authName",
      },
      defaultKey: [],
      roleId:''
    };
  },
  created() {
    this.getRoleList();
  },
  methods: {
    async getRoleList() {
      const { data: res } = await this.$http.get("roles");
      if (res.meta.status !== 200) {
        this.$message.error("获取角色列表失败");
      }
      this.roleList = res.data;
      console.log(res);
    },
    // 删除三级标签
    async removeRightById(role, rightId) {
      const confirmResult = await this.$confirm("是否要删除改权限?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).catch((err) => err);

      if (confirmResult !== "confirm") {
        return this.$message.error("取消了删除");
      }

      const { data: res } = await this.$http.delete(
        `roles/${role.id}/rights/${rightId}`
      );
      if (res.meta.status !== 200) {
        this.$message.error("删除权限失败");
      }

      this.$message.success("删除成功");
      role.children = res.data;
    },
    // 分配权限
    async showSetRightDialog(role) {
      console.log(role)
      this.roleId = role.id
      const { data: res } = await this.$http.get("rights/tree");
      if (res.meta.status !== 200) {
        this.$message.error("请求失败");
      }
      this.rightsList = res.data;
      //获取选中的id
      this.getLeafKeys(role, this.defaultKey);
      this.setRightDialogVisible = true;
    },
    // 获取所有三级权限id
    getLeafKeys(node, arr) {
      if (!node.children) {
        return arr.push(String(node.id) );
      }
      node.children.forEach((item) => {
        this.getLeafKeys(item,arr);
      });
    },
    // 关闭分配权限对话框
    setRightDialogClosed(){
      this.defaultKey=[]
    },
    // 确认分配权限
    async allotRights(){
      const keys =[
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      const keyStr = keys.join(',')
      const {data:res}= await this.$http.post(`roles/${this.roleId}/rights`,{
        rids:keyStr
      })
      if(!res.meta.status == 200){
        this.$message.error("分配权限失败")
      }
      this.$message.success("分配权限成功")
      this.getRoleList()
      this.setRightDialogVisible = false
    }
  },
};
</script>
<style lang="less" scoped>
.el-tag {
  margin: 30px 17px 30px 30px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>