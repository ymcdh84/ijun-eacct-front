<template>
    <div class="inner-box">
        <div class="content-name">
            <h2 class="dp-ib">{{title}}</h2>
            <div class="btn-wrap btn-type1 clearfix">
                <button class="btn-size btn-blue fl_left" @click="goSearch"><span class="btn-icon"><i
                        class="fas fa-pen-alt"></i></span> 조회
                </button>
            </div>
        </div>

        <!-- 검색조건 영역 -->
        <div class="desc-content search-border">
            <div class="item search_wrap">
                <div class="search_box">
                    <div class="search_title">
                        <span class="search_tit">- 기안일자</span>
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
                                    <span class="search_tit">- 기안일자</span>
                                </div>
                                <div class="search_con search-area">
                                    <div class="datepicker w-type-ymd02 w30p">
                                        <dhx-calendar class="input ddate sDate" v-model="form.searchDtmFr" />
                                    </div>
                                    <span class="datepicker w10p dp-ib tac"> ~ </span>
                                    <div class="datepicker w-type-ymd02 w30p">
                                        <dhx-calendar class="input ddate sDate" v-model="form.searchDtmTo" />
                                    </div>
                                    <button @click="dateSetting('toDay')" class="search_bt_white_s">당일</button>
                                    <button @click="dateSetting('crrntMnth')" class="search_bt_white_s">당월</button>
                                    <button @click="dateSetting('PrvsMnth')" class="search_bt_white_s">전월</button>
                                </div>
                            </div>

                            <div class="search_box_pop">
                                <div class="search_title">
                                    <span class="search_tit">- 문서유형</span>
                                </div>
                                <div class="search_con search-area">
                                    <b-select class="select is-fullwidth w100p" v-model="form.docTypeCd">
                                        <option value=''>==전체==</option>
                                        <option
                                                v-for="item in docTypes"
                                                :key="item.key"
                                                :value="item.key"
                                                v-text="item.value"/>
                                    </b-select>
                                </div>
                            </div>

                            <div class="search_box_pop">
                                <div class="search_title">
                                    <span class="search_tit">- 문서상태</span>
                                </div>
                                <div class="search_con search-area">
                                    <b-select class="select is-fullwidth w100p" v-model="form.docStatCd">
                                        <option value=''>==전체==</option>
                                        <option
                                                v-for="item in docStatuses"
                                                :key="item.key"
                                                :value="item.key"
                                                v-text="item.value"/>
                                    </b-select>
                                </div>
                            </div>

                            <div class="search_box_pop">
                                <div class="search_title">
                                    <span class="search_tit">- 기안자</span>
                                </div>
                                <div class="search_con search-area">
                                    <input class="input input-bg dp-ib w20p_5r" type="text" v-model="form.draftUserDut" disabled>
                                    <input class="input input-bg dp-ib w30p_5r" type="text" v-model="form.draftUserDept" disabled>
                                    <input class="input input-bg dp-ib w20p_5r" type="text" v-model="form.draftUserId" disabled>
                                    <input class="input input-bg dp-ib w30p" type="text" v-model="form.draftNm" @input="initEmp" @keypress.enter="popEmp" disabled>
                                    <button class="icon is-right" @click="popEmp(true)"><i class="fas fa-search"></i>
                                    </button>
                                </div>
                            </div>

                            <div class="search_box_pop">
                                <div class="search_title">
                                    <span class="search_tit">- 제목</span>
                                </div>
                                <div class="search_con search-area">
                                    <input class="input Rt-M tal w100p" type="text" v-model="form.docTitleNm">
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
                        <h3 class="ico_table_name">상신한 목록</h3>
                    </div>
                    <div class="btn-wrap btn-type1 clearfix">
                        <button class="btn-size btn-excel" @click="saveExcel">엑셀 저장</button>
                    </div>
                </div>

                <div class="grid-wrap">
                    <!-- <dhx-grid ref="grid" v-model="compList" :config="config" @constructGridSuccessful="constructGridSuccessful"/> -->
                    <ag-grid-vue ref="grid" style="width: 100%;" class="ag-theme-alpine grid_search_height" 
                            :columnDefs="columnDefs" 
                            :rowData="reqList" 
                            :gridOptions="gridOptions"
                            :defaultColDef="defaultColDef"
                            @rowDoubleClicked="rowDoubleClick"
                            />
                </div>
            </div>

        </div>
        <!-- //테이블 -->
    </div>
