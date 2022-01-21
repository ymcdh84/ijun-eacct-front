<template>
<div class="inner-box">
  <!-- TABLE  -->
  <div class="table-area">
    <div class="table-a fixed-th">
      <div class="table-name">
        <h3 class="ico_table_name">기본정보</h3>
      </div>
      <table class="table">
        <colgroup>
          <col width="10%;">
          <col width="18%;">
          <col width="10%;">
          <col width="7%;">
          <col width="10%;">
          <col width="5%;">
          <col width="10%;">
          <col width="15%;">
          <col width="10%;">
          <col width="5%;">
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
        <div class="grid-tbl-box">
          <ag-grid-vue ref="grid"
                      style="padding-top: 40px; width: 100%;height: 280px;"
                      class="ag-theme-alpine"    
                      rowSelection="single"
                      
                      :columnDefs="columnDef"     
                      :gridOptions="gridOptions"
                      :rowData="rowData"
                      :defaultColDef="defaultColDef"
                      :frameworkComponents="frameworkComponent"/>
        </div>
      </div>
    </div>

    <div class="table-b">
      <div class="table-header">
        <div class="table-name">
          <h3 class="ico_table_name">현금지급</h3>
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
                      :frameworkComponents="frameworkComponent"/>
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
import AgGridCardInfo from "@/components/agGrid/AgGridCardInfo.vue";
import AgGridScanAttach from "@/components/agGrid/AgGridScanAttach.vue";
import CardInfoDetailPop from '@/components/CardInfoDetailPop.vue';
import EvidAtchPop from '@/components/EvidAtchPop.vue';
import WingsAtchPop from '@/components/WingsAtchPop.vue';

