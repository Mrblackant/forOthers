<!-- 资费标准调整申请 页面-->
<template>
  <div class="lx_container lx_container_change zf_bz_tz">
    <el-tabs type="border-card">
      <el-tab-pane :label="ifHistory ? '历史资费标准' : '资费标准调整申请'">
        <!--查询表单 -->
        <el-form ref="feeForm" :model="feeModelFrom" :inline="true" size="mini" class="lx_new_set_form" label-width="96px">
          <!-- <el-row :gutter="20"> -->
          <!-- <el-col :span="6"> -->
          <el-form-item label="业务单位">
            <el-select v-model="feeModelFrom.companyName" placeholder="请选择">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <!-- </el-col> -->
          <!-- 项目名称 -->
          <!-- <el-col :span="6"> -->
          <el-form-item label="项目名称">
            <el-input v-model="feeModelFrom.companyName" placeholder="请输入"></el-input>
          </el-form-item>
          </el-col>
          <!-- 申请状态 -->
          <!-- <el-col :span="6"> -->
          <el-form-item label="申请状态" v-if="!ifHistory">
            <el-select v-model="feeModelFrom.companyName" placeholder="请选择">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <!-- </el-col> -->
          <!-- 资费标准状态 -->
          <!-- <el-col :span="6"> -->
          <el-form-item label="资费标准状态" v-if="!ifHistory">
            <el-select v-model="feeModelFrom.companyName" placeholder="请选择">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <!-- </el-col> -->
          </el-row>
          <!-- 第二行表单 -->
          <!-- <el-row :gutter="20"> -->
          <!-- 生效时间 -->
          <!-- <el-col :span="6"> -->
          <el-form-item label="生效时间">
            <el-select v-model="feeModelFrom.companyName" placeholder="请选择">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <!-- </el-col> -->
          <!-- 提交人 -->
          <!-- <el-col :span="6"> -->
          <el-form-item label="提交人">
            <el-select v-model="feeModelFrom.companyName" placeholder="请选择">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <!-- </el-col> -->
          <!-- 提交时间 -->
          <!-- <el-col :span="6"> -->
          <el-form-item label="提交时间">
            <el-select v-model="feeModelFrom.companyName" placeholder="请选择">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <!-- </el-col> -->
          <!-- 创建人 -->
          <!-- <el-col :span="6"> -->
          <el-form-item label="创建人">
            <el-select v-model="feeModelFrom.companyName" placeholder="请选择">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <!-- </el-col> -->
          <!-- </el-row> -->
        </el-form>
        <!-- 表单end -->
        <!-- 按钮行 -->
        <el-row class="lx_row_for_btn">
          <el-button size="mini" type="primary">查询</el-button>
          <template v-if="!ifHistory">
            <el-button size="mini" type="primary" plain>调整资费标准</el-button>
            <el-button size="mini">查看留学资费标准</el-button>
            <el-button size="mini">查看历史资费标准</el-button>
          </template>
        </el-row>
        <!-- 按钮行end -->
        <!-- table -->
        <el-table :data="tableData" style="width: 100%">
          <el-table-column type="index" label="序号" width="100" align="center">
          </el-table-column>
          <template v-if="showWhichTable.length>0">
            <el-table-column v-for="(item,index) in showWhichTable" :prop="item.prop" :label="item.label" :key="index">
            </el-table-column>
          </template>
          <!--  <el-table-column prop="name" label="项目名称" width="180">
                    </el-table-column>
                    <el-table-column prop="address" label="提交人">
                    </el-table-column>
                    <el-table-column prop="date" label="提交日期">
                    </el-table-column>
                    <el-table-column prop="address" label="申请状态">
                    </el-table-column>
                    <el-table-column prop="address" label="资费标准状态">
                    </el-table-column>
                    <el-table-column prop="date" label="生效时间">
                    </el-table-column>
                    <el-table-column prop="address" label="创建人">
                    </el-table-column> -->
        </el-table>
        <!-- table end-->
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script type="text/ecmascript-6">
import { GetRequest } from '@/utils/index'
import "@/styles/feesChange.scss" //重写的css
export default {
  data() {
    return {
      ifHistory: false, //判断是否为历史资费标标准页面跳进来的
      feeModelFrom: { //上方查询的表单
        companyName: ''
      },
      options: [{
        value: '选项1',
        label: '黄金糕'
      }],
      showWhichTable: [], //展示哪一种table，资费、历史
      lxFeesTable: [ // 留学资费标准的table渲染
        {
          label: '业务单位',
          prop: 'date'
        }, {
          label: '项目名称',
          prop: 'name'
        }, {
          label: '提交人',
          prop: 'date'
        }, {
          label: '提交日期',
          prop: 'date'
        }, {
          label: '申请状态',
          prop: 'date'
        }, {
          label: '资费标准状态',
          prop: 'date'
        }, {
          label: '生效时间',
          prop: 'date'
        }, {
          label: '创建人',
          prop: 'address'
        }
      ],
      historyFeesTable: [ // 历史资费标准的table渲染
        {
          label: '生效时间',
          prop: 'date'
        }, {
          label: '业务单位',
          prop: 'name'
        }, {
          label: '项目名称',
          prop: 'date'
        }, {
          label: '提交人',
          prop: 'date'
        }, {
          label: '提交时间',
          prop: 'date'
        }, {
          label: '创建人',
          prop: 'address'
        }
      ],
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
  components: {

  },
  mounted() {
    this.getUrlQuery() //链接里边取参数
  },
  methods: {
    getUrlQuery() { //链接里边取参数
      if (this.$route && this.$route.query && this.$route.query.type && this.$route.query.type === 'history') {
        this.ifHistory = true
      } else {
        this.ifHistory = false
      }
      this.showTable()
      return false
      let req = GetRequest()
      // 判断是否历史资费调整跳进来的，两个资费调整页面很相似，所以搞成同一个，加上判断
      this.ifHistory = req.type && req.type === 'history' ? true : false
      this.showTable()
    },
    showTable() { //根据是否资费、历史资费调整 ，决定table的渲染
      this.showWhichTable = this.ifHistory ? this.historyFeesTable : this.lxFeesTable
    }
  },
  watch: {
    $route() {
      this.getUrlQuery()
    }
  }
}

</script>
<style lang="scss" rel="stylesheet/scss">
.zf_bz_tz {

  .lx_new_set_form {
    padding-left: 10px;
  }

  .lx_row_for_btn {
    text-align: center;
    margin-bottom: 15px;
    // margin-top: 14px;
  }
}

</style>
