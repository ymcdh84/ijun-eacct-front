<template>
  <div class="inner-box">
    <div class="content-name">
      <h2 class="dp-ib">{{title}}</h2>
      <div class="btn-wrap btn-type1 clearfix">
        <button class="btn-size btn-gray fl_left" @click="goOpen">
          <span class="btn-icon">
            <i class="fas fa-search"></i>
          </span>
          조회
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
          <label class="control-label-req" id="compCd">회사</label>
          <div class="form-input">
            <b-select id="bselect" class="select is-fullwidth" v-model="form.compCd" disabled = "true" lbl="compCd">
              <option
                v-for="item in compCds"
                :key="item.key"
                :value="item.key"
                v-text="item.value"
              />
            </b-select>
          </div>
      </div>
      <div class="form-group">
          <label class="control-label">기준연월</label>
          <div class="form-input">
            <div class="datepicker w-type-ymd">
              <dhx-calendar class="input" v-model="form.acctmonth" :config="config" />
              
            </div>
          </div>
      </div>
    </div>
    <div class="table-area mt20">
      <div class="table-b">
        <div class="table-header">
          <div class="table-name">
            <h3 class="ico_table_name">유류단가 내역</h3>
          </div>
          <div class="btn-wrap btn-type2 clearfix">
            <button class="btn-size btn-w-gray" @click="addRow">
              <span class="btn-icon">
                <i class="fas fa-plus"></i>
              </span>행추가
            </button>
            <button class="btn-size btn-w-gray" @click="deleteRow">
              <span class="btn-icon">
                <i class="fas fa-trash-alt"></i>
              </span>행삭제
            </button>
            <button class="btn-size btn-excel" @click="saveExcel">엑셀 저장</button>
          </div>
        </div>
        <div class="table-b">
            <div class="grid-wrap">
                <ag-grid-vue ref="grid" style="width: 100%; height: 660px;" class="ag-theme-alpine"  rowSelection="multiple"   
                      :columnDefs="columnDefs" 
                      :rowData="data" 
                      :gridOptions="gridOptions"
                      :frameworkComponents="frameworkComponents"
                      :defaultColDef="defaultColDef"

                      @grid-ready="onReady"
                      />
            </div>
        </div>        
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import DhxGrid from "@/components/DhxGrid.vue";
import DhxCalendar from "@/components/DhxCalendar.vue";
import GridNumberInput from "@/components/grid/GridNumberInput.vue";
import GridSelect from "@/components/grid/GridSelect.vue";

import MonthlyPicker from '@/components/MonthlyPicker.vue'

import SelectCellRenderer from '@/components/agGrid/select-cell-renderer'
import NumberInputCellRenderer from '@/components/agGrid/numberinput-cell-renderer'
import DatepickerCellRenderer from '@/components/agGrid/datepicker-cell-renderer'

import mixin from "@/mixin";
import mixinSlip from "@/mixin/slip";

import common from '@/mixin/common';

const bus = new Vue();

const options = {};
const lock = {};

function queryMngItemCd() {
  return new Promise((resolve, reject) => {
    if (options["OIL_KIND_CD"] !== undefined || lock["OIL_KIND_CD"]) {
      reject(false);
    } else {
      lock["OIL_KIND_CD"] = true;
      this.$store.commit("loading");
      this.$http
        .get("/api/code/detail", {
          params: {
            groupCd: "OIL_KIND_CD"
          }
        })
        .then(response => {
          options["OIL_KIND_CD"] = response.data;
          delete lock["OIL_KIND_CD"];
          bus.$emit("OIL_KIND_CD", response.data);
          return resolve(response);
        })
        .catch(response => {
          return reject(response);
        })
        .finally(() => {
          this.$store.commit("finish");
        });
    }
  });
}

