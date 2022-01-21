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
                <div class="desc-item" style="margin-top: 13px">
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
            <div class="item desc-center">
                <div class="desc-item">
                    <div class="tit">
                        <span class="label-tit">- 공급자</span>
                    </div>
                    <div v-if="authority==='ADMIN'" class="desc">
                        <div class="td-s-thumb search-area" style="width: 100%">
                            <input class="input input-bg" type="text" style="width:100px;" v-model="form.vendorCd">
                            <div class="ip-box ip-box-w02">
                                <input class="input" type="text" v-model="form.vendorNm" @input="initVendor" @keypress.enter="popVendor">
                                <button class="icon is-right" @click="popVendor(true)"><i class="fas fa-search"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div v-else class="desc">
                        <div class="td-s-thumb search-area" style="width: 100%">
                            <input class="input input-bg" type="text" style="width:100px;" v-model="form.vendorCd" disabled>
                            <div class="ip-box ip-box-w02" style="width:180px;">
                                <input class="input" type="text" v-model="form.vendorNm" @input="initVendor" @keypress.enter="popVendor" >
                                <button class="icon is-right" @click="popVendor(true)"><i class="fas fa-search"></i>
                                </button>
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
            <div class="item desc-right">
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
                        <button class="btn-size btn-blue" @click="goSubmit">
                            <span class="btn-icon"><i class="fas fa-pen-alt"></i></span> 상신
                        </button>
                        <button class="btn-size btn-orange" @click="buttonEventErpDelete(cnt)">
                            <span class="btn-icon"><i class="fas fa-pen-alt"></i></span> 삭제
                        </button>
                        <button class="btn-size btn-excel" @click="saveExcel">엑셀 저장</button>
                    </div>
                </div>

                <div class="grid-wrap">
                    <dhx-grid ref="grid" v-model="slipList" :config="config" @constructGridSuccessful="constructGridSuccessful"/>
                </div>
            </div>

        </div>
        <!-- //테이블 -->

        <!--팝업-->
        <b-modal :active.sync="showCctrModal" has-modal-card @receive="receiveCctr">
            <cctr :param="form.wrtDeptNm"></cctr>
        </b-modal>
        <b-modal :active.sync="showEmpModal" has-modal-card @receive="receiveEmp">
            <emp :param="form.wrtNm"></emp>
        </b-modal>
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
    import _ from 'lodash'
    import slip from '@/mixin/slip-basic'

    import DhxCalendar from '@/components/DhxCalendar.vue'
    import DhxGrid from '@/components/DhxGrid.vue'
    //팝업
    import Vendor from '@/components/Vendor.vue'
    import Cctr from '@/components/Cctr.vue'
    import Emp from '@/components/Emp.vue'
    import PayrollSlipModal from '@/components/PayrollSlipModal.vue'
    import EvidAtchPop from '@/components/EvidAtchPop.vue'
    import WingsAtchPop from '@/components/WingsAtchPop.vue'

    export default {
        name: 'payrollSlipLst',
        mixins: [mixin, mixinSlip, slip],
        components: {Cctr, Emp, Vendor, DhxGrid, DhxCalendar},
        data() {
            return {
                config: {
                    columns: [
                        {id: 'chk', type: 'ch', align: 'center', width: 30, value: '#'},
                        {id: 'no', type: 'cntr', align: 'center', sort: 'na', value: 'No.', width: 35},
                        {id: 'postDt', type: 'ro', align: 'center', sort: 'na', value: 'GL일자', width: 90},
                        {id: 'payCustNm', type: 'ro', align: 'left', sort: 'na', value: '공급처명', width: 100},
                        {id: 'hdSgtxt', type: 'ro', align: 'left', sort: 'na', value: '적요', width: 160},
                        {id: 'totAmt', type: 'ron', align: 'right', sort: 'na', value: '전표금액', width: 120},
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
                                            val.ufileCnt = ((response.data || {}).aFiles || []).length
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
                        {id: 'erpSlipNo', type: 'ro', align: 'left', sort: 'na', value: 'ERP전표번호', width: 140},
                        {id: 'curCd', type: 'ro', align: 'center', sort: 'na', value: '통화코드', width: 60},
                        {id: 'wrtId', type: 'ro', align: 'center', sort: 'na', value: '작성자사번', width: 80},
                        {id: 'wrtNm', type: 'ro', align: 'center', sort: 'na', value: '작성자', width: 80},
                        {id: 'grSlipNo', type: 'ro', align: 'center', sort: 'na', value: '', width: 80},
                        {id: 'eaSlipNo', type: 'ro', align: 'center', sort: 'na', value: '', width: 80},
                    ],
                    height: '625',
                    //enablePaging: true,
                    //pagingSize: 10
                },
                title: '급여전표',
                slipTypes: [],
                slipStats: [],
                slipList: [],
                evdYnList: [{'key': 'N', 'value' : '미첨부'}, {'key': 'Y', 'value' : '첨부'}],
                drpYnList: [{'key': 'N', 'value' : '미연동'}, {'key': 'Y', 'value' : '연동'}],
                tempData: [],
                authority: '',
                form: {
                    searchFr:this.$moment().startOf('month').format('YYYY-MM-DD'),
                    searchTo: this.$moment().endOf('month').format('YYYY-MM-DD'),
                    //searchFr: this.$moment().add(-2, 'month').startOf('month').format('YYYY-MM-DD'),
                    //searchTo: this.$moment().format('YYYY-MM-DD'),
                    evdYnCd: '',
                    drpYnCd: '',
                    slipTypeCd: 'E15',
                    vendorCd: '',
                    evdCustNm: '',
                    evdCustBizNo: '',
                    wrtId: '',
                    wrtNm: '',
                    wrtUserDut: '',
                    wrtUserDept: '',
                    wrtDeptCd: '',
                    wrtDeptNm: '',
                    slipStatCd: '',
                    payCustNm: '',
                },
                showCctrModal: false,
                showEmpModal: false,
                showVendorModal: false,
                result : [],
                cnt : 12, //grSlipNo 그리드 위치
            };
        },
        methods: {
            constructGridSuccessful(grid) {

                grid.setNumberFormat('0,000', 5, '.', ',')
                grid.setColumnHidden(12,true)
                grid.setColumnHidden(13,true)

                grid.attachEvent('onRowDblClicked', (rId) => {
                    let grSlipNo =  this.$refs.grid.instance.cells(rId,12).getValue();
                    let eaSlipNo =  this.$refs.grid.instance.cells(rId,13).getValue();
                    this.$modal.open({
                        component: PayrollSlipModal,
                        parent: this,
                        props: {
                            grSlipNo: grSlipNo,
                            eaSlipNo: eaSlipNo,
                            slipTypeCd: this.form.slipTypeCd,
                            title: "급여전표"
                        },
                        width: 1200,
                        events: {
                            close(obj){
                                console.log(obj)
                            }
                        }
                    })
                });
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
                this.downloadExcel(this.$refs.grid);
            },
            goSubmit() {
                let checkedIdList = this.$refs.grid.instance.getCheckedRows(0).split(',');
                let i = 0;
                this.result = [];
                if(this.$refs.grid.instance.getCheckedRows(0)){
                    checkedIdList.forEach((chkId) => {
                        this.result[i] = this.$refs.grid.instance.getRowData(chkId);
                        i += 1;
                    });
                    this.buttonEventErpSubmit()
                } else {
                    this.$swal({ type: 'info', text: '상신 대상을 선택해 주세요.' });
                }
            },
            goSearch() {
                // console.log("조회...")
                const param = JSON.parse(JSON.stringify(this.form));
                const stripFields = ['searchFr', 'searchTo'];
                _.forEach(stripFields, (name) => param[name] = this.toPure(param[name]));

                if (!this.validation(param)) return;

                this.$store.commit('loading');

                this.$http.post(`/api/erp/pay/slip/list`, param)
                    .then(response => {
                        if (response.data) {
                            this.slipList = response.data;
                            // this.config.queryPage(0)
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
                if (clear === true) {
                    this.form.writerId = '';
                    this.form.wrtNm = '';
                    this.form.wrtUserDut = '';
                    this.form.wrtUserDept = '';
                }
                this.showEmpModal = true;
            },
            popVendor(clear) {
                if (clear === true) {
                    this.form.vendorCd = '';
                    this.form.vendorNm = '';
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
                this.form.vendorCd = obj.vendCd;
                this.form.vendorNm = obj.vendNm;
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
                if (force === true) this.form.vendorNm = '';
                if (this.form.vendorNm === '') {
                    this.form.vendorCd = '';
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
            }
        },
        mounted() {
            this.authority = this.$store.state.loginInfo.authorities[0].roleCd;
            this.form.wrtDeptCd = this.$store.state.loginInfo.loginDeptCd;
            this.form.wrtDeptNm = this.$store.state.loginInfo.loginDeptNm;

            this.form.writerId = this.$store.state.loginInfo.loginId;
            this.form.wrtNm = this.$store.state.loginInfo.userName;
            this.form.wrtUserDut = this.$store.state.loginInfo.loginDutNm;
            this.form.wrtUserDept = this.$store.state.loginInfo.loginDeptNm;

            this.setCallPageByParam()
            this.getSlipTypeCombo()
            this.getSlipStatCombo()
            this.goSearch()
        }
    };
</script>

<style scoped>
    .control.select.is-fullwidth {
        width: 55%;
    }
</style>
