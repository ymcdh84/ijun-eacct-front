<template>

<div class="inner-box">
    <div class="content-name">
        <!-- <h2 class="dp-ib">{{title}}상세조회</h2> -->
        <div class="table-name">
        <h3 class="ico_table_name" style="float:left">구매정보</h3>
            <!-- <div class="btn-wrap btn-type1 clearfix" style="margin-bottom: 5px;display:block;float:right">
                <button v-if="this.$store.state.loginInfo.loginId === this.thisApprUser || this.deleYn ==='Y'" class="btn-size btn-blue" @click="openApprPopup()"><span class="btn-icon"><i
                        class="fas fa-pen-alt"></i></span> 결재
                </button>
                <button v-if="this.$store.state.loginInfo.loginId == draftUserId && docStatus === 'REQ'"
                        class="btn-size btn-yellow" @click="cancel(docMngNo)"><span class="btn-icon"><i class="far fa-file"></i></span> 상신취소
                </button>
            </div> -->
        </div>
    </div>
    <!-- 테이블 -->
    <!--<div class="table-area">
        <div class="table-b">
            <div class="grid-wrap">
                <dhx-grid ref="grid1" v-model="apprDetails" :config="config"/>
            </div>
        </div>
    </div>-->
    <div class="table-area">
        <div class="table-header">

        <div class="table-a fixed">

            <div class="content">
                <div class="btn-wrap" >
                    <table class="table">
                        <tbody>
                            <tr>
                                <th style="width: 10%;">ERP번호</th>
                                <td colsapn="3">{{erpSlipHeader.erpSlipNo}}</td>
                                <th style="width: 10%;">회계일자</th>
                                <td colsapn="3">{{erpSlipHeader.postDt}}</td>
                                <th style="width: 10%;">은행지점명</th>
                                <td colsapn="3">{{erpSlipHeader.bnkCd}}</td>
                            </tr>
                            <tr>
                                <th style="width: 10%;">지급계좌</th>
                                <td colsapn="3">{{erpSlipHeader.custAcctNo}}</td>
                                <th style="width: 10%;">통화</th>
                                <td colsapn="3">{{erpSlipHeader.curCd}}</td>
                                <th style="width: 10%;">환율</th>
                                <td class="rightDt" colsapn="3">{{$numeral(erpSlipHeader.excRt).format('0,0.00')}}</td>                                    
                            </tr>
                            <tr>
                                <th style="width: 10%;">원화금액</th>
                                <td class="rightDt" colsapn="3">{{$numeral(erpSlipHeader.krwTotAmt).format('0,0')}}</td>
                                <th style="width: 10%;">외화금액</th>
                                <td class="rightDt" colsapn="3">{{$numeral(erpSlipHeader.totAmt).format('0,0')}}</td>
                                <th style="width: 10%;">작성자</th>
                                <td class="rightDt" colsapn="3">{{erpSlipHeader.wrtNm}}</td>
                            </tr>
                            <tr>
                                <th style="width: 10%;">거래처코드</th>
                                <td colsapn="3">{{erpSlipHeader.payCustCd}}</td>                                    
                                <th style="width: 10%;">거래처명</th>
                                <td colsapn="3">{{erpSlipHeader.payCustNm}}</td>
                                <th style="width: 10%;"></th>
                                <td class="rightDt" colsapn="3"></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
    <div class="table-b">
        <div class="content-name">
            <div class="table-name">
                <h3 class="ico_table_name">장부 내역</h3>
            </div>
        </div>
        <div class="grid-wrap">
            <dhx-grid ref="grid2" v-model="divisions" :config="config2" @constructGridSuccessful="constructGridSuccessful"/>
        </div>
    </div>
    </div>
    <!-- //테이블 -->
    <!-- 계정정보 & 합계 -->
    <div class="table-area">
    <div class="table-header">
            <div class="table-a fixed">
                <div class="content">
                    <div class="btn-wrap" >
                        <table class="table">
                            <tr>
                                <th rowspan="3">합계</th>
                                <th colspan="2">원화금액</th>
                                <th colspan="2">외화금액</th>
                            </tr>
                            <tr>
                                <th>차변</th>
                                <th style="height:30px;">대변</th>
                                <th>차변</th>
                                <th>대변</th>                                  
                            <tr>
                                <td class="rightDt" style="height: 30px;">{{ $numeral(dvsTotInfo.drAmtKorTot).format('0,0')}}</td>
                                <td class="rightDt">{{ $numeral(dvsTotInfo.crAmtKorTot).format('0,0')}}</td>
                                <td class="rightDt">{{ $numeral(dvsTotInfo.drAmtForTot).format('0,0.00')}}</td>
                                <td class="rightDt">{{ $numeral(dvsTotInfo.crAmtForTot).format('0,0.00')}}</td>                                                                        
                            </tr>                            
                        </table>
                    </div>
                </div>
            </div>
    </div>
    </div>
    <!-- //계정정보 & 합계 -->
    <!-- 세금계산서 정보 -->
    <div class="table-area" v-if="slipTypeCd !== 'E5' && slipTypeCd !== 'E9'">
    <div class="table-header">
            <div class="table-a fixed">
                <div class="content">
                    <div class="btn-wrap" >
                        <table class="table">
                            <tr>
                                <th rowspan="3" style="width: 10%;">세금계산서정보</th>
                                <th style="width: 100px;">첨부</th>
                                <td>
                                    <span style="float: left;">{{$numeral(etaxXmlHd.taxBillCnt).format('0,0')}}</span>
                                    <button class="icon is-right" @click="openTaxBillPopup">
                                            <i class="fas fa-search"></i>
                                    </button>

                                </td>
                                <th v-if="this.etaxXmlHd.invSeq == null" colspan="2" style="width: 200px;">세금계산서 보기 (링크)</th>
                                <th v-else colspan="2" style="width: 200px;"><a v-bind:href="url" target="_blank">세금계산서 보기 (링크)</a></th>
                                <th colspan="2" style="width: 200px;">
                                    <input type="checkbox" id="check02" v-model="booltaxAftAttachYn" disabled="disabled" />
                                    <label for="check02">세금계산서 후첨</label>
                                </th>
                            </tr>
                            <tr>
                                <th>작성일자</th>
                                <td>{{etaxXmlHd.issueDate}}</td>
                                <th style="width: 100px;">상호</th>
                                <td>{{etaxXmlHd.suName}}</td>
                                <th style="width: 100px;">사업자번호</th>
                                <td>{{etaxXmlHd.suId}}</td>
                            <tr>
                                <th >공급가액</th>
                                <td class="rightDt">{{$numeral(etaxXmlHd.chargeTotal).format('0,0')}}</td>
                                <th style="width: 100px;">세액</th>
                                <td class="rightDt">{{$numeral(etaxXmlHd.taxTotal).format('0,0')}}</td>
                                <th style="width: 100px;">총액</th>
                                <td class="rightDt">{{$numeral(etaxXmlHd.grandTotal).format('0,0')}}</td>
                            </tr>
                        </table>
                    </div>
                </div>
            </div>
    </div>
    </div>
    <!-- //세금계산서 정보 -->
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
import ApprActPop from '@/components/ApprActPop.vue'

