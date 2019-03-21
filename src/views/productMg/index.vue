<template>
  <div class="product-manage">
    <el-form :inline="true" :model="filter">
      <el-form-item label="城市" prop="city">
        <el-cascader v-model="filter.city" :options="cityList" :props="cityProps" placeholder="请选择">
        </el-cascader>
      </el-form-item>
      <el-form-item label="店名" prop="name">
        <el-input v-model="filter.name" placeholder="请输入店名"></el-input>
      </el-form-item>
      <el-form-item label="类别" prop="type">
        <el-select v-model="filter.type" placeholder="请选择">
          <el-option label="全部" value="全部"></el-option>
          <el-option v-for="item in typeList" :key="item._id" :label="item.name" :value="item.name"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="时间段" prop="time">
        <el-date-picker
          v-model="filter.time"
          type="datetimerange"
          :picker-options="timePickerOptions"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          align="right">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small">搜索</el-button>
        <el-button type="primary" size="small" @click="dialogVisible = true">新增</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="tableData"
      class="table">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" class="table-expand">
            <el-form-item label="id">
              <span>{{ props.row._id }}</span>
            </el-form-item>
            <el-form-item label="类别">
              <span>{{ props.row.type }}</span>
            </el-form-item>
            <el-form-item label="店名">
              <span>{{ props.row.name }}</span>
            </el-form-item>
            <el-form-item label="所属区域">
              <span>{{ props.row.area }}</span>
            </el-form-item>
            <el-form-item label="所属街道">
              <span>{{ props.row.place }}</span>
            </el-form-item>
            <el-form-item label="详细地址">
              <span>{{ props.row.address }}</span>
            </el-form-item>
            <el-form-item label="联系电话">
              <span>{{ props.row.tel }}</span>
            </el-form-item>
            <el-form-item label="营业时间">
              <span>{{ props.row.officeHours }}</span>
            </el-form-item>
            <el-form-item label="是否热门">
              <span>{{ props.row.hot ? '是' : '否' }}</span>
            </el-form-item>
            <el-form-item label="人均价格">
              <span>{{ props.row.price }}</span>
            </el-form-item>
            <el-form-item label="平均好评率">
              <span>{{ props.row.averRate }}</span>
            </el-form-item>
            <el-form-item label="创建时间">
              <span>{{ $moment(props.row.createdAt).format('lll') }}</span>
            </el-form-item>
            <el-form-item label="更新时间">
              <span>{{ $moment(props.row.updatedAt).format('lll') }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column
        label="id"
        prop="_id">
      </el-table-column>
      <el-table-column
        label="店名"
        prop="name">
      </el-table-column>
      <el-table-column
        label="所属区域"
        prop="area">
      </el-table-column>
      <el-table-column
        label="是否热门">
        <template slot-scope="scope">
          <span>{{ scope.row.hot ? '是' : '否' }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="类别"
        prop="type">
      </el-table-column>
      <el-table-column
        label="创建时间">
        <template slot-scope="scope">
          <span>{{ $moment(scope.row.createdAt).format('lll') }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="更新时间">
        <template slot-scope="scope">
          <span>{{ $moment(scope.row.updatedAt).format('lll') }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
          <el-button type="text">设为热门</el-button>
          <el-button type="text">编辑</el-button>
          <el-button type="text">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="pagination"
      background
      layout="total, prev, pager, next, jumper"
      :total="pageInfo.total"
      :current-page.sync="pageInfo.pageNum"
      :page-size="pageInfo.pageSize"
      @current-change="handlePageChange">
    </el-pagination>
    <el-dialog
      title="新增"
      :visible.sync="dialogVisible"
      width="35%"
      center>
      <el-form :model="dialogForm" ref="dialogForm">
        <el-form-item label="店名" prop="name" label-width="15%">
          <el-input v-model="dialogForm.name" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="类别" prop="type" label-width="15%">
          <el-select v-model="dialogForm.type" placeholder="请选择">
            <el-option v-for="item in typeList" :key="item._id" :label="item.name" :value="item.name"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="城市" prop="city" label-width="15%">
        <el-cascader v-model="dialogForm.city" :options="cityList" :props="cityProps" placeholder="请选择">
        </el-cascader>
      </el-form-item>
        <el-form-item label="详细地址" prop="address" label-width="15%">
          <el-input v-model="dialogForm.address" placeholder="请输入"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { 
  queryCityList,
  queryTypeList,
  queryProductList
} from '@/api/product';

export default {
  name: 'productMg',
  data() {
    return {
      filter: {
        city: ["330000", "330100"],
        name: '',
        type: '',
        time: ''
      },
      cityList: [],
      cityProps: {
        value: 'adcode',
        label: 'name',
        children: 'districts'
      },
      typeList: [],
      timePickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
      pageInfo: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      tableData: [],
      dialogVisible: false,
      dialogForm: {
        name: '',
        type: '',
        city: ''
      }
    };
  },
  async mounted() {
    const { data: { provinceList: cityList } } = await queryCityList();
    this.cityList = cityList;
    const { data: typeList } = await queryTypeList();
    this.typeList = typeList;
    this.getProductList();
  },
  methods: {
    getProductList() {
      const type = this.filter.type === '全部' ? undefined : this.filter.type;
      const cityCode = this.filter.city[1];
      const sort = 0;
      const params = {
        pageNum: this.pageInfo.pageNum,
        pageSize: this.pageInfo.pageSize,
        cityCode,
        sort,
        type,
      };
      queryProductList(params).then((resp) => {
        console.log(resp.data);
        this.tableData = resp.data.productList;
        this.pageInfo.total = resp.data.totalRecords;
      });
    },
    handlePageChange() {
      this.getProductList();
    }
  }
}
</script>
<style lang="scss">
.product-manage {
  padding: 20px;

  .table {
    width: 100%;
    border: 1px solid #f2f2f2;
  }

  .table-expand {
    label {
      width: 90px;
      color: #99a9bf;
    }

    .el-form-item {
      margin-right: 0;
      margin-bottom: 0;
      width: 50%;
    }
  }

  .pagination {
    margin-top: 25px;
    float: right;
  }
}
</style>

