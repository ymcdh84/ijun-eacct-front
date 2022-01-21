<template>
    <div class="inner-box">
        <div class="content-name">
            <h2 class="dp-ib">{{title}}</h2>
            <div class="btn-wrap btn-type1 clearfix">
                <button class="btn-size btn-gray fl_left" @click="goSearch"><span class="btn-icon"><i
                        class="fas fa-search"></i></span> 조회
                </button>
            </div>
        </div>

        <!-- 검색조건 영역 -->
        <div class="desc-content search-border">
            <div class="item search_wrap">
                <div class="search_box">
                    <div class="search_title">
                        <span class="search_tit">- 공급일자</span>
                    </div>
                    <div class="search_con">
                        <div class="datepicker w-type-ymd02">
                            <dhx-calendar class="input ddate sDate" v-model="form.issueDateFrom" />
                        </div>
                        <span class="wave"> ~ </span>
                        <div class="datepicker w-type-ymd02">
                            <dhx-calendar class="input ddate sDate" v-model="form.issueDateTo" />
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
                                    <span class="search_tit">- 공급일자</span>
                                </div>
                                <div class="search_con search-area">
                                    <div class="datepicker w-type-ymd02 w30p">
                                        <dhx-calendar class="input ddate sDate" v-model="form.issueDateFrom" />
                                    </div>
                                    <span class="datepicker w10p dp-ib tac"> ~ </span>
                                    <div class="datepicker w-type-ymd02 w30p dp-ib">
                                        <dhx-calendar class="input ddate sDate" v-model="form.issueDateTo" />
                                    </div>
                                  <button @click="dateSetting('toDay')" class="search_bt_white_s">당일</button>
                                  <button @click="dateSetting('crrntMnth')" class="search_bt_white_s">당월</button>
                                  <button @click="dateSetting('PrvsMnth')" class="search_bt_white_s">전월</button>
                                </div>
                            </div>

                            <div class="search_box_pop">
                                <div class="search_title">
                                    <span class="search_tit">- 승인번호</span>
                                </div>
                                <div class="search_con search-area">
                                    <input class="input Rt-M tal" type="text" v-model="form.issueId">
                                </div>
                            </div>

                            <div class="search_box_pop">
                                <div class="search_title">
                                    <span class="search_tit">- 공급자</span>
                                </div>
                                <div class="search_con search-area">
                                    <input class="input Rt-M tal" type="text" v-model="form.suName">
                                </div>
                            </div>

                            <div class="search_box_pop">
                                <div class="search_title">
                                    <span class="search_tit">- 담당자/E-MAIL</span>
                                </div>
                                <div class="search_con search-area">
                                    <input class="input Rt-M tal" type="text" v-model="form.schTxt">
                                </div>
                            </div>

                            <div class="search_box_pop">
                                <div class="search_title">
                                    <span class="search_tit">- 처리상태</span>
                                </div>
                                <div class="search_con search-area">
                                    <b-select class="select is-fullwidth" v-model="form.dealStatCd">
                                        <option value=''>==전체==</option>
                                        <option
                                                v-for="item in dealStats"
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
                        <h3 class="ico_table_name">수신내역</h3>
                    </div>
                    <div class="btn-wrap btn-type1 clearfix">
                        <button class="btn-size btn-excel" @click="saveExcel">엑셀 저장</button>
                    </div>
                </div>
                <div class="grid-wrap">
                    <ag-grid-vue ref="grid" style="width: 100%;" class="ag-theme-alpine grid_search_height" 
                            :columnDefs="columnDefs" 
                            :rowData="rcvList" 
                            :gridOptions="gridOptions"
                            :defaultColDef="defaultColDef"
                            @rowDoubleClicked="rowDoubleClick"/>
                </div>
            </div>
        </div>
        <!-- //테이블 -->

        <!--팝업-->
        <!-- <b-modal :active.sync="showCctrModal" has-modal-card @receive="receiveCctr">
            <cctr :param="form.wrtDeptNm"></cctr>
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
    // import Cctr from '@/components/Cctr.vue';
    import Cctr from '@/components/Cctr_Ag.vue';
    import Emp from '@/components/Emp.vue';

    import SlipDetailModal from '@/components/SlipDetailModal.vue'
    import SlipPayDetailModal from '@/components/SlipPayDetailModal.vue'
    import SlipEtcDetailModal from '@/components/SlipEtcDetailModal.vue'
    import ErpItfErrModal from '@/components/ErpItfErrModal.vue'
    import GlDetailModal from '@/components/GlDetailModal.vue'
    import PayrollSlipModal from '@/components/PayrollSlipModal.vue'
    import BulkSlipModal from '@/components/BulkSlipModal.vue'

    import { AgGridVue } from 'ag-grid-vue'

    export default {
        name: 'SlipList',
        mixins: [mixin, mixinSlip],
        components: {Cctr, Emp, DhxCalendar, DhxGrid, AgGridVue},
        props: {
            params: {
                type: Object,
                required: false
            },
        },        
        data() {
            return {
                columnDefs : [],
                gridOptions : {},
                defaultColDef: {},
                title: '전자세금계산서',
                dealStats: [],
                rcvList: [],
                form: {
                    issueDateFrom: this.$moment().startOf('month').format('YYYY-MM-DD'),
                    issueDateTo: this.$moment().endOf('month').format('YYYY-MM-DD'),
                    ipDeptcode1: '',
                    ipDeptname1: '',
                    suName: '',
                    issueId: '',
                    dealStatCd: '',
                    schTerm:'user',
                    schTxt:''
                },
                showCctrModal: false,
                showEmpModal: false,
            };
        },
        methods: {
            makeColDef(){
                const that = this;
                this.columnDefs = [
                    {
                        headerName: '', 
                        children:[
                             {
                                headerName: 'No.', 
                                width: 80,
                                valueFormatter: (params) => {               
                                    return params.node.rowIndex+1;
                                }
                            },
                        ]
                    },
                    {
                        headerName: '전자세금계산서', 
                        children:[
                            {
                                headerName: '전자세금계산서 승인번호', 
                                field: 'issueId', 
                                width: 240,
                                cellStyle:{textAlign: 'left'}
                            },
                            {
                                headerName: '처리상태', 
                                field: 'dealStatNm', 
                                width: 140,
                                cellStyle:{textAlign: 'left'}
                            },
                            {
                                headerName: '공급일자', 
                                field: 'issueDate', 
                                width: 140,
                                cellStyle:{textAlign: 'left'},
                                valueFormatter: (params) => {               
                                    return that.$moment(params.value).format('YYYY-MM-DD');
                                }
                            },
                            {
                                headerName: '전표번호', 
                                field: 'grSlipNo', 
                                width: 160,
                                cellStyle:{textAlign: 'left'}
                            },
                            {
                                headerName: '전표상태', 
                                field: 'statusNm', 
                                width: 140,
                                cellStyle:{textAlign: 'left'}
                            },
                        ]
                    },
                    {
                        headerName: '공급자', 
                        children:[
                            {
                                headerName: '회사', 
                                field: 'suName', 
                                width: 200,
                                cellStyle:{textAlign: 'left'}
                            },
                            {
                                headerName: '사업자등록번호', 
                                field: 'suId', 
                                width: 200,
                                cellStyle:{textAlign: 'left'}
                            },
                            {
                                headerName: '업종', 
                                field: 'suIndtype', 
                                width: 260,
                                cellStyle:{textAlign: 'left'}
                            },
                        ]
                    },
                    {
                        headerName: '금액', 
                        children:[
                            {
                                headerName: '공급가액', 
                                field: 'chargetotal', 
                                width: 180,
                                cellStyle:{textAlign: 'left'},
                                valueFormatter: (params) => { 
                                    return that.getNumberFormat(params.value);
                                }
                            },
                            {
                                headerName: '부가세액', 
                                field: 'taxtotal', 
                                width: 180,
                                cellStyle:{textAlign: 'left'},
                                valueFormatter: (params) => { 
                                    return that.getNumberFormat(params.value);
                                }
                            },
                            {
                                headerName: '합계금액', 
                                field: 'grandtotal', 
                                width: 180,
                                cellStyle:{textAlign: 'left'},
                                valueFormatter: (params) => { 
                                    return that.getNumberFormat(params.value);
                                }
                            },
                        ]
                    },
                    {
                        headerName: '세금계산서', 
                        children:[
                            {
                                headerName: '세금계산서 종류', 
                                field: 'dtiTypeNm', 
                                width: 220,
                                cellStyle:{textAlign: 'left'}
                            },
                            {
                                headerName: '수정사유', 
                                field: 'amendName', 
                                width: 200,
                                cellStyle:{textAlign: 'left'}
                            },
                        ]
                    },
                    {
                        headerName: '수탁사업자', 
                        children:[
                            {
                                headerName: '회사', 
                                field: 'bpName', 
                                width: 200,
                                cellStyle:{textAlign: 'left'}
                            },
                            {
                                headerName: '사업자등록번호', 
                                field: 'bpId', 
                                width: 220,
                                cellStyle:{textAlign: 'left'}
                            },
                        ]
                    },
                    {
                        headerName: '공급받는 자', 
                        children:[
                            {
                                headerName: '회사', 
                                field: 'ipName', 
                                width: 240,
                                cellStyle:{textAlign: 'left'}
                            },
                            {
                                headerName: '종사업장', 
                                field: 'ipMin', 
                                width: 200,
                                cellStyle:{textAlign: 'left'}
                            },
                            {
                                headerName: 'E-Mail', 
                                field: 'ipEmail1', 
                                width: 240,
                                cellStyle:{textAlign: 'left'}
                            },
                            {
                                headerName: '담당자', 
                                field: 'ipPersname1', 
                                width: 180,
                                cellStyle:{textAlign: 'left'}
                            },
                            {
                                headerName: '부서', 
                                field: 'ipDeptname1', 
                                width: 180,
                                cellStyle:{textAlign: 'left'}
                            }
                        ]
                    },
                ]
            },
            rowDoubleClick(params){

                let compCd = params.data.compCd;
                let bpCd = params.data.bpCd;
                let issueDate = params.data.issueDate;
                let invSeq = params.data.invSeq;
                let grSlipNo = params.data.grSlipNo;
                let status = params.data.status;
                let dtiType = params.data.dtiType;
                let slipTypeCd = params.data.slipTypeCd;

                this.goPage({grSlipNo, status, slipTypeCd, xml: {compCd, bpCd, issueDate, invSeq, dtiType}})
            },
            getDealStatCombo() {
                this.$http.get(`/api/code/combo`, {params: {groupCd: "DEAL_STAT_CD"}})
                    .then(response => {
                        this.dealStats = response.data;
                    });
            },
            saveExcel() {
                var params = {
                    fileName : "전자세금계산서 수신내역"
                };
                this.gridOptions.api.exportDataAsCsv(params)
            },
            goPage(params) {
                //백버튼 생성하기 위해서 쿠키에 임의로 지정 후 스토어에 저장
                this.$cookie.set('searchForm', JSON.stringify(this.form));
                this.$store.commit('searchForm', JSON.parse(this.$cookie.get('searchForm')));

                switch (params.slipTypeCd) {
                    case 'E5':
                        this.$modal.open({
                            component: BulkSlipModal,
                            props: {
                                grSlipNo: params.grSlipNo
                            },
                            parent: this,
                            width: 1200
                        })
                        break
                    case 'E11':
                        this.$modal.open({
                            component: SlipPayDetailModal,
                            parent: this,
                            props: {
                                grSlipNo: params.grSlipNo,
                                slipTypeCd: params.slipTypeCd,
                                title: '자금지급전표'
                            },
                            width: 1200,
                        })
                        break
                    case 'E12':
                        this.$modal.open({
                            component: SlipDetailModal,
                            parent: this,
                            props: {
                                grSlipNo: params.grSlipNo,
                                slipTypeCd: params.slipTypeCd,
                                title: '구매전표'
                            },
                            width: 1200,
                        })
                        break
                    case 'E13':
                        this.$modal.open({
                            component: SlipDetailModal,
                            parent: this,
                            props: {
                                grSlipNo: params.grSlipNo,
                                slipTypeCd: params.slipTypeCd,
                                title: '공사비전표'
                            },
                            width: 1200,
                        })
                        break
                    case 'E14':
                        this.$modal.open({
                            component: SlipEtcDetailModal,
                            parent: this,
                            props: {
                                grSlipNo: params.grSlipNo,
                                slipTypeCd: params.slipTypeCd,
                                title: '기타전표'
                            },
                            width: 1200,
                        })
                        break
                    default:
                        //20.04.21 전자세금계산서 status가 널인데도 'ebillSlipReg'로 라우팅 된다.
                        /* 
                        if(params.status===''){
                            params.status ='10'
                        }
                        */
                        let targetName = (params.status === '10' || !params.status) ? 'ebillSlipReg' : 'billSlipMng';
                        this.$router.push({ name: targetName, params: params });
                        break
                }
            },
            goSearch() {
                const param = JSON.parse(JSON.stringify(this.form));
                const stripFields = ['issueDateFrom', 'issueDateTo'];
                _.forEach(stripFields, (name) => param[name] = this.toPure(param[name]));

                if (!this.validation(param)) return;

                this.$store.commit('loading');
                this.$http.post(`/api/ebill/rcv-list`, param)
                    .then(response => {
                        if (response.data) {
                            this.rcvList = response.data;
                        }
                    }).catch(response => {
                        this.$swal({type: 'warning', text: response});
                    })
                    .finally(() => {
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
            validation(param) {
                if (!param.issueDateFrom || !param.issueDateTo) {
                    this.$swal({type: 'warning', text: '공급일자를 입력해 주세요.'});
                    return false;
                }
                return true;
            },
            popCctr(clear) {
               const that = this
      
                this.$modal.open({
                    component: Cctr,
                    parent: this,
                    props: {
                        param: this.form.ipDeptname1
                    },
                    width: 1800,
                    events: {
                        close(object) {
                            that.receiveCctr(object)
                        }
                    }
                });
            },
            receiveCctr(obj) {
                this.form.ipDeptcode1 = obj.cctrCd;
                this.form.ipDeptname1 = obj.cctrNm;
            },
            initCctr(force) {
                if (force === true) this.form.ipDeptname1 = '';
              if (this.form.ipDeptname1 === '') this.form.ipDeptcode1 = '';
            },
            dateSetting(str) {
              switch (str) {
                case 'toDay':
                  this.form.issueDateFrom = this.$moment().format('YYYYMMDD')
                  this.form.issueDateTo = this.$moment().format('YYYYMMDD')
                  break;
                case 'crrntMnth':
                  this.form.issueDateFrom = this.$moment().startOf('month').format('YYYYMMDD')
                  this.form.issueDateTo = this.$moment().endOf('month').format('YYYYMMDD')
                  break;
                case 'PrvsMnth':
                  this.form.issueDateFrom = this.$moment().add(-1, 'month').startOf('month').format('YYYYMMDD')
                  this.form.issueDateTo = this.$moment().add(-1, 'month').endOf('month').format('YYYYMMDD')
                  break;
              }
              // this.goSearch()
            }
        },
        beforeMount(){
            this.makeColDef()
            this.defaultColDef = { resizable: true, filter:true, sortable: true };
        },
        mounted() {
          document.title = this.title + ' - IJEAS';
            if(this.$route.query.dealStatCd) {this.form.dealStatCd = this.$route.query.dealStatCd}
            //this.form.ipDeptcode1 = this.$store.state.loginInfo.loginDeptCd;
            //this.form.ipDeptname1 = this.$store.state.loginInfo.loginDeptNm;
            this.getDealStatCombo();
            this.goSearch();
        },
        watch: {
            'params': {
                immediate: true,
                deep: true,
                handler(value) {
                    if(value && value.issueDateFrom) {
                        this.form = value
                    }
                }
            }
        }        
    };
</script>

<style scoped>
    .gridbox {
        height: 470px !important;
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
        width: 41%;
        padding-right: 40px;
    }

    .desc-content .item.desc-center {
        width: 35%;
        padding-right: 40px;
    }

    .desc-content .item.desc-right {
        width: 24%;
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
