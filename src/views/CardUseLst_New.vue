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
            <div class="item search_wrap">
                <div class="search_box">
                    <div class="search_title">
                        <span class="search_tit">- 사용일자</span>
                    </div>
                    <div class="search_con">
                        <div class="datepicker w-type-ymd02">
                            <dhx-calendar class="input ddate sDate" v-model="form.searchDtmFr" />
                        </div>
                        <span class="wave"> ~ </span>
                        <div class="datepicker w-type-ymd02">
                            <dhx-calendar class="input ddate sDate" v-model="form.searchDtmTo" />
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
                                    <span class="search_tit">- 사용일자</span>
                                </div>
                                <div class="search_con search-area">
                                    <div class="datepicker w-type-ymd02 w45p">
                                        <dhx-calendar class="input ddate sDate" v-model="form.searchDtmFr" />
                                    </div>
                                    <span class="datepicker w10p dp-ib tac"> ~ </span>
                                    <div class="datepicker w-type-ymd02 w45p">
                                        <dhx-calendar class="input ddate sDate" v-model="form.searchDtmTo" />
                                    </div>
                                </div>
                            </div>

                            <div class="search_box_pop">
                                <div class="search_title">
                                    <span class="search_tit">- 회사</span>
                                </div>
                                <div class="search_con search-area">
                                    <div v-if="authority==='ADMIN'" class="desc">
                                        <b-select class="select is-fullwidth w100p" v-model="form.compCd">
                                            <option value=''>==전체==</option>
                                            <option
                                                    v-for="item in compCds"
                                                    :key="item.key"
                                                    :value="item.key"
                                                    v-text="item.value"/>
                                        </b-select>
                                    </div>
                                    <div v-else class="desc">
                                        <b-select class="select is-fullwidth w100p" v-model="form.compCd" disabled>
                                            <option value=''>==전체==</option>
                                            <option
                                                    v-for="item in compCds"
                                                    :key="item.key"
                                                    :value="item.key"
                                                    v-text="item.value"/>
                                        </b-select>
                                    </div>
                                </div>
                            </div>

                            <div class="search_box_pop">
                                <div class="search_title">
                                    <span class="search_tit">- 카드소유자</span>
                                </div>
                                <div class="search_con search-area">
                                    <input class="input dp-ib input-bg w20p_5r" type="text" v-model="form.crdPssrDut" disabled>
                                    <input class="input dp-ib input-bg w30p_5r" type="text" v-model="form.crdPssrDept" disabled>
                                    <input class="input dp-ib input-bg w20p_5r" type="text" v-model="form.crdPssrId" disabled>
                                    <template v-if="roleSelectCd === '10'">
                                        <div class="dp-ib w30p">
                                            <input class="input" type="text" v-model="form.crdPssrNm" @input="initEmp" @keypress.enter="popEmp">
                                            <button class="icon is-right" @click="popEmp"><i class="fas fa-search"></i>
                                            </button>
                                        </div>
                                    </template>
                                    <template v-else>
                                        <div class="dp-ib w30p">
                                            <input class="input" type="text" v-model="form.crdPssrNm" disabled>
                                        </div>
                                    </template>
                                </div>
                            </div>

                            <div class="search_box_pop">
                                <div class="search_title">
                                    <span class="search_tit">- 처리상태</span>
                                </div>
                                <div class="search_con search-area">
                                    <b-select class="select is-fullwidth w100p" v-model="form.useDtlsStatCd">
                                        <option value=''>==전체==</option>
                                        <option
                                                v-for="item in useDtlsStatCds"
                                                :key="item.key"
                                                :value="item.key"
                                                v-text="item.value"/>
                                    </b-select>
                                </div>
                            </div>

                            <div class="search_box_pop">
                                <div class="search_title">
                                    <span class="search_tit">- 카드사</span>
                                </div>
                                <div class="search_con search-area">
                                    <b-select class="select is-fullwidth w100p" v-model="form.crdCompCd">
                                        <option value=''>==전체==</option>
                                        <option
                                                v-for="item in crdCompCds"
                                                :key="item.key"
                                                :value="item.key"
                                                v-text="item.value"/>
                                    </b-select>
                                </div>
                            </div>

                            <div class="search_box_pop">
                                <div class="search_title">
                                    <span class="search_tit">- 카드번호</span>
                                </div>
                                <div class="search_con search-area">
                                    <input class="input Rt-M tal w100p" type="text" v-model="form.crdNo">
                                </div>
                            </div>

                            <div class="search_box_pop">
                                <div class="search_title">
                                    <span class="search_tit">- 카드구분</span>
                                </div>
                                <div class="search_con search-area">
                                    <b-select class="select is-fullwidth w100p" v-model="form.crdFgCd">
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
                        <h3 class="ico_table_name">법인카드 사용내역</h3>
                    </div>
                    <div class="btn-wrap btn-type1 clearfix">
                        <button class="btn-size btn-excel" @click="saveExcel">엑셀 저장</button>
                    </div>
                </div>

                <div class="grid-wrap">
                    <div id="gridbox" class="grid-tbl-box"></div>
                    <div id="pagingbox" class="pagingbox" style="display:none"></div>
                </div>

                <div class="grid-wrap">
                    <!-- <dhx-grid class="slip-grid" ref="grid" v-model="useDetails" :config="config" @constructGridSuccessful="constructGridSuccessful"/> -->
                    <ag-grid-vue ref="grid" style="width: 100%;" class="ag-theme-alpine grid_search_height" 
                                :columnDefs="columnDefs" 
                                :rowData="useDetails" 
                                :gridOptions="gridOptions"
                                :defaultColDef="defaultColDef"
                                @cell-clicked="onCellClicked"/>
                </div>
            </div>
        </div>
        <!-- //테이블 -->

        <!--팝업-->
        <!-- <b-modal :active.sync="showEmpModal" has-modal-card @receive="receiveEmp">
            <emp :param="form.crdPssrNm"></emp>
        </b-modal> -->
        <!--//팝업 -->
    </div>
