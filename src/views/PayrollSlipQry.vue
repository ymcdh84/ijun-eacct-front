<template>
    <div slot="content">
        <div class="content-name">
            <div class="table-name">
                <h3 class="ico_table_name" style="float:left">구매송장 정보</h3>
                <!-- <div class="btn-wrap btn-type1 clearfix" style="margin-bottom: 5px;display:block;float:right">
                    <button v-if="this.$store.state.loginInfo.loginId === this.thisApprUser || this.deleYn ==='Y'" class="btn-size btn-blue" @click="openApprPopup()"><span class="btn-icon"><i
                            class="fas fa-pen-alt"></i></span> 결재
                    </button>
                    <button v-if="this.$store.state.loginInfo.loginId == draftUserId && docStatus === 'REQ'"
                            class="btn-size btn-yellow" @click="cancel(docMngNo)"><span class="btn-icon"><i class="far fa-file"></i></span> 상신취소
                    </button>
                </div> -->
            </div>
        </div>


        <!-- 테이블 -->
        <!--<div class="table-area">
            <div class="table-b">
                <div class="grid-wrap">
                    <dhx-grid ref="grid1" v-model="apprDetails" :config="config"/>
                </div>
            </div>
        </div>-->
        <div class="table-area">
            <div class="table-header">

                <div class="table-a fixed">

                    <div class="content">
                        <div class="btn-wrap" >
                            <table class="table">
                                <tbody>
                                <tr>
                                    <th style="width: 10%;">송장번호</th>
                                    <td colspan="2">{{slipDetail.invoiceNum}}</td>
                                    <th style="width: 10%;">전표일자</th>
                                    <td colspan="2">{{slipDetail.invoiceDt}}</td>
                                    <th style="width: 10%;">생성일시</th>
                                    <td colspan="4">{{slipDetail.creatDt}}</td>
                                </tr>
                                <tr>
                                    <th >전표유형</th>
                                    <td colspan="2">{{slipDetail.invoiceTypeLookupCd}}</td>
                                    <th >GL일자</th>
                                    <td colspan="2">{{slipDetail.glDt}}</td>
                                    <th>작성자</th>
                                    <td colspan="4">{{slipDetail.userFullNm}}</td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                        <div class="btn-wrap" >
                            <table class="table">
                                <tbody>
                                <tr>
                                    <th style="width: 10%;">공급처명</th>
                                    <td colspan="5">{{slipDetail.vendorNm}}</td>
                                    <th style="width: 10%;" >지급방법</th>
                                    <td colspan="2">{{slipDetail.payMthdLookupCd}}</td>
                                    <th style="width: 10%;">지급조건</th>
                                    <td colspan="2">{{slipDetail.payTerm}}</td>
                                </tr>
                                <tr>
                                    <th style="width: 10%;">지점명</th>
                                    <td colspan="2">{{slipDetail.vendorSiteNm}}</td>
                                    <th style="width: 10%;">통화</th>
                                    <td colspan="2">{{slipDetail.invoiceCurCd}}</td>
                                    <th style="width: 10%;">환율</th>
                                    <td class="rightDt" colspan="2">{{$numeral(slipDetail.exchangeRate).format('0,0.00')}}</td>
                                    <th style="width: 10%;">지급예정일</th>
                                    <td colspan="2">{{slipDetail.dueDt}}</td>
                                </tr>
                                <tr>
                                    <th>사업자번호</th>
                                    <td colspan="2">{{slipDetail.vatRegNum}}</td>
                                    <th>공급가액</th>
                                    <td class="rightDt" colspan="2">{{$numeral(slipDetail.invoiceAmount).format('0,0')}}</td>
                                    <th>세액</th>
                                    <td class="rightDt" colspan="2">{{$numeral(slipDetail.taxAmount).format('0,0')}}</td>
                                    <th>총액</th>
                                    <td class="rightDt" colspan="2">{{$numeral(slipDetail.sumAmt).format('0,0')}}</td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            <div class="table-b">
                <div class="content-name">
                    <div class="table-name">
                        <h3 class="ico_table_name">분배 정보</h3>
                    </div>
                </div>
                <div class="grid-wrap">
                    <dhx-grid ref="grid2" v-model="divisions" :config="config2" @constructGridSuccessful="constructGridSuccessful"/>
                </div>
            </div>
        </div>
        <!-- //테이블 -->
        <!-- 계정정보 & 합계 -->
        <div class="table-area">
            <div class="table-header">
                <div class="table-a fixed">
                    <div class="content">
                        <div class="btn-wrap" >
                            <table class="table">
                                <tbody>
                                <tr>
                                    <th rowspan="2" style="width: 10%;">계정정보</th>
                                    <th style="width: 10%;">계정</th>
                                    <td>{{form.acctCd}}</td>
                                </tr>
                                <tr>
                                    <th style="width: 10%;">계정명</th>
                                    <td>{{form.acctNm}}</td>
                                </tr>
                                </tbody>
                            </table>
                            <table class="table">
                                <tr>
                                    <th rowspan="3">합계</th>
                                    <th colspan="2">입력금액(외화)</th>
                                    <th colspan="2">환산금액(원화)</th>
                                </tr>
                                <tr>
                                    <th>차변</th>
                                    <th style="height:30px;">대변</th>
                                    <th>차변</th>
                                    <th>대변</th>
                                <tr>
                                    <td class="rightDt" style="height: 30px;">{{$numeral(dvsTotInfo.drAmtForTot).format('0,0.00')}}</td>
                                    <td class="rightDt">{{$numeral(dvsTotInfo.crAmtForTot).format('0,0.00')}}</td>
                                    <td class="rightDt">{{$numeral(dvsTotInfo.drAmtKorTot).format('0,0')}}</td>
                                    <td class="rightDt">{{$numeral(dvsTotInfo.crAmtKorTot).format('0,0')}}</td>
                                </tr>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- //계정정보 & 합계 -->
        <!--증빙 정보-->
        <div class="table-area" style="height: 60px;">
            <div class="file has-name" style="width: 1000px;">
                <div class="file" style="margin-right: 10px;">
                    <div class="file-label" @click="openUploadEvidencePopup()">
                    <span class="file-cta">
                        <span class="file-label"> 증빙첨부</span>
                        <span class="icon-bar"><img src="/img/bar.png" alt="" /></span>
                    </span>
                        <span class="file-name">{{ this.$numeral(etaxXmlHd.ufileCnt).format('00') }}<i class="far fa-file-alt"></i></span>
                    </div>
                </div>

                <div class="file" >
                    <div class="file-label" @click="openUploadWingsPopup()">
                    <span class="file-cta">
                        <span class="file-label"> Wings 문서</span>
                        <span class="icon-bar"><img src="/img/bar.png" alt="" /></span>
                    </span>
                        <span class="file-name">{{ this.$numeral(etaxXmlHd.uwingsFileCnt).format('00') }}<i class="far fa-file-alt"></i></span>
                    </div>
                </div>
            </div>
        </div>
        <!--//증빙 정보 -->
        <!--팝업-->

        <!--//팝업 -->
    </div>
