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
        <div class="btn-wrap btn-type1 clearfix" style="margin-bottom: 5px;display:block;float:right">
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
            <h3 class="ico_table_name" style="float:left">구매 정보</h3>
        </div>
      </div>

      <!-- 테이블 -->
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
                                    <th style="width: 140px;">작성자</th>
                                    <td class="rightDt" colsapn="3">{{erpSlipHeader.wrtNm}}</td>
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
      <!-- 세금계산서 정보 -->
      <div class="table-area" v-if="slipTypeCd !== 'E5' && slipTypeCd !== 'E9'">
        <div class="table-header">
                <div class="table-a fixed">
                    <div class="content">
                        <div class="btn-wrap" >
                            <table class="table">
                                <tr>
                                    <th rowspan="3" style="width: 140px;">세금계산서정보</th>
                                    <th style="width: 100px;">첨부</th>
                                    <td>
                                        <span style="float: left;">{{$numeral(etaxXmlHd.taxBillCnt).format('0,0')}}</span>
                                        <button class="icon is-right" @click="openTaxBillPopup">
                                             <i class="fas fa-search"></i>
                                        </button>
                                        <button v-if="etaxXmlHd.taxBillCnt > 0 && slipStatCd === '10'" @click="delEtaxBill" class="search_bt_white_s">삭제</button>
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
                                    <td class="rightDt">{{$numeral(etaxXmlHd.chargetotal).format('0,0')}}</td>
                                    <th style="width: 100px;">세액</th>
                                    <td class="rightDt">{{$numeral(etaxXmlHd.taxtotal).format('0,0')}}</td>
                                    <th style="width: 100px;">총액</th>
                                    <td class="rightDt">{{$numeral(etaxXmlHd.grandtotal).format('0,0')}}</td>
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
                <div class="file-label" @click="openUploadWingsPopup()">
                    <span class="file-cta">
                      <span class="file-label"> Wings 문서</span>
                      <span class="icon-bar"><img src="/img/bar.png" alt="" /></span>
                    </span>
                    <span class="file-name">{{ this.$numeral(etaxXmlHd.uwingsFileCnt).format('00') }}<i class="far fa-file-alt"></i></span>
                </div>
            </div>
            <div class="file" >
                <div class="file-label" @click="openUploadEvidencePopup()">
                    <span class="file-cta">
                      <span class="file-label"> 증빙첨부</span>
                      <span class="icon-bar"><img src="/img/bar.png" alt="" /></span>
                    </span>
                    <span class="file-name">{{ this.$numeral(etaxXmlHd.ufileCnt).format('00') }}<i class="far fa-file-alt"></i></span>
                </div>
            </div>

        </div>
    </div>
  <!--//증빙 정보 -->
    </div>
  </layout>
</template>

<script>
import moment from 'moment'
import mixin from '@/mixin';
import mixinSlip from '@/mixin/slip';
import query from '@/mixin/query' //2020.05.26 재경검인, 재경반려 method
import _ from 'lodash'

import assert from '@/libs/assert'
import Layout from '@/components/ModalSlot2.vue'
import DhxCalendar from '@/components/DhxCalendar.vue'
import DhxGrid from '@/components/DhxGrid.vue'
import ApprActPop from '@/components/ApprActPop.vue'

import EvidAtchPop from '@/components/EvidAtchPop.vue'
import WingsAtchPop from '@/components/WingsAtchPop.vue'
import EvilSlipRcvLstModal from '@/components/EvilSlipRcvLstModal.vue'
import SlipApprovalPop from '@/components/SlipApprovalPop.vue'

import ApprHeader from '@/components/ApprHeader.vue'

import {
  url as _url
} from '@/libs/join'

//
//'./grid/GridCheckbox.vue'

