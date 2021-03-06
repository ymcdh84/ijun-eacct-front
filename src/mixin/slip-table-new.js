// Common library
import _ from 'lodash'
import { url as _url } from '@/libs/join'
import assert from '@/libs/assert'

// mixins
import mixin_sc from '@/mixin/slip-common'

// Table components
import TableHeader from '@/components/slip/table/libs/TableHeader'
import TableInput from '@/components/slip/table/libs/TableInput'
import TableNumberInput from '@/components/slip/table/libs/TableNumberInput'
import TableRadio from '@/components/slip/table/libs/TableRadio'
import TableSelect from '@/components/slip/table/libs/TableSelect'
import TableCalendar from '@/components/slip/table/libs/TableCalendar'
import TableExchgCalendar from '@/components/slip/table/libs/TableExchgCalendar'
import EvdCust from '@/components/slip/table/libs/EvdCust'
import AdvReq from '@/components/slip/table/libs/AdvReq'
import BaseDept from '@/components/slip/table/libs/BaseDept'
import BaseEmp from '@/components/slip/table/libs/BaseEmp'

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

    this.$store.commit('loading')
    this.$http.get(url, { params })
      .then(response => {
        this.options[type] = response.data
        return resolve(response)
      }).catch(response => {
        return reject(response)
      }).finally(() => {
        this.$store.commit('finish')
      })
  })
}

