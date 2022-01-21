<template>
<div class="inner-box">
  <div class="content-name">
    <h2 class="dp-ib">개인비용(경비)신청서</h2>
    <div class="btn-wrap btn-type1 clearfix">
      <button class="btn-size btn-blue fl_left" @click="submitViewButton" v-show="grSlipNoChk && slipStatCd !=='10'">
        <span class="btn-icon"><i class="fas fa-vote-yea"></i></span>
        결재보기
      </button>
      <button class="btn-size btn-orange fl_left" @click="buttonEventCopyNew" v-show="slipStatCd ==='40' || slipStatCd ==='60'">
        <span class="btn-icon"><i class="far fa-clone"></i></span>
        전표복사
      </button>
      <button class="btn-size btn-orange fl_left" @click="buttonEventCopyNew" v-show="slipStatCd ==='70' && (slipTypeCd == 'E2' || slipTypeCd == 'E4')">
        <span class="btn-icon"><i class="far fa-clone"></i></span>
        전표복사
      </button>
      <button class="btn-size btn-blue fl_left" @click="submitButton" v-show="grSlipNoChk && slipStatCd ==='10'">
        <span class="btn-icon">
          <i class="fas fa-pen-alt"></i>
        </span>
        결재상신
      </button>
      <button class="btn-size btn-gray fl_left" @click="buttonEventCreate" v-show="slipStatCd ==='10'">
        <span class="btn-icon">
          <i class="far fa-file"></i>
        </span>
        신규
      </button>
      <button class="btn-size btn-gray fl_left" @click="deleteButton" v-show="grSlipNoChk && slipStatCd ==='10'">
        <span class="btn-icon">
          <i class="far fa-trash-alt"></i>
        </span>
        삭제
      </button>
      <button class="btn-size btn-blue fl_left" @click="saveButton" v-show="slipStatCd ==='10'">
        <span class="btn-icon">
          <i class="fas fa-save"></i>
        </span>
        저장
      </button>
    </div>
  </div>
  <!-- TABLE  -->
  <div class="table-area" v-if="slipStatCd === '10'">
    <div class="table-a fixed-th">
      <div class="table-name">
        <h3 class="ico_table_name">기본정보</h3>
      </div>
      <table class="table">
        <colgroup>
          <col width="10%;">
          <col width="17%;">
          <col width="8%;">
          <col width="10%;">
          <col width="8%;">
          <col width="10%;">
          <col width="8%;">
          <col width="10%;">
          <col width="8%;">
          <col width="8%;">          
        </colgroup>        
        <tbody>
          <tr>
            <th>신청번호</th>
            <td>
              <template v-if="grSlipNoChk">
                <input type="text" class="input" v-model="grSlipNo" disabled/>
              </template>
              <template v-else>
                <input type="text" class="input" disabled/>
              </template>
            </td>
            <th class="tp-a">신청일자</th>
            <td colspan='3'>
              <div class="datepicker w-type-ymd">
                  <dhx-calendar class="input ddate sDate" v-model="eaSlipDt"/>
              </div>
            </td>
            <th>진행상태</th>
            <td  colspan='3'>
              <input type="text" disabled="disabled" class="input" v-model="slipStatNm">
            </td>
          </tr>
          <tr>
              <th>작성부서</th>
              <td>{{ wrtDeptCd }} / {{ wrtDeptNm }}</td>
              <th>직원</th>
              <td colspan='3'>{{ empNo }} / {{ empNm }}</td>
              <th>지급조건</th>
              <td>
                <div class="control select is-fullwidth">
                  <span class="select is-empty">
                    <select class="select is-fullwidth" v-model="payTermCd">
                      <option v-for="opt in payTermCdList" :key="opt.detailCd" :value="opt.detailNm" v-text="opt.detailNm" />
                    </select>
                  </span>
                </div>
              </td>
              <th class="tp-a">지급예정일</th> 
              <td>
                  <div class="datepicker w-type-ymd">
                    <dhx-calendar class="input ddate sDate" v-model="payDueDt"/>
                  </div>
              </td>              
          </tr>
          <tr>
              <th>부채계정</th>
              <td>
                <div class="control select is-fullwidth">
                  <span class="select is-empty">
                    <select class="select is-fullwidth" v-model="lbltAcctCd">
                      <option v-for="opt in lbltAcctCdList" :key="opt.key" :value="opt.value" v-text="opt.value" />
                    </select>
                  </span>
                </div>
              </td>
              <th>총 금액</th>
              <td>
                <number-input class="input" v-model="totAmt" :disabled="true" />
              </td>
              <th>통화</th>
              <td>
                <input type="text" class="input" v-model="curCd" disabled/>
              </td>
              <th>지급비고란</th>
              <td colspan="3"><input class="input" type="text" v-model="payText"/></td>              
          </tr>
          <tr>
              <th class="tp-a">적요</th>
              <td colspan="9">
                <input type="text" class="input" v-model="hdSgtxt"/>
              </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <div class="table-area" v-else>
    <div class="table-a fixed-th">
      <div class="table-name">
        <h3 class="ico_table_name">기본정보</h3>
      </div>
      <table class="table">
        <colgroup>
          <col width="10%;">
          <col width="17%;">
          <col width="8%;">
          <col width="10%;">
          <col width="8%;">
          <col width="10%;">
          <col width="8%;">
          <col width="10%;">
          <col width="8%;">
          <col width="8%;">
        </colgroup>
        <tbody>
          <tr>
            <th>신청번호</th>
            <td>
              {{grSlipNo}}
            </td>
            <th>신청일자</th>
            <td colspan='3'>
              <div class="datepicker w-type-ymd">
                {{$moment(eaSlipDt).format('YYYY-MM-DD')}}
              </div>
            </td>
            <th>진행상태</th>
            <td colspan='3'>
              {{slipStatNm}}
            </td>
          </tr>
          <tr>
              <th>작성부서</th>
              <td>{{baseDeptCd}} / {{baseDeptNm}}</td>
              <th>직원</th>
              <td colspan='3'>{{ empNo }} / {{ empNm }}</td>
              <th>지급조건</th>
              <td>
                {{payTermCd}}
              </td>
              <th>지급예정일</th> 
              <td>
                  <div class="datepicker w-type-ymd">
                    {{payDueDt === null || payDueDt === '' ? '' : $moment(payDueDt).format('YYYY-MM-DD')}}
                  </div>
              </td>               
          </tr>
          <tr>
              <th>부채계정</th>
              <td>
                {{lbltAcctCd}}
              </td>
              <th>총 금액</th>
              <td>
                {{$numeral(totAmt).format('0,0')}}
              </td>
              <th>통화</th>
              <td>
                {{curCd}}
              </td>
              <th>지급비고란</th>
              <td colspan="3">{{payText}}</td>                   
          </tr>
          <tr>
              <th>적요</th>
              <td colspan="9">
                {{hdSgtxt}}
              </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <!-- TABLE  -->

  <!-- GRID -->
  <div class="inner-box">
    <div class="table-b">
      <div class="table-header">
        <div class="table-name">
          <h3 class="ico_table_name">법인카드지급</h3>
        </div>
        <div class="btn-wrap btn-type2" v-show="slipStatCd === '10'">
          <button class="btn-size btn-w-gray" @click="buttenClickEventCrdList()">
            <span class="btn-icon">
              <i class="far fa-file-alt"></i>
            </span>
            법인카드내역
          </button>
          <button class="btn-size btn-w-gray" @click="buttenClickEventReset()">
            <span class="btn-icon">
              <i class="fas fa-redo"></i>
            </span>
            초기화
          </button>
          <button class="btn-size btn-w-gray" @click="buttonClickEventRemove()">
            <span class="btn-icon">
              <i class="fas fa-trash-alt"></i>
            </span>
            행삭제
          </button>
        </div>
        <div class="grid-tbl-box">
          <ag-grid-vue ref="grid"
                      style="padding-top: 40px; width: 100%;height: 280px;"
                      class="ag-theme-alpine"    
                      rowSelection="single"
                      
                      :columnDefs="columnDef"     
                      :gridOptions="gridOptions"
                      :rowData="rowData"
                      :defaultColDef="defaultColDef"
                      :frameworkComponents="frameworkComponent"
                      @cell-value-changed="cellValueChange"/>
        </div>
      </div>
    </div>

    <div class="table-b">
      <div class="table-header">
        <div class="table-name">
          <h3 class="ico_table_name">현금지급</h3>
        </div>
        <div class="btn-wrap btn-type2" v-show="slipStatCd === '10'">
          <button class="btn-size btn-w-gray" @click="buttenClickEventCopy2()">
            <span class="btn-icon">
              <i class="far fa-window-restore"></i>
            </span>
            행복사
          </button>
          <button class="btn-size btn-w-gray" @click="buttonClickEventAdd2()">
            <span class="btn-icon">
              <i class="fas fa-plus"></i>
            </span>
            행추가
          </button>
          <button class="btn-size btn-w-gray" @click="buttonClickEventRemove2()">
            <span class="btn-icon">
              <i class="fas fa-trash-alt"></i>
            </span>
            행삭제
          </button>
        </div>
          <div class="grid-tbl-box">
          <ag-grid-vue ref="grid"
                      style="padding-top: 40px; width: 100%;height: 280px;"
                      class="ag-theme-alpine"    
                      rowSelection="single"
                      :columnDefs="columnDefSub"     
                      :gridOptions="gridOptionsSub"
                      :rowData="rowDataSub"
                      :defaultColDef="defaultColDef"
                      :frameworkComponents="frameworkComponent"
                      @cell-value-changed="cellValueChange"/>
        </div>
      </div>
    </div>
  </div>
  <!-- GRID -->

  <!--파일업로드-->
  <div class="file-upload">
    <div class="table-name">
      <h3 class="ico_table_name">Wings 문서</h3>
    </div>
    <div class="file has-name">
      <div class="file-label" @click="openUploadWingsPopup()">
        <span class="file-cta">
          <span class="file-label"> Wings 문서</span>
          <span class="icon-bar"><img src="/img/bar.png" alt="" /></span>
        </span>
        <span class="file-name">{{ this.$numeral(wingsFileSize).format('00') }}<i class="far fa-file-alt"></i></span>
      </div>
    </div>
  </div>
  <!--//파일업로드-->

</div>

</template>

