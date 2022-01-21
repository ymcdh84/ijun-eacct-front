<template>
    <div class="inner-box">
        <div class="content-name">
            <h2 class="dp-ib">{{title}}</h2>
            <div class="btn-wrap btn-type1 clearfix">
                <button class="btn-size btn-blue fl_left" @click="goSearch"><span class="btn-icon"><i class="fas fa-pen-alt"></i></span> 조회</button>
            </div>
        </div>

        <!-- 검색조건 영역 -->
        <div class="desc-content search-border">
            <div class="item desc-left">
                <div class="desc-item">
                    <div class="tit">
                        <span class="label-tit">- 회사</span>
                    </div>
                    <div v-if="authority==='ADMIN'" class="desc">
                        <b-select class="select is-fullwidth" v-model="form.compCd">
                            <option value=''>==전체==</option>
                            <option
                                    v-for="item in compCds"
                                    :key="item.key"
                                    :value="item.key"
                                    v-text="item.value"/>
                        </b-select>
                    </div>
                    <div v-else class="desc">
                        <b-select class="select is-fullwidth" v-model="form.compCd" disabled>
                            <option value=''>==전체==</option>
                            <option
                                    v-for="item in compCds"
                                    :key="item.key"
                                    :value="item.key"
                                    v-text="item.value"/>
                        </b-select>
                    </div>
                </div>
                <div class="desc-item">
                    <div class="tit">
                        <span class="label-tit">- 사용일자</span>
                    </div>
                    <div class="desc">
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
                <div class="desc-item">
                    <div class="tit">
                        <span class="label-tit">- 카드소유자</span>
                    </div>
                    <div class="desc">
                        <div class="td-s-thumb search-area" style="width: 410px;">
                            <input class="input input-bg" type="text" style="width:65px;" v-model="form.crdPssrId" disabled>
                            <div class="ip-box ip-box-w02" style="width:120px;">
                                <input class="input" type="text" v-model="form.crdPssrNm" @input="initEmp" @keypress.enter="popEmp">
                                <button class="icon is-right" @click="popEmp(true)"><i class="fas fa-search"></i>
                                </button>
                            </div>
                            <div class="ip-box ip-box-w02" style="width:200px;">
                                <input class="input input-bg" type="text" style="width:80px;" v-model="form.crdPssrDut" disabled>
                                <input class="input input-bg" type="text" style="width:120px;" v-model="form.crdPssrDept" disabled>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="item desc-center">
                <div class="desc-item" style="height: 25px">
                </div>
                <div class="desc-item">
                    <div class="tit">
                        <span class="label-tit">- 처리상태</span>
                    </div>
                    <div class="desc">
                        <b-select class="select is-fullwidth" v-model="form.useDtlsStatCd">
                            <option value=''>==전체==</option>
                            <option
                                    v-for="item in useDtlsStatCds"
                                    :key="item.key"
                                    :value="item.key"
                                    v-text="item.value"/>
                        </b-select>
                    </div>
                </div>
                <div class="desc-item">
                    <div class="tit">
                        <span class="label-tit">- 카드사</span>
                    </div>
                    <div class="desc">
                        <b-select class="select is-fullwidth" v-model="form.crdCompCd">
                            <option value=''>==전체==</option>
                            <option
                                    v-for="item in crdCompCds"
                                    :key="item.key"
                                    :value="item.key"
                                    v-text="item.value"/>
                        </b-select>
                    </div>
                </div>
            </div>
            <div class="item desc-right">
                <div class="desc-item" style="height: 25px">
                </div>
                <div class="desc-item">
                    <div class="tit">
                        <span class="label-tit">- 카드번호</span>
                    </div>
                    <div class="desc">
                        <input class="input Rt-M tal" type="text" v-model="form.crdNo">
                    </div>
                </div>
                <div class="desc-item">
                    <div class="tit">
                        <span class="label-tit">- 카드구분</span>
                    </div>
                    <div class="desc">
                        <b-select class="select is-fullwidth" v-model="form.crdFgCd">
                            <option value=''>==전체==</option>
                            <option
                                    v-for="item in crdFgCds"
                                    :key="item.key"
                                    :value="item.key"
                                    v-text="item.value"/>
                        </b-select>
                    </div>
                </div>
            </div>
        </div>
        <!-- //검색조건 영역 -->

        <!-- 테이블 -->
        <div class="table-area">
            <div class="table-b">
                <div class="table-header">
                    <div class="table-name">
                        <h3 class="ico_table_name">법인카드 사용내역</h3>
                    </div>
                    <div class="btn-wrap btn-type1 clearfix">
                        <button class="btn-size btn-excel" @click="saveExcel">엑셀 저장</button>
                    </div>
                </div>

                <div class="grid-wrap">
                    <div id="gridbox" class="grid-tbl-box"></div>
                    <div id="pagingbox" class="pagingbox"></div>
                </div>

                <div class="grid-wrap">                    
                    <ag-grid-vue         
                        ref="grid"
                        style="width: 100%; height: 50vh; min-height: 510px;"
                        class="ag-theme-alpine"
                        rowSelection="multiple"
                                                
                        :columnDefs="columnDefs"                        
                        :rowData="useDetails"
                        :gridOptions="gridOptions"   
                        :defaultColDef="defaultColDef"
                        :frameworkComponents="frameworkComponents"    
                        @grid-ready="onReady"                                             
                        @cell-clicked="onCellClicked"
                    />                    
                </div>
            </div>
        </div>
        <!-- //테이블 -->

        <!--팝업-->
        <b-modal :active.sync="showEmpModal" has-modal-card @receive="receiveEmp">
            <emp :param="form.crdPssrNm"></emp>
        </b-modal>
        <!--//팝업 -->
    </div>