</template>

<script>
    import mixin from '@/mixin';
    import mixinSlip from '@/mixin/slip';
    import _ from 'lodash'

    import DhxCalendar from '@/components/DhxCalendar.vue'
    import DhxGrid from '@/components/DhxGrid.vue'
    import Emp from '@/components/Emp_Ag.vue'
    import SlipDetailModal from '@/components/SlipDetailModal.vue'
    import SlipPayDetailModal from '@/components/SlipPayDetailModal.vue'
    import SlipEtcDetailModal from '@/components/SlipEtcDetailModal.vue'
    import GlDetailModal from '@/components/GlDetailModal.vue'
    import PayrollSlipModal from '@/components/PayrollSlipModal.vue'
    import BulkSlipModal from '@/components/BulkSlipModal.vue'
    import ApprSubm from "@/views/ApprSubm";
    import { AgGridVue } from 'ag-grid-vue'
    
    export default {
        name: 'ApprReqLst',
        mixins: [mixin, mixinSlip],
        components: {Emp, DhxGrid, DhxCalendar, AgGridVue},
        data() {
            return {
                columnDefs : [],
                gridOptions : {},
                defaultColDef: {},
                title: '상신한 문서',
                docTypes: [],
                docStatuses: [],
                reqList: [],
                showEmpModal: false,
                form: {
                    docTypeCd: '',
                    docStatCd: '',
                    searchDtmFr: this.$moment().startOf('month').format('YYYY-MM-DD'),
                    searchDtmTo: this.$moment().format('YYYY-MM-DD'),
                    draftUserId: '',
                    draftUserDut: '',
                    draftUserDept: '',
                    docTitleNm: '',
                },
            };
        },
        methods: {
            rowDoubleClick(params){
                this.$cookie.set('searchForm', JSON.stringify(this.form));               
                this.$store.commit('searchForm', JSON.parse(this.$cookie.get('searchForm')));

                let slipTypeCd = params.data.slipTypeCd;
                let docMngNo = params.data.apprNo;
                let grSlipNo = params.data.docMngNo;

                switch(slipTypeCd)
                {
                    case 'E1' :
                    case 'E2' :
                    case 'E3' :
                    case 'E4' :
                    case 'E5' :
                        this.$router.push({
                            //path: `/apprDtlQry/${docMngNo}`,
                            name: 'apprDtlQry',
                            params:{
                                docMngNo: docMngNo,
                                grSlipNo: grSlipNo,
                                slipTypeCd: slipTypeCd
                            }
                        });
                        break;
                    // case 'E5' :
                    //     this.$modal.open({
                    //         component: BulkSlipModal,
                    //         props: {
                    //             grSlipNo: grSlipNo,
                    //             docMngNo: docMngNo,
                    //             loaded: false
                    //         },
                    //         parent: this,
                    //         width: 1200
                    //     })
                    //     break;
                  default:
                    if(params.data.docTypeCd === 'BDGT'){
                      var vm = this
                      this.$modal.open({
                        component: ApprSubm,
                        props: {
                          docType: params.data.docTypeCd,
                          budReqNo: params.data.docMngNo,
                          docMngNo : params.data.apprNo,
                          // value: this.data
                        },
                        parent: this,
                        width: 1200,
                        events: {
                          close(data) {
                            // if (callback !== undefined && typeof callback === 'function') {
                            //   callback.apply(this, [data])
                            // }
                            vm.goSearch();
                          }
                        }
                      })
                    }
                    else{
                      this.showDetailPop(grSlipNo, slipTypeCd, docMngNo,params);
                    }
                    break;
                }
            },
            showDetailPop(grSlipNo, slipTypeCd, docMngNo,params){
                
                let title = ''
                let setModal = undefined
                if(_.isEmpty(params.data.wrtId)){
                  params.data.wrtId = params.data.draftUserId
                }
                switch(slipTypeCd)
                {
                    case 'E11' :
                        title = '자금지급전표'
                        setModal = SlipPayDetailModal
                        break;
                    case 'E12' :
                        title = '구매전표'
                        setModal = SlipDetailModal
                        break;
                    case 'E13' :
                        title = '공사비전표'
                        setModal = SlipDetailModal
                        break;
                    case 'E14' :
                        title = '기타전표'
                        setModal = SlipEtcDetailModal
                        break;
                    default:
                        title = '작업중'
                        setModal = SlipDetailModal
                        break;
                }

                this.$modal.open({
                    component: setModal,
                    parent: this,
                    props: {
                        docMngNo: docMngNo,
                        grSlipNo: grSlipNo,
                        slipTypeCd: slipTypeCd,
                        title: title,
                        value:params.data
                    },
                    width: 1200,
                })
            },
            getDocTypeCombo() {
                this.$http.get(`/api/code/combo`, {params: {groupCd: "DOC_TYPE_CD"}})
                    .then(response => {
                        this.docTypes = response.data;
                    });
            },
            getStatusTypeCombo() {
                this.$http.get(`/api/code/combo`, {params: {groupCd: "DOC_STAT_CD"}})
                    .then(response => {
                        this.docStatuses = response.data;
                    });
            },
            saveExcel() {
              var params = {
                fileName : "상신한 문서"
              };
              this.gridOptions.api.exportDataAsCsv(params)
            },
            goSearch() {
                
                const param = JSON.parse(JSON.stringify(this.form));
                const stripFields = ['searchDtmFr', 'searchDtmTo'];
                _.forEach(stripFields, (name) => param[name] = this.toPure(param[name]));

                if (param.searchDtmFr > param.searchDtmTo) {
                    this.$swal({type: 'warning', text: '조회 시작일자와 종료일자 지정이 잘못되었습니다.'});
                    return false
                }

                this.$store.commit('loading');
                this.$http.post(`/api/appr/req/list`, {
                            docTypeCd: param.docTypeCd,
                            searchDtmFr: this.toPure(param.searchDtmFr),
                            searchDtmTo: this.toPure(param.searchDtmTo),
                            docStatCd: param.docStatCd,
                            draftUserId: param.draftUserId,
                            docTitleNm: param.docTitleNm
                    }
                )
                    .then(response => {
                        if (response.data) {
                            this.reqList = response.data;
                        }
                    }).finally(() => {
                        this.$store.commit('finish')
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
                        param: this.form.draftNm
                    },
                    width: 1800,
                    events: {
                        close(obj) {
                            that.form.draftUserId = obj.empNo;
                            that.form.draftNm = obj.empNm;
                            that.form.draftUserDut = obj.dutNm;
                            that.form.draftUserDept = obj.deptNm;
                        }
                    }
                });
            },
            initEmp(force) {
                if (force === true) this.form.draftNm = '';
                if (this.form.draftNm === '') {
                    this.form.draftUserId = '';
                    this.form.draftUserDut = '';
                    this.form.draftUserDept = '';
                }
            },
            makeColDef(){

                this.columnDefs = [
                    {
                        headerName: 'No.', 
                        width: 80,
                        valueFormatter: (params) => {               
                            return params.node.rowIndex+1;
                        }
                    },
                    {
                        headerName: '문서유형', 
                        field: 'docType', 
                        width: 120,
                        cellStyle:{textAlign: 'left'}
                    },
                    {
                        headerName: '문서상태', 
                        field: 'docStatNm', 
                        width: 120,
                        cellStyle:{textAlign: 'left'}
                    },
                    {
                        headerName: '제목', 
                        field: 'docTitleNm', 
                        width: 460,
                        cellStyle:{textAlign: 'left'}
                    },
                    {
                        headerName: '결재유형', 
                        field: 'apprType', 
                        width: 120,
                        cellStyle:{textAlign: 'left'},
                        hide:true
                    },
                    {
                        headerName: '결재구분', 
                        field: 'apprStatus', 
                        width: 120,
                        cellStyle:{textAlign: 'left'},
                        hide:true
                    },
                    {
                        headerName: '결재번호', 
                        field: 'apprNo', 
                        width: 180,
                        cellStyle:{textAlign: 'left'}
                    },
                    {
                        headerName: '문서번호', 
                        field: 'docMngNo', 
                        width: 180,
                        cellStyle:{textAlign: 'left'}
                    },
                    {
                        headerName: '기안자사번', 
                        field: 'draftUserId', 
                        width: 120,
                        cellStyle:{textAlign: 'left'}
                    },
                    {
                        headerName: '기안자', 
                        field: 'draftUserName', 
                        width: 100,
                        cellStyle:{textAlign: 'left'}
                    },
                    {
                        headerName: '직급', 
                        field: 'draftUserJob', 
                        width: 100,
                        cellStyle:{textAlign: 'left'}
                    },
                    {
                        headerName: '기안일자', 
                        field: 'draftDtm', 
                        width: 160,
                        cellStyle:{textAlign: 'left'}
                    },
                    {
                        headerName: '타입', 
                        field: 'slipTypeCd', 
                        width: 180,
                        hide:true
                    }
                ]
            },
            onGridReady(){
                this.gridOptions.api.sizeColumnsToFit();
            },
            dateSetting(str){
              switch (str) {
                case 'toDay':
                  this.form.searchDtmFr = this.$moment().format('YYYYMMDD')
                  this.form.searchDtmTo = this.$moment().format('YYYYMMDD')
                  break;
                case 'crrntMnth':
                  this.form.searchDtmFr = this.$moment().startOf('month').format('YYYYMMDD')
                  this.form.searchDtmTo = this.$moment().endOf('month').format('YYYYMMDD')
                  break;
                case 'PrvsMnth':
                  this.form.searchDtmFr = this.$moment().add(-1, 'month').startOf('month').format('YYYYMMDD')
                  this.form.searchDtmTo = this.$moment().add(-1, 'month').endOf('month').format('YYYYMMDD')
                  break;
              }
              // this.goSearch()
            }
        },
        beforeMount(){
            this.makeColDef();
            this.defaultColDef = { resizable: true, filter:true, sortable: true };
        },
        created(){
            if(!_.isEmpty(this.$route.query)){
                this.form.docStatCd = this.$route.query.docStatCd
            }
            
            if(!_.isEmpty(this.$route.params)){
                this.form = this.$route.params;
            }
        },
        mounted() {
          document.title = this.title + ' - IJEAS';
            this.form.draftUserId = this.$store.state.loginInfo.loginId;
            this.form.draftNm = this.$store.state.loginInfo.userName;
            this.form.draftUserDut = this.$store.state.loginInfo.loginDutNm;
            this.form.draftUserDept = this.$store.state.loginInfo.loginDeptNm;
            this.getDocTypeCombo()
            this.getStatusTypeCombo()
            this.goSearch()
        }
    };
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
        padding-left: 75px;
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

    .search-border .td-s-thumb.search-area .ip-box {
        vertical-align: top;
    }

    @media (max-width: 1580px) {
        .search-border .td-s-thumb.search-area .ip-box.ip-box-w02 {
            width: 50%;
        }
    }
</style>

