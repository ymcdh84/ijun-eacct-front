<template>
<layout>
  <span slot="header">
    {{ title }}
    <button class="btn-pop-close delete" aria-label="close" @click="closePop"></button>
  </span>
  <div slot="content">
    <div class="btn-wrap btn-type1 clearfix" style="float:right;" v-show="btnShow">
      <button class="btn-size btn-blue" @click="approval">
        <span class="btn-icon">
          <i class="fas fa-pen-alt"></i>
        </span>
        상신
      </button>
      <button class="btn-size btn-blue" @click="openVendorPopup">
        <span class="btn-icon">
          <i class="fas fa-user-check"></i>
        </span>
        결재자 지정
      </button>
    </div>

    <div class="table-area" style="margin-top: 0px;">
        <div class="table-a">
            <div class="table-name">
                <h3 class="ico_table_name">문서정보</h3>
            </div>
            <table class="table">
                <colgroup>
                    <col width="10%">
                    <col width="20%">
                    <col width="10%">
                    <col width="20%">
                    <col width="10%">
                    <col width="20%">
                </colgroup>
                <tbody>
                    <tr>
                        <th>문서유형</th>
                        <td>{{docTypeNm}}</td>
                        <th>문서번호</th>
                        <td>{{apprNo}}</td>
                        <th>문서상태</th>
                        <td>{{docStatNm}}</td>
                    </tr>
                    <tr>
                        <th>제목</th>
                        <td colspan="5">{{docTitleNm}}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="table-b">
            <div class="table-name">
                <h3 class="ico_table_name">결재선</h3>
            </div>
            <table class="table">
                <colgroup>
                    <col width="3%">
                    <col width="7%">
                    <col width="20%">
                    <col width="20%">
                    <col width="10%">
                    <col width="10%">
                    <col width="30%">
                </colgroup>
                <thead>
                    <tr>
                        <th class="no-radius">NO</th>
                        <th>결재유형</th>
                        <th>결재자</th>
                        <th>실제결재자</th>
                        <th>결재상태</th>
                        <th>결재일자</th>
                        <th style="border-right: 1px solid rgb(173, 173, 173);">의견</th>
                    </tr>
                </thead>
                <tbody id="tbody">
                    <tr v-for="(item, index) in apprLine" :key="index">
                        <td style="text-align: center;">{{index+1}}</td>
                        <td style="text-align: center;">{{item.apprType}}</td>
                        <td>{{item.aprverUser}}</td>
                        <td>{{item.aaprverUser}}</td>
                        <td style="text-align: center;">{{item.apprStatus}}</td>
                        <td style="text-align: center;">{{item.apprDtm === null ? null : $moment(item.apprDtm).format('YYYY-MM-DD')}}</td>
                        <td style="border-right: 1px solid #adadad">{{item.apprDesc}}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
    <basic-info :grSlipNo="value.grSlipNo"/>
  </div>
</layout>
</template>

<script>
import _ from 'lodash'
import Layout from '@/components/ModalSlot2.vue'
import BasicInfo from '@/components/ApprBasicInfo.vue'
import ApprLineSet from '@/components/ApprLineSet.vue'
import ApprBundlePopDrafter from "@/components/ApprBundlePopDrafter.vue";
import mixinSlip from "@/mixin/slip";

export default {
  name:'ApprSubmNew',
  mixins: [mixinSlip],
  props: {
    title: {
      type: String,
      required: false,
      default: '결재상신'
    },
    docMngNo: {
        type: String,
        required: false
    },
    budReqNo: {
        type: String,
        required: false
    },
    docType: {
        type: String,
        required: false,
        default: 'SLIP'
    },
    value: {
        type: Object,
        required: false,
        default() {
            return {}
        }
    }
  },
  components: {
    Layout,
    BasicInfo,
  },
  data() {
    return {
        btnShow:true,
        apprNo: '',
        docTypeNm: '',
        docStatNm: '',
        docTitleNm: '',
        apprLine:[],
        apprSeq:'',
        thisApprUser:'',
    }
  },
  methods: {
    closePop() {
      this.$emit('close');
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
    addApprDesc(){
      return new Promise((resolve,reject) => {
        const vm = this
        this.$modal.open({
          component:ApprBundlePopDrafter,
          props:{
            docTitleNm:this.docTitleNm
          },
          events: {
            close(drafterData) {
              // Close event handler
              if(!_.isEmpty(drafterData)){
                //기안자 결재의견 set
                vm.apprLine[0].apprDesc = drafterData
                return resolve()
              }else{
                return reject()
              }
            }
          }
        })
      })
    },
    approval() {
        const that = this;

        if (this.apprLine.length < 1) {
            this.$swal({type: 'warning', text: '결재선을 지정해주세요.'});
            return false;
        }
      this.addApprDesc().then(() => {
        this.$swal({
            type: 'info',
            text: `결재내역을 상신합니다. 계속 하시겠습니까?`,
            showCancelButton: true,
            confirmButtonText: '예',
            cancelButtonText: '아니오',
        }).then((result) => {
            if (result.value) {
                this.$store.commit('loading');
                
                _.forEach(that.apprLine, (v, index) => {
                    v.apprSeq = index + 1
                })

                this.$http.put(`/api/appr/detail/req`, {
                    docTypeCd: that.docType,
                    docMngNo: that.value.grSlipNo,
                    docTitleNm: that.docTitleNm,
                    approvalDetails: that.apprLine
                })
                .then((response) => {
                    that.$store.commit('finish');
                    that.$swal({type: 'info', text: '상신이 완료되었습니다.'})
                    .then((result)=>{
                        if(result.value){
                            that.$emit('close','Y');
                        }
                    });
                })
                .catch((e) => {
                    that.$store.commit('finish');
                    that.$emit('close');
                });
            }
        })
      })
    },
    openVendorPopup(){
        let that = this
        this.$modal.open({
            component: ApprLineSet,
            props: {
                lineList: this.apprLine
            },
            parent: this,
            events: {
                close(data) {
                    // Close event handler
                    that.apprLine = data.lineList || []
                }
            }
        })
    },
    getApprDetail(){
        this.$http.get(`/api/appr/detail/${this.value.elecApprId}`)
        .then(response => {
            if (response.data) {

                this.apprLine = response.data.apprDetails;
                
                this.docStatNm = response.data.apprHeader[0].docStatNm;
                this.docTypeCd = response.data.apprHeader[0].docTypeCd;
                this.docStatus = response.data.apprHeader[0].docStatCd;
                this.draftUserId = response.data.apprHeader[0].draftUserId;
                this.docTitleNm = response.data.apprHeader[0].docTitleNm;
                this.apprNo = response.data.apprHeader[0].apprNo;
                
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
        })
    }
  },
  created() {
      
    if(this.docType === 'SLIP'){
        this.docTypeNm = '전표'
        this.docTitleNm = this.value.slipTypeNm + ' / ' + this.getNumberFormat(this.value.totAmt) + ' / ' + this.value.hdSgtxt
    }

    if(!_.isEmpty(this.value.elecApprId)){
        this.getApprDetail();
        this.btnShow = false;
    }

    this.apprLineRule()
  },

}
</script>
