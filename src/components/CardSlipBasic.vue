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
                    <tr>
                        <th>신청번호</th>
                        <td width="12%">{{form.grSlipNo}}</td>
                        <td width="8%"></td>

                        <th>전표유형</th>
                        <td>{{form.slipTypeNm}}</td>

                        <th>전표상태</th>
                        <td colspan="3"><span class="color_table_org">{{form.slipStatNm}}</span></td>
                    </tr>
                    <tr>
                        <th>작성부서</th>
                        <td>{{form.wrtDeptCd}} / {{form.wrtDeptNm}}</td>
                        <td>{{form.bpNm}}</td>

                        <th>작성자</th>
                        <td>{{form.wrtNm}}</td>

                        <th>작성일자</th>
                        <td class="Rt-M" colspan="3">{{this.$moment(form.wrtDtm).format('YYYY-MM-DD')}}</td>
                    </tr>
                    <tr>
                        <th>카드번호</th>
                        <td colspan="2">{{form.crdNo}}</td>

                        <th>승인번호</th>
                        <td>{{form.crdApprNo}}</td>

                        <th>증빙일자</th>
                        <td colspan="3">{{form.evdDt}}</td>
                    </tr>
                    <tr>
                        <th>카드소유자</th>
                        <td colspan="2">{{form.crdPssrNm}} {{form.crdPssrTitle}}</td>

                        <th>카드구분</th>
                        <td>{{form.crdFgNm}}</td>

                        <th class="tp-a">회계일자</th>
                        <td colspan="3">
                            <div class="datepicker w-type-ymd">
                                <input type="text" v-model="form.postDt" id="calPostDt" autocomplete="off" class="input" disabled>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <th>승인금액</th>
                        <td  colspan="2">
                            <input class="input Rt-M tar" type="text" v-model="form.totAmt" disabled>
                        </td>

                        <th>가맹점명</th>
                        <td>{{form.crdMerchNm}}</td>

                        <th>승인시간</th>
                        <!-- <td>{{this.$moment(form.apprDate).format("YYYY-MM-DD") + ' ' + form.apprTime}}</td> -->
                        <td v-if="form.apprDate"  colspan="3">{{apprDateTime}}</td>
                        <td v-else>&nbsp;</td>
                    </tr>
                    <tr>
                        <th>공급가액</th>
                        <td  colspan="2">
                            <input class="input Rt-M tar" type="text" v-model="form.supAmt" @keyup="calcVatAmt" disabled>
                        </td>

                        <th>가맹점주소</th>
                        <td colspan="5">{{form.merchAddr}}</td>
                    </tr>
                    <tr>
                        <th>부가세액</th>
                        <td  colspan="2">
                            <input class="input Rt-M tar" type="text" ref="vat" v-model="form.vatAmt" disabled>
                        </td>

                        <th>과세유형/업종</th>
                        <td>{{form.taxTypeNm}}/{{form.mccName}}</td>
                        <th class="tp-a">지급예정일</th> 
                        <td>
                            <div class="datepicker w-type-ymd">                            
                                <input type="text" v-model="form.payDueDt" id="calPayDueDt" autocomplete="off"
                                    class="input">
                            </div>
                        </td>
                        <th>지급비고란</th>
                        <td><input class="input" type="text" v-model="form.payText"/></td>                        

                        <!-- <th>경비처리기한</th>
                        <td>{{form.procPeriod}}</td> -->
                    </tr>
                    <tr>
                        <th>봉사료</th>
                        <td  colspan="2"> <input class="input  Rt-M tar" type="text" v-model="form.tips" disabled> </td>

                        <th>세금코드</th>
                        <td> 
                            <span v-for="item in vatList" :key="item.taxCd">
                                <input type="radio" name="taxCd" 
                                    :id="'rdo'+item.taxCd" 
                                    :value="item.taxCd" 
                                    v-model="form.taxCd"
                                    @change="changeTaxCd" />
                                <label :for="'rdo'+item.taxCd">{{item.taxNm}}</label>
                            </span>                            
                        </td>
                        <th class="tp-a">기준부서</th>
                        <td  colspan="3">
                            <div class="td-s-thumb search-area">
                                <input class="input input-bg mr5 Rt-M rs-mt2" type="text" v-model="form.baseDeptCd" style="width:105px;" disabled>
                                <div class="ip-box rs-mt2">
                                    <input class="input" type="text" v-model="form.baseDeptNm" @input="initCctr" @keypress.enter="popCctr">
                                    <button class="icon is-right" @click="popCctr(true)"><i class="fas fa-search"></i></button>
                                </div>
                                <button class="remove_text trash-input rs-mb2" @click="initCctr(true)"><i class="far fa-trash-alt"></i></button>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <th class="tp-a"> 적요</th>
                        <td  colspan="8"> <input class="input" type="text" v-model="form.hdSgtxt" ></td>
                    </tr>
                </tbody>
            </table>
        </div>

        <slip-grid ref="detail" :slipDetails="slipDetails" :form="form"/>

        <!--파일업로드-->
        <div class="file-upload">
            <div class="table-name">
            <h3 class="ico_table_name">파일보기</h3>
            </div>
            <!-- 20190520 퍼블수정 -->
            <div class="file has-name">
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
                        <span class="file-label">증빙첨부</span>
                        <span class="icon-bar"><img src="/img/bar.png" alt="" /></span>
                        </span>
                        <span class="file-name">{{ this.$numeral(evidFileSize).format('00') }}<i class="far fa-file-alt"></i></span>
                    </div>
                </div>
            </div>
            <!-- //20190520 퍼블수정 -->
        </div>
        <!--//파일업로드-->

        <!--팝업-->
        <b-modal :active.sync="showCctrModal" has-modal-card @receive="receiveCctr">
            <cctr :param="form.baseDeptNm"></cctr>
        </b-modal>
        <!--//팝업 -->
    </div>

