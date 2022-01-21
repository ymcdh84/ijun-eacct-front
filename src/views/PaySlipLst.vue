<template>
    <div class="inner-box">
        <div class="content-name">
            <h2 class="dp-ib">{{title}}</h2>
            <div class="btn-wrap btn-type1 clearfix">
                <button class="btn-size btn-gray fl_left" @click="goSearch"><span class="btn-icon"><i
                        class="fas fa-search"></i></span> 조회
                </button>
                <button class="btn-size btn-blue fl_left" @click="getPurSlipLst"><span class="btn-icon"><i
                        class="far fa-file"></i></span> 가져오기
                </button>
            </div>
        </div>

        <!-- 검색조건 영역 -->
        <div class="desc-content search-border">
            <div class="item search_wrap">
                <div class="search_box">
                    <div class="search_title">
                        <span class="search_tit">- 회계일자</span>
                    </div>
                    <div class="search_con">
                        <div class="datepicker w-type-ymd02">
                            <dhx-calendar class="input ddate sDate" v-model="form.searchFr" />
                        </div>
                        <span class="wave"> ~ </span>
                        <div class="datepicker w-type-ymd02">
                            <dhx-calendar class="input ddate sDate" v-model="form.searchTo" />
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
                                    <span class="search_tit">- 회계일자</span>
                                </div>
                                <div class="search_con search-area">
                                    <div class="datepicker w-type-ymd02 w30p">
                                        <dhx-calendar class="input ddate sDate" v-model="form.searchFr" />
                                    </div>
                                    <span class="datepicker w10p dp-ib tac"> ~ </span>
                                    <div class="datepicker w-type-ymd02 w30p">
                                        <dhx-calendar class="input ddate sDate" v-model="form.searchTo" />
                                    </div>
                                  <button @click="dateSetting('toDay')" class="search_bt_white_s">당일</button>
                                  <button @click="dateSetting('crrntMnth')" class="search_bt_white_s">당월</button>
                                  <button @click="dateSetting('PrvsMnth')" class="search_bt_white_s">전월</button>
                                </div>
                            </div>

                            <div class="search_box_pop">
                                <div class="search_title">
                                    <span class="search_tit">- 지급계좌</span>
                                </div>
                                <div class="search_con search-area">
                                    <div v-if="authority==='ADMIN'" class="desc w100p">
                                        <div class="search-area">
                                            <input class="input" type="text" v-model="form.bankAcctNm" @input="initAccount" @keypress.enter="popAccount">
                                            <button class="icon is-right" @click="popAccount(true)"><i class="fas fa-search"></i>
                                            </button>
                                        </div>
                                    </div>
                                    <div v-else class="desc w100p">
                                        <div class="search-area">
                                            <input class="input" type="text" v-model="form.bankAcctNm" @input="initAccount" @keypress.enter="popAccount" >
                                            <button class="icon is-right" @click="popAccount(true)"><i class="fas fa-search"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="search_box_pop">
                                <div class="search_title">
                                    <span class="search_tit">- 지급거래처</span>
                                </div>
                                <div class="search_con search-area">
                                    <div v-if="authority==='ADMIN'" class="desc">
                                        <div class="search-area w100p">
                                            <input class="input dp-ib input-bg w30p_5r" type="text" v-model="form.vendorCd">
                                            <div class="dp-ib w70p">
                                                <input class="input" type="text" v-model="form.vendorNm" @input="initVendor" @keypress.enter="popVendor">
                                                <button class="icon is-right" @click="popVendor(true)"><i class="fas fa-search"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div v-else class="desc">
                                        <div class="search-area w100p">
                                            <input class="input dp-ib input-bg w30p_5r" type="text" v-model="form.vendorCd" disabled>
                                            <div class="dp-ib w70p">
                                                <input class="input" type="text" v-model="form.vendorNm" @input="initVendor" @keypress.enter="popCctr">
                                                <button class="icon is-right" @click="popVendor(true)"><i class="fas fa-search"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="search_box_pop">
                                <div class="search_title">
                                    <span class="search_tit">- 증빙 첨부</span>
                                </div>
                                <div class="search_con search-area">
                                    <b-select class="select is-fullwidth w100p" v-model="form.evdYn">
                                        <option value=''>==전체==</option>
                                        <option
                                                v-for="item in evdYnList"
                                                :key="item.key"
                                                :value="item.key"
                                                v-text="item.value"/>
                                    </b-select>
                                </div>
                            </div>

                            <div class="search_box_pop">
                                <div class="search_title">
                                    <span class="search_tit">- 작성자</span>
                                </div>
                                <div class="search_con search-area">
                                    <div class="desc">
                                        <div class="search-area">
                                            <input class="input dp-ib input-bg w30p_5r" type="text" v-model="form.writerId" disabled>
                                            <div v-if="authority==='ADMIN'" class="w70p dp-ib">
                                                <input class="input" type="text" v-model="form.wrtNm" @input="initEmp" @keypress.enter="popEmp">
                                                <button class="icon is-right" @click="popEmp(true)"><i class="fas fa-search"></i>
                                                </button>
                                            </div>
                                            <div v-else class="w70p dp-ib">
                                                <input class="input" type="text" v-model="form.wrtNm" @input="initEmp" @keypress.enter="popEmp" >
                                                <button class="icon is-right" @click="popEmp(true)"><i class="fas fa-search"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
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

        <!-- 테이블 -->
        <div class="table-area">
            <div class="table-b">
                <div class="table-header">
                    <div class="table-name">
                        <h3 class="ico_table_name">전표내역</h3>                        
                    </div>
                    <div class="table-name">
                        <h3 style='color : #CC3D3D'>{{selTotAmt}}</h3>
                    </div>
                    <div class="btn-wrap btn-type1 clearfix">
                        <button class="btn-size btn-gray" @click="openBulkEvidencePopup">
                            <span class="btn-icon"><i class="fas fa-file-alt"></i></span> 일괄파일증빙
                        </button>
                        <button class="btn-size btn-gray" @click="allChk">
                            <span class="btn-icon"><i class="fas fa-check"></i></span> 전체선택
                        </button>
                        <button class="btn-size btn-blue" @click="goSubmit">
                            <span class="btn-icon"><i class="fas fa-pen-alt"></i></span> 상신
                        </button>
                        <button class="btn-size btn-orange" @click="buttonEventErpDeleteNew">
                            <span class="btn-icon"><i class="fas fa-pen-alt"></i></span> 삭제
                        </button>
                        <button class="btn-size btn-excel" @click="saveExcel">엑셀 저장</button>
                    </div>
                </div>

                <div class="grid-wrap mt10">
                    <ag-grid-vue ref="grid" style="width: 100%;" class="ag-theme-alpine grid_search_height" rowSelection="multiple"
                            :columnDefs="columnDefs" 
                            :rowData="slipList" 
                            :gridOptions="gridOptions"
                            :defaultColDef="defaultColDef"
                            :frameworkComponents="frameworkComponent"
                            @rowDoubleClicked="rowDoubleClick"
                            @cell-clicked="onCellClicked"
                            />
                </div>
            </div>

        </div>
    </div>