</template>

<script>
    import mixin from '@/mixin';
    import mixinSlip from '@/mixin/slip';
    import _ from 'lodash'
    import DhxCalendar from '@/components/DhxCalendar.vue'
    import DhxGrid from '@/components/DhxGrid.vue'
    import Emp from '@/components/Emp_Ag.vue';
    import { AgGridVue } from 'ag-grid-vue'

    export default {
        name: 'CardUseLst',
        mixins: [mixin, mixinSlip],
        components: {Emp, DhxGrid, DhxCalendar, AgGridVue},
        data() {
            return {
                columnDefs : [],
                gridOptions : {},
                defaultColDef:{},
                title: '법인카드 사용현황',
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
                    searchDtmFr: this.$moment().startOf('month').format('YYYY-MM-DD'),
                    searchDtmTo: this.$moment().format('YYYY-MM-DD'),
                },
                loginDeptCd: ''
            };
        },
        methods: {
            makeColDef(){
                const that = this;
                this.columnDefs = [
                    {
                        headerName: 'No.', 
                        field: 'rn', 
                        width: 70,
                        colSpan:(params) => {               
                            if(params.data.rn === '합계'){
                                return 8;
                            }else{
                                return 1;
                            }
                        },
                        cellStyle:(params) => {               
                            if(params.data.rn === '합계'){
                                return {textAlign: 'center'}
                            }else{
                                return {textAlign: 'left'}
                            }
                        },
                        valueFormatter: (params) => {               
                            if(params.data.rn === '합계'){
                                return '합계'
                            }else{
                                return params.node.rowIndex+1;
                            }
                        }
                        
                    },
                    {
                        headerName: '카드번호', 
                        field: 'cardNo', 
                        width: 180, 
                        cellStyle:{textAlign: 'left'},
                        valueFormatter: (params) => {               
                            return that.getFormattedCardNumber(params.value);
                        }
                    },
                    {headerName: '카드사용자', field: 'crdPssrNm', width: 100, cellStyle:{textAlign: 'left'}},
                    {
                        headerName: '사용일자', 
                        field: 'apprDate', 
                        width: 110, 
                        cellStyle:{textAlign: 'center'},
                        valueFormatter: (params) => {      
                            if(!_.isEmpty(params.value)){
                                return that.$moment(params.value).format('YYYY-MM-DD');
                            }else{
                                return '';
                            }
                        }
                    },
                    {
                        headerName: '사용시간', 
                        field: 'apprTime', 
                        width: 110, 
                        cellStyle:{textAlign: 'center'},
                        valueFormatter: (params) => {   
                            if(!_.isEmpty(params.value)){
                                return that.$moment(params.value, 'HHmmss').format('HH:mm:ss');
                            }else{
                                return '';
                            }      
                        }
                    },
                    {headerName: '처리상태', field: 'useDtlsStatNm', width: 100, cellStyle:{textAlign: 'left'}},
                    {
                        headerName: '처리취소', 
                        field: 'useDtlsCancel', 
                        width: 90, 
                        cellStyle:{textAlign: 'center'},
                        cellRenderer: (params) => { 
                            if(params.data.useDtlsStatCd === '40'){
                                return '<button type="button" class="icon" style="padding-top: 15px;"><i class="fas fa-ban"></i></button>'
                            }
                        }
                    },
                    {headerName: '사업자번호', field: 'merchBizNo', width: 120, cellStyle:{textAlign: 'center'}},
                    {
                        headerName: '사용금액', 
                        field: 'purchTot', 
                        width: 110, 
                        cellStyle:(params) => {               
                            if(params.data.rn === '합계'){
                                return {textAlign: 'right', color:'red'}
                            }else{
                                return {textAlign: 'right'}
                            }
                        },
                        valueFormatter: (params) => {               
                            return that.getNumberFormat(params.value);
                        }
                    },
                    {
                        headerName: '공급가액', 
                        field: 'apprAmt', 
                        width: 110, 
                        cellStyle:(params) => {               
                            if(params.data.rn === '합계'){
                                return {textAlign: 'right', color:'red'}
                            }else{
                                return {textAlign: 'right'}
                            }
                        },
                        valueFormatter: (params) => {               
                            return that.getNumberFormat(params.value);
                        }
                    },
                    {
                        headerName: '부가세', 
                        field: 'vat', 
                        width: 100, 
                        cellStyle:(params) => {               
                            if(params.data.rn === '합계'){
                                return {textAlign: 'right', color:'red'}
                            }else{
                                return {textAlign: 'right'}
                            }
                        },
                        valueFormatter: (params) => {               
                            return that.getNumberFormat(params.value);
                        }
                    },
                    {
                        headerName: '봉사료', 
                        field: 'tips', 
                        width: 100, 
                        cellStyle:(params) => {               
                            if(params.data.rn === '합계'){
                                return {textAlign: 'right', color:'red'}
                            }else{
                                return {textAlign: 'right'}
                            }
                        },
                        valueFormatter: (params) => {               
                            return that.getNumberFormat(params.value);
                        }
                    },
                    {
                        headerName: '가맹점명', 
                        field: 'merchNm', 
                        width: 140, 
                        cellStyle:{textAlign: 'left'},
                        colSpan:(params) => {               
                            if(params.data.rn === '합계'){
                                return 16;
                            }else{
                                return 1;
                            }
                        },
                    },
                    {headerName: '가맹점주소', field: 'merchAddr', width: 400, cellStyle:{textAlign: 'left'}},                    
                    {headerName: '전표번호', field: 'eaSlipNo', width: 150, cellStyle:{textAlign: 'left'}},
                    {headerName: '전표상태', field: 'slipStatNm', width: 140, cellStyle:{textAlign: 'left'}},                    
                    {headerName: '직급', field: 'crdUseDutNm', width: 120, cellStyle:{textAlign: 'left'}},
                    {headerName: '부서명', field: 'crdUseDeptNm', width: 150, cellStyle:{textAlign: 'left'}},
                    {headerName: '회사', field: 'compNm', width: 150, cellStyle:{textAlign: 'left'}},
                    {headerName: '카드사', field: 'crdCompNm', width: 100, cellStyle:{textAlign: 'left'}},
                    {headerName: '카드구분', field: 'crdFgNm', width: 120, cellStyle:{textAlign: 'left'}},
                    {headerName: '승인번호', field: 'apprNo', width: 120, cellStyle:{textAlign: 'left'}},
                    {headerName: '매입구분', field: 'acqClassNm', width: 120, cellStyle:{textAlign: 'left'}},
                    {headerName: '업종명', field: 'mccName', width: 140, cellStyle:{textAlign: 'left'}},
                    {headerName: '과세구분', field: 'etcNm', width: 140, cellStyle:{textAlign: 'left'}},
                    {headerName: '경비처리기한', field: 'procPeriod', width: 140, cellStyle:{textAlign: 'left'}},
                    {headerName: '경비처리자', field: 'slipProcNm', width: 120, cellStyle:{textAlign: 'left'}},
                    {
                        headerName: '전송일시', 
                        field: 'erpSlipDtm', 
                        width: 150, 
                        cellStyle:{textAlign: 'left'},
                        valueFormatter: (params) => {               
                            return params.value === null ? '' : that.$moment(params.value).format('YYYY-MM-DD HH:mm:ss');
                        }
                    },
                ];
            },
            makeSumData(){
                const initValue = 0;
                
                let sum = [{
                    rn: '합계', 
                    purchTot: this.useDetails.reduce((prev, next) => {return prev + next.purchTot}, initValue), 
                    apprAmt: this.useDetails.reduce((prev, next) => {return prev + next.apprAmt}, initValue), 
                    vat: this.useDetails.reduce((prev, next) => {return prev + next.vat}, initValue), 
                    tips: this.useDetails.reduce((prev, next) => {return prev + next.tips}, initValue)
                }]

                this.gridOptions.api.setPinnedTopRowData(sum)                
            }, 
            onCellClicked(params) {
                const that = this;
                var field = params.colDef.field;
                var statCd = params.data.useDtlsStatCd;
   
                if(field === "useDtlsCancel" && statCd === "40"){//처리취소 컬럼 클릭
                    
                    this.$swal({
                        type: 'warning',
                        text: `기존 처리를 취소 하시겠습니까?`,
                        showCancelButton: true,
                        confirmButtonText: '예',
                        cancelButtonText: '아니오',
                    }).then((result) => {
                        if (result.value) {
                            this.$http.post(`/api/card/privateCost/Cancel`,
                                {
                                    useDtlsNo: params.data.useDtlsNo,
                                }
                            ).then(response => {
                                if(response.data){
                                    that.goSearch();
                                }
                            }).catch(response => {
                                console.error("onCellClicked Error " + response);
                            });
                        }
                    });
                    
                }
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
              var params = {
                fileName : "법인카드 사용현황 수신내역"
              };
              this.gridOptions.api.exportDataAsCsv(params)
            },
            goSearch() {
                const param = JSON.parse(JSON.stringify(this.form));
                const stripFields = ['searchDtmFr', 'searchDtmTo','crdNo'];
                _.forEach(stripFields, (name) => param[name] = this.toPure(param[name]));

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
                )
                    .then(response => {
                        if (response.data) {
                            this.useDetails = response.data;
                            this.makeSumData();
                        }
                    }).catch(response => {
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
            popEmp() {

                const that = this;

                this.$modal.open({
                    component: Emp,
                    parent: this,
                    props: {
                        param: that.form.crdPssrNm
                    },
                    width: 800,
                    events: {
                        close(object) {
                            that.form.crdPssrId = object.empNo;
                            that.form.crdPssrNm = object.empNm;
                            that.form.crdPssrDut = object.dutNm;
                            that.form.crdPssrDept = object.deptNm;
                        }
                    }
                });

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
        beforeMount(){
            this.makeColDef();
            this.defaultColDef = { resizable: true, filter:true, sortable: true };
            this.gridOptions.getRowStyle  = function(params){
                if(params.data.rn === '합계'){
                    return {background: '#f9f9f3'};
                }
            }
        },
        mounted() {
            this.form.compCd = this.$store.state.loginInfo.compCd;
            this.authority = this.$store.state.loginInfo.authorities[0].roleCd;
            this.getCompCdCombo();
            this.getCardCompCdCombo();
            this.getUseStatCdCombo();
            this.getCardFgCdCombo();
            this.goSearch();
            this.makeSumData();
        },
        created(){
          document.title = this.title + ' - IJEAS';
            this.roleSelectCd = this.$store.state.loginInfo.authorities[0].roleSelectCd;
            if(this.roleSelectCd !== '10'){
                this.form.crdPssrId = this.$store.state.loginInfo.loginId;
                this.form.crdPssrNm = this.$store.state.loginInfo.userName;
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

    .desc-content .item .desc-item:last-child {
        margin-bottom: 0;
        height: 50px;
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
        padding-left: 80px;
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
        width: 38%;
        padding-right: 20px;
    }

    .desc-content .item.desc-center {
        width: 35%;
        padding-right: 40px;
    }

    .desc-content .item.desc-right {
        width: 27%;
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
