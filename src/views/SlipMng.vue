<template>
<div class="inner-box">
  <form @submit.prevent="query1">
    <div class="content-name">
      <h2 class="dp-ib">전표 관리</h2>
      <div class="btn-wrap btn-type1 clearfix">
        <button type="button" class="btn-size btn-gray fl_left" @click="approvalingButtonClickEvent(data)">
          <span class="btn-icon"><i class="fas fa-thumbs-up"></i></span> 재경검인중
        </button>
        <button type="button" class="btn-size btn-gray fl_left" @click="approvalButtonClickEvent(data)">
          <span class="btn-icon"><i class="fas fa-thumbs-up"></i></span> 재경검인
        </button>
        <button type="button" class="btn-size btn-gray fl_left" @click="rejectButtonClickEvent(data)">
          <span class="btn-icon"><i class="fas fa-thumbs-down"></i></span> 재경반려
        </button>
        <button type="button" class="btn-size btn-orange fl_left" @click="reversalButtonClickEvent()">
          <span class="btn-icon"><i class="fas fa-undo"></i></span> 역분개
        </button>
        <button type="submit" class="btn-size btn-blue fl_left">
          <span class="btn-icon"><i class="fas fa-pen-alt"></i></span> 조회
        </button>
      </div>
    </div>

    <!-- Search -->
    <div class="search-form">
      <div class="form-group" style="width: 40%;">
        <label class="control-label">신청일자</label>
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
      <!-- <div class="form-group" style="width: 40%;">
        <label class="control-label">증빙일자</label>
        <div class="form-input">
          <div class="datepicker w-type-ymd02">
            <dhx-calendar class="input ddate sDate" v-model="params.evdDtFrom" />
          </div>
          <span class="wave"> ~ </span>
          <div class="datepicker w-type-ymd02">
            <dhx-calendar class="input ddate sDate" v-model="params.evdDtTo" />
          </div>
        </div>
      </div> -->
      <div class="form-group" style="width: 40%;">
        <label class="control-label">거래처</label>
        <div class="form-input">
          <input type="text" class="input Rt-M" v-model="params.evdCustNm" />
        </div>
      </div>
      <div class="form-group" style="width: 30%;">
        <label class="control-label">지급처</label>
        <div class="form-input">
          <input type="text" class="input Rt-M" v-model="params.payCustNm" />
        </div>
      </div>
      
      
      <!-- <div class="form-group" style="width: 30%;">
        <label class="control-label">ERP 신청번호</label>
        <div class="form-input">
          <input type="text" class="input Rt-M" v-model="params.erpSlipNo" />
        </div>
      </div> -->
    </div>
    <!-- //Search -->
  </form>
  <!-- 팝업으로 이동할 아이 -->
  <!-- <div class="table-area mt20">
    <div class="table-b">
      <div class="table-header">
        <div class="table-name">
          <h3 class="ico_table_name">결재의견</h3>
        </div>
      </div>
      <textarea v-model="apprRsn"></textarea>
    </div>
  </div> -->

  <!-- 데이터 영역 -->
  <div class="table-area mt20">
    <div class="table-b">
      <div class="table-header">
        <div class="table-name">
          <h3 class="ico_table_name">전표내역</h3>
        </div>
        <div class="btn-wrap btn-type1 clearfix">
          <div style="float:left; padding-top:10px; margin-right:10px;"> 총 금액 : {{$numeral(totalAmt).format('0,0')}} </div>
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
import query from '@/mixin/query' //2020.05.26 재경검인, 재경반려 method

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
  mixins: [mixin, query],
  data() {
    return {
      params: {},
      options: {
        'SLIP_TYPE_CD': [],
        'SLIP_STAT_CD': []
      },
      data: [],
      data_slave: [],
      apprRsn: undefined,
      totalAmt:0, //2020.06.11 전체금액 변수
    }
  },
  computed: {
    config() {
      let cfg = {
        columns: [
          {id: 'chk', value: '#', width: 40, type: 'ch' },
          {id: 'no', type: 'cntr', align: 'center', sort: 'na', value: 'No.', width: 35},
          {id: 'grSlipNo', type: 'ro', align: 'center', sort: 'na', value: '신청번호', width: 120},
          {id: 'slipStatNm', type: 'ro', align: 'center', sort: 'na', value: '전표상태', width: 70},
          {id: 'slipTypeNm', type: 'ro', align: 'center', sort: 'na', value: '전표유형', width: 100},
          {id: 'postDt', type: 'ro', align: 'center', sort: 'na', value: '신청일자', width: 90},
          // {id: 'evdDt', type: 'ro', align: 'center', sort: 'na', value: '증빙일자', width: 90},
          {id: 'curCd', type: 'ron', align: 'right', sort: 'na', value: '통화', width: 90},
          {id: 'supAmt', type: 'ron', align: 'right', sort: 'na', value: '공급가', width: 120},
          {id: 'vatAmt', type: 'ron', align: 'right', sort: 'na', value: '부가세액', width: 100},
          {id: 'totAmt', type: 'ron', align: 'right', sort: 'na', value: '총금액', width: 120},
          {id: 'evdCustCd', type: 'ro', align: 'center', sort: 'na', value: '거래처코드', width: 80, hidden: true},
          {id: 'evdCustNm', type: 'ro', align: 'center', sort: 'na', value: '거래처명', width: 100},
          {id: 'payCustCd', type: 'ro', align: 'center', sort: 'na', value: '지급처코드', width: 80, hidden: true},
          {id: 'payCustNm', type: 'ro', align: 'center', sort: 'na', value: '지급처명', width: 100},
          {id: 'wrtDeptNm', type: 'ro', align: 'center', sort: 'na', value: '작성부서명', width: 100},
          {id: 'wrtNm', type: 'ro', align: 'center', sort: 'na', value: '작성자', width: 60},
          {id: 'hdSgtxt', type: 'ro', align: 'center', sort: 'na', value: '전표내용', width: 200},
          {id: 'slipStatCd', type: 'ro', align: 'center', sort: 'na', value: '', hidden: true},
          {id: 'slipTypeCd', type: 'ro', align: 'center', sort: 'na', value: '', hidden: true},
          {id: 'erpStatus', type: 'ro', align: 'left', sort: 'na', value: 'ERP전송상태', width: 80,
            component: {
                props: ['index', 'value', 'field'],
                template: `<div style="text-decoration: underline; text-underline-position: under; color:blue;" @click="popDetails">{{erpStatus}}</div>`,
                data() {
                    return {
                        erpStatus: ''
                    }
                },
                created() {
                    const value = this.$parent.value[this.index]
                    this.erpStatus = value.erpStatus || ''
                },
                methods: {
                    popDetails() {
                      const value = this.$parent.value[this.index]
                      this.$modal.open({
                          component: ErpItfErrModal,
                          parent: this,
                          props: {
                              grSlipNo: value.grSlipNo,
                          },
                          width: 600
                      })
                    }
                }
            }
        },
        {id: 'reCreate', type: 'ro', align: 'center', sort: 'na', value: 'ERP재전송', width: 80,
            component: {
                props: ['index', 'value', 'field'],
                template: `<button v-if="reCreate === '1'" type="button" @click="reSend" class="btn-type1 btn-yellow" style="width:100%; height:100%; border-radius: 4px; border: 2px solid #f44336; color:#f44336">재전송</button>`,
                data() {
                    return {
                        reCreate: ''
                    }
                },
                created() {
                  const value = this.$parent.value[this.index]
                  this.reCreate = value.reCreate || ''
                },
                methods: {
                    reSend() {
                      const value = this.$parent.value[this.index]
                      this.$store.commit('loading')
                      this.$http.get(`/api/slip/history/erpReTrans/${value.grSlipNo}`)
                      .then(response => {
                          if (response.data) {
                              this.$swal({type: 'success', text: '재전송 성공하였습니다.'});

                              this.$parent.$parent.query1()
                          }
                      }).finally(() => {
                          this.$store.commit('finish')
                      });
                        
                    }
                }
            }
        },
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

      //2020.06.11 체크된 값 합산
      let vm = this
      grid.attachEvent("onCheckbox", function(rId,cInd,state){
          
          let check = grid.cells(rId,0).getValue();
          if(check == '1'){
              let a = grid.cells(rId, 9).getValue();
              a = Number(a);
              vm.totalAmt = vm.totalAmt + a;
          }else if(check =='0'){
              let b = grid.cells(rId, 9).getValue();
              vm.totalAmt = vm.totalAmt - b;
          }
      });
    },
    /* 2020.05.26변경전 재경검인, 재경반려 method 원본
    approvalButtonClickEvent() {
      
      try {
        let data = this.data.filter(x => x.chk)

        let submitted = data.filter(x => x.slipStatCd === '60' || x.slipStatCd === '70')

        assert.apply(this, [data.length > 0, '재경검인할 전표를 선택해주세요.'])
        assert.apply(this, [submitted.length === 0, '재경반려 또는 재경검인된 전표는 다시 재경검인할 수 없습니다.'])
        // assert.apply(this, [this.apprRsn, '결재의견을 작성하셔야 재경승인을 할 수 있습니다.'])
        const vm = this
      
        this.$modal.open({
          component: SlipApprovalPop,
          parent: this,
          props: {
            data: data,
            flag: true
          },
          width: 1200,
          events: {
            close(object) {
              vm.query()
            }
          }
        })
        // this.$swal({
        //   type: 'question',
        //   text: '승인 후 취소 되지 않습니다. 승인 작업을 계속하시겠습니까?',
        //   showCancelButton: true,
        //   confirmButtonText: 'Yes'
        // }).then(response => {
        //   if (response.value) {
        //     this.$store.commit('loading')
        //     this.$http.post('/api/slip/mnt/acctAccept', data, {
        //       params: {
        //         apprRsn: this.apprRsn
        //       }
        //     }).then(response => {
        //       this.$swal({
        //         type: 'success',
        //         text: '승인되었습니다.'
        //       }).then(this.query)
        //       return response
        //     }).catch(response => {
        //       // TODO::Error Handling
        //       return response
        //     }).finally(() => {
        //       this.$store.commit('finish')
        //     })
        //   }
        // })
      } catch (e) {
        this.$swal({
          type: 'error',
          text: e
        })
      }
    },
    rejectButtonClickEvent() {
      try {
        let data = this.data.filter(x => x.chk)
        let submitted = data.filter(x => x.slipStatCd === '60' || x.slipStatCd === '70')

        assert.apply(this, [data.length > 0, '재경반려할 전표를 선택해주세요.'])
        assert.apply(this, [submitted.length === 0, '재경반려 또는 재경검인된 전표는 다시 재경반려할 수 없습니다.'])
        // assert.apply(this, [this.apprRsn, '결재의견을 작성하셔야 재경반려를 할 수 있습니다.'])
        const vm = this
        this.$modal.open({
          component: SlipApprovalPop,
          parent: this,
          props: {
            data: data,
            flag: false
          },
          width: 1200,
          events: {
            close(object) {
              vm.query()
            }
          }
        })
        // this.$swal({
        //   type: 'question',
        //   text: '반려 후 취소 되지 않습니다. 반려 작업을 계속하시겠습니까?',
        //   showCancelButton: true,
        //   confirmButtonText: 'Yes'
        // }).then(response => {
        //   if (response.value) {
        //     this.$store.commit('loading')
        //     this.$http.post('/api/slip/mnt/acctReject', data, {
        //       params: {
        //         apprRsn: this.apprRsn
        //       }
        //     }).then(response => {
        //       this.$swal({
        //         type: 'success',
        //         text: '반려되었습니다.'
        //       }).then(this.query)
        //       return response
        //     }).catch(response => {
        //       // TODO::Error Handling
        //       return response
        //     }).finally(() => {
        //       this.$store.commit('finish')
        //     })
        //   }
        // })
      } catch (e) {
        this.$swal({
          type: 'error',
          text: e
        })
      }
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
    */
    query1() {
      this.$store.commit('loading')
      return this.$http.post('/api/slip/history', this.params)
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

    this.query1()
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