<script>
import _ from 'lodash';
import slip from '@/mixin/slip-basic';
import mixin from '@/mixin/slip-common';
import mixinSlip from '@/mixin/slip';
import DhxCalendar from '@/components/DhxCalendar';
import NumberInput from '@/components/NumberInput.vue';
import {AgGridVue} from 'ag-grid-vue';
import SlipCrdLstModalNew from '@/components/SlipCrdLstModal_New.vue';
import AgGridSearchBtn from "@/components/agGrid/AgGridSearchBtn.vue";
import AgGridCardInfo from "@/components/agGrid/AgGridCardInfo.vue";
import AgGridScanAttach from "@/components/agGrid/AgGridScanAttach.vue";
import AgDhxCalendar from "@/components/agGrid/AgDhxCalendar.vue";
//import AgGridSelectBox from "@/components/agGrid/AgGridSelectBox.vue";
import ErpCctrNew from '@/components/ErpCctr_Ag.vue';
import ErpAccountNew from '@/components/ErpAccount_Ag.vue';
import ErpAccountSubNew from '@/components/ErpAccountSub_Ag.vue';
import SlipMngItemPop from '@/components/SlipMngItemPop.vue';
import SlipMngItemPopSub from '@/components/SlipMngItemPopSub.vue';
import ProductNew from '@/components/Product_Ag.vue';
import CardInfoDetailPop from '@/components/CardInfoDetailPop.vue';
import EvidAtchPop from '@/components/EvidAtchPop.vue';
import WingsAtchPop from '@/components/WingsAtchPop.vue';
import ApprSubm from '@/views/ApprSubm_New.vue'

