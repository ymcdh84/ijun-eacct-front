<template>
  <div class="inner-box">
    <div class="content-name">
      <h2 class="dp-ib">{{title}}</h2>
      <div class="btn-wrap btn-type1 clearfix">
        <button class="btn-size btn-blue fl_left" @click="autoCreate">
          <span class="btn-icon">
            <i class="fas fa-pen-alt"></i>
          </span>
          월별 자동생성
        </button>
        <button class="btn-size btn-blue fl_left" @click="openMonth">
          <span class="btn-icon">
            <i class="fas fa-pen-alt"></i>
          </span>
          월별 오픈
        </button>
        <button class="btn-size btn-blue fl_left" @click="closeMonth">
          <span class="btn-icon">
            <i class="fas fa-pen-alt"></i>
          </span>
          월별 마감
        </button>
        <button class="btn-size btn-gray fl_left" @click="btnSearchClick">
          <span class="btn-icon">
            <i class="fas fa-search"></i>
          </span>
          조회
        </button>
        <button class="btn-size btn-gray fl_left" @click="newPage">
          <span class="btn-icon">
            <i class="far fa-file"></i>
          </span>
          신규
        </button>
        <button class="btn-size btn-blue fl_left" @click="save">
          <span class="btn-icon">
            <i class="fas fa-save"></i>
          </span>
          저장
        </button>
      </div>
    </div>
    <!-- 검색조건 영역 -->
    <div class="search-form">
      <div class="form-group">
          <label class="control-label-req" id="acctMonth">회계연월</label>
          <div class="form-input">
            <div class="datepicker w-type-ymd">
              <dhx-calendar class="input" v-model="form.acctmonths" :config="config" />
            </div>
          </div>
      </div>
    </div>
    <!-- 테이블 -->
    <div class="table-b  mt20">
      <div class="table-header">
        <div class="table-name">
          <h3 class="ico_table_name">회계기간 설정</h3>
        </div>
        <div class="btn-wrap btn-type2 clearfix">
          <button class="btn-size btn-w-gray" @click="reset()">
            <span class="btn-icon">
              <i class="fas fa-redo"></i>
            </span>초기화
          </button>
          <button id="editfunc" class="btn-size btn-w-gray" @click="add">
            <span id="add" class="btn-icon">
              <i class="fas fa-plus"></i>
            </span>
            {{edittext}}
          </button>
          <button class="btn-size btn-w-gray" @click="deleteRow">
            <span class="btn-icon">
              <i class="fas fa-trash-alt"></i>
            </span>행삭제
          </button>
        </div>
      </div>

      <div class="desc-content search-border">
        <div class="item desc-left">
          <div class="desc-item">
            <div class="tit">
              <span class="label-tit">- 회계연월</span>
            </div>
            <div class="desc">
              <div class="datepicker w-type-ymd">
                <dhx-calendar class="input" v-model="form.acctmonth" :config="config" />
              </div>
            </div>
          </div>
        </div>
        <div class="item desc-center">
          <div class="desc-item">
            <div class="tit">
              <span class="label-tit">- 사업영역</span>
            </div>
            <div class="desc">
              <b-select class="select is-fullwidth" v-model="form.bizTypeCd">
                <option value>==선택==</option>
                <option
                  v-for="item in bizTypes"
                  :key="item.key"
                  :value="item.key"
                >{{ '[' + item.key + '] ' + item.value }}</option>
              </b-select>
            </div>
          </div>
        </div>
        <div class="item desc-right">
          <div class="desc-item">
            <div class="tit">
              <span class="label-tit">- 마감상태</span>
            </div>
            <div class="desc">
              <div class="dp-ib fl_left">
                <input type="radio" id="radio01" v-model="form.status" value="Open" />
                <label for="radio01" class="NotoM">OPEN</label>
              </div>
              <div class="dp-ib fl_left">
                <input type="radio" id="radio02" v-model="form.status" value="Close" />
                <label for="radio02" class="NotoM">CLOSE</label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ag-grid-vue ref="grid" style="width: 100%;" class="ag-theme-alpine grid_search_height_350" rowSelection="multiple"      
                    :columnDefs="columnDefs" 
                    :rowData="data" 
                    :gridOptions="gridOptions"
                    :defaultColDef="defaultColDef"

                    @grid-ready="onReady"
                    @row-selected="onRowSelected"
                    />
    </div>
  </div>
