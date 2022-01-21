<template>
<div class="inner-box">
  <form @submit.prevent="query">
    <div class="content-name">
      <h2 class="dp-ib">전표 관리(전표번호별)</h2>
      <div class="btn-wrap btn-type1 clearfix">
        <button type="submit" class="btn-size btn-blue fl_left">
          <span class="btn-icon"><i class="fas fa-pen-alt"></i></span> 조회
        </button>
      </div>
    </div>

    <!-- Search -->
    <div class="search-form">
      <div class="form-group" style="width: 40%;">
        <label class="control-label">회계일자</label>
        <div class="form-input">
          <div class="datepicker w-type-ymd02">
            <dhx-calendar class="input ddate sDate" v-model="params.postDtFrom" required="required" />
          </div>
          <span class="wave"> ~ </span>
          <div class="datepicker w-type-ymd02">
            <dhx-calendar class="input ddate sDate" v-model="params.postDtTo" required="required" />
          </div>
        </div>
      </div>
      <div class="form-group" style="width: 35%;">
        <label class="control-label">전표유형</label>
        <div class="form-input">
          <select class="input" v-model="params.slipTypeCd">
            <option v-for="{ key, value } in options['SLIP_TYPE_CD']" :key="key" :value="key" v-text="value" />
          </select>
        </div>
      </div>
      <div class="form-group" style="width: 25%;">
        <label class="control-label">전표상태</label>
        <div class="form-input">
          <select class="input" v-model="params.slipStatCd">
            <option v-for="{ detailCd, detailNm } in options['SLIP_STAT_CD']" :key="detailCd" :value="detailCd" v-text="detailNm" />
          </select>
        </div>
      </div>
      <search-cctr title="작성부서" v-model="params" :options="{ type: '02', cctrCd: 'wrtDeptCd', cctrNm: 'wrtDeptNm', authorize: true }" style="width: 40%;" />
      <search-emp title="작성자" v-model="params" :options="{ type: '02', empNo: 'wrtId', empNm: 'wrtNm', dutNm: 'wrtDutNm', deptNm: 'wrtCctrNm' }" style="width: 35%;" />
      <div class="form-group" style="width: 25%;">
        <label class="control-label">신청번호</label>
        <div class="form-input">
          <input type="text" class="input" v-model="params.grSlipNo" />
        </div>
      </div>
      <div class="form-group" style="width: 40%;">
        <label class="control-label">거래처</label>
        <div class="form-input">
          <input type="text" class="input Rt-M" v-model="params.evdCustNm" />
        </div>
      </div>
      <div class="form-group" style="width: 35%;">
        <label class="control-label">지급처</label>
        <div class="form-input">
          <input type="text" class="input Rt-M" v-model="params.payCustNm" />
        </div>
      </div>
      <div class="form-group" style="width : 25%;">
        <label class="control-label">전표번호</label>
        <div class="form-input">
          <input type="text" class="input" v-model="params.eaSlipNo" />
        </div>
      </div>
    </div>
    <!-- //Search -->
  </form>

  <!-- 데이터 영역 -->
  <div class="table-area mt20">
    <div class="table-b">
      <div class="table-header">
        <div class="table-name">
          <h3 class="ico_table_name">전표내역</h3>
        </div>
        <div class="btn-wrap btn-type1 clearfix">
          <button class="btn-size btn-excel" @click="toExcel">엑셀 저장</button>
        </div>
      </div>
      <!-- Grid -->
      <dhx-grid ref="grid" v-model="data" :config="config" style="margin-bottom: 40px;" @constructGridSuccessful="constructGridSuccessful_master" />
      <!-- //Grid -->
    </div>
  </div>
  <!-- //데이터 영역 -->
</div>
</template>

<script>
/**
 * 공통 라이브러리 Import
 */
import _ from 'lodash'
import moment from 'moment'
import {
  url as _url
} from '@/libs/join'
import assert from '@/libs/assert'

// mixins
import mixin from '@/mixin/common'

/**
 * 모달창
 */
import Emp from '@/components/Emp_new.vue'
import Cctr from '@/components/Cctr_new.vue'
import SlipModal from '@/components/SlipModal.vue'
import SlipApprovalPop from '@/components/SlipApprovalPop.vue'
import ErpItfErrModal from '@/components/ErpItfErrModal.vue'

