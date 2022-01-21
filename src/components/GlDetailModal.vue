<template>
  <layout>
    <span slot="header">{{title}} 상세조회<button class="btn-pop-close delete" aria-label="close" @click="closeModal"></button></span>

    <div slot="content">
    <div>
        <!--2020.05.21 재경검인, 재경반려 추가 -->
        <div v-if="$route.name === 'slipMng' && (data1.slipStatCd==='50' || data.slipStatCd==='65') " class="btn-wrap btn-type1 clearfix">
            <button type="button" class="btn-size btn-gray fl_left" @click="rejectButtonClickEvent(data,get)">
                <span class="btn-icon"><i class="fas fa-thumbs-down"></i></span> 반려
            </button>
            <button type="button" class="btn-size btn-gray fl_left" @click="approvalingButtonClickEventOld(data,get)">
                <span class="btn-icon"><i class="fas fa-file"></i></span> 검인
            </button>
            <button type="button" class="btn-size btn-gray fl_left" @click="approvalButtonClickEvent(data,get)">
                <span class="btn-icon"><i class="fas fa-thumbs-up"></i></span> 확정
            </button>
        </div>
        
        <div class="btn-wrap btn-type1 clearfix" style="margin-bottom: 10px; float:right;">
            <button v-if="this.$store.state.loginInfo.loginId === this.thisApprUser || this.deleYn ==='Y'" class="btn-size btn-blue" @click="openApprPopup()"><span class="btn-icon"><i
                    class="fas fa-pen-alt"></i></span> 결재
            </button>
            <button v-if="this.$store.state.loginInfo.loginId == draftUserId && docStatus === 'REQ'"
                    class="btn-size btn-yellow" @click="cancel(docMngNo)"><span class="btn-icon"><i class="far fa-file"></i></span> 상신취소
            </button>
        </div>
        <div class="table-area" v-if="$route.name === 'slipLst' || $route.name === 'apprReqLst'">
            <appr-header :doc-type="docType" :apprHeader="apprHeader" :appr-line="apprLine" v-model="data"/>
        </div>
    </div>
     <div class="content-name">
         <div class="table-name">
            <h3 class="ico_table_name" style="float:left">GL전표 정보</h3>
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
                                    <th style="width: 140px;">분개명</th>
                                    <td colspan="5">{{slipDetail.journalNm}}</td>
                                    <th style="width: 140px;" >GL일자</th>
                                    <td colspan="2">{{slipDetail.postDt}}</td>
                                </tr>
                                <tr>
                                    <th style="width: 140px;">배치명</th>
                                    <td colspan="5">{{slipDetail.batchNm}}</td>
                                    <th style="width: 140px;">작성자</th>
                                    <td colspan="2">{{slipDetail.userNm}}</td>
                                </tr>
                                <tr>
                                    <th>원천</th>
                                    <td colspan="2">{{slipDetail.sourceNm}}</td>
                                    <th>출처</th>
                                    <td colspan="2">{{slipDetail.categoryNm}}</td>
                                    <th>생성일시</th>
                                    <td colspan="2">{{slipDetail.creatDt}}</td>

                                </tr>
                                <tr>
                                    <th>통화</th>
                                    <td colspan="2">{{slipDetail.curCd}}</td>
                                    <th>환율</th>
                                    <td class="rightDt" colspan="2">{{$numeral(slipDetail.excRt).format('0,0.00')}}</td>
                                    <th>횐율일자</th>
                                    <td colspan="2">{{slipDetail.excDt}}</td>
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
                    <h3 class="ico_table_name">분배 정보</h3>
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
                                <tbody>
                                    <tr>
                                        <th rowspan="2" style="width: 140px;">계정정보</th>
                                        <th style="width: 140px;">계정</th>
                                        <td>{{form.acctCd}}</td>
                                    </tr>
                                    <tr>
                                        <th style="width: 140px;">계정명</th>
                                        <td>{{form.acctNm}}</td>
                                    </tr>
                                </tbody>
                            </table>
                            <table class="table">
                                <tr>
                                    <th rowspan="3">합계</th>
                                    <th colspan="2">입력금액(외화)</th>
                                    <th colspan="2">환산금액(원화)</th>
                                </tr>
                                <tr>
                                    <th>차변</th>
                                    <th style="height:30px;">대변</th>
                                    <th>차변</th>
                                    <th>대변</th>
                                <tr>
                                    <td class="rightDt" style="height: 30px;">{{$numeral(dvsTotInfo.drAmtForTot).format('0,0.00')}}</td>
                                    <td class="rightDt">{{$numeral(dvsTotInfo.crAmtForTot).format('0,0.00')}}</td>
                                    <td class="rightDt">{{$numeral(dvsTotInfo.drAmtKorTot).format('0,0')}}</td>
                                    <td class="rightDt">{{$numeral(dvsTotInfo.crAmtKorTot).format('0,0')}}</td>
                                </tr>
                            </table>
                        </div>
                    </div>
                </div>
        </div>
      </div>
      <!-- //계정정보 & 합계 -->
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
import SlipApprovalPop from '@/components/SlipApprovalPop.vue'

import ApprHeader from '@/components/ApprHeader.vue'

import {
  url as _url
} from '@/libs/join'

