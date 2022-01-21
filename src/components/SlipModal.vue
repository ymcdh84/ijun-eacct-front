<template>
<layout>
  <span slot="header">
    {{ data.slipTypeNm }} - {{ data.grSlipNo }}
    <button class="btn-pop-close delete" aria-label="close" @click="$parent.close()"></button>
  </span>
  <div slot="content" class="inner-box">
    <!--2020.05.21 재경검인, 재경반려 추가 -->
    <div v-if="this.$store.state.loginInfo.authorities[0].roleSelectCd === '10'" class="btn-wrap btn-type1 clearfix">
      <button type="button" class="btn-size btn-gray fl_left" v-if="apprRejChckCd" @click="rejectButtonClickEvent(data,get)">
        <span class="btn-icon"><i class="fas fa-thumbs-down"></i></span> 반려
      </button>
      <button type="button" class="btn-size btn-gray fl_left" v-if="approvalingChckCd" @click="approvalingButtonClickEventOld(data,get)">
        <span class="btn-icon"><i class="fas fa-file"></i></span> 검인
      </button>
      <button type="button" class="btn-size btn-gray fl_left" v-if="approvalChckCd" @click="approvalButtonClickEvent(data,get)">
        <span class="btn-icon"><i class="fas fa-thumbs-up"></i></span> 확정
      </button>
    </div>
    <div class="table-area" v-if="$route.name === 'slipLst' || $route.name === 'apprReqLst' || $route.name === 'slipMng'">
      <appr-header :doc-type="docType" :apprHeader="apprHeader" :appr-line="apprLine" v-model="data"/>
    </div>
    <slip-base :ea-slip-no="eaSlipNo" v-model="data" />
  </div>
</layout>
</template>

<script>
import Layout from '@/components/ModalSlot2.vue'
import SlipBase from '@/components/slip/SlipBase.vue'
import SlipApprovalPop from '@/components/SlipApprovalPop.vue'
//import SlipMng from '@/views/SlipMng.vue'
import ApprHeader from '@/components/ApprHeader.vue'
import query from '@/mixin/query' //2020.05.26 재경검인, 재경반려 method

export default {
  mixins: [query],
  props: {
    eaSlipNo: {
      type: String,
      required: true
    },
    grSlipNo: {
      type: String,
      required: false
    },
    value: {
      type: Object,
      required: false
    }
  },
  components: {
    Layout,
    SlipBase,
    ApprHeader
  },
  data() {
    return {
      data: {},
      data1:[],
      get:'10',
      apprLine:[],
      docType:"SLIP",
      apprHeader: {},
      approvalingChckCd: false,
      approvalChckCd: false,
      apprRejChckCd:false,
    }
  },
  watch: {
    'value': {
      immediate: true,
      deep: true,
      handler(value) {
        this.data = value || {}
      }
    }
  },
  methods:{
    getApprDetail(){
      if(this.value.apprNo){
        this.$http.get(`/api/appr/detail/${this.value.apprNo}`)
            .then(response => {
              if (response.data) {
                this.apprLine = response.data.apprDetails;
                this.apprHeader = response.data.apprHeader[0];
                _.forEach(this.apprLine, v => {
                  if (v.apprFgCd === 'X') {
                    this.apprSeq = v.apprSeq
                    this.thisApprUser = v.aprverId
                    return false
                  }
                })
              }
            })
            .catch(({message}) => {
              console.error(message);
              this.apprLine=[];
            })
      }

    },
    apprLineRule() {

      let docTypeCd = this.docType
      let dtlTypeCd = undefined
      let curCd = undefined
      let maxAmt = undefined

      switch (this.docType) {
        case 'SLIP':
        case 'GR':
          dtlTypeCd = this.value.slipTypeCd
          curCd = this.value.curCd
          maxAmt = this.value.totAmt
          break
        case 'BDGT':
          dtlTypeCd = this.value.brwTypeCd
          curCd = 'KRW'
          maxAmt = this.value.reqTotAmt
          break
      }

      this.$store.commit('loading')
      this.$http.get('/api/appr/rule', {
        params: {
          docTypeCd,
          dtlTypeCd,
          curCd,
          maxAmt
        }
      }).then(response => {
        if (Array.isArray(response.data) && response.data.length > 0) {
          this.apprLine = response.data.filter(x => x.aprverUser)

          this.apprLine = this.apprLine.map(x => {
            x.apprDtm = x.apprDtm ? this.$moment(x.apprDtm).format('YYYY-MM-DD') : undefined
            return x
          })
        }
      }).finally(() => {
        this.apprLine.unshift(
            {
              aprverUser: this.$store.state.loginInfo.userName,
              jobNm: this.$store.state.loginInfo.loginJobNm,
              aprverId: this.$store.state.loginInfo.loginId,
              cctrNm: this.$store.state.loginInfo.loginDeptNm,
              apprTypeCd: '10',
              apprType: '기안'
            }
        );
        this.$store.commit('finish')
      })
    },
    approvalingChck(){
      if(this.value.slipStatCd === '50' || this.value.slipStatCd === '64' || this.value.slipStatCd === '65'){
        this.approvalingChckCd = true;
      }else{
        this.approvalingChckCd = false;
      }
    },
    approvalChck(){
      if(this.value.slipStatCd === '66'){
        this.approvalChckCd = true;
      }else{
        this.approvalChckCd = false;
      }
    },
    apprRejChck(){
      if(this.value.slipStatCd !== '70' && this.value.slipStatCd !== ''){
        this.apprRejChckCd = true;
      }else{
        this.apprRejChckCd = false;
      }
    },

  },
  created(){
    this.getApprDetail()
    this.apprLineRule()
    this.approvalingChck()
    this.approvalChck()
    this.apprRejChck()
  }
}
</script>

<style scoped>
.modal-card {
  width: auto;
}
.modal .pop-content .btn-type1 {
    float: right;
    text-align: right;
    /* margin-bottom: 16px; */
}
</style>
