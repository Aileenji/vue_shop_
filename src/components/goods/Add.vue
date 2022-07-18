<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">商品管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col>
          <el-alert title="消息提示的文案" type="info" center show-icon>
          </el-alert>
        </el-col>
        <el-col>
          <el-steps
            :active="activeIndex - 0"
            align-center
            finish-status="success"
          >
            <el-step title="基本信息"></el-step>
            <el-step title="商品参数"></el-step>
            <el-step title="商品属性"></el-step>
            <el-step title="商品图片"></el-step>
            <el-step title="商品内容"></el-step>
            <el-step title="完成"></el-step>
          </el-steps>
        </el-col>
        <el-col>
          <el-form
            :model="addForm"
            :rules="addFormRules"
            label-position="top"
            ref="addFormRef"
            label-width="100px"
          >
            <el-tabs
              tab-position="left"
              v-model="activeIndex"
              :before-leave="beforeLeave"
              @tab-click="tabClicked"
            >
              <el-tab-pane label="基本信息" name="0">
                <el-form-item label="商品名称" prop="goods_name">
                  <el-input v-model="addForm.goods_name"></el-input>
                </el-form-item>
                <el-form-item label="商品价格" prop="goods_price">
                  <el-input
                    v-model="addForm.goods_price"
                    type="number"
                  ></el-input>
                </el-form-item>
                <el-form-item label="商品重量" prop="goods_weight">
                  <el-input
                    v-model="addForm.goods_weight"
                    type="number"
                  ></el-input>
                </el-form-item>
                <el-form-item label="商品数量" prop="goods_number">
                  <el-input
                    v-model="addForm.goods_number"
                    type="number"
                  ></el-input>
                </el-form-item>
                <el-form-item label="商品分类" prop="goods_cat">
                  <el-cascader
                    v-model="addForm.goods_cat"
                    :options="cateList"
                    :props="cateprops"
                    expand-trigger="hover"
                    @change="handleChange"
                  ></el-cascader>
                </el-form-item>
              </el-tab-pane>
              <el-tab-pane label="商品参数" name="1">
                <el-form-item
                  :label="item.attr_name"
                  v-for="item in manyTableDate"
                  :key="item.attr_id"
                >
                  <el-checkbox-group v-model="item.attr_vals">
                    <el-checkbox
                      :label="cb"
                      v-for="(cb, i) in item.attr_vals"
                      :key="i"
                      border
                    ></el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
              </el-tab-pane>
              <el-tab-pane label="商品属性" name="2">
                <el-form-item
                  :label="item.attr_name"
                  v-for="item in onlyTableDate"
                  :key="item.attr_id"
                >
                  <el-input v-model="item.attr_vals"></el-input>
                </el-form-item>
              </el-tab-pane>
              <el-tab-pane label="商品图片" name="3">
                <el-upload
                  class="upload-demo"
                  :action="uploadAction"
                  :on-preview="handlePreview"
                  :on-remove="handleRemove"
                  :headers="headersObj"
                  :on-success="handleSuccess"
                  list-type="picture"
                >
                  <el-button size="small" type="primary">点击上传</el-button>
                </el-upload>
              </el-tab-pane>
              <el-tab-pane label="商品内容" name="4">
                <quill-editor v-model="addForm.goods_introduce" />
                <el-button type="primary" class="addBtn" @click="addGoods"
                  >添加商品</el-button
                >
              </el-tab-pane>
            </el-tabs>
          </el-form>
        </el-col>
      </el-row>
    </el-card>
    <!-- 图片预览 -->
    <el-dialog
      title="提示"
      :visible="previewVisible"
      width="30%"
      :before-close="handleClose"
    >
      <img :src="previewPath" alt="" />
    </el-dialog>
  </div>
</template>