export default {
  name: "oilPcePop",
  mixins: [mixin, mixinSlip,common],
  components: {
    DhxGrid,
    DhxCalendar,
    MonthlyPicker
  },
  data() {
    return {
      title: "유류단가 관리",
      compCds: [],
      data: [],
      deletedata: "",
      config: {
        hideTime: false,
        format: "YYYY-MM",
        outputFormat: "YYYYMM",
        dateFormat: '%Y-%m'
      },
      form: {
        compCd: "",
        acctmonth: this.$moment().format("YYYYMM")
      },
      gridOptions: {},      
      defaultColDef: {         
          resizable: true,
          filter: true,
          sortable: true,
          editable: true
      },       
      gridApi : null ,    //gridAip
      columnApi : null ,  //columApi 
      columnDefs: [] ,    //comulum Defs
      frameworkComponents: {
        select: SelectCellRenderer,
        numberInput: NumberInputCellRenderer,
        datePicker: DatepickerCellRenderer
      },        
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
      
      setTimeout(() => {
        this.createColumnDefs();
      },500);      
    },
    //컬럼정의 함수
    createColumnDefs() { 
        const vm = this

        this.columnDefs = [
          {
              headerName: 'No.', 
              width: 80,
              valueFormatter: function(params) {               
                return params.node.rowIndex+1;
              },
              editable: false
          },          
          {
            headerName: '기준년월'
          , width : 345
          , field: 'baseYm'
          , headerClass: 'require-column' //필수입력 컬럼 css
          , cellRenderer : 'datePicker'
          , cellRendererParams: {
              config: {
                hideTime: true,
                format: "YYYYMM",
                outputFormat: "YYYY-MM",
                dateFormat: '%Y-%m'
              },
            }          
          },
          {
            headerName: '유종'
          , width : 345 
          , field: 'oilKindCd'
          , cellRenderer: 'select'
          , cellRendererParams: {
                options : options["OIL_KIND_CD"],
                detailCd: 'detailCd',  //서버로 부터 받은 key defalut-"detailCd"
                detailNm: 'detailNm' //서버로 부터 받은 value defalut-"detailNm"
            }
          },          
          {
            headerName: '유류단가'
          , width : 400
          , field: 'oilUpce'
          , cellRenderer: 'numberInput'
          },
          {
            headerName: '연비(Km)'
          , width : 430
          , field: 'oilEff'
          , cellRenderer: 'numberInput'
          },          

          
        ];
    },     
    constructGridSuccessful(grid) {
      grid.setDateFormat("%Y-%m", "%Y%m");
    },
    getCompCdCombo() {
      this.$http
        .get(`/api/code/combo`, { params: { groupCd: "COMP_CD" } })
        .then(response => {
          // eslint-disable-next-line
          this.compCds = response.data;
        });

      this.form.compCd = this.$store.state.loginInfo.compCd;
      if (this.$store.state.loginInfo.authorities[0].authority === "ADMIN") {
        //ADMIN일경우 disabled 해제
        document.getElementById("bselect").removeAttribute("disabled");
      }
    },
    goOpen() {
      this.$http
        .post("/api/oilPrice/list", {
          compCd: this.form.compCd,
          baseYm: this.form.acctmonth
        })
        .then(response => {
          this.data = response.data;
        });
    },
    save() {
      
      //그리드 필수입력 체크          
      if(!this.gridRequireCheck([this.$refs.grid])) return;


      //유종 중복 확인
      for (var i = 0; i < this.data.length; i++) {
        for (var j = i + 1; j < this.data.length; j++) {
          
          if (this.data[i].oilKindCd === this.data[j].oilKindCd && this.data[i].baseYm === this.data[j].baseYm) {
            this.$swal({
              type: "error",
              text: "해당 유종이 이미 존재합니다."
            });
            return false;
          }
        }
      }
        this.$http.post("/api/oilPrice/save", this.data).then(response => {
            this.$swal({ type: "success", text: response.data });
            this.goOpen();
            return;
        });
    },
    addRow() {
      
      this.data.push({
        baseYm: this.form.acctmonth,
        oilKindCd: options["OIL_KIND_CD"][0].detailCd,
        oilUpce: "",
        oilEff: "",
        compCd: this.$store.state.loginInfo.compCd
      });
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

        const isNew = row.new
        const baseYm = row.baseYm
        const oilKindCd = row.oilKindCd

        this.data.splice(rowIndex, 1)

        if (!isNew) {
          this.$http.post('/api/oilPrice/delete', {
            baseYm,
            oilKindCd
          }).then(response => {
            // Do nothing!
          })
        }
      }
    },
    saveExcel() {
      var params = {
        fileName : "유류단가 관리"
      };
      this.gridApi.exportDataAsCsv(params);
    }
  },
  created() {
    queryMngItemCd.apply(this, []);
  },
  mounted() {
    this.getCompCdCombo();
    this.goOpen();
  }
};
</script>