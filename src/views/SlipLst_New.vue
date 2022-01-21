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
                        <span class="search_tit">- 신청일자</span>
                    </div>
                    <div class="search_con">
                        <div class="datepicker w-type-ymd02">
                            <dhx-calendar class="input ddate sDate" v-model="form.postDtFrom" />
                        </div>
                        <span class="wave"> ~ </span>
                        <div class="datepicker w-type-ymd02">
                            <dhx-calendar class="input ddate sDate" v-model="form.postDtTo" />
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
                                        <dhx-calendar class="input ddate sDate" v-model="form.postDtFrom" />
                                    </div>
                                    <span class="datepicker w10p dp-ib tac"> ~ </span>
                                    <div class="datepicker w-type-ymd02 w30p">
                                        <dhx-calendar class="input ddate sDate" v-model="form.postDtTo" />
                                    </div>
                                  <button @click="dateSetting('toDay')" class="search_bt_white_s">당일</button>
                                  <button @click="dateSetting('crrntMnth')" class="search_bt_white_s">당월</button>
                                  <button @click="dateSetting('PrvsMnth')" class="search_bt_white_s">전월</button>
                                </div>
                            </div>

                            <div class="search_box_pop">
                                <div class="search_title">
                                    <span class="search_tit">- 작성부서</span>
                                </div>
                                <div class="search_con search-area">
                                    <div v-if="authority==='10'" class="desc">
                                        <input class="input dp-ib input-bg w40p_5r" type="text" v-model="form.wrtDeptCd">
                                        <div class="dp-ib w60p">
                                            <input class="input" type="text" v-model="form.wrtDeptNm" @input="initCctr" @keypress.enter="popCctr">
                                            <button class="icon is-right" @click="popCctr"><i class="fas fa-search"></i>
                                            </button>
                                        </div>
                                    </div>
                                    <div v-else class="desc">
                                        <input class="input dp-ib input-bg w40p_5r" type="text" style="width:100px;" v-model="form.wrtDeptCd" disabled>
                                        <div class="dp-ib w60p">
                                            <input class="input" type="text" v-model="form.wrtDeptNm" @input="initCctr" @keypress.enter="popCctr" disabled>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="search_box_pop">
                                <div class="search_title">
                                    <span class="search_tit">- 거래처</span>
                                </div>
                                <div class="search_con search-area">
                                    <input class="input Rt-M tal w100p" type="text" v-model="form.evdCustNm">
                                </div>
                            </div>

                            <div class="search_box_pop">
                                <div class="search_title">
                                    <span class="search_tit">- 전표유형</span>
                                </div>
                                <div class="search_con search-area">
                                    <b-select class="select is-fullwidth" v-model="form.slipTypeCd">
                                        <option value=''>==전체==</option>
                                        <option
                                                v-for="item in slipTypes"
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
                                    <input class="input dp-ib w20p_5r" type="text" v-model="form.wrtUserDut" disabled>
                                    <input class="input dp-ib w30p_5r" type="text" v-model="form.wrtUserDept" disabled>
                                    <input class="input dp-ib w20p_5r" type="text" v-model="form.wrtId" disabled>
                                    <div v-if="$numeral(authority).value() <= 20" class="dp-ib w30p">
                                        <input class="input" type="text" v-model="form.wrtNm" @input="initEmp" @keypress.enter="popEmp">
                                        <button class="icon is-right" @click="popEmp"><i class="fas fa-search"></i>
                                        </button>
                                    </div>
                                    <div v-else class="dp-ib w30p">
                                        <input class="input" type="text" v-model="form.wrtNm" @input="initEmp" @keypress.enter="popEmp" disabled>
                                    </div>
                                </div>
                            </div>

                            <div class="search_box_pop">
                                <div class="search_title">
                                    <span class="search_tit">- 지급처</span>
                                </div>
                                <div class="search_con search-area">
                                    <input class="input Rt-M tal w100p" type="text" v-model="form.payCustNm">
                                </div>
                            </div>

                            <div class="search_box_pop">
                                <div class="search_title">
                                    <span class="search_tit">- 전표상태</span>
                                </div>
                                <div class="search_con search-area">
                                    <b-select class="select is-fullwidth w100p" v-model="form.slipStatCd">
                                        <option value=''>==전체==</option>
                                        <option
                                                v-for="item in slipStats"
                                                :key="item.key"
                                                :value="item.key"
                                                v-text="item.value"/>
                                    </b-select>
                                </div>
                            </div>

                            <div class="search_box_pop">
                                <div class="search_title">
                                    <span class="search_tit">- 신청번호</span>
                                </div>
                                <div class="search_con search-area">
                                    <input class="input Rt-M tal w100p" type="text" v-model="form.grSlipNo">
                                </div>
                            </div>

                            <div class="search_box_pop">
                                <div class="search_title">
                                    <span class="search_tit">- 적요</span>
                                </div>
                                <div class="search_con search-area">
                                    <input class="input Rt-M tal w100p" type="text" v-model="form.hdSgtxt">
                                </div>
                            </div>
                            <div class="search_box_pop">
                                <div class="search_title">
                                    <span class="search_tit">- 재사용 건 제외</span>
                                </div>
                                <div class="search_con search-area">
                                    <input id="check01" type="checkbox" v-model="form.exReUsed">
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

        <!-- 테이블 -->
        <div class="table-area">

            <div class="table-b">
                <div class="table-header">
                    <div class="table-name">
                        <h3 class="ico_table_name">전표내역</h3>
                    </div>
                    <div class="btn-wrap btn-type1 clearfix">
                        <button class="btn-size btn-excel" @click="saveExcel">엑셀 저장</button>
                    </div>
                </div>

                <div class="grid-wrap">
                    <ag-grid-vue 
                        style="width: 100%;"
                        class="ag-theme-alpine grid_search_height"    
                        rowSelection="single"
                        
                        :columnDefs="columnDefs"     
                        :gridOptions="gridOptions"
                        :rowData="slipList"
                        :defaultColDef="defaultColDef"
                        :sideBar="true"
                        @cell-clicked="onCellClicked"
                        @rowDoubleClicked="rowDoubleClick"
                        />
                </div>
            </div>

        </div>
        <!-- //테이블 -->

    </div>
