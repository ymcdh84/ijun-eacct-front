<template>
  <div class="inner-box">
    <form @submit.prevent="query">
      <!-- Header -->
      <div class="content-name">
        <h2 class="dp-ib">부서별 예산/실적 내역</h2>
        <div class="btn-wrap btn-type1 clearfix">
          <button type="submit" class="btn-size btn-gray fl_left">
            <span class="btn-icon"><i class="fas fa-search"></i></span>
            조회
          </button>
        </div>
      </div>
      <!-- //Header -->

      <!-- 검색 Form -->
      <div class="search-form">
        <div class="form-group">
          <label class="control-label">조회연월</label>
          <div class="form-input">
            <div class="datepicker w-type-ymd02">
              <dhx-calendar class="input ddate sDate" v-model="params.budYm" :config="{ format: 'YYYY-MM', outputFormat: 'YYYYMM', dateFormat: '%Y-%m' }" />
            </div>
          </div>
        </div>
        <div class="form-group">
          <label class="control-label">부서</label>
          <div class="form-input">
            <input class="input input-bg mr5 Rt-M rs-mt2" type="text" v-model="params.budCctrCd" style="width:60px;" disabled="disabled" />
            <div class="ip-box ip-box-w02 rs-mt2" v-if="this.$store.state.loginInfo.authorities[0].roleCd !== 'ADMIN'&&this.$store.state.loginInfo.authorities[0].roleCd !== 'P_USER'">
              <input type="text" class="input" v-model="params.budCctrNm" disabled = "disabled"/>
            </div>
            <div class="ip-box ip-box-w02 rs-mt2" v-else>
              <input type="text" class="input" v-model="params.budCctrNm" @keypress.enter="cctrPop(params.budCctrNm)" @input="initCctr"/>
              <button class="icon is-right" type="button" @click="cctrPop(params.budCctrNm)" style="position:absolute;top:0;right:0"><i class="fas fa-search"></i></button>
            </div>
          </div>
        </div>
      </div>
      <!-- //검색 Form -->
    </form>

    <div class="table-area mt20">
      <div class="table-b">
        <div class="table-header">
          <div class="table-name">
            <h3 class="ico_table_name">예산/실적 내역</h3>
          </div>
          <div class="btn-wrap btn-type1 clearfix" @click="toExcel()">
            <button class="btn-size btn-excel">엑셀 저장</button>
          </div>
        </div>

        <ag-grid-vue ref="grid" style="width: 100%; height: 450px;" class="ag-theme-alpine"
                     :columnDefs="columnDefs"
                     :rowData="history"
                     :gridOptions="gridOptions1"
                     :defaultColDef="defaultColDef"
        />
      </div>
    </div>
    <div class="table-area mt20">
      <div class="table-b">
        <div class="table-header">
          <div class="table-name">
            <h3 class="ico_table_name">부서별 실적 총액</h3>
          </div>
          <div class="btn-wrap btn-type1 clearfix" @click="toExcel2()">
            <button class="btn-size btn-excel">엑셀 저장</button>
          </div>
        </div>
        <ag-grid-vue ref="grid" style="width: 100%; height: 450px;" class="ag-theme-alpine"
                     :columnDefs="columnDefs2"
                     :rowData="summary"
                     :gridOptions="gridOptions2"
                     :defaultColDef="defaultColDef"
                     @cell-clicked="onCellClicked"
        />
      </div>
    </div>
  </div>
</template>

<script>
/**
 * EA-03-05
 * 부서별 예산/실적 내역
 */

import assert from '@/libs/assert'
import mixin from '@/mixin';
import mixinSlip from '@/mixin/slip';
import DhxCalendar from '@/components/DhxCalendar.vue'
import DhxGrid from '@/components/DhxGrid.vue'
import { AgGridVue } from 'ag-grid-vue'
import SearchErpCctr from "@/components/SearchErpCctr.vue";
import Cctr from "@/components/ErpCctr_Ag.vue";