export default {
  props:{
    elecApprId:{
      type: String,
      required: false
    }
  },
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
      payDueDt:'',
      payText:'',
      wrtDtm: '',
      wrtId: '',
      wrtDeptCd: '',
      wrtDeptNm: '',
      baseDeptCd: '',
      baseDeptNm: '',
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
      defaultColDef: {},
      gridOptions: {},
      rowData:[],
      data1: '',
      vatList: [],
      tpsTypeList: [],
      oilKindList: [],
      frameworkComponent : {
        'cardInfo' : AgGridCardInfo,
        'scanAttach' : AgGridScanAttach,
      },
      columnDefSub: [],
      gridOptionsSub: {},
      rowDataSub:[],
      data:{},
      vatAcctCd:'',
      vatAcctNm:'',
    }
  },
  destroyed() {
    // this.$cookie.delete('searchForm')
    // this.$store.commit('searchForm', '');
  },
  created(){
    this.baseDeptCd = this.$store.state.loginInfo.loginDeptCd;
    this.baseDeptNm = this.$store.state.loginInfo.loginDeptNm;
    this.empNo = this.$store.state.loginInfo.loginId;
    this.empNm = this.$store.state.loginInfo.userName;

    this.queryVatAcct();
    this.getDeptInfo();
    this.getPayTermCd();
    this.getLbltAccount();
    
    this.defaultColDef = { resizable: true, filter:true, sortable: true };

    this.getVatList();
    this.getTpsTypeList();
    this.getOilKindList();

    setTimeout(() => {
      this.makeColumnDef();
    },300);
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
        this.wrtDeptCd = data.liabilityDeptCode;
        this.wrtDeptNm = data.liabilityDeptName;
      })
      .catch((e) => {
        this.$swal({
          type: 'error',
          text: e
        })
      })
    },
    getPayTermCd(){
      this.$store.commit('loading')
      
      this.$http.get('/api/code/detail', {params: {groupCd: "PAY_TERM_CD", remark3: this.evdTypeCd}})
      .then(response => {
        this.payTermCdList = response.data;
        if(_.isEmpty(this.payTermCd)){
          this.payTermCd = response.data[0].detailNm;
        }
      }).catch(response => {
        console.error("getPayTermCd Error " + response.message);
      }).finally(() => {
        this.$store.commit('finish')
      })
    },
    getLbltAccount(){
      // 개인비용전표(E1)는 부채계정에 '미지급금'만 사용
      // 개인비용전표(E1)는 외상매입금, 미지급배당금, 미지급비용 제외
      this.$store.commit('loading')
      
      this.$http.get('/api/account/liabilities/p')
      .then(response => {
        this.lbltAcctCdList = response.data        
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
          field:'itemSeq', 
          width: 80
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
          cellStyle:{textAlign:'left'},
        },
        {
          headerName:'계정', 
          field:'acctNm', 
          width:180, 
          cellStyle:{textAlign:'left'},
        },
        {
          headerName:'보조계정', 
          field:'acctNmSub', 
          width:180, 
          cellStyle:{textAlign:'left'},
        },
        {
          headerName:'현장(계약번호)', 
          field:'detailNm', 
          width:180, 
          cellStyle:{textAlign:'left'},
        },
        {
          headerName:'세금코드', 
          field:'vatCd', 
          width:150, 
          cellStyle:{textAlign:'left'},
          valueFormatter: (params) => {               
            return that.makeValueList(that.vatList, params)
          }
        },
        {
          headerName:'공급가액', 
          field:'supAmt', 
          width:120, 
          cellStyle:{textAlign:'right'},
          valueFormatter: (params) => { 
            return that.getNumberFormat(params.value);
          }
        },
        {
          headerName:'세액', 
          field:'vatAmt', 
          width:120, 
          cellStyle:{textAlign:'right'},
          valueFormatter: (params) => { 
            return that.getNumberFormat(params.value);
          }
        },
        {
          headerName:'금액', 
          field:'useAmt', 
          width:120, 
          cellStyle:{textAlign:'right'},
          valueFormatter: (params) => { 
            return that.getNumberFormat(params.value);
          }
        },
        {headerName:'적요', field:'lnSgtxt', width:220, cellStyle:{textAlign:'left'}, editable: true},
        {headerName:'가맹점명', field:'crdMerchNm', width:180, cellStyle:{textAlign:'left'}},
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
        // {
        //   headerName:'출발지', 
        //   field:'stptPlc', 
        //   width:120, 
        //   cellStyle:{textAlign:'left'}, 
        // },
        // {
        //   headerName:'도착지', 
        //   field:'dstnPlc', 
        //   width:120, 
        //   cellStyle:{textAlign:'left'}, 
        // },
        // {
        //   headerName:'출장목적', 
        //   field:'biztrpObj', 
        //   width:140, 
        //   cellStyle:{textAlign:'left'}, 
        // },
        // {
        //   headerName:'교통비유형', 
        //   field:'tpsTypeCd', 
        //   width:180, 
        //   cellStyle:{textAlign:'center'},
        //   valueFormatter: (params) => {               
        //     return that.makeValueList(that.tpsTypeList, params);
        //   }
        // },
        // {
        //   headerName:'거리', 
        //   field:'tpsDst', 
        //   width:120, 
        //   cellStyle:{textAlign:'left'}, 
        //   valueFormatter: (params) => {               
        //     return that.chkNumber(params, 'mst');
        //   }
        // },
        // {
        //   headerName:'유종', 
        //   field:'oilKindCd', 
        //   width:120, 
        //   cellStyle:{textAlign:'center'},
        //   valueFormatter: (params) => {               
        //     return that.makeValueList(that.oilKindList, params);
        //   }
        // },
        // {
        //   headerName:'유류단가/연비', 
        //   field:'oilUpcEff', 
        //   width:180, 
        //   cellStyle:{textAlign:'right'}
        // },
        // {
        //   headerName:'경비금액', 
        //   field:'acctAmt', 
        //   width:120, 
        //   cellStyle:{textAlign:'right'},
        //   valueFormatter: (params) => { 
        //     return that.getNumberFormat(params.value);
        //   }
        // },
        {headerName:'전표번호', field:'eaSlipNo', width:120, cellStyle:{textAlign:'left'}, hide:true},
      ];

      this.columnDefSub = [
        {
          headerName:'No.', 
          field:'itemSeq', 
          width:80
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
          cellStyle:{textAlign:'left'},
        },
        {
          headerName:'계정명', 
          field:'acctNm2', 
          width:180, 
          cellStyle:{textAlign:'left'},
        },
        {
          headerName:'보조계정', 
          field:'acctNmSub2', 
          width:180, 
          cellStyle:{textAlign:'left'},
        },
        {
          headerName:'현장(계약번호)', 
          field:'detailNm2', 
          width:180, 
          cellStyle:{textAlign:'left'},
        },
        {
          headerName:'금액', 
          field:'useAmt2', 
          width:120, 
          cellStyle:{textAlign:'right'},
          valueFormatter: (params) => {               
            return that.chkNumber(params, 'sub');
          }
        },
        {headerName:'적요', field:'lnSgtxt', width:220, cellStyle:{textAlign:'left'}, editable: true},
        {
          headerName:'스캔증빙', 
          field:'scanCt', 
          width:120, 
          cellStyle:{textAlign:'center'},
          cellRenderer: 'scanAttach',
          cellRendererParams:{
            funcNm : 'openAttachPopup2'
          }
        },
        {headerName:'가맹점', field:'storeNm', width:180, cellStyle:{textAlign:'left'}, editable: true},
        {headerName:'주소', field:'address', width:250, cellStyle:{textAlign:'left'}, editable: true},
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
        }else if(param.colDef.field === 'tpsTypeCd' || param.colDef.field === 'oilKindCd'){
          for(var j=0; j<data.length; j++){
            if(data[j].detailCd === param.value){
              return data[j].detailNm;
            }
          }
        }

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
    openAttachPopup(idx){

      const that = this;
      const rowNode = this.gridOptions.api.getRowNode(idx-1);

      this.$modal.open({
        component: EvidAtchPop,
        props: {
            docMngNo: this.rowData[idx-1].eaSlipNo,
            readonly: this.slipStatCd === '10' ? false : true,
        },
        parent: this,
        width: 1200,
        events: {
          close(value) {
            rowNode.setDataValue('scanCt', value.length);

            that.rowData[idx-1].scanCt = value.length;
          }
        }
      })
    },
    getVatList(){
      
      this.$http.get('/api/taxes', {
        params: {
          evdTypeCd: ''
        }
      }).then(response => {
        this.vatList = response.data;
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
    openAttachPopup2(idx){

      const that = this;
      const rowNode = this.gridOptionsSub.api.getRowNode(idx-1);

      this.$modal.open({
        component: EvidAtchPop,
        props: {
            docMngNo: this.rowDataSub[idx-1].eaSlipNo,
            readonly: this.slipStatCd === '10' ? false : true,
        },
        parent: this,
        width: 1200,
        events: {
          close(value) {
            rowNode.setDataValue('scanCt', value.length);

            that.rowDataSub[idx-1].scanCt = value.length;
          }
        }
      })
    },
    openUploadWingsPopup(){
      let vm = this
      this.$modal.open({
        component: WingsAtchPop,
        props: {
          grSlipNo: this.grSlipNo,
          slipDetail: this.tempData,
          readonly: this.isReadonly // Check readonly
        },
        parent: this,
        width: 1200,
        events: {
          close(value) {
            vm.grSlipNo = value[0].grSlipNo
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
    getDetail(){
      const that = this;
      var slipNo = this.grSlipNo;

      this.$store.commit('loading')
      this.$http.get(`/api/slip/p/${slipNo}`)
      .then(response => {
        
        let data_gr = response.data.slipGroup;
        let data_hd_top = response.data.slipHeaders.filter(x => x.evdTypeCd === '10')
        let data_hd_botm = response.data.slipHeaders.filter(x => x.evdTypeCd === '11')
        data_gr.empNo = data_gr.wrtId
        data_gr.empNm = data_gr.wrtNm
        data_gr.eaSlipDt = data_gr.postDt
        
        data_gr.baseDeptCd = data_gr.wrtDeptCd
        data_gr.baseDeptNm = data_gr.wrtDeptNm
        data_gr.evdTypeCd = '10'
        data_gr.payDueDt = response.data.slipHeaders[0].payDueDt
        data_gr.payText = response.data.slipHeaders[0].payText
        
        this.data.grSlipNo = this.$route.params.grSlipNo ? this.$route.params.grSlipNo : response.data.slipGroup.grSlipNo //얘 넣어주라
        // this.data = data_gr
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
          x.stptPlc = x.slipDetails[0].stptPlc  //출발지
          x.dstnPlc = x.slipDetails[0].dstnPlc  //도착지
          x.biztrpObj = x.slipDetails[0].biztrpObj
          x.tpsDst = x.slipDetails[0].tpsDst  //거리-교통비 
          x.oilKindCd = x.slipDetails[0].oilKindCd //유종코드-교통비
          x.oilUpc = x.slipDetails[0].oilUpc  //유류단가-교통비 
          x.oilEff = x.slipDetails[0].oilEff  //연비-교통비
          x.acctAmt = x.slipDetails[0].acctAmt  //경비금액
          x.oilUpcEff = _.isNumber(x.slipDetails[0].tpsDst) ? this.$numeral(x.slipDetails[0].oilUpc).format('0,0') + ' / ' + this.$numeral(x.slipDetails[0].oilEff).format('0,0') : ''
          x.dcCd = 'D'
          x.dcNm = '차변'
          x.lnTypeCd = 'ITEM'
          x.vatCd = x.taxCd
          x.vatNm = x.taxNm
          x.acctCd = x.expsAcctCd
          x.acctNm = x.expsAcctNm
          x.acctCdSub = x.subAcctCd
          x.acctNmSub = x.subAcctNm
          
          if(!_.isEmpty(x.slipDetails[0].tpsTypeCd)){
            x.tpsTypeCd = x.slipDetails[0].tpsTypeCd 
          }else{
            x.tpsTypeCd = '10'
            x.acctAmt = 0
            x.tpsDst = 0
            x.oilKindCd = 'GSL'
          }
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
        })
        
        that.apprReqEmp = data_gr.apprReqEmp
        that.apprReqEmpNm = data_gr.apprReqEmpNm
        that.baseDeptCd = data_gr.baseDeptCd
        that.baseDeptNm = data_gr.baseDeptNm
        that.compCd = data_gr.compCd
        that.curCd = data_gr.curCd
        that.currCode = data_gr.currCode
        that.eaSlipDt = data_gr.eaSlipDt
        that.empNm = data_gr.empNm
        that.empNo = data_gr.empNo
        that.evdTypeCd = data_gr.evdTypeCd
        that.grApprStatCd = data_gr.grApprStatCd
        that.grApprStatNm = data_gr.grApprStatNm
        that.grSlipNo = data_gr.grSlipNo
        that.hdSgtxt = data_gr.hdSgtxt
        that.liabilityAcctCd = data_gr.liabilityAcctCd
        that.liabilityAcctNm = data_gr.liabilityAcctNm
        that.lbltAcctNm = data_gr.liabilityAcctCd
        that.lbltAcctCd = data_gr.liabilityAcctNm
        that.payTermCd = that.payTermCdList.find(v=> v.detailCd === data_gr.payTermCd).detailNm
        that.postDt = data_gr.postDt
        that.slipCnt = data_gr.slipCnt
        that.slipStatCd = data_gr.slipStatCd
        that.slipStatNm = data_gr.slipStatNm
        that.slipTypeCd = data_gr.slipTypeCd
        that.slipTypeNm = data_gr.slipTypeNm        
        that.totAmt = data_gr.totAmt
        //that.wrtDeptCd = data_gr.wrtDeptCd
        //that.wrtDeptNm = data_gr.wrtDeptNm
        that.wrtId = data_gr.wrtId
        that.wrtNm = data_gr.wrtNm

        that.payDueDt =data_gr.payDueDt
        that.payText =data_gr.payText

        that.rowData = []
        that.rowDataSub = []
        
        data_hd_top.forEach((x) => that.rowData.push(x))
        data_hd_botm.forEach((x) => that.rowDataSub.push(x))

        that.queryWingsFile(that.grSlipNo);
      })
      .catch(response => {
        console.error("getDetail Error" + response.message);
      })
      .finally(() => {
        this.$store.commit('finish')
      })
    },
    openAttachPopup(){

      const that = this;
      const rowNode = this.gridOptions.api.getRowNode(this.rowIdx);

      var chkRead = true;

      if(this.slipStatCd === '10'){
        chkRead = false;
      }

      // if(this.$store.state.loginInfo.loginDeptCd === this.wrtDeptCd){
      //   if(this.slipStatCd === '20' || this.slipStatCd === '30' || this.slipStatCd === '50'){
      //     chkRead = false;
      //   }
      // }
      //
      // if(this.$route.params.data !== undefined){
      //   if(this.$route.params.data.slipStatCd === '65' || this.$route.params.data.slipStatCd === '70'){
      //     chkRead = false;
      //   }
      // }

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
   openAttachPopup2(){

      const that = this;
      const rowNode = this.gridOptionsSub.api.getRowNode(this.rowIdx);

      var chkRead = true;

      if(this.slipStatCd === '10'){
        chkRead = false;
      }

      // if(this.$store.state.loginInfo.loginDeptCd === this.wrtDeptCd){
      //   if(this.slipStatCd === '20' || this.slipStatCd === '30' || this.slipStatCd === '50'){
      //     chkRead = false;
      //   }
      // }
      //
      // if(this.$route.params.data !== undefined){
      //   if(this.$route.params.data.slipStatCd === '65' || this.$route.params.data.slipStatCd === '70'){
      //     chkRead = false;
      //   }
      // }

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
  },
  watch: {
    'grSlipNo':{
      immediate: true,
      deep: true,
      handler(value) {
        this.grSlipNo = value;
        this.getDetail();
      }
    }
  }
} 
</script>
<style>
.objbox {overflow-y:scroll !important;}
</style>