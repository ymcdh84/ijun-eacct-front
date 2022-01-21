<template>
  <layout>
    <span slot="header">{{title}}<button class="btn-pop-close delete" aria-label="close" @click="closeModal"></button></span>
    
    <div slot="content">
      <div class="content-name">
          <!-- <div class="btn-wrap btn-type1 clearfix fl_right" >
                        
                    </div> -->
          <div class="btn-wrap btn-type1 clearfix">
              <!-- <button class="btn-size btn-blue fl_right" @click="goSearch"><span class="btn-icon"><i class="fas fa-pen-alt"></i></span> 조회</button> -->
              <div class="dp-ib fl_right">
                  <button class="btn-size btn-gray fl_right" style="height: 33px; margin-right: 7px;" @click="allUnChk"><span class="btn-icon"><i class="fas fa-pen-alt"></i></span> 전체해제</button>
              </div>
              <div class="dp-ib fl_right">
                  <button class="btn-size btn-blue fl_right" style="height: 33px; margin-right: 7px;" @click="allChk"><span class="btn-icon"><i class="fas fa-pen-alt"></i></span>전체선택</button>
              </div>
              <div class="dp-ib fl_right">
                  <button class="btn-size btn-orange fl_right" style="height: 33px; margin-right: 7px;" @click="setCardFgCd"><span class="btn-icon"><i class="fas fa-pen-alt"></i></span>개인용도</button>
              </div>
              <div class="dp-ib fl_right">
                  <button class="btn-size btn-blue fl_right" style="height: 33px; margin-right: 7px;" @click="setDataClose"><span class="btn-icon"><i class="fas fa-pen-alt"></i></span>전표작성</button>
              </div>
              
          </div>
      </div>
      <!-- 검색조건 영역 -->
      <div class="desc-content search-border">
          <div class="item desc-left" style="width: 350px; margin-right:50px;">
              <div class="desc-item">
                  <div class="tit">
                      <span class="label-tit">사용일자</span>
                  </div>
                  <div class="desc">
                      <div class="datepicker w-type-ymd02">
                          <dhx-calendar class="input ddate sDate" v-model="form.searchDtmFr" />
                      </div>
                      <span class="wave"> ~ </span>
                      <div class="datepicker w-type-ymd02">
                          <dhx-calendar class="input ddate sDate" v-model="form.searchDtmTo" />
                      </div>
                  </div>
              </div>
          </div>
          <div class="item desc-center" style="width: 300px; margin-right:50px;">
              <div class="desc-item" >
                <div class="tit">
                  <span class="label-tit"> 카드번호</span>
                </div>
                <div class="desc">
                    <b-select class="select is-fullwidth" v-model="form.crdNo">
                        <option
                                v-for="item in cardNos"
                                :key="item.crdNo"
                                :value="item.crdNo"
                                v-text="`${item.maskedCardNo} (${item.crdPssrNm})`"/>
                    </b-select>
                </div>
              </div>
          </div>
          <div class="item desc-right" style="width: 250px; margin-right: 10px;">
            <div class="desc-item">
                <div class="tit">
                    <span class="label-tit">처리상태</span>
                </div>
                <div class="desc">
                    <b-select class="select is-fullwidth" v-model="form.useDtlsStatCd">
                        <option
                                v-for="item in useDtlsStatCds"
                                :key="item.key"
                                :value="item.key"
                                v-text="item.value"/>
                    </b-select>
                </div>
            </div>
          </div>
          <div class="item desc-right" style="width: 100px">
              <div class="desc-item">
                  <div class="tit">
                      <div class="btn-wrap btn-type1 clearfix">
                        <button class="btn-size btn-gray fl_left" style="height: 26px;" @click="goSearch">
                            <span class="btn-icon"><i class="fas fa-search"></i></span> 조회
                        </button>
                    </div>
                  </div>
              </div>
          </div>
      </div>
      <!-- //검색조건 영역 -->

      

      <!-- 테이블 -->
      <div class="table-area">
          <div class="table-header">
            
            <div class="table-a fixed">

                <div class="content">
                    
                    <div class="btn-wrap" >
                        <table class="table">
                            <tbody>
                                <tr>
                                    <th style="width: 130px; text-align: center;">계정명</th>
                                    <td>
                                        <div class="td-s-thumb search-area">
                                            <input class="input input-bg mr5 Rt-M rs-mt2" type="text" v-model="account.acctCd" style="width:100px;" disabled="disabled"/>
                                            <div class="ip-box ip-box-w02 rs-mt2">
                                                <input type="text" class="input" v-model="account.acctNm" @keypress.enter="popAccountVal"/>
                                                <button class="icon is-right" @click="popAccount">
                                                <i class="fas fa-search"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </td>
                                    <th style="width: 130px; text-align: center;">보조계정명</th>
                                    <td>
                                        <div class="td-s-thumb search-area">
                                            <input class="input input-bg mr5 Rt-M rs-mt2" type="text" v-model="accountSub.acctCdSub" style="width:100px;" disabled="disabled"/>
                                            <div class="ip-box ip-box-w02 rs-mt2">
                                                <input type="text" class="input" v-model="accountSub.acctNmSub" @keypress.enter="popAccountSub"/>
                                                <button class="icon is-right" @click="popAccountSub">
                                                <i class="fas fa-search"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </td>
                                    <th style="width: 120px; text-align: center;">현장(계약번호)</th>
                                    <td>
                                        <div class="td-s-thumb search-area">
                                            <div class="ip-box ip-box-w02 rs-mt2" style="width: 180px;">
                                                <input type="text" class="input" v-model="product.detailNm" @keypress.enter="popProduct"/>
                                                <button class="icon is-right" @click="popProduct">
                                                <i class="fas fa-search"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </td>
                                    <th style="width: 80px; text-align: center;">적요</th>
                                    <td><input class="input" type="text" v-model="form.crdOln"></td>
                                </tr>
                                <!-- <tr v-show="showStdsInfo">
                                    <th style="width: 130px; text-align: center;">출발지</th>
                                    <td>
                                        <div class="td-s-thumb search-area">
                                            <input class="input" type="text" v-model="form.stptPlcPop">
                                        </div>
                                    </td>
                                    <th style="width: 80px; text-align: center;">도착지</th>
                                    <td>
                                        <input class="input" type="text" v-model="form.dstnPlcPop">
                                    </td>
                                    <th style="width: 80px; text-align: center;">출장목적</th>
                                    <td colspan="3"><input class="input" type="text" v-model="form.biztrpObjPop"></td>
                                </tr> -->
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
          <div class="table-b">
              <div class="grid-wrap">
                  <ag-grid-vue ref="grid" style="width: 100%;" class="ag-theme-alpine grid_search_height_p1" 
                                :columnDefs="columnDefs" 
                                :rowData="useDetails" 
                                :gridOptions="gridOptions"
                                :frameworkComponents="frameworkComponent"
                                :defaultColDef="defaultColDef"/>
              </div>
          </div>
      </div>
      <!-- //테이블 -->
    </div>
  </layout>
