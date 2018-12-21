<!-- 选择关联的模板 的弹窗 -->
<template>
  <div class="xz_gl_mb_dialog">
    <el-dialog title="选择关联的模板" :visible.sync="dialogVisible" width="30%" @close="$emit('update:show',false)">
      <!-- <span>这是一段信息</span> -->
      <!-- 模板表单 -->
      <el-table :data="tableData" style="width: 100%" class="lx_table_wapper common_table_set">
        <el-table-column fixed type="index" label="序号" width="100" align="center"></el-table-column>
        <el-table-column label="项目" prop="date"> </el-table-column>
        <el-table-column label="状态" prop="name">
          <template slot-scope="scope">
            <!-- 已设置 -->
            <template v-if="scope.row.canClick">
              <span class="lx_span_has_margin">已设置</span>
              <el-button size="mini" class="lx_table_inner_mini_btn" @click="confirm(scope)">确定关联</el-button>
            </template>
            <!-- 未设置 -->
            <span v-else>未设置</span>
          </template>
        </el-table-column>
      </el-table>
      <!-- 模板表单 end -->
    </el-dialog>
  </div>
</template>
<script type="text/ecmascript-6">
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  components: {

  },
  data() {
    return {
      dialogVisible: false, //弹窗显示
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
      }],
    }
  },

  mounted() {},
  methods: {
    confirm() { //确认关联

    }
  },
  watch: {
    show() {
      this.dialogVisible = this.show
    }
  }
}

</script>
<style lang="scss" rel="stylesheet/scss">
@import "@/styles/feesChange.scss";

.xz_gl_mb_dialog {

  .lx_span_has_margin {
    margin-right: 5px;

  }
}

</style>