//
//'./grid/GridCheckbox.vue'

export default {
  name: 'SlipCrdLst',
  props: ['grSlipNo','eaSlipNo','slipTypeCd', 'title', 'docMngNo','value'],
  components: {DhxGrid, DhxCalendar, Layout, ApprActPop, ApprHeader},
  mixins: [ mixin, mixinSlip,query ],
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
            {id: 'accountNm', type: 'ro', align: 'left', sort: 'na', value: '계정명', width: 120},
            {id: 'description', type: 'ro', align: 'left', sort: 'na', value: '적요', width: 120},
            {id: 'drAmtFor', type: 'ron', align: 'right', sort: 'na', value: '입력금액(외화)', width: 120},
            {id: 'crAmtFor', type: 'ron', align: 'right', sort: 'na', value: '#cspan', width: 120},
            {id: 'drAmtKrw', type: 'ron', align: 'right', sort: 'na', value: '환산금액(원화)', width: 100},
            {id: 'crAmtKrw', type: 'ron', align: 'right', sort: 'na', value: '#cspan', width: 120}
          ],
          events: {
            onRowSelect(rId, cInd, val){
                let colDef = this.options.columns[cInd]
                this.$parent.$parent.form.acctCd = val.coaCode;
                this.$parent.$parent.form.acctNm = val.coaDesc;

                //this.$parent.$parent.form.acctCd = this.$parent.$parent.divisions[rId-1].acctCd
                //this.$parent.$parent.form.acctNm = this.$parent.$parent.divisions[rId-1].acctNm

                if(colDef.id === 'itemCd'){
                    // this.$http
                    // .post("/api/code/detail", {
                    //     groupCd: this.$parent.data[rid-1].groupCd
                    // })
                    // .then(response => {
                    //     console.log(response.data)
                    //     this.$parent.datad = response.data
                    // });
                }
            }
          },
          height: 180,
      },
      useDetails: [],
      divisions: [],
      slipDetail:[],
      apprDetails:[],
      etaxXmlHd:[],
      dvsTotInfo:{},
      acctCd:'',

      data: {},
      data1:{},//2020.05.21 SlipMmg.vue에서 선택된 데이터를 담는다.
      get:'10',
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
      deEaSlipNo: '',
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
            ["#rspan", "#rspan", "#rspan",
            "차변", "대변", "차변", "대변"
            ],
        )

        grid.setNumberFormat('0,000.00', 3, '.', ',')
        grid.setNumberFormat('0,000.00', 4, '.', ',')
        grid.setNumberFormat('0,000', 5, '.', ',')
        grid.setNumberFormat('0,000', 6, '.', ',')

    },
    goSearch() {
        /*const param = JSON.parse(JSON.stringify(this.form));
        const stripFields = ['searchDtmFr', 'searchDtmTo','crdNo'];
        _.forEach(stripFields, (name) => param[name] = this.toPure(param[name]));*/

        this.$store.commit('loading');
        this.$http.get(`api/erp/gl/slip/${this.grSlipNo}`
           ).then(response => {
            if (response.data) {
                try{
                    //헤더정보
                    this.slipDetail = response.data.slipDetail[0]
                    //분배정보
                    this.divisions = response.data.division
                    if(this.divisions.length > 0){
                        this.form.acctCd = this.divisions[0].coaCode
                        this.form.acctNm = this.divisions[0].coaDesc
                    }
                    //합계
                    this.dvsTotInfo = response.data.dvsTotInfo
                    //증빙 정보
                    this.etaxXmlHd = response.data.etaxXmlHd[0]
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
        const val = this.etaxXmlHd

        // 전표작성단계가 아니면 수정불가
        if(this.slipStatCd !== '10') {
          readonly = true
          rdoCtrl = true
        } else {
          readonly = false
          rdoCtrl = false
        }
        //예외1
        // if(this.$store.state.loginInfo.authorities[0].roleSelectCd === '10' && this.slipStatCd < '65'){
        //   readonly = false
        //   rdoCtrl = false
        // }

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
        //
        // if(this.$store.state.loginInfo.loginDeptCd === this.value.wrtDeptCd){
        //     if(this.value.slipStatCd === '20' || this.value.slipStatCd === '30' || this.value.slipStatCd === '50' || this.value.slipStatCd === '65'|| this.value.slipStatCd === '70'){
        //         rdoCtrl = false
        //     }
        // }

        this.$modal.open({
            component: EvidAtchPop,
            props: {
                //docMngNo: this.eaSlipNo,
                docMngNo: this.deEaSlipNo,
                readonly: readonly,
                readonlyCtrl: rdoCtrl
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

          var chkReadOnly = false

          if(this.slipStatCd !== '10'){
            chkReadOnly = true
          }

          // if(this.$store.state.loginInfo.loginDeptCd === this.value.wrtDeptCd){
          //   if(this.value.slipStatCd === '20' || this.value.slipStatCd === '30' || this.value.slipStatCd === '50'|| this.value.slipStatCd === '65'|| this.value.slipStatCd === '70'){
          //       chkReadOnly = false
          //   }
          // }

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
  },
  created(){
      this.getAppr(this.docMngNo)
  },
  mounted() {
      this.goSearch()
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
    // 2020.05.21재경검인, 재경반려 추가
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