</template>

<script>
import DhxGrid from "@/components/DhxGrid.vue";
import DhxCalendar from "@/components/DhxCalendar.vue";

import TableRadio from "@/components/slip/table/libs/TableRadio";
import common from '@/mixin/common';

export default {
  name: "closeMng",
  mixins: [common],
  components: {
    DhxCalendar,
    TableRadio
  },
  data() {
    return {
      title: "회계기간 관리",
      deleteid: "",
      flag: true,
      bizTypes: [],
      data: [],
      newdata: [],
      edittext: "추가",
      editfunc: "add",
      index: undefined,
      config: {
        hideTime: false,
        format: "YYYY-MM",
        outputFormat: "YYYYMM",
        dateFormat: '%Y-%m'
      },
      form: {
        bizTypeCd: "",
        status: "Open",
        acctmonth: this.$moment().format("YYYYMM"),
        acctmonths: this.$moment().format("YYYYMM"),
      },
      gridOptions: {},      
      defaultColDef: {         
          resizable: true,
          filter: true,
          sortable: true,
          editable: false,
          cellStyle : {'justify-content': 'center', 'display': 'flex'}
      },       
      gridApi : null ,    //gridAip
      columnApi : null ,  //columApi 
      columnDefs: [] ,    //comulum Defs
    };
  },
  methods: {
   //그리드 Ready
    onReady(params) {
      //그리드용 api 정의
      //this.gridApi = params.api;
      //this.columnApi = params.columnApi; //params대신 gridOptions 사용가능
      this.gridApi = this.gridOptions.api;
      this.columnApi = this.gridOptions.columnApi;
      
      this.gridApi.sizeColumnsToFit();      
    },
    //컬럼정의 함수
    createColumnDefs() { 
        const vm = this

        this.columnDefs = [
          {
              headerName: 'No.', 
              width: 60,
              valueFormatter: function(params) {               
                return params.node.rowIndex+1;
              },
              editable: false,
              filter: false,
              sortable: false
          },          
          {
            headerName: '회계년월'
          , width : 180
          , field: 'closYm'
          , headerClass: 'require-column' //필수입력 컬럼 css
          },
          {
            headerName: '사업영역 코드'
          , width : 180
          , field: 'baCd'          
          , headerClass: 'require-column' //필수입력 컬럼 css
          },          
          {
            headerName: '사업영역 명'
          , width : 200
          , field: 'baNm'
          , headerClass: 'require-column' //필수입력 컬럼 css
          },
          {
            headerName: '마감상태'
          , width : 150
          , field: 'closStatCd'
          , headerClass: 'require-column' //필수입력 컬럼 css
          },          
          {
            headerName: '변경자'
          , width : 245 
          , field: 'chgNm'          
          }, 
          {
            headerName: '변경일시'
          , width : 280
          , field: 'chgDtm'
          },
          {
            headerName: 'compCd'
          , width : 230 
          , field: 'compCd'
          , hide: true
          }
        ];
    },    
    onRowSelected(){     
      
      const row = this.gridApi.getSelectedRows()[0]

      this.edittext = "수정"
      this.form.acctmonth = row.closYm
      this.form.bizTypeCd = row.baCd
      this.form.status = row.closStatCd
    },
    btnSearchClick(){
      if(!this.searchRequireCheck()) return;

      this.goOpen();
    },    
    goOpen() {
      
      this.$http
        .post("/api/acctPeriod/list", this.form.acctmonths)
        .then(response => {
          this.data = response.data;
        });
        this.edittext = "추가"
        //this.form.acctmonth = this.$moment().format("YYYYMM")
        this.form.bizTypeCd = ""
        this.form.status = "Open"
    },
    getbizTypeCombo() {
      this.$http
        .get(`/api/code/combo`, { params: { groupCd: "BA_CD" } })
        .then(response => {
          this.bizTypes = response.data;
        });
    },
    save() {
      
      //그리드 필수입력 체크                
      if(!this.gridRequireCheck([this.$refs.grid])) return;

      for (var i = 0; i < this.data.length; i++) {
        for (var j = i + 1; j < this.data.length; j++) {
          if (this.data[i].baCd === this.data[j].baCd && this.data[i].closYm === this.data[j].closYm) {
            this.$swal({
              type: "error",
              text: "해당 영역의 회계연월이 이미 존재합니다."
            });
            return false;
          }
        }
      }

      this.$http.post("/api/acctPeriod/save", this.data).then(response => {
        this.$swal({ type: "success", text: response.data });
        this.goOpen();
        return;
      });
    },
    newPage() {
      this.$swal({
        type: "info",
        text: `변경된 데이터가 있습니다. 계속 하시겠습니까?`,
        showCancelButton: true,
        confirmButtonText: "예",
        cancelButtonText: "아니오"
      }).then(result => {
        if (result.value) {
          this.goOpen();
        }
      });
    },
    reset() {
      this.goOpen();
    },
    autoCreate() {
      this.$http
        .put("/api/acctPeriod/monthlyAuto", this.form.acctmonth)
        .then(response => {
          this.$swal({
            type: "success",
            text: "월별 자동생성이 완료되었습니다."
          });
          this.goOpen();
        })
        .catch(({ message }) => {
          if (message === "Request failed with status code 500") {
            this.$swal({ type: "error", text: "기존 내역이 존재합니다." });
          }
        });
    },
    openMonth() {
      this.$swal({
        type: "info",
        text: `해당 연월의 전체 사업영역을 오픈 합니다. 계속 하시겠습니까?`,
        showCancelButton: true,
        confirmButtonText: "예",
        cancelButtonText: "아니오"
      }).then(result => {
        if (result.value) {
           this.$store.commit('loading')
          this.$http
            .put(`/api/acctPeriod/open`, this.form.acctmonth)
            .then(response => {
              this.$swal({type: 'info', text: '오픈 하였습니다.'});
              this.goOpen();
            });
        }
      }).finally(() => {
        this.$store.commit('finish') 
        
      });
    },
    closeMonth() {
      this.$swal({
        type: "info",
        text: `해당 연월의 전체 사업영역을 마감 합니다. 계속 하시겠습니까?`,
        showCancelButton: true,
        confirmButtonText: "예",
        cancelButtonText: "아니오"
      }).then(result => {
        if (result.value) {
          this.$store.commit('loading')
          this.$http
            .put(`/api/acctPeriod/close`, this.form.acctmonth)
            .then(response => {
              this.$swal({type: 'info', text: '마감 하였습니다.'}); 
              this.goOpen();
            });
        }
      }).finally(() => {
        this.$store.commit('finish')
        
      });
    },
    add() {

      if(this.edittext === '추가'){
        
        let bizTypeNm = this.bizTypes.filter(
          x => x.key === this.form.bizTypeCd
        )[0];

        this.data.push({
          closYm: this.form.acctmonth,
          baCd: this.form.bizTypeCd,
          baNm: bizTypeNm !== undefined ? bizTypeNm.value : undefined,
          closStatCd: this.form.status,
          chgNm: "",
          chgDtm: "",
          compCd: this.$store.state.loginInfo.compCd
        });

      }else if(this.edittext === '수정'){
        
        let bizTypeNm = this.bizTypes.filter(
          x => x.key === this.form.bizTypeCd
        )[0];

        let rowIndex = this.gridApi.getSelectedNodes()[0].childIndex                

        this.data[rowIndex].closYm = this.form.acctmonth,
        this.data[rowIndex].baCd = this.form.bizTypeCd,
        this.data[rowIndex].baNm = bizTypeNm.value,
        this.data[rowIndex].closStatCd = this.form.status

        //row refresh
        var rows = [];
        var rowNode = this.gridApi.getDisplayedRowAtIndex(rowIndex);
        
        rows.push(rowNode)

        this.gridApi.redrawRows({ rowNodes: rows });   
      }
    },
    deleteRow() {
      
      let row = this.gridApi.getSelectedRows()[0]

      if (!row) {
        this.$swal({
          type: "error",
          text: "삭제할 행을 선택하여주세요."
        });
      } else {
        
        const rowIndex = this.gridApi.getSelectedNodes()[0].childIndex;
        
        const isNew = row.new;
        const baCd = row.baCd;
        const closYm = row.closYm;

        this.data.splice(rowIndex, 1);

        if (!isNew) {
          this.edittext = "추가"
          this.form.acctmonth = this.$moment().format("YYYYMM")
          this.form.bizTypeCd = ""
          this.form.status = "Open"
          this.$http
            .post("/api/acctPeriod/delete", {
              baCd,
              closYm
            })
            .then(response => {
              // Do nothing!
            });
        }
      }
    }
  },
  mounted() {
    document.title = this.title + ' - IJEAS';
    this.createColumnDefs();
    this.goOpen();
    this.getbizTypeCombo();
  }
};
</script>


