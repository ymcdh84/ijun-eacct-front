<template>
    <div class="inner-box">
        <div class="content-name">
            <h2 class="dp-ib">{{title}}</h2>
            <div class="btn-wrap btn-type1 clearfix">
                <button class="btn-size btn-blue fl_left" @click="goSearch"><span class="btn-icon"><i
                        class="fas fa-pen-alt"></i></span> 조회
                </button>
                <button class="btn-size btn-gray fl_left" @click="getPurSlipLst"><span class="btn-icon"><i
                        class="far fa-file"></i></span> 가져오기
                </button>
            </div>
        </div>

        <!-- 검색조건 영역 -->
        <div class="desc-content search-border">
            <div class="item desc-left">
                <div class="desc-item">
                    <div class="tit">
                        <span class="label-tit">- GL일자</span>
                    </div>
                    <div class="desc">
                        <div class="datepicker w-type-ymd02">
                            <dhx-calendar class="input ddate sDate" v-model="form.searchFr" />
                        </div>
                        <span class="wave"> ~ </span>
                        <div class="datepicker w-type-ymd02">
                            <dhx-calendar class="input ddate sDate" v-model="form.searchTo" />
                        </div>
                    </div>
                </div>
                <div class="desc-item">
                    <div class="tit">
                        <span class="label-tit">- 원천</span>
                    </div>
                    <div class="desc">
                        <b-select class="select is-fullwidth" v-model="form.sourceNm">
                            <option value=''>==전체==</option>
                            <option
                                    v-for="item in sourceList"
                                    :key="item.jeSourceNm"
                                    :value="item.jeSourceNm"
                                    v-text="item.sourceNm"/>
                        </b-select>
                    </div>
                </div>
                <div class="desc-item">
                    <div class="tit">
                        <span class="label-tit">- 작성자</span>
                    </div>
                    <div class="desc">
                        <div class="td-s-thumb search-area" style="width: 450px">
                            <input class="input input-bg" type="text" style="width:65px;" v-model="form.writerId" disabled>
                            <div v-if="authority==='ADMIN'" class="ip-box ip-box-w02" style="width:120px;">
                                <input class="input" type="text" v-model="form.wrtNm" @input="initEmp" @keypress.enter="popEmp">
                                <button class="icon is-right" @click="popEmp(true)"><i class="fas fa-search"></i>
                                </button>
                            </div>
                            <div v-else class="ip-box ip-box-w02" style="width:120px;">
                                <input class="input" type="text" v-model="form.wrtNm" @input="initEmp" @keypress.enter="popEmp">
                                <button class="icon is-right" @click="popEmp(true)"><i class="fas fa-search"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="item desc-center">
                <div class="desc-item">
                    <div class="tit">
                        <span class="label-tit">- 배치명</span>
                    </div>
                    <div class="desc">
                        <div class="search-area">
                            <div class="ip-box ip-box-w02">
                                <input class="input" type="text" style="width:100%" v-model="form.batchNm">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="desc-item">
                    <div class="tit">
                        <span class="label-tit">- 증빙 첨부</span>
                    </div>
                    <div class="desc">
                        <b-select class="select is-fullwidth" v-model="form.evdYnCd">
                            <option value=''>==전체==</option>
                            <option
                                    v-for="item in evdYnList"
                                    :key="item.key"
                                    :value="item.key"
                                    v-text="item.value"/>
                        </b-select>
                    </div>
                </div>

            </div>
            <div class="item desc-right">
                <div class="desc-item">
                    <div class="tit">
                        <span class="label-tit">- 분개명</span>
                    </div>
                    <div class="desc">
                        <div class="search-area" style="margin-left: 10px">
                            <div class="ip-box ip-box-w02">
                                <input class="input" type="text" style="width:200px" v-model="form.journalNm">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="desc-item">
                    <div class="tit">
                        <span class="label-tit">- 기안서 연동</span>
                    </div>
                    <div class="desc" style="margin-left: 10px;">
                        <b-select class="select is-fullwidth" v-model="form.drpYnCd">
                            <option value=''>==전체==</option>
                            <option
                                    v-for="item in drpYnList"
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
                        <h3 class="ico_table_name">전표내역</h3>
                    </div>
                    <div class="btn-wrap btn-type1 clearfix">
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

                <div class="grid-wrap">
                    <ag-grid-vue ref="grid" style="width: 100%; height: 600px;" class="ag-theme-alpine" 
                            :columnDefs="columnDefs" 
                            :rowData="slipList" 
                            :gridOptions="gridOptions"
                            :defaultColDef="defaultColDef"
                            :frameworkComponents="frameworkComponent"
                            @rowDoubleClicked="rowDoubleClick"
                            @cell-value-changed="cellValueChange"/>
                </div>
            </div>

        </div>
        <!-- //테이블 -->

        <!--팝업-->
        <b-modal :active.sync="showCctrModal" has-modal-card @receive="receiveCctr">
            <cctr :param="form.wrtDeptNm"></cctr>
        </b-modal>
        <!-- <b-modal :active.sync="showEmpModal" has-modal-card @receive="receiveEmp">
            <emp :param="form.wrtNm"></emp>
        </b-modal> -->
        <b-modal :active.sync="showVendorModal" has-modal-card @receive="receiveVendor">
            <vendor :param="form.evdCustNm" :slipTypeCd="form.slipTypeCd"></vendor>
        </b-modal>
        <!--//팝업 -->
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
    import Vendor from '@/components/Vendor.vue'
    import Cctr from '@/components/Cctr.vue'
    // import Emp from '@/components/Emp.vue'
    import Emp from '@/components/Emp_Ag.vue'
    import GlDetailModal from '@/components/GlDetailModal.vue'
    import EvidAtchPop from '@/components/EvidAtchPop.vue'
    import WingsAtchPop from '@/components/WingsAtchPop.vue'

    import { AgGridVue } from 'ag-grid-vue'
    import AgGridCheckbox from "@/components/agGrid/AgGridCheckbox.vue"
    import AgGridScanAttach from "@/components/agGrid/AgGridScanAttach.vue"

    export default {
        name: 'gLSlipLst',
        mixins: [mixin, mixinSlip, slip],
        components: {Cctr, Emp, Vendor, DhxGrid, DhxCalendar, AgGridVue},
        data() {
            return {
                columnDefs : [],
                gridOptions : {},
                frameworkComponent : {
                    'checkBox' : AgGridCheckbox,
                    'scanAttach' : AgGridScanAttach
                },
                
                title: 'GL전표',
                slipTypes: [],
                sourceList:[],
                slipStats: [],
                slipList: [],
                evdYnList: [{'key': 'N', 'value' : '미첨부'}, {'key': 'Y', 'value' : '첨부'}],
                drpYnList: [{'key': 'N', 'value' : '미연동'}, {'key': 'Y', 'value' : '연동'}],
                tempData: [],
                authority: '',
                chkYn:false,
                form: {
                    //searchFr: this.$moment().add(-1, 'month').startOf('month').format('YYYY-MM-DD'),
                    //searchTo: this.$moment().format('YYYY-MM-DD'),
                    searchFr:this.$moment().startOf('month').format('YYYY-MM-DD'),
                    searchTo: this.$moment().endOf('month').format('YYYY-MM-DD'),
                    evdYnCd: 'Y',
                    drpYnCd: 'Y',
                    batchNm:'',
                    journalNm :'',
                    slipTypeCd: 'E14',
                    sourceNm:'',//원천
                    evdYnCd:'',//증빙첨부
                    drpYnCd:'',//기안서연동
                    writerId:'',//작성자
                    evdCustCd: '',
                    evdCustNm: '',
                    evdCustBizNo: '',
                    wrtNm: '',
                    slipStatCd: '',
                    payCustNm: '',
                },
                showCctrModal: false,
                showEmpModal: false,
                showVendorModal: false,
                result : [],
                cnt : 19, //grSlipNo 그리드 위치
                delChkList: [],
                rowIdx: '',
                config: {
                    columns: [
                        {id: 'chk', type: 'ch', align: 'center', width: 30, value: '#'},
                        {id: 'no', type: 'cntr', align: 'center', sort: 'na', value: 'No.', width: 35},
                        {id: 'sourceNm', type: 'ro', align: 'left', sort: 'na', value: '원천', width: 120},
                        {id: 'categoryNm', type: 'ro', align: 'left', sort: 'na', value: '출처', width: 100},
                        {id: 'postDt', type: 'ro', align: 'center', sort: 'na', value: 'GL일자', width: 110},
                        {id: 'journalNm', type: 'ro', align: 'left', sort: 'na', value: '분개명', width: 190},
                        {id: 'curCd', type: 'ro', align: 'center', sort: 'na', value: '통화코드', width: 80},
                        {id: 'drAmtFor', type: 'ron', align: 'right', sort: 'na', value: '입력금액(외화)', width: 140},
                        {id: 'crAmtFor', type: 'ron', align: 'right', sort: 'na', value: '#cspan', width: 140},
                        {id: 'drAmtKrw', type: 'ron', align: 'right', sort: 'na', value: '환산금액(원화)', width: 140},
                        {id: 'crAmtKrw', type: 'ron', align: 'right', sort: 'na', value: '#cspan', width: 140},
                        {id: 'ufileCnt', value: '증빙첨부', width: 80
                        , component: {
                                props: ['index', 'value', 'field'],
                                template: `<span style="color: #0065b3;" @click="openEvidencePopup()">{{ this.$numeral(value.ufileCnt).format('0') }} <i class="far fa-file-alt"></i></span>`,
                                created(){
                                    //this.scanFileCount();
                                },
                                methods: {
                                    scanFileCount() {
                                        const val = this.$parent.value[this.index]
                                        this.$http.get(`/api/evid/fileList/${this.value.eaSlipNo}`)
                                        .then(response => {
                                            val.scanCt = ((response.data || {}).aFiles || []).length
                                        })
                                    },
                                    openEvidencePopup(){
                                        let vm = this
                                        const val = this.$parent.value[this.index]
                                        this.$modal.open({
                                            component: EvidAtchPop,
                                            props: {
                                                docMngNo: vm.value.eaSlipNo,
                                                readonly: vm.value.readonly // Check readonly this.form.slipStatCd !== '10'
                                            },
                                            parent: this,
                                            width: 1200,
                                            events: {
                                                close(value) {
                                                    val.ufileCnt = value.length
                                                    //스캔증빙 카운팅 벨류 강제 업데이트
                                                    vm.$forceUpdate();
                                                }
                                            }
                                        })
                                    }
                                },
                                watch: {
                                    value: {
                                        immediate: true,
                                        deep: true,
                                        handler() {
                                           // this.scanFileCount();
                                        }
                                    }
                                },
                            }
                        },
                        {id: 'uwingsFileCnt', value: '기안서연동', width: 80
                        , component: {
                            props: ['index', 'value', 'field'],
                            template: `<span style="color: #0065b3;" @click="openDrfPlanPopup()">{{ this.$numeral(value.uwingsFileCnt).format('0') }} <i class="far fa-file-alt"></i></span>`,
                            created(){

                            },
                            methods: {
                                openDrfPlanPopup() {
                                    let vm = this
                                    const val = this.$parent.value[this.index]
                                    this.$modal.open({
                                        component: WingsAtchPop,
                                        props: {
                                            grSlipNo: val.grSlipNo,
                                            slipDetail: this.tempData,
                                            readonly: this.isReadonly // Check readonly
                                        },
                                        parent: this,
                                        width: 1200,
                                        events: {
                                            close(value) {
                                                //vm.wingsFileSize = value.length
                                                val.uwingsFileCnt = value.length;
                                                vm.tempData = value;
                                                //value 세팅해야함.
                                                vm.$forceUpdate();
                                            }
                                        }
                                    })
                                }
                            },
                            watch: {
                                value: {
                                    immediate: true,
                                    deep: true,
                                    handler() {

                                    }
                                }
                            }
                          }
                        },
                        {id: 'batchNm', type: 'ed', align: 'left', sort: 'na', value: '배치명', width: 200},
                        {id: 'desc', type: 'ro', align: 'left', sort: 'na', value: '적요', width: 160},
                        {id: 'excRt', type: 'ron', align: 'right', sort: 'na', value: '환율', width: 100},
                        {id: 'excDt', type: 'ed', align: 'center', sort: 'na', value: '환율일자', width: 120},
                        {id: 'wrtId', type: 'ro', align: 'center', sort: 'na', value: '작성자ID', width: 80},
                        {id: 'wrtNm', type: 'ro', align: 'center', sort: 'na', value: '작성자', width: 120},
                        {id: 'grSlipNo', type: 'ro', align: 'center', sort: 'na', value: '', width: 80},
                        {id: 'eaSlipNo', type: 'ro', align: 'center', sort: 'na', value: '', width: 80},
                    ],
                    height: '625',
                    enablePaging: true,
                    pagingSize: 14,
                    queryPage: (page) => {
                        page = page || 0
                        return new Promise((resolve, reject) => {
                            let data = {
                                contents: this.slipList,
                                page: page,
                                totalPages: parseInt(this.slipList.length / this.config.pagingSize) + (parseInt(this.slipList.length % this.config.pagingSize) > 0 ? 1 : 0),
                                totalElements: 0
                            }
                            resolve({
                                data: data
                            })
                        })
                    },
                },
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
                        headerName: 'GL전표', 
                        children:[
                            {
                                headerName: 'No.', 
                                width: 80,
                                valueFormatter: (params) => {               
                                    return params.node.rowIndex+1;
                                }
                            },
                            {
                                headerName: '원천', 
                                field: 'sourceNm', 
                                width: 140,
                                cellStyle:{textAlign: 'left'}
                            },
                            {
                                headerName: '출처', 
                                field: 'categoryNm', 
                                width: 140,
                                cellStyle:{textAlign: 'left'}
                            },
                            {
                                headerName: 'GL일자', 
                                field: 'postDt', 
                                width: 160,
                                cellStyle:{textAlign: 'left'},
                                valueFormatter: (params) => {               
                                    return that.$moment(params.value).format('YYYY-MM-DD');
                                }
                            },
                            {
                                headerName: '분개명', 
                                field: 'journalNm', 
                                width: 200,
                                cellStyle:{textAlign: 'left'}
                            },
                            {
                                headerName: '통화코드', 
                                field: 'curCd', 
                                width: 180,
                                cellStyle:{textAlign: 'right'},
                                valueFormatter: (params) => { 
                                    return that.getNumberFormat(params.value);
                                }
                            }
                        ]
                    },
                    {
                        headerName: '입력금액(외화)', 
                        children:[
                            {
                                headerName: '차변', 
                                field: 'drAmtFor', 
                                width: 180,
                                cellStyle:{textAlign: 'right'},
                                valueFormatter: (params) => { 
                                    return that.getNumberFormat(params.value);
                                }
                            },
                            {
                                headerName: '대변', 
                                field: 'crAmtFor', 
                                width: 180,
                                cellStyle:{textAlign: 'right'},
                                valueFormatter: (params) => { 
                                    return that.getNumberFormat(params.value);
                                }
                            },
                        ]
                    },
                    {
                        headerName: '환산금액(원화)', 
                        children:[
                            {
                                headerName: '차변', 
                                field: 'drAmtKrw', 
                                width: 180,
                                cellStyle:{textAlign: 'right'},
                                valueFormatter: (params) => { 
                                    return that.getNumberFormat(params.value);
                                }
                            },
                            {
                                headerName: '대변', 
                                field: 'crAmtKrw', 
                                width: 180,
                                cellStyle:{textAlign: 'right'},
                                valueFormatter: (params) => { 
                                    return that.getNumberFormat(params.value);
                                }
                            },
                        ]
                    },
                    {
                        headerName: '증빙', 
                        children:[
                            {
                                headerName: '첨부', 
                                field: 'ufileCnt', 
                                width: 80,
                                cellStyle:{textAlign: 'center'},
                                cellRenderer: 'scanAttach',
                                cellRendererParams:{
                                    funcNm : 'openEvidencePopup'
                                }
                            }
                        ]
                    },
                    {
                        headerName: '기안서', 
                        children:[
                            {
                                headerName: '연동', 
                                field: 'uwingsFileCnt', 
                                width: 80,
                                cellStyle:{textAlign: 'center'},
                                cellRenderer: 'scanAttach',
                                cellRendererParams:{
                                    funcNm : 'openDrfPlanPopup'
                                }
                            }
                        ]
                    },
                    {
                        headerName: '전표 정보', 
                        children:[
                            {
                                headerName: '배치명', 
                                field: 'batchNm', 
                                width: 180,
                                cellStyle:{textAlign: 'left'}
                            },
                            {
                                headerName: '적요', 
                                field: 'desc', 
                                width: 220,
                                cellStyle:{textAlign: 'left'}
                            },
                            {
                                headerName: '환율', 
                                field: 'excRt', 
                                width: 160,
                                cellStyle:{textAlign: 'right'},
                                valueFormatter: (params) => { 
                                    return that.getNumberFormat(params.value);
                                }
                            },
                            {
                                headerName: '환율일자', 
                                field: 'excDt', 
                                width: 140,
                                cellStyle:{textAlign: 'left'}
                            },
                            {
                                headerName: '작성자', 
                                field: 'wrtNm', 
                                width: 140,
                                cellStyle:{textAlign: 'left'}
                            },
                        ]
                    },
                    {
                        headerName: '작성자ID', 
                        field: 'wrtId', 
                        width: 140,
                        cellStyle:{textAlign: 'left'},
                        hide:true
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
                    component: GlDetailModal,
                    parent: this,
                    props: {
                        grSlipNo: grSlipNo,
                        eaSlipNo: eaSlipNo,
                        slipTypeCd: that.form.slipTypeCd,
                        title: "GL전표"
                    },
                    width: 1200,
                    events: {
                        close(obj){
                            console.log(obj)
                        }
                    }
                })
            },
            cellValueChange(params){
                if(params.data.chk){
                    this.delChkList.push(params.data)
                }
            },
            allChk(){
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
            getSourceCombo() {
                this.$http.get(`/api/erp/gl/source`)
                    .then(response => {
                        this.sourceList = response.data;
                    });
            },
            saveExcel() {
                this.downloadExcel(this.$refs.grid);
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
                this.$http.post(`api/erp/gl/slip/list`, param)
                    .then(response => {
                        if (response.data) {
                            this.slipList = response.data;
                            this.delChkList = [];
                            this.chkYn = false;
                        }
                    }).catch(response => {
                    // TODO::Error Handling
                    return response
                }).finally(() => {
                    this.$store.commit('finish');
                });
            },
            getPurSlipLst() {
                this.$store.commit('loading');
                this.$http.get(`/api/erp/slip/${this.form.slipTypeCd}`)
                    .then(response => {
                        if(response.data == 'success'){
                            this.goSearch()
                        }
                    }).catch(response => {
                    return response
                }).finally(() => {
                    this.$store.commit('finish');
                })
            },
            validation(param) {
                if (!param.searchFr || !param.searchTo) {
                    this.$swal({type: 'warning', text: 'GL일자를 입력해 주세요.'});
                    return false;
                }
                return true;
            },
            popCctr(clear) {
                if (clear === true) {
                    this.form.wrtDeptCd = '';
                    this.form.wrtDeptNm = '';
                }
                this.showCctrModal = true;
            },
            popEmp(clear) {
                const that = this;

                this.$modal.open({
                    component: Emp,
                    parent: this,
                    props: {
                        param: this.form.wrtNm
                    },
                    width: 700,
                    events: {
                        close(obj){
                            that.receiveEmp(obj)
                        }
                    }
                });
            },
            popVendor(clear) {
                if (clear === true) {
                    this.form.evdCustCd = '';
                    this.form.evdCustNm = '';
                    this.form.evdCustBizNo = '';
                }
                this.showVendorModal = true;
            },
            receiveCctr(obj) {
                this.form.wrtDeptCd = obj.cctrCd;
                this.form.wrtDeptNm = obj.cctrNm;
            },
            receiveEmp(obj) {
                this.form.writerId = obj.empNo;
                this.form.wrtNm = obj.empNm;
                this.form.wrtUserDut = obj.dutNm;
                this.form.wrtUserDept = obj.deptNm;
            },
            receiveVendor(obj) {
                this.form.evdCustCd = obj.vendCd;
                this.form.evdCustNm = obj.vendNm;
                this.form.evdCustBizNo = obj.bizNo;
            },
            initCctr(force) {
                if (force === true) this.form.wrtDeptNm = '';
                if (this.form.wrtDeptNm === '') this.form.wrtDeptCd = '';
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
                if (force === true) this.form.evdCustNm = '';
                if (this.form.evdCustNm === '') {
                    this.form.evdCustCd = '';
                    this.form.evdCustBizNo = '';
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
            openEvidencePopup(){
                const that = this;
                const rowNode = this.gridOptions.api.getRowNode(this.rowIdx);

                this.$modal.open({
                    component: EvidAtchPop,
                    props: {
                        docMngNo: this.slipList[this.rowIdx].eaSlipNo,
                        readonly: false
                    },
                    parent: this,
                    width: 1200,
                    events: {
                        close(value) {
                            rowNode.setDataValue('ufileCnt', value.length);
                        }
                    }
                })
            },
            openDrfPlanPopup() {
                const that = this;
                const rowNode = this.gridOptions.api.getRowNode(this.rowIdx);
                
                this.$modal.open({
                    component: WingsAtchPop,
                    props: {
                        grSlipNo: this.slipList[this.rowIdx].grSlipNo,
                        slipDetail: this.tempData,
                        readonly: false // Check readonly
                    },
                    parent: this,
                    width: 1200,
                    events: {
                        close(value) {
                            rowNode.setDataValue('uwingsFileCnt', value.length);
                            that.tempData = value;
                        }
                    }
                })
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
            // this.form.slipTypeCd = ''
            this.authority = this.$store.state.loginInfo.authorities[0].roleCd;
            // console.log(JSON.stringify(this.$store.state.loginInfo.authorities))
            this.form.wrtDeptCd = this.$store.state.loginInfo.loginDeptCd;
            this.form.wrtDeptNm = this.$store.state.loginInfo.loginDeptNm;


            this.form.writerId = this.$store.state.loginInfo.loginId;
            this.form.wrtNm = this.$store.state.loginInfo.userName;
            //this.form.wrtUserDut = this.$store.state.loginInfo.loginDutNm;
            //this.form.wrtUserDept = this.$store.state.loginInfo.loginDeptNm;

            this.setCallPageByParam()
            this.getSlipTypeCombo()
            this.getSlipStatCombo()
            this.getSourceCombo()
            this.goSearch()
            // console.log(this.$refs.grid)
        }
    };
</script>

<style scoped>
    .control.select.is-fullwidth {
        width: 55%;
    }
</style>
