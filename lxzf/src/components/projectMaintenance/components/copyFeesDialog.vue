<!-- 复制费用清单 的弹窗 -->
<template>
  <div class="fz_fy_qd_dialog">
    <el-dialog title="复制费用清单" :visible.sync="dialogVisible" width="50%" @close="$emit('update:show',false)">
      <!-- 查询条件 -->
      <el-form v-model="formSub" :inline="true">
        <el-row class="lx_list_submit_by">
          <el-col :span="12">
            <el-form-item label="公司">
              <el-select v-model="formSub.name" size="mini">
                <el-option v-for="(item,index) in option" :label="item.name" :value="item.value" :key="item.name"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="9">
            <el-form-item label="国家">
              <el-button size="mini" @click="choseCountry">请选择</el-button>
            </el-form-item>
          </el-col>
          <el-col :span="3" align="right">
            <el-button type="primary" @click="seeResult" size="mini">查询</el-button>
          </el-col>
        </el-row>
      </el-form>
      <!-- 查询条件 end -->
      <!-- 多选框结果展示 -->
      <div class="result_for_show">
        <el-checkbox-group v-model="whichPlan" size="mini">
          <el-checkbox v-for="(item,index) in option" :key="item.name" :label="item.name" :value="item.value" border>{{item.name}}</el-checkbox>
        </el-checkbox-group>
      </div>
      <!-- 多选框结果展示 end -->
      <!-- 底部的按钮 -->
      <span slot="footer" >
        <div class="lx_dia_fotter">
        <el-radio v-model="checkdAll" class="lx_fotter_btn" size="mini" @change="checkAll" border label="all">所有</el-radio>
        <el-button size="mini" type="primary" plain @click="confomCopy">确认复制</el-button>
        </div>
      </span>
      <!-- 底部的按钮  end-->
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
      option: [{
        name: '楷博预科',
        value: 'zzl'
      }, {
        name: '蒙东那大学',
        value: 'zzl'
      }, {
        name: '英才菁英计划',
        value: 'zzl'
      }],
      formSub: { //表单
        name: ''
      },
      checkdAll: '', //全选框
      whichPlan: [], //复制清单选择的计划
      dialogVisible: true, //弹窗显示
    }
  },

  mounted() {},
  methods: {
    seeResult() { //查询

    },
    choseCountry() { //请选择国家

    },
    checkAll() { //所有多选框的change
      console.log(this.checkdAll)
    },
    confomCopy() { //确认复制按钮

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

.fz_fy_qd_dialog {
  .lx_list_submit_by {}

  .lx_dia_fotter {
    text-align: center;

    .lx_fotter_btn {
      margin-right: 10px;
    }
  }

  .result_for_show {
    padding: 0 40px;
  }

  .lx_span_has_margin {
    margin-right: 5px;

  }
}

</style>