export default {
  name: 'SlipCrdLst',
  props: ['issueId','grSlipNo','eaSlipNo','slipTypeCd', 'title', 'docMngNo','value'],
  components: {DhxGrid, DhxCalendar, Layout, ApprActPop, ApprHeader},
  mixins: [ mixin, mixinSlip, query ],
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
            {id: 'remark', type: 'ro', align: 'left', sort: 'na', value: '적요', width: 120}
          ],
          height: 250,
      },
      useDetails: [],
      divisions: [],
      erpSlipHeader: [],
      erpSlipDetails:[],
      apprDetails:[],
      etaxXmlHd:[],
      dvsTotInfo:{},
      acctCd:'',
      get:'10',
      data1:{}, //2020.05.21 SlipMmg.vue에서 선택된 데이터를 담는다.
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
          evdTaxInfo:'',
          searchDtmFr: this.$moment().startOf('month').format('YYYY-MM-DD'),
          searchDtmTo: this.$moment().format('YYYY-MM-DD'),
      },
      results: {},
      tempData:[],
      deEaSlipNo:'',
      url:'',
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
            "#rspan","#rspan","#rspan","#rspan"
            ],
        )
        grid.setNumberFormat('0,000', 4, '.', ',')
        grid.setNumberFormat('0,000', 5, '.', ',')
        grid.setNumberFormat('0,000.00', 6, '.', ',')
        grid.setNumberFormat('0,000.00', 7, '.', ',')
    },
    goSearch() {
        var vm = this
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
                    
                    //if(vm.etaxXmlHd.taxAftAttachYn == 'N') this.booltaxAftAttachYn = true;
                    vm.url = 'http://197.200.29.30:30000/dti/api/v1/view/'+ this.etaxXmlHd.etaxNO + '?stype=AP';
                    
                    this.deEaSlipNo = response.data.eaSlipNo
                    this.slipStatCd = response.data.slipStatCd

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

         //if(!this.booltaxAftAttachYn){
             this.$modal.open({
                 component: EvilSlipRcvLstModal,
                 parent: vm,
                 props: {
                     issueId: vm.issueId,
                     grSlipNo:vm.grSlipNo,
                     vendorNm: _.trim(vm.erpSlipHeader.payCustNm),
                     vendorCd: _.trim(vm.erpSlipHeader.payCustCd)                     
                 },
                 width: 1200,
                 events: {
                     close(object) {
                        vm.goSearch();
                        //  vm.issueId = object
                        //  val.taxBillCnt = object !== undefined ? 1 : 0
                        //  vm.$forceUpdate();
                     }
                 }
             });
         //}
    },
    delEtaxBill(){ //세금계산서 삭제

        let vm = this
        this.$swal({
            type: 'question',
            text: '첨부된 세금계산서를 삭제 하시겠습니까?',
            showCancelButton: true
        }).then(r => {
        if (r.value) {
            this.$http.put(`/api/erp/delete/etax/${this.grSlipNo}`)
            .then(response => {
                vm.goSearch();
            }).catch(response => {
            console.error(response)
            })
        }
        })
    },
    openUploadEvidencePopup() { //증빙첨부 팝업    
        let vm = this
        let rdoCtrl = true
        let readonly = true
        const val = this.etaxXmlHd
        const authority = this.$store.state.loginInfo.authorities[0].roleCd
        // 전표작성단계가 아니면 수정불가
        if(this.slipStatCd !== '10') {
          readonly = true
          rdoCtrl = true
        } else {
          readonly = false
          rdoCtrl = false
        }
      if(this.slipStatCd === '20' || this.slipStatCd === '30' || this.slipStatCd === '50'){
        /*
        - 작성자 후첨 -
        결재요청, 결재진행, 결재완료 전표 중 작성자와 접속자가 동일한 경우, 후첨 가능하도록 변경
        단, 기 첨부된 증빙은 삭제할 수 없음
        */
        if(this.value.wrtId === this.$store.state.loginInfo.loginId){
            rdoCtrl = false
        }
        /*
        - 재경팀 후첨 -
        결재요청, 결재진행, 결재완료 전표 중 작성자와 접속자가 동일한 경우, 후첨 가능하도록 변경
        단, 기 첨부된 증빙은 삭제할 수 없음
        */
        if(authority === 'ADMIN' || authority === 'F_USER'){
          rdoCtrl = false
        }
      }

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
            vm.$forceUpdate();

          });
        }else{
          this.objectPopup.onbeforeunload = function(){
            vm.fileCnt = localStorage.getItem("popFileCnt");
            vm.$forceUpdate();
          };
        }
    },
      openUploadWingsPopup(){ //기안서연동 팝업
          let vm = this
          const val = this.etaxXmlHd
          const authority = this.$store.state.loginInfo.authorities[0].roleCd
          var chkReadOnly = false

          if(this.slipStatCd !== '10'){
            chkReadOnly = true
          }
        if(this.slipStatCd === '20' || this.slipStatCd === '30' || this.slipStatCd === '50'){
          /*
          - 작성자 후첨 -
          결재요청, 결재진행, 결재완료 전표 중 작성자와 접속자가 동일한 경우, 후첨 가능하도록 변경
          단, 기 첨부된 증빙은 삭제할 수 없음
          */
          if(this.value.wrtId === this.$store.state.loginInfo.loginId){
            chkReadOnly = false
          }
          /*
          - 재경팀 후첨 -
          결재요청, 결재진행, 결재완료 전표 중 작성자와 접속자가 동일한 경우, 후첨 가능하도록 변경
          단, 기 첨부된 증빙은 삭제할 수 없음
          */
          if(authority === 'ADMIN' || authority === 'F_USER'){
            chkReadOnly = false
          }
        }

          this.$modal.open({
              component: WingsAtchPop,
              props: {
                  grSlipNo: this.grSlipNo,
                  slipDetail: this.tempData,
                  readonly: chkReadOnly //this.isReadonly // Check readonly
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
.modal .pop-content .btn-type1 {
    float: right;
    text-align: right;
    /* margin-bottom: 16px; */
}
</style>