</template>

<script>
/* eslint-disable */
// import moment from 'moment'
import mixin from '@/mixin';
import mixinSlip from '@/mixin/slip';
import _ from 'lodash'
// PopUp
import Cctr from '@/components/ErpCctr_Ag.vue';
import SlipGrid from '@/components/CardSlipGrid.vue';
import EvidAtchPop from '@/components/EvidAtchPop.vue'
import WingsAtchPop from '@/components/WingsAtchPop.vue'

export default {
  name: 'CardSlipBasic',
  props: ['slipTypeCd','slipHeader','slipDetails'],
  mixins: [ mixin, mixinSlip ],
  components: { Cctr, SlipGrid },
  data() {
    return {
      title: '기본정보',
      taxes: [],
      vatList: [],
      rcps: [],
      ndctMccNames: '',
      form: {
        // 전표유형
        slipTypeNm: '',
        // 전표상태
        slipStatNm: '',
        // 작성부서
        wrtDeptCd: '',
        wrtDeptNm: '',
        // 작성자
        wrtNm: '',
        // 작성일자
        wrtDtm: '',
        // 카드번호 
        crdNo: '',
        // 승인번호 
        crdApprNo: '',
        // 증빙일자 
        evdDt: '',
        // 카드소유주ID 
        crdPssrId: '',
        crdPssrNm: '',
        crdPssrTitle: '',
        // 카드구분 
        crdFgCd: '',
        crdFgNm: '',
        // 회계일자
        postDt: this.$moment().format('YYYY-MM-DD'),
        // 승인금액
        // purchTot: '',
        totAmt: '',
        // 가맹점명 
        crdMerchNm: '',
        // 승인일자 
        apprDate: '',
        // 승인시각 
        apprTime: '',
        // 가맹점주소
        merchAddr: '',
        // 과세유형
        taxTypeNm: '',
        // 업종
        mccName: '',
        // 공급가액 
        // apprAmt: '',
        supAmt: '',
        // 부가세액 
        // vat: '',
        vatAmt: '',
        // 봉사료 
        tips: '',
        // 경비처리기한 
        procPeriod: '',
        // 공제구분 
        crdDdctCd: '',
        // 기준부서
        baseDeptCd: '',
        baseDeptNm: '',
        // 적요
        hdSgtxt: '',
        /* 내부설정사항 */
        // 전표유형
        slipTypeCd: 'E1',
        // 전표상태코드 
        slipStatCd: '10',
        // 증빙유형코드 
        evdTypeCd: '12',
        // 세금코드 
        taxCd: '',
        // 정산구분코드 
        stlFgCd: 'N',
        // 시스템구분코드WM 
        sysFgCd: 'W',
        // 지급조건 
        payTermCd: '',
        // 지급만기일(지급예정일) 
        payDueDt: this.$moment().format('YYYY-MM-DD'),
        //지급비고란,
        payText: '',        
        // 거래처계좌번호 
        custAcctNo: '',
        // 거래처계좌은행코드 
        custBnkCd: '',
        // 통화코드 
        curCd: 'KRW',
        // 사업장코드 
        bpCd: '',
        length: ''
      },
      viewMode: false,
      showCctrModal: false,
      hideSupAmt: true,
      hideVatAmt: true,
      evidFileSize: 0,
      wingsFileSize: 0,
      cardTaxCd: '',
      tempData: [],
      objectPopup: null
    };
  },
  methods: {
    getTaxCombo() {
        this.$http.get(`/api/taxes`, { params: {evdTypeCd: this.form.evdTypeCd} })
            .then(response => {
                this.taxes = response.data;
            });
    },
    
    getRcpAccounts() {
        this.$http.get(`/api/account/rcp`)
            .then(response => {
                this.rcps = response.data;
            });
    },
    getNdctMccName() {
        this.$http.get(`/api/code/detail`, { params: {groupCd: "NDCT_MCC_NAME"} })
            .then(({data}) => {
                if(data && data.length > 0)
                    this.ndctMccNames = data[0].remark1;
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
    receiveCctr(obj) {
        this.form.baseDeptCd = obj.cctrCd;
        this.form.baseDeptNm = obj.cctrNm;
    },
    initCctr(force) {
        if(force===true) this.form.baseDeptNm = '';
        if(this.form.baseDeptNm === '') this.form.baseDeptCd = '';
    },
    selectOne(o) {
        if(o && o.data.length > 0) {
            // 등록 시 기본값 셋팅
            if(!this.viewMode) {
                this.form[o.target] = (o.key) ? o.data[0][o.key] : o.data[0].key;
            }
        }
    },
    showWritedRow() {
        if(this.form.eaSlipNo != undefined && this.form.slipStatCd === '10') {
            $("#basic tr:lt(2)").show();
        } else {
            $("#basic tr:lt(2)").hide();
        }
    },
    calcVatAmt() {
        const item = this.taxes.find(e => e.taxCd === this.form.taxCd);
        if(item) {
            const supAmt = _.toInteger(this.toPure(this.form.supAmt));
            const vatAmt = Math.floor((supAmt/item.taxRt)/10)*10;
            this.form.vatAmt = this.$filters.number(vatAmt+'');
        }
    },
    validation() {
        
      const header = JSON.parse(JSON.stringify(this.form));
      const stripFields = ['evdDt','postDt','supAmt','vatAmt'];
      _.forEach(stripFields, (name) => header[name] = this.toPure(header[name]));

      if(!header.postDt)    { this.$swal({ type: 'warning', text: '회계일자를 입력해 주세요.' }); return false; }
      if(!header.baseDeptCd)  { this.$swal({ type: 'warning', text: '기준부서를 선택해 주세요.' }); return false; }
      if(!header.hdSgtxt)    { this.$swal({ type: 'warning', text: '적요를 입력해 주세요.' }); return false; }
      
      if(!this.$refs.detail.validation()) return false;

      return true;
    },
    setHideSup(hide) {
        this.hideSupAmt = hide;
    },
    setHideVat(hide) {
        this.hideVatAmt = hide;
    },
    setPayDueDt(value) {
        if (value) {
            const obj = this.payTerms.find(x => x.detailCd === value);
            if (obj) {
                const m = parseInt(obj.remark1, 10);
                const d = parseInt(obj.remark2, 10);

                if (m === 0 && d===0) {
                    this.form.payDueDt = '';
                } else {
                    let dt = this.$moment().add(m, 'month');

                    if (this.form.evdDt) dt = this.$moment(this.form.evdDt).add(m, 'month');

                    if (d === 31) {
                        dt = this.$moment(dt).endOf('month');
                    } else {
                        dt = this.$moment(dt).date(d);
                    }
                    this.form.payDueDt = dt.format('YYYY-MM-DD');
                }
            }
        }
    },    
    calendarLoad() {
      // 회계일자
      const iljinCalendar2 = new dhtmlXCalendarObject('calPostDt');
      iljinCalendar2.setDate(new Date());
      iljinCalendar2.hideTime();
      iljinCalendar2.attachEvent('onChange', (v) => { this.form.postDt = this.$refs.calPostDt.getFormatedDate() });
      iljinCalendar2.attachEvent("onButtonClick", (d) => { if (d === null) { this.form.postDt = this.$refs.calPostDt.getFormatedDate() } });
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
    setSlipHeader() {
        Object.assign(this.form, this.slipHeader);
        // format date
        if(this.form.evdDt) this.form.evdDt = this.$moment(this.form.evdDt).format('YYYY-MM-DD');
        if(this.form.postDt) this.form.postDt = this.$moment(this.form.postDt).format('YYYY-MM-DD');
        if(this.form.crdNo) this.form.crdNo = this.getFormattedCardNumber(this.form.crdNo);

        if(this.form.eaSlipNo) {
            if(this.form.eaSlipNo.substring(0,3) !== "TMP"){
                this.viewMode = true;
                this.$emit("changeViewMode", this.viewMode);
                this.showWritedRow();
                this.queryEvidFile(this.form.eaSlipNo)
            }else{
                this.selectOne({data: this.vatList, target: 'taxCd', key: 'taxCd'});

                if(this.ndctMccNames.indexOf(this.slipHeader.mccName) > -1){
                    this.form.taxCd = "";
            }
            }
            
        } else {
            this.$http.get('/api/tmp/documentMngNo')
                .then(response => {
                this.form.eaSlipNo = response.data
                this.queryEvidFile(this.form.eaSlipNo)
                this.selectOne({data: this.vatList, target: 'taxCd', key: 'taxCd'});

                if(this.ndctMccNames.indexOf(this.slipHeader.mccName) > -1){
                    this.form.taxCd = "";
                }    
            })
        }

        if (this.form.grSlipNo) {
            this.queryWingsFile(this.form.grSlipNo)
        } else {
            this.$http.get('/api/tmp/documentMngNo')
                .then(response => {
                this.form.grSlipNo = response.data
            })
        }
    },
    queryEvidFile() {
      if(this.form.eaSlipNo)  {
      /**
       * 증빙파일이 얼마나 첨부되었는지 확인해보자
       */
        this.$http.get(`/api/evid/fileList/${this.form.eaSlipNo}`)
            .then(response => {
            this.evidFileSize = ((response.data || {}).aFiles || []).length
        })
      }
    },
    queryWingsFile() {
        if(this.form.grSlipNo){
            /**
             * Wings파일이 얼마나 첨부되었는지 확인해보자
             */
            this.$http.get(`/api/wings/document/${this.form.grSlipNo}`)
                .then(response => {
                    this.wingsFileSize = response.data.length
            })
        }
    },    
    openUploadEvidencePopup() {
      let vm = this
      let readonly = this.form.slipStatCd !== '10'
      let url = '/evidAtchPopModeless?docMngNo=' + this.form.eaSlipNo + '&readonly='+ readonly + '&readonlyCtrl='+ readonly;

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
        //     if(this.form.slipStatCd === '20' || this.form.slipStatCd === '30' || this.form.slipStatCd === '50'){
        //     chkReadOnly = false
        //     }
        // }

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
    getVatList(){
      
      this.$http.get('/api/taxes', {
        params: {
          evdTypeCd: '10'
        }
      }).then(response => {        
        
        this.vatList = response.data;
        //빈 값(불공제) append
        this.vatList.push({taxCd : '' , taxNm : '불공제'})
        
        //법인카드 세금 코드 
        if(response.data.length === 1){
          this.cardTaxCd = response.data[0].taxCd
        }
      }).catch(response => {
        console.error("getTpsTypeList Error" + response.message);
      })
    },  
    changeTaxCd(){
        //공제구분 변경시 그리드 함수 호출
        this.$refs.detail.modyfyBasicTaxCd()
    }   
  },
  computed: {
    apprDateTime() {
        const dt = _.trim(this.form.apprDate + this.form.apprTime);
        return (dt.length===14) ? this.$moment(dt,'YYYYMMDDHHmiss').format("YYYY-MM-DD HH:mm:ss") :
               (dt.length===8) ? this.$moment(dt,'YYYYMMDD').format("YYYY-MM-DD") : "";
    },
  },
  watch: {
    slipHeader() {
        this.setSlipHeader();
        this.getTaxCombo();
        this.getRcpAccounts();
        this.getNdctMccName();
    },
    'form.totAmt'(value) {
        this.form.totAmt = this.$filters.number(value);
    },
    'form.supAmt'(value) {
        this.form.supAmt = this.$filters.number(value);
    },
    'form.vatAmt'(value) {
        this.form.vatAmt = this.$filters.number(value);
    },
    'form.tips'(value) {
        this.form.tips = this.$filters.number(value);
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
  mounted() {
    
    if (this.form.grSlipNo) {
        this.queryWingsFile(this.form.grSlipNo)
    } else {
        this.$http.get('/api/tmp/documentMngNo')
            .then(response => {
            this.form.grSlipNo = response.data
        })
    }

    if (this.form.eaSlipNo) {
        this.queryEvidFile(this.form.eaSlipNo)
    } else {
        this.$http.get('/api/tmp/documentMngNo')
            .then(response => {
            this.form.eaSlipNo = response.data
        })
    }

    this.getVatList();
    this.calendarLoad();
    this.showWritedRow();  
    this.getNdctMccName();
    
  },
  destroyed() {
    if(this.objectPopup !== null){
      this.objectPopup.close()
    }
  },
};
</script>

<style>
</style>