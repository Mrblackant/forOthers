<!-- 留学项目维护-->
<template>
  <div class="lx_container lx_container_change lx_xm_wh">
    <el-tabs type="border-card">
      <el-tab-pane label="留学项目维护">
        <!-- 最上方的表单 -->
        <el-form class="lx_project_wapper" v-model="projectForm" :inline="true" size="mini">
          <el-row class="lx_row_project">
            <!-- 业务单位 -->
            <el-col :span="8">
              <el-form-item label="业务单位">
                <el-select v-model="projectForm.name">
                  <el-option v-for="(item,index) in option" :label="item.name" :value="item.value" :key="item.name"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <!-- 国家 -->
            <el-col :span="6">
              <el-form-item label="国家">
                <el-button>请选择</el-button>
                <span class="lx_span_show_country">
                      美国
                </span>
              </el-form-item>
            </el-col>
            <!-- 布局用，空 -->
            <el-col :span="4">
              <el-form-item label=""></el-form-item>
            </el-col>
            <!-- 新增项目 -->
            <el-col :span="6" align="right">
              <el-button type="primary" size="mini" plain @click="addProject">新增项目</el-button>
            </el-col>
          </el-row>
        </el-form>
        <!-- 最上方的表单 end-->
        <!-- table列表 -->
        <el-table :data="tableData" style="width: 100%" class="lx_table_wapper common_table_set">
          <el-table-column fixed type="index" label="序号" width="100" align="center"></el-table-column>
          <el-table-column label="项目名称" prop="name" width="200">
            <template slot-scope="scope">
              <!-- 判断是否新增 -->
              <el-input v-if="scope.row.type==='new'" v-model="scope.row.name"></el-input>
              <!-- 判断是否可以点击跳转 -->
              <span v-else-if="scope.row.canClick" class="lx_table_can_click" @click="tableCanJump(scope)">{{scope.row.address}}</span>
              <!-- 不可以点击 -->
              <span v-else>{{scope.row.address}}</span>
            </template>
          </el-table-column>
          <el-table-column label="收费清单模板" prop="name">
            <template slot-scope="scope">
              <span class="lx_span_has_margin">{{scope.row.date}}</span>
              <el-button size="mini" class="lx_table_inner_mini_btn" @click="tableInnerConcat(scope)">关联</el-button>
            </template>
          </el-table-column>
          <el-table-column label="标签" prop="name">
            <template slot-scope="scope">
              <!-- 是否新增 -->
              <el-select size="mini" v-if="scope.row.type==='new'" v-model="scope.row.name">
                <el-option v-for="(item,index) in option" :label="item.name" :value="item.value" :key="item.name"></el-option>
              </el-select>
              <!-- 非新增 -->
              <span v-else>
                  {{scope.row.date}}
                </span>
            </template>
          </el-table-column>
          <el-table-column label="状态" prop="name">
            <template slot-scope="scope">
              <!-- 是否新增 -->
              <el-select size="mini" v-if="scope.row.type==='new'" v-model="scope.row.name">
                <el-option v-for="(item,index) in option" :label="item.name" :value="item.value" :key="item.name"></el-option>
              </el-select>
              <!-- 非新增 -->
              <span v-else>
                  {{scope.row.date}}
                </span>
            </template>
          </el-table-column>
          <el-table-column label="操作" prop="name">
            <template slot-scope="scope">
              <template v-if="scope.row.type==='new'">
                <el-button size="mini" type="primary" plain class="lx_table_inner_mini_btn" @click="saveBtn(scope)">保存</el-button>
                <el-button size="mini" class="lx_table_inner_mini_btn" @click="noSave(scope)">取消</el-button>
              </template>
              <template v-else>
                <el-button size="mini" class="lx_table_inner_mini_btn" @click="noUsing(scope)">禁用</el-button>
                <el-button size="mini" class="lx_table_inner_mini_btn" @click="editBtn(scope)">编辑</el-button>
                <el-button size="mini" class="lx_table_inner_mini_btn" @click="deleteBtn(scope)">删除</el-button>
              </template>
            </template>
          </el-table-column>
        </el-table>
        <!-- table列表 end -->
        <!-- 选择关联的模板 弹窗组件 -->
        <concat-template-dialog :show.sync="controlDia"></concat-template-dialog>
        <!-- 选择关联的模板 弹窗组件 end -->
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script type="text/ecmascript-6">
import concatTemplateDialog from './components/concatTemplateDialog.vue' //关联模板弹窗
export default {
  components: {
    concatTemplateDialog
  },
  data() {
    return {
      option: [{
        name: '莉莉安',
        value: 'zzl'
      }],
      controlDia: false, //控制选择关联模板弹窗的值
      projectForm: { //最上方的表单提交
        name: ''
      },
      tableData: [{
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄',
        canClick: true,
        type: 'old'
      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄',
        canClick: false,
        type: 'old'
      }]
    }
  },

  mounted() {

  },
  methods: {
    addProject() { //新增项目
      this.tableData.push({
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄',
        canClick: false,
        type: 'new'
      })
    },
    tableCanJump(data) { //table里的链接跳转
      console.log(data)

    },
    tableInnerConcat(data) { //关联按钮
      console.log(data)
      this.controlDia = true //关联弹窗打开
    },
    noUsing() { //禁用操作按钮

    },
    editBtn() { //编辑 操作按钮

    },
    deleteBtn() { //删除 操作按钮

    },
    saveBtn() { //保存按钮

    },
    noSave() { //取消 按钮

    }
  }
}

</script>
<style lang="scss" rel="stylesheet/scss">
@import "@/styles/feesChange.scss";

.lx_xm_wh {
  @include lx_new_common_font_size;

  .lx_project_wapper {
    // margin-bottom: 15px;
  }

  .lx_span_has_margin {
    margin-right: 5px;
    display: inline-block;
  }

  .lx_table_wapper {}

  .lx_row_project {
    padding: 0 30px;
  }

  .lx_span_show_country {
    margin-left: 10px;
    color: $commonFs_color;
  }

}

</style>
