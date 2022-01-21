<template>
<div class="inner-box">
  <div class="content-name">
    <h2 class="dp-ib">전표 관리</h2>
    <div class="btn-wrap btn-type1 clearfix">
      <button type="button" class="btn-size btn-gray fl_left" v-if="apprRejChck()" @click="rejectButtonClickEventNew(data)">
        <span class="btn-icon"><i class="fas fa-thumbs-down"></i></span> 반려
      </button>
      <button type="button" class="btn-size btn-gray fl_left" v-if="approvalingChck()" @click="approvalingButtonClickEvent(data)">
        <span class="btn-icon"><i class="fas fa-file"></i></span> 검인
      </button>
      <button type="button" class="btn-size btn-gray fl_left" v-if="approvalChck()" @click="approvalButtonClickEventNew(data)">
        <span class="btn-icon"><i class="fas fa-thumbs-up"></i></span> 확정
      </button>
      
      <!-- <button type="button" class="btn-size btn-orange fl_left" @click="reversalButtonClickEvent()">
        <span class="btn-icon"><i class="fas fa-undo"></i></span> 역분개
      </button> -->
      <button type="button" class="btn-size btn-blue fl_left" @click="goSearch">
        <span class="btn-icon"><i class="fas fa-pen-alt"></i></span> 조회
      </button>
    </div>
  </div>

  <!-- 검색조건 영역 -->
        <div class="desc-content search-border">
            <div class="item search_wrap">
                <div class="search_box">
                    <div class="search_title">
                        <span class="search_tit">- 신청일자</span>
                    </div>
                    <div class="search_con">
                        <div class="datepicker w-type-ymd02">
                            <dhx-calendar class="input ddate sDate" v-model="postDtFrom" required="required" />
                        </div>
                        <span class="wave"> ~ </span>
                        <div class="datepicker w-type-ymd02">
                            <dhx-calendar class="input ddate sDate" v-model="postDtTo" required="required" />
                        </div>
                    </div>
                </div>
                <div class="search_box">
                    <button class="item-list icon is-right btn_s_w" @click="openModal()" type="button">상세검색<i class="fas fa-plus"></i></button>
                </div>


                <!-- 상세검색 내용 -->
                <div id="open-moda" class="modal-window">
                    <div class="modal-window-wrap">
                        <div class="modal-window-top">
                            <h4>상세검색</h4>
                            <button title="Close" @click="closeModal()" type="button" class="bt-modal-close mt5"><img src="../../public/img/bt_close_w.png" /></button>    
                        </div>
                        
                        <div class="search_box_wrap">
                            <div class="search_box_pop">
                                <div class="search_title">
                                    <span class="search_tit">- 신청일자</span>
                                </div>
                                <div class="search_con search-area">
                                    <div class="datepicker w-type-ymd02 w30p">
                                        <dhx-calendar class="input ddate sDate" v-model="postDtFrom" required="required" />
                                    </div>
                                    <span class="datepicker w10p dp-ib tac"> ~ </span>
                                    <div class="datepicker w-type-ymd02 w30p">
                                        <dhx-calendar class="input ddate sDate" v-model="postDtTo" required="required" />
                                    </div>
                                  <button @click="dateSetting('toDay','postDt')" class="search_bt_white_s">당일</button>
                                  <button @click="dateSetting('crrntMnth','postDt')" class="search_bt_white_s">당월</button>
                                  <button @click="dateSetting('PrvsMnth','postDt')" class="search_bt_white_s">전월</button>
                                </div>
                            </div>

                            <div class="search_box_pop">
                                <div class="search_title">
                                    <span class="search_tit">- 전표유형</span>
                                </div>
                                <div class="search_con search-area">
                                    <select class="input w100p" v-model="slipTypeCd" @change="changeSlipType">
                                        <option value="">==전체==</option>
                                        <option v-for="option in slipTypeList" :key="option.key" :value="option.key" v-text="option.value"/>
                                    </select>
                                </div>
                            </div>

                            <div class="search_box_pop">
                                <div class="search_title">
                                    <span class="search_tit">- 전표상태</span>
                                </div>
                                <div class="search_con search-area">
                                    <select class="input w100p" v-model="slipStatCd" @change="goSearch()" :disabled="isFixSlipStat">
                                        <option value="">==전체==</option>
                                        <option v-for="option in slipStatList" :key="option.detailCd" :value="option.detailCd" v-text="option.detailNm"/>
                                    </select>
                                </div>
                            </div>

                            <div class="search_box_pop">
                                <div class="search_title">
                                    <span class="search_tit">- 작성부서</span>
                                </div>
                                <div class="search_con search-area">
                                    <input type="text" class="input dp-ib w30p_5r" v-model="wrtDeptCd" disabled/>
                                    <input type="text" class="input dp-ib search-input w70p" v-model="wrtDeptNm" @input="initCctr" @keydown.enter="popCctr"/>
                                    <button type="button" class="icon is-right" @click="popCctr">
                                        <span class="btn-icon"><i class="fas fa-search"></i></span>
                                    </button>
                                </div>
                            </div>

                            <div class="search_box_pop">
                                <div class="search_title">
                                    <span class="search_tit">- 작성자</span>
                                </div>
                                <div class="search_con search-area">
                                    <input type="text" class="input dp-ib w20p_5r" v-model="wrtDutNm" disabled/>
                                    <input type="text" class="input dp-ib w30p_5r" v-model="wrtCctrNm" disabled/>
                                    <input type="text" class="input dp-ib w20p_5r" v-model="wrtId" disabled/>
                                    <input type="text" class="input dp-ib search-input w30p" v-model="wrtNm" @input="initWrite" @keydown.enter="popWrite"/>
                                    <button type="button" class="icon is-righ" @click="popWrite">
                                        <span class="btn-icon"><i class="fas fa-search"></i></span>
                                    </button>
                                </div>
                            </div>

                            <div class="search_box_pop">
                                <div class="search_title">
                                    <span class="search_tit">- 신청번호</span>
                                </div>
                                <div class="search_con search-area">
                                    <input type="text" class="input w100p" v-model="grSlipNo" />
                                </div>
                            </div>

                            <div class="search_box_pop">
                                <div class="search_title">
                                    <span class="search_tit">- 거래처</span>
                                </div>
                                <div class="search_con search-area">
                                    <input type="text" class="input Rt-M w100p" v-model="evdCustNm" />
                                </div>
                            </div>

                            <div class="search_box_pop">
                                <div class="search_title">
                                    <span class="search_tit">- 지급처</span>
                                </div>
                                <div class="search_con search-area">
                                    <input type="text" class="input Rt-M w100p" v-model="payCustNm" />
                                </div>
                            </div>
                            <div class="search_box_pop">
                              <div class="search_title">
                                <span class="search_tit">- 지급예정일자</span>
                              </div>
                              <div class="search_con search-area">
                                <div class="datepicker w-type-ymd02 w30p">
                                  <dhx-calendar class="input ddate sDate" v-model="payDueDtFrom" />
                                </div>
                                <span class="datepicker w10p dp-ib tac"> ~ </span>
                                <div class="datepicker w-type-ymd02 w30p">
                                  <dhx-calendar class="input ddate sDate" v-model="payDueDtTo" />
                                </div>
                                <button @click="dateSetting('toDay','payDueDt')" class="search_bt_white_s">당일</button>
                                <button @click="dateSetting('crrntMnth','payDueDt')" class="search_bt_white_s">당월</button>
                                <button @click="dateSetting('PrvsMnth','payDueDt')" class="search_bt_white_s">전월</button>
                              </div>
                            </div>
                            <div class="search_box_pop">
                              <div class="search_title">
                                <span class="search_tit">- 재사용 건 제외</span>
                              </div>
                              <div class="search_con search-area">
                                <input id="check01" type="checkbox" v-model="exReUsed">
                                <label for="check01">제외</label>
                              </div>
                            </div>
                        </div>

                        <div class="modal-window-bottom">
                            <ul>
                                <li>
                                    <button class="bt_blue_s" @click="goSearch">검색</button> 
                                </li>
                                <li>
                                    <button @click="closeModal()" title="Close" class="bt_white_s">닫기</button>
                                </li>
                            </ul>
                             
                            
                        </div>

                    </div>
                </div>
                <!-- //상세검색 내용 -->
            </div>
        </div>
        <!-- //검색조건 영역 -->

  <!-- 데이터 영역 -->
  <div class="table-area mt20">
    <div class="table-b">
      <div class="table-header">
        <div class="table-name">
          <h3 class="ico_table_name">전표내역</h3>
        </div>
        <div class="btn-wrap btn-type1 clearfix">
          <div style="float:left; padding-top:10px; margin-right:10px;"> 총 금액 : {{$numeral(totalAmt).format('0,0')}} </div>
          <button class="btn-size btn-gray" @click="allChk">
              <span class="btn-icon"><i class="fas fa-check"></i></span> 전체선택
          </button>
          <button class="btn-size btn-excel" @click="toExcel">엑셀 저장</button>
        </div>
      </div>
      <!-- Grid -->
      <div class="grid-tbl-box">
          <ag-grid-vue ref="grid"
                      style="width: 100%;"
                      class="ag-theme-alpine grid_search_height"    
                      
                      :rowSelection="rowSelection"
                      :columnDefs="columnDefs"     
                      :gridOptions="gridOptions"
                      :rowData="data"
                      :defaultColDef="defaultColDef"
                      :frameworkComponents="frameworkComponent"
                      @cell-clicked="onCellClicked"
                      @rowDoubleClicked="rowDoubleClick"
                      @cell-value-changed="cellValueChange"/>
        </div>
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

