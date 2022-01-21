<template>
    <div slot="content">
     <div class="content-name">
         <div class="table-name">
            <h3 class="ico_table_name" style="float:left">일괄비용등록(기숙사등)</h3>
             <div class="btn-wrap btn-type1 clearfix" style="margin-bottom: 10px; float:right;">
                 <button v-if="this.$store.state.loginInfo.loginId === this.thisApprUser || this.deleYn ==='Y'" class="btn-size btn-blue" @click="openApprPopup()"><span class="btn-icon"><i
                         class="fas fa-pen-alt"></i></span> 결재
                 </button>
                 <button v-if="this.$store.state.loginInfo.loginId == draftUserId && docStatus === 'REQ'"
                         class="btn-size btn-yellow" @click="cancel(docMngNo)"><span class="btn-icon"><i class="far fa-file"></i></span> 상신취소
                 </button>
             </div>
        </div>
      </div>

      <div class="table-area">
          <slip-table :slipType="slipTypeId" v-model="value" :status="status" v-if="loaded"/>
        <div class="table-b">
            <div class="content-name">
                <div class="table-name">
                    <h3 class="ico_table_name">상세정보</h3>
                </div>
            </div>
            <div class="grid-wrap">
                <dhx-grid ref="grid2" v-model="slipDetails" :config="config2" @constructGridSuccessful="constructGridSuccessful"/>
            </div>
        </div>
      </div>
      <!-- //테이블 -->
      <!--증빙 정보-->
      <div class="table-area" style="height: 60px;">
          <div class="file has-name" style="width: 1000px;">

              <div class="file" style="margin-right: 10px;">
                  <div class="file-label" @click="openUploadEvidencePopup()">
                      <span class="file-cta">
                        <span class="file-label"> 증빙첨부</span>
                        <span class="icon-bar"><img src="/img/bar.png" alt="" /></span>
                      </span>
                      <span class="file-name">{{ this.$numeral(etaxXmlHd.ufileCnt).format('00') }}<i class="far fa-file-alt"></i></span>
                  </div>
              </div>

              <div class="file" >
                  <div class="file-label" @click="openUploadWingsPopup()">
                      <span class="file-cta">
                        <span class="file-label"> Wings 문서</span>
                        <span class="icon-bar"><img src="/img/bar.png" alt="" /></span>
                      </span>
                      <span class="file-name">{{ this.$numeral(etaxXmlHd.uwingsFileCnt).format('00') }}<i class="far fa-file-alt"></i></span>
                  </div>
              </div>
          </div>
      </div>
      <!--//증빙 정보 -->
    </div>
</template>

<script>
import moment from 'moment'
import mixin from '@/mixin';
import mixinSlip from '@/mixin/slip';
import _ from 'lodash'

import assert from '@/libs/assert'
import DhxCalendar from '@/components/DhxCalendar.vue'
import DhxGrid from '@/components/DhxGrid.vue'
import SlipTable from '@/components/slip/SlipTable.vue'

import ApprActPop from '@/components/ApprActPop.vue'

import EvidAtchPop from '@/components/EvidAtchPop.vue'
import WingsAtchPop from '@/components/WingsAtchPop.vue'


import {
  url as _url
} from '@/libs/join'

//
//'./grid/GridCheckbox.vue'
/**
 * Query options
 */
function queryOption(url, type, params) {
  return new Promise((resolve, reject) => {
    // Validate requirement
    assert(url !== undefined, 'URL is required')
    assert(type !== undefined, 'Type is required')

    if (!url.match(/^\/?api.*/g)) {
      url = _url('api', url)
    }

    this.$store.commit('loading')
    this.$http.get(url, { params })
      .then(response => {
        this.options[type] = response.data
        return resolve(response)
      }).catch(response => {
        return reject(response)
      }).finally(() => {
        this.$store.commit('finish')
      })
  })
}