export default {
  props: {
    'value': {
      type: Object,
      required: true
    },
    'status': {
      type: Object,
      required: true
    }
  },
  mixins: [mixin_sc],
  /**
   * Import table essentials
   */
  components: {
    TableHeader,
    TableInput,
    TableNumberInput,
    TableRadio,
    TableSelect,
    TableCalendar,
    TableExchgCalendar,
    EvdCust,
    AdvReq,
    BaseDept,
    BaseEmp
  },
  data() {
    return {
      options: {
        'EVD_TYPE_CD': [],
        'ACCOUNT': [],
        'LBLT_ACCOUNT': [],
        'PAY_TERM_CD': [],
        'USE_TYPE_CD': [],
        'BP_CD': [],
        'TAX_CD': [],
        'VENT_ACCTS': [],
        'FRGN_NAT_CD': [],
        'FRGN_CUR_CD': [],
        'APL_FG_CD': [{
          value: 'N',
          label: '??????'
        }, {
          value: 'K',
          label: '???????????????'
        }],
        'STL_FG': [{
          value: 'N',
          label: '?????????'
        }, {
          value: 'Y',
          label: '???????????????'
        }],
        'CUST_USE_YN': [{
          value: 'N',
          label: '?????????'
        }, {
          value: 'Y',
          label: '??????'
        }]
      },
      hidePayDueDt: false
    }
  },
  computed: {
    lastColspan() {
      return this.status.readonly ? 2 : 1
    },
    readonly() {
      return this.status.readonly
    },
    isNew() {
      // return this.value.eaSlipNo === undefined
      return this.status.new
    },
    showHeader() {
      return !this.status.new
    }
  },
  methods: {
    // ** queryOption
    // ------------------------------------------------------------------------
    /**
     * QUERY:EVD_TYPE_CD
     * ???????????? ?????? ??????
     */
    queryEvdTypeCd() {
      return queryOption.apply(this, ['/code/combo', 'EVD_TYPE_CD', { groupCd: 'EVD_TYPE_CD', remark1: this.value.slipTypeCd }])
    },
    /**
     * QUERY:ACCOUNT
     * ???????????? ?????? ??????
     */
    queryAccounts() {
      if (this.value.slipTypeCd === 'E1' || this.value.slipTypeCd === 'E2' || this.value.slipTypeCd === 'E5') {
        return queryOption.apply(this, ['/account/card/credit', 'ACCOUNT'])
      } else if (this.value.slipTypeCd === 'E4'){
        return queryOption.apply(this, [`/api/account/liabilities`, 'ACCOUNT'])
      }else{
        return queryOption.apply(this, [`/account/combo/${this.value.slipTypeCd}`, 'ACCOUNT'])  
      }
    },
    /**
     * QUERY: NOT USE
     * ???????????? ?????? ??????
     */
    queryLbltAccounts() {
      //return queryOption.apply(this, ['/api/account/liabilities/p', 'LBLT_ACCOUNT'])
      return queryOption.apply(this, ['/api/account/liabilities', 'LBLT_ACCOUNT'])
    },
    /**
     * QUERY:USE_TYPE_CD
     * ???????????? ?????? ??????
     */
    queryUseTypeCd() {
      return queryOption.apply(this, ['/code/combo', 'USE_TYPE_CD', { groupCd: 'USE_TYPE_CD' }])
        .then(() => {
          this.options['USE_TYPE_CD'] = this.options['USE_TYPE_CD'].map(x => {
            return { value: x.key, label: x.value }
          })
        })
    },
    /**
     * QUERY:FRGN_NAT_CD
     * ???????????? ?????? ??????
     */
    queryFrgnNatCd() {
      return queryOption.apply(this, ['/code/combo', 'FRGN_NAT_CD', { groupCd: 'FRGN_NAT_CD' }])
    },
    /**
     * QUERY:FRGN_CUR_CD
     * ?????? ?????? ??????
     */
    queryFrgnCurCd() {
      return queryOption.apply(this, ['/code/combo', 'FRGN_CUR_CD', { groupCd: 'FRGN_CUR_CD' }])
    },
    /**
     * QUERY:VENT_ACCTS
     * ???????????? ?????? ??????
     */
    queryVentAccts() {
      var vm = this
      return queryOption.apply(this, [`/vendor/account/${this.value.evdCustCd}`, 'VENT_ACCTS'])
        .then(() => {
          if (this.options['VENT_ACCTS'].length === 0) {
            this.options['VENT_ACCTS'].push({
              key: '_',
              value: '== ???????????? ?????? =='
            })
          } else {
            
            vm.options['VENT_ACCTS'] = vm.options['VENT_ACCTS'].map(x => {
              
              x.key = [x.bnkCd, x.acctNo].join('_')
              x.value = x.acctNo + ' (' + x.bnkCd + ')'
              
              return x
            })
          }
        })
    },
    /**
     * QUERY:BP_CD
     * ????????? ?????? ??????
     */
    queryBpCd() {
      return queryOption.apply(this, ['/bp/combo', 'BP_CD'])
    },
    /**
     * QUERY:TAX_CD
     * ???????????? ??????
     */
    queryTaxCd() {
      if(this.value.slipTypeCd === 'E1') {
        return queryOption.apply(this, ['/taxes', 'TAX_CD', { evdTypeCd: '10' }])
      } else {
        return queryOption.apply(this, ['/taxes', 'TAX_CD', { evdTypeCd: this.value.evdTypeCd }])
      }
    },
    /**
     * QUERY:PAY_TERM_CD
     * ???????????? ?????? ??????
     */
    queryPayTermCd() {
      return queryOption.apply(this, ['/code/detail', 'PAY_TERM_CD', { groupCd: 'PAY_TERM_CD', remark3: this.value.evdTypeCd }])
    },
    /**
     * ????????? ?????? ??????
     */
    queryVatAcct() {
      this.$http.get('/api/account/vat')
        .then(response => {
          this.value.vatAcctCd = response.data.acctCd
          this.value.vatAcctNm = response.data.acctNm
        }).catch(response => {
          return response
        })
    },
    // ------------------------------------------------------------------------
    // ** Event handler
    // ------------------------------------------------------------------------
    /**
     * ???????????? ?????? ?????????
     */
    payTermCdChangeEvent() {
      let f = this.options['PAY_TERM_CD'].filter(x => x.detailCd === this.value.payTermCd)[0]

      // PAY_TERM_CD??? ?????????
      if (f !== undefined) {
        let am = this.$numeral(f.remark1).value()
        let fd = this.$numeral(f.remark2).value()

        if (am === 0 && fd === 0) {
          this.value.payDueDt = undefined
          this.hidePayDueDt = false
        } else {
          let dt = this.$moment(this.value.evdDt || undefined).add('month', am)
          dt = fd === 31 ? this.$moment(dt).endOf('month') : this.$moment(dt).date(fd)
          this.value.payDueDt = dt.format('YYYYMMDD')
          this.hidePayDueDt = true
        }
      }
    },
    /**
     * ????????? ?????? ?????????
     */
    evdCusChangeEvent() {
      const vm = this;
      this.queryPayTermCd()
          .then(() => {
            let f = vm.options['PAY_TERM_CD'].filter(x => x.detailCd === vm.value.payTermCd)[0]
            // PAY_TERM_CD??? ?????????
            if (f !== undefined) {
              let am = vm.$numeral(f.remark1).value()
              let fd = vm.$numeral(f.remark2).value()
              if (am === 0 && fd === 0) {
                vm.value.payDueDt = undefined
                vm.hidePayDueDt = false
              } else {
                let dt = vm.$moment(vm.value.evdDt || undefined).add('month', am)
                dt = fd === 31 ? vm.$moment(dt).endOf('month') : vm.$moment(dt).date(fd)
                vm.value.payDueDt = dt.format('YYYYMMDD')
                vm.hidePayDueDt = true
              }
            }else{
              vm.value.payTermCd = vm.options['PAY_TERM_CD'][0].detailCd;
              vm.hidePayDueDt = false
            }
          })

      if(vm.options['PAY_TERM_CD'].length == 0){
        vm.hidePayDueDt = true
      }
      if(vm.value.evdCustNm === ''){
        vm.value.evdCustCd = '';
        vm.value.custAccount = '';
        vm.value.payTermCd = '';
        vm.value.payDueDt = '';
        vm.value.payText = '';
        vm.value.siteNm = '';
      }
      this.queryVentAccts()
          .then(() => {
            let f = vm.options['VENT_ACCTS'].filter(x => x.acctNo === vm.value.custAcctNo)[0]
            if (vm.value.custAccount === undefined || vm.value.custAccount === '_' || f === undefined) {
              f = vm.options['VENT_ACCTS'][0]
            }
            vm.value.custBnkCd = f.bnkCd
            vm.value.custAcctNo = f.acctNo
            vm.value.custAccount = f.key

            vm.options['VENT_ACCTS'] = _.clone(vm.options['VENT_ACCTS'])
          })

    },
    /**
     * ???????????? ?????? ?????????
     */
    evdTypeChangeEvent() {
      // ?????? ?????? ??????
      this.queryTaxCd()
        .then(() => {
          let f = this.options['TAX_CD'].filter(x => x.taxCd === this.value.taxCd)[0]
          if (this.value.taxCd === undefined || f === undefined) {
            f = this.options['TAX_CD'][0]
          }
          if(f !== undefined) {
            this.value.taxCd = f.taxCd
            this.value.taxRt = f.taxRt
  
            this.reset_rows()
          }
        })
        
      this.queryPayTermCd()
        .then(() => {
          let f = this.options['PAY_TERM_CD'].filter(x => x.detailCd === this.value.payTermCd)[0]
          if (this.value.payTermCd === undefined || f === undefined) {
            f = this.options['PAY_TERM_CD'][0]
          } else {
            let am = this.$numeral(f.remark1).value()
            let fd = this.$numeral(f.remark2).value()
            if (am === 0 && fd === 0) {
              this.value.payTermCd = f.detailCd
              this.value.payTermNm = f.detailNm
              this.hidePayDueDt = false
            } else {
              this.value.payTermCd = f.detailCd
              this.value.payTermNm = f.detailNm
              this.hidePayDueDt = true
            }
          }
        })
          

      _flush.apply(this, [])

      switch (this.value.evdTypeCd) {
        //2020.06.29 E2 ?????? ?????? ????????? 'KRW'??? ????????? ????????? ?????? ??????
        /* 
        case '40':
          try {this.value.curCd = this.options['FRGN_CUR_CD'][0].key}catch(e){}
          
          break
        */
        case '42':
          this.value.useTypeCd = this.options['USE_TYPE_CD'][0].value
          break
        case '43':
          this.value.frgnNatCd = this.options['FRGN_NAT_CD'][0].key
          this.value.frgnCurCd = this.options['FRGN_CUR_CD'][0].key
          break
      }

      function _flush() {
        this.value.useTypeCd = undefined
        this.value.taxCd = undefined
        //2020.06.29 E2 ?????? ?????? ????????? 'KRW'??? ????????? ????????? ?????? ??????
        //this.value.curCd = 'KRW'
        this.value.crcptNo = undefined
        this.value.crcptBizNo = undefined
        this.value.crcptMerchNm = undefined
        this.value.frgnNatCd = undefined
        this.value.frgnCurCd = undefined
        this.value.frgnAmt = undefined
        this.value.frgnNatCd = undefined
        this.value.frgnCurCd = undefined
        this.value.frgnAmt = 0
        if(this.value.slipTypeCd !== 'E5') {
          this.value.supAmt = 0
          this.value.etcAmt = 0
          this.value.vatAmt = 0
        }
      }
    },
    /**
     * ??????????????? ?????? ?????????
     */
    evdCustCdChangeEvent() {
      // ???????????? ??? ????????? ????????? ????????? ???????????? ????????????
      // if (this.value.slipTypeCd === 'E4' || this.value.slipTypeCd === 'E6' || this.value.slipTypeCd === 'E7') {
        if (this.value.slipTypeCd === 'E4' || this.value.slipTypeCd === 'E6' || this.value.slipTypeCd === 'E1') {
        this.$http.get(`/api/emp/${this.value.evdCustBizNo}`)
          .then(response => {
            if (response.data.length > 0) {
              this.value.baseDeptCd = response.data[0].cctrCd
              this.value.baseDeptNm = response.data[0].cctrNm
            }
            this.baseDeptCdChangeEvent()
          })
      }

      this.queryVentAccts()
        .then(() => {
          let f = this.options['VENT_ACCTS'].filter(x => x.key === this.value.custAccount)[0]
          if (this.value.custAccount === undefined || this.value.custAccount === '_' || f === undefined) {
            f = this.options['VENT_ACCTS'][0]
          }
          this.value.custBnkCd = f.bnkCd
          this.value.custAcctNo = f.acctNo
          this.value.custAccount = f.key

          this.options['VENT_ACCTS'] = _.clone(this.options['VENT_ACCTS'])
        })
    },
    /**
     * ???????????? ?????? ?????????
     */
    baseDeptCdChangeEvent() {
      _.forEach(this.value.slipDetails, x => {
        x.bdptCd = x.cctrCd = this.value.baseDeptCd
        x.cctrNm = this.value.baseDeptNm
      })
    },
    /**
     * ???????????? ?????? ?????????
     */
    evdDtChangeEvent() {
      // if (this.value.slipTypeCd === 'E6' || this.value.slipTypeCd === 'E7') {
        if (this.value.slipTypeCd === 'E6' || this.value.slipTypeCd === 'E1' || this.value.slipTypeCd === 'E2' || this.value.slipTypeCd === 'E5') {
        _.forEach(this.value.slipDetails, x => {
          x.useDt = this.value.evdDt
        })
      }
    },
    /**
     * ??????/???????????? ????????? ?????? ?????????
     */
    postEvdDtChangeEvent() {
      //??????????????? ?????? ????????? ????????? ?????????????????? ???????????? ???????????? ?????? ??????????????? ?????? ????????? ?????????. 
      /* 
      let postQuarter = this.$moment(this.value.postDt).quarter()
      let postYear = this.$moment(this.value.postDt).year()
      let evdQuarter = this.$moment(this.value.evdDt).quarter()
      let evdYear = this.$moment(this.value.evdDt).year()
      
      if(!(postQuarter === evdQuarter) || !(postYear === evdYear)) {
        this.value.evdDt = this.$moment(this.value.postDt).format('YYYY-MM-DD') 
      }
      */
     //????????? ??????????????? 8?????? '-'??? ???????????? 10???????????? ????????? ????????? ?????? '-'??????
     this.value.evdDt = this.$moment(this.value.postDt).format('YYYYMMDD') 
    },
    /**
     * ???????????? ?????? ?????????
     */
    apAcctCdChangeEvent() {

      let f = "";

      if (this.value.apAcctCd === undefined || f === undefined) {
        f = this.options['ACCOUNT'][0] || {}
      }else{
        if(Array.isArray(this.options['ACCOUNT'])) f = this.options['ACCOUNT'].filter(x => x.key === this.value.apAcctCd)[0]
      }

      this.value.apAcctCd = f.key
      this.value.apAcctNm = f.value
      let citems = this.value.slipDetails.filter(x => [x.dcCd, x.lnTypeCd].join('_') === 'C_ITEM')
      _.forEach(citems, x => {
        x.acctCd = this.value.apAcctCd
        x.acctNm = this.value.apAcctNm
      })
    },
    /**
     * ???????????? ?????? ?????????
     */
    lbltAcctCdChangeEvent() {
      // ??????????????????(E1)??? ??????????????? '????????????'??? ??????
      // ??????????????????(E1)??? ???????????????, ??????????????????, ??????????????? ??????
      if(this.value.slipTypeCd === 'E1') {
        const item = this.options['LBLT_ACCOUNT'].find(function(x) {
          return x.key === '21001101'
        }) 
        const idx = this.options['LBLT_ACCOUNT'].indexOf(item) 
        this.options['LBLT_ACCOUNT'].splice(idx, 1)
        
        const item2 = this.options['LBLT_ACCOUNT'].find(function(x) {
          return x.key === '21006001'
        }) 
        const idx2 = this.options['LBLT_ACCOUNT'].indexOf(item2) 
        this.options['LBLT_ACCOUNT'].splice(idx2, 1)

        const item3 = this.options['LBLT_ACCOUNT'].find(function(x) {
          return x.key === '21008001'
        }) 
        const idx3 = this.options['LBLT_ACCOUNT'].indexOf(item3) 
        this.options['LBLT_ACCOUNT'].splice(idx3, 1)
      }
      let f = this.options['LBLT_ACCOUNT'].filter(x => x.key === this.value.lbltAcctCd)[0]
      if (this.value.lbltAcctCd === undefined || f === undefined) {
        f = this.options['LBLT_ACCOUNT'][0] || {}
      }
      this.value.lbltAcctCd = f.key
      this.value.lbltAcctNm = f.value
      let citems = this.value.slipDetails.filter(x => [x.dcCd, x.lnTypeCd].join('_') === 'C_ITEM')
      _.forEach(citems, x => {
        x.acctCd = this.value.lbltAcctCd
        x.acctNm = this.value.lbltAcctNm
      })
    },
    /**
     * ?????? ?????? ?????????
     */
    frgnChangEvent(value) {
      
      let f = this.options['FRGN_CUR_CD'].filter(x => x.key === value.curCd)[0]
      if (value.curCd === undefined || f === undefined) {
        f = this.options['FRGN_CUR_CD'][0] || {}
      }

      let curCd = value.curCd
      let excDt = value.excDt.replace(/-/gi,'')

      this.$http.get('/api/erp/exchange/rate/'+curCd+'/'+excDt)
      .then(response => {
        let data = response.data[0]
        value.curCd = data.frCurrency
        value.excRt = this.$numeral(data.convRt).value()
        if(data.frCurrency === 'JPY'){
          value.totAmtKrw = value.totAmt * value.excRt * 0.01
          value.totAmtKrw = Math.floor(value.totAmtKrw)
        }else {
          value.totAmtKrw = value.totAmt * value.excRt
          value.totAmtKrw = Math.floor(value.totAmtKrw)
        }
        this.convertNumberFormat(value, data.frCurrency);
      }).catch(response => {
        //2020.08.20 ????????? ???????????? ??????
        if(value.curCd !== 'KRW'){
          this.$swal({type: 'warning', text: '??????????????? ?????? ???????????? ????????????.'});
        }
        value.curCd = "KRW"
        value.excRt = 1
        value.totAmtKrw = value.totAmt * value.excRt
        //this.$swal({type: 'warning', text: '??????????????? ?????? ???????????? ????????????.'});
        this.convertNumberFormat(value, value.curCd);
      }).finally(() => {
        this.$emit('input', value) //2020.08.14 console.error
        this.$store.commit('finish')
      })


    },

    convertNumberFormat(value, curCd){
      //2020.08.14 ?????????(????????????) ????????? ?????? --> 2021.03.08 value??? ?????? ??????????????? ?????????????????????... ????????????
      //  _.forEach(value.slipDetails, x => {
      //    if(curCd === 'KRW'){
      //      // x.useAmt = this.$numeral(x.useAmt).format('0,0')
      //    }else{
      //     // x.useAmt = this.$numeral(x.useAmt).format('0,0.000')
      //    }
      // })
    },

    /**
     * ?????? ?????? ?????????
     */
    hdSgtxtChangeEvent() {
      _.forEach(this.value.slipDetails, x => {
        x.lnSgtxt = this.value.hdSgtxt
      })
    },
    /**
     * ??????????????? ?????? ?????????
     */
    aplFgCdChangeEvent(){
      if(this.value.slipTypeCd === 'E2' || this.value.slipTypeCd === 'E5') {
        this.$http.get('/api/account/pp')
        .then(response => {
          if(response.data) {
            if(this.value.aplFgCd === 'K') {
              this.value.stlFgCd = 'N'
              let data = response.data
              
              this.value.acctCd = data.acctCd
              this.value.acctNm = data.acctNm

              this.value.slipDetails.forEach(x => {
                x.acctCd = data.acctCd
                x.acctNm = data.acctNm

                this.$forceUpdate();
              })
            } else {
              this.value.slipDetails.forEach(x => {
                x.acctCd = undefined
                x.acctNm = undefined
                
                this.value.acctCd = undefined
                this.value.acctNm = undefined
                
                this.$forceUpdate();
              })
            }
          }
        })
      } else {
        if(this.value.aplFgCd === 'K') {
          this.value.stlFgCd = 'N'
        }
      }
    },
    /**
     * ???????????? ?????? ?????????
     */
    stlFgCdChangeEvent(){
      if(this.value.stlFgCd === 'K') {
        this.value.aplFgCd = 'N'
      }else if(this.value.stlFgCd === 'N') {
        this.data.preInvoiceNum = undefined
        this.data.mrAmt = 0
      }
    },
    /**
     * ????????? ?????? ??? ?????? ??????
     */
    gridAcctEvent() {
      console.log("????????? ?????? ??? ?????? ?????? ", this.value.acctCd)
      if(this.value.acctCd) {
        _.forEach(this.value.slipDetails, x => {
          x.acctCd = this.value.acctCd
          x.acctNm = this.value.acctNm
        })
      }
    }
  },
  created() {
    Promise.all([this.queryEvdTypeCd(), this.queryVentAccts(), this.queryVatAcct()])
      .then(() => {
        if (this.isNew && !this.$route.params.copyEaSlipNo) {
          this.evdTypeChangeEvent()
          this.evdCusChangeEvent() //2020.05.15 E2 ?????? ????????? ??????????????? ???????????? ?????? ??????
          if(this.value.slipTypeCd === 'E2'){
            this.value.evdCustNm = ''
            this.value.evdCustCd = ''
          }
        } else {
          this.queryTaxCd()
          this.queryPayTermCd()
          if(this.value.slipTypeCd === 'E2'){
            this.evdTypeChangeEvent()
          }
        }
      })

    if (this.isNew && !this.$route.params.copyEaSlipNo) {
      this.evdCustCdChangeEvent()
    }

    //?????????????????? ?????? ??????
    if(this.value.slipTypeCd !== 'E4'){
      this.queryLbltAccounts()
          .then(()=> {
            this.lbltAcctCdChangeEvent()
      })
    }
    
    //???????????? ?????? ??????
    this.queryAccounts()
    .then(() => {
      this.apAcctCdChangeEvent()
    }) 

    if(this.value.slipTypeCd === 'E2' || this.value.slipTypeCd === 'E5') this.queryFrgnCurCd()
    if (this.value.slipTypeCd === 'E4') {
      this.queryFrgnCurCd()
      this.queryFrgnNatCd()
      this.queryUseTypeCd()
      this.queryBpCd()
    }
  }
}
