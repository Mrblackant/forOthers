<!-- 历史资费标准调整-详情页面 -->
<template>
  <div class="lx_container lx_container_change ls_zf_tz_xq">
    <el-tabs type="border-card">
      <el-tab-pane :label="makeTopTiltle">
        <!-- 生效时间回显、主国家 -->
        <el-row class="lx_history_detail_row">
          生效时间 : {{timeWork}}
        </el-row>
        <el-row class="lx_history_detail_row">
          主国家
          <el-select class="lx_history_detail_select" size="mini" v-model="value" placeholder="请选择">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-row>
        <!-- 生效时间回显、主国家 end-->
        <!-- 表格 -->
        <el-table :data="tableData" style="width: 100%" class="lx_table_wapper common_table_set">
          </el-table-column>
          <el-table-column fixed type="index" label="序号" width="100" align="center">
          </el-table-column>
          <el-table-column prop="name" label=" 主国家">
          </el-table-column>
          <el-table-column prop="name" label="辅申国家(非必填)">
          </el-table-column>
          <el-table-column prop="name" label="项目">
          </el-table-column>
          <el-table-column prop="name" label="服务类型">
          </el-table-column>
          <el-table-column prop="name" label="留学类别">
          </el-table-column>
          <el-table-column prop="name" label="一次付清" align="center" class-name="lx_table_has_children">
            <el-table-column prop="name" label="入学费">
            </el-table-column>
            <el-table-column prop="name" label="签证费">
            </el-table-column>
            <el-table-column prop="name" label="合计">
            </el-table-column>
          </el-table-column>
          <el-table-column prop="name" label="不录取扣款">
          </el-table-column>
          <el-table-column prop="name" label="拒签扣款">
          </el-table-column>
          <el-table-column prop="name" width="150" label="送入学申请资料前委托人要求解约扣款">
          </el-table-column>
          <el-table-column prop="name" width="150" label="已送交入学申请材料，尚未得到结果前解约扣款">
          </el-table-column>
          <el-table-column prop="name" label="">
            <template slot="header" slot-scope="scope">
              <span>通讯费</span>
              <span class="lx_set_table_header_red">n代表学校数量</span>
            </template>
          </el-table-column>
        </el-table>
        <!-- 表格 end-->
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script type="text/ecmascript-6">
export default {
  components: {},
  data() {
    return {
      value: '',
      makeTopTiltle: '', //上方tab的名称
      whichCompany: '南京', //哪个公司
      timeWork: '2016-05-02', //生效时间回显
      options: [{
        value: '选项1',
        label: '黄金糕'
      }],
      tableData: [{
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄'
      }]
    }
  },

  mounted() {
    this.makeTitle() //根据传来的公司，生成上方tab的名称
  },
  methods: {
    makeTitle() { //根据传来的公司，生成上方tab的名称
      this.makeTopTiltle = "历史资费标准-" + this.whichCompany
    },
    // newSetHeader(h, { column, $index }) {
    //   return h('span', [
    //     h('span', column.label),
    //     h('span', {
    //       class: 'lx_set_table_header_red',
    //       on: {
    //         click: () => {
    //           console.log(`${column.label}   ${$index}`)
    //         }
    //       }
    //     }, 'n代表学校数量')
    //   ])
    // }
  }
}

</script>
<style lang="scss" rel="stylesheet/scss">
@import "@/styles/feesChange.scss";

.ls_zf_tz_xq {
  @include lx_new_common_font_size;

  .lx_set_table_header_red {
    color: $commonFs_red_color;
    display: block;
  }

  .lx_history_detail_row {
    margin-bottom: 15px;

    .lx_history_detail_select {
      margin-left: 15px;
    }
  }
}

</style>
