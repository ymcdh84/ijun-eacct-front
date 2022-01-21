<template>
  <div class="inner-box">
      <div class="content-name">
          <h2 class="dp-ib">{{title}}</h2>
        <div class="btn-wrap btn-type1 clearfix">
            <button class="btn-size btn-blue fl_left" @click="approval" v-if="isShowBtn"><span class="btn-icon"><i class="fas fa-pen-alt"></i></span> 결재상신</button>
            <!-- <button class="btn-size btn-gray fl_left" @click="newPage"><span class="btn-icon"><i class="far fa-file"></i></span> 신규</button> -->
            <button class="btn-size btn-gray fl_left" @click="remove" v-if="showDeleteButton && isShowBtn"><span class="btn-icon"><i class="far fa-trash-alt"></i></span> 삭제</button>
            <button class="btn-size btn-blue fl_left" @click="save"><span class="btn-icon"><i class="fas fa-save"></i></span> 저장</button>
        </div>
      </div>

      <!-- 테이블 -->
      <div class="table-area">
          <slip-basic ref="header" :slipTypeCd="slipTypeCd" :slipHeader="slipHeader" :slipDetails="slipDetails" @changeViewMode="toggleDeleteButton" />
      </div>
      <!-- //테이블 -->
  </div>
</template>

<script>
// eslint-disable-next-line
import Vue from 'vue';
import mixin from '@/mixin';
import mixinSlip from '@/mixin/slip';
import SlipBasic from '@/components/SlipBasic.vue';
import ApprSubm from '@/views/ApprSubm.vue';
import _ from 'lodash'

