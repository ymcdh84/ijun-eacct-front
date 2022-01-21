<template>
    <div class="inner-box" v-if="$route.path.substr(0,7)=='/mobile'" style="zoom: 65%;">
        <!-- Appr Header area -->
        <appr-dtl v-if="isLoaded" v-model="data" :docMngNo="docMngNo" :budReqNo="budReqNo" :docType="docType" :approval-line.sync="apprLine" @input="$forceUpdate()"/>
    </div>
    <div class="inner-box" v-else>
        <div class="content-name">
            <h2 class="dp-ib" style="height: 33px">{{title}}</h2>
            <div class="btn-wrap btn-type1 clearfix" style="margin-bottom: 0">
                <button v-if="this.$store.state.loginInfo.loginId === this.thisApprUser || this.deleYn ==='Y'" class="btn-size btn-blue" @click="openApprPopup()"><span class="btn-icon"><i
                        class="fas fa-pen-alt"></i></span> 결재
                </button>
<!--                <button v-if="this.$store.state.loginInfo.loginId == draftUserId && docStatus === 'REQ'"-->
<!--                        class="btn-size btn-yellow" @click="cancel(docMngNo)"><span class="btn-icon"><i class="far fa-file"></i></span> 상신취소-->
<!--                </button>-->
                <button v-if="this.$store.state.loginInfo.loginId == draftUserId && (data.slipStatCd === '40'|| data.slipStatCd === '60')"
                        class="btn-size btn-orange" @click="buttonEventCopy"><span class="btn-icon"><i class="far fa-clone"></i></span> 전표복사
                </button>
                <button v-if="this.$store.state.loginInfo.loginId == draftUserId && data.slipStatCd === '70' && (slipTypeCd == 'E2' || slipTypeCd == 'E4')"
                        class="btn-size btn-orange" @click="buttonEventCopy"><span class="btn-icon"><i class="far fa-clone"></i></span> 전표복사
                </button>
            </div>
        </div>

        <appr-dtl v-if="isLoaded" v-model="data" :docMngNo="docMngNo" :budReqNo="budReqNo" :docType="docType" :approval-line.sync="apprLine" @input="$forceUpdate()"/>

        <b-modal :active.sync="showVendorModal1" has-modal-card @receive="getAppr">
            <appr-act-pop :docTitleNm="docTitleNm" :apprNo="apprNo" :apprSeq="apprSeq"></appr-act-pop>
        </b-modal>
    </div>
</template>

