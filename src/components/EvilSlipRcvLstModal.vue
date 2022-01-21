<template>
  <layout>
    <span slot="header">{{title}}<button class="btn-pop-close delete" aria-label="close" @click="closeModal"></button></span>

    <div slot="content">
        <div class="content-name">
            <div class="btn-wrap btn-type1 clearfix">
                <button class="btn-size btn-blue fl_right" @click="goSearch"><span class="btn-icon"><i
                        class="fas fa-pen-alt"></i></span> 조회
                </button>

                <button class="btn-size btn-blue fl_right" @click="sevenMonth" style="margin-right: 10px"><span class="btn-icon">
                    <i class="far fa-calendar-alt"></i></span> 7개월
                </button>
            </div>
        </div>

        <!-- 검색조건 영역 -->
        <div class="desc-content search-border">
            <div class="item desc-left">
                <div class="desc-item">
                    <div class="tit">
                        <span class="label-tit">- 공급일자</span>
                    </div>
                    <div class="desc">
                        <div class="datepicker w-type-ymd02">
                            <dhx-calendar class="input ddate sDate" v-model="form.issueDateFrom" />
                        </div>
                        <span class="wave"> ~ </span>
                        <div class="datepicker w-type-ymd02">
                            <dhx-calendar class="input ddate sDate" v-model="form.issueDateTo" />
                        </div>
                    </div>
                </div>
                <div class="desc-item">
                    <div class="tit">
                        <span class="label-tit">- 승인번호</span>
                    </div>
                    <div class="desc" style="width : 250px">
                        <input class="input Rt-M tal" type="text" v-model="form.issueId" >
                    </div>
                </div>
            </div>
            <div class="item desc-center">
                <div class="desc-item">
                    <div class="tit">
                        <span class="label-tit">- 공급자</span>
                    </div>
                    <div class="desc">
                        <input class="input Rt-M tal" type="text" v-model="form.suName">
                    </div>
                </div>
                <div class="desc-item">
                    <div class="tit">
                        <span class="label-tit">- 사업자번호</span>
                    </div>
                    <div class="desc">
                        <input class="input Rt-M tal" type="text" v-model="form.suId">
                    </div>
                </div>
            </div>
            <div class="item desc-right">
                <div class="desc-item" style="margin-left: 10px">
                    <div class="tit">
                        <span class="label-tit">- 처리상태</span>
                    </div>
                    <div class="desc">
                        <b-select class="select is-fullwidth" v-model="form.dealStatCd">
                            <option value=''>==전체==</option>
                            <option
                                    v-for="item in dealStats"
                                    :key="item.key"
                                    :value="item.key"
                                    v-text="item.value"/>
                        </b-select>
                    </div>
                </div>
            </div>
        </div>
        <!-- //검색조건 영역 -->

        <!-- 테이블 -->
        <div class="table-area">

            <div class="table-b">
                <div class="table-header">
                    <div class="table-name">
                        <h3 class="ico_table_name">수신내역</h3>
                    </div>
                </div>
                <div class="grid-wrap">
                    <dhx-grid ref="grid" v-model="rcvList" :config="config" @constructGridSuccessful="constructGridSuccessful"/>
                </div>
            </div>
        </div>
        <!-- //테이블 -->

        <!--팝업-->
        <b-modal :active.sync="showCctrModal" has-modal-card @receive="receiveCctr">
            <cctr :param="form.wrtDeptNm"></cctr>
        </b-modal>
        <!--//팝업 -->
    </div>
  </layout>
</template>

<script>
import mixin from '@/mixin'
import mixinSlip from '@/mixin/slip'
import _ from 'lodash'

import Layout from '@/components/ModalSlot.vue'

import assert from '@/libs/assert'
import DhxCalendar from '@/components/DhxCalendar.vue'
import DhxGrid from '@/components/DhxGrid.vue'
import Cctr from '@/components/Cctr.vue'
import Emp from '@/components/Emp.vue'



