<template>
  <layout>
    <span slot="header">{{title}} 상세조회<button class="btn-pop-close delete" aria-label="close" @click="closeModal"></button></span>

    <div slot="content">
    <div>
        <!--2020.05.21 재경검인, 재경반려 추가 -->
        <div v-if="$route.name === 'slipMng'" class="btn-wrap btn-type1 clearfix">
            <button type="button" class="btn-size btn-gray fl_left" v-if="apprRejChckCd" @click="rejectButtonClickEvent(data,get)">
                <span class="btn-icon"><i class="fas fa-thumbs-down"></i></span> 반려
            </button>
            <button type="button" class="btn-size btn-gray fl_left" v-if="approvalingChckCd" @click="approvalingButtonClickEventOld(data,get)">
                <span class="btn-icon"><i class="fas fa-file"></i></span> 검인
            </button>
            <button type="button" class="btn-size btn-gray fl_left" v-if="approvalChckCd" @click="approvalButtonClickEvent(data,get)">
                <span class="btn-icon"><i class="fas fa-thumbs-up"></i></span> 확정
            </button>
        </div>
        <div class="btn-wrap btn-type1 clearfix" style="margin-bottom: 10px; float:right;">
                <button v-if="this.$store.state.loginInfo.loginId === this.thisApprUser || this.deleYn ==='Y'" class="btn-size btn-blue" @click="openApprPopup()"><span class="btn-icon"><i
                        class="fas fa-pen-alt"></i></span> 결재
                </button>
                <!-- <button v-if="this.$store.state.loginInfo.loginId == draftUserId && docStatus === 'REQ'"
                        class="btn-size btn-yellow" @click="cancel(docMngNo)"><span class="btn-icon"><i class="far fa-file"></i></span> 상신취소
                </button> -->
        </div>
        <div class="table-area" v-if="$route.name === 'slipLst' || $route.name === 'apprReqLst' || $route.name === 'slipMng'|| $route.name === 'apprPendLst'|| $route.name === 'apprCompLst'">
            <appr-header :doc-type="docType" :apprHeader="apprHeader" :appr-line="apprLine" v-model="data"/>
        </div>
    </div>
     <div class="content-name">
         <div class="table-name">
            <h3 class="ico_table_name" style="float:left">지급 정보</h3>
        </div>
      </div>
      <div class="table-area">
          <div class="table-header">

            <div class="table-a fixed">

                <div class="content">
                    <div class="btn-wrap" >
                        <table class="table">
                            <tbody>
                                <tr>
                                    <th style="width: 140px;">ERP번호</th>
                                    <td colsapn="3" style="width: 250px;">{{erpSlipHeader.erpSlipNo}}</td>
                                    <th style="width: 140px;">회계일자</th>
                                    <td colsapn="3" style="width: 250px;">{{erpSlipHeader.postDt}}</td>
                                    <th style="width: 140px;">은행지점명</th>
                                    <td colsapn="3">{{erpSlipHeader.bnkCd}}</td>
                                </tr>
                                <tr>
                                    <th style="width: 140px;">지급계좌</th>
                                    <td colsapn="3">{{erpSlipHeader.custAcctNo}}</td>
                                    <th style="width: 140px;">통화</th>
                                    <td colsapn="3">{{erpSlipHeader.curCd}}</td>
                                    <th style="width: 140px;">환율</th>
                                    <td class="rightDt" colsapn="3">{{$numeral(erpSlipHeader.excRt).format('0,0.00')}}</td>                                    
                                </tr>
                                <tr>
                                    <th style="width: 140px;">원화금액</th>
                                    <td class="rightDt" colsapn="3">{{$numeral(erpSlipHeader.krwTotAmt).format('0,0')}}</td>
                                    <th style="width: 140px;">외화금액</th>
                                    <td class="rightDt" colsapn="3">{{$numeral(erpSlipHeader.totAmt).format('0,0')}}</td>
                                    <th style="width: 140px;"></th>
                                    <td class="rightDt" colsapn="3"></td>
                                </tr>
                                <tr>
                                    <th style="width: 140px;">거래처코드</th>
                                    <td colsapn="3">{{erpSlipHeader.payCustCd}}</td>                                    
                                    <th style="width: 140px;">거래처명</th>
                                    <td colsapn="3">{{erpSlipHeader.payCustNm}}</td>
                                    <th style="width: 140px;"></th>
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
                    <h3 class="ico_table_name">지급 송장 정보</h3>
                </div>
            </div>
            <div class="grid-wrap">
                <dhx-grid ref="grid2" v-model="divisions" :config="config" @constructGridSuccessful="constructGridSuccessful"/>
            </div>
            <br>    
            <div class="grid-wrap">
                <dhx-grid ref="grid3" v-model="sumAmountDetails" :config="config2" @constructGridSuccessful="constructGridSuccessful2"/>
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
                                    <td class="rightDt" style="height: 30px; width: 240px;">{{ $numeral(dvsTotInfo.drAmtKorTot).format('0,0')}}</td>
                                    <td class="rightDt" style="width: 240px;">{{ $numeral(dvsTotInfo.crAmtKorTot).format('0,0')}}</td>
                                    <td class="rightDt" style="width: 240px;">{{ $numeral(dvsTotInfo.drAmtForTot).format('0,0.00')}}</td>
                                    <td class="rightDt" style="width: 240px;">{{ $numeral(dvsTotInfo.crAmtForTot).format('0,0.00')}}</td>
                                </tr>
                            </table>
                        </div>
                    </div>
                </div>
        </div>
      </div>
      <!-- //계정정보 & 합계 -->
      <!-- 증빙 정보 -->
      <div class="table-area" style="height: 60px;">
        <div class="file has-name" style="width: 1000px;">
            <div class="file">
                <div class="file-label" @click="openUploadEvidencePopup()">
                    <span class="file-cta">
                      <span class="file-label"> 증빙첨부</span>
                      <span class="icon-bar"><img src="/img/bar.png" alt="" /></span>
                    </span>
                    <span class="file-name">{{ this.$numeral(fileCnt).format('00') }}<i class="far fa-file-alt"></i></span>
                </div>
            </div>
        </div>
      </div>
      <!-- //증빙 정보 -->
      <!--팝업-->

      <!--//팝업 -->
    </div>
  </layout>