<script>
import _ from "lodash";
export default {
  data() {
    return {
      activeIndex: "0",
      addForm: {
        goods_name: "",
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        goods_cat: [],
        pics: [],
        goods_introduce: "",
        attrs: [],
      },
      cateList: [],
      cateprops: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
      },
      selectedCateKeys: [],
      addFormRules: {
        goods_name: [
          { required: true, message: "请输入商品名称", trigger: "blur" },
        ],
        goods_price: [
          { required: true, message: "请输入商品价格", trigger: "blur" },
        ],
        goods_weight: [
          { required: true, message: "请输入商品重量", trigger: "blur" },
        ],
        goods_number: [
          { required: true, message: "请输入商品数量", trigger: "blur" },
        ],
        goods_cat: [
          { required: true, message: "请输入商品分类", trigger: "blur" },
        ],
      },
      manyTableDate: [],
      onlyTableDate: [],
      uploadAction: "https://lianghj.top:8888/api/private/v1/upload",
      headersObj: {
        Authorization: window.sessionStorage.getItem("token"),
      },
      previewPath: "",
      previewVisible: false,
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    //获取分类列表
    async getCateList() {
      const { data: res } = await this.$http.get("categories");
      if (res.meta.status !== 200) {
        this.$message.error("获取商品列表失败");
      }
      this.cateList = res.data;
    },
    //选择分类
    handleChange() {
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = [];
        return;
      }
    },
    // 切换标签页
    beforeLeave(activeName, oldActiveName) {
      console.log(activeName, oldActiveName);
      if (this.addForm.goods_cat.length !== 3) {
        this.$message.error("请先选择商品分类");
        return false;
      }
    },
    // 切换面板
    async tabClicked() {
      if (this.activeIndex == "1") {
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          { params: { sel: "many" } }
        );
        if (res.meta.status !== 200) {
          return this.$message.error("获取失败");
        }
        res.data.forEach((item) => {
          item.attr_vals =
            item.attr_vals.length === 0 ? [] : item.attr_vals.split(" ");
        });
        this.manyTableDate = res.data;
        console.log(res);
      } else if (this.activeIndex == "2") {
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          { params: { sel: "only" } }
        );
        if (res.meta.status !== 200) {
          return this.$message.error("获取失败");
        }

        this.onlyTableDate = res.data;
        console.log(res);
      }
    },
    // 预览图片
    handlePreview(files) {
      this.previewPath = files.response.data.url;
      console.log(this.previewPath);
      this.previewVisible = true;
    },
    // 移除图片
    handleRemove(file) {
      console.log(file);
      const filePath = file.response.data.tmp_path;
      const i = this.addForm.pics.findIndex((x) => x.pic === filePath);

      this.addForm.pics.splice(i, 1);
    },
    // 上传成功后的操作
    handleSuccess(response) {
      console.log(response);
      const picInfo = { pic: response.data.tmp_path };
      this.addForm.pics.push(picInfo);
    },
    handleClose() {},
    // 添加商品
     addGoods() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) {
          return this.$message.error("填写必要的表单");
        }
        const form = _.cloneDeep(this.addForm);
        console.log(this.manyTableDate)
        form.goods_cat = form.goods_cat.join(",");
        this.manyTableDate.forEach((item) => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(' '),
          };
          this.addForm.attrs.push(newInfo);
        });
        this.onlyTableDate.forEach((item) => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(' '),
          };
          this.addForm.attrs.push(newInfo);
        });

        form.attrs = this.addForm.attrs


        const {data:res} = await this.$http.post('goods',form)

        if(res.meta.status !== 201){
            return this.$message.error('添加失败')
        }
        this.$message.success('添加成功')
        this.$router.push('/goods')
      });
    },
  },
  computed: {
    cateId() {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2];
      }
      return null;
    },
  },
};
</script>

<style lang="less" scoped>
.el-steps {
  margin: 15px 0;
}
.el-col {
  margin-bottom: 10px;
}
.el-checkbox {
  margin: 0 10px 0 0 !important;
}
.addBtn {
  margin-top: 10px;
}
</style>