export default {
  name: 'DeptbdgLst',
  mixins: [mixin, mixinSlip],
  components: {
    DhxCalendar,
    DhxGrid,
    AgGridVue,
    SearchErpCctr
  },
  data() {
    return {
      data: [],
      history:[],
      summary:[],
      columnDefs : [],
      columnDefs2 : [],
      gridOptions1 : {},
      gridOptions2 : {},
      defaultColDef: {},
      params: {
        budYm: this.$moment().format('YYYYMM'),
        budCctrCd: undefined,
        budCctrNm: undefined,
        budAcctCd: undefined,
        budAcctNm: undefined
      },
      roleCd:'',
    }
  },
  methods: {
    makeColDef(){
      const that = this;
      this.columnDefs = [
        {
          headerName: '',
          children: [
            {
              headerName: 'No.',
              width: 80,
              valueFormatter: (params) => {
                return params.node.rowIndex+1;
              }
            },
            {
              headerName: '부서',
              field:'budCctrNm',
              width: 160,
            },
            {
              headerName: '일자',
              field:'postDt',
              width: 160,
            },
            {
              headerName: '내용(목적)',
              field:'lnSgtxt',
              width: 420,
            },
            {
              headerName: '지출처',
              field:'evdCustNm',
              width: 160,
            },
          ]
        },{
          headerName: '한도적용',
          children: [
            { headerName: '접대비',
              field: 'ctrlAmt1',
              cellStyle:{textAlign: 'right'},
              width: 160,
              valueFormatter: (params) => {
                return that.getNumberFormat(params.value);
              }},
            { headerName: '식대비',
              field: 'ctrlAmt2',
              cellStyle:{textAlign: 'right'},
              width: 160,
              valueFormatter: (params) => {
                return that.getNumberFormat(params.value);
              }},
          ]
        },
        {
          headerName: '한도제외',
          children: [
            { headerName: '식대비',
              field: 'nctrlAmt',
              cellStyle:{textAlign: 'right'},
              width: 160,
              valueFormatter: (params) => {
                return that.getNumberFormat(params.value);
              }},
          ]
        },
        {
          headerName: '사용인',
          field:'crdPssrNm',
          width: 160,
        },
      ]
      this.columnDefs2 = [
        {
          headerName:'',
          children:[
            {
              headerName: 'No.',
              width: 80,
              valueFormatter: (params) => {
                return params.node.rowIndex+1;
              }
            },
            {
              headerName: '사용부서',
              field:'budCctrNm',
              width: 105,
            },
            {
              headerName: '전월 잔액',
              field:'prevRemainAmt',
              cellStyle:{textAlign: 'right'},
              width: 180,
              valueFormatter: (params) => {
                return that.getNumberFormat(params.value);
              }
            },
            {
              headerName: '월한도액',
              field:'monthAmt',
              cellStyle:{textAlign: 'right'},
              width: 180,
              valueFormatter: (params) => {
                return that.getNumberFormat(params.value);
              }
            },
            {
              headerName: '전월 이월액',
              field:'transPrevMonthAmt',
              cellStyle:{textAlign: 'right'},
              width: 180,
              valueFormatter: (params) => {
                return that.getNumberFormat(params.value);
              }
            },
            {
              headerName: '당월 한도액',
              field:'currentLimitAmt',
              cellStyle:{textAlign: 'right'},
              width: 180,
              valueFormatter: (params) => {
                return that.getNumberFormat(params.value);
              }
            },
          ]
        },
        {
          headerName:'전용액',
          children:[
            {
              headerName: '차월',
              field:'transNextMonthAmt',
              cellStyle:{textAlign: 'right'},
              width: 180,
              valueFormatter: (params) => {
                return that.getNumberFormat(params.value);
              }
            },
            {
              headerName: '타부서',
              field:'transDeptAmt',
              cellStyle:{textAlign: 'right'},
              width: 180,
              valueFormatter: (params) => {
                return that.getNumberFormat(params.value);
              }
            },
          ]
        },
        {
          headerName:'당월 사용액',
          children:[
            {
              headerName: '승인금액',
              field:'currentUsedAmt',
              cellStyle:{textAlign: 'right'},
              width: 180,
              valueFormatter: (params) => {
                return that.getNumberFormat(params.value);
              }
            },
            {
              headerName: '진행중인금액',
              field:'currentWaitAmt',
              cellStyle:{textAlign: 'right'},
              width: 180,
              valueFormatter: (params) => {
                return that.getNumberFormat(params.value);
              }
            },
          ]
        },
        {
          headerName: '당월잔액',
          field:'currentEnableAmt',
          cellStyle:{textAlign: 'right'},
          width: 180,
          valueFormatter: (params) => {
            return that.getNumberFormat(params.value);
          }
        },
      ]
    },
    query() {
      try {
        assert.apply(this, [this.params.budYm, '조회연월을 입력해주세요.'])
        // assert.apply(this, [this.params.budCctrCd, '부서를 입력해주세요.'])

        this.$store.commit('loading')
        return this.$http.post('/api/budget/manage/list', this.params)
            .then(response => {
              this.history = response.data.history
              this.summary = response.data.summary
              return response
            })
            .finally(() => {
              this.$store.commit('finish')
            })
      } catch (e) {
        this.$swal({
          type: 'error',
          text: e
        })
      }
    },
    /**
     * Event handlers
     */
    buttonClickEvent_Search() {
      this.query()
    },
    toExcel() {
      var params = {
        fileName : "예산/실적 내역"
      };
      this.gridOptions1.api.exportDataAsCsv(params)
    },
    toExcel2() {
      var params = {
        fileName : "부서별 실적 총액"
      };
      this.gridOptions2.api.exportDataAsCsv(params)
    },
    onGridReady1(){
      this.gridOptions1.api.sizeColumnsToFit();
    },
    onGridReady2(){
      this.gridOptions2.api.sizeColumnsToFit();
    },
    onCellClicked(params){
      var field = params.colDef.field;

      if(field === 'currentWaitAmt'){
        this.$http.post('/api/budget/manage/list/detail',{
          budYm: params.data.budYm,
          budCctrCd: params.data.budCctrCd,
          cellFgCd: 'CW'
        }).then(responese => {
          if(responese){
            this.history = responese.data.history
          }
        })
      }else if(field === 'currentUsedAmt'){
        this.$http.post('/api/budget/manage/list/detail',{
          budYm: params.data.budYm,
          budCctrCd: params.data.budCctrCd,
          cellFgCd: 'CF'
        }).then(responese => {
          if(responese){
            this.history = responese.data.history
          }
        })
      }
    },
    cctrPop(searchStr) {
      if(this.$store.state.loginInfo.authorities[0].roleCd !== 'ADMIN'&&this.$store.state.loginInfo.authorities[0].roleCd !== 'P_USER') return
      let vm = this
      this.$modal.open({
        component: Cctr,
        props: {
          title: this.title,
          searchStr: searchStr
        },
        parent: this,
        events: {
          close(data) {
            vm.params.budCctrCd = data.deptCd
            vm.params.budCctrNm = data.deptNm
          }
        }
      })
    },
    initCctr(force) {
      if (force === true) this.params.budCctrNm = '';
      if (this.params.budCctrNm === '') this.params.budCctrCd = '';
    },
  },
  created() {
    document.title = '예산실적내역 - IJEAS';
    this.makeColDef()
    this.defaultColDef = { resizable: true, filter:true, sortable: true,};
    let login = undefined
    try {
      login = this.$store.state.loginInfo
      this.$store.commit('loading');
      this.$http.get(`/api/emp/${login.loginId}`)
          .then(response => {
            let data = response.data[0];
            this.params.budCctrCd = data.liabilityDeptCode;
            this.params.budCctrNm = data.liabilityDeptName;
          })
          .catch((e) => {
            this.$swal({
              type: 'error',
              text: e
            })
          })
          .finally(() => {
            this.$store.commit('finish')
            this.query()
          })
    } catch (e) {
      login = undefined
    } finally {
      // this.query()
    }
  }
}
</script>

<style lang="scss" scoped>
.table-b {
  :global(table) {
    :global(td) {
      vertical-align: middle !important;
    }
  }
}
.search-form .form-group{margin-bottom:8px !important}
</style>
