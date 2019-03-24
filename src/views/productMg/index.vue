<template>
  <div class="product-manage">
    <el-form :inline="true" :model="filter">
      <el-form-item label="城市" prop="city">
        <el-cascader v-model="filter.city" :options="cityList" :props="cityProps" placeholder="请选择" @change="getAreaList()">
        </el-cascader>
      </el-form-item>
      <el-form-item label="区域" prop="city">
        <el-select v-model="filter.area" placeholder="请选择" @change="getStreetList">
          <el-option label="全部" value="全部"></el-option>
          <el-option v-for="item in areaList" :key="item.adcode" :label="item.name" :value="item.adcode"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="街道" prop="city" v-if="filter.area !== '全部'">
        <el-select v-model="filter.street" placeholder="请选择">
          <el-option label="全部" value="全部"></el-option>
          <el-option v-for="item in streetList" :key="item.name" :label="item.name" :value="item.name"></el-option>
        </el-select>
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
          <div class="slot-expand">
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
            <div>
              <div style="display:flex;align-items:center">
                <span style="color:#99a9bf;">照片墙</span>
                <img class="pic-list" v-for="(item, index) in props.row.imgUrl" :key="index" :src="item"> 
              </div>
              <div class="sale-list">
                <div v-for="(item, index) in props.row.saleList" :key="index">
                  <h3>套餐{{ index + 1 }}</h3>
                  <p>名称：{{ item.name }}</p>
                  <p>门市价：{{ item.salePrice }}</p>
                  <p>优惠价：{{ item.offPrice }}</p>
                </div>
              </div>
            </div>
          </div>
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
        prop="area"
        min-width="50">
      </el-table-column>
      <el-table-column
        label="是否热门"
        width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.hot ? '是' : '否' }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="类别"
        prop="type"
        width="120">
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
          <el-button type="text" @click="setHot(scope.row)">{{ scope.row.hot ? '取消热门' : '设为热门'}}</el-button>
          <el-button type="text" @click="openEditDialog(scope.row)">编辑</el-button>
          <el-button type="text" @click="deleteProduct(scope.row._id)">删除</el-button>
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
    <!-- 新增商家弹窗 -->
    <el-dialog
      title="新增商家"
      :visible.sync="dialogVisible"
      width="35%"
      center
      @closed="clearFormData">
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
          <el-cascader v-model="dialogForm.city" :options="cityList" :props="cityProps" placeholder="请选择" @change="getAreaList(true)">
          </el-cascader>
        </el-form-item>
        <el-form-item label="区域" prop="area" label-width="15%">
          <el-select v-model="dialogForm.area" placeholder="请选择" @change="getStreetList(true)">
            <el-option v-for="item in dialogForm.areaList" :key="item.name" :label="item.name" :value="item.adcode"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="街道" prop="place" label-width="15%">
          <el-select v-model="dialogForm.place" placeholder="请选择">
            <el-option v-for="item in dialogForm.streetList" :key="item.name" :label="item.name" :value="item.name"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="详细地址" prop="address" label-width="15%">
          <el-input v-model="dialogForm.address" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="tel" label-width="15%">
          <el-input v-model="dialogForm.tel" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="营业时间" prop="officeHours" label-width="15%">
          <el-input v-model="dialogForm.officeHours" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="人均价格" prop="price" label-width="15%">
          <el-input v-model="dialogForm.price" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="套餐描述" prop="description" label-width="15%">
          <el-input v-model="dialogForm.description" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="照片墙" label-width="15%">
          <el-upload
            action="http://localhost:3333/uploadFiles"
            :on-remove="handleUploadRemove"
            :on-success="handleUploadSuccess"
            :file-list="dialogForm.fileList"
            list-type="picture-card"
            multiple
            :limit="5"
            accept="image/png, image/jpeg">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">默认第一张照片为封面，最多上传五张。只能上传jpg/png文件，且不超过10MB</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleDialog('dialogForm', true)">下一步</el-button>
      </span>
    </el-dialog>
    <!-- 新增商家弹窗 -->
    <!-- 编辑商家弹窗 -->
    <el-dialog
      title="编辑商家"
      :visible.sync="editDialogVisible"
      width="35%"
      center
      @closed="clearEditFormData">
      <el-form :model="editDialogForm" ref="editDialogForm">
        <el-form-item label="店名" prop="name" label-width="15%">
          <el-input v-model="editDialogForm.name" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="类别" prop="type" label-width="15%">
          <el-select v-model="editDialogForm.type" placeholder="请选择">
            <el-option v-for="item in typeList" :key="item._id" :label="item.name" :value="item.name"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="联系电话" prop="tel" label-width="15%">
          <el-input v-model="editDialogForm.tel" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="营业时间" prop="officeHours" label-width="15%">
          <el-input v-model="editDialogForm.officeHours" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="人均价格" prop="price" label-width="15%">
          <el-input v-model="editDialogForm.price" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="套餐描述" prop="description" label-width="15%">
          <el-input v-model="editDialogForm.description" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="照片墙" label-width="15%">
          <el-upload
            action="http://localhost:3333/uploadFiles"
            :on-remove="handleEditUploadRemove"
            :on-success="handleEditUploadSuccess"
            list-type="picture-card"
            multiple
            :file-list="editDialogForm.imgUrls"
            :limit="5"
            accept="image/png, image/jpeg">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">默认第一张照片为封面，最多上传五张。只能上传jpg/png文件，且不超过10MB</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleDialog('editDialogForm', false)">下一步</el-button>
      </span>
    </el-dialog>
    <!-- 编辑商家弹窗 -->
    <el-dialog
      title="套餐列表"
      :visible.sync="sellDialogVisible"
      width="35%"
      center
      @closed="clearSellFormData">
      <el-form
        class="sellForm"
        v-for="(item, index) in sellForm"
        :key="index"
        :model="item"
        ref="sellForm">
        <h3>
          套餐{{index + 1}}
          <i class="el-icon-remove-outline remove-btn" v-if="sellForm.length > 1" @click="sellForm.splice(index, 1)"></i>
          <i class="el-icon-circle-plus-outline add-btn" v-if="sellForm.length === index + 1" @click="sellForm.push({ name: '', salePrice: '', offPrice: ''})"></i>
        </h3>
        <el-form-item label="名称" prop="name" label-width="15%">
          <el-input v-model="item.name" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="门店价" prop="salePrice" label-width="15%">
          <el-input v-model="item.salePrice" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="优惠价" prop="offPrice" label-width="15%">
          <el-input v-model="item.offPrice" placeholder="请输入"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="sellDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleProduct">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { 
  queryCityList,
  queryAreaList,
  queryTypeList,
  queryProductList,
  removeProduct,
  changeHot,
  addProduct,
  updateProduct
} from '@/api/product';

