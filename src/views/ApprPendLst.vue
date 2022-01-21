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
            <div class="item desc-left">
                <div class="desc-item">
                    <div class="tit">
                        <span class="label-tit">- 문서코드</span>
                    </div>
                    <div class="desc">
                        <b-select class="select is-fullwidth" v-model="form.docTypeCd">
                            <option value=''>==전체==</option>
                            <option
                                    v-for="item in docTypes"
                                    :key="item.key"
                                    :value="item.key"
                                    v-text="item.value"/>
                        </b-select>
                    </div>
                </div>
                <div class="desc-item">
                    <div class="tit">
                        <span class="label-tit">- 기안일자</span>
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
            <div class="item desc-center" style="width: 22%;">
                <div class="desc-item">
                    <div class="tit">
                        <span class="label-tit">- 부서</span>
                    </div>
                    <div class="desc">
                        <div class="td-s-thumb search-area" style="width: 300px">
                            <input class="input input-bg" type="text" style="width:100px;" v-model="form.cctrCd"
                                   disabled>
                            <div class="ip-box ip-box-w02" style="width:120px;">
                                <input class="input" type="text" v-model="form.cctrNm" @input="initCctr" @keypress.enter="popCctr">
                                <button class="icon is-right" @click="popCctr()"><i class="fas fa-search"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                
                
            </div>
            

            <div class="item desc-right" style="width: 40%;">
                <div class="desc-item">
                    <div class="tit">
                        <span class="label-tit">- 기안자</span>
                    </div>
                    <div class="desc">
                        <div class="td-s-thumb search-area" style="width: 100%">
                            <input class="input input-bg" type="text" style="width:65px;" v-model="form.draftUserId" disabled>
                            <div class="ip-box ip-box-w02" style="width:120px;">
                                <input class="input" type="text" v-model="form.draftNm" @input="initEmp" @keypress.enter="popEmp">
                                <button class="icon is-right" @click="popEmp(true)"><i class="fas fa-search"></i>
                                </button>
                            </div>
                            <div class="ip-box ip-box-w02" style="width:200px;margin-left:0;margin:10px 0 0 5px;display:inline">
                                <input class="input input-bg" type="text" style="width:70px;margin-right:5px;display:inline" v-model="form.draftUserDut" disabled>
                                <input class="input input-bg" type="text" style="width:80px;display:inline" v-model="form.draftUserDept" disabled>
                            </div>

                            <div class="desc-item" style="display:inline-block;width:100px;margin-left:5px">
                                <div class="tit">
                                    <input type="checkbox" id="delegateChk" v-model="checked"/><label for="delegateChk">위임포함</label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="desc-item">
                    <div class="tit">
                        <span class="label-tit">- 제목</span>
                    </div>
                    <div class="desc">
                        <input class="input Rt-M tal" type="text" v-model="form.docTitleNm">
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
                        <h3 class="ico_table_name">결재할 목록</h3>
                    </div>
                    
                    <div class="btn-wrap btn-type1 clearfix">
                        <div style="float:left; padding-top:10px; margin-right:10px;"> 총 금액 : {{$numeral(totalAmt).format('0,0')}} </div>
                        <button class="btn-size btn-gray fl_left" @click="approval()">
                            <span class="btn-icon"><i class="far fa-save-alt"></i></span>일괄승인
                        </button>
                        <button class="btn-size btn-excel" @click="saveExcel">엑셀 저장</button>
                    </div>
                </div>
                <div class="grid-wrap">
                    <dhx-grid ref="grid" v-model="pendList" :config="config" @constructGridSuccessful="constructGridSuccessful"/>
                </div>
            </div>
        </div>
        <!-- //테이블 -->

        <!--팝업-->
        <b-modal :active.sync="showEmpModal" has-modal-card @receive="receiveEmp">
            <emp :param="form.draftNm"></emp>
        </b-modal>
        <!--//팝업 -->
    </div>
</template>

