<template>
    <div>
        <div class="table-a fixed-th">
            <div class="table-name">
                <h3 class="ico_table_name">{{title}}</h3>
            </div>
            <table id="basic" class="table">
                <colgroup>
                <col width="10%"><col width="10%"><col width="10%"><col width="10%"><col width="20%"><col width="9%"><col width="8%"><col width="8%">
                </colgroup>
                <tbody>
<!--                <tr>-->
<!--                    <th>전표번호</th>-->
<!--                    <td width="12%">{{form.grSlipNo}}</td>-->
<!--                    <td width="8%"></td>-->

<!--                    <th>전표유형</th>-->
<!--                    <td>{{form.slipTypeNm}}</td>-->

<!--                    <th>전표상태</th>-->
<!--                    <td><span class="color_table_org">{{form.slipStatNm}}</span></td>-->
<!--                </tr>-->
<!--                <tr>-->
<!--                    <th>작성부서</th>-->
<!--                    <td>{{form.wrtDeptCd}} / {{form.wrtDeptNm}}</td>-->
<!--                    <td>{{form.bpNm}}</td>-->

<!--                    <th>작성자</th>-->
<!--                    <td>{{form.wrtNm}}</td>-->

<!--                    <th>작성일자</th>-->
<!--                    <td class="Rt-M">{{this.$moment(form.wrtDtm).format('YYYY-MM-DD')}}</td>-->
<!--                </tr>-->
<!--20210518 사용하지 않는 컬럼 주석처리-->
                <!--E3,E4는 기본정보 공유 -->
                <tr>
                    <th class="tp-a ">증빙유형</th>
                    <td colspan="2">
                        <b-select class="select is-fullwidth" v-model="form.evdTypeCd" :disabled="hideEvdType">
                            <option
                                    v-for="item in evdTypes"
                                    :key="item.key"
                                    :value="item.key"
                                    v-text="item.value"/>
                        </b-select>
                    </td>

                    <th>선급금신청</th>
                    <td>
                        <div class="control">
                            <div class="dp-ib fl_left">
                                <input type="radio" id="radio03" v-model="form.aplFgCd" value="N"/>
                                <label for="radio03" class="NotoM">없음</label>
                            </div>
                            <div class="dp-ib fl_left">
                                <input type="radio" id="radio04" v-model="form.aplFgCd" value="K"/>
                                <label for="radio04" class="NotoM">선급금신청</label>
                            </div>
                        </div>
                    </td>
                    <th class="tp-a">증빙일자</th>
                    <td>
                        <div class="datepicker w-type-ymd">
                            <input type="text" v-model="form.evdDt" id="calEvdDt" autocomplete="off" class="input"
                                   @change="setPayDueDt(form.payTermCd)" :disabled="disableEvdDt"/>
                        </div>
                    </td>
                    <th class="tp-a">회계일자</th>
                    <td>
                        <div class="datepicker w-type-ymd">
                            <!-- <input type="text" class="input date sDate" v-model="form.postDt"/> -->
                            <input type="text" v-model="form.postDt" id="calPostDt" autocomplete="off" class="input" :disabled="true">
                        </div>
                    </td>
                </tr>
                <tr>
                    <th class="tp-a">세금코드</th>
                    <td colspan="2">
                        <b-select class="select is-fullwidth" v-model="form.taxCd">
                            <option
                                    v-for="item in taxes"
                                    :key="item.taxCd"
                                    :value="item.taxCd"
                                    :rt="item.taxRt"
                                    v-text="`[${item.taxCd}] ${item.taxNm}`"/>
                        </b-select>
                    </td>
                    <th>정산구분</th>
                    <td>
                        <div class="control">
                            <div class="dp-ib fl_left">
                                <input type="radio" id="radio01" v-model="form.stlFgCd" value="N"/>
                                <label for="radio01" class="NotoM">미정산</label>
                            </div>
                            <div class="dp-ib fl_left">
                                <input type="radio" id="radio02" v-model="form.stlFgCd" value="K"/>
                                <label for="radio02" class="NotoM">선급금정산</label>
                            </div>
                        </div>
                    </td>
                    <th>선급금정산</th>
                    <td colspan="3">
                        <div class="control is-expanded search-area">
                            <div class="ip-box rs-mt2" style="width:40%;">
                                <input class="input input-bg" type="text" disabled="disabled" v-model="form.advReqSlipNo">
                                <button class="icon is-right" @click="openPopLayer()" ><i
                                        class="fas fa-search"></i></button>
                            </div>
                            <button class="remove_text rs-mt2 rs-mb2" @click="initAdvReq()"><i class="far fa-trash-alt"></i></button>
                            <number-input class="input input-bg" v-model="form.advReqSlipAmt" disabled="disabled" style="width:40%; margin-left: 10px;"/>
                        </div>
                    </td>
                </tr>
                <tr>
                    <th class="tp-a">거래처</th>
                    <td colspan="2">
                        <div class="td-s-thumb search-area">
                            <input class="input input-bg mr5 Rt-M rs-mt2" type="text" v-model="form.evdCustCd"
                                   style="width:66px;" disabled>
                            <div class="ip-box ip-box-w02 rs-mt2" @keypress.enter="popVendor1" style="width:calc(100% - 100px)">
                                <input class="input" type="text" v-model="form.evdCustNm" @keyup.delete="initVendor1">
                                <button class="icon is-right" @click="popVendor1(true)"><i class="fas fa-search"></i>
                                </button>
                            </div>
                            <button class="remove_text trash-input rs-mb2" @click="initVendor1(true)"><i
                                    class="far fa-trash-alt"></i></button>
                        </div>
                    </td>
                    <td class="bd-l-none">
                        <input type="checkbox" id="payCust" @click="checkActual"/><label for="payCust" style="letter-spacing:-0.1em">실지급처</label>
                    </td>
                    <td class="bd-l-none">
                        <div class="td-s-thumb search-area">
                            <input class="input input-bg mr5 Rt-M rs-mt2" type="text" ref="payCustCd"
                                   v-model="form.payCustCd" style="width:100px;" disabled>
                            <div class="ip-box rs-mt2" @keypress.enter="popVendor2" style="width:calc(100% - 150px)">
                                <input class="input actual" type="text" v-model="form.payCustNm"
                                       @keyup.delete="initVendor2" disabled>
                                <button class="icon is-right actual" @click="popVendor2(true)" disabled><i
                                        class="fas fa-search"></i></button>
                            </div>
                            <button class="remove_text trash-input rs-mb2 actual" @click="initVendor2(true)"><i
                                    class="far fa-trash-alt"></i></button>
                        </div>
                    </td>
                    <th>지급조건</th>
                    <td colspan="3">
                        <b-select class="select is-fullwidth" v-model="form.payTermCd">
                            <option
                                    v-for="item in payTerms"
                                    :key="item.detailCd"
                                    :value="item.detailCd"
                                    v-text="item.detailNm"/>
                        </b-select>
                    </td>
                </tr>
                <tr>
                    <th class="tp-a">공급가액</th>
                    <td colspan="2">
                        <number-input class="input Rt-M tar" type="text" v-model="form.supAmt" @keyup="calcVatAmt" @change="calcVatAmt"
                               :disabled="hideSupAmt" />
                    </td>

                    <th class="tp-a">기준부서</th>
                    <td>
                        <div class="td-s-thumb search-area">
                            <input class="input input-bg mr5 Rt-M rs-mt2" type="text" v-model="form.baseDeptCd"
                                   style="width:105px;" disabled>
                            <div class="ip-box rs-mt2" style="width:calc(100% - 140px)">
                                <input class="input" type="text" v-model="form.baseDeptNm" @input="initCctr"
                                       @keypress.enter="popCctr">
                                <button class="icon is-right" @click="popCctr(true)"><i class="fas fa-search"></i>
                                </button>
                            </div>
                            <button class="remove_text trash-input rs-mb2" @click="initCctr(true)"><i
                                    class="far fa-trash-alt"></i></button>
                        </div>
                    </td>

                    <th class="tp-a">지급예정일</th> 
                    <td>
                        <div v-if = "test==''" class="datepicker w-type-ymd">                            
                            <input type="text" v-model="form.payDueDt" id="calPayDueDt" autocomplete="off"
                                   class="input">
                        </div>
                        <div v-else class="datepicker w-type-ymd">                            
                            <input type="text" v-model="form.payDueDt" id="calPayDueDt" autocomplete="off"
                                   class="input" :disabled="true">
                        </div>
                    </td>
                    <th>지급비고란</th>
                    <td><input class="input" type="text" v-model="form.payText"/></td>
                </tr>
                <tr>
                    <th>부가세액</th>
                    <td colspan="2">
                        <number-input class="input Rt-M tar" type="text" ref="vat" v-model="form.vatAmt"
                               :disabled="hideVatAmt"/>
                    </td>

                    <th class="tp-a">대변계정</th>
                    <td>
                        <b-select class="select is-fullwidth" v-model="form.apAcctCd"
                                  @change.native="changeCreditAccount">
                            <option
                                    v-for="item in accounts"
                                    :key="item.key"
                                    :value="item.key"
                                    :name="item.value"
                                    v-text="`[${item.key}] ${item.value}`"/>
                        </b-select>
                    </td>

                    <th >지급계좌</th>
                    <td colspan="3">
                        <b-select class="select is-fullwidth" v-if="vendAccts.length > 0" v-model="custAccount"
                                  @input="changeVendorAccount">
                            <option
                                    v-for="item in vendAccts"
                                    :key="item.bnkCd+'|'+item.acctNo"
                                    :value="item.bnkCd+'|'+item.acctNo"
                                    v-text="item.acctNo + ' (' + item.bnkCd+ ')'"/>
                        </b-select>
                        <div class="select is-fullwidth" v-else>
                            <select>
                                <option value="" selected>== 지급계좌 없음==</option>
                            </select>
                        </div>
                    </td>
                </tr>
                <tr>
                    <th>기타금액</th>
                    <td colspan="2"><number-input class="input  Rt-M tar" type="text" v-model="form.etcAmt"
                                           :disabled="hideEtcAmt" /></td>

                    <th>{{columnTitle}}</th>
                    <td v-if="slipTypeCd === 'E3'">
                        <input id="eTaxNo" style="width:90%;" class="input input-bg Rt-M tal" type="text" v-model="form.etaxNo" disabled>
                        <span class="btn-icon" style="width:10%; margin: 0 0 0 8px; cursor:pointer" @click="goEtaxPage(form.etaxNo)">
                            <i class="fas fa-external-link-alt"></i>
                        </span>
                    </td>
                    <td v-else><span class="NotoM">{{form.curCd}}</span></td>

                    <th class="tp-a">사업장</th>
                    <td colspan="3">
                        <b-select class="select is-fullwidth" v-model="form.bpCd">
                            <option
                                    v-for="item in bizPlaces"
                                    :key="item.key"
                                    :value="item.key"
                                    v-text="item.value"/>
                        </b-select>
                    </td>
                </tr>
                <tr>
                    <th>총금액</th>
                    <td colspan="2"><number-input class="input input-bg  Rt-M tar" type="text" v-model="totAmt" disabled /></td>

                    <th class="tp-a"> 적요</th>
                    <td colspan="5"><input class="input" type="text" v-model="form.hdSgtxt"></td>
                </tr>
                <tr v-if="slipTypeCd === 'E4' && hideCrdNo">
                    <!-- <th class="tp-a ">카드번호</th>
                    <td colspan="2"><input class="input" maxlength="19" placeholder="0000 0000 0000 0000" v-model="form.crdNo"></td>
                    <td colspan="4"></td> -->
                </tr>
                <tr v-else-if="form.taxCd === '10003'||form.taxCd === '10001'">
                    <th>지급여부</th>
                    <td colspan="2">
                        <div class="control">
                            <div class="dp-ib fl_left">
                                <input type="checkbox" id="check01" v-model="form.hdRef8"/>
                                <label for="check01" class="NotoM">지급안함</label>
                            </div>
                        </div>
                    </td>
                    <td colspan="6"></td>
                </tr>
                </tbody>
            </table>
        </div>

        <slip-grid ref="detail" :slipDetails="slipDetails" :form="form" :slipTypeCd="slipTypeCd" @setHideVat="setHideVat"/>

        <!--파일업로드-->
            <!-- 20190520 퍼블수정 -->
        <!-- <div class="file-upload" v-if="slipTypeCd !== 'E3'">
            <div class="table-name">
                <h3 class="ico_table_name">파일보기</h3>
            </div>
            <div class="file has-name">
                <div class="file-label" @click="openUploadEvidencePopup()">
                    <span class="file-cta">
                      <span class="file-label"> 증빙첨부</span>
                      <span class="icon-bar"><img src="/img/bar.png" alt=""/></span>
                    </span>
                    <span class="file-name">{{ this.$numeral(evidFileSize).format('00') }}<i class="far fa-file-alt"></i></span>
                </div>
            </div>
        </div> -->
            <!-- //20190520 퍼블수정 -->
        <div class="file-upload">
            <div class="table-name">
                <h3 class="ico_table_name">파일보기</h3>
            </div>
            <div class="file has-name" style="width: 1200px;">
                <div class="file" style="margin-right: 10px;">
                    <div class="file-label" @click="openUploadWingsPopup()">
                        <span class="file-cta">
                        <span class="file-label"> Wings 문서</span>
                        <span class="icon-bar"><img src="/img/bar.png" alt="" /></span>
                        </span>
                        <span class="file-name">{{ this.$numeral(wingsFileSize).format('00') }}<i class="far fa-file-alt"></i></span>
                    </div>
                </div>

                <div class="file">
                    <div class="file-label" @click="openUploadEvidencePopup()">
                        <span class="file-cta">
                        <span class="file-label"> 증빙첨부</span>
                        <span class="icon-bar"><img src="/img/bar.png" alt="" /></span>
                        </span>
                        <span class="file-name">{{ this.$numeral(evidFileSize).format('00') }}<i class="far fa-file-alt"></i></span>
                    </div>
                </div>
            </div>
        </div>
        <!--//파일업로드-->

        <!--팝업-->
        <!-- <b-modal :active.sync="showVendorModal1" has-modal-card @receive="receiveVendor1">
            <vendor :param="form.evdCustNm" :slipTypeCd="slipTypeCd"></vendor>
        </b-modal> -->
        <!-- <b-modal :active.sync="showVendorModal2" has-modal-card @receive="receiveVendor2">
            <vendor :param="form.payCustNm" :slipTypeCd="slipTypeCd"></vendor>
        </b-modal> -->
        <!-- <b-modal :active.sync="showCctrModal" has-modal-card @receive="receiveCctr">
            <cctr :param="form.baseDeptNm"></cctr>
            <cctr :param="form.baseDeptNm"></cctr>
        </b-modal> -->
        <!--//팝업 -->
    </div>