export default {
  name: 'bulkExpenseQry',
  props: ['eaSlipNo', 'docMngNo'],
  components: {DhxGrid, DhxCalendar, ApprActPop, SlipTable},
  mixins: [ mixin, mixinSlip ],
  data() {
    return {
      options: {
        'EVD_TYPE_CD': [],
        'ACCOUNT': [],
        'LBLT_ACCOUNT': [],
        'PAY_TERM_CD': [],
        'USE_TYPE_CD': [],
        'BP_CD': [],
        'TAX_CD': [],
        'VENT_ACCTS': [],
        'FRGN_NAT_CD': [],
        'FRGN_CUR_CD': [],
      },
      config2:{
          columns: [
            {id: 'itemSeq',value: 'No.',width: 35},
            {id: 'deptNm',align: 'left',value: '부서',width: 80,type: 'ron'}, 
            {id: 'acctCd',align: 'center',value: '계정코드',width: 80}, 
            {id: 'acctNm',align: 'left',value: '계정명',width: 140,type: 'ron'}, 
            {id: 'detailNm', align: 'left', value: '제품', width: 80, type: 'ron'}, 
            {id: 'vatYn',width: 65,value: '부가세포함',type: 'ron',}, 
            {id: 'useAmt', value: '금액', width: 80, type: 'ron', align: 'right', }, 
            {id: 'taxNm', value: '세금코드', width: 80,type: 'ro',align: 'right',}, 
            {id: 'lnSgtxt',value: '적요',width: 400,align: 'left',type: 'ron'},
          ],
          height: 180,
      },
      useDetails: [],
      slipDetails: [],
      slipDetail:[],
      apprDetails:[],
      etaxXmlHd:[],
      value: {
        slipTypeCd: 'E5',
        evdTypeCd: ''
      },
      deleYn: 'N',
      loaded: false,
      results: {},
      deEaSlipNo: '',
      slipStatCd:'',
      thisApprUser: '',
      draftUserId: '',
      status: {
        type: Object,
        required: true,
        default () {
          return {
            new: false,
            loaded: false,
            readonly: true,
            change: false
          }
        }
      },
    }
  },
  methods: {
      getAppr(docMngNo) {
        this.loaded = false

        if (docMngNo != undefined) {
          this.$http.get(`/api/appr/detail/${docMngNo}`)
          .then(response => {
              if (response.data) {
                  this.apprSeq = ''
                  this.thisApprUser = ''

                  this.apprHeader = response.data.apprHeader;
                  this.apprLine = response.data.apprDetails;

                  this.docTypeCd = response.data.apprHeader[0].docTypeCd;
                  this.docStatus = response.data.apprHeader[0].docStatCd;
                  this.draftUserId = response.data.apprHeader[0].draftUserId;
                  this.docTitleNm = response.data.apprHeader[0].docTitleNm;
                  this.apprNo = response.data.apprHeader[0].apprNo;
                  this.grSlipNo = response.data.apprHeader[0].docMngNo;
                  this.docType = 'ERP'
                  this.value.custAccount = [this.value.custBnkCd, this.value.custAcctNo].join('_')

                  _.forEach(this.apprLine, v => {
                      if (v.apprFgCd ==='X') {
                          this.apprSeq = v.apprSeq
                          this.thisApprUser = v.aprverId
                          return false
                      }
                  })

                  this.loaded = true
              }
          })
          .catch(({message}) => {
              console.error(message);
          }).finally(() => {
              this.goSearch();
          })
        }
    },
    constructGridSuccessful(grid) {
        grid.attachHeader(
            [],
        )
    },
    goSearch() {
        this.$store.commit('loading');
        this.$http.get(`api/slip/np/${this.grSlipNo}`
           ).then(response => {
            if (response.data) {
                try{
                  
                  let data_hd = response.data.slip
                  let data_dt = response.data.slipDetails
                  data_hd.evdTypeCd = '40'
                  data_hd.evdCustNm = data_hd.payCustNm
                  data_hd.evdCustCd = data_hd.payCustCd
                  data_hd.lbltAcctCd = data_hd.liabilityAcctCd
                  data_hd.lbltAcctNm = data_hd.liabilityAcctNm
                  data_hd.baseDeptCd = data_hd.wrtDeptCd
                  data_hd.baseDeptNm = data_hd.wrtDeptNm
                  data_hd.empNo = data_hd.wrtId
                  data_hd.empNm = data_hd.wrtNm
                  data_hd.preInvoiceNum = data_hd.advReqSlipNo
                  data_hd.mrAmt = data_hd.advReqSlipAmt
                  // if(!data_hd.payTermCd && data_hd.evdCustCd) {
                  //   this.$http.get(`/api/vendor/E5/${data_hd.evdCustCd}`)
                  //   .then((result) => {
                  //     data_hd.payTermCd = result.data[0].termsId
                  //   })
                  // }

                  data_dt.forEach(x => {
                    x.itemSeq = x.itemSeq
                    x.dcCd = 'D'
                    x.dcNm = '차변'
                    x.lnTypeCd = 'ITEM'
                    x.deptCd = x.cctrCd
                    x.deptNm = x.cctrNm
                    //비용항목계정명 셋팅해야함.
                    x.detailCd = x.productCd
                    x.detailNm = x.productNm
                    x.vatYn = x.vatYn ? 'Y' : 'N'
                    x.useAmt = x.acctAmt
                    x.lnSgtxt = x.lnSgtxt

                    delete x.regId
                    delete x.regDtm
                    delete x.chgId
                    delete x.chgDtm
                  })
                  data_dt.forEach(x => {
                    this.slipDetails.push(x)
                  })
                   

                  this.value = data_hd
                  
                  console.log("check data value ", this.value)
                  
                  this.etaxXmlHd = data_hd
                  this.deEaSlipNo = data_hd.eaSlipNo
                  
                  this.slipStatCd = this.value.slipStatCd
                  this.status.readonly = this.value.slipStatCd !== "10"
                  
                }catch(e){
                    //
                }

            }
        }).finally(() => {
          this.$store.commit('finish')
        });
    },
    openApprPopup() {
          let vm = this
          this.$modal.open({
              component: ApprActPop,
              props: {
                  docTitleNm: this.docTitleNm,
                  apprNo: this.apprNo,
                  apprSeq: this.apprSeq
              },
              parent: this,
              events: {
                  close(data) {
                      // Close event handler
                      vm.getAppr(data)
                  }
              }
          })
    },
    deleCheck() {
          this.$http.get(`/api/appr/delegatingCheck`, {
              params: {
                  adlgId: this.thisApprUser,
                  actId: this.$store.state.loginInfo.loginId
              }
          })
              .then(response => {
                  this.deleYn = response.data;
              });
    },
    cancel(docMngNo) {
          this.$swal({
              type: 'info',
              text: `상신을 취소합니다. 계속 하시겠습니까?`,
              showCancelButton: true,
              confirmButtonText: '예',
              cancelButtonText: '아니오',
          }).then((result) => {
              if (result.value) {
                  if (this.grSlipNo != undefined) {
                      this.$http.get(`/api/appr/detail/cancel/${this.docMngNo}`)
                          .then(response => {
                              if (response.data) {
                                  this.$swal({ type: 'info', text: '상신 취소 되었습니다.' });
                                  closeModal()
                                  this.$parent.$parent.goSearch()
                              }
                          })
                          .catch(({message}) => {
                              console.error(message);
                          });
                  }
              }
          })
    },
    openUploadEvidencePopup() {
          let vm = this
          const val = this.etaxXmlHd
          this.$modal.open({
              component: EvidAtchPop,
              props: {
                  //docMngNo: this.eaSlipNo,
                  docMngNo: this.deEaSlipNo,
                  readonly: this.slipStatCd !== '10' //this.isReadonly // Check readonly
              },
              parent: this,
              width: 1200,
              events: {
                  close(value) {
                      val.ufileCnt = value.length
                      vm.$forceUpdate();
                  }
              }
          })
      },
      openUploadWingsPopup(){
          let vm = this
          const val = this.etaxXmlHd
          this.$modal.open({
              component: WingsAtchPop,
              props: {
                  grSlipNo: this.grSlipNo,
                  slipDetail: this.tempData,
                  readonly: this.slipStatCd !== '10'//this.isReadonly // Check readonly
              },
              parent: this,
              width: 800,
              events: {
                  close(value) {
                      //this.value.grSlipNo = value[0].grSlipNo
                      val.uwingsFileCnt = value.length
                      vm.$forceUpdate();
                      //this.tempData = value
                  }
              }
          })
      },
      closeModal(){
          this.$parent.close()
          this.$parent.$parent.goSearch()
      }

  },
  created(){
    queryOption.apply(this, ['/taxes', 'TAX_CD', { evdTypeCd: this.value.evdTypeCd }])
    queryOption.apply(this, ['/api/account/liabilities', 'LBLT_ACCOUNT']);
    queryOption.apply(this, ['/code/detail', 'PAY_TERM_CD', { groupCd: 'PAY_TERM_CD', remark3: this.value.evdTypeCd }])
    queryOption.apply(this, ['/code/combo', 'FRGN_CUR_CD', { groupCd: 'FRGN_CUR_CD' }]);

    this.getAppr(this.docMngNo)
    
  },
  computed: {
    slipTypeId() {
      return 'E5'
    }
  },
  watch: {
    'loaded'() {
      this.deleCheck()
    },
    'slipDetails'(value) {
      this.value.slipDetails = value
    },
  },
};
</script>

<style scoped>
div#gridbox {
  width: 100%;
  height: 100%;
  min-height: 300px;
}
div.modal-card {
  width: 100%;
}
table tr th {
    text-align: center
}
.rightDt {
    text-align: right
}

</style>