import SlipDetailModal from '@/components/SlipDetailModal.vue'
import SlipPayDetailModal from '@/components/SlipPayDetailModal.vue'
import SlipEtcDetailModal from '@/components/SlipEtcDetailModal.vue'
import GlDetailModal from '@/components/GlDetailModal.vue'
import PayrollSlipModal from '@/components/PayrollSlipModal.vue'

/**
 * 사용되는 공통 컴포넌트 Import
 */
import DhxCalendar from '@/components/DhxCalendar.vue'
import DhxGrid from '@/components/DhxGrid.vue'

/**
 * 전표 관리 조회 - 초기 파라미터 값
 */
const defaultParams = {
  postDtFrom: moment().subtract(1, 'months').startOf('month').format('YYYYMMDD'),
  postDtTo: moment().format('YYYYMMDD'),
  evdDtFrom: moment().subtract(1, 'months').startOf('month').format('YYYYMMDD'),
  evdDtTo: moment().format('YYYYMMDD'),
  wrtDeptCd: undefined,
  wrtDeptNm: undefined,
  eaSlipNo: undefined,
  slipTypeCd: undefined,
  payCustNm: undefined,
  wrtId: undefined,
  wrtNm: undefined,
  wrtDutNm: undefined,
  wrtCctrNm: undefined,
  erpSlipNo: undefined,
  slipStatCd: undefined,
  evdCustNm: undefined,
  acctFlag: 'Y'
}