</template>

<script>
import moment from 'moment'
import mixin from '@/mixin';
import mixinSlip from '@/mixin/slip';
import query from '@/mixin/query'//2020.05.26 재경검인, 재경반려 method
import _ from 'lodash'

import assert from '@/libs/assert'
import Layout from '@/components/ModalSlot2.vue'
import DhxCalendar from '@/components/DhxCalendar.vue'
import DhxGrid from '@/components/DhxGrid.vue'
import ApprActPop from '@/components/ApprActPop.vue'
import EvidAtchPop from '@/components/EvidAtchPop.vue'
import SlipApprovalPop from '@/components/SlipApprovalPop.vue'

import ApprHeader from '@/components/ApprHeader.vue'

export default {
  name: 'SlipCrdLst',
  props: ['grSlipNo','eaSlipNo','slipTypeCd', 'title' , 'docMngNo','value'],
  components: {DhxGrid, DhxCalendar, Layout, ApprActPop, ApprHeader},
  mixins: [ mixin, mixinSlip, query ],
  data() {
    return {
      config:{
          columns: [
            {id: 'rn', type: 'cntr', align: 'center', sort: 'na', value: 'No.', width: 35},
            {id: 'postDt', type: 'ro', align: 'center', sort: 'na', value: 'ERP전표정보', width: 80},
            {id: 'serNo', type: 'ro', align: 'center', sort: 'na', value: '#cspan', width: 60},
            {id: 'acctNm', type: 'ron', align: 'left', sort: 'na', value: '#cspan', width: 120},
            {id: 'krwDrAmt', type: 'ron', align: 'right', sort: 'na', value: '원화금액', width: 80},
            {id: 'krwCrAmt', type: 'ron', align: 'right', sort: 'na', value: '#cspan', width: 80},
            {id: 'forDrAmt', type: 'ron', align: 'right', sort: 'na', value: '외화금액', width: 80},
            {id: 'forCrAmt', type: 'ron', align: 'right', sort: 'na', value: '#cspan', width: 80},
            {id: 'contNo', type: 'ro', align: 'left', sort: 'na', value: '계약번호', width: 80},
            {id: 'spotNm', type: 'ro', align: 'left', sort: 'na', value: '현장', width: 80},
            {id: 'custNm', type: 'ro', align: 'left', sort: 'na', value: '거래처', width: 80},
            {id: 'remark', type: 'ro', align: 'left', sort: 'na', value: '적요', width: 120},
            {id: 'bankCd', type: 'ro', align: 'left', sort: 'na', value: '은행코드', width: 80},
            {id: 'tdate', type: 'ro', align: 'left', sort: 'na', value: '만기일', width: 80}
          ],
          height: 250,
      },
      config2:{
          columns: [
            {id: 'rn', type: 'cntr', align: 'center', sort: 'na', value: 'No.', width: 35},
            {id: 'custCd', type: 'ro', align: 'center', sort: 'na', value: '거래처코드', width: 100},
            {id: 'custNm', type: 'ro', align: 'left', sort: 'na', value: '거래처명', width: 180},
            {id: 'krwDrAmt', type: 'ron', align: 'right', sort: 'na', value: '금액', width: 180}
          ],
          height: 250,
      },      
      useDetails: [],
      divisions: [],
      erpSlipHeader:[],
      apprDetails:[],
      sumAmountDetails:[],
      dvsTotInfo:{},
      acctCd:'',
      get:'10',
      data1:{}, //2020.05.21 SlipMmg.vue에서 선택된 데이터를 담는다.
      //결재관련
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
      //결재관련
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
      fileCnt: '',
      deEaSlipNo:'',
      slipStatCd:'',
      approvalingChckCd: false,
      approvalChckCd: false,
      apprRejChckCd:false,
      objectPopup: null
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
                          this.data.custAccount = [this.data.custBnkCd, this.data.custAcctNo].join('_')

                          if(_.isEmpty(this.data.hdSgtxt)){
                            this.data.hdSgtxt = response.data.apprHeader[0].docTitleNm.split('/')[2].trim()
                          }

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
                  })
          }
    },
    constructGridSuccessful(grid) {
        grid.attachHeader(
            ["#rspan",
            "전표일자", "전표번호", "계정",
            "차변", "대변", "차변", "대변",
            "#rspan","#rspan","#rspan","#rspan","#rspan","#rspan"],
        )
        grid.setNumberFormat('0,000', 4, '.', ',')
        grid.setNumberFormat('0,000', 5, '.', ',')
        grid.setNumberFormat('0,000.00', 6, '.', ',')
        grid.setNumberFormat('0,000.00', 7, '.', ',')
    },
    constructGridSuccessful2(grid) {
        grid.setNumberFormat('0,000', 3, '.', ',')
    },
    goSearch() {
        //const param = JSON.parse(JSON.stringify(this.form));
        //const stripFields = ['searchDtmFr', 'searchDtmTo','crdNo'];
        //_.forEach(stripFields, (name) => param[name] = this.toPure(param[name]));
        
        this.$store.commit('loading');
        this.$http.get(`api/erp/slip/detail/${this.grSlipNo}`
           ).then(response => {
            if (response.data) {
                try{
                    
                    //헤더정보(지급정보)
                    this.erpSlipHeader = response.data.erpSlipHeader[0]
                    
                    //분배정보(지급송장정보)
                    this.divisions = response.data.erpSlipDetails
                    
                    this.sumAmountDetails = response.data.sumAmountDetails

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

                    //증빙
                    this.fileCnt = this.erpSlipHeader.ufileCnt
                    this.deEaSlipNo = response.data.eaSlipNo
                    this.slipStatCd = response.data.slipStatCd

                }catch(e){
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
                      console.log('Appr Popup Close Event!!'+ data)
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
        let rdoCtrl = true
        let readonly = true
        
        // 전표작성단계가 아니면 수정불가
        if(this.slipStatCd !== '10') {
            readonly = true
            rdoCtrl = true
        } else {
            readonly = false
            rdoCtrl = false
        }
        //예외1
        if(this.$store.state.loginInfo.authorities[0].roleSelectCd === '10' && this.slipStatCd < '65'){
                readonly = false
                rdoCtrl = false
        }
        /*
            - 작성자 후첨 -
            결재요청, 결재진행, 결재완료 전표 중 작성자와 접속자가 동일한 경우, 후첨 가능하도록 변경
            단, 기 첨부된 증빙은 삭제할 수 없음
        */
        // if(this.slipStatCd === '20' || this.slipStatCd === '30' || this.slipStatCd === '50'){
        //     if(this.value.wrtId === this.$store.state.loginInfo.loginId){
        //         rdoCtrl = false
        //     }
        // }

        /*
            - 재경팀 후첨 -
            재경확정 전표는 재경팀에서 후첨 가능하도록 변경
            단, 기 첨부된 증빙은 삭제할 수 없음
        */
        // if(this.slipStatCd === '70'){
        //     if(this.$store.state.loginInfo.authorities[0].roleSelectCd === '10'){
        //         rdoCtrl = false
        //     }
        // }

      let url = '/evidAtchPopModeless?docMngNo=' + this.deEaSlipNo + '&readonly='+ readonly + '&readonlyCtrl='+ rdoCtrl;

      if(!(!this.objectPopup || this.objectPopup.closed)){
        this.objectPopup.focus();
      }else{
        this.objectPopup = window.open(url, '_blank', 'toolbar=0,location=0,menubar=0,resizable=yes');
      }

      //팝업 Close Callback
      //브라우저 체크(IE 체크)
      var agent = navigator.userAgent.toLowerCase();

      if ((navigator.appName == 'Netscape' && navigator.userAgent.search('Trident') != -1) || (agent.indexOf("msie") != -1)){
        this.objectPopup.attachEvent("onunload",function(){
          vm.fileCnt = localStorage.getItem("popFileCnt");
        });
      }else{
        this.objectPopup.onbeforeunload = function(){
          vm.fileCnt = localStorage.getItem("popFileCnt");
        };
      }
    },
    closeModal(){
        this.$parent.close()
        this.$parent.$parent.goSearch()
    },
    approvalingChck(){
      if(this.value.slipStatCd === '50' || this.value.slipStatCd === '64' || this.value.slipStatCd === '65'){
        this.approvalingChckCd = true;
      }else{
        this.approvalingChckCd = false;
      }
    },
    approvalChck(){
      if(this.value.slipStatCd === '66'){
        this.approvalChckCd = true;
      }else{
        this.approvalChckCd = false;
      }
    },
    apprRejChck(){
      if(this.value.slipStatCd !== '70' && this.value.slipStatCd !== ''){
        this.apprRejChckCd = true;
      }else{
        this.apprRejChckCd = false;
      }
    },

  },
  created(){
    this.getAppr(this.docMngNo)
    this.approvalingChck()
    this.approvalChck()
    this.apprRejChck()
  },
  mounted() {
      this.goSearch()
    //  this.useDetails = [{acctCd: "01", acctNm: "테스트01"},{acctCd: "02", acctNm: "테스트02"},{acctCd: "03", acctNm: "테스트03"}]
  },
  destroyed() {
    if(this.objectPopup !== null){
      this.objectPopup.close()
    }
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
      'value': {
      immediate: true,
      deep: true,
      handler(value) {
        console.log("value>>>>>>>>", value)
        this.data1 = value || {}
        this.data = value || {}
      }
    },
  }

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
.modal .pop-content .btn-type1 {
    float: right;
    text-align: right;
    /* margin-bottom: 16px; */
}

</style>

