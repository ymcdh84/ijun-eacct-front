<template>
    <div class="inner-box">
        <div class="content-name">
            <h2 class="dp-ib">{{title}}</h2>
            <div class="btn-wrap btn-type1 clearfix">
                <button class="btn-size btn-blue fl_left" @click="approval" v-if="isShowBtn"><span class="btn-icon"><i class="fas fa-pen-alt"></i></span> 결재상신</button>
                <button class="btn-size btn-gray fl_left" @click="newPage"><span class="btn-icon"><i class="far fa-file"></i></span> 신규</button>
                <button class="btn-size btn-gray fl_left" @click="remove" v-if="showDeleteButton && isShowBtn"><span class="btn-icon"><i class="far fa-trash-alt"></i></span> 삭제</button>
                <button class="btn-size btn-blue fl_left" @click="save"><span class="btn-icon"><i class="fas fa-save"></i></span> 저장</button>
            </div>
        </div>
        <!-- 테이블 -->
        <div class="table-area">
            <slip-basic ref="header" :slipTypeCd="slipTypeCd" :slipHeader="slipHeader" :slipDetails="slipDetails" @changeViewMode="toggleDeleteButton" @changeAccount="changeAccount"/>
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
        name: 'BillSlipReg',
        components: {SlipBasic, ApprSubm},
        props: ['grSlipNo', 'copy','fromSlipLst','params'],
        mixins: [mixin, mixinSlip],
        data() {
            return {
                // title: '수기세금계산서 전표',
                title: '수기세금계산서',
                slipTypeCd: 'E4',
                slipHeader: {},
                slipDetails: [],
                showDeleteButton: false,
                copyMode: false,
                showVendorModal1: false,
            };
        },
        methods: {
            save() {
              this.$swal({
                type: 'warning',
                text: `증빙일자는 저장후 수정되지 않습니다. 계속해서 저장 하시겠습니까?`,
                showCancelButton: true,
                confirmButtonText: '예',
                cancelButtonText: '아니오',
              }).then((result) => {
                if (result.value) {
                  //승인에 따른 resolve 처리
                if (!this.$refs.header.validation()) return;
                // if(!this.$refs.detail.validation()) return;

                const header = JSON.parse(JSON.stringify(this.$refs.header.form));
                const stripFields = ['evdDt', 'postDt', 'payDueDt', 'supAmt', 'vatAmt', 'etcAmt', 'totAmt'];
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

                const grid = this.$refs.header.$refs.detail.$refs.grid;

                var details = [];
                var rowIds = [];
                var once = false;
                var creditAmts = [];

                for (var i = 0; i < grid.getRowsNum(); i++) {
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

                    details.push(rowObj);
                    rowIds.push(rowId);
                    creditAmts.push(this.$numeral(rowObj.debitAmt).value());
                    var dcCd = grid.cells2(i, 15).getValue();
                    var lnTypeCd = grid.cells2(i, 16).getValue();

                    // 대표계정
                    if (!once && dcCd === 'D' && lnTypeCd === 'ITEM') {
                        header.stnAcctCd = grid.cells2(i, 6).getValue();
                        once = true;
                    }
                }
                const credtAmt = creditAmts.reduce((a, v) => a+v)

                header.slipDetails = details;
                //이놈 다시 세팅해줘야한단다. 2020.01.02 fixed by 아무개
                header.baseDeptCd = header.cctrCd
                header.baseDeptNm = header.cctrNm
                //header 카드정보 존재할 경우 space 제거 후 저장
                if(header.crdNo) {header.crdNo = header.crdNo.replace(/\s+/g, '')}
                //지급여부 헤더 컬럼 추가
                if(header.hdRef8) { header.hdRef8 = 'Y' } else { header.hdRef8 = null }
                
                if(header.totAmt === credtAmt) {
                    this.$http.post(`/api/slip`, header)
                    .then((response) => {
                        // console.log(response.data);
                        this.$swal({type: 'success', text: '저장되었습니다.'}).
                        then(()=> {
                            this.copyMode = false;
                            this.$route.params.copyEaSlipNo = undefined;
                            this.getSlip(response.data.grSlipNo);
                        });
                        
                    })
                    .catch((e) => {
                        console.error(e);
                    }).finally(() => {
                        this.$store.commit('finish');
                    });
                } else {
                    this.$swal({type: 'warning', text: '차변금액과 대변금액이 일치하지 않습니다.\n차변금액을 조정해 주세요.'});
                }
                }else{
                  //거부에 따른 return 처리
                }
              });
            },
            remove() {
                
                this.$swal({
                    type: 'warning',
                    text: `해당 전표 삭제 하시겠습니까?`,
                    showCancelButton: true,
                    confirmButtonText: '예',
                    cancelButtonText: '아니오',
                }).then((result) => {
                    if (result.value) {
                        const grSlipNo = this.$refs.header.form.grSlipNo;
                
                        if (grSlipNo != undefined) {
                            this.$http.delete(`/api/slip/${grSlipNo}`)
                                .then(response => {
                                    if (response.status === 200) {
                                        this.$swal({type: 'warning', text: response.data});
                                        if(this.fromSlipLst){
                                            this.$router.push({
                                            name: 'slipLst'
                                            })
                                        }else{
                                            this.$router.go(this.$router.currentRoute);
                                        }
                                    }
                                });
                        }
                        
                    }
                });                
            },
            getSlip(grSlipNo) {
                if (grSlipNo != undefined && grSlipNo != '0') {
                    let url;
                    if (this.copyMode === true) {
                        url = `/api/slip/copy/${grSlipNo}`;
                    } else {
                        url = `/api/slip/${grSlipNo}`;
                    }
                    this.$http.get(url)
                        .then(response => {
                            
                            if (response.data) {
                                this.slipHeader = response.data.slipHeader;
                                this.slipDetails = response.data.slipDetails;
                                
                                if(this.copyMode === true) {
                                    delete this.slipHeader.fnlApprDtm
                                    delete this.slipHeader.elecApprDtm
                                }
                                this.slipDetails.forEach(x => {
                                    if(x.dcCd === 'D' && x.lnTypeCd === 'TAX') {
                                        x.attribute10 = x.attribute10 || '1'
                                    }
                                    if(x.dcCd === 'D' && x.acctAmt === 0){
                                        x.acctAmt = '0'
                                    }
                                })
                                
                            }
                        })
                        .catch(({message}) => {
                            console.error(message);                            
                        });
                } else {console.log('grSlipNo undefined!!')}
            },
            toggleDeleteButton(value) {
                this.showDeleteButton = value;
            },
            newPage() {
                this.$swal({
                    type: 'warning',
                    text: `변경된 데이터가 있습니다. 계속 하시겠습니까?`,
                    showCancelButton: true,
                    confirmButtonText: '예',
                    cancelButtonText: '아니오',
                }).then((result) => {
                    if (result.value) {
                        this.$router.replace({name: 'billSlipReg', params: {grSlipNo: 0}});
                        this.$router.go(this.$router.currentRoute);
                    }
                });
            },
            approval() {

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
            init() {
                this.copyMode = this.copy;
                console.log("수기 전표번호 수신", this.grSlipNo, this)
                this.getSlip(this.grSlipNo);
            },
            changeAccount(value){
                if(!_.isEmpty(value.custAcctNo)){
                    this.slipHeader.custAcctNo = value.custAcctNo
                    this.slipHeader.custBnkCd = value.custBnkCd
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
          document.title = this.title + ' - IJEAS';
            this.init();
        },
        destroyed() {
            // this.$cookie.delete('searchForm')
            // this.$store.commit('searchForm', undefined);
        },
        watch: {
            'form.taxCd'(value) {
              console.log('get form tax ', value)
            },
        }
    };
</script>

<style>
    /* file-upload */
    .file.has-name {
        width: 265px;
    }

    .file.has-name .file-cta {
        position: relative;
        height: 46px;
        padding: 0 25px;
        border: 1px solid #adadad;
        font-family: 'NotoM';
        font-size: 15px;
        color: #222;
        vertical-align: middle;
        background: none;
        border-right: none;
    }

    .file.has-name .icon-bar {
        position: absolute;
        right: 0;
        top: 13px;
    }

    .file .file-name {
        height: 46px;
        border: 1px solid #adadad !important;
        border-left: none !important;
        font-family: 'RobotoM';
        font-size: 15px;
        color: #0065b3;
        vertical-align: middle;
        padding: 11px 0 11px 25px;
    }

    .file .file-name i {
        font-size: 18px;
        margin: 0 25px;
    }

    .popup {
        width: 680px;
    }

    .popup .pop-content {
        width: 630px;
    }

    .td-s-thumb.search-area .ip-box,
    .td-s-thumb.search-area .ip-box.ip-box-w02 {
        width: 60%;
    }

    @media (max-width: 1500px) {
        .rs-mt2 {
            margin-top: 2px;
            margin-bottom: 2px;
        }

        .td-s-thumb.search-area .ip-box,
        .td-s-thumb.search-area .ip-box.ip-box-w02 {
            width: 80%;
        }
    }
</style>