</template>

<script>
    /* eslint-disable */
    import mixin from '@/mixin';
    import mixinSlip from '@/mixin/slip';
    import _ from 'lodash'
    // PopUp
    //import Vendor from '@/components/Vendor.vue';
    import Vendor from '@/components/Vendor_Ag.vue';
    import Prepay from '@/components/Prepay.vue';
    import Account from '@/components/Account.vue';
    import ElecTaxPopup from '@/components/ElecTaxPopup.vue';
    // import Cctr from '@/components/Cctr.vue';
    // import Cctr from '@/components/ErpCctr_new.vue';
    import Cctr from '@/components/ErpCctr_Ag.vue';
    import SlipGrid from '@/components/SlipGrid.vue';
    import EvidAtchPop from '@/components/EvidAtchPop.vue'
    import WingsAtchPop from '@/components/WingsAtchPop.vue'
    import NumberInput from '@/components/NumberInput.vue'

    export default {
        name: 'SlipBasic',

        props: {
            slipTypeCd: {
                type: String,
                required: false
            },
            slipHeader: {
                type: Object,
                required: false
            },
            slipDetails: {
                type: Array,
                required: false
            },
            readonly: {
                type: Boolean,
                required: false,
                default: false
            },
            showEvidAtchPop: {
                type: Boolean,
                required: false,
                default: true
            }
        },

        //props: ['slipTypeCd','slipHeader','slipDetails'],
        mixins: [mixin, mixinSlip],
        components: {Vendor, Account, Cctr, SlipGrid, NumberInput},
        data() {
            return {
                title: '기본정보',
                evdTypes: [],
                taxes: [],
                payTerms: [],
                vendAccts: [],
                bizPlaces: [],
                accounts: [],
                test:'0', //지급조건에 따른 지급예정일 활성화를 위한 변수
                form: {
                    // 전표상태코드
                    slipStatCd: '10',
                    // 증빙유형코드
                    evdTypeCd: '',
                    // 선급금신청구분코드
                    aplFgCd: 'N',
                    // 정산구분코드
                    stlFgCd: 'N',
                    // 시스템구분코드WM
                    sysFgCd: 'W',
                    // 세금코드
                    taxCd: '',
                    // 증빙일자
                    evdDt: this.$moment().format('YYYY-MM-DD'),
                    // 전표일자
                    postDt: this.$moment().format('YYYY-MM-DD'),
                    // 증빙거래처코드
                    evdCustCd: '',
                    // 증빙거래처명
                    evdCustNm: '',
                    // 증빙거래처사업자번호
                    evdCustBizNo: '',
                    // 지급거래처코드
                    payCustCd: '',
                    // 지급거래처명
                    payCustNm: '',
                    // 지급거래처사업자번호
                    payCustBizNo: '',
                    // 지급방법
                    payMthdCd: '',
                    // 지급조건
                    payTermCd: '',
                    // 지급만기일(지급예정일)
                    payDueDt: '',
                    //지급비고란,
                    payText: '',
                    // 거래처계좌번호
                    custAcctNo: '',
                    // 거래처계좌은행코드
                    custBnkCd: '',
                    // 작성일시
                    wrtDtm: '',
                    // 작성자
                    wrtId: '',
                    // 작성부서코드
                    wrtDeptCd: '',
                    // 기준부서코드
                    baseDeptCd: '',
                    // 기준부서명
                    baseDeptNm: '',
                    // 미지급계정코드
                    apAcctCd: '',
                    // 대표계정코드
                    stnAcctCd: '',
                    // 공급가액
                    supAmt: '',
                    // 부가세액
                    vatAmt: '',
                    // 기타금액
                    etcAmt: '',
                    // 총금액
                    totAmt: '',
                    // 통화코드
                    curCd: 'KRW',
                    // 사업장코드
                    bpCd: '',
                    // 전표적요
                    hdSgtxt: '',
                    //선급금정산No
                    advReqSlipNo: '',
                    //선급금정산 반제금액
                    advReqSlipAmt: 0,
                    //카드번호
                    crdNo: undefined,
                    baseVatAmt: '',
                    baseSupAmt: ''
                },
                evidFileSize: 0,
                wingsFileSize: 0,
                viewMode: false,
                showVendorModal1: false,
                showVendorModal2: false,
                showCctrModal: false,
                hideEvdType: false,
                hideEvdDt: false,
                hideSupAmt: false,
                hideVatAmt: false,
                hideEtcAmt: false,
                hideCrdNo: false,
                tempData: [],
                disableEvdDt: false,
                objectPopup: null
            };
        },
        methods: {
            // 증빙유형
            getEvdTypeCombo() {
                this.$http.get(`/api/code/combo`, {params: {groupCd: "EVD_TYPE_CD", remark1: this.slipTypeCd}})
                    .then(response => {
                        this.evdTypes = response.data;
                        this.selectOne({data: this.evdTypes, target: 'evdTypeCd'});
                    });
            },
            // 세금코드
            getTaxCombo(view) {
                // viewMode가 false인 경우에만, selectOne이 동작함
                if (view != undefined) this.viewMode = view;

                this.$http.get(`/api/taxes`, {params: {evdTypeCd: this.form.evdTypeCd}})
                    .then(response => {
                        this.taxes = response.data;

                        if(this.slipTypeCd === "E4" && !this.viewMode){
                          //수기계산서 신규작성 default 
                          this.form.taxCd = "L"
                        }else{
                          this.selectOne({data: this.taxes, target: 'taxCd', key: 'taxCd'});
                        }
                        this.setVatDisabled();
                    });
            },
            // 지급조건
            getPayTermCombo() {
                this.$http.get(`/api/code/detail`, {params: {groupCd: "PAY_TERM_CD", remark3: this.form.evdTypeCd}})
                    .then(response => {
                        this.payTerms = response.data;
                        this.selectOne({data: this.payTerms, target: 'payTermCd', key: 'detailCd'});
                    });
            },
            getVendorAccountCombo(value) {
                var accValue = this.custAccount.split('|')

                this.$http.get(`/api/vendor/account/${value}`)
                    .then(response => {
                        var list = response.data
                        this.vendAccts = list;

                        if (this.vendAccts.length > 0) {
                            for(var i=0; i<list.length; i++){
                                if(accValue[1] === list[i].acctNo){
                                    this.form.custBnkCd = accValue[0];
                                    this.form.custAcctNo = accValue[1];
                                    break;
                                }else{
                                    this.form.custBnkCd = list[0].bnkCd;
                                    this.form.custAcctNo = list[0].acctNo;
                                }
                            }
                        } else {
                            this.form.custBnkCd = '';
                            this.form.custAcctNo = '';
                        }

                        this.$emit('changeAccount', this.form)
                    });
            },
            // 사업장
            getBizPlaceCombo() {
                this.$http.get(`/api/bp/combo`)
                    .then(response => {
                        this.bizPlaces = response.data;
                        this.selectOne({data: this.bizPlaces, target: 'bpCd'});
                    });
            },
            // 대변계정
            getAccountCombo() {
                this.$http.get('/api/account/liabilities')
                    .then(response => {
                        this.accounts = response.data;
                        this.selectOne({data: this.accounts, target: 'apAcctCd'});
                        this.selectOne({data: this.accounts, target: 'apAcctNm', key: 'value'});
                    });
            },
            changeCreditAccount(event) {
                this.form.apAcctNm = $(event.target).children("option:selected").attr("name");
            },
            changeVendorAccount(value) {
                const valueArr = value.split("|");
                if (valueArr.length === 2) {
                    this.form.custBnkCd = valueArr[0];
                    this.form.custAcctNo = valueArr[1];
                }
            },
            popVendor1() {
                const that = this;

                this.$modal.open({
                    component: Vendor,
                    parent: this,
                    props: {
                        param: this.form.evdCustNm, 
                        slipTypeCd: this.slipTypeCd,
                    },
                    width: 700,
                    events: {
                        close(obj) {
                            that.form.evdCustCd = obj.vendCd;
                            that.form.evdCustNm = obj.vendNm;
                            that.form.evdCustBizNo = obj.bizNo;
                            // that.form.apAcctCd = obj.apAcctCd;
                            // that.form.apAcctNm = obj.apAcctNm;
                            // that.form.payTermCd = obj.payTermCd;

                            // that.changeEvdCustCd(obj.vendCd);
                        }
                    }
                });

            },
            popVendor2() {
                const that = this;

                this.$modal.open({
                    component: Vendor,
                    parent: this,
                    props: {
                        param: this.form.payCustNm, 
                        slipTypeCd: 'E2',
                    },
                    width: 700,
                    events: {
                        close(obj) {
                            that.form.payCustCd = obj.vendCd;
                            that.form.payCustNm = obj.vendNm;
                            that.form.payCustBizNo = obj.bizNo;
                            // that.form.apAcctCd = obj.apAcctCd;
                            // that.form.apAcctNm = obj.apAcctNm;
                            // that.form.payTermCd = obj.payTermCd;
                        }
                    }
                });
            },
            popCctr(clear) {
                const that = this;

                this.$modal.open({
                    component: Cctr,
                    parent: this,
                    props: {
                        searchStr: this.form.baseDeptNm
                    },
                    width: 700,
                    events: {
                        close(obj) {
                            that.form.baseDeptCd = obj.deptCd;
                            that.form.baseDeptNm = obj.deptNm;
                        }
                    }
                });
            },
            initVendor1(force) {
                if (force === true) this.form.evdCustNm = '';
                if (this.form.evdCustNm === '') {
                    this.form.evdCustCd = '';
                    this.form.evdCustBizNo = '';
                    this.form.apAcctCd = this.accounts[0].key
                    this.form.apAcctNm = this.accounts[0].value
                }
            },
            initVendor2(force) {
                if (force === true) this.form.payCustNm = '';
                if (this.form.payCustNm === '') {
                    this.form.payCustCd = '';
                    this.form.payCustBizNo = '';
                    this.form.apAcctCd = this.accounts[0].key
                    this.form.apAcctNm = this.accounts[0].value
                }
            },
            initCctr(force) {
                if (force === true) this.form.baseDeptNm = '';
                if (this.form.baseDeptNm === '') this.form.baseDeptCd = '';
            },
            checkActual(event) {
                if ($(event.target).is(":checked")) {
                    $(".actual").attr("disabled", false);
                    this.getVendorAccountCombo(this.form.payCustCd);
                } else {
                    $(".actual").attr("disabled", true);
                    this.initVendor2(true);
                    this.getVendorAccountCombo(this.form.evdCustCd);
                }
            },
            selectOne(o) {
                if (o && o.data.length > 0) {
                    // 등록 시 기본값 셋팅
                    if (!this.viewMode) {
                        this.form[o.target] = (o.key) ? o.data[0][o.key] : o.data[0].key;
                    }
                }
            },
            showWritedRow() {
                // if (String(this.form.grSlipNo||'').match(/^EA.*$/g) && this.form.slipStatCd === '10') {
                //     $("#basic tr:lt(2)").show();
                // } else {
                //     $("#basic tr:lt(2)").hide();
                // }
            },
            setDept(cd, nm) {
                this.form.baseDeptCd = cd;
                this.form.baseDeptNm = nm;
            },
            setCreditAccount(cd, nm) {
                this.form.apAcctCd = cd;
                this.form.apAcctNm = nm;
            },
            setHdSgtxt(txt) {
                this.form.hdSgtxt = txt;
            },
            calcVatAmt() {

                //전자세금계산서 부가세액은 계산없이 그대로 값을 가져온다 2021.02.23
                if(this.slipTypeCd !== 'E3'){
                    const item = this.taxes.find(e => e.taxCd === this.form.taxCd);
                    if (item) {
                        // if(item.taxCd === '10001') {
                        if(item.taxRt > 0) {
                            const supAmt = this.$numeral(this.form.supAmt).value()
                            const vatAmt = this.$numeral(this.form.vatAmt).value()
                            const totAmt = this.$numeral(this.form.totAmt).value()
                            const calcVatAmt = Math.floor((supAmt / item.taxRt)) / 10 * 10;
                            if(this.$numeral(supAmt + vatAmt).value() === this.$numeral(totAmt).value()){
                              return
                            }else{
                              if(this.taxes.filter(x=> x.taxCd === this.form.taxCd)[0].taxNm.includes('불공제')){
                                  this.form.vatAmt = 0
                              }else{
                                  this.form.vatAmt = this.$numeral(calcVatAmt).value()
                              }
                            }
                        }
                    }
                }
            },
            validation() {
                
                const header = JSON.parse(JSON.stringify(this.form));
                const stripFields = ['evdDt', 'postDt', 'payDueDt', 'supAmt', 'vatAmt', 'etcAmt', 'totAmt'];
                
                _.forEach(stripFields, (name) => header[name] = this.toPure(header[name]));

                if (!header.evdTypeCd) {
                    this.$swal({type: 'warning', text: '증빙유형을 선택해 주세요.'});
                    return false;
                }
                
                if (header.stlFgCd === 'K') {
                    if(header.advReqSlipAmt === 0) {
                        this.$swal({type: 'warning', text: '선급금정산 금액이 없습니다.'});
                        return false;
                    }
                }
                if (!header.evdDt) {
                    this.$swal({type: 'warning', text: '증빙일자를 입력해 주세요.'});
                    return false;
                }
                if (!header.postDt) {
                    this.$swal({type: 'warning', text: '회계일자를 입력해 주세요.'});
                    return false;
                }
                if (!header.evdCustCd) {
                    this.$swal({type: 'warning', text: '거래처를 선택해 주세요.'});
                    return false;
                }
                if (_.toInteger(header.supAmt) == 0) {
                    this.$swal({type: 'warning', text: '공급가액을 입력해 주세요.'});
                    return false;
                }
                if (!header.baseDeptCd) {
                    this.$swal({type: 'warning', text: '기준부서를 선택해 주세요.'});
                    return false;
                }
                if (!header.payDueDt) {
                    this.$swal({type: 'warning', text: '지급예정일을 입력해 주세요.'});
                    return false;
                }
                //   if(!header.custAcctNo)  { this.$swal({ type: 'warning', text: '지급계좌를 선택해 주세요.' }); return false; }
                if (!header.bpCd) {
                    this.$swal({type: 'warning', text: '사업장을 선택해 주세요.'});
                    return false;
                }
                if (!header.hdSgtxt) {
                    this.$swal({type: 'warning', text: '적요를 입력해 주세요.'});
                    return false;
                }
                
                if (!this.$refs.detail.validation()) return false;

                return true;
            },
            setVatDisabled() {
                const tax = this.taxes.find(x => x.taxCd == this.form.taxCd);
                if (tax && tax.taxRt === 0) {
                    this.setHideVat(true);
                } else {
                    this.setHideVat(false);
                    this.calcVatAmt();
                }
            },
            setHideVat(hide) {
                this.hideVatAmt = hide;
            },
            setHideCrdNo(hide) {
                this.hideCrdNo = hide;
            },
            
            setPayDueDt(value) {
                if (value) {
                    const obj = this.payTerms.find(x => x.detailCd === value);
                    if (obj) {
                        const m = parseInt(obj.remark1, 10);
                        const d = parseInt(obj.remark2, 10);

                        if (m === 0 && d===0) {
                            this.form.payDueDt = '';
                            this.test='';
                        } else {
                            let dt = this.$moment().add(m, 'month');

                            if (this.form.evdDt) dt = this.$moment(this.form.evdDt).add(m, 'month');

                            if (d === 31) {
                                dt = this.$moment(dt).endOf('month');
                            } else {
                                dt = this.$moment(dt).date(d);
                            }
                            this.form.payDueDt = dt.format('YYYY-MM-DD');
                            this.test='0';
                        }
                    }
                }
            },
            calendarLoad() {
                // 증빙일자 (증빙일자 기준 분기 벗어나지 않게 설정)
                const iljinCalendar1 = new dhtmlXCalendarObject('calEvdDt');
                iljinCalendar1.setDate(new Date());
                iljinCalendar1.hideTime();
                iljinCalendar1.attachEvent('onChange', (v) => {
                    let postQuarter = this.$moment(this.$refs.calPostDt.getFormatedDate()).quarter()
                    let postYear = this.$moment(this.$refs.calPostDt.getFormatedDate()).year()
                    let evdQuarter = this.$moment(this.$refs.calEvdDt.getFormatedDate()).quarter()
                    let evdYear = this.$moment(this.$refs.calEvdDt.getFormatedDate()).year()

                    if(!(evdQuarter === postQuarter) || !(evdYear === postYear)) {
                        this.$refs.calPostDt.setFormatedDate("%Y-%m-%d", this.$refs.calEvdDt.getFormatedDate())
                        this.form.postDt = this.$refs.calPostDt.getFormatedDate();
                    }

                    this.form.evdDt = this.$refs.calEvdDt.getFormatedDate();
                    this.form.postDt = this.$refs.calEvdDt.getFormatedDate()
                    this.setPayDueDt(this.form.payTermCd);
                    this.$forceUpdate()
                });
                iljinCalendar1.attachEvent("onButtonClick", (d) => {
                    if (d === null) {
                        let postQuarter = this.$moment(this.$refs.calPostDt.getFormatedDate()).quarter()
                        let postYear = this.$moment(this.$refs.calPostDt.getFormatedDate()).year()
                        let evdQuarter = this.$moment(this.$refs.calEvdDt.getFormatedDate()).quarter()
                        let evdYear = this.$moment(this.$refs.calEvdDt.getFormatedDate()).year()
                        
                        if(!(evdQuarter === postQuarter) || !(evdYear === postYear)) {
                            this.$refs.calPostDt.setFormatedDate("%Y-%m-%d", this.$refs.calEvdDt.getFormatedDate())
                            this.form.postDt = this.$refs.calPostDt.getFormatedDate();
                                
                        }
                        this.form.evdDt = this.$refs.calEvdDt.getFormatedDate()
                        this.$forceUpdate()
                    }
                });
                this.$refs.calEvdDt = iljinCalendar1;

                // 전표일자 (증빙일자 기준 분기 벗어나지 않게 설정)
                const iljinCalendar2 = new dhtmlXCalendarObject('calPostDt');
                iljinCalendar2.setDate(new Date());
                iljinCalendar2.hideTime();
                iljinCalendar2.attachEvent('onChange', (v) => {
                    let postQuarter = this.$moment(this.$refs.calPostDt.getFormatedDate()).quarter()
                    let postYear = this.$moment(this.$refs.calPostDt.getFormatedDate()).year()
                    let evdQuarter = this.$moment(this.form.evdDt).quarter()
                    let evdYear = this.$moment(this.form.evdDt).year()
                    
                    if(!(postQuarter === evdQuarter) || !(postYear === evdYear)) {//
                        this.$refs.calPostDt.setFormatedDate("%Y-%m-%d", this.form.evdDt)
                    }
                    setTimeout(() => {
                        this.form.postDt = this.$refs.calPostDt.getFormatedDate()
                        this.$forceUpdate()
                    }, 100)
                    
                });
                iljinCalendar2.attachEvent("onButtonClick", (d) => {
                    if (d === null) {
                        let postQuarter = this.$moment(this.$refs.calPostDt.getFormatedDate()).quarter()
                        let postYear = this.$moment(this.$refs.calPostDt.getFormatedDate()).year()
                        let evdQuarter = this.$moment(this.$refs.calEvdDt.getFormatedDate()).quarter()
                        let evdYear = this.$moment(this.$refs.calEvdDt.getFormatedDate()).year()
                        
                        if(!(postQuarter === evdQuarter) || !(postYear === evdYear)) {
                            this.$refs.calPostDt.setFormatedDate("%Y-%m-%d", this.$refs.calEvdDt.getFormatedDate())
                            this.$forceUpdate()
                        }
                        this.form.postDt = this.$refs.calPostDt.getFormatedDate()
                    }
                });
                this.$refs.calPostDt = iljinCalendar2;

                // 지급예정일
                const iljinCalendar3 = new dhtmlXCalendarObject('calPayDueDt');
                iljinCalendar3.setDate(new Date());
                iljinCalendar3.hideTime();
                iljinCalendar3.attachEvent('onChange', (v) => {
                    this.form.payDueDt = this.$refs.calPayDueDt.getFormatedDate()
                });
                iljinCalendar3.attachEvent("onButtonClick", (d) => {
                    if (d === null) {
                        this.form.payDueDt = this.$refs.calPayDueDt.getFormatedDate()
                    }
                });
                this.$refs.calPayDueDt = iljinCalendar3;
            },
            checkVendorInfo() {
                this.form.evdCustId = '';
                this.form.evdCustNm = '';

                let url = `/api/vendor/${this.slipTypeCd}/${this.form.evdCustBizNo}`

                if(this.slipTypeCd === 'E3' || this.slipTypeCd === 'E4' ) url = `/api/vendor/E2/${this.form.evdCustBizNo}`

                this.$http.get(url)
                    .then(({data}) => {
                        if (data && data.length > 0) {
                            this.form.evdCustId = data[0].vendCd;
                            this.form.evdCustNm = data[0].vendNm;
                            this.form.evdCustBizNo = data[0].bizNo;
                        }
                    });
            },
            checkTrustedInfo() {
                this.form.payCustCd = '';
                this.form.payCustNm = '';
                
                let url = `/api/vendor/${this.slipTypeCd}/${this.form.payCustBizNo}`

                if(this.slipTypeCd === 'E3' || this.slipTypeCd === 'E4' ) url = `/api/vendor/E2/${this.form.payCustBizNo}`

                this.$http.get(url)
                    .then(({data}) => {
                        if (data && data.length > 0) {
                            this.form.payCustCd = data[0].vendCd;
                            this.form.payCustNm = data[0].vendNm;
                            this.form.payCustBizNo = data[0].bizNo;
                            $("#payCust").prop("checked", true);
                        }
                    });
            },
            setFieldDisabled() {
                this.hideEvdType = true;
                this.hideEvdDt = true;
                this.hideSupAmt = true;
                this.hideVatAmt = true;
                if(this.slipTypeCd === 'E3') {
                  this.hideEtcAmt = false;
                } else {
                  this.hideEtcAmt = true;
                }
                
            },
            setPostDtDisabled(){
              if(this.hideEvdDt || this.form.grSlipNo.substr(0,2)==='GR' ){
                this.disableEvdDt = true;
              }else{
                this.disableEvdDt = false;
              }
            },
            changePostDt(){
                this.form.evdDt = this.form.postDt
            },
            setSlipHeader() {
                Object.assign(this.form, this.slipHeader);

                if(this.slipHeader.oriVatAmt === undefined){
                    this.form.baseVatAmt = this.slipHeader.vatAmt
                }else{
                    this.form.baseVatAmt = this.slipHeader.oriVatAmt
                }

                if(this.slipHeader.oriVatAmt === undefined){
                    this.form.baseSupAmt = this.slipHeader.supAmt
                }else{
                    this.form.baseSupAmt = this.slipHeader.oriSupAmt
                }

                if(this.slipHeader.oriTotAmt === undefined){
                    this.form.baseTotAmt = this.slipHeader.totAmt
                }else{
                    this.form.baseTotAmt = this.slipHeader.oriTotAmt
                }
                

                //전자(E3)에서 일반계산서내역은 영세율처리
                if(this.slipHeader.dtiType) {
                    this.$http.post(`/api/code/detail/search`, {detailCd: this.slipHeader.dtiType})
                        .then(response => {
                            this.form.evdTypeCd = response.data.remark1
                        });
                }
                // format date
                if (this.form.evdDt) this.form.evdDt = this.$moment(this.form.evdDt).format('YYYY-MM-DD');
                if (this.form.postDt) this.form.postDt = this.$moment(this.form.postDt).format('YYYY-MM-DD');
                if (this.form.payDueDt) this.form.payDueDt = this.$moment(this.form.payDueDt).format('YYYY-MM-DD');
                this.setPostDtDisabled();
                if (this.form.payCustBizNo !== '') this.checkTrustedInfo();

                if (this.slipTypeCd === 'E3') {
                    setTimeout(() => {
                        // 거래처 검증
                        this.checkVendorInfo();
                        // 입력항목 비활성화
                        this.setFieldDisabled();
    
                        if (this.form.eaSlipNo !== undefined) {
                            this.viewMode = true;
                            this.$emit("changeViewMode", this.viewMode);
                            this.showWritedRow();
                        }
                    }, 200)

                } else {
                    // 증빙일자
                    this.evdDt = this.$moment().format('YYYY-MM-DD');

                    this.viewMode = true;
                    this.$emit("changeViewMode", this.viewMode);
                    this.showWritedRow();
                }

                if (this.form.grSlipNo) {
                    this.queryWingsFile(this.form.grSlipNo)
                } else {
                    this.$http.get('/api/tmp/documentMngNo')
                        .then(response => {
                        this.form.grSlipNo = response.data
                        this.queryWingsFile(this.form.grSlipNo)
                    })
                }
                this.queryEvidFile(this.form.eaSlipNo)
            },
            queryEvidFile() {
                /**
                 * 증빙파일이 얼마나 첨부되었는지 확인해보자
                 */
                this.$http.get(`/api/evid/fileList/${this.form.eaSlipNo}`)
                    .then(response => {
                        this.evidFileSize = this.form.eaSlipNo ? ((response.data || {}).aFiles || []).length : 0
                    })
            },
            queryWingsFile() {
                /**
                 * Wings파일이 얼마나 첨부되었는지 확인해보자
                 */
                this.$http.get(`/api/wings/document/${this.form.grSlipNo}`)
                    .then(response => {
                        this.wingsFileSize = response.data.length
                    })
            },
            openUploadEvidencePopup() {

                let rdoCtrl = true
                let readonly = true
                
                // 전표작성단계가 아니면 수정불가
                if(this.form.slipStatCd !== '10') {
                    readonly = true
                    rdoCtrl = true
                } else {
                    readonly = false
                    rdoCtrl = false
                }

                //예외1
                if(this.$store.state.loginInfo.authorities[0].roleSelectCd === '10' && this.form.slipStatCd < '65'){
                    readonly = false
                    rdoCtrl = false
                }                

                let vm = this

                let url = '/evidAtchPopModeless?docMngNo=' + this.form.eaSlipNo + '&readonly='+ readonly + '&readonlyCtrl='+ rdoCtrl;

                if(!(!this.objectPopup || this.objectPopup.closed)){
                  this.objectPopup.focus();
                }else{
                    this.objectPopup = window.open(url, '_blank', 'toolbar=0,location=0,menubar=0,resizable=yes');
                }

                //팝업 Close Callback                
                //브라우저 체크(IE 체크)
                var agent = navigator.userAgent.toLowerCase();    
                
                if ((navigator.appName == 'Netscape' && navigator.userAgent.search('Trident') != -1) || (agent.indexOf("msie") != -1)){
                    this.objectPopup.attachEvent("onunload",function(){
                        vm.evidFileSize = localStorage.getItem("popFileCnt");
                    });
                }else{
                  this.objectPopup.onbeforeunload = function(){
                        vm.evidFileSize = localStorage.getItem("popFileCnt");
                    };
                }

            },
          openUploadWingsPopup(){
            const vm = this;
            if(this.$parent.copy !== undefined && this.$parent.copy && this.tempData.length == 0){
              this.$store.commit('loading');
              this.$http.get(`/api/wings/document/${this.$parent.grSlipNo}`)
                  .then(response => {
                    if(response.data) {
                      this.tempData = response.data
                      this.tempData.forEach(x => {
                        x.grSlipNo = this.form.grSlipNo
                        delete x.documentId
                      })
                    }
                    vm.openUploadWingsPopup2()
                  }).catch(response => {

              }).finally(() => {
                this.$store.commit('finish');
              })
            }else{
              this.openUploadWingsPopup2()
            }
          },
          openUploadWingsPopup2(){
            var chkReadOnly = this.isReadonly

            // if(this.$store.state.loginInfo.loginDeptCd === this.form.wrtDept){
            //   if(this.form.slipStatCd === '20' || this.form.slipStatCd === '30' || this.form.slipStatCd === '50'){
            //     chkReadOnly = false
            //   }
            // }

            // 전표작성단계가 아니면 수정불가
            if(this.form.slipStatCd !== '10') {
                chkReadOnly = true
            } else {
                chkReadOnly = false
            }

            //예외1
            if(this.$store.state.loginInfo.authorities[0].roleSelectCd === '10' && this.form.slipStatCd < '65'){
                chkReadOnly = false
            }

            let vm = this
            this.$modal.open({
              component: WingsAtchPop,
              props: {
                grSlipNo: this.form.grSlipNo,
                readonly: chkReadOnly, // Check readonly
                slipDetail: this.tempData
              },
              parent: this,
              width: 1200,
              events: {
                close(value) {
                  vm.wingsFileSize = value.length
                }
              }
            })
          },
            initAdvReq() {
                this.form.advReqSlipNo = '';
                this.form.advReqSlipAmt = 0;
            },
            openPopLayer() {
                if(this.form.evdCustCd) {
                    let payCustCd = this.form.evdCustCd
                    if(this.form.stlFgCd === "K") {
                        let totAmt = this.$numeral(this.totAmt).value();
                        if(totAmt > 0) {
                            let vm = this
                            this.$modal.open({
                                component: Prepay,
                                props: {
                                    totAmt,
                                    payCustCd
                                },
                                parent: this,
                                events: {
                                    close(data) {
                                        vm.form.advReqSlipNo = data.preInvoiceNum
                                        vm.form.advReqSlipAmt = data.mrAmt
                                    }
                                }
                            })
                        } else {
                        this.$swal({type: 'warning', text: '총금액이 0보다 작습니다.'});
                        }
                    }else {
                        this.$swal({type: 'warning', text: '미정산 구분 입니다.'});
                    }
                } else {
                    this.$swal({type: 'warning', text: '거래처를 선택하여 주세요.'});
                }
            },
            goEtaxPage(eTaxNo) {
                //window.open(`http://197.200.1.19:10004/addservice/view/XXSB_DTI_PRINT_VIEW_NTS.asp?issue_id=${eTaxNo}&SBTYPE=AP`, "_blank");

                this.$modal.open({
                    component: ElecTaxPopup,
                    parent: this,
                    props: {
                        eTaxNo: eTaxNo
                    }
                });
            },
            setClearHdRef8CardNo() {
                //지급여부 및 카드번호 초기화
                this.form.hdRef8 = "";
                this.form.crdNo = "";
            },
            changeTaxCd(){
                if(this.taxes.filter(x=> x.taxCd === this.form.taxCd)[0].taxNm.includes('불공제')){
                    this.form.vatAmt = 0;
                    this.form.supAmt = this.form.baseSupAmt + this.form.baseVatAmt
                }else{
                    this.form.supAmt = this.form.baseSupAmt
                    this.form.vatAmt = this.form.baseVatAmt
                }
            },
            changeEvdCustCd(value){
                
                if(value) {     //거래처 변경 시 지급조건 재설정 -> payTermCd 변경되니까 자동으로 지급예정일도 세팅됨
                    
                    let url = `/api/vendor/${this.slipTypeCd}/${value}`

                    if(this.slipTypeCd === 'E3' || this.slipTypeCd === 'E4' ) url = `/api/vendor/E2/${value}`

                    this.$http.get(url)
                    .then((result) => {
                        this.form.payTermCd = result.data[0].termsId
                        this.form.apAcctCd = result.data[0].apAcctCd
                        this.form.apAcctNm = result.data[0].apAcctNm
                    });
                }
            }
        },
        computed: {
            totAmt() {
                // let supAmt = _.parseInt(this.toPure(this.form.supAmt) || 0);
                // let vatAmt = _.parseInt(this.toPure(this.form.vatAmt) || 0);
                // let etcAmt = _.parseInt(this.toPure(this.form.etcAmt) || 0);
                let supAmt = this.$numeral(this.form.supAmt).value() || 0
                let vatAmt = this.$numeral(this.form.vatAmt).value() || 0
                let etcAmt = this.$numeral(this.form.etcAmt).value() || 0
                // return this.$filters.number(_.toString(supAmt + vatAmt + etcAmt));
                return this.$numeral(supAmt).value() + this.$numeral(vatAmt).value() + this.$numeral(etcAmt).value()
            },
            custAccount: {
                get(){
                    return this.form.custBnkCd + "|" + this.form.custAcctNo;
                },
                set(newValue){
                    return newValue
                }
                
            },
            columnTitle() {
                return this.slipTypeCd === 'E3' ? '전자승인번호' : '통화';
            }
        },
        watch: {
            slipHeader() {
                this.setSlipHeader();
            },
            'form.crdNo': function(newNumber) {
                var v = newNumber.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
                var matches = v.match(/\d{4,16}/g);
                var match = matches && matches[0] || ''
                var parts = []
                for (var i=0, len=match.length; i<len; i+=4) {
                    parts.push(match.substring(i, i+4))
                }
                if (parts.length) {
                    this.form.crdNo = parts.join(' ')
                } else {
                    this.form.crdNo = newNumber
                }

            },
            'form.evdTypeCd'() {
                this.getPayTermCombo();
                this.getTaxCombo(false);

                //지급여부 및 카드번호 초기화
                this.setClearHdRef8CardNo();
            },
            'form.evdCustCd'(value) {                
                this.getVendorAccountCombo(value);
            },
            'form.payCustCd'(value) {
                if(!_.isEmpty(value)){
                    this.getVendorAccountCombo(value);
                }else if(_.isEmpty(value)&&!_isEmpty(this.form.evdCustCd)){
                    this.getVendorAccountCombo(this.form.evdCustCd);
                }
            },
            'form.payTermCd'(value) {
                this.setPayDueDt(value);
            },
            'form.supAmt'(value) {
                this.form.supAmt = this.$numeral(value).value() || 0
                this.calcVatAmt()
                
            },
            'form.vatAmt'(value) {                
                this.form.vatAmt = this.$numeral(value).value() || 0
            },
            'form.etcAmt'(value) {
                this.form.etcAmt = this.$numeral(value).value() || 0
            },
            totAmt(value) {
                this.form.totAmt = this.$numeral(value).value() || 0
            },
            'form.aplFgCd'(value) {
                if(value === 'K') {
                    this.form.stlFgCd = 'N'
                }
            },
            'form.stlFgCd'(value) {                
                if(value === 'K') {
                    this.form.aplFgCd = 'N'
                }
                
                if(value === 'N') {
                    this.initAdvReq();
                }
            },
        },
        created() {
            if(!this.form.baseDeptCd) {
                this.$store.commit('loading')
                this.$http.get(`/api/emp/${this.$store.state.loginInfo.loginId}`)
                    .then(response => {
                        let data = response.data[0]
                        this.form.baseDeptCd = data.liabilityDeptCode
                        this.form.baseDeptNm = data.liabilityDeptName
                    })
                    .catch(() => {
                    this.$swal({
                        type: 'error',
                        text: e
                    })
                })
                .finally(() => {
                this.$store.commit('finish')
                })
            }
        },
        destroyed() {
          if(this.objectPopup !== null){
            this.objectPopup.close()
          }
        },
        mounted() {
            window.setPayDueDt = () => this.setPayDueDt(this.form.payTermCd);
            if (this.form.grSlipNo) {
                this.queryWingsFile(this.form.grSlipNo)
            } else {
                this.$http.get('/api/tmp/documentMngNo')
                    .then(response => {
                    this.form.grSlipNo = response.data
                    this.queryWingsFile(this.form.grSlipNo)
                })
            }

            if (this.form.eaSlipNo) {
                this.queryEvidFile(this.form.eaSlipNo)
            } else {
                this.$http.get('/api/tmp/documentMngNo')
                    .then(response => {
                    this.form.eaSlipNo = response.data
                    this.queryEvidFile(this.form.eaSlipNo)
                })
            }
            
            this.calendarLoad();
            this.getEvdTypeCombo();
            this.getPayTermCombo();
            this.getBizPlaceCombo();
            this.getAccountCombo();
            this.showWritedRow();

        },
    };
</script>

<style>
</style>