<style scoped>
.gridbox {
  height: 200px !important;
}
.gridbox .objbox {
  height: 350px !important;
}

.desc-content:after {
  clear: both;
  content: "";
  display: block;
}
.btn-wrap {
  margin-bottom: 10px;
}
.desc-content {
  border: 2px solid #9db6c9;
  background: #f9fafc;
  margin: 0 0 20px 0;
  border-radius: 4px;
  padding: 15px 2%;
  clear: both;
}
.desc-content .item {
  float: left;
}
.desc-content .item .desc-item {
  position: relative;
  padding-left: 82px;
  margin-bottom: 8px;
}
.desc-content .item .desc-item:last-child {
  margin-bottom: 0;
  height: 25px;
}
.desc-content .item .desc-item .tit {
  position: absolute;
  left: 0;
}
.desc-content .item .desc-item .label-tit {
  font-family: "NotoM";
  color: #222;
  font-size: 15px;
}
.desc-content .item.desc-left .desc-item {
  padding-left: 90px;
}
.desc-content .item.desc-left .desc-item .desc:after {
  clear: both;
  content: "";
  display: block;
}
.desc-content .item.desc-left .desc-item .desc .datepicker {
  float: left;
}
.desc-content .item.desc-left .desc-item .desc span.wave {
  float: left;
  padding: 0 6px;
}
.desc-content .item.desc-left .desc-item .td-s-thumb.search-area:after {
  clear: both;
  content: "";
  display: block;
}
.desc-content .item.desc-left .desc-item .td-s-thumb.search-area input,
.desc-content .item.desc-left .desc-item .td-s-thumb.search-area .ip-box {
  float: left;
}
.desc-content .item.desc-left .desc-item .desc.select select {
  width: 70%;
}
.desc-content .item.desc-left {
  width: 35%;
  padding-right: 40px;
}
.desc-content .item.desc-center {
  width: 35%;
  padding-right: 40px;
}
.desc-content .item.desc-right {
  width: 30%;
}
.search-area input {
  position: relative;
}
.search-area .icon {
  position: absolute;
  right: 8px;
  top: 1px;
  z-index: 100;
  cursor: pointer;
  font-size: 16px;
  color: #555;
}
.search-border .td-s-thumb {
  position: relative;
  display: inline-block;
}
.search-border .td-s-thumb.search-area > input,
.search-border
  .td-s-thumb.search-area
  > .ip-box
  .search-border
  .td-s-thumb.search-area
  > button {
  float: left;
}
.search-border .td-s-thumb.search-area .ip-box.ip-box-w02 {
  width: 60%;
  margin-left: 6px;
}
.remove_text {
  margin-left: 0;
}
.contents div.gridbox_material.gridbox .xhdr {
  border-bottom: 1px solid #dfdfdf;
}

@media (max-width: 1580px) {
  .search-border .td-s-thumb.search-area .ip-box.ip-box-w02 {
    width: 50%;
  }
}
</style>