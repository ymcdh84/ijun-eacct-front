<template>
  <div>
    <!--팝업-->
    <!-- <b-modal :active.sync="showAccountModal" has-modal-card @receive="receiveAccount">
        <account :slipTypeCd="slipTypeCd" :deptCd="deptCd"></account>
    </b-modal> -->
    <!-- <b-modal :active.sync="showCctrModal" has-modal-card @receive="receiveCctr">
        <erp-cctr></erp-cctr>
    </b-modal> -->
    <b-modal :active.sync="showVendorModal1" has-modal-card @receive="receiveAccountLst">
        <accountCtrl :slipTypeCd="slipTypeCd"></accountCtrl>
    </b-modal>
    <!-- <b-modal :active.sync="showProductModal" has-modal-card @receive="receiveProduct">
        <product :slipTypeCd="slipTypeCd"></product>
    </b-modal> -->
    <!--//팝업 -->
  </div>
</template>
<script>
/* eslint-disable */
import _ from 'lodash'
// PopUp
// import Account from '@/components/Account.vue';
import Account from '@/components/Account_Ag.vue';
import AccountCtrl from '@/components/AccountCtrl.vue';
// import ErpCctr from '@/components/ErpCctr_new.vue';
import ErpCctr from '@/components/ErpCctr_Ag.vue';
import Vendor from '@/components/Vendor.vue';
// import Product from '@/components/Product.vue';
import Product from '@/components/Product_Ag.vue';
import SlipMngItemPop from '@/components/SlipMngItemPop.vue';
import ErpAccountSubNew from '@/components/ErpAccountSub_Ag.vue';

export default {
  name: 'PopupGrid',
  components: { Account, AccountCtrl, ErpCctr, Vendor ,Product,SlipMngItemPop,ErpAccountSubNew},
  props: ['slipTypeCd', 'deptCd'],
  data() {
    return {
      showAccountModal: false,
      showCctrModal: false,
      showVendorModal1: false,
      showProductModal: false,
      account: {},
      ertCctr: {},
      accountCtrl: {},
      product: {},
      dff:{},
      popupRowId: 0,
    };
  },
  methods: {

    popAccount(rId, cInd, pVal) {
      const that = this
      
      this.$modal.open({
        component: Account,
        parent: this,
        props: {
          slipTypeCd: this.slipTypeCd,
          deptCd: this.deptCd,
          param: pVal
        },
        events: {
            close(object) {
              object.name = 'account'
              
              //계정에 해당하는 보조계정이 존재하는지 체크
              that.$http.get('/api/account/sub/' + object.acctCd)
                .then(response => {

                  var resData = response.data;

                  object.acctCdSub = "";
                  object.acctNmSub = "";

                  if(resData.length === 1){
                    object.acctCdSub = resData[0].subAcctCd;
                    object.acctNmSub = resData[0].subAcctNm;
                    //보조계정이 존재하는 경우 필수 입력
                    object.reqSubAcct = true;
                  }else if(resData.length == 0){
                    //보조계정이 존재하지 않는 경우
                    object.reqSubAcct = false;
                  }else{
                    //보조계정이 존재하는 경우 필수 입력
                    object.reqSubAcct = true;
                  }

                })
                .finally(() => {
                  that.receiveCctr(object)
                })
            }
        }
      });
    },
    popAccountSub(rId, cInd, pAcctCd, pSlipTypeCd, pVal ){
      const that = this;
      
      if(_.isEmpty(pAcctCd)){
        this.$swal({
          type: 'warning',
          text: '계정을 먼저 선택하기 바랍니다.'
        });
        return;
      }
      
      this.$modal.open({
        component: ErpAccountSubNew,
        parent: this,
        props: {
          deptCd: this.deptCd,
          slipTypeCd: this.slipTypeCd,
          acctCd: pAcctCd,
          searchStr: pVal
        },
        width: 700,
        events: {
          close(object) {
            object.name = 'accountSub'
            that.receiveCctr(object)
          }
        },
      })
    },
    popDff(paramAcctCd, rowData) {
      const that = this
      this.$modal.open({
        component: SlipMngItemPop,
        parent: this,
        props: {
          acctCd: paramAcctCd,
          data: rowData,
        },
        events: {
          close(object) {
            object.name = 'dff'
            that.receiveDff(object)
             }
        },
      })
    },
    popAccountCtrl(rId, cInd){
      this.showVendorModal1 = true;
    },
    popCctr(rId, cInd, pVal) {
      const that = this
      
      this.$modal.open({
        component: ErpCctr,
        parent: this,
        props: {
          searchStr : pVal
        },
        events: {
            close(object) {
              object.name = 'cctr'
              that.receiveCctr(object)
            }
        }
      });
    },
    popProduct(rId, cInd, pVal) {
      const that = this
      
      this.$modal.open({
        component: Product,
        parent: this,
        props: {
          slipTypeCd: this.slipTypeCd,
          searchStr: pVal
        },
        events: {
            close(object) {
              object.name = 'product'
              that.receiveCctr(object)
            }
        }
      });
    },
    receiveAccount(obj) {
      this.$emit('returnValue', obj);
    },
    receiveAccountLst(obj){
      this.$emit('returnValue', obj);
    },
    receiveCctr(obj) {
      this.$emit('returnValue', obj);
    },
    receiveProduct(obj) {
      this.$emit('returnValue', obj);
    },
    receiveObject(name, obj) {
      this[name] = obj;
    },
    receiveDff(obj){
      this.$emit('returnValue', obj);
    },
    initAccount() {
      if(this.account.acctNm === '') this.account = {};
    },
    initAccountLst() {
      if(this.accountCtrl.acctNm === '') this.accountCtrl = {};
    },
    initCctr() {
      if(this.ertCctr.deptCd === '') this.ertCctr = {};
    },
    initProduct() {
      if(this.product.detailNm === '') this.product = {};
    },
  },
  mounted() {
  },
  created() {
  },
  watch: {
    'deptCd': {
      immediate: true,
      deep: true,
      handler(value) {
        console.log("popupGrid watch hadle value ", value)
      }
    }
  }
};
</script>

<style>
</style>

