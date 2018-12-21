<!-- 资费标准调整-编辑页面 -->
<template>
  <div class="lx_container lx_container_change zf_bz_tz_bj">
    <el-tabs type="border-card">
      <el-tab-pane label="资费标准编辑">
        <!-- 上方的状态-->
        <el-row :gutter="30" class="lx_top_title">
          <el-col :span="6">状态:{{}}</el-col>
          <el-col :span="6">创建人:{{}}</el-col>
          <el-col :span="6">创建时间:{{}}</el-col>
        </el-row>
        <!-- 上方的状态end-->
        <!-- 申请信息 -->
        <div class="lx_for_info">
          <el-row class="lx_for_info_row">
            <template v-if="makeInfoInit.length>0">
              <el-col class="lx_info_col" v-for="(item,index) in makeInfoInit" :span="6" :class="[index%2===0 ? 'lx_info_col_light' : 'lx_info_col_dark' ,index>3 ? 'lx_info_col_no_border' : '']" :key="index">{{item}}</el-col>
            </template>
          </el-row>
        </div>
        <!-- 申请信息end -->
        <!-- 分割线 -->
        <div class="lx_for_line">
          <div class="lx_for_line_inner"></div>
        </div>
        <!-- 分割线end -->
        <!-- 业务单位等信息 -->
        <p class="lx_for_p_left">业务单位:{{}}</p>
        <!--主国家 -->
        <el-form ref="setMainCountry" v-model="mainFromCountry" :rules="mainRulesCountry" :inline="true" align="left">
          <el-form-item label="请选择主修改国家" prop="countryName">
            <el-button size="mini">请选择</el-button>
            <el-input style="display: none;" v-model="mainFromCountry.countryName"></el-input>
          </el-form-item>
        </el-form>
        <!-- 业务单位等信息 end-->
        <!-- formtable form+table-->
        <el-table :data="tableData" style="width: 100%" class="lx_table_wapper common_table_set">
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
              <template slot-scope="scope">
                <el-input type="number" v-model="scope.row.date" size="mini"></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="name" label="签证费">
              <template slot-scope="scope">
                <el-input type="number" v-model="scope.row.date" size="mini"></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="name" label="合计">
              <template slot-scope="scope">
                <el-input type="number" v-model="scope.row.date" size="mini"></el-input>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column prop="name" label="不录取扣款">
            <template slot-scope="scope">
              <el-input type="number" v-model="scope.row.date" size="mini"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="拒签扣款">
            <template slot-scope="scope">
              <el-input type="number" v-model="scope.row.date" size="mini"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="name" width="150" label="送入学申请资料前委托人要求解约扣款">
            <template slot-scope="scope">
              <el-input type="number" v-model="scope.row.date" size="mini"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="已送交入学申请材料，尚未得到结果前解约扣款" width="150">
            <template slot-scope="scope">
              <el-input type="number" v-model="scope.row.date" size="mini"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="默认申请院校数量">
            <template slot-scope="scope">
              <el-input type="number" v-model="scope.row.date" size="mini"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="超出每所收费">
            <template slot-scope="scope">
              <el-input type="number" v-model="scope.row.date" size="mini"></el-input>
            </template>
          </el-table-column>
          <el-table-column fixed="right" prop="name" label="操作">
            <template slot-scope="scope">
              <el-button size="mini" @click="tableCanable(scope.row)">禁用</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- formtable form+tabl end-->
        <!-- 新增操作等  -->
        <el-button class="lx_make_add_btn" type="primary" size="mini" plain>新增</el-button>
        <!-- 新增操作等 end -->
        <!-- 生效时间等表单 -->
        <el-form class="lx_chose_time_form" ref="reasonDataFrom" v-model="choseDataFrom" :rules="choseRulesFrom" align="left" size="mini">
          <el-form-item label="生效时间" prop="righTime">
            <el-date-picker v-model="choseDataFrom.righTime" type="date" placeholder="选择生效时间">
            </el-date-picker>
            <el-radio class="lx_radio_btn" label="1" border>立即生效</el-radio>
            <span class="lx_some_tips">（勾选此选项，则在审批通过后，该修改的资费标准立即生效。若选择生效时间，则在指定时间内修改的资费标准生效。)</span>
          </el-form-item>
          <el-form-item label="修改理由" prop="someReason">
            <el-input placeholder="请输入" class="lx_reason_inp" type="textarea" v-model="choseDataFrom.someReason"></el-input>
          </el-form-item>
        </el-form>
        <!-- 生效时间等表单 end -->
        <!-- 保存、提交 -->
        <el-row class="lx_btn_wapper_for">
          <el-button size="mini" type="primary" plain @click="makeSave">保存</el-button>
          <el-button size="mini" type="primary" @click="makePost">提交审批</el-button>
        </el-row>
        <!-- 保存、提交 end-->
        <!-- 分割线 -->
        <div class="lx_for_line">
          <div class="lx_for_line_inner"></div>
        </div>
        <!-- 分割线end -->
        <!-- 统一的标题分割 -->
        <block-border>
          <block-header class="lx_common_left_20px" slot="title" title="查询条件"></block-header>
        </block-border>
        <!--  -->
        <!-- 操作记录组件 -->
        <fees-operating-record class="lx_table_com_record"></fees-operating-record>
        <!-- 操作记录组件end -->
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script type="text/ecmascript-6">
import BlockBorder from '@/components/BlockBorder'
import BlockHeader from '@/components/BlockHeader'
import FeesOperatingRecord from "@/components/FeesOperatingRecord"
// import { GetRequest } from '@/utils/index'
// import "@/styles/feesChange.scss" //重写的css
export default {
  components: {
    BlockBorder,
    BlockHeader,
    FeesOperatingRecord
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
      makeInfoInit: [], //基本信息的渲染
      proposer: '张三', //后台获取的申请人
      aparet: '部门', //后台获取的部门
      mainFromCountry: {
        countryName: '', //国家名称
      },
      choseDataFrom: {
        righTime: '', //生效时间
        someReason: '', //修改理由
      },
      choseRulesFrom: { //选择让生效时间、修改理由的表单
        righTime: [
          { required: true, message: '请选择生效时间', trigger: 'blur' }
        ],
        someReason: [
          { required: true, message: '请填写修改理由', trigger: 'blur' }
        ]
      },
      mainRulesCountry: { //选择国家的表单校验
        countryName: [{ required: true, message: '请选择主国家', trigger: 'blur' }]
      },
    }
  },

  mounted() {
    this.makeBaseInfo() //渲染基本信息的表格
  },
  methods: {
    makeBaseInfo() { //将数据放进数组，方便渲染
      this.makeInfoInit = ['申请人', this.proposer, '部门', this.aparet, '申请类型', this.aparet, '申请时间', this.aparet]
    },
    tableCanable(data) { //table表格的禁用h
      console.log(data)
    },
    makeSave() { //保存表单

    },
    makePost() { //提交审批

    }

  }
}