<script>
    /* eslint-disable */
    import mixin from '@/mixin';
    import mixinSlip from '@/mixin/slip';
    import _ from 'lodash'
    import assert from '@/libs/assert'
    import {
    url as _url
    } from '@/libs/join'
    import ApprDtl from '@/components/ApprDtl.vue'
    import ApprHeader from '@/components/ApprHeader.vue'
    import ApprActPop from '@/components/ApprActPop.vue'
    /**
     * Query options
     */
    function queryOption(url, type, params) {
        return new Promise((resolve, reject) => {
            // Validate requirement
            assert(url !== undefined, 'URL is required')
            assert(type !== undefined, 'Type is required')

            if (!url.match(/^\/?api.*/g)) {
            url = _url('api', url)
            }

            this.$http.get(url, {
                params
            })
            .then(response => {
                this.options[type] = response.data
                return resolve(response)
            }).catch(response => {
                return reject(response)
            }).finally(() => {
            })
        })
    }
    export default {
        name: 'ApprDtlQry',
        props: {
            docMngNo: {
                type: String,
                required: false
            },
            value: {
                type: Object,
                required: false
            }
        },
        mixins: [mixin, mixinSlip],
        components: {ApprHeader, ApprActPop, ApprDtl},
        data() {
            return {
                data: {},
                title: '결재 상세',
                apprHeader: {},
                apprLine: [],
                budReqNo: undefined,
                apprNo: '',
                apprSeq: '',
                docTitleNm: '',
                docTypeCd: '',
                docType: 'SLIP',
                docStatus: '',
                slipStatCd:'',
                draftUserId: '',
                thisApprUser: '',
                deleYn: 'N',
                loaded: false,
                showVendorModal1: false,
                options: {
                    'TAXES_CD' : [],
                    'TPS_TYPE_CD' : []
                },
                grSlipNo: '',
                slipTypeCd: ''
            };
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

                                // console.log(JSON.stringify(response.data))
                                if(response.data.budgetHeader) {
                                    this.apprHeader = response.data.apprHeader;
                                    this.apprLine = response.data.apprDetails;

                                    this.docTypeCd = response.data.apprHeader[0].docTypeCd;
                                    this.docStatus = response.data.apprHeader[0].docStatCd;
                                    this.draftUserId = response.data.apprHeader[0].draftUserId;
                                    this.docTitleNm = response.data.apprHeader[0].docTitleNm;
                                    this.apprNo = response.data.apprHeader[0].apprNo;

                                    this.docType = 'BDGT'
                                    this.budReqNo = response.data.budgetHeader.budReqNo
                                } else if(response.data.slipGroupHeader){
                                    this.data = response.data.slipGroupHeader
                                    this.data.slipDetails = response.data.slipGroupDetails

                                    this.apprHeader = response.data.apprHeader;
                                    this.apprLine = response.data.apprDetails;

                                    this.docTypeCd = response.data.apprHeader[0].docTypeCd;
                                    this.docStatus = response.data.apprHeader[0].docStatCd;
                                    this.draftUserId = response.data.apprHeader[0].draftUserId;
                                    this.docTitleNm = response.data.apprHeader[0].docTitleNm;
                                    this.apprNo = response.data.apprHeader[0].apprNo;
                                    this.docType = 'GR';
                                    this.slipStatCd = this.data.slipStatCd;
                                } else {
                                    if(response.data.slipGroup) {
                                        let data_gr = response.data.slipGroup
                                        let data_hd_top = response.data.slipHeaders.filter(x => x.evdTypeCd === '10')
                                        let data_hd_botm = response.data.slipHeaders.filter(x => x.evdTypeCd === '42')

                                        // this.data = data_gr
                                        data_hd_top.forEach((x) => {
                                            x.itemSeq = x.itemSeq
                                            x.eaSlipDt = x.evdDt
                                            x.useDt = x.evdDt
                                            x.cctrCd = x.wrtDeptCd
                                            x.cctrNm = x.wrtDeptNm
                                            x.deptCd = x.baseDeptCd
                                            x.deptNm = x.baseDeptNms
                                            x.expenseId = x.expsId
                                            x.expenseAcctCode = x.expsAcctCd
                                            x.expenseName = x.expsNm
                                            x.expenseAcctName = x.expsAcctNm
                                            x.detailNm = x.productNm
                                            x.detailCd = x.productCd
                                            x.useAmt = x.totAmt
                                            x.lnSgtxt = x.hdSgtxt
                                            // x.vatCd = x.vatTaxCd
                                            x.crdNo = x.cardNo
                                            x.stptPlc = x.stptPlc  //출발지
                                            x.dstnPlc = x.dstnPlc  //도착지
                                            x.biztrpObj = x.biztrpObj
                                            x.tpsDst = x.tpsDst  //거리-교통비 
                                            x.oilKindCd = x.oilKindCd //유종코드-교통비
                                            x.oilUpc = x.oilUpc  //유류단가-교통비 
                                            x.oilEff = x.oilEff  //연비-교통비
                                            x.acctAmt = x.acctAmt  //경비금액
                                            x.lnTypeCd = x.lnTypeCd  //라인타입 보내줘야하네?
                                            x.vatYn = x.vatYn ? 'Y' : 'N'
                                            x.vatCd = x.vatTaxCd
                                            x.vatNm = x.vatTaxNm
                                            if(!x.tpsTypeCd) {
                                                x.tpsTypeCd = '10'
                                                x.acctAmt = 0
                                                x.tpsDst = 0
                                                x.oilKindCd = 'GSL'
                                            }
                                        })
                                        data_hd_botm.forEach((x) => {
                                            x.evdDt = x.evdDt
                                            x.eaSlipDt = x.evdDt
                                            x.eaSlipDt2 = x.evdDt
                                            x.cctrCd = x.wrtDeptCd
                                            x.cctrNm = x.wrtDeptNm
                                            x.deptCd = x.baseDeptCd
                                            x.deptNm = x.baseDeptNm
                                            x.expenseId2 = x.expsId
                                            x.expenseAcctCode2 = x.expsAcctCd
                                            x.expenseName2 = x.expsNm
                                            x.expenseAcctName2 = x.expsAcctNm
                                            x.detailNm2 = x.productNm
                                            x.detailCd2 = x.productCd
                                            x.useAmt2 = x.totAmt
                                            x.lnSgtxt = x.hdSgtxt
                                            x.scanCt = x.scanCt
                                            x.storeNm = x.hdRef5
                                            x.address = x.hdRef3
                                        })
                                        
                                        this.data = data_gr
                                        this.data.slipDetails = []
                                        this.data.slipDetails2 = []
                                        
                                        data_hd_top.forEach((x) => this.data.slipDetails.push(x))
                                        data_hd_botm.forEach((x) => this.data.slipDetails2.push(x))

                                    } else if(response.data.slip) {
                                        let data_hd = response.data.slip
                                        let data_dt = response.data.slipDetails
                                        
                                        data_hd.evdTypeCd = '40'
                                        data_hd.evdCustNm = data_hd.payCustNm
                                        data_hd.evdCustCd = data_hd.payCustCd
                                        data_hd.custAccount = data_hd.custAcctNo
                                        data_hd.lbltAcctCd = data_hd.liabilityAcctCd
                                        data_hd.lbltAcctNm = data_hd.liabilityAcctNm
                                        data_hd.baseDeptCd = data_hd.wrtDeptCd
                                        data_hd.baseDeptNm = data_hd.wrtDeptNm
                                        data_hd.empNo = data_hd.wrtId
                                        data_hd.empNm = data_hd.wrtNm
                                        data_dt.forEach(x => {
                                            x.itemSeq = x.itemSeq
                                            x.dcCd = 'D'
                                            x.dcNm = '차변'
                                            x.lnTypeCd = 'ITEM'
                                            x.deptCd = x.cctrCd
                                            x.deptNm = x.cctrNm
                                            x.expenseAcctCode = x.acctCd
                                            x.expenseAcctName = x.acctNm
                                            x.expenseName = x.expenseNm
                                            //비용항목계정명 셋팅해야함.
                                            x.detailCd = x.productCd
                                            x.detailNm = x.productNm
                                            x.vatYn = x.vatYn ? 'Y' : 'N'
                                            x.useAmt = x.acctAmt
                                            x.lnSgtxt = x.lnSgtxt

                                            delete x.regId
                                            delete x.regDtm
                                            delete x.chgId
                                            delete x.chgDtm
                                        })
                                        this.data = data_hd

                                        this.data.slipDetails = []
                                        data_dt.forEach(x => this.data.slipDetails.push(x))
                                    } else {
                                        this.data = response.data.slipHeader
                                        this.data.slipDetails = response.data.slipDetails
                                    }
                                    this.apprHeader = response.data.apprHeader;
                                    this.apprLine = response.data.apprDetails;

                                    this.docTypeCd = response.data.apprHeader[0].docTypeCd;
                                    this.docStatus = response.data.apprHeader[0].docStatCd;
                                    this.draftUserId = response.data.apprHeader[0].draftUserId;
                                    this.docTitleNm = response.data.apprHeader[0].docTitleNm;
                                    this.apprNo = response.data.apprHeader[0].apprNo;
                                    this.docType = 'SLIP'
                                    this.data.custAccount = [this.data.custBnkCd, this.data.custAcctNo].join('_')

                                    _.forEach(this.data.slipDetails, item => {
                                        switch (item.dcCd) {
                                            case 'C':
                                                item.creditAmt = item.acctAmt
                                                break
                                            case 'D':
                                                item.debitAmt = item.acctAmt
                                                break
                                        }
                                    })
                                    
                                }


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
                        })
                }
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
                        if (docMngNo != undefined) {
                            this.$http.get(`/api/appr/detail/cancel/${docMngNo}`)
                                .then(response => {
                                    if (response.data) {
                                        this.$router.push({path: `/apprReqLst`});
                                    }
                                })
                                .catch(({message}) => {
                                    console.error(message);
                                });
                        }
                    }
                })
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
                            console.log('Appr Popup Close Event!!'+ data)
                            vm.getAppr(data)
                        }
                    }
                })
            },
            popVendor1(clear) {
                this.showVendorModal1 = true;
            },
            receiveVendor1(obj) {
                this.docTitleNm = obj.docTitleNm;
            },
            buttonEventCopy() {
              let name = undefined
              let url = undefined
              const vm = this
              var slipTypeCd = ''
              if(this.slipTypeCd === undefined){slipTypeCd = this.apprHeader[0].slipTypeCd}
              else{slipTypeCd = this.slipTypeCd}
              switch (slipTypeCd) {
                case 'E1':
                  // name = 'cardSlipReg'
                  name = 'pExpense'
                  url = `/api/slip/p/copy/${this.data.grSlipNo}`
                  break
                case 'E2':
                  // name = 'ebillSlipReg'
                  name = 'exctpExpenseEdit'
                  url = `/api/slip/np/copy/${this.data.grSlipNo}`
                  break
                case 'E3':
                  name = 'ebillSlipReg'
                  url = `/api/slip/copy/${this.data.grSlipNo}`
                  break
                case 'E4':
                  name = 'billSlipReg'
                  url = `/api/slip/copy/${this.data.grSlipNo}`
                  break
                case 'E5':
                  name = 'cardSlipReg'
                  url = `/api/slip/copy/${this.data.grSlipNo}`
                  break
                case 'E6':
                  name = 'whtSlipNew'
                  break
                case 'E7':
                  name = ''
                  break
              }

              this.$swal({
                type: 'warning',
                text: `전표 복사시 기존 전표는 조회 목록에서 제외처리됩니다. 계속하시겠습니까?`,
                showCancelButton: true,
                confirmButtonText: '예',
                cancelButtonText: '아니오',
              }).then((result) => {
                if (result.value) {
                  this.$http.get(url)
                      .then(responese => {
                        if (responese.data) {
                          var resGrslipNo = '';
                          switch (slipTypeCd) {
                            case 'E1':
                              resGrslipNo = responese.data.slipGroup.grSlipNo
                              break
                            case 'E2':
                              resGrslipNo = responese.data.slip.grSlipNo
                              break
                            case 'E3':
                              resGrslipNo = responese.data.slipHeader.grSlipNo
                              break
                            case 'E4':
                              resGrslipNo = responese.data.slipHeader.grSlipNo
                              break
                            case 'E5':
                              resGrslipNo = responese.data.slipHeader.grSlipNo
                              break
                          }
                          if (resGrslipNo !== '') {
                            vm.$router.push({
                              name: name,
                              params: {
                                grSlipNo: resGrslipNo,
                              }
                            })
                          }
                        }
                      })
                }
              });
            },
        },
        created() {
            if(!_.isEmpty(this.$route.params)){
                this.docMngNo = this.$route.params.docMngNo
                this.grSlipNo = this.$route.params.grSlipNo
                this.slipTypeCd = this.$route.params.slipTypeCd
            }

            this.getAppr(this.docMngNo);
            
        },
        computed: {
            isLoaded() {
                return this.loaded
            },
        },
        watch: {
            'loaded'() {
                this.deleCheck()
            },
        }
    };
</script>

<style>
</style>