</template>

<script>
    import Vue from 'vue'
    import mixin from '@/mixin'
    import mixinSlip from '@/mixin/slip'
    import slip from '@/mixin/slip-basic'    
    import _ from 'lodash'

    import DhxCalendar from '@/components/DhxCalendar.vue'
    import DhxGrid from '@/components/DhxGrid.vue'
    //팝업
    import Vendor from '@/components/Vendor_Ag.vue'
    import Account from '@/components/CustAccount_Ag.vue'
    import Cctr from '@/components/Cctr.vue'
    import Emp from '@/components/Emp_Ag.vue'
    import SlipPayDetailModal from '@/components/SlipPayDetailModal.vue'
    import EvidAtchPop from '@/components/EvidAtchPop.vue'
    import EvidAtchBatchPop from '@/components/EvidAtchBatchPop.vue'
    //import WingsAtchPop from '@/components/WingsAtchPop.vue'

    //import EvilSlipRcvLstModal from '@/components/EvilSlipRcvLstModal.vue'

    import { AgGridVue } from 'ag-grid-vue'
    import AgGridCheckbox from "@/components/agGrid/AgGridCheckbox.vue"
    import AgGridScanAttach from "@/components/agGrid/AgGridScanAttach.vue"

    //For grid events handling
    const eventBus = new Vue()

    const options = {
        'USE_SELECT_CD' : [{"detailCd" : "N", "detailNm" : "미첨부"}, {"detailCd" : "Y", "detailNm" : "첨부"}]
    }
    export default {
        name: 'purSlipLst',
        mixins: [mixin, mixinSlip,slip],
        components: {Cctr, Emp, Vendor, Account,DhxGrid, DhxCalendar, AgGridVue},
        data() {
            return {
                columnDefs : [],
                gridOptions : {},
                frameworkComponent : {
                    'checkBox' : AgGridCheckbox,
                    'scanAttach' : AgGridScanAttach
                },
                defaultColDef: {},
                title: '자금지급전표',
                slipTypes: [],
                slipStats: [],
                slipList: [],
                evdYnList: [{'key': 'N', 'value' : '미첨부'}, {'key': 'Y', 'value' : '첨부'}],
                tempData: [],
                authority: '',
                chkYn:false,
                form: {
                    //searchFr: this.$moment().add(-12, 'month').startOf('month').format('YYYY-MM-DD'),
                    //searchTo: this.$moment().format('YYYY-MM-DD'),
                    searchFr:this.$moment().startOf('month').format('YYYY-MM-DD'),
                    searchTo: this.$moment().endOf('month').format('YYYY-MM-DD'),
                    evdYn: '',
                    slipTypeCd: 'E11',
                    vendorCd: '',
                    vendorNm: '',
                    writerId: '',
                    accountNm:'',
                    wrtNm: '',
                    custAcctNo:'',
                    bankAcctNm : '',
                    bankBranchNm : '',
                },
                showEmpModal: false,
                showVendorModal: false,
                showAccountModal: false,
                result : [],
                cnt : 16, //grSlipNo 그리드 위치
                delChkList: [],
                rowIdx: '',
                selTotAmt: '',
                objectPopup: []
            };
        },
        methods: {
            makeColDef(){
                const that = this;
                this.columnDefs = [
                    {
                        headerName: '#', 
                        children:[
                             {
                                headerName: '#', 
                                field: 'chk', 
                                width: 60,
                                cellRenderer: 'checkBox'
                            },
                        ]
                    },
                    {
                        headerName: 'ERP 자금지급전표', 
                        children:[
                            {
                                headerName: 'No.', 
                                width: 70,
                                valueFormatter: (params) => {               
                                    return params.node.rowIndex + 1;
                                },
                                cellStyle:{textAlign: 'center'}
                            },
                            {
                                headerName: 'ERP번호(일자-Serial No)', 
                                field: 'erpSlipNo', 
                                width: 180,
                                cellStyle:{textAlign: 'center'}
                            },
                            {
                                headerName: '회계일자', 
                                field: 'postDt', 
                                width: 110,
                                cellStyle:{textAlign: 'center'}
                            },                            
                            {
                                headerName: '적요', 
                                field: 'hdSgtxt', 
                                width: 200,
                                cellStyle:{textAlign: 'left'}
                            },
                            {
                                headerName: '지급계좌', 
                                field: 'custAcctNo', 
                                width: 155,
                                cellStyle:{textAlign: 'center'}
                            },
                            {
                                headerName: '은행', 
                                field: 'bnkCd', 
                                width: 95,
                                cellStyle:{textAlign: 'left'}
                            }
                        ]
                    },
                    {
                        headerName: '지급정보', 
                        children:[
                            {
                                headerName: '거래처코드', 
                                field: 'payCustCd', 
                                width: 120,
                                cellStyle:{textAlign: 'left'}
                            },
                            {
                                headerName: '거래처명', 
                                field: 'payCustNm', 
                                width: 200,
                                cellStyle:{textAlign: 'left'}
                            },
                            {
                                headerName: '통화', 
                                field: 'curCd', 
                                width: 90,
                                cellStyle:{textAlign: 'center'}
                            },
                            {
                                headerName: '입력금액', 
                                field: 'totAmt', 
                                width: 120,
                                cellStyle:{textAlign: 'right'},
                                valueFormatter: (params) => { 
                                    return that.getNumberFormat(params.value);
                                }
                            },
                            {
                                headerName: '원화금액', 
                                field: 'krwTotAmt', 
                                width: 120,
                                cellStyle:{textAlign: 'right'},
                                valueFormatter: (params) => { 
                                    return that.getNumberFormat(params.value);
                                }
                            },
                        ]
                    },
                    {
                        headerName: '증빙첨부', 
                        children:[
                            {
                                headerName: '첨부', 
                                field: 'ufileCnt', 
                                width: 80,
                                cellStyle:{textAlign: 'center'},
                                cellRenderer: 'scanAttach',
                                // cellRendererParams:{
                                //     funcNm : 'openEvidencePopup'
                                // }
                            }
                        ]
                    },
                    {
                        headerName: '작성자', 
                        children:[
                            {
                                headerName: '사번', 
                                field: 'wrtId', 
                                width: 110,
                                cellStyle:{textAlign: 'center'}
                            },
                            {
                                headerName: '성명', 
                                field: 'wrtNm', 
                                width: 110,
                                cellStyle:{textAlign: 'left'}
                            },
                        ]
                    },
                    {
                        headerName: '그룹전표번호', 
                        field: 'grSlipNo', 
                        width: 140,
                        cellStyle:{textAlign: 'left'},
                        hide:true
                    },
                    {
                        headerName: '전자전표번호', 
                        field: 'eaSlipNo', 
                        width: 140,
                        cellStyle:{textAlign: 'left'},
                        hide:true
                    },
                ]
            },
            rowDoubleClick(params){
                
                const that = this;

                let grSlipNo = params.data.grSlipNo;
                let eaSlipNo = params.data.eaSlipNo;
                
                this.$modal.open({
                    component: SlipPayDetailModal,
                    parent: this,
                    props: {
                        grSlipNo: grSlipNo,
                        eaSlipNo: eaSlipNo,
                        slipTypeCd: this.form.slipTypeCd,
                        title: '자금지급전표',
                        value: params.data
                    },
                    width: 1200,
                    events: {
                        close(obj){
                            // console.log(obj)
                        }
                    }
                })
            },
            cellValueChange(params){
                if(params.data.chk){
                    this.delChkList.push(params.data)
                }
            },            
            calcSelAmt(){
                
                const initValue = 0;

                let totAmt = this.delChkList.reduce((prev, next) => {return prev + next.krwTotAmt}, initValue)
                
                const numTotAmt =  this.getNumberFormat(totAmt);
                
                if(numTotAmt){
                    this.selTotAmt = "선택 총합계 : " + numTotAmt
                }else{
                    this.selTotAmt = "";
                }   
                
            },
            onCellClicked(event){
                
                const field = event.colDef.field

                if(field === "chk"){

                    const idx = this.delChkList.findIndex((v) =>{
                        return v.erpSlipNo === event.data.erpSlipNo
                    })

                    if(event.data.chk){
                         if (idx < 0) this.delChkList.push(event.data)
                    }else{
                        const idx = this.delChkList.findIndex((v) =>{
                            return v.erpSlipNo === event.data.erpSlipNo
                        })

                        if (idx > -1) this.delChkList.splice(idx, 1)
                    }

                    //선택 전표 총 금액 계산
                    this.calcSelAmt();
                }
                else if(field === "ufileCnt"){
                    const that = this;

                    let i = this.gridOptions.api.getSelectedNodes()[0].childIndex
                    let row = this.gridOptions.api.getSelectedRows()[0]

                    let url = '/evidAtchPopModeless?docMngNo=' + row.eaSlipNo + '&readonly='+ false + '&readonlyCtrl='+ false;

                    if(!(!this.objectPopup[i] || this.objectPopup[i].closed)){
                      this.objectPopup[i].focus();
                    }else{
                      this.objectPopup[i] = window.open(url, '_blank', 'toolbar=0,location=0,menubar=0,resizable=yes');
                    }
                    //팝업 Close Callback
                    //브라우저 체크(IE 체크)
                    var agent = navigator.userAgent.toLowerCase();

                    if ((navigator.appName == 'Netscape' && navigator.userAgent.search('Trident') != -1) || (agent.indexOf("msie") != -1)){
                      this.objectPopup[i].attachEvent("onunload",function(){
                        var rows = [];
                        var rowNode = that.gridOptions.api.getDisplayedRowAtIndex(i);
                        rowNode.data.ufileCnt = localStorage.getItem("popFileCnt")
                        rows.push(rowNode)
                        that.gridOptions.api.redrawRows({ rowNodes: rows });
                      });
                    }else{
                      this.objectPopup[i].onbeforeunload = function(){
                        var rows = [];
                        var rowNode = that.gridOptions.api.getDisplayedRowAtIndex(i);
                        rowNode.data.ufileCnt = localStorage.getItem("popFileCnt")
                        rows.push(rowNode)
                        that.gridOptions.api.redrawRows({ rowNodes: rows });
                      };
                    }
                }
            },
            allChk(){
                
                this.delChkList = [];
                
                var filterList = [];

                this.gridOptions.api.forEachNodeAfterFilter((v, i) => {
                    filterList.push(v.data.grSlipNo)
                })

                this.chkYn = this.chkYn ? false : true;

                for(var i=0; i<filterList.length; i++){

                    for(var j=0; j<this.slipList.length; j++){

                        if(filterList[i] === this.slipList[j].grSlipNo){
                            this.slipList[j].chk = this.chkYn
                            this.cellValueChange({data:this.slipList[j]})
                        }
                    }
                }

                var size = this.$refs.grid.$children.length;
                for(var k=0; k<size; k++){
                    this.$refs.grid.$children[k].select = this.chkYn;
                }

                //선택 전표 총 금액 계산
                this.calcSelAmt();
            },
            getSlipTypeCombo() {
                this.$http.get(`/api/code/combo`, {params: {groupCd: "SLIP_TYPE_CD"}})
                    .then(response => {
                        this.slipTypes = response.data;
                    });
            },
            getSlipStatCombo() {
                this.$http.get(`/api/code/combo`, {params: {groupCd: "SLIP_STAT_CD"}})
                    .then(response => {
                        this.slipStats = response.data;
                    });
            },
            saveExcel() {
                var params = {
                        fileName : "전표내역"
                    };
                this.gridOptions.api.exportDataAsCsv(params);                
            },
            goSubmit() {
                var list = this.slipList.filter(v => v.chk)
                this.result = [];
                if(list.length > 0){
                    this.result = list;
                    this.buttonEventErpSubmit()
                } else {
                    this.$swal({ type: 'info', text: '상신 대상을 선택해 주세요.' });
                }
            },
            goSearch() {
                
                const param = JSON.parse(JSON.stringify(this.form));
                const stripFields = ['searchFr', 'searchTo'];
                _.forEach(stripFields, (name) => param[name] = this.toPure(param[name]));

                if (!this.validation(param)) return;

                this.$store.commit('loading');

                this.$http.post(`/api/erp/slip/list`, param)
                    .then(response => {
                        if (response.data) {
                            this.slipList = response.data;
                            this.delChkList = [];
                            this.selTotAmt = "";
                            this.chkYn = false;
                        }
                    }).catch(response => {
                        // TODO::Error Handling
                        return response
                    }).finally(() => {
                        this.$store.commit('finish');
                    });
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
            getPurSlipLst() {

                this.$swal({
                type: 'question',
                text: '가져오기 진행 하시겠습니까?',
                showCancelButton: true
                }).then(r => {
                if (r.value) {
                    this.$store.commit('loading');
                        this.$http.get(`/api/erp/slip/${this.form.slipTypeCd}`)
                        .then(response => {
                            if(response.data == 'success'){
                                this.goSearch()

                                this.$swal({type: 'warning', text: '가져오기 완료 하였습니다.'});
                            }
                        }).catch(response => {
                            return response
                        }).finally(() => {
                            this.$store.commit('finish');
                        })
                }
                })
            },
            validation(param) {
                if (!param.searchFr || !param.searchTo) {
                    this.$swal({type: 'warning', text: '회계일자를 입력해 주세요.'});
                    return false;
                }

                return true;
            },

            popEmp(clear) {
                let vm = this
                this.$modal.open({
                    component: Emp,
                    props: {
                        param: this.form.wrtNm
                    },
                    parent: this,
                    events: {
                        close(obj) {
                            vm.receiveEmp(obj)
                        }
                    }
                })
            },
            popVendor(clear) {
                let vm = this
                this.$modal.open({
                    component: Vendor,
                    props: {
                        param: this.form.vendorNm,
                        slipTypeCd: this.form.slipTypeCd
                    },
                    parent: this,
                    events: {
                        close(obj) {
                            vm.receiveVendor(obj)
                        }
                    }
                })
            },
            popAccount(clear) {
                let vm = this
                this.$modal.open({
                    component: Account,
                    props: {
                        param: this.form.bankAcctNm
                    },
                    parent: this,
                    events: {
                        close(obj) {
                            vm.receiveAccount(obj)
                        }
                    }
                })
            },

            receiveEmp(obj) {
                this.form.writerId = obj.empNo;
                this.form.wrtNm = obj.empNm;
                this.form.wrtUserDut = obj.dutNm;
                this.form.wrtUserDept = obj.deptNm;
            },
            receiveVendor(obj) {
                this.form.vendorCd = obj.vendCd;
                this.form.vendorNm = obj.vendNm;
                this.form.evdCustBizNo = obj.bizNo;
            },
            receiveAccount(obj) {
                this.form.bankAcctNm = obj.custAcctNo;
                this.form.bankBranchNm = obj.bankNm;
                this.form.custAcctNo = obj.custAcctNo;
            },
            initEmp(force) {
                if (force === true) this.form.wrtNm = '';
                if (this.form.wrtNm === '') {
                    this.form.writerId = '';
                    this.form.wrtUserDut = '';
                    this.form.wrtUserDept = '';
                }
            },
            initVendor(force) {
                if (force === true) this.form.vendorNm = '';
                if (this.form.vendorNm === '') {
                    this.form.vendorCd = '';
                    this.form.evdCustBizNo = '';
                }
            },
            initAccount(force) {
                if (force === true) this.form.accountNm = '';
                if (this.form.bankAcctNm === '') {
                    this.form.bankAcctNm = '';
                    this.form.bankBranchNm = '';
                    this.form.custAcctNo = '';
                }
            },
            setCallPageByParam(){
                if (this.$route.query) {
                    for (let member in this.form) {
                        if (this.$route.query[member] !== undefined) {
                            this.form[member] = this.$route.query[member]
                        }
                    }
                }
            },
            openBulkEvidencePopup(){
                const that = this;

                var targetList = this.delChkList.filter(v => v.chk).map(v => v.eaSlipNo);

                var list = this.slipList.filter(v => v.chk)
                
                if(targetList.length > 0) {
                    
                    this.$modal.open({
                        component: EvidAtchBatchPop,
                        props: {
                            docMngNo: targetList,
                            readonly: false,
                            value: list
                        },
                        parent: this,
                        width: 1200,
                        events: {
                            close(value) {
                                
                                if (value.length > 0) {
                                    that.goSearch();
                                }
                            }
                        }
                    })

                } else {
                    this.$swal({ type: 'info', text: '파일 첨부할 전표를 선택해 주세요.' });
                }
            },
          dateSetting(str){
            switch (str) {
              case 'toDay':
                this.form.searchFr = this.$moment().format('YYYYMMDD')
                this.form.searchTo = this.$moment().format('YYYYMMDD')
                break;
              case 'crrntMnth':
                this.form.searchFr = this.$moment().startOf('month').format('YYYYMMDD')
                this.form.searchTo = this.$moment().endOf('month').format('YYYYMMDD')
                break;
              case 'PrvsMnth':
                this.form.searchFr = this.$moment().add(-1, 'month').startOf('month').format('YYYYMMDD')
                this.form.searchTo = this.$moment().add(-1, 'month').endOf('month').format('YYYYMMDD')
                break;
            }
            // this.goSearch()
          }
        },
        beforeMount(){
            const that = this;

            this.makeColDef()
            this.defaultColDef = { resizable: true, filter:true, sortable: true };
            this.gridOptions = {
                onFilterChanged: () => {
                    that.chkYn = false;

                    for(var j=0; j<that.slipList.length; j++){
                        that.slipList[j].chk = that.chkYn
                    }

                    var size = that.$refs.grid.$children.length;
                    for(var k=0; k<size; k++){
                        that.$refs.grid.$children[k].select = that.chkYn;
                    }
                }
            }
        },
        mounted() {
            document.title = this.title + ' - IJEAS';
            this.authority = this.$store.state.loginInfo.authorities[0].roleCd;
            this.form.writerId = this.$store.state.loginInfo.loginId;
            this.form.wrtNm = this.$store.state.loginInfo.userName;

            this.goSearch()
        },
        destroyed() {
          if(this.objectPopup.length > 0){
            for (const item of this.objectPopup) {
              item.close()
            }
          }
        },
    };
</script>

<style scoped>
    .control.select.is-fullwidth {
        width: 55%;
    }
</style>
