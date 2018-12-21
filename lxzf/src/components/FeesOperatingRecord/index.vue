<!-- 资费调整操作记录table组件 -->
<template>
  <div class="lx_fees_table_op">
    <el-table :data="tableData" style="width: 100%" class="lx_table_wapper common_table_set">
      <el-table-column type="index" label="序号" width="100" align="center">
      </el-table-column>
      <el-table-column label="操作类型" prop="date">
      </el-table-column>
      <el-table-column label="操作人" prop="date">
      </el-table-column>
      <el-table-column label="操作时间" prop="date">
      </el-table-column>
    </el-table>
  </div>
</template>
<script type="text/ecmascript-6">
export default {
  props: {

  },
  data() {
    return {
      tableData: [{
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄'
      }],
    }
  },
  methods: {},
  mounted() {

  }
}

</script>
<style lang="scss" rel="stylesheet/scss" scoped>
</style>