export default {
  components: {
    DhxCalendar,
    DhxGrid
  },
  mixins: [mixin],
  data() {
    return {
      params: {},
      options: {
        'SLIP_TYPE_CD': [],
        'SLIP_STAT_CD': []
      },
      data: [],
      data_slave: [],
      apprRsn: undefined
    }
  },
  computed: {
    config() {
      let cfg = {
        columns: [
          {id: 'no', type: 'cntr', align: 'center', sort: 'na', value: 'No.', width: 35},
          {id: 'eaSlipNo', type: 'ro', align: 'center', sort: 'na', value: '전표번호', width: 120},
          {id: 'grSlipNo', type: 'ro', align: 'center', sort: 'na', value: '신청번호', width: 120},
          {id: 'slipStatNm', type: 'ro', align: 'center', sort: 'na', value: '전표상태', width: 70},
          {id: 'slipTypeNm', type: 'ro', align: 'left', sort: 'na', value: '전표유형', width: 130},
          {id: 'postDt', type: 'ro', align: 'center', sort: 'na', value: '회계일자', width: 90},
          {id: 'curCd', type: 'ron', align: 'center', sort: 'na', value: '통화', width: 70},
          {id: 'supAmt', type: 'ron', align: 'right', sort: 'na', value: '공급가', width: 120},
          {id: 'vatAmt', type: 'ron', align: 'right', sort: 'na', value: '부가세액', width: 100},
          {id: 'totAmt', type: 'ron', align: 'right', sort: 'na', value: '총금액', width: 120},
          {id: 'evdCustCd', type: 'ro', align: 'center', sort: 'na', value: '거래처코드', width: 80, hidden: true},
          {id: 'evdCustNm', type: 'ro', align: 'left', sort: 'na', value: '거래처명', width: 150},
          {id: 'payCustCd', type: 'ro', align: 'center', sort: 'na', value: '지급처코드', width: 80, hidden: true},
          {id: 'payCustNm', type: 'ro', align: 'left', sort: 'na', value: '지급처명', width: 150},
          {id: 'wrtDeptNm', type: 'ro', align: 'center', sort: 'na', value: '작성부서명', width: 100},
          {id: 'wrtNm', type: 'ro', align: 'center', sort: 'na', value: '작성자', width: 60},
          {id: 'hdSgtxt', type: 'ro', align: 'left', sort: 'na', value: '전표내용', width: 200},
          {id: 'slipStatCd', type: 'ro', align: 'center', sort: 'na', value: '', hidden: true},
          {id: 'slipTypeCd', type: 'ro', align: 'center', sort: 'na', value: '', hidden: true},
          {id: 'erpStatus', type: 'ro', align: 'left', sort: 'na', value: 'ERP전송상태', width: 100},
          {id: 'errMsg', type: 'ro', align: 'left', sort: 'na', value: '상태내용', width: 220},
          {id: 'trsDt', type: 'ro', align: 'center', sort: 'na', value: '전송일시', width: 160},
        ],
        height: 520,
        autoWidth: false,
        events: {
          // onRowSelect(...args) {},
          onRowDblClicked(...args) {
            let row = args[3] || args[2]
            switch(row.slipTypeCd) {
              case 'E1': case 'E2': case 'E3': case 'E4': case 'E5':
                this.$modal.open({
                  component: SlipModal,
                  props: {
                    eaSlipNo: row.grSlipNo,
                    grSlipNo: row.grSlipNo,
                    value: row
                  },
                  parent: this,
                  width: 1200
                })
                break
              case 'E11':
                this.$modal.open({
                  component: SlipPayDetailModal,
                  props: {
                    grSlipNo: params.data.grSlipNo,
                    slipTypeCd: params.data.slipTypeCd,
                    title: '자금지급전표',
                    value: params.data //2020.05.21 재경검인, 재경반려 추가를 위한 선택한 row 데이터 전달
                  },
                  parent: this,
                  width: 1200,
                })
                break
              case 'E12':
                this.$modal.open({
                  component: SlipDetailModal,
                  props: {
                    grSlipNo: params.data.grSlipNo,
                    slipTypeCd: params.data.slipTypeCd,
                    title: '구매전표',
                    value: params.data //2020.05.21 재경검인, 재경반려 추가를 위한 선택한 row 데이터 전달,
                  },
                  parent: this,
                  width: 1200
                })
                break
              case 'E13':
                this.$modal.open({
                  component: SlipDetailModal,
                  props: {
                    grSlipNo: params.data.grSlipNo,
                    slipTypeCd: params.data.slipTypeCd,
                    title: '공사비전표',
                    value: params.data //2020.05.21 재경검인, 재경반려 추가를 위한 선택한 row 데이터 전달,
                  },
                  parent: this,
                  width: 1200
                })
                break
              case 'E14':
                this.$modal.open({
                  component: GlDetailModal,
                  props: {
                    grSlipNo: params.data.grSlipNo,
                    slipTypeCd: params.data.slipTypeCd,
                    title: '기타전표',
                    value: params.data //2020.05.21 재경검인, 재경반려 추가를 위한 선택한 row 데이터 전달
                  },
                  parent: this,
                  width: 1200
                })
                break
              default :
                break
            }
            
          }
        },
        beforeRefreshData(grid, data) {
          _.forEach(data, (x, i) => {
            x.itemSeq = i + 1
          })
        }
      }
      if (this.params.slipTypeCd === 'E1') {
        cfg.columns = cfg.columns.concat([{
          id: 'merchNm',
          value: '가맹점명'
        }, {
          id: 'merchAddr',
          value: '가맹점주소',
          align: 'left',
          width: 200
        }, {
          id: 'mccName',
          value: '업종명'
        }, {
          id: 'apprDate',
          value: '승인일자',
          component: {
            props: ['index', 'value', 'field'],
            template: `<span>{{ format(value[field]) }}</span>`,
            methods: {
              format(value) {
                if (value !== undefined && String(value || '').match(/^\d{8}/g)) {
                  return value.replace(/(\d{4})(\d{2})(\d{2})/g, '$1-$2-$3')
                } else {
                  return ''
                }
              }
            }
          }
        }, {
          id: 'apprTime',
          value: '승인시각',
          component: {
            props: ['index', 'value', 'field'],
            template: `<span>{{ format(value[field]) }}</span>`,
            methods: {
              format(value) {
                if (value !== undefined && String(value || '').match(/^\d{6}/g)) {
                  return value.replace(/(\d{2})(\d{2})(\d{2})/g, '$1:$2:$3')
                } else {
                  return ''
                }
              }
            }
          }
        }])
      }
      return cfg
    }
  },
  methods: {
    constructGridSuccessful_master(grid) {
      grid.setColumnHidden(10,true)
      grid.setColumnHidden(12,true)
      grid.setColumnHidden(17,true)
      grid.setColumnHidden(18,true)
      grid.setNumberFormat('0,000', 7, '.', ',')
      grid.setNumberFormat('0,000', 8, '.', ',')
      grid.setNumberFormat('0,000', 9, '.', ',')
      // grid.setNumberFormat('0,000', 11, '.', ',')
    },
    reversalButtonClickEvent() {
      try {
        let data = this.data.filter(x => x.chk)

        assert.apply(this, [data, '역분개할 전표를 선택해주세요.'])

        this.$swal({
          type: 'warning',
          text: 'ERP와 연계되지 않았습니다.'
        })
      } catch (e) {
        this.$swal({
          type: 'error',
          text: e
        })
      }
    },
    query() {
      this.$store.commit('loading')
      return this.$http.post('/api/slip/historyDetail', this.params)
        .then(response => {
          this.apprRsn = undefined
          this.data = response.data.map(x => {
            x.chk = false
            return x
          })
          return response
        })
        .finally(() => {
          this.$store.commit('finish')
        })
    },
    toExcel() {
      this.$refs.grid.toExcel()
    }
  },
  created() {
    // if(!defaultParams.wrtDeptCd) {
    //   defaultParams.wrtDeptCd = this.$store.state.loginInfo.loginDeptCd
    //   defaultParams.wrtDeptNm = this.$store.state.loginInfo.loginDeptNm
    // }
    this.params = _.clone(defaultParams)
    /**
     * Query SLIP_TYPE_CD
     */
    this.$http.get('/api/code/combo', {
      params: {
        groupCd: 'SLIP_TYPE_CD'
      }
    }).then(response => {
      this.options['SLIP_TYPE_CD'] = response.data
      this.options['SLIP_TYPE_CD'].unshift({
        key: undefined,
        value: '==전체=='
      })
    })

    /**
     * Query SLIP_STAT_CD
     */
    this.$http.get('/api/code/detail', {
      params: {
        groupCd: 'SLIP_STAT_CD'
      }
    }).then(response => {
      this.options['SLIP_STAT_CD'] = response.data.filter(x => x.remark1 === 'Y' && x.detailCd >= '50')
      this.options['SLIP_STAT_CD'].unshift({
        detailCd: undefined,
        detailNm: '==전체=='
      })
    })

    this.query()
  }
}
</script>

