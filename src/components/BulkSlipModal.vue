<template>
<layout>
  <span slot="header">
    {{ data.slipTypeNm }} - {{ data.grSlipNo }}
    <button class="btn-pop-close delete" aria-label="close" @click="$parent.close()"></button>
  </span>

  <div slot="content" class="inner-box">
    <div class="btn-wrap btn-type1 clearfix">
      <button class="btn-size btn-blue fl_right" @click="buttonEventSubmit" v-if="isSubmitable && grSlipNo">
        <span class="btn-icon">
          <i class="fas fa-pen-alt"></i>
        </span>
        결재상신
      </button>

      <button class="btn-size btn-blue fl_right" @click="openApprPopup()" v-if="this.$store.state.loginInfo.loginId === this.thisApprUser || this.deleYn ==='Y'">
        <span class="btn-icon">
          <i class="fas fa-pen-alt"></i>
        </span>
        결재
      </button>

      <button class="btn-size btn-yellow fl_right" @click="cancel(docMngNo)" v-if="this.$store.state.loginInfo.loginId == draftUserId && docStatus === 'REQ'">
        <span class="btn-icon">
          <i class="fas fa-pen-alt"></i>
        </span>
        상신취소
      </button>
    </div>
    <div class="table-area" style="margin-top: 0px;">
      <appr-header v-if="docMngNo" :doc-type="docType" :apprHeader="apprHeader" :appr-line="apprLine" v-model="data"/>
    </div>
    <!-- <slip-base :gr-slip-no="grSlipNo" v-model="data" /> -->
    <slip-base :grSlipNo="grSlipNo" v-model="data" :slipStatCd="slipStatCd" :status="status" />
  </div>
</layout>
</template>

<script>
import slip from '@/mixin/slip-basic'
import assert from '@/libs/assert'

import Layout from '@/components/ModalSlot.vue'
import SlipBase from '@/components/slip/SlipBase.vue'

import ApprHeader from '@/components/ApprHeader.vue'
import ApprActPop from '@/components/ApprActPop.vue'

export default {
  props: {
    grSlipNo: {
      type: String,
      required: false
    },
    value: {
      type: Object,
      required: false
    },
    slipStatCd: {
      type: String,
      required: false
    },
    docMngNo: {
        type: String,
        required: false
    },
  },
  components: {
    Layout,
    SlipBase,
    ApprHeader
  },
  mixins: [slip],
  data() {
    return {
      data: {
        grSlipNo: undefined,
        eaSlipNo: undefined,
        compCd: undefined,
        slipTypeCd: 'E5',
        postDt: this.$moment().format('YYYYMMDD'),
        slipStatCd: '10',
        slipStatNm: '작성중',
        baseDeptCd: undefined,
        baseDeptNm: undefined,
        empNo: undefined,
        empNm: undefined,
        lbltAcctCd: undefined,
        lbltAcctNm: undefined,
        totAmt: 0,
        supAmt: 0,
        vatAmt: 0,
        etcAmt: 0,
        preInvoiceNum: undefined,
        mrAmt: 0,
        preAmtRm: 0,
        totAmtKrw: 0,
        aplFgCd: 'N',
        stlFgCd: 'N',
        curCd: 'KRW',
        excDt: this.$moment().format('YYYYMMDD'),
        excRt: 1,
        hdSgtxt: undefined,
        evdCustCd: undefined,
        evdCustNm: undefined,
        evdCustBizNo: undefined,
        payTermCd: undefined,
        siteNm: undefined,
        custAccount: undefined,
        custAcctNo: undefined,
        payDueDt: this.$moment().format('YYYYMMDD'),
        apAcctCd: undefined,
        apAcctNm: undefined
      },
      apprHeader: {},
      apprLine: [],
      deleYn: 'N',
      thisApprUser: '',
      loaded: false,
      docType: 'SLIP',
      docTitleNm: '',
      docTypeCd: '',
      docStatus: '',
      draftUserId: '',
    }
  },
  methods: {
    deleCheck() {
        this.$http.get(`/api/appr/delegatingCheck`, {
            params: {
                adlgId: this.thisApprUser,
                actId: this.$store.state.loginInfo.loginId
            }
        })
        .then(response => {
          // console.log("delegatingCheck : ", response)
          this.deleYn = response.data;
        });
    },
    getAppr(docMngNo) {
      if (docMngNo != undefined) {
        this.$http.get(`/api/appr/detail/${docMngNo}`)
          .then(response => {
              if (response.data) {
                // console.log("response.data.apprHeader ", response.data.apprHeader)
                this.apprHeader = response.data.apprHeader[0];
                this.apprLine = response.data.apprDetails;

                this.docTypeCd = response.data.apprHeader[0].docTypeCd;
                this.docStatus = response.data.apprHeader[0].docStatCd;
                this.draftUserId = response.data.apprHeader[0].draftUserId;
                this.docTitleNm = response.data.apprHeader[0].docTitleNm;
                this.apprNo = response.data.apprHeader[0].apprNo;
                this.docType = 'SLIP'
                
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
      }
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
                              this.$swal({type: 'info', text: '상신 취소되었습니다.'});
                              this.$parent.close()
                              // console.log(this)
                              this.$parent.$parent.goSearch();
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
                    // console.log('Appr Popup Close Event!!'+ data)
                    vm.getAppr(data)
                }
            }
        })
    },
  },
  created() {
    this.getAppr(this.docMngNo);
  },
  computed: {
      isLoaded() {
        return this.loaded
      },
  },
  watch: {
    'slipStatCd': {
      immediate: true,
      deep: true,
      handler(value) {
        this.data.slipStatCd = value
      }
    },
    'value': {
      immediate: true,
      deep: true,
      handler(value) {
        if(value) {
          this.data = value
        }
      }
    },
    'docMngNo': {
      immediate: true,
      deep: true,
      handler(value) {
        this.docMngNo = value
      }
    },
    'loaded'(value) {
      this.deleCheck()
    },
    'data.evdCustCd'(value) {
      if(value) {
          this.$http.get(`/api/vendor/${this.data.slipTypeCd}/${value}`)
          .then((result) => {
            this.data.payTermCd = result.data[0].termsId
            this.data.lbltAcctCd = result.data[0].apAcctCd
            this.data.lbltAcctNm = result.data[0].apAcctNm
          });
      }
    }
  }
}
</script>

<style scoped>
.modal-card {
  width: auto;
}
</style>