import EvidAtchPop from '@/components/EvidAtchPop.vue'
import WingsAtchPop from '@/components/WingsAtchPop.vue'
import EvilSlipRcvLstModal from '@/components/EvilSlipRcvLstModal.vue'

import ApprHeader from '@/components/ApprHeader.vue'


import {
  url as _url
} from '@/libs/join'

//
//'./grid/GridCheckbox.vue'

export default {
  name: 'SlipCrdLst',
  props: ['issueId','eaSlipNo','slipTypeCd', 'title', 'docMngNo'],
  components: {DhxGrid, DhxCalendar, ApprActPop, ApprHeader},
  mixins: [ mixin, mixinSlip ],
  data() {
    return {
      config : {
          columns: [
            {id: 'rn', type: 'cntr', align: 'center', sort: 'na', value: 'No.', width: 35},
            {id: '', type: 'ro', align: 'center', sort: 'na', value: '처리구분', width: 60},
            {id: '', type: 'ro', align: 'center', sort: 'na', value: '사번', width: 80},
            {id: '', type: 'ro', align: 'center', sort: 'na', value: '성명', width: 100},
            {id: '', type: 'ro', align: 'center', sort: 'na', value: '처리일시', width: 100},
            {id: '', type: 'ro', align: 'center', sort: 'na', value: '의견', width: 120},
          ],
          events: {

          },
          height: 180,
          afterRefreshData(grid, data) {
            this.$nextTick(() => {
                _.forEach(data, (item, index) => {
                    var rId = index + 1
                })
            })
        }
      },
      config2:{
          columns: [
            {id: 'rn', type: 'cntr', align: 'center', sort: 'na', value: 'No.', width: 35},
            {id: 'postDt', type: 'ro', align: 'center', sort: 'na', value: 'ERP전표정보', width: 80},
            {id: 'serNo', type: 'ro', align: 'center', sort: 'na', value: '#cspan', width: 60},
            {id: 'acctNm', type: 'ron', align: 'left', sort: 'na', value: '#cspan', width: 120},
            {id: 'krwDrAmt', type: 'ron', align: 'right', sort: 'na', value: '원화금액', width: 100},
            {id: 'krwCrAmt', type: 'ron', align: 'right', sort: 'na', value: '#cspan', width: 100},
            {id: 'forDrAmt', type: 'ron', align: 'right', sort: 'na', value: '외화금액', width: 100},
            {id: 'forCrAmt', type: 'ron', align: 'right', sort: 'na', value: '#cspan', width: 100},
            {id: 'contNo', type: 'ro', align: 'left', sort: 'na', value: '계약번호', width: 80},
            {id: 'spotNm', type: 'ro', align: 'left', sort: 'na', value: '현장', width: 80},
            {id: 'custNm', type: 'ro', align: 'left', sort: 'na', value: '거래처', width: 80},
            {id: 'remark', type: 'ro', align: 'left', sort: 'na', value: '적요', width: 60}
          ],
          events: {
            onRowSelect(rId, cInd, val){
                let colDef = this.options.columns[cInd]
                this.$parent.form.acctCd = val.coaCode;
                this.$parent.form.acctNm = val.coaDesc;
            }
          },
          height: 250,
      },
      useDetails: [],
      divisions: [],
      erpSlipHeader: [],
      apprDetails:[],
      etaxXmlHd:[],
      dvsTotInfo:{},
      acctCd:'',
      data: {},
      apprHeader: {},
      apprLine: [],
      budReqNo: undefined,
      apprNo: '',
      apprSeq: '',
      docTitleNm: '',
      docTypeCd: '',
      docType: 'SLIP',
      docStatus: '',
      draftUserId: '',
      thisApprUser: '',
      deleYn: 'N',
      loaded: false,
      booltaxAftAttachYn : false,
      grSlipNo: undefined,
      form: {
          acctCd: '',
          acctNm: '',
          useYn: 'N',
          compCd: '',
          crdCompCd: '',
          useDtlsStatCd: '10',
          crdFgCd: '',
          crdNo: '',
          crdPssrId: '',
          crdPssrNm: '',
          crdPssrTitle: '',
          crdPssrDut: '',
          crdPssrDept: '',
          coaCode:'',
          coaDesc:'',
          searchDtmFr: this.$moment().startOf('month').format('YYYY-MM-DD'),
          searchDtmTo: this.$moment().format('YYYY-MM-DD'),
      },
      results: {},
      tempData:[],
      deEaSlipNo:'',
      url:'',
      slipStatCd:''

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

                          this.apprHeader = response.data.apprHeader[0];
                          this.apprLine = response.data.apprDetails;

                          this.docTypeCd = response.data.apprHeader[0].docTypeCd;
                          this.docStatus = response.data.apprHeader[0].docStatCd;
                          this.draftUserId = response.data.apprHeader[0].draftUserId;
                          this.docTitleNm = response.data.apprHeader[0].docTitleNm;
                          this.apprNo = response.data.apprHeader[0].apprNo;
                          this.docType = 'ERP'
                          this.grSlipNo = response.data.apprHeader[0].docMngNo;
                          this.data.custAccount = [this.data.custBnkCd, this.data.custAcctNo].join('_')

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
                      this.goSearch()
                  })
          }
    },
    constructGridSuccessful(grid) {
        grid.attachHeader(
            ["#rspan",
            "전표일자", "전표번호", "계정",
            "차변", "대변", "차변", "대변",
            "#rspan","#rspan","#rspan","#rspan"
            ],
        )
        grid.setNumberFormat('0,000.00', 4, '.', ',')
        grid.setNumberFormat('0,000.00', 5, '.', ',')
        grid.setNumberFormat('0,000', 6, '.', ',')
        grid.setNumberFormat('0,000', 7, '.', ',')
    },
    goSearch() {
        if(this.grSlipNo) {
            this.$store.commit('loading');
            this.$http.get(`api/erp/slip/detail/${this.grSlipNo}`            
               ).then(response => {
                if (response.data) {
                    try{
                    
                    //헤더정보
                    this.erpSlipHeader = response.data.erpSlipHeader[0]
                    
                    //분배정보
                    this.divisions = response.data.erpSlipDetails
                    
                    //합계                    
                    let nDrAmtKorTot = 0
                    let nCrAmtKorTot = 0
                    let nDrAmtForTot = 0
                    let nCrAmtForTot = 0

                    this.divisions.forEach(v =>{
                       nDrAmtKorTot += Number(v.krwDrAmt)
                       nCrAmtKorTot += Number(v.krwCrAmt)
                       nDrAmtForTot += Number(v.forDrAmt)
                       nCrAmtForTot += Number(v.forCrAmt)
                    })
                    
                    this.dvsTotInfo.drAmtKorTot = nDrAmtKorTot
                    this.dvsTotInfo.crAmtKorTot = nCrAmtKorTot
                    this.dvsTotInfo.drAmtForTot = nDrAmtForTot
                    this.dvsTotInfo.crAmtForTot = nCrAmtForTot                    
                    
                    //계산서 정보                    
                    this.etaxXmlHd = response.data.etaxXmlHd[0]
                    
                    if(this.etaxXmlHd.taxAftAttachYn == 'N') this.booltaxAftAttachYn = true;
                    this.url = `http://197.200.1.19:10004/addservice/view/XXSB_DTI_PRINT_VIEW_NTS.asp?issue_id=${this.etaxXmlHd.invSeq}&SBTYPE=AP`
                    
                    this.deEaSlipNo = response.data.eaSlipNo
                    this.slipStatCd = response.data.slipStatCd
    
                    }catch(e){
                        //
                    }
    
                }
            }).finally(() => {
                this.$store.commit('finish')
            });
        }
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
                      this.$http.get(`/api/appr/detail/cancel/${docMngNo}`)
                          .then(response => {
                              if (response.data) {
                                  this.$swal({ type: 'info', text: '상신 취소 되었습니다.' });
                                  closeModal()
                                  this.$parent.$parent.goSearch()
                                 // this.$router.push({path: `/apprReqLst`});
                              }
                          })
                          .catch(({message}) => {
                              console.error(message);
                          });
                  }
              }
          })
    },
    openTaxBillPopup(){ //세금계산서 팝업
         let vm = this
         const val = this.etaxXmlHd

         if(!this.booltaxAftAttachYn){
             this.$modal.open({
                 component: EvilSlipRcvLstModal,
                 parent: this,
                 props: {
                     issueId: this.issueId,
                     grSlipNo:this.grSlipNo,
                     vendorNm:this.erpSlipHeader.payCustNm
                 },
                 width: 1200,
                 events: {
                     close(object) {
                         vm.issueId = object
                         val.taxBillCnt = object !== undefined ? 1 : 0
                         vm.$forceUpdate();
                     }
                 }
             });
         }
    },
    openUploadEvidencePopup() { //증빙첨부 팝업
          let vm = this
          const val = this.etaxXmlHd
          this.$modal.open({
              component: EvidAtchPop,
              props: {
                  docMngNo: this.deEaSlipNo,
                  readonly: this.slipStatCd !== '10'//this.isReadonly // Check readonly
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
      openUploadWingsPopup(){ //기안서연동 팝업
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
                      //this.data.grSlipNo = value[0].grSlipNo
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
      this.getAppr(this.docMngNo)
    // this.getAppr('GR202001-06721')
  },
  mounted() {
    //   this.goSearch()
    //  this.useDetails = [{acctCd: "01", acctNm: "테스트01"},{acctCd: "02", acctNm: "테스트02"},{acctCd: "03", acctNm: "테스트03"}]
  },
  watch: {
    'title': {
      immediate: true,
      deep: true,
      handler(value) {
          if(value !== undefined) {
              this.title = value
          }
      }
    },
    'loaded'() {
          this.deleCheck()
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