</script>
<style lang="scss" rel="stylesheet/scss">
@import "@/styles/feesChange.scss";

.zf_bz_tz_bj {
  @include lx_new_common_font_size;

  .lx_reason_inp {
    width: 90% !important;
  }

  .lx_common_left_20px {
    margin-left: -20px;
    margin-top: -20px;
  }

  .lx_btn_wapper_for {
    text-align: center;
    margin-top: 25px;
  }

  .lx_chose_time_form {
    margin-top: 20px;

    .lx_some_tips {
      color: $commonFs_color;
    }

    .lx_radio_btn {
      margin-left: 10px;
    }
  }

  .lx_make_add_btn {
    margin-top: 20px;
    margin-left: 30px;
  }

  .lx_for_p_left {
    text-align: left;
    padding-left: 12px;
  }

  .lx_table_wapper {}

  .lx_top_title {
    box-sizing: border-box;
    padding-left: 30px;
    margin-bottom: 20px;
  }

  .lx_for_info {
    // height: 40px;
    width: 100%;
    background-color: $commonTable_header_color;

    .lx_for_info_row {
      border: 1px solid $commomBorder_color;
      border-left: 2px solid $commomBorder_color;
      border-right: none;
      font-weight: 400;
      font-size: 12px;
      color: $commonFs_color;
      ;

      .lx_info_col {
        padding: 9px 0;
        text-align: center;
        border-right: 1px solid $commomBorder_color;
        border-bottom: 1px solid $commomBorder_color;

      }

      .lx_info_col_light {
        background-color: $commonTable_row_color;
      }

      .lx_info_col_dark {
        background-color: $commonTable_header_color;

      }

      .lx_info_col_no_border {
        border-bottom: none;
      }
    }
  }

  .lx_table_com_record {
    margin-top: 5px;
  }
}

</style>