</template>

<script>
    import mixin from '@/mixin';
    import mixinSlip from '@/mixin/slip';
    import common from '@/mixin/common';
    import _ from 'lodash'
    
    import DhxCalendar from '@/components/DhxCalendar.vue'
    import DatepickerCellRenderer from '@/components/agGrid/datepicker-cell-renderer'
    import NumberInputCellRender from '@/components/agGrid/numberinput-cell-renderer'
    import InputCellRender from '@/components/agGrid/input-cell-renderer'

    import Emp from '@/components/Emp.vue';
    import {AgGridVue} from 'ag-grid-vue'

    export default {
        name: 'CardUseLst',
        mixins: [mixin, mixinSlip, common],
        components: {Emp, DhxCalendar, AgGridVue},
        data() {
            return {
                title: '법인카드사용현황',
                compCds: [],
                crdCompCds: [],
                useDtlsStatCds: [],
                crdFgCds: [],
                useDetails: [],
                showEmpModal: false,
                authority: '',
                form: {
                    compCd: '',
                    crdCompCd: '',
                    useDtlsStatCd: '',
                    crdFgCd: '',
                    crdNo: '',
                    crdPssrId: '',
                    crdPssrNm: '',
                    crdPssrTitle: '',
                    crdPssrDut: '',
                    crdPssrDept: '',
                    searchDtmFr: this.$moment().add(-1, 'month').startOf('month').format('YYYY-MM-DD'),
                    searchDtmTo: this.$moment().format('YYYY-MM-DD'),
                },
                gridOptions: {         
                   //enableColResize: true,
                   //enableFilter: true,
                   //animateRows: false,
                   //enableSorting: true
                },
                defaultColDef: {         
                   resizable: true,
                   filter: true,
                   sortable: true
                },                
                gridApi : null ,    //gridAip
                columnApi : null ,  //columApi
                columnDefs: [] ,    //comulum Defs
                frameworkComponents: {
                    datePicker: DatepickerCellRenderer,
                    numberInputCellRender: NumberInputCellRender,
                    inputCellRender: InputCellRender,
                }
            };
        },
        methods: {
            //그리드 Ready
            onReady(params) {      
                
                //그리드용 api 정의
                this.gridApi = params.api;
                this.columnApi = params.columnApi;

                //this.gridApi.sizeColumnsToFit();
            },
            //그리드 합계 계산 함수            
            makeHeaderTotal() {
                
                const initValue = 0;
                
                let sum = [{
                    rn: '합계'
                    , purchTot: this.useDetails.reduce((prev, next) => {return prev + next.purchTot}, initValue)
                    , apprAmt: this.useDetails.reduce((prev, next) => {return prev + next.apprAmt}, initValue)
                    , vat: this.useDetails.reduce((prev, next) => {return prev + next.vat}, initValue)
                }]

                this.gridOptions.api.setPinnedTopRowData(sum)                
            },
            //그리드 셀 클릭 이벤트 함수
            onCellClicked(event) {
                
                const idx = event.rowIndex
                const field = event.colDef.field
   
                if(field === "procCancel"){//처리취소 컬럼 클릭
                    
                    const useDtlsStatCd = event.node.data.useDtlsStatCd
                    
                    if(useDtlsStatCd === "40"){//처리상태가 사적처리비용인 경우
                        this.$swal({
                            type: 'warning',
                            text: `기존 처리를 취소 하시겠습니까?`,
                            showCancelButton: true,
                            confirmButtonText: '예',
                            cancelButtonText: '아니오',
                        }).then((result) => {
                            if (result.value) {
                                alert(event.node.data.useDtlsNo)                                    
                            }
                        });
                    }
                }
            },
            //컬럼 정의 함수
            createColumnDefs() {                
                const vm = this
                this.columnDefs = [
                    {headerName: 'No.', width : 60, valueGetter: (params) => {return params.node.rowIndex + 1 }},
                    {
                        headerName:'카드번호'
                      , field:'cardNo'
                      , width: 200
                      , valueFormatter: function(params) {               
                            return vm.getFormattedCardNumber(params.value);//카드번호 포맷<slip.js>
                        }       
                    },
                    {headerName:'카드사', field:'crdCompNm', width:150}, 
                    {headerName:'카드구분', field:'crdFgNm', width:100}, 
                    {headerName:'승인번호', field:'apprNo', width:120}, 
                    {headerName:'매입구분', field:'acqClassNm', width:100}, 
                    {headerName:'처리상태', field:'useDtlsStatNm', width:110}, 
                    {
                        headerName:'처리취소'
                      , field:'procCancel'
                      , width:110                      
                      , cellRenderer: function(params){                          
                            if(params.node.data.useDtlsStatCd == '40'){    
                                return "<button type='button' class='icon' @click='cancel()'><i class='fas fa-ban'></i></button>"
                            }
                        }
                    }, 
                    {
                        headerName:'사용일자#'
                      , field:'apprDate'                      
                      , width:120
                      , cellRenderer: 'datePicker'                                             
                    },                    
                    {
                        headerName:'사용일자'
                      , field:'apprDate'                      
                      , width:120
                      , valueFormatter: function(params) {               
                            return vm.getDateFormat(params.value);//날짜 포맷<slip.js>
                        }                                             
                    }, 
                    {
                        headerName:'사용시간'
                      , field:'apprTime'
                      , width:120
                      , valueFormatter: function(params) {               
                            return vm.getTimeFormat(params.value);//시간 포맷<slip.js>
                        }                                                                    
                    }, 
                    {
                        headerName:'사용금액#'
                      , field:'purchTot'
                      , width:150
                      , cellRenderer: 'numberInputCellRender'              
                    //   , cellRendererParams: {
                    //         disable: true
                    //   }                     
                    },
                    {
                        headerName:'사용금액'
                      , field:'purchTot'
                      , width:150
                      , type: 'numericColumn'
                      , editable: true
                      , valueFormatter: function(params) {               
                            return vm.getNumberFormat(params.value);//숫자 포맷<slip.js>
                        }                       
                    },                    
                    {
                        headerName:'공급가액'
                      , field:'apprAmt'
                      , width:150
                      , type: 'numericColumn'
                      , editable: true
                      , valueFormatter: function(params) {               
                            return vm.getNumberFormat(params.value);//숫자 포맷<slip.js>
                        }                       
                    },
                    {
                        headerName:'부가세'
                      , field:'vat'
                      , width:150
                      , type: 'numericColumn'
                      , editable: true
                      , valueFormatter: function(params) {               
                            return vm.getNumberFormat(params.value);//숫자 포맷<slip.js>
                        }                       
                    },
                    {
                        headerName:'봉사료'
                      , field:'tips'
                      , width:150
                      , type: 'numericColumn'
                      , editable: true
                      , valueFormatter: function(params) {               
                            return vm.getNumberFormat(params.value);//숫자 포맷<slip.js>
                        }                       
                    },                    
                    {headerName:'가맹점명', field:'merchNm', width:200}, 
                    {
                        headerName:'가맹점주소'
                      , field:'merchAddr'
                      , width:300
                      , cellRenderer: 'inputCellRender'
                      , cellRendererParams: {
                            maxlength: 15
                      }                         
                    }, 
                    {headerName:'업종명', field:'mccNm', width:120}, 
                    {headerName:'과세구분', field:'etcNm', width:100}, 
                    {headerName:'전표번호', field:'eaSlipNo', width:150}, 
                    {headerName:'전표상태', field:'slipStatNm', width:100}, 
                    {headerName:'카드사용자', field:'crdPssrNm', width:100}, 
                    {headerName:'직급', field:'crdUseDutNm', width:100}, 
                    {headerName:'부서명', field:'crdUseDeptNm', width:150}, 
                    {headerName:'회사', field:'compNm', width:150}, 
                    {headerName:'경비처리기한', field:'procPeriod', width:120}, 
                    {headerName:'경비처리자', field:'slipProcNm', width:100}, 
                    {headerName:'전송일시', field:'erpSlipDtm', width:150},                    
                    
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
                this.$http.get(`/api/code/combo`, {params: {groupCd: "USE_DTLS_STAT_CD"}})
                    .then(response => {
                        this.useDtlsStatCds = response.data;
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

                //일자 유효성 체크 추가
                if(!this.validateDate(this.form, [{fromDate: 'searchDtmFr', toDate: 'searchDtmTo'}])) return;

                const param = JSON.parse(JSON.stringify(this.form));
                
                // const stripFields = ['searchDtmFr', 'searchDtmTo','crdNo'];
                // _.forEach(stripFields, (name) => param[name] = this.toPure(param[name]));

                this.$store.commit('loading');
                this.$http.post(`/api/card/useList`, {
                        compCd: param.compCd,
                        searchDtmFr: param.searchDtmFr,
                        searchDtmTo: param.searchDtmTo,
                        useDtlsStatCd: param.useDtlsStatCd,
                        cardNo: param.crdNo,
                        crdPssrId: param.crdPssrId,
                        crdCompCd: param.crdCompCd,
                        crdFgCd: param.crdFgCd
                    }
                ).then(response => {
                    if (response.data) {                        
                        this.useDetails = response.data;
                        //this.config.queryPage(0)
                    }

                    if(response.data.length == 0){
                        this.$swal({ type: 'warning', text: '조회내역이 존재하지 않습니다.' })
                    }  
                }).finally(() => {
                    this.$store.commit('finish')
                });
            },
            popEmp(clear) {
                if (clear === true) {
                    this.form.crdPssrId = '';
                    this.form.crdPssrNm = '';
                    this.form.crdPssrDut = '';
                    this.form.crdPssrDept = '';
                }
                this.showEmpModal = true;
            },
            receiveEmp(obj) {
                this.form.crdPssrId = obj.empNo;
                this.form.crdPssrNm = obj.empNm;
                this.form.crdPssrDut = obj.dutNm;
                this.form.crdPssrDept = obj.deptNm;
            },
            initEmp(force) {
                if (force === true) this.form.crdPssrNm = '';
                if (this.form.crdPssrNm === '') {
                    this.form.crdPssrId = '';
                    this.form.crdPssrDut = '';
                    this.form.crdPssrDept = '';
                }
            },
            
        },
        mounted() {
            this.form.compCd = this.$store.state.loginInfo.compCd;
            this.authority = this.$store.state.loginInfo.authorities[0].roleCd;
            this.getCompCdCombo();
            this.getCardCompCdCombo();
            this.getUseStatCdCombo();
            this.getCardFgCdCombo();
            this.goSearch();
            this.createColumnDefs();//그리드 컬럼 정의 함수 호출
            
        },
        watch: {
            'useDetails' : {
                deep: true,
                handler(value){
                    this.makeHeaderTotal()
                }
            }
        }
    };    
</script>

<style scoped>
    .gridbox {
        height: 390px !important;
    }

    .gridbox .objbox {
        height: 350px !important;
    }

    .desc-content:after {
        clear: both;
        content: '';
        display: block;
    }

    .btn-wrap {
        margin-bottom: 20px;
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

    .desc-content .item.desc-left .desc-item .td-s-thumb.search-area:after {
        clear: both;
        content: '';
        display: block;
    }

    .desc-content .item.desc-left .desc-item .td-s-thumb.search-area input,
    .desc-content .item.desc-left .desc-item .td-s-thumb.search-area .ip-box {
        float: left;
    }

    .desc-content .item.desc-left .desc-item .desc.select select {
        width: 70%;
    }

    .desc-content .item.desc-left {
        width: 35%;
        padding-right: 40px;
    }

    .desc-content .item.desc-center {
        width: 35%;
        padding-right: 40px;
    }

    .desc-content .item.desc-right {
        width: 30%;
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
    }

    .search-border .td-s-thumb.search-area > input,
    .search-border .td-s-thumb.search-area > .ip-box
    .search-border .td-s-thumb.search-area > button {
        float: left;
    }

    .search-border .td-s-thumb.search-area .ip-box.ip-box-w02 {
        width: 60%;
        margin-left: 6px;
    }

    .remove_text {
        margin-left: 0;
    }

    .contents div.gridbox_material.gridbox .xhdr {
        border-bottom: 1px solid #dfdfdf;
    }

    @media (max-width: 1580px) {
        .search-border .td-s-thumb.search-area .ip-box.ip-box-w02 {
            width: 50%;
        }
    }
</style>

<style lang="scss" scoped>
    .slip-grid {
        :global(.xhdr table tbody tr:last-child) {
            background-color: #f9f9f3;
        }

        :global(.xhdr table tbody tr:last-child td) {
            background-color: transparent !important;
        }

        :global(.xhdr table tbody tr:last-child td div) {
            background-color: transparent !important;
            color: inherit !important;
            text-align: inherit !important;
        }
    }
</style>