<style scoped>
.desc-content:after {
  clear: both;
  content: '';
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

.desc-content .item.desc-center .desc-item {
  padding-left: 120px;
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
  font-family: 'NotoM';
  color: #222;
  font-size: 15px;
}

.desc-content .item.desc-left .desc-item {
  padding-left: 90px;
}

.desc-content .item.desc-left .desc-item .desc:after {
  clear: both;
  content: '';
  display: block;
}

.desc-content .item.desc-left .desc-item .desc .datepicker {
  float: left;
}

.desc-content .item.desc-left .desc-item .desc span.wave {
  float: left;
  padding: 0 6px;
}

.desc-content .desc-item .td-s-thumb.search-area:after {
  clear: both;
  content: '';
  display: block;
}

.desc-content .desc-item .td-s-thumb.search-area input,
.desc-content .desc-item .td-s-thumb.search-area .ip-box {
  float: left;
}

.desc-content .item.desc-left .desc-item .desc.select select {
  width: 70%;
}

.desc-content .item.desc-left {
  width: 40%;
}

.desc-content .item.desc-center {
  width: 40%;
  padding-right: 40px;
}

.desc-content .item.desc-right {
  width: 20%;
}

.desc-content .item .desc-item .select select,
.desc-content .item .desc-item .input-box input {
  width: 70%;
}

.desc-content .item.desc-right .desc-item .select select,
.desc-content .item.desc-right .desc-item .input-box input {
  width: 100%;
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
  width: 48%;
}

.search-border .td-s-thumb.search-area>input,
.search-border .td-s-thumb.search-area>.ip-box .search-border .td-s-thumb.search-area>button {
  float: left;
}

.search-border .td-s-thumb.search-area .ip-box.ip-box-w02 {
  width: 65%;
  margin-left: 6px;
}

.remove_text {
  margin-left: 0;
}

.contents div.gridbox_material.gridbox .xhdr {
  border-bottom: 1px solid #dfdfdf;
}

@media (max-width:1580px) {
  .search-border .td-s-thumb.search-area .ip-box.ip-box-w02 {
    width: 50%;
  }
}

textarea {
  height: 80px;
}

.search-form .form-group{margin-bottom:8px}
</style>
