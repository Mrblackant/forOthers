<!-- 费用清单-->
<template>
  <div class="lx_container lx_container_change fy_qd">
    <el-tabs type="border-card">
      <el-tab-pane label="费用清单">
        <!-- 首行信息展示 -->
        <el-row class="lx_list_show">
          <el-col :span="5">当前公司:{{whichCom}}
          </el-col>
          <el-col :span="5">当前国家: {{whichCon}}</el-col>
          <el-col :span="5">项目: {{whichProject}}</el-col>
          <el-col :span="9" align="right">
            <el-button size="mini" @click="copyToOther">复制到其他公司或国家</el-button>
            <el-button v-if="!hasSee" size="mini" type="primary" plain @click="addNewFees">新增费用清单明细</el-button>
          </el-col>
        </el-row>
        <!-- 首行信息展示 end-->
        <!-- table -->
        <el-table :data="tableData" style="width: 100%" class="lx_table_wapper common_table_set">
          <el-table-column fixed type="index" label="序号" width="100" align="center"></el-table-column>
          <el-table-column label="费用名称" prop="name">
            <template slot-scope="scope">
              <el-input placeholder="请输入" v-if="scope.row.type==='new'" v-model="scope.row.name"></el-input>
              <span v-else>{{scope.row.name}}</span>
            </template>
          </el-table-column>
          <el-table-column label="金额" prop="name">
            <template slot-scope="scope">
              <el-input placeholder="请输入" v-if="scope.row.type==='new'" v-model="scope.row.name"></el-input>
              <span v-else>{{scope.row.name}}</span>
            </template>
          </el-table-column>
          <el-table-column label="付款方式和时间" prop="name">
            <template slot-scope="scope">
              <el-input placeholder="请输入" v-if="scope.row.type==='new'" v-model="scope.row.name"></el-input>
              <span v-else>{{scope.row.name}}</span>
            </template>
          </el-table-column>
          <el-table-column label="收取单位" prop="name">
            <template slot-scope="scope">
              <el-input placeholder="请输入" v-if="scope.row.type==='new'" v-model="scope.row.name"></el-input>
              <span v-else>{{scope.row.name}}</span>
            </template>
          </el-table-column>
          <el-table-column label="退费规定" prop="name">
            <template slot-scope="scope">
              <el-input placeholder="请输入" v-if="scope.row.type==='new'" v-model="scope.row.name"></el-input>
              <span v-else>{{scope.row.name}}</span>
            </template>
          </el-table-column>
          <el-table-column label="费用是否可以由新通代为收取名称" prop="name">
            <template slot-scope="scope">
              <el-select v-model="scope.row.name" size="mini" v-if="scope.row.type==='new'">
                <el-option v-for="(item,index) in option" :label="item.name" :value="item.value" :key="item.name"></el-option>
              </el-select>
              <span v-else>{{scope.row.name}}</span>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" v-if="!hasSee">
            <!-- 新增时的按钮 -->
            <template slot-scope="scope">
              <template v-if="scope.row.type==='new'">
                <el-button size="mini" class="lx_table_inner_mini_btn" @click="saveRow(scope)">保存</el-button>
                <el-button size="mini" class="lx_table_inner_mini_btn" @click="escRow(scope)">取消</el-button>
              </template>
              <!-- 普通按钮 -->
              <template v-else>
                <el-button size="mini" class="lx_table_inner_mini_btn" @click="editRow(scope)">编辑</el-button>
                <el-button size="mini" class="lx_table_inner_mini_btn" @click="deleteRow(scope)">删除</el-button>
              </template>
            </template>
          </el-table-column>
        </el-table>
        <!-- table end-->
        <!-- 复制费用清单 弹窗 -->
        <copy-fees-dialog :show.sync="controlDia"></copy-fees-dialog>
        <!-- 复制费用清单 弹窗 end -->
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script type="text/ecmascript-6">
import copyFeesDialog from './components/copyFeesDialog.vue' //复制费用清单弹窗

export default {
  components: {
    copyFeesDialog
  },
  data() {
    return {
      hasSee: false, //是否只是查看页面
      option: [{
        name: '莉莉安',
        value: 'zzl'
      }],
      controlDia: false, //控制复制费用清单弹窗的值
      whichCom: 'hahh', //当前公司
      whichCon: '美国', //当前国家
      whichProject: '默认', //项目
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
    this.seeOrEdit() //判断是编辑进来的还是只是查看
  },
  methods: {
    copyToOther() { //复制到其他公司或国家
      this.controlDia = true //复制弹窗打开
    },
    seeOrEdit() { //判断是编辑进来的还是只是查看
      let promission = this.$route.query
      this.hasSee = promission && promission.type === 'onlySee' ? true : false
      console.log(this.hasSee)
    },
    saveRow() { //保存

    },

    escRow() { //取消

    },
    addNewFees() { //新增费用清单明细
      this.tableData.push({
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄',
        canClick: false,
        type: 'new'
      })
    },
    editRow() { //table内的编辑

    },
    deleteRow() { //table内的删除

    }
  },
  watch: {
    $route() {
      this.seeOrEdit()
    }
  }
}

</script>
<style lang="scss" rel="stylesheet/scss">
@import "@/styles/feesChange.scss";

.fy_qd {
  @include lx_new_common_font_size;

  .lx_list_show {
    padding: 0 20px;
    color: $commonFs_color;
    margin-bottom: 15px;
  }
}

</style>