export default {
  name: 'productMg',
  data() {
    return {
      filter: {
        city: ["330000", "330100"],
        name: '',
        type: '',
        time: '',
        area: '',
        street: ''
      },
      cityList: [],
      areaList: [],
      streetList: [],
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
        city: [],
        area: '',
        place: '',
        fileList: [],
        areaList: [],
        streetList: [],
        imgUrls: {},
        address: '',
        tel: '',
        officeHours: '',
        price: 0,
        description: ''
      },
      editDialogVisible: false,
      editDialogForm: {
        name: '',
        type: '',
        address: '',
        tel: '',
        officeHours: '',
        price: 0,
        description: '',
        imgUrls: [],
        imgUrl: [] // 传到后台的url列表
      },
      sellDialogVisible: false,
      sellForm: [
        {
          name: '',
          salePrice: '',
          offPrice: ''
        }
      ],
      isAdd: false
    };
  },
  async mounted() {
    const { data: { provinceList: cityList } } = await queryCityList();
    this.cityList = cityList;
    const { data: typeList } = await queryTypeList();
    this.typeList = typeList;
    this.getProductList();
    this.getAreaList();
  },
  methods: {
    /**
     * @description 处理新增或编辑商家的第一个弹窗
     */
    handleDialog(formName, isAdd) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (!isAdd) {
            this.isAdd = false;
            this.sellForm = this.editDialogForm.saleList;
          } else {
            this.isAdd = true;
          }
          this.sellDialogVisible = true;
        } else {
          return false;
        }
      });
    },
    /**
     * @description 新增或编辑商家
     */
    handleProduct() {
      const isValid = this.sellForm.every((item, index) => {
        let result;
        this.$refs.sellForm[index].validate((valid) => {
          result = valid;
        })
        return result;
      });
      if (isValid) {
        if (this.isAdd) {
          const query = {
            name: this.dialogForm.name,
            type: this.dialogForm.type,
            cityCode: this.dialogForm.city[1],
            adcode: this.dialogForm.area,
            place: this.dialogForm.place,
            address: this.dialogForm.address,
            tel: this.dialogForm.tel,
            officeHours: this.dialogForm.officeHours,
            price: this.dialogForm.price,
            description: this.dialogForm.description,
            imgUrl: Object.values(this.dialogForm.imgUrls),
            saleList: this.sellForm
          };
          this.dialogForm.areaList.forEach((item) => {
            if (item.adcode === query.adcode) {
              query.area = item.name;
            }
          });
          addProduct(query).then((resp) => {
            this.$message.success(resp.msg);
            this.getProductList();
            this.sellDialogVisible = false;
            this.dialogVisible = false;
          });
        } else {
          const query = {
            id: this.editDialogForm.id,
            name: this.editDialogForm.name,
            type: this.editDialogForm.type,
            tel: this.editDialogForm.tel,
            officeHours: this.editDialogForm.officeHours,
            price: this.editDialogForm.price,
            description: this.editDialogForm.description,
            imgUrl: this.editDialogForm.imgUrl,
            saleList: this.sellForm
          };
          updateProduct(query).then((resp) => {
            this.$message.success(resp.msg);
            this.sellDialogVisible = false;
            this.editDialogVisible = false;
            this.getProductList();
          });
        }
      }
    },
    /**
     * @description 改变热门状态
     * @param {Object} row 商家信息对象
     */
    setHot(row) {
      const { _id, type, hot } = row;
      changeHot({ id: _id, type, hot: hot ? '0' : '1' }).then((resp) => {
        this.$message.success(resp.msg);
        this.getProductList();
      });
    },
    /**
     * @description 获取区域列表
     * @param {Boolean} isDialog 是否在弹窗中调用
     */
    getAreaList(isDialog = false) {
      let adcode;
      if (isDialog) {
        adcode = this.dialogForm.city[1];
      } else {
        this.filter.area = '全部';
        adcode = this.filter.city[1];
      }
      queryAreaList(adcode).then((resp) => {
        const { data } = resp;
        if (isDialog) {
          this.dialogForm.areaList = data.areaList;
        } else {
          this.areaList = data.areaList;
        }
      });
    },
    /**
     * @description 获取街道列表
     * @param {Boolean} isDialog 是否在弹窗中调用
     */
    getStreetList(isDialog = false) {
      let adcode;
      if (isDialog) {
        adcode = this.dialogForm.area;
      } else {
        adcode = this.filter.area;
      }
      if (adcode === '全部') {
        return false;
      }
      queryAreaList(adcode).then((resp) => {
        const { data } = resp;
        if (isDialog) {
          this.dialogForm.streetList = data.areaList;
        } else {
          this.streetList = data.areaList;
        }
      });
    },
    /**
     * @description 删除某个上传文件
     */
    handleUploadRemove(file, fileList) {
      delete this.dialogForm.imgUrls[file.uid];
    },
    /**
     * @description 上传文件成功时的回调
     */
    handleUploadSuccess(response, file, fileList) {
      this.dialogForm.imgUrls[file.uid] = response.data[0];
    },
    handleEditUploadRemove(file, fileList) {
      const index = this.editDialogForm.imgUrls.indexOf(file.url);
      this.editDialogForm.imgUrl.splice(index, 1);
      this.editDialogForm.imgUrls = fileList;
    },
    handleEditUploadSuccess(response, file, fileList) {
      this.editDialogForm.imgUrl.push(response.data[0]);
      this.editDialogForm.imgUrls = fileList;
    },
    openEditDialog(row) {
      this.editDialogForm.name = row.name;
      this.editDialogForm.type = row.type;
      this.editDialogForm.id = row._id;
      this.editDialogForm.tel = row.tel;
      this.editDialogForm.price = row.price;
      this.editDialogForm.officeHours = row.officeHours;
      this.editDialogForm.description = row.description;
      this.editDialogForm.saleList = row.saleList;
      this.editDialogForm.imgUrl = row.imgUrl;
      row.imgUrl.forEach((item) => {
        this.editDialogForm.imgUrls.push({ url: item });
      });
      this.editDialogVisible = true;
    },
    /**
     * @description 清空弹窗中的表单
     */
    clearFormData() {
      this.$refs.dialogForm.resetFields();
      this.dialogForm.fileList = [];
      this.dialogForm.areaList = [];
      this.dialogForm.streetList = [];
      this.dialogForm.imgUrls = {};
    },
    /**
     * @description 清空编辑弹窗中的表单
     */
    clearEditFormData() {
      this.$refs.editDialogForm.resetFields();
      this.editDialogForm.imgUrls = [];
      this.editDialogForm.imgUrl = [];
    },
    /**
     * @description 清空第二个弹窗中的表单
     */
    clearSellFormData() {
      this.$refs.sellForm[0].resetFields();
      this.sellForm = [
        {
          name: '',
          salePrice: '',
          offPrice: ''
        }
      ];
    },
    /**
     * @description 获取商家列表
     */
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
    /**
     * @description 处理分页
     */
    handlePageChange() {
      this.getProductList();
    },
    /**
     * @description 删除某项商家信息
     * @param {String} id 商家id
     */
    deleteProduct(id) {
      this.$confirm('确定要删除该商家?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        removeProduct(id).then((resp) => {
          this.$message.success(resp.msg);
          this.getProductList();
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });          
      });
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

    .slot-expand {
      display: flex;
      flex-wrap: wrap;

      .sale-list {
        h3 {
          margin: 8px 0;
        }

        p {
          margin: 8px 0 8px 24px;
          text-indent: 4;
        }
      }
    }

    .pic-list {
      margin-left: 16px;
      width: 120px;
      height: 80px;
    }
  }

  .table-expand {
    width: 50%;
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

  .sellForm {
    padding: 16px;

    .add-btn {
      margin-left:10px;
      color: green;
      cursor: pointer;
    }

    .remove-btn {
      margin-left:10px;
      color:red;
      cursor: pointer;
    }
  }
}
</style>