export default {
  mixins: [slip, mixin, mixinSlip],
  components: {
    DhxCalendar, 
    NumberInput, 
    AgGridVue
  },
  data() {
    return {
      name: 'pExpense',
      compCd: '',
      slipTypeCd: 'E1',
      evdDt: this.$moment().format('YYYYMMDD'),
      eaSlipDt: this.$moment().format('YYYYMMDD'),
      postDt: this.$moment().format('YYYYMMDD'),
      slipStatCd: '10',
      slipStatNm: '',
      evdTypeCd: '10',
      stlFgCd: 'N',
      useTypeCd: '',
      sysFgCd: 'W',
      taxCd: '',
      cardTaxCd: '',
      evdCustCd: '',
      evdCustNm: '',
      evdCustBizNo: '',
      custUseYn: 'Y',
      custAcctNo: '',
      custBnkCd: '',
      totAmt: 0,
      curCd: 'KRW',
      payTermCd: '',
      payTermCdList: [],
      payDueDt: '',
      payText: '',      
      wrtDtm: '',
      wrtId: '',
      wrtDeptCd: '',
      wrtDeptNm: '',
      baseDeptCd: '',
      baseDeptNm: '',
      baseDeptGrCd: '',
      sgaProductCd : '9999999', //판관부서 현장(계약코드)
      empNo: '',
      empNm: '',
      apAcctCd: '',
      lbltAcctCd: '',
      lbltAcctCdList: [],
      stnAcctCd: '',
      expItemCnt: '',
      hdSgtxt: '',
      fnlApprDtm: '',
      fnlAprverId: '',
      elecApprId: '',
      elecApprDtm: '',
      apprRsn: '',
      evdMngNo: '',
      evidFileSize: 0,
      wingsFileSize: 0,
      regId: '',
      regDtm: '',
      chgId: '',
      chgDtm: '',
      useYn: 'N',
      columnDef: [],
      defaultColDef: {
          resizable: true
        , filter:true
        , sortable: true 
      },
      gridOptions: {},
      rowData:[],
      data1: '',
      vatList: [],
      tpsTypeList: [],
      oilKindList: [],
      frameworkComponent : {
        'schBtn' : AgGridSearchBtn,
        'cardInfo' : AgGridCardInfo,
        'scanAttach' : AgGridScanAttach,
        //'selectBox' : AgGridSelectBox,
        'calendar' : AgDhxCalendar
      },
      columnDefSub: [],
      gridOptionsSub: {},
      rowDataSub:[],
      data:{},
      vatAcctCd:'',
      vatAcctNm:'',
      grSlipNoChk: false,
      chkDetail: false,
      rowIdx: '',
      tempData: [],
      tmpSlipNo: ''
    }
  },
  destroyed() {
    // this.$cookie.delete('searchForm')
    // this.$store.commit('searchForm', '');
  },
  created(){
    
    var copy = this.$route.params.copy;
    
    if(!_.isEmpty(this.grSlipNo)){
      this.chkDetail = true;

      if(copy){
        this.grSlipNoChk = false;
      }else{
        this.grSlipNoChk = true;
      }
    }

    if(!this.chkDetail){
      this.wrtDeptCd = this.$store.state.loginInfo.loginDeptCd;
      this.wrtDeptNm = this.$store.state.loginInfo.loginDeptNm;
      this.empNo = this.$store.state.loginInfo.loginId;
      this.empNm = this.$store.state.loginInfo.userName;
      this.getDeptInfo();

      // 임시번호 채번
      this.$http.get(`/api/tmp/documentMngNo`)
      .then(response => {
        this.tmpSlipNo = response.data
      })
    }

    this.queryVatAcct();
    this.getPayTermCd();
    this.getLbltAccount();//부채계정 조회
    
    this.getVatList();
    this.getTpsTypeList();
    this.getOilKindList();

    setTimeout(() => {
      this.makeColumnDef();
      this.getDetail();
    },500);
    
  },
  methods:{
    queryVatAcct() {
      this.$http.get('/api/account/vat')
        .then(response => {
          this.vatAcctCd = response.data.acctCd
          this.vatAcctNm = response.data.acctNm
        }).catch(response => {
          return response
        })
    },
    getDeptInfo(){
      this.$store.commit('loading');
      this.$http.get(`/api/emp/${this.$store.state.loginInfo.loginId}`)
      .then(response => {
        let data = response.data[0];
        this.baseDeptCd = data.liabilityDeptCode;
        this.baseDeptNm = data.liabilityDeptName;
        
          //부서 계정 그룹코드 조회(1:판관, 2:원가, COMMON:공통)
          this.$http
            .get('/api/cctr/erp/' + this.baseDeptCd)
            .then(response => {
              this.baseDeptGrCd = response.data[0].expenseFlag;
            })

      })
      .catch((e) => {
        this.$swal({
          type: 'error',
          text: e
        })
        this.$store.commit('finish')
      })
      .finally(() => {
        setTimeout(() => {        
          if(this.$route.query.lnk === 'main') {
            this.buttenClickEventCrdList()
          }
        }, 200)
        this.$store.commit('finish')
      })
    },
    getPayTermCd(){
      this.$store.commit('loading')
      
      this.$http.get('/api/code/detail', {params: {groupCd: "PAY_TERM_CD", remark3: this.evdTypeCd}})
      .then(response => {
        this.payTermCdList = response.data;
        if(_.isEmpty(this.payTermCd) && !this.chkDetail){
          this.payTermCd = response.data[0].detailNm;
        }
      }).catch(response => {
        console.error("getPayTermCd Error " + response.message);
      }).finally(() => {
        this.$store.commit('finish')
      })
    },
    getLbltAccount(){
      this.$store.commit('loading')
                          
      this.$http.get('/api/account/liabilities/p')
      .then(response => {
        
        this.lbltAcctCdList = response.data
        
        if(response.data.length == 1 && !this.grSlipNo){  
          this.lbltAcctCd = response.data[0].value
        }

      }).catch(response => {
        console.error("getLbltAccount Error");
      }).finally(() => {
        this.$store.commit('finish')
      })
    },
    makeColumnDef(){
      const that = this;
      this.columnDef = [
        {
          headerName:'No.', 
          filter:false,
          field:'itemSeq', 
          width:60
        },
        {
          headerName:'증빙일자', 
          field:'eaSlipDt', 
          width:110, 
          cellStyle:{textAlign:'left'},
          valueFormatter: (params) => {               
            return that.$moment(params.value).format('YYYY-MM-DD');
          }
        },
        {
          headerName:'부서', 
          field:'deptNm', 
          width:140,
          cellRenderer:'schBtn',
          cellRendererParams:{
            slipStatCd : that.slipStatCd,
            funcNm : 'updateCctr',
            valFuncNm : 'updateCctrVal'
          }
        },
        {
          headerName:'계정명', 
          field:'acctNm', 
          width:180, 
          cellStyle:{textAlign:'left'},
          cellRenderer: 'schBtn',
          cellRendererParams:{
            slipStatCd : that.slipStatCd,
            funcNm : 'updateCtrl',
            valFuncNm : 'updateCtrlVal'
          }
        },
        {
          headerName:'보조계정', 
          field:'acctNmSub', 
          width:180, 
          cellStyle:{textAlign:'left'},
          cellRenderer: 'schBtn',
          cellRendererParams:{
            slipStatCd : that.slipStatCd,
            funcNm : 'updateAcctSub',
            valFuncNm : 'updateAcctSubVal'
          }
        },
        {
          headerName:'', 
          field:'dffField', 
          width:50, 
          cellStyle:{textAlign:'left'},
          cellRenderer: 'schBtn',
          cellRendererParams:{
            slipStatCd : that.slipStatCd,
            funcNm : 'updateDff',
          },
        },
        {
          headerName:'현장(계약번호)', 
          field:'detailNm', 
          width:150, 
          cellStyle:{textAlign:'left'},
          cellRenderer: 'schBtn',
          cellRendererParams:{
            slipStatCd : that.slipStatCd,
            funcNm : 'updateProd',
            valFuncNm : 'updateProdVal'
          }
        },
        {
          headerName:'세금코드', 
          field:'vatCd', 
          width: 120, 
          cellStyle:{textAlign:'left'},
          editable : () => {
            if(that.slipStatCd === '10'){
              return true
            }else{
              return false
            }
          },
          cellEditor: 'agSelectCellEditor',
          cellEditorParams: () => {
            return {values : that.vatList.map(v=>v.taxCd)}
          },
          valueFormatter: (params) => {               
            return that.makeValueList(that.vatList, params)
          }
        },
        {
          headerName:'공급가액', 
          field:'supAmt', 
          width:100, 
          cellStyle:{textAlign:'right'},
          valueFormatter: (params) => { 
            return that.getNumberFormat(params.value);
          }
        },
        {
          headerName:'세액', 
          field:'vatAmt', 
          width:100, 
          cellStyle:{textAlign:'right'},
          valueFormatter: (params) => { 
            return that.getNumberFormat(params.value);
          }
        },
        {
          headerName:'금액', 
          field:'useAmt', 
          width:100, 
          cellStyle:{textAlign:'right'},
          valueFormatter: (params) => { 
            return that.getNumberFormat(params.value);
          }
        },
        {headerName:'적요', field:'lnSgtxt', width:200, cellStyle:{textAlign:'left'}, editable: true},
        {headerName:'가맹점명', field:'crdMerchNm', width:120, cellStyle:{textAlign:'left'}},
        {
          headerName:'카드정보', 
          field:'crdInfo', 
          width:120, 
          cellStyle:{textAlign:'center'},
          cellRenderer: 'cardInfo'
        },
        {
          headerName:'스캔증빙', 
          field:'scanCt', 
          width:120, 
          cellStyle:{textAlign:'center'},
          cellRenderer: 'scanAttach',
          cellRendererParams:{
            funcNm : 'openAttachPopup'
          }
        },
        {headerName:'전표번호', field:'eaSlipNo', width:120, cellStyle:{textAlign:'left'}, hide:true},
        {headerName:'attribute1', field:'attribute1', editable: false, hide: true},
        {headerName:'attribute2', field:'attribute2', editable: false, hide: true},
        {headerName:'attribute3', field:'attribute3', editable: false, hide: true},
        {headerName:'attribute4', field:'attribute4', editable: false, hide: true},
        {headerName:'attribute5', field:'attribute5', editable: false, hide: true},
        {headerName:'attribute6', field:'attribute6', editable: false, hide: true},
        {headerName:'attribute7', field:'attribute7', editable: false, hide: true},
        {headerName:'attribute8', field:'attribute8', editable: false, hide: true},
        {headerName:'attribute9', field:'attribute9', editable: false, hide: true},
        {headerName:'attribute10', field:'attribute10', editable: false, hide: true},
        {headerName:'attribute11', field:'attribute11', editable: false, hide: true},
        {headerName:'attribute12', field:'attribute12', editable: false, hide: true},
        {headerName:'attribute13', field:'attribute13', editable: false, hide: true},
        {headerName:'attribute14', field:'attribute14', editable: false, hide: true},
        {headerName:'attribute15', field:'attribute15', editable: false, hide: true},
      ];

      this.columnDefSub = [
        {
          headerName:'No.', 
          filter:false,
          field:'itemSeq', 
          width:60
        },
        {
          headerName:'증빙일자', 
          field:'eaSlipDt', 
          width:110, 
          cellStyle:{textAlign:'left'},
          cellRenderer: 'calendar',
          valueFormatter: (params) => {               
            return that.$moment(params.value).format('YYYY-MM-DD');
          }
        },
        {
          headerName:'부서', 
          field:'deptNm', 
          width:140,
          cellRenderer: 'schBtn',
          cellRendererParams:{
            slipStatCd : that.slipStatCd,
            funcNm : 'updateCctr2',
            valFuncNm : 'updateCctrVal2'
          }
        },
        {
          headerName:'계정명', 
          field:'acctNm2', 
          width: 180, 
          cellStyle:{textAlign:'left'},
          cellRenderer: 'schBtn',
          cellRendererParams:{
            slipStatCd : that.slipStatCd,
            funcNm : 'updateCtrl2',
            valFuncNm : 'updateCtrlVal2'
          }
        },
        {
          headerName:'보조계정', 
          field:'acctNmSub2', 
          width: 180, 
          cellStyle:{textAlign:'left'},
          cellRenderer: 'schBtn',
          cellRendererParams:{
            slipStatCd : that.slipStatCd,
            funcNm : 'updateAcctSub2',
            valFuncNm : 'updateAcctSubVal2'
          }
        },
        {
          headerName:'', 
          field:'dffField',
          filter:false, 
          width:50, 
          cellStyle:{textAlign:'left'},
          cellRenderer: 'schBtn',
          cellRendererParams:{
            slipStatCd : that.slipStatCd,
            funcNm : 'updateDff2'
          },
        },
        {
          headerName:'현장(계약번호)', 
          field:'detailNm2', 
          width:150, 
          cellStyle:{textAlign:'left'},
          cellRenderer: 'schBtn',
          cellRendererParams:{
            slipStatCd : that.slipStatCd,
            funcNm : 'updateProd2',
            valFuncNm : 'updateProdVal2'
          }
        },
        {
          headerName:'금액', 
          field:'useAmt2', 
          width:100, 
          cellStyle:{textAlign:'right'},
          editable : () => {
            if(that.slipStatCd === '10'){
              return true
            }else{
              return false
            }
          },
          valueFormatter: (params) => {               
            return that.chkNumber(params, 'sub');
          }
        },
        {headerName:'적요', field:'lnSgtxt', width:200, cellStyle:{textAlign:'left'}, editable: true},
        {
          headerName:'스캔증빙', 
          field:'scanCt', 
          filter:false,
          width:80, 
          cellStyle:{textAlign:'center'},
          cellRenderer: 'scanAttach',
          cellRendererParams:{
            funcNm : 'openAttachPopup2'
          }
        },
        {headerName:'가맹점', field:'storeNm', width:120, cellStyle:{textAlign:'left'}, editable: true},
        {headerName:'주소', field:'address', width:250, cellStyle:{textAlign:'left'}, editable: true},
        {headerName:'attribute1', field:'attribute1', editable: false, hide: true},
        {headerName:'attribute2', field:'attribute2', editable: false, hide: true},
        {headerName:'attribute3', field:'attribute3', editable: false, hide: true},
        {headerName:'attribute4', field:'attribute4', editable: false, hide: true},
        {headerName:'attribute5', field:'attribute5', editable: false, hide: true},
        {headerName:'attribute6', field:'attribute6', editable: false, hide: true},
        {headerName:'attribute7', field:'attribute7', editable: false, hide: true},
        {headerName:'attribute8', field:'attribute8', editable: false, hide: true},
        {headerName:'attribute9', field:'attribute9', editable: false, hide: true},
        {headerName:'attribute10', field:'attribute10', editable: false, hide: true},
        {headerName:'attribute11', field:'attribute11', editable: false, hide: true},
        {headerName:'attribute12', field:'attribute12', editable: false, hide: true},
        {headerName:'attribute13', field:'attribute13', editable: false, hide: true},
        {headerName:'attribute14', field:'attribute14', editable: false, hide: true},
        {headerName:'attribute15', field:'attribute15', editable: false, hide: true},
      ];
    },
    makeValueList(data, param){
      if(!_.isEmpty(data)){

        if(param.colDef.field === 'vatCd'){
          for(var i=0; i<data.length; i++){
            if(data[i].taxCd === param.value){
              return data[i].taxNm;
            }
          }
        }
        // else if(param.colDef.field === 'tpsTypeCd' || param.colDef.field === 'oilKindCd'){
        //   for(var j=0; j<data.length; j++){
        //     if(data[j].detailCd === param.value){
        //       return data[j].detailNm;
        //     }
        //   }
        // }

      }else{
        return [];
      }
    },
    chkNumber(params, flag){

      var result = '';
      var val = params.value;
      var data = this.rowData;

      if(flag === 'sub'){
        data = this.rowDataSub;
      }

      if(!_.isEmpty(val) || _.isNumber(val)){
        val = val.toString();
        result = this.$numeral(val).format('0,0');
        data[params.node.rowIndex][params.column.colId] = this.$numeral(val).value();
      }
      
      return result
    },
    buttenClickEventCrdList() {
      const vm = this
      
      this.$modal.open({
        component: SlipCrdLstModalNew,
        parent: this,
        props: {
          deptCd: this.baseDeptCd,
          slipTypeCd: this.slipTypeCd,
          copyUseDetails: vm.rowData, 
          baseDeptGrCd: vm.baseDeptGrCd,
          sgaProductCd: vm.sgaProductCd
        },
        events: {
          close(object) {
            if(object === undefined) {
              return false
            } else {
              
              //2020.05.14 배열 순서 바뀌는 현상 수정(api호출할때 순서 변경되어서 forEach문 밖으로 뺌)
              vm.$http.get(`/api/account/rcp`).then(response => {       
                vm.data1 = response.data.filter(v => v.acctCd === object[0].acctCd && v.rcpYn === 'Y')[0];

                object.forEach(async(x, i) => {
                  vm.$http.get(`/api/tmp/documentMngNo`)
                    .then(response => {x.eaSlipNo = response.data})

                  const result = {
                      dcCd: 'D',
                      lnTypeCd: 'ITEM',
                      useDt: vm.evdDt,
                      //tpsTypeCd: '10',
                      //oilKindCd: 'GSL',
                      //acctAmt: 0,
                      crdNo: x.cardNo,
                      crdMerchBizNo: x.merchBizNo,
                      crdMerchNm: x.merchNm,
                      deptCd: vm.baseDeptCd,
                      deptNm: vm.baseDeptNm,
                      eaSlipDt: vm.$moment(x.apprDate).format('YYYYMMDD'),
                      supAmt: vm.data1 ? x.apprAmt+x.vat : x.apprAmt,
                      useAmt: x.purchTot,
                      vatAmt: vm.data1 ? 0 : x.vat,
                      useDtlsNo: x.useDtlsNo,
                      crdInfo: x.apprNo,
                      apprNo: x.apprNo,
                      eaSlipNo: x.eaSlipNo,
                      detailCd: !_.isEmpty(x.detailCd) ? x.detailCd : '',
                      detailNm: !_.isEmpty(x.detailNm) ? x.detailNm : '',
                      acctCd: x.acctCd,
                      acctNm: x.acctNm,
                      acctCdSub: x.acctCdSub,
                      acctNmSub: x.acctNmSub,
                      lnSgtxt: x.crdOln,
                      vatCd: vm.cardTaxCd,
                      // stptPlc : x.stptPlcPop,
                      // dstnPlc : x.dstnPlcPop,
                      // biztrpObj : x.biztrpObjPop,
                      baseVatAmt: x.vat,
                      baseSupAmt: x.apprAmt,
                      totAmt: x.purchTot,
                      merchOwner: x.merchOwner,
                      isDff: false,
                      reqSubAcct: x.reqSubAcct
                    };

                    vm.rowData.push(result);

                    if((object.length-1) === i) {  //계산 로직 싱크 맞추기 위해서 간단히 체크후 사용
                      vm.setRowNumber();
                      vm.setTotAmt();
                    }
                })// for end
              });
            }// else end
          }
        }
      });
    },
    setRowNumber(){
      _.forEach(this.rowData, (v, i)=>{
        v.itemSeq = i+1;
      });
    },
    setTotAmt(){
      let topAmt = this.rowData.map(x => x.useAmt).reduce((a, v) => a + v);
      this.totAmt = topAmt;
    },
    buttenClickEventReset() {
      this.rowData = [];
      this.totAmt = 0;
    },
    buttonClickEventRemove(){
      var selectedRows = this.gridOptions.api.getSelectedRows();

      if(selectedRows.length > 0){
        var idx = selectedRows[0].itemSeq;
        this.rowData.splice(idx-1, 1);
        this.setRowNumber();
      }else{
        this.$swal({
          type: 'warning',
          text: '선택된 행이 없습니다.'
        });
      }
    },
    updateCctr(){
      
      const that = this;
      const rowNode = this.gridOptions.api.getRowNode(this.rowIdx);
      
      this.$modal.open({
        component: ErpCctrNew,
        parent: this,
        width: 700,
        events: {
          close(object) {
            
            rowNode.setDataValue('deptNm', object.deptNm);
            
            that.rowData[that.rowIdx].deptNm = object.deptNm;
            that.rowData[that.rowIdx].deptCd = object.deptCd;

            //판관부서 현장계약번호 default 세팅
            if(object.expenseFlag === "1"){
              rowNode.setDataValue('detailNm', that.sgaProductCd);
              that.rowData[that.rowIdx].detailCd = that.sgaProductCd;
              that.rowData[that.rowIdx].detailNm = that.sgaProductCd;
            }else{
              rowNode.setDataValue('detailNm', '');
              that.rowData[that.rowIdx].detailCd = '';
              that.rowData[that.rowIdx].detailNm = '';
            }
          }
        }
      });
    },
    updateCctrVal(pVal){
      const that = this;
      const rowNode = this.gridOptions.api.getRowNode(this.rowIdx);
      
      if(pVal){
        this.$http
          .get('/api/cctr/erp/'+ pVal)
          .then(response => {
            
            if(response.data.length == 1){
              rowNode.setDataValue('deptNm', response.data[0].deptNm);
              that.rowData[that.rowIdx].deptNm = response.data[0].deptNm;
              that.rowData[that.rowIdx].deptCd = response.data[0].deptCd;

              //계정 초기화
              rowNode.setDataValue('acctNm', "");
              that.rowData[that.rowIdx].acctCd = "";
              that.rowData[that.rowIdx].acctNm = "";
              //보조계정 초기화
              rowNode.setDataValue('acctNmSub', "");
              that.rowData[that.rowIdx].acctCdSub = "";
              that.rowData[that.rowIdx].acctNmSub = "";
              //관리항목 초기화
              for(var i = 1; i <= 15; i++){
                  that.rowData[that.rowIdx]['attribute'+i] = data['attribute'+i];
              }
              //판관부서 현장계약번호 default 세팅
              if(response.data[0].expenseFlag === "1"){
                rowNode.setDataValue('detailNm', that.sgaProductCd);
                that.rowData[that.rowIdx].detailCd = that.sgaProductCd;
                that.rowData[that.rowIdx].detailNm = that.sgaProductCd;
              }else{
                rowNode.setDataValue('detailNm', '');
                that.rowData[that.rowIdx].detailCd = '';
                that.rowData[that.rowIdx].detailNm = '';
              }
            }else{
              this.updateCctr(pVal);
            }
          })
          
      }else{
        //부서 초기화
        rowNode.setDataValue('deptNm', "");
        that.rowData[that.rowIdx].deptNm = "";
        that.rowData[that.rowIdx].deptCd = "";
        //계정 초기화
        rowNode.setDataValue('acctNm', "");
        that.rowData[that.rowIdx].acctCd = "";
        that.rowData[that.rowIdx].acctNm = "";
        //보조계정 초기화
        rowNode.setDataValue('acctNmSub', "");
        that.rowData[that.rowIdx].acctCdSub = "";
        that.rowData[that.rowIdx].acctNmSub = "";
        
        //현장계약번호 초기화
        rowNode.setDataValue('detailNm', "");
        that.rowData[that.rowIdx].detailCd = "";
        that.rowData[that.rowIdx].detailNm = "";      

        //관리항목 초기화
        for(var i = 1; i <= 15; i++){
            that.rowData[that.rowIdx]['attribute'+i] = data['attribute'+i];
        } 
      }      
    },
		updateCtrlVal(pVal){
      
      const that = this;
      const rowNode = this.gridOptions.api.getRowNode(this.rowIdx);

      if(_.isEmpty(this.rowData[this.rowIdx].deptNm)){
        this.$swal({
          type: 'warning',
          text: '부서를 먼저 선택하기 바랍니다.'
        });
        return;
      }

      if(pVal){
        
        this.$http.get('/api/account/'+this.deptCd+'/'+this.slipTypeCd+'/'+pVal)
        .then(response => {

          if(response.data.length == 1){

            //계정 세팅
            rowNode.setDataValue('acctNm', response.data[0].acctNm);
            that.rowData[that.rowIdx].acctCd = response.data[0].acctCd;
            that.rowData[that.rowIdx].acctNm = response.data[0].acctNm;

            //보조계정 조회
            that.$http.get('/api/account/sub/' + response.data[0].acctCd)
              .then(response => {
                var object = response.data;

                if(object.length === 1){
                  rowNode.setDataValue('acctNmSub', object[0].subAcctNm);

                  that.rowData[that.rowIdx].acctCdSub = object[0].subAcctCd;
                  that.rowData[that.rowIdx].acctNmSub = object[0].subAcctNm;
                  
                  that.rowData[that.rowIdx].reqSubAcct = true;

                }else if(object.length == 0){
                  that.rowData[that.rowIdx].reqSubAcct = false; 

                }else{
                  that.updateAcctSub();
                  
                  that.rowData[that.rowIdx].reqSubAcct = true;
                }
              });

              //관리항목 유뮤 체크
              that.$http.post('/api/slip/managementItem',{acctCd: response.data[0].acctCd})
              .then(response => {
                if(response.data.length === 0){
                  console.log('관리계정 항목이 아닙니다.')
                  that.rowData[that.rowIdx].isDff = false;
                  for(var i = 1; i <= 15; i++){
                    that.rowData[that.rowIdx]['attribute'+i] = ''
                  }
                }else{
                  that.rowData[that.rowIdx].isDff = true;
                }
              });

          }else{

            this.$modal.open({
                component: ErpAccountNew,
                parent: this,
                props: {
                  deptCd: this.rowData[this.rowIdx].deptCd,
                  slipTypeCd: this.slipTypeCd,
                  searchStr: pVal
                },
                width: 700,
                events: {
                  close(object) {
                    rowNode.setDataValue('acctNm', object.acctNm);

                    that.rowData[that.rowIdx].acctCd = object.acctCd;
                    that.rowData[that.rowIdx].acctNm = object.acctNm;

                    that.$http.get('/api/account/sub/'+object.acctCd)
                    .then(response => {
                      var object = response.data;

                      if(object.length === 1){
                        rowNode.setDataValue('acctNmSub', object[0].subAcctNm);

                        that.rowData[that.rowIdx].acctCdSub = object[0].subAcctCd;
                        that.rowData[that.rowIdx].acctNmSub = object[0].subAcctNm;
                        
                        that.rowData[that.rowIdx].reqSubAcct = true;

                      }else if(object.length == 0){
                        that.rowData[that.rowIdx].reqSubAcct = false; 

                      }else{
                        that.updateAcctSub();
                        
                        that.rowData[that.rowIdx].reqSubAcct = true;
                      }
                    });
                    
                    that.$http.post('/api/slip/managementItem',{acctCd:object.acctCd})
                    .then(response => {
                      if(response.data.length === 0){
                        console.log('관리계정 항목이 아닙니다.')
                        that.rowData[that.rowIdx].isDff = false;
                        for(var i = 1; i <= 15; i++){
                          that.rowData[that.rowIdx]['attribute'+i] = ''
                        }
                      }else{
                        that.rowData[that.rowIdx].isDff = true;
                      }
                    });

                  }
                },
            })            

          }
        })
        
      }else{
        
        //계정 초기화
        rowNode.setDataValue('acctNm', "");
        that.rowData[that.rowIdx].acctCd = "";
        that.rowData[that.rowIdx].acctNm = "";
        //보조계정 초기화
        rowNode.setDataValue('acctNmSub', "");
        that.rowData[that.rowIdx].acctCdSub = "";
        that.rowData[that.rowIdx].acctNmSub = "";
        //관리항목 초기화
        for(var i = 1; i <= 15; i++){
            that.rowData[that.rowIdx]['attribute'+i] = data['attribute'+i];
        }
      }
    },
    updateCtrl(){
      const that = this;
      const rowNode = this.gridOptions.api.getRowNode(this.rowIdx);
      
      this.$modal.open({
        component: ErpAccountNew,
        parent: this,
        props: {
          deptCd: this.rowData[that.rowIdx].deptCd,
          slipTypeCd: this.slipTypeCd,
          searchStr: ''
        },
        width: 700,
        events: {
          close(object) {
            rowNode.setDataValue('acctNm', object.acctNm);

            that.rowData[that.rowIdx].acctCd = object.acctCd;
            that.rowData[that.rowIdx].acctNm = object.acctNm;

            that.rowData[that.rowIdx].acctCdSub = "";
            that.rowData[that.rowIdx].acctNmSub = "";

            that.$http.get(`/api/account/rcp`)
            .then(response => {
              let data = response.data.filter(x => x.acctCd === object.acctCd && x.rcpYn === 'Y')[0]
                rowNode.setDataValue('vatCd', that.cardTaxCd);
            });

            that.$http.get('/api/account/sub/'+object.acctCd)
            .then(response => {
              var object = response.data;

              if(object.length === 1){
                rowNode.setDataValue('acctNmSub', object[0].subAcctNm);

                that.rowData[that.rowIdx].acctCdSub = object[0].subAcctCd;
                that.rowData[that.rowIdx].acctNmSub = object[0].subAcctNm;

                that.rowData[that.rowIdx].reqSubAcct = true;
              }else if(object.length == 0){
                that.rowData[that.rowIdx].reqSubAcct = false;

              }else{
                that.updateAcctSub();
                that.rowData[that.rowIdx].reqSubAcct = true;
              }

            });

            that.$http.post('/api/slip/managementItem',{acctCd:object.acctCd})
            .then(response => {
              if(response.data.length === 0){
                console.log('관리계정 항목이 아닙니다.')
                that.rowData[that.rowIdx].isDff = false;
                for(var i = 1; i <= 15; i++){
                  that.rowData[that.rowIdx]['attribute'+i] = ''
                }
              }else{
                that.rowData[that.rowIdx].isDff = true;
              }
            });
          }
        },
      })
    },
    updateAcctSub(){
      const that = this;
      const rowNode = this.gridOptions.api.getRowNode(this.rowIdx);

      if(_.isEmpty(this.rowData[this.rowIdx].acctCd)){
        this.$swal({
          type: 'warning',
          text: '계정을 먼저 선택하기 바랍니다.'
        });
        return;
      }
      
      this.$modal.open({
        component: ErpAccountSubNew,
        parent: this,
        props: {
          deptCd: this.rowData[this.rowIdx].deptCd,
          slipTypeCd: this.slipTypeCd,
          acctCd: this.rowData[this.rowIdx].acctCd
        },
        width: 700,
        events: {
          close(object) {
            rowNode.setDataValue('acctNmSub', object.subAcctNm);

            that.rowData[that.rowIdx].acctCdSub = object.subAcctCd;
            that.rowData[that.rowIdx].acctNmSub = object.subAcctNm;

          }
        },
      })
    },

    updateAcctSubVal(pVal){
      const that = this;
      const rowNode = this.gridOptions.api.getRowNode(this.rowIdx);

      if(_.isEmpty(this.rowData[this.rowIdx].acctCd)){
        this.$swal({
          type: 'warning',
          text: '계정을 먼저 선택하기 바랍니다.'
        });
        return;
      }

      if(pVal){
        this.$http.get('/api/account/sub/'+ this.rowData[this.rowIdx].acctCd + '/' + pVal)
        .then(response => {
          
          if(response.data.length === 1){
              rowNode.setDataValue('acctNmSub', response.data[0].subAcctNm);

              that.rowData[that.rowIdx].acctCdSub = response.data[0].subAcctCd;
              that.rowData[that.rowIdx].acctNmSub = response.data[0].subAcctNm;
          }else{
              
              this.$modal.open({
                component: ErpAccountSubNew,
                parent: this,
                props: {
                  deptCd: this.rowData[this.rowIdx].deptCd,
                  slipTypeCd: this.slipTypeCd,
                  acctCd: this.rowData[this.rowIdx].acctCd,
                  searchStr: pVal
                },
                width: 700,
                events: {
                  close(object) {
                    rowNode.setDataValue('acctNmSub', object.subAcctNm);

                    that.rowData[that.rowIdx].acctCdSub = object.subAcctCd;
                    that.rowData[that.rowIdx].acctNmSub = object.subAcctNm;
                  }
                },
              })
          }
        })

      }else{
          //보조계정 초기화
          rowNode.setDataValue('acctNmSub', "");
          that.rowData[that.rowIdx].acctCdSub = "";
          that.rowData[that.rowIdx].acctNmSub = "";
      }
      
    },

    updateDff(){
      const that = this;
      const rowNode = this.gridOptions.api.getRowNode(this.rowIdx);
      if(_.isEmpty(this.rowData[this.rowIdx].acctCd)){
        this.$swal({
          type: 'warning',
          text: '계정을 먼저 선택하기 바랍니다.'
        });
        return;
      }
      if(!this.rowData[this.rowIdx].isDff){
        this.$swal({
          type: 'warning',
          text: '관리계정이 아닙니다.'
        });
        return;
      }
      this.$modal.open({
        component: SlipMngItemPop,
        parent: this,
        props: {
          // deptCd: this.rowData[this.rowIdx].deptCd,
          // slipTypeCd: this.slipTypeCd,
          acctCd: this.rowData[this.rowIdx].acctCd,
          data: this.rowData[this.rowIdx]
        },
        width: 1200,
        events: {
          close(data) {
          for(var i = 1; i <= 15; i++){
            that.rowData[that.rowIdx]['attribute'+i] = data['attribute'+i];
          }
          }
        },
      })
    },
    updateProd() {
      const that = this;
      const rowNode = this.gridOptions.api.getRowNode(this.rowIdx);
        
      this.$modal.open({
        component: ProductNew,
        parent: this,
        props: {
          slipTypeCd: this.slipTypeCd
        },
        width: 700,
        events: {
          close(object) {
            rowNode.setDataValue('detailNm', object.detailNm);

            that.rowData[that.rowIdx].detailCd = object.detailCd;
            that.rowData[that.rowIdx].detailNm = object.detailNm;
          }
        }
      })
    },
    updateProdVal(pVal) {
      const that = this;
      const rowNode = this.gridOptions.api.getRowNode(this.rowIdx);

      if(pVal){
        
        this.$http.get(`/api/slip/product/` + pVal)
        .then(response => {
          
          if(response.data.length === 1){
              rowNode.setDataValue('detailNm', response.data[0].detailNm);

              that.rowData[that.rowIdx].detailCd = response.data[0].detailCd;
              that.rowData[that.rowIdx].detailNm = response.data[0].detailNm;
          }else{
              
              this.$modal.open({
                component: ProductNew,
                parent: this,
                props: {
                  slipTypeCd: this.slipTypeCd,
                  searchStr: pVal
                },
                width: 700,
                events: {
                  close(object) {
                    rowNode.setDataValue('detailNm', object.detailNm);

                    that.rowData[that.rowIdx].detailCd = object.detailCd;
                    that.rowData[that.rowIdx].detailNm = object.detailNm;
                  }
                },
              })
          }
        })

      }else{
          //초기화
          rowNode.setDataValue('detailNm', "");

          that.rowData[that.rowIdx].detailCd = "";
          that.rowData[that.rowIdx].detailNm = "";
      }

    },    
    cardInfoPop(idx){

      this.$modal.open({
        component: CardInfoDetailPop,
        parent: this,
        props: {
          apprNo: this.rowData[idx-1].apprNo,
          crdNo: this.rowData[idx-1].crdNo
        },
        width: 700
      })
    },
    openAttachPopup(){

      const that = this;
      const rowNode = this.gridOptions.api.getRowNode(this.rowIdx);

      var chkRead = true;

      if(this.slipStatCd === '10'){
        chkRead = false;
      }

      if(this.$store.state.loginInfo.loginDeptCd === this.wrtDeptCd){
        if(this.slipStatCd === '20' || this.slipStatCd === '30' || this.slipStatCd === '50'){
          chkRead = false; 
        }
      }

      if(this.$route.params.data !== undefined){
        if(this.$route.params.data.slipStatCd === '65' || this.$route.params.data.slipStatCd === '70'){
          chkRead = false;
        }
      }

      this.$modal.open({
        component: EvidAtchPop,
        props: {
            docMngNo: this.rowData[this.rowIdx].eaSlipNo,
            readonly: this.slipStatCd === '10' ? false : true,
            readonlyCtrl: chkRead
        },
        parent: this,
        width: 1200,
        events: {
          close(value) {
            rowNode.setDataValue('scanCt', value.length);

            that.rowData[that.rowIdx].scanCt = value.length;
          }
        }
      })
    },
    getVatList(){
      
      this.$http.get('/api/taxes', {
        params: {
          evdTypeCd: '10'
        }
      }).then(response => {        
        
        this.vatList = response.data;

        //법인카드 세금 코드 
        if(response.data.length === 1){
          this.cardTaxCd = response.data[0].taxCd
        }

        //빈 값(불공제) append
        this.vatList.push({taxCd : '' , taxNm : '불공제'})

      }).catch(response => {
        console.error("getTpsTypeList Error" + response.message);
      })
    },
    getTpsTypeList(){
      this.$http.get('/api/code/detail', {
        params: {
          groupCd: 'TPS_TYPE_CD'
        }
      }).then(response => {
        this.tpsTypeList = response.data;
      }).catch(response => {
        console.error("getTpsTypeList Error" + response.message);
      })
    },
    getOilKindList(){
      this.$http.get('/api/code/detail', {
        params: {
          groupCd: 'OIL_KIND_CD'
        }
      }).then(response => {
        this.oilKindList = response.data;
      }).catch(response => {
        console.error("getOilKindList Error" + response.message);
      })
    },
    cellValueChange(params){

      var idx = params.data.itemSeq;

      // if(params.colDef.field === 'tpsDst' || params.colDef.field === 'oilKindCd'){
        
      //   var oilCd = params.data.oilKindCd;
      //   var result = [];

      //   this.$http.post('/api/oilPrice/list', {
      //     baseYm: this.$moment(this.rowData[idx-1].eaSlipDt).format('YYYYMM')
      //   })
      //   .then(response => {
      //     result = response.data.filter(v => v.oilKindCd === oilCd);
      //     this.calculation(idx, result, params);
      //   }).catch(response => {
      //     console.error("getOilPrice Error" + response.message);
      //   })
      // }

      if(params.colDef.field === 'useAmt2'){
        let sum = 0;
        if(this.rowData.length !== 0){
          sum += this.$numeral(this.rowData.map(x => x.useAmt).reduce((a, v) => a + v)).value();
        }
        if(this.rowDataSub.length !== 0){
          sum += this.$numeral(this.rowDataSub.map(x => x.useAmt2).reduce((a, v) => a + v)).value();
        }
        this.totAmt = sum;

      }else if(params.colDef.field === 'vatCd'){

        const rowNode = params.api.getRowNode(params.node.rowIndex);
        if(!params.data.vatCd){  
          rowNode.setDataValue('vatAmt', 0);
          rowNode.setDataValue('supAmt', params.data.baseSupAmt + params.data.baseVatAmt);
        }else{
          rowNode.setDataValue('vatAmt', params.data.baseVatAmt);
          rowNode.setDataValue('supAmt', params.data.baseSupAmt);
        }
      }
    },
    // calculation(index, data, params){

    //   var value = params.data.tpsDst;
    //   const rowNode = this.gridOptions.api.getRowNode(index-1);
      
    //   if(this.$numeral(value).value() > 0){
    //     var tpsDst = this.$numeral(value || 0).value();
    //     var oilUpc = this.$numeral(data[0].oilUpce || 0).value();
    //     var oilEff = this.$numeral(data[0].oilEff || 0).value();

    //     this.rowData[index-1].tpsDst = tpsDst;
    //     this.rowData[index-1].oilUpc = oilUpc;
    //     this.rowData[index-1].oilEff = oilEff;
    //     this.rowData[index-1].oilKindCd = params.data.oilKindCd;

    //     var cal = Math.floor(tpsDst / oilEff * oilUpc);

    //     this.rowData[index-1].acctAmt = cal;
    //     this.rowData[index-1].supAmt = cal;
    //     this.rowData[index-1].useAmt = cal;
    //     this.rowData[index-1].vatAmt = 0;

    //     rowNode.setDataValue('acctAmt', cal);
    //     rowNode.setDataValue('supAmt', cal);
    //     rowNode.setDataValue('useAmt', cal);
    //     rowNode.setDataValue('vatAmt', 0);
    //     rowNode.setDataValue('oilUpcEff', this.$numeral(oilUpc).format('0,0') + ' / ' + this.$numeral(oilEff).format('0,0'));
    //   }
    // },
    buttenClickEventCopy2(){
      var selectedRows = this.gridOptionsSub.api.getSelectedRows();

      if(selectedRows.length > 0){
        const copyRow = _.cloneDeep(selectedRows[0]);

        this.rowDataSub.push(copyRow);
        this.setRowSubNumber();

      }else{
        this.$swal({
          type: 'warning',
          text: '선택된 행이 없습니다.'
        });
      }

    },
    buttonClickEventAdd2(){

      const that = this;

      this.$http.get('/api/tmp/documentMngNo')
      .then((response) => {
        var eaSlipNo = response.data
        const result = {
            dcCd: 'D',
            lnTypeCd: 'ITEM',
            eaSlipNo: eaSlipNo,
            scanCt: that.evidFileSize,
            eaSlipDt: that.evdDt,
            useDt: that.evdDt,
            deptCd: (that.slipTypeCd === 'E1') ? that.baseDeptCd : '',
            deptNm: (that.slipTypeCd === 'E1') ? that.baseDeptNm : '',
            detailCd2: (that.baseDeptGrCd === '1')?  that.sgaProductCd : '' ,
            detailNm2: (that.baseDeptGrCd === '1')?  that.sgaProductCd : '' ,
            isDff: false,
            //isHidden:true,

        };

        that.rowDataSub.push(result);
        that.setRowSubNumber();
      }).catch(response => {
        console.error("buttonClickEventAdd2 Error" + response.message);
      });
      
    },
    setRowSubNumber(){
      _.forEach(this.rowDataSub, (v, i)=>{
        v.itemSeq = i+1;
      });
    },
    buttonClickEventRemove2(){
      var selectedRows = this.gridOptionsSub.api.getSelectedRows();

      if(selectedRows.length > 0){
        var idx = selectedRows[0].itemSeq;
        this.rowDataSub.splice(idx-1, 1);
        this.setRowSubNumber();
      }else{
        this.$swal({
          type: 'warning',
          text: '선택된 행이 없습니다.'
        });
      }
    },
    updateCctrVal2(pVal){
      
      const that = this;
      const rowNode = this.gridOptionsSub.api.getRowNode(this.rowIdx);
      
      if(pVal){
        this.$http
          .get('/api/cctr/erp/'+ pVal)
          .then(response => {
            
            if(response.data.length == 1){
              rowNode.setDataValue('deptNm', response.data[0].deptNm);
              that.rowDataSub[that.rowIdx].deptNm = response.data[0].deptNm;
              that.rowDataSub[that.rowIdx].deptCd = response.data[0].deptCd;

              //계정 초기화
              rowNode.setDataValue('acctNm2', "");
              that.rowDataSub[that.rowIdx].acctCd2 = "";
              that.rowDataSub[that.rowIdx].acctNm2 = "";
              //보조계정 초기화
              rowNode.setDataValue('acctNmSub2', "");
              that.rowDataSub[that.rowIdx].acctCdSub2 = "";
              that.rowDataSub[that.rowIdx].acctNmSub2 = "";
              //판관부서 현장계약번호 default 세팅
              if(response.data[0].expenseFlag === "1"){
                rowNode.setDataValue('detailNm2', that.sgaProductCd);
                that.rowDataSub[that.rowIdx].detailCd2 = that.sgaProductCd;
                that.rowDataSub[that.rowIdx].detailNm2 = that.sgaProductCd;
              }else{
                rowNode.setDataValue('detailNm2', '');
                that.rowDataSub[that.rowIdx].detailCd2 = '';
                that.rowDataSub[that.rowIdx].detailNm2 = '';
              }		                

              //관리항목 초기화
              for(var i = 1; i <= 15; i++){
                  that.rowDataSub[that.rowIdx]['attribute'+i] = data['attribute'+i];
              }

            }else{
              this.updateCctr2(pVal);
            }
          })
          
      }else{
        //부서 초기화
        rowNode.setDataValue('deptNm', "");
        that.rowDataSub[that.rowIdx].deptNm = "";
        that.rowDataSub[that.rowIdx].deptCd = "";
        //계정 초기화
        rowNode.setDataValue('acctNm2', "");
        that.rowDataSub[that.rowIdx].acctCd2 = "";
        that.rowDataSub[that.rowIdx].acctNm2 = "";
        //보조계정 초기화
        rowNode.setDataValue('acctNmSub2', "");
        that.rowDataSub[that.rowIdx].acctCdSub2 = "";
        that.rowDataSub[that.rowIdx].acctNmSub2 = "";
        //현장계약번호 초기화
        rowNode.setDataValue('detailNm2', "");
        that.rowDataSub[that.rowIdx].detailCd2 = "";
        that.rowDataSub[that.rowIdx].detailNm2 = "";      
        //관리항목 초기화
        for(var i = 1; i <= 15; i++){
            that.rowDataSub[that.rowIdx]['attribute'+i] = data['attribute'+i];
        }        
      }      
    },    
    updateCctr2(pVal){
      
      const that = this;
      const rowNode = this.gridOptionsSub.api.getRowNode(this.rowIdx);
      
      this.$modal.open({
        component: ErpCctrNew,
        parent: this,
        width: 700,
        props: {
          searchStr: pVal
        },        
        events: {
          close(object) {
            rowNode.setDataValue('deptNm', object.deptNm);
            
            that.rowDataSub[that.rowIdx].deptNm = object.deptNm;
            that.rowDataSub[that.rowIdx].deptCd = object.deptCd;

            //판관부서 현장계약번호 default 세팅
            if(object.expenseFlag === "1"){
              rowNode.setDataValue('detailNm2', that.sgaProductCd);
              that.rowDataSub[that.rowIdx].detailCd2 = that.sgaProductCd;
              that.rowDataSub[that.rowIdx].detailNm2 = that.sgaProductCd;
            }else{
              rowNode.setDataValue('detailNm2', '');
              that.rowDataSub[that.rowIdx].detailCd2 = '';
              that.rowDataSub[that.rowIdx].detailNm2 = '';
            }            
          }
        }
      });
    },
    updateCtrlVal2(pVal){
      
      const that = this;
      const rowNode = this.gridOptionsSub.api.getRowNode(this.rowIdx);

      if(_.isEmpty(this.rowDataSub[this.rowIdx].deptNm)){
        this.$swal({
          type: 'warning',
          text: '부서를 먼저 선택하기 바랍니다.'
        });
        return;
      }

      if(pVal){
        
        this.$http.get('/api/account/'+this.deptCd+'/'+this.slipTypeCd+'/'+pVal)
        .then(response => {

          if(response.data.length == 1){

            //계정 세팅
            rowNode.setDataValue('acctNm2', response.data[0].acctNm);
            that.rowDataSub[that.rowIdx].acctCd2 = response.data[0].acctCd;
            that.rowDataSub[that.rowIdx].acctNm2 = response.data[0].acctNm;

            //보조계정 조회
            that.$http.get('/api/account/sub/' + response.data[0].acctCd)
              .then(response => {
                var object = response.data;

                if(object.length === 1){
                  rowNode.setDataValue('acctNmSub2', object[0].subAcctNm);

                  that.rowDataSub[that.rowIdx].acctCdSub2 = object[0].subAcctCd;
                  that.rowDataSub[that.rowIdx].acctNmSub2 = object[0].subAcctNm;
                  
                  that.rowDataSub[that.rowIdx].reqSubAcct = true;

                }else if(object.length == 0){
                  that.rowDataSub[that.rowIdx].reqSubAcct = false; 

                }else{
                  that.updateAcctSub2();
                  
                  that.rowDataSub[that.rowIdx].reqSubAcct = true;
                }
              });

              //관리항목 유뮤 체크
              that.$http.post('/api/slip/managementItem',{acctCd: response.data[0].acctCd})
              .then(response => {
                if(response.data.length === 0){
                  console.log('관리계정 항목이 아닙니다.')
                  that.rowDataSub[that.rowIdx].isDff = false;
                  for(var i = 1; i <= 15; i++){
                    that.rowDataSub[that.rowIdx]['attribute'+i] = ''
                  }
                }else{
                  that.rowDataSub[that.rowIdx].isDff = true;
                }
              });

          }else{

            this.$modal.open({
                component: ErpAccountNew,
                parent: this,
                props: {
                  deptCd: this.rowDataSub[this.rowIdx].deptCd,
                  slipTypeCd: this.slipTypeCd,
                  searchStr: pVal
                },
                width: 700,
                events: {
                  close(object) {
                    rowNode.setDataValue('acctNm2', object.acctNm);

                    that.rowDataSub[that.rowIdx].acctCd2 = object.acctCd;
                    that.rowDataSub[that.rowIdx].acctNm2 = object.acctNm;

                    that.$http.get('/api/account/sub/'+object.acctCd)
                    .then(response => {
                      var object = response.data;

                      if(object.length === 1){
                        rowNode.setDataValue('acctNmSub2', object[0].subAcctNm);

                        that.rowDataSub[that.rowIdx].acctCdSub2 = object[0].subAcctCd;
                        that.rowDataSub[that.rowIdx].acctNmSub2 = object[0].subAcctNm;
                        
                        that.rowDataSub[that.rowIdx].reqSubAcct = true;

                      }else if(object.length == 0){
                        that.rowDataSub[that.rowIdx].reqSubAcct = false; 

                      }else{
                        that.updateAcctSub2();
                        
                        that.rowDataSub[that.rowIdx].reqSubAcct = true;
                      }
                    });
                    
                    that.$http.post('/api/slip/managementItem',{acctCd:object.acctCd})
                    .then(response => {
                      if(response.data.length === 0){
                        console.log('관리계정 항목이 아닙니다.')
                        that.rowDataSub[that.rowIdx].isDff = false;
                        for(var i = 1; i <= 15; i++){
                          that.rowDataSub[that.rowIdx]['attribute'+i] = ''
                        }
                      }else{
                        that.rowDataSub[that.rowIdx].isDff = true;
                      }
                    });

                  }
                },
            })            

          }
        })
        
      }else{
        
        //계정 초기화
        rowNode.setDataValue('acctNm2', "");
        that.rowDataSub[that.rowIdx].acctCd2 = "";
        that.rowDataSub[that.rowIdx].acctNm2 = "";
        //보조계정 초기화
        rowNode.setDataValue('acctNmSub2', "");
        that.rowDataSub[that.rowIdx].acctCdSub2 = "";
        that.rowDataSub[that.rowIdx].acctNmSub2 = "";
        //관리항목 초기화
        for(var i = 1; i <= 15; i++){
            that.rowDataSub[that.rowIdx]['attribute'+i] = data['attribute'+i];
        }
      }
    },
    updateCtrl2(){
      const that = this;
      const rowNode = this.gridOptionsSub.api.getRowNode(this.rowIdx);
        
      if(_.isEmpty(this.rowDataSub[this.rowIdx].deptNm)){
        this.$swal({
          type: 'warning',
          text: '부서를 먼저 선택하기 바랍니다.'
        });
        return;
      }

      this.$modal.open({
        component: ErpAccountNew,
        parent: this,
        props: {
          deptCd: this.rowDataSub[this.rowIdx].deptCd,
          slipTypeCd: this.slipTypeCd,
          searchStr: ''
        },
        width: 700,
        events: {
          close(object) {
            rowNode.setDataValue('acctNm2', object.acctNm);

            that.rowDataSub[that.rowIdx].acctCd2 = object.acctCd;
            that.rowDataSub[that.rowIdx].acctNm2 = object.acctNm;

            that.rowDataSub[that.rowIdx].acctCdSub2 = "";
            that.rowDataSub[that.rowIdx].acctNmSub2 = "";

            that.$http.get('/api/account/sub/'+object.acctCd)
            .then(response => {
              var object = response.data;

              if(object.length === 1){
                rowNode.setDataValue('acctNmSub2', object[0].subAcctNm);

                that.rowDataSub[that.rowIdx].acctCdSub2 = object[0].subAcctCd;
                that.rowDataSub[that.rowIdx].acctNmSub2 = object[0].subAcctNm;
                
                that.rowDataSub[that.rowIdx].reqSubAcct = true;

              }else if(object.length == 0){
                that.rowDataSub[that.rowIdx].reqSubAcct = false; 

              }else{
                that.updateAcctSub2();
                
                that.rowDataSub[that.rowIdx].reqSubAcct = true;
              }
            });
            
            that.$http.post('/api/slip/managementItem',{acctCd:object.acctCd})
            .then(response => {
              if(response.data.length === 0){
                console.log('관리계정 항목이 아닙니다.')
                that.rowDataSub[that.rowIdx].isDff = false;
                for(var i = 1; i <= 15; i++){
                  that.rowDataSub[that.rowIdx]['attribute'+i] = ''
                }
              }else{
                that.rowDataSub[that.rowIdx].isDff = true;
              }
            });

          }
        },
      })
    },
    updateAcctSub2(){
      const that = this;
      const rowNode = this.gridOptionsSub.api.getRowNode(this.rowIdx);

      if(_.isEmpty(this.rowDataSub[this.rowIdx].acctCd2)){
        this.$swal({
          type: 'warning',
          text: '계정을 먼저 선택하기 바랍니다.'
        });
        return;
      }
      
      this.$modal.open({
        component: ErpAccountSubNew,
        parent: this,
        props: {
          deptCd: this.rowDataSub[this.rowIdx].deptCd,
          slipTypeCd: this.slipTypeCd,
          acctCd: this.rowDataSub[this.rowIdx].acctCd2
        },
        width: 700,
        events: {
          close(object) {
            rowNode.setDataValue('acctNmSub2', object.subAcctNm);

            that.rowDataSub[that.rowIdx].acctCdSub2 = object.subAcctCd;
            that.rowDataSub[that.rowIdx].acctNmSub2 = object.subAcctNm;

          }
        },
      })
    },

    updateAcctSubVal2(pVal){
      const that = this;
      const rowNode = this.gridOptionsSub.api.getRowNode(that.rowIdx);

      if(_.isEmpty(this.rowDataSub[that.rowIdx].acctCd2)){
        this.$swal({
          type: 'warning',
          text: '계정을 먼저 선택하기 바랍니다.'
        });
        return;
      }

      if(pVal){
        this.$http.get('/api/account/sub/'+ this.rowDataSub[that.rowIdx].acctCd2 + '/' + pVal)
        .then(response => {
          
          if(response.data.length === 1){
              rowNode.setDataValue('acctNmSub2', response.data[0].subAcctNm);

              that.rowDataSub[that.rowIdx].acctCdSub2 = response.data[0].subAcctCd;
              that.rowDataSub[that.rowIdx].acctNmSub2 = response.data[0].subAcctNm;
          }else{
              
              this.$modal.open({
                component: ErpAccountSubNew,
                parent: this,
                props: {
                  deptCd: that.rowDataSub[that.rowIdx].deptCd,
                  slipTypeCd: this.slipTypeCd,
                  acctCd: that.rowDataSub[that.rowIdx].acctCd2,
                  searchStr: pVal
                },
                width: 700,
                events: {
                  close(object) {
                    rowNode.setDataValue('acctNmSub2', object.subAcctNm);

                    that.rowDataSub[that.rowIdx].acctCdSub2 = object.subAcctCd;
                    that.rowDataSub[that.rowIdx].acctNmSub2 = object.subAcctNm;
                  }
                },
              })
          }
        })

      }else{
          //보조계정 초기화
          rowNode.setDataValue('acctNmSub2', "");
          that.rowDataSub[that.rowIdx].acctCdSub2 = "";
          that.rowDataSub[that.rowIdx].acctNmSub2 = "";
      }
      
    },


    updateDff2(){
      const that = this;
      const rowNode = this.gridOptionsSub.api.getRowNode(this.rowIdx);
      if(_.isEmpty(this.rowDataSub[this.rowIdx].acctCd2)){
        this.$swal({
          type: 'warning',
          text: '계정을 먼저 선택하기 바랍니다.'
        });
        return;
      }
      if(!this.rowDataSub[this.rowIdx].isDff){
        this.$swal({
          type: 'warning',
          text: '관리계정이 아닙니다.'
        });
        return;
      }
      this.$modal.open({
        component: SlipMngItemPopSub,
        parent: this,
        props: {
          // deptCd: this.rowDataSub[this.rowIdx].deptCd,
          // slipTypeCd: this.slipTypeCd,
          acctCd: this.rowDataSub[this.rowIdx].acctCd2,
          data: this.rowDataSub[this.rowIdx]
        },
        width: 1200,
        events: {
          close(data) {
          for(var i = 1; i <= 15; i++){
            that.rowDataSub[that.rowIdx]['attribute'+i] = data['attribute'+i];
          }
          }
        },
      })
    },
    updateProd2() {
      const that = this;
      const rowNode = this.gridOptionsSub.api.getRowNode(this.rowIdx);
        
      this.$modal.open({
        component: ProductNew,
        parent: this,
        props: {
          slipTypeCd: this.slipTypeCd
        },
        width: 700,
        events: {
          close(object) {
            rowNode.setDataValue('detailNm2', object.detailNm);

            that.rowDataSub[that.rowIdx].detailCd = object.detailCd;
            that.rowDataSub[that.rowIdx].detailNm = object.detailNm;
            that.rowDataSub[that.rowIdx].detailCd2 = object.detailCd;
            that.rowDataSub[that.rowIdx].detailNm2 = object.detailNm;
          }
        }
      })
    },
    updateProdVal2(pVal) {
      const that = this;
      const rowNode = this.gridOptionsSub.api.getRowNode(this.rowIdx);

      if(pVal){
        
        this.$http.get(`/api/slip/product/` + pVal)
        .then(response => {
          
          if(response.data.length === 1){
              rowNode.setDataValue('detailNm2', response.data[0].detailNm);

              that.rowDataSub[that.rowIdx].detailCd2 = response.data[0].detailCd;
              that.rowDataSub[that.rowIdx].detailNm2 = response.data[0].detailNm;
          }else{
              
              this.$modal.open({
                component: ProductNew,
                parent: this,
                props: {
                  slipTypeCd: this.slipTypeCd,
                  searchStr: pVal
                },
                width: 700,
                events: {
                  close(object) {
                    rowNode.setDataValue('detailNm2', object.detailNm);

                    that.rowDataSub[that.rowIdx].detailCd2 = object.detailCd;
                    that.rowDataSub[that.rowIdx].detailNm2 = object.detailNm;
                  }
                },
              })
          }
        })

      }else{
          //초기화
          rowNode.setDataValue('detailNm2', "");

          that.rowDataSub[that.rowIdx].detailCd2 = "";
          that.rowDataSub[that.rowIdx].detailNm2 = "";
      }

    },    
    openAttachPopup2(){

      const that = this;
      const rowNode = this.gridOptionsSub.api.getRowNode(this.rowIdx);

      var chkRead = true;

      if(this.slipStatCd === '10'){
        chkRead = false;
      }

      if(this.$store.state.loginInfo.loginDeptCd === this.wrtDeptCd){
        if(this.slipStatCd === '20' || this.slipStatCd === '30' || this.slipStatCd === '50'){
          chkRead = false; 
        }
      }

      if(this.$route.params.data !== undefined){
        if(this.$route.params.data.slipStatCd === '65' || this.$route.params.data.slipStatCd === '70'){
          chkRead = false;
        }
      }

      this.$modal.open({
        component: EvidAtchPop,
        props: {
            docMngNo: this.rowDataSub[this.rowIdx].eaSlipNo,
            readonly: this.slipStatCd === '10' ? false : true,
            readonlyCtrl: chkRead
        },
        parent: this,
        width: 1200,
        events: {
          close(value) {
            rowNode.setDataValue('scanCt', value.length);

            that.rowDataSub[that.rowIdx].scanCt = value.length;
          }
        }
      })
    },
    openUploadWingsPopup(){
      var chkReadOnly = true;

      if(this.slipStatCd === '10'){
        chkReadOnly = false;
      }

      if(this.$store.state.loginInfo.loginDeptCd === this.wrtDeptCd){
        if(this.slipStatCd === '20' || this.slipStatCd === '30' || this.slipStatCd === '50'){
          chkReadOnly = false;
        }
      }

      if(this.$route.params.data !== undefined){
        if(this.$route.params.data.slipStatCd === '65' || this.$route.params.data.slipStatCd === '70'){
          chkReadOnly = false;
        }
      }
      

      let vm = this
      this.$modal.open({
        component: WingsAtchPop,
        props: {
          grSlipNo: this.grSlipNo || this.tmpSlipNo,
          slipDetail: this.tempData,
          readonly: chkReadOnly // Check readonly
        },
        parent: this,
        width: 1200,
        events: {
          close(value) {
            vm.wingsFileSize = value.length
            vm.tempData = value
          }
        }
      })
    },
    queryWingsFile() {
      /**
       * Wings파일이 얼마나 첨부되었는지 확인해보자
       */
      if(this.grSlipNo) {
        this.$http.get(`/api/wings/document/${this.grSlipNo}`)
          .then(response => {
            this.wingsFileSize = response.data.length
          })
      }
    },
    makeParamData(){
      this.gridOptions.api.clearFocusedCell();
      this.gridOptionsSub.api.clearFocusedCell();
      
      try{

        var copy = this.$route.params.copy;
        var grSlipNoReal = this.grSlipNo;

        if(copy){
          grSlipNoReal = '';
        }

        if(!_.isEmpty(this.tempData)){
          grSlipNoReal = this.tempData[0].grSlipNo
        }

        this.data = {
          apAcctCd: this.lbltAcctCdList.length === 0 ? '' : this.lbltAcctCdList.find(v=>v.value === this.lbltAcctCd).key,
          apAcctNm: this.lbltAcctCd === '' ? '' : this.lbltAcctCd,
          apprReqEmp: null,
          apprReqEmpNm: null,
          baseDeptCd: this.baseDeptCd,
          baseDeptNm: this.baseDeptNm,
          compCd: this.compCd,
          curCd: this.curCd,
          currCode: null,
          eaSlipDt: this.eaSlipDt,
          elecApprDtm: this.elecApprDtm,
          elecApprDtmFrom: this.elecApprDtmFrom,
          elecApprDtmTo: this.elecApprDtmTo,
          elecApprId: this.elecApprId,
          empNm: this.empNm,
          empNo: this.empNo,
          evdTypeCd: this.evdTypeCd,
          grApprStatCd: null,
          grApprStatNm: null,
          grSlipNo: grSlipNoReal,
          hdSgtxt: this.hdSgtxt,
          lbltAcctCd: this.lbltAcctCdList.length === 0 ? '' : this.lbltAcctCdList.find(v=>v.value === this.lbltAcctCd).key,
          lbltAcctNm: this.lbltAcctCd === '' ? '' : this.lbltAcctCd,
          liabilityAcctCd: this.lbltAcctCdList.length === 0 ? '' : this.lbltAcctCdList.find(v=>v.value === this.lbltAcctCd).key,
          liabilityAcctNm: this.lbltAcctCd === '' ? '' : this.lbltAcctCd,
          payTermCd: this.payTermCdList.length === 0 ? '' : this.payTermCdList.find(v=>v.detailNm === this.payTermCd).detailCd,
          payTermNm: this.payTermCd === '' ? '' : this.payTermCd,
          postDt: this.postDt,
          slipCnt: null,
          slipDetails: this.rowData, //법인카드지급
          slipDetails2: this.rowDataSub, //현금지급
          slipStatCd: this.slipStatCd,
          slipStatNm: "작성중",
          slipTypeCd: "E1",
          slipTypeNm: "개인비용(경비)신청서",
          totAmt: this.totAmt,
          vatAcctCd: this.vatAcctCd,
          vatAcctNm: this.vatAcctNm,
          wrtDeptCd: this.wrtDeptCd,
          wrtDeptNm: this.wrtDeptNm,
          wrtId: null,
          wrtNm: null,
          payDueDt: this.payDueDt,//지급예정일
          payText: this.payText//지급비고란
        }

      }catch(e){
        this.data = {};
        console.error("makeParamData Error");
      }
    },
    saveButton(){
      this.makeParamData();
      this.buttonEventSave();
    },
    isDffAcctCd(){
      this.rowData = this.rowData.map(x => {
        this.$http.post('/api/slip/managementItem',{acctCd:x.acctCd})
        .then(response => {
          if(response.data.length !== 0){
            x.isDff = true
          }
        });
        return x
      })
      this.rowDataSub = this.rowDataSub.map(x => {
        this.$http.post('/api/slip/managementItem',{acctCd:x.acctCd2})
        .then(response => {
          if(response.data.length !== 0){
            x.isDff = true
          }
        });
        return x
      })
    },
    getDetail(){

      if(!this.grSlipNo) return ;

      const that = this;
      var slipNo = this.grSlipNo;
      var url = `/api/slip/p/${slipNo}`;
      if(this.$route.params.copy){
        url = `/api/slip/p/copy/${slipNo}`;
      }
        
      this.$store.commit('loading')
      this.$http.get(url)
      .then(response => {
        
        let data_gr = response.data.slipGroup;
        let data_hd_top = response.data.slipHeaders.filter(x => x.evdTypeCd === '10')
        let data_hd_botm = response.data.slipHeaders.filter(x => x.evdTypeCd === '11')
        data_gr.empNo = data_gr.wrtId
        data_gr.empNm = data_gr.wrtNm
        data_gr.eaSlipDt = data_gr.postDt
        
        data_gr.baseDeptCd = response.data.slipHeaders[0].baseDeptCd
        data_gr.baseDeptNm = response.data.slipHeaders[0].baseDeptNm
        data_gr.evdTypeCd = '10'
        data_gr.payDueDt = response.data.slipHeaders[0].payDueDt
        data_gr.payText = response.data.slipHeaders[0].payText
        
        data_hd_top.forEach((x, index) => {
          x.itemSeq = index + 1
          x.eaSlipDt = x.evdDt
          x.useDt = x.evdDt
          x.cctrCd = x.wrtDeptCd
          x.cctrNm = x.wrtDeptNm
          x.deptCd = x.baseDeptCd
          x.deptNm = x.baseDeptNm
          x.expenseId = x.expsId
          x.expenseAcctCode = x.expsAcctCd
          x.expenseName = x.expsNm
          x.expenseAcctName = x.expsAcctNm
          x.detailNm = x.productNm
          x.detailCd = x.productCd
          x.useAmt = x.totAmt
          x.lnSgtxt = x.hdSgtxt
          x.scanCt = x.ufileCnt
          x.crdApprNo = x.apprNo  //카드승인번호
          x.crdNo = x.crdNo   //카드번호
          x.crdMerchBizNo = x.merchBizNo  //가맹점 사업자번호
          x.dcCd = 'D'
          x.dcNm = '차변'
          x.lnTypeCd = 'ITEM'
          x.vatCd = x.taxCd
          x.vatNm = x.taxNm
          x.acctCd = x.expsAcctCd
          x.acctNm = x.expsAcctNm
          x.acctCdSub = x.subAcctCd
          x.acctNmSub = x.subAcctNm
          x.attribute1 = x.slipDetails[0].attribute1
          x.attribute2 = x.slipDetails[0].attribute2
          x.attribute3 = x.slipDetails[0].attribute3
          x.attribute4 = x.slipDetails[0].attribute4
          x.attribute5 = x.slipDetails[0].attribute5
          x.attribute6 = x.slipDetails[0].attribute6
          x.attribute7 = x.slipDetails[0].attribute7
          x.attribute8 = x.slipDetails[0].attribute8
          x.attribute9 = x.slipDetails[0].attribute9
          x.attribute10 = x.slipDetails[0].attribute10
          x.attribute11 = x.slipDetails[0].attribute11
          x.attribute12 = x.slipDetails[0].attribute12
          x.attribute13 = x.slipDetails[0].attribute13
          x.attribute14 = x.slipDetails[0].attribute14
          x.attribute15 = x.slipDetails[0].attribute15
          x.baseSupAmt = x.oriSupAmt
          x.baseVatAmt = x.oriVatAmt
        })
        
        
        data_hd_botm.forEach((x, index) => {
          x.itemSeq = index + 1
          x.evdDt = x.evdDt
          x.eaSlipDt = x.evdDt
          x.eaSlipDt2 = x.evdDt
          x.cctrCd = x.wrtDeptCd
          x.cctrNm = x.wrtDeptNm
          x.deptCd = x.baseDeptCd
          x.deptNm = x.baseDeptNm
          x.expenseId2 = x.expsId
          x.expenseAcctCode2 = x.expsAcctCd
          x.expenseName2 = x.expsNm
          x.expenseAcctName2 = x.expsAcctNm
          x.detailNm2 = x.productNm
          x.detailCd2 = x.productCd
          x.useAmt2 = x.totAmt
          x.lnSgtxt = x.hdSgtxt
          x.scanCt = x.scanCt
          x.storeNm = x.hdRef5
          x.address = x.hdRef3
          x.scanCt = x.ufileCnt
          x.dcCd = 'D'
          x.dcNm = '차변'
          x.lnTypeCd = 'ITEM'
          x.acctCd2 = x.expsAcctCd
          x.acctNm2 = x.expsAcctNm
          x.acctCdSub2 = x.subAcctCd
          x.acctNmSub2 = x.subAcctNm
          x.attribute1 = x.slipDetails[0].attribute1
          x.attribute2 = x.slipDetails[0].attribute2
          x.attribute3 = x.slipDetails[0].attribute3
          x.attribute4 = x.slipDetails[0].attribute4
          x.attribute5 = x.slipDetails[0].attribute5
          x.attribute6 = x.slipDetails[0].attribute6
          x.attribute7 = x.slipDetails[0].attribute7
          x.attribute8 = x.slipDetails[0].attribute8
          x.attribute9 = x.slipDetails[0].attribute9
          x.attribute10 = x.slipDetails[0].attribute10
          x.attribute11 = x.slipDetails[0].attribute11
          x.attribute12 = x.slipDetails[0].attribute12
          x.attribute13 = x.slipDetails[0].attribute13
          x.attribute14 = x.slipDetails[0].attribute14
          x.attribute15 = x.slipDetails[0].attribute15
        })

        this.setBasicInfo(data_gr)
        
        that.rowData = []
        that.rowDataSub = []
        
        data_hd_top.forEach((x) => that.rowData.push(x))
        data_hd_botm.forEach((x) => that.rowDataSub.push(x))
        that.queryWingsFile(that.grSlipNo);

        that.isDffAcctCd();
      })
      .catch(response => {
        console.error("getDetail Error" + response.message);
      })
      .finally(() => {
        this.$store.commit('finish')
      })

    },
    setBasicInfo(data){

      this.apprReqEmp = data.apprReqEmp
      this.apprReqEmpNm = data.apprReqEmpNm
      this.baseDeptCd = data.baseDeptCd
      this.baseDeptNm = data.baseDeptNm
      this.compCd = data.compCd
      this.curCd = data.curCd
      this.currCode = data.currCode
      this.eaSlipDt = data.eaSlipDt
      this.elecApprDtm = data.elecApprDtm
      this.elecApprDtmFrom = data.elecApprDtmFrom
      this.elecApprDtmTo = data.elecApprDtmTo
      this.elecApprId = data.elecApprId
      this.empNm = data.empNm
      this.empNo = data.empNo
      this.evdTypeCd = data.evdTypeCd
      this.grApprStatCd = data.grApprStatCd
      this.grApprStatNm = data.grApprStatNm
      this.hdSgtxt = data.hdSgtxt
      this.liabilityAcctCd = data.liabilityAcctCd
      this.liabilityAcctNm = data.liabilityAcctNm
      this.lbltAcctNm = data.liabilityAcctCd
      this.lbltAcctCd = data.liabilityAcctNm

      const vPayTerm = this.payTermCdList.find(v=> v.detailCd === data.payTermCd)
      if(vPayTerm){        
        this.payTermCd = vPayTerm.detailNm
      }
      
      this.payDueDt = data.payDueDt
      this.payText = data.payText
      this.liabilityAcctNm = data.liabilityAcctNm      
      this.postDt = data.postDt
      this.slipCnt = data.slipCnt
      this.slipStatCd = data.slipStatCd
      this.slipStatNm = data.slipStatNm
      this.slipTypeCd = data.slipTypeCd
      this.slipTypeNm = data.slipTypeNm
      this.totAmt = data.totAmt
      this.wrtDeptCd = data.wrtDeptCd
      this.wrtDeptNm = data.wrtDeptNm
      this.wrtId = data.wrtId
      this.wrtNm = data.wrtNm
    },
    deleteButton(){
      this.makeParamData();
      this.buttonEventDelete();
    },
    submitButton(){
      this.$async.waterfall(
          [
            this.makeParamData(),
            this.openApprSubmNew()
          ],
          function (err, result) {
            if (err) { console.error("In waterfall error cb: ==>", err, "<=="); }
            else { console.log("In waterfall success cb: ==>", result, "<=="); }
          }
      );
    },
    openApprSubmNew(){
      const that = this;
      let grSlipNo = this.grSlipNo;
      
      this.$modal.open({
        component: ApprSubm,
        props: {
          docType: 'SLIP',
        value: this.data
        },
        parent: this,
        width: 1200,
        events: {
          close(flag) {
            console.log(flag)
            if (that.$route.grSlipNo !== undefined) {
              location.reload()
            } else {
              if(flag ==='Y'){
                that.$router.push({
                  name: 'pExpense',
                  params: {
                    grSlipNo
                  }
                })
              }
            }
          }
        }
      })
    }
    ,
    submitViewButton(){
      this.makeParamData();
      
      this.$modal.open({
        component: ApprSubm,
        props: {
          docType: 'SLIP',
          value: this.data
        },
        parent: this,
        width: 1200,
      })
    },
  },
  watch: {
    'slipStatCd': {
      immediate: true,
      deep: true,
      handler(value) {
        this.slipStatCd = value;
        
        var copy = this.$route.params.copy;

        if(copy){
          this.slipStatCd = '10';
        }
        this.makeColumnDef();
      },
    }
  }
} 
</script>
<style>
.objbox {overflow-y:scroll !important;}
</style>