</template>

<script>
import moment from 'moment'
import mixin from '@/mixin';
import mixinSlip from '@/mixin/slip';
import _ from 'lodash'

import assert from '@/libs/assert'
import Layout from '@/components/ModalSlot4.vue'
import DhxCalendar from '@/components/DhxCalendar.vue'
import DhxGrid from '@/components/DhxGrid.vue'
import Emp from '@/components/Emp.vue'
//import ErpAccountPop from '@/components/ErpAccountPop.vue'
//import Product from '@/components/Product.vue'
import ErpAccountPop from '@/components/ErpAccount_Ag.vue'
import Product from '@/components/Product_Ag.vue'
import ErpAccountPopSub from '@/components/ErpAccountSub_Ag.vue'

import { AgGridVue } from 'ag-grid-vue'
import AgGridCheckbox from "@/components/agGrid/AgGridCheckbox.vue"

import {
  url as _url
} from '@/libs/join'

export default {
  name: 'SlipCrdLst',
  props: {
    param: {
      type: String,
      required: false
    }, 
    deptCd: {
      type: String,
      required: false
    },
    slipTypeCd: {
      type: String,
      required: false
    },
    copyUseDetails: {
      type: Array,
      required: false
    },
    baseDeptGrCd: {
      type: String,
      required: false
    },
    sgaProductCd: {
      type: String,
      required: false
    }
  },
  components: {Emp, ErpAccountPop, Product, DhxGrid, DhxCalendar, Layout, AgGridVue},
  mixins: [ mixin, mixinSlip ],
  data() {
    return {
        columnDefs : [],
        gridOptions : {},
        frameworkComponent : {
            'checkBox' : AgGridCheckbox
        },
        defaultColDef:{},
        title: '법인카드전체내역',
        compCds: [],
        crdCompCds: [],
        useDtlsStatCds: [],
        crdFgCds: [],
        useDetails: [],
        showEmpModal: false,
        showAccountModal: false,
        showProductModal: false,
        showStdsInfo:false,
        authority: '',
        reqSubAcct: false,
        cardNos: [],
        account: {
          acctCd: '',
          acctNm: ''
        },
        accountSub:{
          acctCdSub: '',
          acctNmSub: ''
        },
        product: {
          detailCd: '',
          detailNm: '',
        },
        form: {
            useYn: 'N',
            compCd: '',
          //   crdCompCd: '',
            useDtlsStatCd: '10',
          //   crdFgCd: '',
            crdNo: '',
            crdPssrId: '',
            crdPssrNm: '',
            crdPssrTitle: '',
            crdPssrDut: '',
            crdPssrDept: '',
            searchDtmFr: this.$moment().startOf('month').format('YYYY-MM-DD'),
            searchDtmTo: this.$moment().endOf('month').format('YYYY-MM-DD'),
        },
    }
  },
  methods: {
    makeColDef(){
        const that = this;
        this.columnDefs = [
            {
                headerName: '선택', 
                field: 'useYn', 
                width: 80, 
                cellRenderer: 'checkBox'
            },
            {headerName: '카드번호', field: 'cardNo', width: 180, cellStyle:{textAlign: 'left'}},
            {headerName: '가맹점명', field: 'merchNm', width: 200, cellStyle:{textAlign: 'left'}},
            {headerName: '사업자번호', field: 'merchBizNo', width: 200, cellStyle:{textAlign: 'center'}},
            {headerName: '카드구분', field: 'crdFgNm', width: 120, cellStyle:{textAlign: 'left'}},
            {headerName: '승인일자', field: 'apprDate', width: 120, cellStyle:{textAlign: 'left'}},
            {headerName: '승인시각', field: 'apprTime', width: 120, cellStyle:{textAlign: 'left'}},
            {headerName: '처리상태', field: 'useDtlsStatNm', width: 110, cellStyle:{textAlign: 'left'}},
            {
                headerName: '매입금액', 
                field: 'purchTot', 
                width: 140, 
                cellStyle:{textAlign: 'right'},
                valueFormatter: function(params) { 
                    return that.getNumberFormat(params.value);
                }
            },
            {
                headerName: '공급가액', 
                field: 'apprAmt', 
                width: 140, 
                cellStyle:{textAlign: 'right'},
                valueFormatter: function(params) {               
                    return that.getNumberFormat(params.value);
                }
            },
            {
                headerName: '부가세', 
                field: 'vat', 
                width: 100, 
                cellStyle:{textAlign: 'right'},
                valueFormatter: function(params) {               
                    return that.getNumberFormat(params.value);
                }
            },
            {
                headerName: '봉사료', 
                field: 'tips', 
                width: 100, 
                cellStyle:{textAlign: 'right'},
                valueFormatter: function(params) {               
                    return that.getNumberFormat(params.value);
                }
            },
            {headerName: '승인번호', field: 'apprNo', width: 140, cellStyle:{textAlign: 'left'}},
            {headerName: '매입구분', field: 'acqClassNm', width: 140, cellStyle:{textAlign: 'left'}},
            {headerName: '처리취소', field: 'useDtlsCancel', width: 140, cellStyle:{textAlign: 'left'}},
            {headerName: '가맹점주소', field: 'merchAddr', width: 400, cellStyle:{textAlign: 'left'}},
            {headerName: '업종명', field: 'mccName', width: 140, cellStyle:{textAlign: 'left'}},
            {headerName: '과세구분', field: 'etcNm', width: 140, cellStyle:{textAlign: 'left'}},
            {headerName: '전표번호', field: 'eaSlipNo', width: 150, cellStyle:{textAlign: 'left'}},
            {headerName: '전표상태', field: 'slipStatNm', width: 140, cellStyle:{textAlign: 'left'}},
            {headerName: '카드사용자', field: 'crdPssrNm', width: 140, cellStyle:{textAlign: 'left'}},
            {headerName: '직급', field: 'crdUseDutNm', width: 120, cellStyle:{textAlign: 'left'}},
            {headerName: '부서명', field: 'crdUseDeptNm', width: 150, cellStyle:{textAlign: 'left'}},
            {headerName: '경비처리기한', field: 'procPeriod', width: 140, cellStyle:{textAlign: 'left'}},
            {headerName: '경비처리자', field: 'slipProcNm', width: 120, cellStyle:{textAlign: 'left'}},
            {headerName: '전송일시', field: 'erpSlipDtm', width: 150, cellStyle:{textAlign: 'left'}},
            {headerName: '대표자', field: 'merchOwner', width: 150, cellStyle:{textAlign: 'left'}, hide:true},
        ];
    },
    getCompCdCombo() {
        this.$http.get(`/api/code/combo`, {params: {groupCd: "COMP_CD"}})
            .then(response => {
                this.compCds = response.data;
            });
    },
    getCardCompCdCombo() {
        this.$http.get(`/api/code/combo`, {params: {groupCd: "CRD_COMP_CD"}})
            .then(response => {
                this.crdCompCds = response.data;
            });
    },
    getUseStatCdCombo() {
        let vm = this
        this.$http.get(`/api/code/combo`, {params: {groupCd: "USE_DTLS_STAT_CD"}})
            .then(response => {
                this.useDtlsStatCds = response.data;
            })
            .finally(() => {
                setTimeout(() => {        
                    if(vm.$route.query.lnk === 'mainCard') {
                        this.form.useDtlsStatCd = '30'
                    }
                }, 200)
            });
    },
    getCardFgCdCombo() {
        this.$http.get(`/api/code/combo`, {params: {groupCd: "CRD_FG_CD"}})
            .then(response => {
                this.crdFgCds = response.data;
            });
    },
    saveExcel() {
        this.downloadExcel(this.$refs.grid);
    },
    goSearch() {
        const param = JSON.parse(JSON.stringify(this.form));
        const stripFields = ['searchDtmFr', 'searchDtmTo','crdNo'];
        _.forEach(stripFields, (name) => param[name] = this.toPure(param[name]));

        this.$store.commit('loading');
        this.$http.post(`/api/card/useList`, {
                // compCd: param.compCd,
                searchDtmFr: param.searchDtmFr,
                searchDtmTo: param.searchDtmTo,
                useDtlsStatCd: param.useDtlsStatCd,
                cardNo: param.crdNo,
                // crdPssrId: param.crdPssrId,
                // crdCompCd: param.crdCompCd,
                // crdFgCd: param.crdFgCd
            }
        )
        .then(response => {
            if (response.data) {
                var data = response.data
                for(let i = 0; i < response.data.length; i++) {
                    for(let k = 0; k < this.copyUseDetails.length; k++) {
                        if(this.copyUseDetails[k].apprNo === data[i].apprNo){
                            data[i].cStateYn = true
                        }
                    }
                    data[i].useYn = false;
                }


                for(var i=0; i<data.length; i++){
                    data[i].cardNo = this.getFormattedCardNumber(data[i].cardNo);
                    data[i].apprDate = this.$moment(data[i].apprDate).format('YYYY-MM-DD');
                    if(!_.isEmpty(data[i].apprTime)){
                        data[i].apprTime = this.$moment(data[i].apprTime, 'HHmmss').format('HH:mm:ss');
                    }
                    if(!_.isEmpty(data[i].erpSlipDtm)){
                        data[i].erpSlipDtm = this.$moment(data[i].erpSlipDtm).format('YYYY-MM-DD HH:mm:ss');
                    }
                }

                this.useDetails = data;
            }
        }).finally(()=> {
            this.$store.commit('finish');
        });
    },
    popAccount() {
        const that = this;
    
        this.$modal.open({
            component: ErpAccountPop,
            parent: this,
            props: {
                deptCd: that.deptCd,
                searchStr: that.account.acctNm,
                slipTypeCd: that.slipTypeCd
            },
            width: 1800,
            events: {
                close(object) {
                    that.account.acctCd = object.acctCd
                    that.account.acctNm = object.acctNm
                    

                    that.$http.get('/api/account/sub/'+object.acctCd)
                    .then(response => {
                        var object = response.data;

                        that.accountSub.acctCdSub = ""
                        that.accountSub.acctNmSub = ""

                        //보조계정 필수 체크(보조계정이 1개라도 존재하면 필수)    
                        if(object.length == 0){
                            that.reqSubAcct = false;
                        }else if (object.length == 1){
                            that.reqSubAcct = true;

                            that.accountSub.acctCdSub = object.subAcctCd
                            that.accountSub.acctNmSub = object.subAcctNm
                        }else{
                            that.reqSubAcct = false

                            that.popAccountSub();
                        }
                    });                    

                }
            }
        });
    },
    popAccountVal() {
        const that = this;

        if(that.account.acctNm){
          this.$http.get('/api/account/'+ that.deptCd +'/'+ that.slipTypeCd +'/' + that.account.acctNm )
            .then(response => {
                
                if(response.data.length == 1){
                    that.account.acctCd = response.data[0].acctCd
                    that.account.acctNm = response.data[0].acctNm
                    
                    that.$http.get('/api/account/sub/' + response.data[0].acctCd)
                        .then(response => {
                            var object = response.data;

                            that.accountSub.acctCdSub = ""
                            that.accountSub.acctNmSub = ""

                            //보조계정 필수 체크(보조계정이 1개라도 존재하면 필수)    
                            if(object.length == 0){
                                that.reqSubAcct = false;
                            }else if (object.length == 1){
                                that.reqSubAcct = true;

                                that.accountSub.acctCdSub = object.subAcctCd
                                that.accountSub.acctNmSub = object.subAcctNm
                            }else{
                                that.reqSubAcct = false

                                that.popAccountSub();
                            }
                        }); 

                }else{
                    that.popAccount();
                }
            })
                      
        }else{
            
            that.account.acctCd = ""
            that.account.acctNm = ""

            that.accountSub.acctCdSub = ""
            that.accountSub.acctNmSub = ""
        }
    
        
    },    
    initAccount() {
      if (this.account.acctNm === '') this.account = {};
    },
    popAccountSub() {
        const that = this;

        if(!that.account.acctCd){
            this.$swal({
            type: 'warning',
            text: '계정을 먼저 선택하기 바랍니다.'
            });
            return;
        }

        this.$modal.open({
            component: ErpAccountPopSub,
            parent: this,
            props: {
                deptCd: that.deptCd,
                searchStr: that.accountSub.acctNmSub,
                acctCd: that.account.acctCd
            },
            width: 1800,
            events: {
                close(object) {
                    that.accountSub.acctCdSub = object.subAcctCd
                    that.accountSub.acctNmSub = object.subAcctNm
                }
            }
        });
    },
    initAccountSub() {
      if (this.account.acctNmSub === '') this.accountSub = {};
    },
    popProduct() {
        const that = this;
    
        this.$modal.open({
            component: Product,
            parent: this,
            props: {
                deptCd: that.deptCd,
                searchStr: that.product.detailNm
            },
            width: 1800,
            events: {
                close(object) {
                    that.product.detailCd = object.detailCd
                    that.product.detailNm = object.detailNm
                }
            }
        });
    },
    initProduct() {
      if (this.product.detailNm === '') this.product = {};
    },
    allChk(){

        var filterList = [];

        this.gridOptions.api.forEachNodeAfterFilter((v, i) => {
            filterList.push(v.data.useDtlsNo)
        })

        for(var i=0; i<filterList.length; i++){
            for(var j=0; j<this.useDetails.length; j++){
                if(filterList[i] === this.useDetails[j].useDtlsNo){
                    this.useDetails[j].useYn = true;
                }
            }
        }

        var size = this.$refs.grid.$children.length;
        for(var k=0; k<size; k++){
            this.$refs.grid.$children[k].select = true;
        }
    },
    allUnChk(){
        let data = this.useDetails;//this.$refs.grid.data;
        for(let i=0; i < data.length; i++){
            this.useDetails[i].useYn = false
        }

        var size = this.$refs.grid.$children.length;
        for(var j=0; j<size; j++){
            this.$refs.grid.$children[j].select = false;
        }
    },
    // 카드번호
    getCardNoCombo() {
        // this.$http.get(`/api/card/combo`)
        this.$http.get(`/api/card/combo/personal`)
            .then(response => {
                this.cardNos = response.data
                _.forEach(this.cardNos, (o) => {
                    o.maskedCardNo = this.getFormattedCardNumber(o.crdNo);
                    this.form.crdNo = o.crdNo
                })
            });
    },
    sixMonth() {
        // this.$swal('HI')
        this.form.searchDtmFr = this.$moment().add(-6, 'month').startOf('month').format('YYYY-MM-DD')
        // this.goSearch()
    },
    setCardFgCd(){
        //미처리 건에 대해서만 개인용도 처리 한다.
        try {
            let checkedRowIds = this.useDetails.filter(x => x.useYn === true)
            
            assert.apply(this, [checkedRowIds.length > 0, '전표를 선택해주세요.'])
            checkedRowIds.forEach(v => {
                assert.apply(this, [v.useDtlsStatCd === '10', '미처리건에 대해서만 처리 가능합니다.'])
            })
            let checkedUseDtlsNos = [];
            if(checkedRowIds) {
                for(let i = 0; i < checkedRowIds.length; i++){

                    checkedUseDtlsNos.push(checkedRowIds[i].useDtlsNo)
                }
                this.$http.post(`/api/card/private`, checkedUseDtlsNos)
                    .then(response => {
                        this.$swal({type: 'success',text:'개인용도로 처리되었습니다.'})
                        this.goSearch();
                    });
            }
        }catch(e) {
             if (e instanceof EvalError) {
                console.log(e.name + ": " + e.message);
            } else if (e instanceof RangeError) {
                console.log(e.name + ": " + e.message);
            } else if (e instanceof TypeError) {
                console.log(e.name + ": " + e.message);
            } else {
                this.$swal({
                    type: 'error',
                    text: e
                })
            }
        }
        
    },
    setDataClose() {
        try{

            if(!this.showStdsInfo){
                this.form.stptPlcPop = ''
                this.form.dstnPlcPop = ''
                this.form.biztrpObjPop = ''
            }
            
            let datas = this.useDetails.filter(x => {
                if(x.cStateYn === undefined) {
                    if(x.useYn === true) {
                        return x
                    }
                }else{
                    if(x.useYn === true && x.cStateYn === false) {
                        return x
                    }
                }
            })
            // console.log(datas)
            assert.apply(this, [datas.length > 0, '전표를 선택해주세요.'])
            assert.apply(this, [this.form.useDtlsStatCd === '10' || this.form.useDtlsStatCd === undefined
            , '사적비용처리 또는 처리완료 건에 대한 데이터는 전표작성 처리할 수 없습니다.'])
            
            for(let i=0; i < datas.length; i++){
                
                datas[i].detailCd = this.product.detailCd;
                datas[i].detailNm = this.product.detailNm;
                datas[i].acctCd = this.account.acctCd;
                datas[i].acctNm = this.account.acctNm;
                datas[i].acctCdSub = this.accountSub.acctCdSub;
                datas[i].acctNmSub = this.accountSub.acctNmSub;
                datas[i].crdOln = this.form.crdOln;
                datas[i].stptPlcPop = this.form.stptPlcPop;
                datas[i].dstnPlcPop = this.form.dstnPlcPop;
                datas[i].biztrpObjPop = this.form.biztrpObjPop;                
                datas[i].reqSubAcct = this.reqSubAcct;
                
                if((datas.length-1) === i) this.$emit('close', datas)
            }
            // assert.apply(this, [datas.length > 0, '추가할 행이 존재하지 않습니다.'])
            // setTimeout(() => {
            //     this.$emit('close', datas)
            // }, 200)
        }catch(e){
            if (e instanceof EvalError) {
                console.log(e.name + ": " + e.message);
            } else if (e instanceof RangeError) {
                console.log(e.name + ": " + e.message);
            } else if (e instanceof TypeError) {
                console.log(e.name + ": " + e.message);
            } else {
                this.$swal({
                    type: 'error',
                    text: e
                })
            }
        }
    },
    closeModal(){
        // this.$parent.close();
        this.$emit('close', undefined);
    },
  },
  created(){
      this.useDetails.useYn = false;
  },
  beforeMount(){
    const that = this;

    this.makeColDef();
    this.defaultColDef = { resizable: true, filter:true, sortable: true };

    this.gridOptions = {
        onFilterChanged: () => {
            that.allUnChk();
        }, 
        getRowStyle: (params) => {
            if(params.data.cStateYn){
                return {background: 'orange'};
            }
        }
    }
  },
  mounted() {
      this.form.compCd = this.$store.state.loginInfo.compCd;
      this.authority = this.$store.state.loginInfo.authorities[0].roleCd;
      this.getCardNoCombo();
      this.getCompCdCombo();
      this.getCardCompCdCombo();
      this.getUseStatCdCombo();
      this.getCardFgCdCombo();

      if(this.baseDeptGrCd === "1"){
          this.product.detailCd = this.sgaProductCd
          this.product.detailNm = this.sgaProductCd
      }

      setTimeout(() => {
          this.goSearch();
        }, 1000);
  },
  watch: {
    copyUseDetails: {
      immediate: true,
      deep: true,
      handler(value) {
        if(value !== undefined){
          this.copyUseDetails = value
        //   this.$refs.grid.lockCell(0, 0)
        }
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
</style>