export default {
  name: 'EbillSlipReg',
  components: { SlipBasic },
  props: ['grSlipNo', 'xml', 'copy','fromSlipLst'],
  mixins: [ mixin, mixinSlip ],
  data() {
    return {
      title: '전자세금계산서 전표',
      slipTypeCd: 'E3',
      slipHeader: {},
      slipDetails: [],
      showDeleteButton: false,
      copyMode: false,
    };
  },
  methods: {
    save() {
      console.log("저장해 봅시다.")

      // form validation
      if(!this.$refs.header.validation()) return;
      // if(!this.$refs.detail.validation()) return;

      const header = JSON.parse(JSON.stringify(this.$refs.header.form));
      const stripFields = ['evdDt','postDt','payDueDt','supAmt','vatAmt','etcAmt','totAmt'];
      
      //마이너스 전표 쳐지도록 toPure 제거
      // _.forEach(stripFields, (name) => header[name] = this.toPure(header[name]));
      _.forEach(stripFields, (name) => header[name] = header[name]);

      header.evdDt = this.$moment(header.evdDt).format('YYYYMMDD')
      header.postDt = this.$moment(header.postDt).format('YYYYMMDD')
      header.payDueDt = this.$moment(header.payDueDt).format('YYYYMMDD')
      // 전표유형
      header.slipTypeCd = this.slipTypeCd;
      // 작성일자 삭제
      header.wrtDtm = '';
      
      header.oriTotAmt = this.$refs.header.form.baseTotAmt;
      header.oriSupAmt = this.$refs.header.form.baseSupAmt;
      header.oriVatAmt = this.$refs.header.form.baseVatAmt;
      header.oriEtcAmt = this.$refs.header.form.baseEtcAmt;

      const grid = this.$refs.header.$refs.detail.$refs.grid;

      var details = [];
      var rowIds = [];
      var once = false;
      var creditAmts = [];

      for(var i=0; i <grid.getRowsNum(); i++) {
        let rowId = grid.getRowId(i);
        let rowObj = grid.getRowData(rowId);
        rowObj.acctAmt = _.toInteger(rowObj.creditAmt) + _.toInteger(rowObj.debitAmt);
        if(rowObj.dcCd === "D" && rowObj.lnTypeCd === "TAX") {
            if(document.getElementById("sel")) {
                var sel = document.getElementById("sel")
                var val = sel.options[sel.selectedIndex].value;
                var id = sel.options[sel.selectedIndex].id;
                rowObj.attribute10 = id
            }
        }

        rowObj.itemSeq = i + 1;
        
        // console.log(rowObj);
        details.push(rowObj);
        rowIds.push(rowId);
        creditAmts.push(this.$numeral(rowObj.debitAmt).value());

        var dcCd = grid.cells2(i,15).getValue();
        var lnTypeCd = grid.cells2(i,16).getValue();
        // 대표계정
        if(!once && dcCd === 'D' && lnTypeCd === 'ITEM') {
          header.stnAcctCd = grid.cells2(i,6).getValue();
          once = true;
        }
      }
      const credtAmt = creditAmts.reduce((a, v) => a+v)

      header.slipDetails = details;
      //이놈 다시 세팅해줘야한단다. 2020.01.02 fixed by 아무개
      header.baseDeptCd = header.cctrCd
      header.baseDeptNm = header.cctrNm
      //지급여부 헤더 컬럼 추가
      if(header.hdRef8) { header.hdRef8 = 'Y' } else { header.hdRef8 = null }
      
      if(header.totAmt === credtAmt) {
        this.$http.post(`/api/slip`, header)
        .then((response) => {
          //2020.08.25 '저장'문구 팝업
          this.$swal({type: 'success', text: '저장되었습니다.'})
          .then(()=> {
            this.copyMode = false;
            this.$route.params.copyEaSlipNo = undefined;
            this.getSlip(response.data.grSlipNo);
          });
        })
        .catch((e) => {
          console.error(e);
        });
      } else {
        this.$swal({type: 'warning', text: '차변금액과 대변금액이 일치하지 않습니다.\n차변금액을 조정해 주세요.'});
      }
      
    },
    remove() {
      const grSlipNo = this.$refs.header.form.grSlipNo;
      const slipStatCd = this.$refs.header.form.slipStatCd;
      console.log("삭제...", grSlipNo, slipStatCd)

      if(slipStatCd === '10' && grSlipNo != undefined) {
        this.$http.delete(`/api/slip/${grSlipNo}`)
            .then(response => {
              if(response.status === 200) {
                this.$swal({ type: 'warning', text: response.data });
                //삭제 후 리스트 페이지 이동
                if(this.fromSlipLst){
                  this.$router.push({
                    name: 'slipLst'
                  })
                }else{
                  this.$router.go(-1);
                }
              }
            });
      } else {
        this.$swal({ type: 'warning', text: '해당 전표를 삭제할 수 없습니다.' });
      }
    },
    getSlip(grSlipNo) {
      if(grSlipNo != undefined) {
        let url;
        if(this.copyMode === true) {
          url = `/api/slip/copy/${grSlipNo}`;
        } else {
          url = `/api/slip/${grSlipNo}`;
        }
        this.$store.commit('loading')
        this.$http.get(url)
          .then(response => {
            if(response.data) {
              this.slipHeader = response.data.slipHeader;
              this.slipDetails = response.data.slipDetails;
              
              if(this.copyMode === true) {
                delete this.slipHeader.fnlApprDtm
                delete this.slipHeader.elecApprDtm
              }

            }
          })
          .catch(({message}) => {
            console.error(message);
            // this.$swal({ type: 'warning', text: '해당 전표가 존재하지 않습니다.' });
          })
          .finally(()=> {
            this.$store.commit('finish')
          })
      }
    },
    getEtaxXml() {
      // 0: {key: "20", value: "전자-세금계산서"}
      // 1: {key: "21", value: "전자-계산서"}
      // 2: {key: "22", value: "전자-영세율"}
      if(this.xml ===undefined) {
        this.$router.push({path: `/ebillSlipRcvLst`})
      } else {
        setTimeout(() => {
          this.$store.commit('loading')
          this.$http.post(`/api/ebill`, this.xml)
            .then(({data}) => {
                if (data) {
                    let slipHeader = {
                        slipTypeCd: 'E3',
                        evdDt: data.issueDate,
                        postDt: data.issueDate,
                        evdCustBizNo: data.suId,
                        evdCustNm: data.suName,
                        evdCustCd: undefined,
                        supAmt: data.chargetotal,
                        vatAmt: data.taxtotal,
                        totAmt: data.grandtotal,
                        etaxNo: data.issueId,
                        etaxSeq: data.invSeq,
                        bpCd: data.bpCd,
                        payCustBizNo: data.bpId,
                        payCustNm: data.bpName === ' ' ? '' : data.bpName,
                        dtiType: this.xml.dtiType
                        // payCustBizNo: '1058658698',
                        // payCustNm: '토지적성평가원(주)',
                    }
                    if(slipHeader.evdCustBizNo) {
                      this.$http.get(`/api/vendor/E3/${slipHeader.evdCustBizNo}`)
                        .then(response => {
                          let header = response.data
                          if(header) {
                            // let f = header.filter(x => x.bizNo === slipHeader.evdCustBizNo)[0]
                            let f = header[0]
                            if (f !== undefined) {
                              slipHeader.evdCustCd = f.vendCd
                            }
                            this.slipHeader = slipHeader
                          }
                        })
                    }
                } else {
                    this.$router.push({path: `/ebillSlipRcvLst`})
                }
            },200)
            .catch(({message}) => {
            })
            .finally(() => {
              this.$store.commit('finish')
            })
          })
        }

    },
    toggleDeleteButton(value) {
      this.showDeleteButton = value;
      // console.log("showDeleteButton", this.showDeleteButton)
    },
    newPage() {
      this.$swal({
        type: 'warning',
        text: `변경된 데이터가 있습니다. 계속 하시겠습니까?`,
        showCancelButton: true,
        confirmButtonText: '예',
        cancelButtonText: '아니오',
      }).then((result) => {
        if(result.value) {
          // this.init();
          this.$router.push({ path: '/ebillSlipRcvLst' });
        }
      });
    },
    approval() {
        // console.log('$$$$$$ EBill')
        // console.log(JSON.stringify(this.slipHeader))
        // console.log(JSON.stringify(this.slipDetails))

        if (!this.slipHeader.grSlipNo) {
            this.$swal({type: 'warning', text: '저장 후 작업해주세요.'});
            return false;
        }

        this.slipHeader.slipDetails = this.slipDetails

        this.$modal.open({
            component: ApprSubm,
            props: {
                docType: 'SLIP',
                value: this.slipHeader
            },
            parent: this,
            fullScreen: true,
            width: 1200,
            events: {
                close() {
                    // console.log('닫힘 이벤트')
                }
            }
        })
    },
    /**
     * QUERY:CBO_VAT_DFF_40
     * 선납부가세증빙유형 목록 조회(사용 x)
     */
    queryCboVatDff40() {
      this.$http.get(`/api/code/combo`, {
        groupCd: 'CBO_VAT_DFF_40',
        compCd: '0'
      }).then(response => {
        if(response.data) {
          this.$refs.header.form.diff40  = response.data.filter(x => x.key === '0' || x.key === '1' || x.key === '2')
        }
      });
    },
    init() {
      this.copyMode = this.copy;
      
      if(this.grSlipNo) {
        this.getSlip(this.grSlipNo);
      } else {
        this.getEtaxXml()
      }
    }
  },
  computed: {
    isShowBtn(){
      if(this.slipHeader.grSlipNo && this.slipHeader.grSlipNo.substr(0,3)!=='TMP'){
        return true
      }else{
        return false
      }
    }
  },
  mounted() {
    this.init();
  },
  destroyed() {
    // this.$cookie.delete('searchForm')
    // this.$store.commit('searchForm', undefined);
  },
};
</script>

<style>
/* file-upload */
.file.has-name{width:265px;}
.file.has-name .file-cta{position:relative; height:46px; padding:0 25px; border:1px solid #adadad; font-family:'NotoM';  font-size:15px; color:#222; vertical-align:middle; background:none; border-right:none;}
.file.has-name .icon-bar{position:absolute; right:0; top:13px;}
.file .file-name{height:46px; border:1px solid #adadad!important; border-left:none!important; font-family:'RobotoM'; font-size:15px; color:#0065b3; vertical-align:middle; padding:11px 0 11px 25px;}
.file .file-name i{font-size:18px; margin:0 25px;}

.popup{width:680px;}
.popup .pop-content{width:630px;}

.td-s-thumb.search-area .ip-box,
.td-s-thumb.search-area .ip-box.ip-box-w02{width:60%;}

@media (max-width:1500px) {
    .rs-mt2{margin-top:2px; margin-bottom:2px;}
    .td-s-thumb.search-area .ip-box,
    .td-s-thumb.search-area .ip-box.ip-box-w02{width:80%;}
}
</style>