<script>
    import mixin from '@/mixin';
    import mixinSlip from '@/mixin/slip';
    import _ from 'lodash'

    import DhxCalendar from '@/components/DhxCalendar.vue'
    import DhxGrid from '@/components/DhxGrid.vue'
    import Emp from '@/components/Emp.vue'
    import SlipDetailModal from '@/components/SlipDetailModal.vue'
    import SlipPayDetailModal from '@/components/SlipPayDetailModal.vue'
    import SlipEtcDetailModal from '@/components/SlipEtcDetailModal.vue'
    import GlDetailModal from '@/components/GlDetailModal.vue'
    import PayrollSlipModal from '@/components/PayrollSlipModal.vue'
    import BulkSlipModal from '@/components/BulkSlipModal.vue'
    import ApprBundlePop from '@/components/ApprBundlePop.vue'
    import Cctr from '@/components/Cctr.vue';

    export default {
        name: 'ApprPendLst',
        mixins: [mixin, mixinSlip],
        components: {Emp, DhxGrid, DhxCalendar},
        props: {
            params: {
                type: Object,
                required: false
            },
        },
        data() {
            return {
                config : {
                    columns: [
                        {id: 'useYn', type: 'ch', align: 'center', width: 70, value: '<input type="checkbox" id="checkAll" :v-model="checkAll"/><label for="checkAll">전체</label>'},
                        {id: 'rn', type: 'cntr', align: 'center', sort: 'na', value: 'No.', width: 35},
                        {id: 'docType', type: 'ro', align: 'center', sort: 'na', value: '문서유형', width: 100},
                        {id: 'docStatNm', type: 'ro', align: 'center', sort: 'na', value: '문서상태', width: 100},
                        {id: 'docTitleNm', type: 'ro', align: 'left', sort: 'na', value: '제목', width: 400},
                        {id: 'apprType', type: 'ro', align: 'center', sort: 'na', value: '결재유형', width: 80},
                        {id: 'apprStatus', type: 'ron', align: 'center', sort: 'na', value: '결재구분', width: 80},
                        {id: 'apprNo', type: 'ron', align: 'center', sort: 'na', value: '결재번호', width: 150},
                        {id: 'docMngNo', type: 'ron', align: 'center', sort: 'na', value: '문서번호', width: 150},
                        {id: 'wrtDeptNm', type: 'ro', align: 'center', sort: 'na', value: '부서', width: 100},
                        {id: 'draftUserId', type: 'ro', align: 'center', sort: 'na', value: '기안자사번', width: 100},
                        {id: 'draftUserName', type: 'ro', align: 'center', sort: 'na', value: '기안자', width: 100},
                        {id: 'draftUserJob', type: 'ro', align: 'center', sort: 'na', value: '직급', width: 80},
                        {id: 'draftDtm', type: 'ro', align: 'center', sort: 'na', value: '기안일자', width: 120},
                        {id: 'slipTypeCd', type: 'ro', align: 'center', sort: 'na', value: '타입', hide: true},
                        {id: 'apprSeq', type: 'ro', align: 'center', sort: 'na', value: 'apprSeq', hide: true},
                        {id: 'totAmt', type: 'ro', align: 'center', sort: 'na', value: '금액', hide: true},
                    ],
                    height: 510,
                    enablePaging: true,
                    pagingSize: 12,
                    queryPage: (page) => {
                        page = page || 0
                        return new Promise((resolve, reject) => {
                            let data = {
                                contents: this.pendList,
                                page: page,
                                totalPages: parseInt(this.pendList.length / this.config.pagingSize) + (parseInt(this.pendList.length % this.config.pagingSize) > 0 ? 1 : 0),
                                totalElements: 0
                            }
                            resolve({
                                data: data
                            })
                        })
                    },
                    afterRefreshData(grid, data) {
                        this.$nextTick(() => {
                            _.forEach(data, (item, index) => {
                                let rId = index + 1
                                grid.cells(rId, 13).setValue(this.$moment(grid.cells(rId, 13).getValue()).format('YYYY-MM-DD'));
                            })
                        })
                    }
                },
                title: '결재할 문서',
                docTypes: [],
                pendList: [],
                checked: 'checked',
                showEmpModal: false,
                form: {
                    docTypeCd: '',
                    searchDtmFr: this.$moment().startOf('month').format('YYYY-MM-DD'),
                    searchDtmTo: this.$moment().format('YYYY-MM-DD'),
                    draftUserId: '',
                    draftNm: '',
                    draftUserDut: '',
                    draftUserDept: '',
                    delegateChk: '',
                    docTitleNm: '',
                    page: 0,
                    cctrCd: '',
                    cctrNm: ''
                },
                syncGoPage: false,
                totalAmt:0, //2020.06.04 전체금액 변수
            };
        },
        methods: {
            constructGridSuccessful(grid) {
                this.config.queryPage(0)
                
                grid.attachEvent('onRowDblClicked', (rId) => {
                    
                    let slipTypeCd = grid.cells(rId, 14).getValue();
                    let docMngNo = grid.cells(rId, 7).getValue();
                    let grSlipNo = grid.cells(rId, 8).getValue();
                    switch(slipTypeCd)
                    {
                        case 'E1' :
                        case 'E2' :
                        case 'E3' :
                        case 'E4' :
                            //전표내역에서 백버튼 생성하기 위해서 쿠키에 임의로 지정 후 스토어에 저장
                            this.$cookie.set('searchForm', JSON.stringify(this.form));
                            this.$store.commit('searchForm', JSON.parse(this.$cookie.get('searchForm')));
                            this.$router.push({path: `/apprDtlQry/${docMngNo}`});
                            break;
                        case 'E5' :
                            this.$modal.open({
                                component: BulkSlipModal,
                                props: {
                                    grSlipNo: grSlipNo,
                                    docMngNo: docMngNo,
                                    loaded: false
                                },
                                parent: this,
                                width: 1200
                            })
                            break;
                        default:
                            this.showDetailPop(grSlipNo, slipTypeCd,docMngNo)
                            break;
                    }

                    //this.$router.push({path: `/apprDtlQry/${eaSlipNo}`});
                });

                let vm = this
                grid.attachEvent("onheaderClick", function(ind, obj) {
                    if(ind === 0) {
                        const rowsNum = grid.getRowsNum();
                        if(vm.checkAll) {
                            vm.totalAmt = 0;
                            vm.checkAll = false
                            $("#checkAll").prop("checked", false)
                            for(var i=rowsNum; i>0; i--) {
                                grid.cells(i, 0).setValue(vm.checkAll)
                                vm.pendList[i-1].useYn = vm.checkAll
                            }
                        } else {
                            vm.totalAmt = 0;
                            vm.checkAll = true
                            $("#checkAll").prop("checked", true)
                            for(var i=rowsNum; i>0; i--) {
                                grid.cells(i, 0).setValue(vm.checkAll)
                                vm.pendList[i-1].useYn = vm.checkAll
                                //2020.06.04 전체선택 합산 금액
                                let a = grid.cells(i, 16).getValue();
                                a = Number(a);
                                vm.totalAmt = vm.totalAmt + a;
                            }
                        }
                    }
                });
                //2020.06.04 체크된 값 합산
                grid.attachEvent("onCheckbox", function(rId,cInd,state){
                    
                    let check = grid.cells(rId,0).getValue();
                    if(check == '1'){
                        let a = grid.cells(rId, 16).getValue();
                        a = Number(a);
                        vm.totalAmt = vm.totalAmt + a;
                    }else if(check =='0'){
                        let b = grid.cells(rId, 16).getValue();
                        vm.totalAmt = vm.totalAmt - b;
                    }
                });
            },
            showDetailPop(grSlipNo, slipTypeCd,docMngNo){
                const vm = this;
                let title = ''
                let setModal = undefined
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
                console.log('docMngNo ', docMngNo)
                this.$modal.open({
                    component: setModal,
                    parent: this,
                    props: {
                        grSlipNo: grSlipNo,
                        slipTypeCd: slipTypeCd,
                        docMngNo:docMngNo,
                        title: title
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
            saveExcel() {
                this.downloadExcel(this.$refs.grid);
            },
            goSearch() {
                const param = JSON.parse(JSON.stringify(this.form));
                const stripFields = ['searchDtmFr', 'searchDtmTo'];
                _.forEach(stripFields, (name) => param[name] = this.toPure(param[name]));

                if (param.searchDtmFr > param.searchDtmTo) {
                    this.$swal({type: 'warning', text: '조회 시작일자와 종료일자 지정이 잘못되었습니다.'});
                    return false
                }

                let deleChk = '';
                if (this.checked) deleChk = 'Y';

                this.$store.commit('loading');
                this.$http.post(`/api/appr/todo/list`, {
                            docTypeCd: param.docTypeCd,
                            searchDtmFr: this.toPure(param.searchDtmFr),
                            searchDtmTo: this.toPure(param.searchDtmTo),
                            draftUserId: param.draftUserId,
                            acctCd: param.acctCd,
                            delegateChk: deleChk,
                            docTitleNm: param.docTitleNm,
                            wrtDeptCd: this.form.cctrCd
                    }
                )
                .then(response => {
                    if (response.data) {
                        this.pendList = response.data;
                        _.forEach(this.pendList, (x, i) => {
                            x.useYn = false
                        })
                        $("#checkAll").prop("checked", false)
                        this.config.queryPage(0)
                    }
                }).finally(() => {
                    this.$store.commit('finish')
                    if(this.syncGoPage) this.$refs.grid.goPage(this.form.page)
                    this.syncGoPage = false
                });
            },
            approval(){ //일괄승인 대기중
                let apprList = this.pendList.filter(x => x.useYn === true)
                
                if (apprList.length > 0) {
                    let vm = this
                    this.$modal.open({
                        component: ApprBundlePop,
                        props: {
                            apprList
                        },
                        parent: this,
                        events: {
                            close(data) {
                                // Close event handler
                                console.log('Appr Popup Close Event!!', data)
                                vm.goSearch()
                            }
                        }
                    })
                } else
                {
                    this.$swal({type: 'warning', text: '선택하신 전표정보가 없습니다.'})
                }
            },
            popEmp(clear) {
                if (clear === true) {
                    this.form.draftUserId = '';
                    this.form.draftNm = '';
                    this.form.draftUserDut = '';
                    this.form.draftUserDept = '';
                }
                this.showEmpModal = true;
            },
            receiveEmp(obj) {
                this.form.draftUserId = obj.empNo;
                this.form.draftNm = obj.empNm;
                this.form.draftUserDut = obj.dutNm;
                this.form.draftUserDept = obj.deptNm;
            },
            initEmp(force) {
                if (force === true) this.form.draftNm = '';
                if (this.form.draftNm === '') {
                    this.form.draftUserId = '';
                    this.form.draftUserDut = '';
                    this.form.draftUserDept = '';
                }
            },
            initCctr(force) {
                if (force === true) this.form.cctrNm = '';
                if (this.form.cctrNm === '') this.form.cctrCd = '';
            },
            popCctr(){
                const that  = this;

                this.$modal.open({
                    width: 800,
                    component: Cctr,
                    parent: this,
                    props: {
                        param: this.form.cctrNm
                    },
                    events: {
                        close(data) {
                            that.form.cctrCd = data.cctrCd
                            that.form.cctrNm = data.cctrNm
                        },
                    }
                })
            }
        },
        mounted() {
            this.getDocTypeCombo();
            this.goSearch();
        },
        watch: {
            'params': {
                immediate: true,
                deep: true,
                handler(value) {
                    if(value && value.searchDtmFr) {
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
        padding-left: 80px;
    }
    .datepicker.w-type-ymd02{width:114px;}

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