export default {
  name: 'evilSlipRcvLst',
  props: ['issueId','grSlipNo','vendorNm','vendorCd'],
  components: {Cctr, Emp, DhxCalendar, DhxGrid, Layout},
  mixins: [ mixin, mixinSlip ],
  data() {
    return {
      config : {
          columns: [
            {id: 'no', type: 'cntr', align: 'center', sort: 'na', value: 'No.', width: 35},
            {id: 'issueId', type: 'ro', align: 'center', sort: 'na', value: '전자세금계산서<br>승인번호', width: 200},
            {id: 'dealStatNm', type: 'ro', align: 'center', sort: 'na', value: '처리상태', width: 70},
            {id: 'issueDate', type: 'ro', align: 'center', sort: 'na', value: '공급일자', width: 100},
            {id: 'eaSlipNo', type: 'ro', align: 'center', sort: 'na', value: '전표번호', width: 120},
            {id: 'statusNm', type: 'ro', align: 'center', sort: 'na', value: '전표상태', width: 100},
            {id: 'suName', type: 'ron', align: 'left', sort: 'na', value: '공급자', width: 150},
            {id: 'suId', type: 'ron', align: 'center', sort: 'na', value: '#cspan', width: 120},
            {id: 'suIndtype', type: 'ron', align: 'left', sort: 'na', value: '#cspan', width: 140},
            {id: 'chargetotal', type: 'ron', align: 'right', sort: 'na', value: '금액', width: 120},
            {id: 'taxtotal', type: 'ron', align: 'right', sort: 'na', value: '#cspan', width: 120},
            {id: 'grandtotal', type: 'ron', align: 'right', sort: 'na', value: '#cspan', width: 120},
            {id: 'dtiTypeNm', type: 'ro', align: 'center', sort: 'na', value: '세금계산서<br>종류', width: 130},
            {id: 'amendName', type: 'ro', align: 'left', sort: 'na', value: '수정사유', width: 140},
            {id: 'bpName', type: 'ro', align: 'center', sort: 'na', value: '수탁사업자', width: 100},
            {id: 'bpId', type: 'ro', align: 'center', sort: 'na', value: '#cspan', width: 100},
            {id: 'ipName', type: 'ro', align: 'center', sort: 'na', value: '공급받는자', width: 100},
            {id: 'ipMin', type: 'ro', align: 'center', sort: 'na', value: '#cspan', width: 100},
            {id: 'ipEmail1', type: 'ro', align: 'left', sort: 'na', value: '#cspan', width: 180},
            {id: 'ipPersname1', type: 'ro', align: 'center', sort: 'na', value: '#cspan', width: 100},
            {id: 'ipDeptname1', type: 'ro', align: 'center', sort: 'na', value: '#cspan', width: 100},
            {id: 'compCd', type: 'ro', align: 'center', sort: 'na', value: ''},
            {id: 'bpCd', type: 'ro', align: 'center', sort: 'na', value: ''},
            {id: 'issueDate', type: 'ro', align: 'center', sort: 'na', value: ''},
            {id: 'invSeq', type: 'ro', align: 'center', sort: 'na', value: ''},
          ],
            height: 390,
            enablePaging: true,
            pagingSize: 8,
            afterRefreshData(grid, data) {
                this.$nextTick(() => {
                    _.forEach(data, (item, index) => {
                        let rId = index + 1
                        grid.cells(rId, 3).setValue(this.$moment(grid.cells(rId, 3).getValue()).format('YYYY-MM-DD'));
                    })
                })
            }
        },
        title: '전자세금계산서',
        dealStats: [],
        rcvList: [],
        form: {
            issueDateFrom: this.$moment().add(-1, 'month').startOf('month').format('YYYY-MM-DD'),
            issueDateTo: this.$moment().format('YYYY-MM-DD'),
            ipDeptcode1: '',
            ipDeptname1: '',
            suName: '',
            issueId: '',
            dealStatCd: '10',
            grSlipNo:'',
            vendorNm:'',
            suId : ''
        },
        showCctrModal: false,
        showEmpModal: false,

    }
  },
  methods: {
      closeModal(){
        this.$parent.close();
      },
      constructGridSuccessful(grid) {
            // this.config.queryPage(0)
            grid.setNumberFormat('0,000', 9, '.', ',')
            grid.setNumberFormat('0,000', 10, '.', ',')
            grid.setNumberFormat('0,000', 11, '.', ',')
            grid.setColumnHidden(21,true)
            grid.setColumnHidden(22,true)
            grid.setColumnHidden(23,true)
            grid.setColumnHidden(24,true)
            grid.attachHeader(
                ["#rspan", "#rspan", "#rspan", "#rspan", "#rspan", "#rspan", "회사", "사업자등록번호", "업종", "공급가액", "부가세액", "합계금액", "#rspan", "#rspan", "회사", "사업자등록번호", "회사", "종사업장", "E-Mail", "담당자", "부서"],
            )

            grid.attachEvent('onRowDblClicked', (rId) => {
                let issueId = grid.cells(rId, 1).getValue();
                let issueDate = grid.cells(rId, 3).getValue();

                this.$http.get(`/api/erp/etax/${this.form.grSlipNo}/${issueId}`)
                    .then((result) => {
                        this.$emit('close', issueId+","+issueDate)
                    })
                    .catch(({message}) => {
                    console.error(message);
                });;
            });
        },
        getDealStatCombo() {
            this.$http.get(`/api/code/combo`, {params: {groupCd: "DEAL_STAT_CD"}})
                .then(response => {
                    this.dealStats = response.data;
                });
        },
        sevenMonth() {
            this.form.issueDateFrom = this.$moment().add(-7, 'month').startOf('month').format('YYYY-MM-DD')
        },
        goSearch() {
            const param = JSON.parse(JSON.stringify(this.form));

            const stripFields = ['issueDateFrom', 'issueDateTo', 'issueId'];

            _.forEach(stripFields, (name) => param[name] = this.toPure(param[name]));
            // 임시로 조건 삭제
            param.ipDeptname1 = '';

            if (!this.validation(param)) return;


            this.$store.commit('loading');
            this.$http.post(`/api/ebill/rcv-list`, param)
                .then(response => {
                    if (response.data) {
                        // set data
                        this.rcvList = response.data;

                        this.$store.commit('finish');
                    }
                });
        },
        validation(param) {
            if (!param.issueDateFrom || !param.issueDateTo) {
                this.$swal({type: 'warning', text: '공급일자를 입력해 주세요.'});
                return false;
            }
            return true;
        },
        popCctr(clear) {
            if (clear === true) {
                this.form.ipDeptcode1 = '';
                this.form.ipDeptname1 = '';
            }
            this.showCctrModal = true;
        },
        receiveCctr(obj) {
            this.form.ipDeptcode1 = obj.cctrCd;
            this.form.ipDeptname1 = obj.cctrNm;
        },
        initCctr(force) {
            if (force === true) this.form.ipDeptname1 = '';
            if (this.form.ipDeptname1 === '') this.form.ipDeptcode1 = '';
        },
    },
    mounted() {
        this.form.ipDeptcode1 = this.$store.state.loginInfo.loginDeptCd;
        this.form.ipDeptname1 = this.$store.state.loginInfo.loginDeptNm;
        this.getDealStatCombo();
        
        if(this.$props.grSlipNo) {
            this.form.grSlipNo = this.$props.grSlipNo
        }

        if(this.$props.issueId) {
            this.form.issueId = this.$props.issueId          
        }else{

            if(this.$props.vendorCd) {
                this.form.suId = this.$props.vendorCd
            }

            // if(this.$props.vendorNm) {
            //     this.form.suName = this.$props.vendorNm
            // }
        }
        this.goSearch();
    },
    watch: {
        // 'issueId': {
        //     immediate: true,
        //     deep: true,
        //     handler(value) {
        //         if(value !== undefined && value !== ""){
        //             //const valueArr = value.split(",");
        //             //this.form.issueId = valueArr[0]
        //             //this.form.issueDateFrom = valueArr[1]
        //             this.goSearch()
        //         }
        //     }
        // },
        // 'grSlipNo': {
        //     immediate: true,
        //     deep: true,
        //     handler(value) {
        //         if(value !== undefined){
        //             this.form.grSlipNo = value
        //         }
        //     }
        // },
        // 'vendorNm': {
        //     immediate: true,
        //     deep: true,
        //     handler(value) {
        //         if(value !== undefined){
        //            this.form.suName = value
        //         }
        //     }
        // },
    }


  // created() {
  //   this.params = _.clone(defaultParams)

  //   /**
  //    * Query SLIP_TYPE_CD
  //    */
  //   this.$http.get('/api/code/detail', {
  //     params: {
  //       groupCd: 'SLIP_TYPE_CD'
  //     }
  //   }).then(response => {
  //     this.options['SLIP_TYPE_CD'] = response.data
  //     this.options['SLIP_TYPE_CD'].unshift({
  //       detailCd: undefined,
  //       detailNm: '==전체=='
  //     })
  //   })

  //   /**
  //    * Query SLIP_STAT_CD
  //    */
  //   this.$http.get('/api/code/detail', {
  //     params: {
  //       groupCd: 'SLIP_STAT_CD'
  //     }
  //   }).then(response => {
  //     this.options['SLIP_STAT_CD'] = response.data.filter(x => x.remark1 === 'Y' && x.detailCd >= '50')
  //     this.options['SLIP_STAT_CD'].unshift({
  //       detailCd: undefined,
  //       detailNm: '==전체=='
  //     })
  //   })

  //   // this.query()
  // }
};
</script>

<style scoped>
div#gridbox {
  width: 100%;
  height: 100%;
  min-height: 300px;
}
div.modal-card {
  width: 100%;
}

</style>