</template>

<script>
    import moment from 'moment'
    import mixin from '@/mixin';
    import mixinSlip from '@/mixin/slip';
    import _ from 'lodash'

    import assert from '@/libs/assert'
    import DhxCalendar from '@/components/DhxCalendar.vue'
    import DhxGrid from '@/components/DhxGrid.vue'
    import ApprActPop from '@/components/ApprActPop.vue'

    import EvidAtchPop from '@/components/EvidAtchPop.vue'
    import WingsAtchPop from '@/components/WingsAtchPop.vue'


    import {
        url as _url
    } from '@/libs/join'

    //
    //'./grid/GridCheckbox.vue'

    export default {
        name: 'payrollSlipQry',
        props: ['eaSlipNo','slipTypeCd', 'title', 'docMngNo'],
        components: {DhxGrid, DhxCalendar, ApprActPop},
        mixins: [ mixin, mixinSlip ],
        data() {
            return {
                config2:{
                    columns: [
                        {id: 'rn', type: 'cntr', align: 'center', sort: 'na', value: 'No.', width: 35},
                        {id: 'accountNm', type: 'ro', align: 'left', sort: 'na', value: '계정명', width: 120},
                        {id: 'remark', type: 'ro', align: 'left', sort: 'na', value: '적요', width: 120},
                        {id: 'drAmtFor', type: 'ron', align: 'right', sort: 'na', value: '입력금액(외화)', width: 120},
                        {id: 'crAmtFor', type: 'ron', align: 'right', sort: 'na', value: '#cspan', width: 120},
                        {id: 'drAmtKrw', type: 'ron', align: 'right', sort: 'na', value: '환산금액(원화)', width: 100},
                        {id: 'crAmtKrw', type: 'ron', align: 'right', sort: 'na', value: '#cspan', width: 120}
                    ],
                    events: {
                        onRowSelect(rId, cInd, val){
                            let colDef = this.options.columns[cInd]
                            this.$parent.form.acctCd = val.coaCode;
                            this.$parent.form.acctNm = val.coaDesc;
                        }
                    },
                    height: 180,
                },
                useDetails: [],
                divisions: [],
                slipDetail:[],
                apprDetails:[],
                etaxXmlHd:[],
                dvsTotInfo:{},
                acctCd:'',
                data: {},
                apprHeader: {},
                apprLine: [],
                budReqNo: undefined,
                apprNo: '',
                apprSeq: '',
                docTitleNm: '',
                docTypeCd: '',
                docType: 'SLIP',
                docStatus: '',
                draftUserId: '',
                thisApprUser: '',
                deleYn: 'N',
                loaded: false,
                grSlipNo: undefined,
                form: {
                    acctCd: '',
                    acctNm: '',
                    useYn: 'N',
                    compCd: '',
                    crdCompCd: '',
                    useDtlsStatCd: '10',
                    crdFgCd: '',
                    crdNo: '',
                    crdPssrId: '',
                    crdPssrNm: '',
                    crdPssrTitle: '',
                    crdPssrDut: '',
                    crdPssrDept: '',
                    coaCode:'',
                    coaDesc:'',
                    searchDtmFr: this.$moment().startOf('month').format('YYYY-MM-DD'),
                    searchDtmTo: this.$moment().format('YYYY-MM-DD'),
                },
                results: {},
                deEaSlipNo: '',
                slipStatCd:''
            }
        },
        methods: {
            getAppr(docMngNo) {
                this.loaded = false

                if (docMngNo != undefined) {
                    this.$http.get(`/api/appr/detail/${docMngNo}`)
                        .then(response => {
                            if (response.data) {
                                this.apprSeq = ''
                                this.thisApprUser = ''

                                this.apprHeader = response.data.apprHeader;
                                this.apprLine = response.data.apprDetails;

                                this.docTypeCd = response.data.apprHeader[0].docTypeCd;
                                this.docStatus = response.data.apprHeader[0].docStatCd;
                                this.draftUserId = response.data.apprHeader[0].draftUserId;
                                this.docTitleNm = response.data.apprHeader[0].docTitleNm;
                                this.apprNo = response.data.apprHeader[0].apprNo;
                                this.grSlipNo = response.data.apprHeader[0].docMngNo;
                                this.docType = 'ERP'
                                this.data.custAccount = [this.data.custBnkCd, this.data.custAcctNo].join('_')

                                _.forEach(this.apprLine, v => {
                                    if (v.apprFgCd ==='X') {
                                        this.apprSeq = v.apprSeq
                                        this.thisApprUser = v.aprverId
                                        return false
                                    }
                                })

                                this.loaded = true
                            }
                        })
                        .catch(({message}) => {
                            console.error(message);
                        }).finally(() => {
                            this.goSearch()
                        })
                }
            },
            constructGridSuccessful(grid) {
                grid.attachHeader(
                    ["#rspan", "#rspan", "#rspan",
                        "차변", "대변", "차변", "대변"],
                )

                grid.setNumberFormat('0,000.00', 3, '.', ',')
                grid.setNumberFormat('0,000.00', 4, '.', ',')
                grid.setNumberFormat('0,000', 5, '.', ',')
                grid.setNumberFormat('0,000', 6, '.', ',')

            },
            goSearch() {

                this.$store.commit('loading');
                this.$http.get(`api/erp/pay/slip/${this.grSlipNo}`
                ).then(response => {
                    if (response.data) {
                        try{
                            //헤더정보
                            this.slipDetail = response.data.slipDetail[0]
                            //분배정보
                            this.divisions = response.data.division
                            if(this.divisions.length > 0){
                                this.form.acctCd = this.divisions[0].coaCode
                                this.form.acctNm = this.divisions[0].coaDesc
                            }
                            //합계
                            this.dvsTotInfo = response.data.dvsTotInfo
                            //계산서 정보
                            this.etaxXmlHd = response.data.etaxXmlHd[0]
                            this.deEaSlipNo = response.data.eaSlipNo
                            this.slipStatCd = response.data.slipStatCd

                        }catch(e){
                            //
                        }

                    }
                }).finally(() => {
                    this.$store.commit('finish')
                });
            },
            openApprPopup() {
                let vm = this
                this.$modal.open({
                    component: ApprActPop,
                    props: {
                        docTitleNm: this.docTitleNm,
                        apprNo: this.apprNo,
                        apprSeq: this.apprSeq
                    },
                    parent: this,
                    events: {
                        close(data) {
                            // Close event handler
                            // console.log('Appr Popup Close Event!!'+ data)
                            vm.getAppr(data)
                        }
                    }
                })
            },
            deleCheck() {
                this.$http.get(`/api/appr/delegatingCheck`, {
                    params: {
                        adlgId: this.thisApprUser,
                        actId: this.$store.state.loginInfo.loginId
                    }
                })
                    .then(response => {
                        this.deleYn = response.data;
                    });
            },
            cancel(docMngNo) {
                this.$swal({
                    type: 'info',
                    text: `상신을 취소합니다. 계속 하시겠습니까?`,
                    showCancelButton: true,
                    confirmButtonText: '예',
                    cancelButtonText: '아니오',
                }).then((result) => {
                    if (result.value) {
                        if (this.grSlipNo != undefined) {
                            this.$http.get(`/api/appr/detail/cancel/${this.docMngNo}`)
                                .then(response => {
                                    if (response.data) {
                                        this.$swal({ type: 'info', text: '상신 취소 되었습니다.' });
                                        closeModal()
                                        this.$parent.$parent.goSearch()
                                        // this.$router.push({path: `/apprReqLst`});
                                    }
                                })
                                .catch(({message}) => {
                                    console.error(message);
                                });
                        }
                    }
                })
            },
            openUploadEvidencePopup() {
                let vm = this
                const val = this.etaxXmlHd
                this.$modal.open({
                    component: EvidAtchPop,
                    props: {
                        //docMngNo: this.eaSlipNo,
                        docMngNo: this.deEaSlipNo,
                        readonly: this.slipStatCd !== '10'//this.isReadonly // Check readonly
                    },
                    parent: this,
                    width: 1200,
                    events: {
                        close(value) {
                            val.ufileCnt = value.length
                        }
                    }
                })
            },
            openUploadWingsPopup(){
                const val = this.etaxXmlHd
                this.$modal.open({
                    component: WingsAtchPop,
                    props: {
                        grSlipNo: this.grSlipNo,
                        slipDetail: this.tempData,
                        readonly: this.slipStatCd !== '10'//this.isReadonly // Check readonly
                    },
                    parent: this,
                    width: 800,
                    events: {
                        close(value) {
                            //this.data.grSlipNo = value[0].grSlipNo
                            val.uwingsFileCnt = value.length
                            //this.tempData = value
                        }
                    }
                })
            },
            closeModal(){
                this.$parent.close()
                this.$parent.$parent.goSearch()
            }

        },
        created(){
            this.getAppr(this.docMngNo)
        },
        watch: {
            'title': {
                immediate: true,
                deep: true,
                handler(value) {
                    if(value !== undefined) {
                        this.title = value
                    }
                }
            },
            'loaded'() {
                this.deleCheck()
            },
        },
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
    table tr th {
        text-align: center
    }

    .rightDt {
        text-align: right
    }

</style>