</template>

<script>
    import Vue from 'vue';
    import mixin from '@/mixin';
    import mixinSlip from '@/mixin/slip';
    import _ from 'lodash'

    import DhxCalendar from '@/components/DhxCalendar.vue'
    import DhxGrid from '@/components/DhxGrid.vue'
    import Cctr from '@/components/Cctr_Ag.vue'
    import Emp from '@/components/Emp_Ag.vue'
    import SlipDetailModal from '@/components/SlipDetailModal.vue'
    import SlipPayDetailModal from '@/components/SlipPayDetailModal.vue'
    import SlipEtcDetailModal from '@/components/SlipEtcDetailModal.vue'
    import ErpItfErrModal from '@/components/ErpItfErrModal_Ag.vue'
    import GlDetailModal from '@/components/GlDetailModal.vue'
    import PayrollSlipModal from '@/components/PayrollSlipModal.vue'
    import BulkSlipModal from '@/components/BulkSlipModal.vue'
    import {AgGridVue} from 'ag-grid-vue';
    import TableCheckBox from '@/components/slip/table/libs/TableCheckBox'


    const bus = new Vue()
    export default {
        name: 'SlipList',
        mixins: [mixin, mixinSlip],
        components: {Cctr, Emp, DhxGrid, DhxCalendar, AgGridVue,TableCheckBox},
        props: {
            params: {
                type: Object,
                required: false
            },
        },
        data() {
            return {
                title: '전표내역조회',
                slipTypes: [],
                slipStats: [],
                slipList: [],
                authority: '',
                form: {
                    postDtFrom: this.$moment().startOf('month').format('YYYY-MM-DD'),
                    postDtTo: this.$moment().format('YYYY-MM-DD'),
                    grSlipNo: '',
                    slipTypeCd: '',
                    evdCustNm: '',
                    wrtId: '',
                    wrtNm: '',
                    wrtUserDut: '',
                    wrtUserDept: '',
                    wrtDeptCd: '',
                    wrtDeptNm: '',
                    slipStatCd: '',
                    payCustNm: '',
                    erpStatus: '',
                    reCreate: '',
                    page: 0,
                    hdSgtxt:'',
                    exReUsed:true,
                },
                syncGoPage: false,
                gridOptions: {},
                columnDefs:[],
                defaultColDef: { 
                    resizable: true, 
                    filter:true, 
                    sortable: true ,
                    enableValue: true,
                    enableRowGroup: true,
                    enablePivot: true,
                }
            };
        },
        methods: {
            makeColDef(){
                const that = this;
                this.columnDefs =[
                    {
                        headerName:'No.', 
                        field:'no', 
                        width:65,
                        valueFormatter: function(params) {               
                            return params.node.rowIndex+1;
                        }
                    },
                    {
                        headerName:'신청번호', 
                        field:'grSlipNo', 
                        width:150
                    },
                    {
                        headerName:'전표상태', 
                        field:'slipStatNm', 
                        width:100,
                        pivot: true, enablePivot: true 
                    },
                    {
                        headerName:'전표유형', 
                        field:'slipTypeNm', 
                        width:175
                    },
                    {
                        headerName:'신청일자', 
                        field:'postDt', 
                        width:110,
                        valueFormatter: (params) => {               
                            return that.$moment(params.value).format('YYYY-MM-DD');
                        }
                    },
                    {
                      headerName:'작성부서명',
                      field:'wrtDeptNm',
                      width:100
                    },
                    {
                      headerName:'작성자',
                      field:'wrtNm',
                      width:80
                    },
                    {
                        headerName:'통화', 
                        field:'curCd', 
                        width:80
                    },
                    {
                        headerName:'공급가', 
                        field:'supAmt', 
                        width:140,
                        cellStyle:{textAlign: 'right'},
                        valueFormatter: (params) => {               
                            return that.getNumberFormat(params.value);
                        }
                    },
                    {
                        headerName:'부가세액', 
                        field:'vatAmt', 
                        width:140,
                        cellStyle:{textAlign: 'right'},
                        valueFormatter: (params) => {               
                            return that.getNumberFormat(params.value);
                        }
                    },
                    {
                        headerName:'총금액', 
                        field:'totAmt', 
                        width:140,
                        cellStyle:{textAlign: 'right'},
                        valueFormatter: (params) => {               
                            return that.getNumberFormat(params.value);
                        }
                    },
                    {
                        headerName:'총금액(KRW)', 
                        field:'krwTotAmt', 
                        width:140,
                        cellStyle:{textAlign: 'right'},
                        valueFormatter: (params) => {               
                            return that.getNumberFormat(params.value);
                        }
                    },
                    {
                      headerName:'거래처명',
                      field:'evdCustNm',
                      width:200
                    },
                    {
                        headerName:'지급처명', 
                        field:'payCustNm', 
                        width:140
                    },
                    {
                        headerName:'적요', 
                        field:'hdSgtxt', 
                        width:300
                    },
                    {
                        headerName:'재경의견', 
                        field:'apprRsn', 
                        width:200
                    },
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
                      headerName:'거래처코드',
                      field:'evdCustCd',
                      width:140,
                      valueFormatter: (params) => {
                        return params.value === '-' ? '' : params.value;
                      }
                    },
                    {
                      headerName:'지급처코드',
                      field:'payCustCd',
                      width:140,
                      valueFormatter: (params) => {
                        return params.value === '-' ? '' : params.value;
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
                      valueFormatter: (params) => {
                        if(!_.isEmpty(params.value)){
                        return that.$moment(params.value).format('YYYY-MM-DD');
                        }else{
                          return null
                        }
                      }
                    },
                ]

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
                    
                }
            },
            rowDoubleClick(params){
                var value = {
                    grSlipNo: params.data.grSlipNo,
                    slipStatCd: params.data.slipStatCd,
                    slipTypeCd: params.data.slipTypeCd,
                    fromSlipLst:true,
                    docMngNo: params.data.apprNo,
                    data: params.data
                }

                this.goPage(value);
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
              this.gridOptions.api.exportDataAsCsv(params)
            },
            goPage(params) {
                //전표내역에서 백버튼 생성하기 위해서 쿠키에 임의로 지정 후 스토어에 저장
                this.$cookie.set('searchForm', JSON.stringify(this.form));
                this.$store.commit('searchForm', JSON.parse(this.$cookie.get('searchForm')));

                switch (params.slipTypeCd) {
                    case 'E1':
                        if(params.slipStatCd==='10') {
                            this.$router.push({
                                name: 'pExpenseEdit',
                                params
                            })
                        } else {
                            // this.$router.push({path: `/pExpense/${params.grSlipNo}`});
                            // console.log(params)
                            params.eaSlipNo = params.grSlipNo
                            this.$router.push({
                                name: 'pExpenseEdit',
                                params
                            })
                        }
                        break
                    case 'E2':
                        if(params.slipStatCd==='10') {
                            this.$router.push({
                                name: 'exctpExpenseEdit',
                                params
                            })
                        } else {
                            params.eaSlipNo = params.grSlipNo
                            this.$router.push({
                                name: 'exctpExpenseEdit',
                                params
                            })
                        }
                        break
                    case 'E3':
                        if(params.slipStatCd==='10') {
                            this.$router.push({
                                name: 'ebillSlipReg',
                                params
                            })
                        } else {
                            params.eaSlipNo = params.grSlipNo
                            this.$router.push({
                                name: 'billSlipMng',
                                params
                            })
                        }
                        break
                    case 'E4':
                        if(params.slipStatCd==='10') {
                            this.$router.push({
                                name: 'billSlipReg',
                                params
                            })
                        } else {
                            params.eaSlipNo = params.grSlipNo
                            this.$router.push({
                                name: 'billSlipMng',
                                params
                            })
                        }
                        // this.$router.push({
                        //     name: 'evidSlipEdit',
                        //     params
                        // })
                        break
                    case 'E5':
                        if(params.slipStatCd==='10') {
                            this.$router.push({
                                name: 'cardSlipReg',
                                params
                            })
                        } else {
                            params.eaSlipNo = params.grSlipNo
                            this.$router.push({
                                name: 'billSlipMng',
                                params
                            })
                        }
                        break
                    case 'E11':
                        this.$modal.open({
                            component: SlipPayDetailModal,
                            parent: this,
                            props: {
                                grSlipNo: params.grSlipNo,
                                slipTypeCd: params.slipTypeCd,
                                title: '자금지급전표',
                                docMngNo: params.docMngNo,
                                value: params.data
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
                                title: '구매전표',
                                docMngNo: params.docMngNo,
                                value: params.data
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
                                title: '공사비전표',
                                docMngNo: params.docMngNo,
                                value: params.data
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
                                title: '기타전표',
                                docMngNo: params.docMngNo,
                                value: params.data
                            },
                            width: 1200,
                        })
                        break
                    default :
                        break
                }

            },
            goSearch() {
                
                const param = JSON.parse(JSON.stringify(this.form));
                param.exReUsed = param.exReUsed ? 'Y' : 'N'
                const stripFields = ['postDtFrom', 'postDtTo']; //'evdDtFrom', 'evdDtTo'
                _.forEach(stripFields, (name) => param[name] = this.toPure(param[name]));

                if (!this.validation(param)) return;

                this.$store.commit('loading');
                this.$http.post(`/api/slip/history`, param)
                    .then(response => {
                        if (response.data) {
                            this.slipList = response.data;
                        }
                    }).finally(() => {
                        this.$store.commit('finish')
                        if(this.syncGoPage) this.goPage(this.form.page)
                        this.syncGoPage = false
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
                if (!param.postDtFrom || !param.postDtTo) {
                    this.$swal({type: 'warning', text: '신청일자를 입력해 주세요.'});
                    return false;
                }
                return true;
            },
            popCctr() {
                const that = this;

                this.$modal.open({
                    component: Cctr,
                    parent: this,
                    props: {
                        param: this.form.wrtDeptNm
                    },
                    width: 700,
                    events: {
                        close(obj) {
                            that.form.wrtDeptCd = obj.cctrCd;
                            that.form.wrtDeptNm = obj.cctrNm;
                        }
                    }
                });
            },
            initCctr(force) {
                if (force === true) this.form.wrtDeptNm = '';
                if (this.form.wrtDeptNm === '') this.form.wrtDeptCd = '';
            },
            popEmp() {
                const that = this;

                this.$modal.open({
                    component: Emp,
                    parent: this,
                    props: {
                        param: this.form.wrtNm
                    },
                    width: 700,
                    events: {
                        close(obj) {
                            that.form.wrtId = obj.empNo;
                            that.form.wrtNm = obj.empNm;
                            that.form.wrtUserDut = obj.dutNm;
                            that.form.wrtUserDept = obj.deptNm;
                        }
                    }
                });
            },
            initEmp(force) {
                if (force === true) this.form.wrtNm = '';
                if (this.form.wrtNm === '') {
                    this.form.wrtId = '';
                    this.form.wrtUserDut = '';
                    this.form.wrtUserDept = '';
                }
            },
            setCallPageByParam(){
                if (this.$route.params) {
                    for (let member in this.form) {
                        if (this.$route.params[member] !== undefined) {
                            this.form[member] = this.$route.params[member]
                        }
                    }
                }
            },
          dateSetting(str){
              switch (str) {
                case 'toDay':
                  this.form.postDtFrom = this.$moment().format('YYYYMMDD')
                  this.form.postDtTo = this.$moment().format('YYYYMMDD')
                  break;
                case 'crrntMnth':
                  this.form.postDtFrom = this.$moment().startOf('month').format('YYYYMMDD')
                  this.form.postDtTo = this.$moment().endOf('month').format('YYYYMMDD')
                  break;
                case 'PrvsMnth':
                  this.form.postDtFrom = this.$moment().add(-1, 'month').startOf('month').format('YYYYMMDD')
                  this.form.postDtTo = this.$moment().add(-1, 'month').endOf('month').format('YYYYMMDD')
                  break;
              }
              // this.goSearch()
          }
        },
        beforeMount() {
            this.makeColDef();
        },
        mounted() {
          document.title = this.title + ' - IJEAS';
            if(this.params.slipTypeCd) this.form.slipTypeCd = this.params.slipTypeCd;

            this.authority = this.$store.state.loginInfo.authorities[0].roleSelectCd;
            if((!this.form.wrtDeptCd || this.form.wrtDeptCd === '') && this.authority !== '10') {
                this.form.wrtDeptCd = this.$store.state.loginInfo.loginDeptCd;
                this.form.wrtDeptNm = this.$store.state.loginInfo.loginDeptNm;
            }
            if((!this.form.wrtId || this.form.wrtId === '') && this.authority !== '10') {
                this.form.wrtId = this.$store.state.loginInfo.loginId;
                this.form.wrtNm = this.$store.state.loginInfo.userName;
            }
            if((!this.form.wrtUserDut || this.form.wrtUserDut === '') && this.authority !== '10') {
                this.form.wrtUserDut = this.$store.state.loginInfo.loginDutNm;
                this.form.wrtUserDept = this.$store.state.loginInfo.loginDeptNm;
            }

            this.setCallPageByParam()
            this.getSlipTypeCombo()
            this.getSlipStatCombo()
            this.goSearch()
        },
        watch: {
            'params': {
                immediate: true,
                deep: true,
                handler(value) {
                    if(value && value.postDtFrom) {
                        this.form = value
                        if(this.form.page > 0) {
                            this.syncGoPage = true
                        }
                    }
                }
            }
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
        float:left
    }

    .desc-content .item .desc-item:last-child {
        margin-bottom: 0;
        height: 25px;
        float:left
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
        width: 40%;
        padding-right: 20px;
    }

    .desc-content .item.desc-center {
        width: 35%;
        padding-right: 40px;
    }

    .desc-content .item.desc-right {
        width: 25%;
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