// mixins
import mixin from '@/mixin/common'
import query from '@/mixin/query' //2020.05.26 재경검인, 재경반려 method
import mixinSlip from '@/mixin/slip';

/**
 * 모달창
 */
import Emp from '@/components/Emp_Ag.vue'
import Cctr from '@/components/Cctr_Ag.vue'
import SlipModal from '@/components/SlipModal.vue'
import SlipApprovalPop from '@/components/SlipApprovalPop.vue'
import ErpItfErrModal from '@/components/ErpItfErrModal_Ag.vue'

import SlipDetailModal from '@/components/SlipDetailModal.vue'
import SlipPayDetailModal from '@/components/SlipPayDetailModal.vue'
import SlipEtcDetailModal from '@/components/SlipEtcDetailModal.vue'
import GlDetailModal from '@/components/GlDetailModal.vue'
import PayrollSlipModal from '@/components/PayrollSlipModal.vue'

/**
 * 사용되는 공통 컴포넌트 Import
 */
import DhxCalendar from '@/components/DhxCalendar.vue'
import {AgGridVue} from 'ag-grid-vue';
import AgGridCheckbox from "@/components/agGrid/AgGridCheckbox.vue"

export default {
  components: {
    DhxCalendar,
    AgGridVue
  },
  mixins: [mixin, query, mixinSlip],
  data() {
    return {
      postDtFrom: moment().subtract(1, 'months').startOf('month').format('YYYYMMDD'),
      postDtTo: moment().format('YYYYMMDD'),
      evdDtFrom: moment().subtract(1, 'months').startOf('month').format('YYYYMMDD'),
      evdDtTo: moment().format('YYYYMMDD'),
      wrtDeptCd: undefined,
      wrtDeptNm: undefined,
      eaSlipNo: undefined,
      slipTypeCd: '',
      payCustNm: undefined,
      wrtId: undefined,
      wrtNm: undefined,
      wrtDutNm: undefined,
      wrtCctrNm: undefined,
      erpSlipNo: undefined,
      slipStatCd: '',
      evdCustNm: undefined,
      acctFlag: 'Y',
      grSlipNo: '',
      slipTypeList:[],
      slipStatList:[],
      data: [],
      apprRsn: undefined,
      totalAmt:0, //2020.06.11 전체금액 변수
      frameworkComponent : {
        'checkBox' : AgGridCheckbox
      },
      columnDefs : [],
      gridOptions : {},
      defaultColDef:{},
      rowSelection: 'multiple',
      chkYn: false,
      exReUsed:true,
      payDueDtFrom:'',
      payDueDtTo:'',
      isFixSlipStat: false
    }
  },
  
  methods: {
    makeColDef(){
        const that = this;
        this.columnDefs = [
            {
                headerName: '#', 
                field: 'useYn', 
                width: 60,
                cellRenderer: 'checkBox'
            },
            {
                headerName: 'No.', 
                field: 'no', 
                width: 65,
                cellStyle:{textAlign: 'center'},
                valueFormatter: function(params) { 
                    return params.node.rowIndex+1;
                }
            },
            {headerName: '신청번호', field: 'grSlipNo', width: 150, cellStyle:{textAlign: 'left'}},
            {headerName: '전표상태', field: 'slipStatNm', width: 100, cellStyle:{textAlign: 'left'}},
            {headerName: '전표유형', field: 'slipTypeNm', width: 175, cellStyle:{textAlign: 'left'}},
            {
              headerName: '신청일자', 
              field: 'postDt', 
              width: 110,
              cellStyle:{textAlign: 'left'},
              valueFormatter: function(params) {               
                return that.$moment(params.value).format('YYYY-MM-DD');
              }
            },
            {headerName: '작성부서명', field: 'wrtDeptNm', width: 100, cellStyle:{textAlign: 'left'}},
            {headerName: '작성자', field: 'wrtNm', width: 80, cellStyle:{textAlign: 'left'}},
            {headerName: '통화', field: 'curCd', width: 80, cellStyle:{textAlign: 'left'}},
            {
              headerName: '공급가', 
              field: 'supAmt', 
              width: 110, 
              cellStyle:{textAlign: 'right'},
              valueFormatter: function(params) { 
                return that.getNumberFormat(params.value);
              }
            },
            {
                headerName: '부가세액', 
                field: 'vatAmt', 
                width: 140, 
                cellStyle:{textAlign: 'right'},
                valueFormatter: function(params) { 
                  return that.getNumberFormat(params.value);
                }
            },
            {
                headerName: '총금액', 
                field: 'totAmt', 
                width: 140, 
                cellStyle:{textAlign: 'right'},
                valueFormatter: function(params) {               
                    return that.getNumberFormat(params.value);
                }
            },
            {headerName: '거래처명', field: 'evdCustNm', width: 200, cellStyle:{textAlign: 'left'}},
            {headerName: '지급처명', field: 'payCustNm', width: 200, cellStyle:{textAlign: 'left'}},
            {headerName: '전표내용', field: 'hdSgtxt', width: 200, cellStyle:{textAlign: 'left'}},
            {
              headerName:'', 
              field:'slipStatCd', 
              width:140,
              hide:true
            },
            {
              headerName:'', 
              field:'slipTypeCd', 
              width:140,
              hide:true
            },
            {
              headerName:'ERP전송상태', 
              field:'erpStatus', 
              width:140,
              cellRenderer: (params) => { 
                  if(params.data.erpStatus !== ''){
                      return '<div style="text-decoration: underline; text-underline-position: under; color:blue;">'+params.data.erpStatus+'</div>'
                  }
              }
            },
            {
              headerName:'ERP재전송', 
              field:'reCreate', 
              width:140,
              cellRenderer: (params) => { 
                  if(params.data.reCreate === '1'){
                      return '<button type="button" class="btn-type1 btn-yellow" style="width:100%; height:100%; border-radius: 4px; border: 2px solid #f44336; color:#f44336">재전송</button'
                  }
              }
            },
            {
              headerName:'지급예정일',
              field:'payDueDt',
              width:140,
              valueFormatter: (params) => {
                if(!_.isEmpty(params.value)){
                  return that.$moment(params.value).format('YYYY-MM-DD');
                }else{
                  return null
                }
              }
            },
            {
              headerName:'정산일',
              field:'calcuDt',
              width:140,
              cellRenderer: (params) => {
                  if(!_.isEmpty(params.value)){
                    return this.$moment(params.value).format('YYYY-MM-DD')
                  }else{
                    return null
                  }
              }
            },
            {headerName: '거래처코드', field: 'evdCustCd', width: 120, cellStyle:{textAlign: 'left'}, hide:true},
            {headerName: '지급처코드', field: 'payCustCd', width: 140, cellStyle:{textAlign: 'left'}, hide:true},
            {
              headerName: '가맹점명', 
              field: 'merchNm', 
              width: 140, 
              cellStyle:{textAlign: 'left'},
              hide: true,
            },
            {
              headerName: '가맹점주소', 
              field: 'merchAddr', 
              width: 200, 
              cellStyle:{textAlign: 'left'},
              hide: true
            },
            {
              headerName: '업종명', 
              field: 'mccName', 
              width: 140, 
              cellStyle:{textAlign: 'left'},
              hide: true
            },
            {
              headerName: '승인일자', 
              field: 'apprDate', 
              width: 140, 
              cellStyle:{textAlign: 'left'},
              valueFormatter: function(params) {   
                if(!_.isEmpty(params.value)){
                  return that.$moment(params.value).format('YYYY-MM-DD');
                }else{
                  return '';
                }
              },
              hide: true
            },
            {
              headerName: '승인시각', 
              field: 'apprTime', 
              width: 140, 
              cellStyle:{textAlign: 'left'},
              valueFormatter: function(params) {               
                if(!_.isEmpty(params.value)){
                  return that.$moment(params.value).format('YYYY-MM-DD');
                }else{
                  return '';
                }
              },
              hide: true
            },
        ];
    },
    onCellClicked(params) {
                
        var field = params.colDef.field;

        if(field === "erpStatus"){
            
              this.$modal.open({
                component: ErpItfErrModal,
                parent: this,
                props: {
                    grSlipNo: params.data.grSlipNo,
                },
                width: 600
            })
            
        }else if(field === 'reCreate'){
          if(params.data.reCreate === '1'){
            this.$store.commit('loading')
            this.$http.get('/api/slip/history/erpReTrans/'+params.data.grSlipNo)
            .then(response => {
                if (response.data) {
                    this.$swal({type: 'success', text: '재전송 성공하였습니다.'});

                    this.goSearch();
                }
            }).finally(() => {
                this.$store.commit('finish')
            });
          }else{
            return;
          }

        }
    },
    rowDoubleClick(params){

      switch(params.data.slipTypeCd) {
        case 'E1': case 'E2': case 'E3': case 'E4': case 'E5':
          this.$modal.open({
            component: SlipModal,
            props: {
              eaSlipNo: params.data.grSlipNo,
              grSlipNo: params.data.grSlipNo,
              value: params.data
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
              value: params.data, //2020.05.21 재경검인, 재경반려 추가를 위한 선택한 row 데이터 전달
              docMngNo: params.data.apprNo //결재선 라인 추가
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
              value: params.data, //2020.05.21 재경검인, 재경반려 추가를 위한 선택한 row 데이터 전달,
              docMngNo: params.data.apprNo //결재선 라인 추가
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
              value: params.data, //2020.05.21 재경검인, 재경반려 추가를 위한 선택한 row 데이터 전달,
              docMngNo: params.data.apprNo //결재선 라인 추가
            },
            parent: this,
            width: 1200
          })
          break
        case 'E14':
          this.$modal.open({
            component: SlipEtcDetailModal,
            props: {
              grSlipNo: params.data.grSlipNo,
              slipTypeCd: params.data.slipTypeCd,
              title: '기타전표',
              value: params.data, //2020.05.21 재경검인, 재경반려 추가를 위한 선택한 row 데이터 전달
              docMngNo: params.data.apprNo //결재선 라인 추가
            },
            parent: this,
            width: 1200
          })
          break
        default :
          break
      }
    },
    changeSlipType(){
      
      if(this.slipTypeCd === 'E1'){
        this.gridOptions.columnApi.setColumnVisible('merchNm', true);
        this.gridOptions.columnApi.setColumnVisible('merchAddr', true);
        this.gridOptions.columnApi.setColumnVisible('mccName', true);
        this.gridOptions.columnApi.setColumnVisible('apprDate', true);
        this.gridOptions.columnApi.setColumnVisible('apprTime', true);
      }else{
        this.gridOptions.columnApi.setColumnVisible('merchNm', false);
        this.gridOptions.columnApi.setColumnVisible('merchAddr', false);
        this.gridOptions.columnApi.setColumnVisible('mccName', false);
        this.gridOptions.columnApi.setColumnVisible('apprDate', false);
        this.gridOptions.columnApi.setColumnVisible('apprTime', false);
      }
    },
    cellValueChange(params){
      if(params.data.useYn){
        this.totalAmt = Number(this.totalAmt) + Number(params.data.totAmt);
      }else{
        this.totalAmt = Number(this.totalAmt) - Number(params.data.totAmt);
      }
    },
    goSearch() {
      var params ={
        postDtFrom: this.postDtFrom,
        postDtTo: this.postDtTo,
        evdDtFrom: this.evdDtFrom,
        evdDtTo:  this.evdDtTo,
        wrtDeptCd: this.wrtDeptCd,
        wrtDeptNm: this.wrtDeptNm,
        eaSlipNo: this.eaSlipNo,
        slipTypeCd: this.slipTypeCd,
        payCustNm: this.payCustNm,
        wrtId: this.wrtId,
        wrtNm: this.wrtNm,
        wrtDutNm: this.wrtDutNm,
        wrtCctrNm: this.wrtCctrNm,
        erpSlipNo: this.erpSlipNo,
        slipStatCd: this.$route.params.fixSlipStatCd ? this.$route.params.fixSlipStatCd : this.slipStatCd,
        evdCustNm: this.evdCustNm,
        acctFlag: 'Y',
        grSlipNo:this.grSlipNo,
        exReUsed:this.exReUsed ? 'Y' : 'N',
        payDueDtFrom:this.payDueDtFrom,
        payDueDtTo:this.payDueDtTo,
      }

      this.$store.commit('loading')
      this.$http.post('/api/slip/history', params)
        .then(response => {
          this.apprRsn = undefined
          this.data = response.data.map(x => {
            x.chk = false
            return x
          })
          this.totalAmt = 0
          this.chkYn = false;
        })
        .finally(() => {
          this.$store.commit('finish')
        })
        document.getElementById("open-moda").style.opacity = "0";
        document.getElementById("open-moda").style.pointerEvents = "none";
    },
    openModal() {
        document.getElementById("open-moda").style.opacity = "1";
        document.getElementById("open-moda").style.pointerEvents = "auto";
    },
    closeModal() {
        document.getElementById("open-moda").style.opacity = "0";
        document.getElementById("open-moda").style.pointerEvents = "none";
    },

    toExcel() {
      var params = {
        fileName : "전표내역"
      };
      this.gridOptions.api.exportDataAsCsv(params)
    },
    getParams() {
      return {
        // suppressQuotes: none,
        // columnSeparator: none,
      };
    },
    getSilpType(){

      this.$http.get('/api/code/combo', {
        params: {
          groupCd: 'SLIP_TYPE_CD'
        }
      }).then(response => {
        this.slipTypeList = response.data
      })

    },
    getSilpStat(){

      this.$http.get('/api/code/detail', {
        params: {
          groupCd: 'SLIP_STAT_CD'
        }
      }).then(response => {
        this.slipStatList = response.data.filter(x => x.remark1 === 'Y' && x.detailCd >= '50')
      })

    },
    setSilpStat(){
      if(!_.isEmpty(this.$route.params.fixSlipStatCd)){
        this.isFixSlipStat = true
        this.slipStatCd = this.$route.params.fixSlipStatCd
        this.postDtFrom = ''
        this.postDtTo = ''
        this.goSearch()
      }else{
        this.isFixSlipStat = false
      }
    },
    popCctr() {
        const that = this;

        this.$modal.open({
            component: Cctr,
            parent: this,
            props: {
                param: this.wrtDeptNm
            },
            width: 700,
            events: {
                close(obj) {
                    that.wrtDeptCd = obj.cctrCd;
                    that.wrtDeptNm = obj.cctrNm;
                }
            }
        });
    },
    initCctr() {
        if (this.wrtDeptNm === '') this.wrtDeptCd = '';
    },
    popWrite() {
        const that = this;

        this.$modal.open({
            component: Emp,
            parent: this,
            props: {
                param: this.wrtNm,
                header: '작성자 조회'
            },
            width: 700,
            events: {
                close(obj) {
                  that.wrtId = obj.empNo,
                  that.wrtNm = obj.empNm,
                  that.wrtDutNm = obj.dutNm,
                  that.wrtCctrNm = obj.deptNm
                }
            }
        });
    },
    initWrite() {
        if (this.wrtNm === ''){
          this.wrtId = ''
          this.wrtNm = ''
          this.wrtDutNm = ''
          this.wrtCctrNm = ''
        }
    },
    allChk(){

      var filterList = [];

      this.gridOptions.api.forEachNodeAfterFilter((v, i) => {
          filterList.push(v.data.grSlipNo)
      })

      this.chkYn = this.chkYn ? false : true;

      for(var i=0; i<filterList.length; i++){
          for(var j=0; j<this.data.length; j++){
              if(filterList[i] === this.data[j].grSlipNo){
                this.data[j].useYn = this.chkYn;
                if (this.chkYn) {
                  this.cellValueChange({ data: this.data[j] });
                }else{
                  this.totalAmt = 0;
                }
              }
          }
      }

      var size = this.$refs.grid.$children.length;
      for(var k=0; k<size; k++){
          this.$refs.grid.$children[k].select = this.chkYn;
      }
      
    },
    approvalingChck(){
      if(this.slipStatCd === '50' || this.slipStatCd === '64' || this.slipStatCd === '65'){
        return true;
      }else{
        return false;
      }
    },
    approvalChck(){
      if(this.slipStatCd === '66'){
        return true;
      }else{
        return false;
      }
    },
    apprRejChck(){
      if(this.slipStatCd !== '70' && this.slipStatCd !== ''){
        return true;
      }else{
        return false;
      }
    },
    dateSetting(str,type){
      var typeFrom = type.concat('From')
      var typeTo = type.concat('To')

      switch (str) {
        case 'toDay':
          this[typeFrom] = this.$moment().format('YYYYMMDD')
          this[typeTo] = this.$moment().format('YYYYMMDD')
          break;
        case 'crrntMnth':
          this[typeFrom] = this.$moment().startOf('month').format('YYYYMMDD')
          this[typeTo] = this.$moment().endOf('month').format('YYYYMMDD')
          break;
        case 'PrvsMnth':
          this[typeFrom] = this.$moment().add(-1, 'month').startOf('month').format('YYYYMMDD')
          this[typeTo] = this.$moment().add(-1, 'month').endOf('month').format('YYYYMMDD')
          break;
      }
      // this.goSearch()
    }
  },
  beforeMount(){
    const that = this;

    this.makeColDef();
    this.defaultColDef = { resizable: true, filter:true, sortable: true };
    this.gridOptions = {
      onFilterChanged: () => {
        that.chkYn = false;
        that.totalAmt = 0;

        for(var j=0; j<that.data.length; j++){
          that.data[j].useYn = that.chkYn
        }

        var size = that.$refs.grid.$children.length;
        for(var k=0; k<size; k++){
            that.$refs.grid.$children[k].select = that.chkYn;
        }

      }
    }
  },
  created() {
    document.title = '전표 관리 - IJEAS';
    this.getSilpType();
    this.getSilpStat();
    this.setSilpStat();
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
