<template>
  <div class="inner-box">
    <div class="content-name">
      <h2 class="dp-ib">{{ title }}</h2>
      <div class="btn-wrap btn-type1 clearfix">
        <button class="btn-size btn-blue fl_left" @click="goSearch">
          <span class="btn-icon"><i class="fas fa-pen-alt"></i></span> 조회
        </button>
      </div>
    </div>

    <!-- 검색조건 영역 -->
        <div class="desc-content search-border">
            <div class="item search_wrap">
                <div class="search_box">
                    <div class="search_title">
                        <span class="search_tit">- 기안일자</span>
                    </div>
                    <div class="search_con">
                        <div class="datepicker w-type-ymd02">
                            <dhx-calendar class="input ddate sDate" v-model="form.searchDtmFr" />
                        </div>
                        <span class="wave"> ~ </span>
                        <div class="datepicker w-type-ymd02">
                            <dhx-calendar class="input ddate sDate" v-model="form.searchDtmTo" />
                        </div>
                    </div>
                </div>
                <div class="search_box">
                    <button class="item-list icon is-right btn_s_w" @click="openModal()" type="button">상세검색<i class="fas fa-plus"></i></button>
                </div>


                <!-- 상세검색 내용 -->
                <div id="open-moda" class="modal-window">
                    <div class="modal-window-wrap">
                        <div class="modal-window-top">
                            <h4>상세검색</h4>
                            <button title="Close" @click="closeModal()" type="button" class="bt-modal-close mt5"><img src="../../public/img/bt_close_w.png" /></button>    
                        </div>
                        
                        <div class="search_box_wrap">
                            <div class="search_box_pop">
                                <div class="search_title">
                                    <span class="search_tit">- 기안일자</span>
                                </div>
                                <div class="search_con search-area">
                                    <div class="datepicker w-type-ymd02 w30p">
                                        <dhx-calendar class="input ddate sDate" v-model="form.searchDtmFr" />
                                    </div>
                                    <span class="datepicker w10p dp-ib tac"> ~ </span>
                                    <div class="datepicker w-type-ymd02 w30p">
                                        <dhx-calendar class="input ddate sDate" v-model="form.searchDtmTo" />
                                    </div>
                                    <button @click="dateSetting('toDay')" class="search_bt_white_s">당일</button>
                                    <button @click="dateSetting('crrntMnth')" class="search_bt_white_s">당월</button>
                                    <button @click="dateSetting('PrvsMnth')" class="search_bt_white_s">전월</button>
                                </div>
                            </div>

                            <div class="search_box_pop">
                                <div class="search_title">
                                    <span class="search_tit">- 문서코드</span>
                                </div>
                                <div class="search_con search-area">
                                    <b-select class="select is-fullwidth w100p" v-model="form.docTypeCd">
                                      <option value="">==전체==</option>
                                      <option
                                        v-for="item in docTypes"
                                        :key="item.key"
                                        :value="item.key"
                                        v-text="item.value"
                                      />
                                    </b-select>
                                </div>
                            </div>

                            <div class="search_box_pop">
                                <div class="search_title">
                                    <span class="search_tit">- 부서</span>
                                </div>
                                <div class="search_con search-area">
                                    <input class="input dp-ib input-bg w30p_5r" type="text" v-model="form.cctrCd" disabled />
                                    <input class="input dp-ib w70p" type="text" v-model="form.cctrNm" @input="initCctr" @keypress.enter="popCctr" />
                                    <button class="icon is-right" @click="popCctr()"><i class="fas fa-search"></i></button>
                                </div>
                            </div>

                            <div class="search_box_pop">
                                <div class="search_title">
                                    <span class="search_tit">- 기안자</span>
                                </div>
                                <div class="search_con search-area">
                                    <input class="input input-bg dp-ib w20p_5r" type="text" v-model="form.draftUserDut" disabled />
                                    <input class="input input-bg dp-ib w20p_5r" type="text" v-model="form.draftUserDept" disabled />
                                    <input class="input input-bg dp-ib w20p_5r" type="text" v-model="form.draftUserId" disabled />
                                    <div class=" w20p_5r ps_rl dp-ib">
                                      <input class="input" type="text" v-model="form.draftNm" @input="initEmp" @keypress.enter="popEmp" />
                                      <button class="icon is-right" @click="popEmp(true)"><i class="fas fa-search"></i>
                                      </button>
                                    </div>
                                    <div class=" dp-ib w20p">
                                    <input type="checkbox" id="delegateChk" v-model="checked" /><label for="delegateChk" class="s_font">위임포함</label>
                                    </div>
                                </div>
                            </div>

                            <div class="search_box_pop">
                                <div class="search_title">
                                    <span class="search_tit">- 제목</span>
                                </div>
                                <div class="search_con search-area">
                                    <input class="input Rt-M tal w100p" type="text" v-model="form.docTitleNm" />
                                </div>
                            </div>
                        </div>

                        <div class="modal-window-bottom">
                            <ul>
                                <li>
                                    <button class="bt_blue_s" @click="goSearch">검색</button> 
                                </li>
                                <li>
                                    <button @click="closeModal()" title="Close" class="bt_white_s">닫기</button>
                                </li>
                            </ul>
                             
                            
                        </div>

                    </div>
                </div>
                <!-- //상세검색 내용 -->
            </div>
        </div>
        <!-- //검색조건 영역 -->

    <!-- 테이블 -->
    <div class="table-area">
      <div class="table-b">
        <div class="table-header">
          <div class="table-name">
            <h3 class="ico_table_name">결재할 목록</h3>
          </div>

          <div class="btn-wrap btn-type1 clearfix">
            <div style="float: left; padding-top: 10px; margin-right: 10px">
              총 금액 : {{ $numeral(totalAmt).format("0,0") }}
            </div>
            <button class="btn-size btn-gray" @click="allChk">
              <span class="btn-icon"><i class="fas fa-check"></i></span>
              전체선택
            </button>
            <button class="btn-size btn-blue fl_left" @click="approval()">
              <span class="btn-icon"><i class="far fa-file"></i></span>
              일괄결재
            </button>
            <button class="btn-size btn-excel" @click="saveExcel">
              엑셀 저장
            </button>
          </div>
        </div>
        <div class="grid-wrap">
          <ag-grid-vue
            ref="grid"
            style="width: 100%;"
            class="ag-theme-alpine grid_search_height"
            :columnDefs="columnDefs"
            :gridOptions="gridOptions"
            :defaultColDef="defaultColDef"
            :rowData="pendList"
            :rowSelection="rowSelection"
            :frameworkComponents="frameworkComponent"
            @rowDoubleClicked="rowDoubleClick"
            @cell-value-changed="cellValueChange"
          />
          <!-- <dhx-grid ref="grid" v-model="pendList" :config="config" @constructGridSuccessful="constructGridSuccessful"/> -->
        </div>
      </div>
    </div>
    <!-- //테이블 -->
  </div>
</template>

<script>
import mixin from "@/mixin";
import mixinSlip from "@/mixin/slip";
import _ from "lodash";

import DhxCalendar from "@/components/DhxCalendar.vue";
import DhxGrid from "@/components/DhxGrid.vue";
import SlipDetailModal from "@/components/SlipDetailModal.vue";
import SlipPayDetailModal from "@/components/SlipPayDetailModal.vue";
import SlipEtcDetailModal from "@/components/SlipEtcDetailModal.vue";
import GlDetailModal from "@/components/GlDetailModal.vue";
import PayrollSlipModal from "@/components/PayrollSlipModal.vue";
import BulkSlipModal from "@/components/BulkSlipModal.vue";
import ApprBundlePop from "@/components/ApprBundlePop.vue";

import Emp_Ag from "@/components/Emp_Ag.vue";
import Cctr_Ag from "@/components/Cctr_Ag.vue";
import { AgGridVue } from "ag-grid-vue";
import AgGridCheckbox from "@/components/agGrid/AgGridCheckbox.vue";
import ApprSubm from "@/views/ApprSubm";

export default {
  name: "ApprPendLst_new",
  mixins: [mixin, mixinSlip],
  components: {DhxGrid, DhxCalendar, AgGridVue },
  props: {
    params: {
      type: Object,
      required: false,
    },
  },
  data() {
    return {
      columnDefs: [],
      gridOptions: {},
      defaultColDef: {},
      title: "결재할 문서",
      docTypes: [],
      pendList: [],
      checked: "checked",
      showEmpModal: false,
      form: {
        docTypeCd: "",
        searchDtmFr: '',
        searchDtmTo: '',
        draftUserId: "",
        draftNm: "",
        draftUserDut: "",
        draftUserDept: "",
        delegateChk: "",
        docTitleNm: "",
        page: 0,
        cctrCd: "",
        cctrNm: "",
      },
      syncGoPage: false,
      totalAmt: 0, //2020.06.04 전체금액 변수
      chkYn: false,
      rowSelection: 'multiple',
      frameworkComponent: {
        checkBox: AgGridCheckbox,
      },
    };
  },
  methods: {
    rowDoubleClick(response) {
      let slipTypeCd = response.data.slipTypeCd;
      let docMngNo = response.data.apprNo;
      let grSlipNo = response.data.docMngNo;
      switch (slipTypeCd) {
        case "E1": //개인비용
        case "E2": //개인비용외
        case "E3": //전자
        case "E4": //수기
        case "E5": //법인카드 분할전표
          this.$cookie.set('searchForm', JSON.stringify(this.form));
          this.$store.commit('searchForm', JSON.parse(this.$cookie.get('searchForm')));
          this.$router.push({ path: `/apprDtlQry/${docMngNo}` });
          break;
        // case "E5": //일괄비용등록.-->사용 X
        //   this.$modal.open({
        //     component: BulkSlipModal,
        //     props: {
        //       grSlipNo: grSlipNo,
        //       docMngNo: docMngNo,
        //       loaded: false,
        //     },
        //     parent: this,
        //     width: 1200,
        //   });
        //   break;
        default:
          if(response.data.docTypeCd === 'BDGT'){
            var vm = this
            this.$modal.open({
              component: ApprSubm,
              props: {
                docType: response.data.docTypeCd,
                budReqNo: response.data.docMngNo,
                docMngNo : response.data.apprNo,
                // value: this.data
              },
              parent: this,
              width: 1200,
              events: {
                close(data) {
                  // if (callback !== undefined && typeof callback === 'function') {
                  //   callback.apply(this, [data])
                  // }
                  vm.goSearch();
                }
              }
            })
          }
          else{
          this.showDetailPop(grSlipNo, slipTypeCd, docMngNo);
          }
          break;
      }
    },
    showDetailPop(grSlipNo, slipTypeCd, docMngNo) {
      let title = "";
      let setModal = undefined;
      switch (slipTypeCd) {
        case 'E11' :
          title = '자금지급전표'
          setModal = SlipPayDetailModal
          break;
        case 'E12' :
          title = '구매전표'
          setModal = SlipDetailModal
          break;
        case 'E13' :
          title = '공사비전표'
          setModal = SlipDetailModal
          break;
        case 'E14' :
          title = '기타전표'
          setModal = SlipEtcDetailModal
          break;
        default:
          title = "작업중";
          setModal = SlipDetailModal;
          break;
      }
      this.$modal.open({
        component: setModal,
        parent: this,
        props: {
          grSlipNo: grSlipNo,
          slipTypeCd: slipTypeCd,
          docMngNo: docMngNo,
          title: title,
        },
        width: 1200,
      });
    },
    makeColDef() {
      this.columnDefs = [
        {
          headerName: "#",
          field: "useYn",
          width: 60,
          cellRenderer: "checkBox",
        },
        {
          headerName: "No.",
          width: 65,
          valueFormatter: (params) => {
            return params.node.rowIndex + 1;
          },
        },
        {
          headerName: "문서유형",
          field: "docType",
          width: 90,
          cellStyle: { textAlign: "left" },
        },
        {
          headerName: "문서상태",
          field: "docStatNm",
          width: 90,
          cellStyle: { textAlign: "left" },
        },
        {
          headerName: "제목",
          field: "docTitleNm",
          width: 345,
          cellStyle: { textAlign: "left" },
        },
        {
          headerName: "결재유형",
          field: "apprType",
          width: 90,
          cellStyle: { textAlign: "left" },
        },
        {
          headerName: "결재구분",
          field: "apprStatus",
          width: 90,
          cellStyle: { textAlign: "left" },
        },
        {
          headerName: "결재번호",
          field: "apprNo",
          width: 150,
          cellStyle: { textAlign: "left" },
        },
        {
          headerName: "문서번호",
          field: "docMngNo",
          width: 150,
          cellStyle: { textAlign: "left" },
        },
        {
          headerName: "부서",
          field: "wrtDeptNm",
          width: 90,
          cellStyle: { textAlign: "left" },
        },
        {
          headerName: "기안자사번",
          field: "draftUserId",
          width: 100,
          cellStyle: { textAlign: "left" },
        },
        {
          headerName: "기안자",
          field: "draftUserName",
          width: 90,
          cellStyle: { textAlign: "left" },
        },
        {
          headerName: "직급",
          field: "draftUserJob",
          width: 90,
          cellStyle: { textAlign: "left" },
        },
        {
          headerName: "기안일자",
          field: "draftDtm",
          width: 120,
          cellStyle: { textAlign: "left" },
        },
        {
          headerName: "타입",
          field: "slipTypeCd",
          width: 100,
          cellStyle: { textAlign: "left" },
          hide: true,
        },
        {
          headerName: "apprSeq",
          field: "apprSeq",
          width: 100,
          cellStyle: { textAlign: "left" },
          hide: true,
        },
        {
          headerName: "금액",
          field: "totAmt",
          width: 100,
          cellStyle: { textAlign: "left" },
          hide: true,
        },
      ];
    },
    onGridReady() {
      this.gridOptions.api.sizeColumnsToFit();
    },
    cellValueChange(params) {
      if (params.data.useYn) {
        this.totalAmt = Number(this.totalAmt) + Number(params.data.totAmt);
      } else {
        this.totalAmt = Number(this.totalAmt) - Number(params.data.totAmt);
      }
    },
    allChk() {
      var filterList = [];

      this.gridOptions.api.forEachNodeAfterFilter((v, i) => {
          filterList.push(v.data.docMngNo)
      })

      this.chkYn = this.chkYn ? false : true;

      for(var i=0; i<filterList.length; i++){
          for(var j=0; j<this.pendList.length; j++){
              if(filterList[i] === this.pendList[j].docMngNo){
                this.pendList[j].useYn = this.chkYn;
                if (this.chkYn) {
                  this.cellValueChange({ data: this.pendList[j] });
                }else{
                  this.totalAmt = 0;
                }
              }
          }
      }

      var size = this.$refs.grid.$children.length;
      for(var k=0; k<size; k++){
          this.$refs.grid.$children[k].select = this.chkYn;
      }
      
    },
    getDocTypeCombo() {
      this.$http
        .get(`/api/code/combo`, { params: { groupCd: "DOC_TYPE_CD" } })
        .then((response) => {
          this.docTypes = response.data;
        });
    },
    saveExcel() {
      var params = {
        fileName : "결재할 문서"
      };
      this.gridOptions.api.exportDataAsCsv(params)
    },
    goSearch() {
      const param = JSON.parse(JSON.stringify(this.form));
      const stripFields = ["searchDtmFr", "searchDtmTo"];
      _.forEach(
        stripFields,
        (name) => (param[name] = this.toPure(param[name]))
      );

      if (param.searchDtmFr > param.searchDtmTo) {
        this.$swal({
          type: "warning",
          text: "조회 시작일자와 종료일자 지정이 잘못되었습니다.",
        });
        return false;
      }

      let deleChk = "";
      if (this.checked) deleChk = "Y";

      this.$store.commit("loading");
      this.$http
        .post(`/api/appr/todo/list`, {
          docTypeCd: param.docTypeCd,
          searchDtmFr: this.toPure(param.searchDtmFr) === '0' ? '' : this.toPure(param.searchDtmFr),
          searchDtmTo: this.toPure(param.searchDtmTo) === '0' ? '' : this.toPure(param.searchDtmTo),
          draftUserId: param.draftUserId,
          acctCd: param.acctCd,
          delegateChk: deleChk,
          docTitleNm: param.docTitleNm,
          wrtDeptCd: this.form.cctrCd,
        })
        .then((response) => {
          if (response.data) {
            this.pendList = response.data;
            _.forEach(this.pendList, (x, i) => {
              x.useYn = false;
            });
            this.totalAmt = 0;
            this.chkYn = false;
          }
        })
        .finally(() => {
          this.$store.commit("finish");
        });
        document.getElementById("open-moda").style.opacity = "0";
        document.getElementById("open-moda").style.pointerEvents = "none";
    },
    openModal() {
        document.getElementById("open-moda").style.opacity = "1";
        document.getElementById("open-moda").style.pointerEvents = "auto";
    },
    closeModal() {
        document.getElementById("open-moda").style.opacity = "0";
        document.getElementById("open-moda").style.pointerEvents = "none";
    },
    approval() {
      let that = this;

      //일괄승인 대기중
      let apprList = this.pendList.filter((x) => x.useYn === true);
      let deleteNoUseArg = []
      for (const item of apprList) {
        delete item.approvalDetails
        delete item.taxAttachCd
        deleteNoUseArg.push(item)
      }
      apprList = deleteNoUseArg
      if (apprList.length > 0) {
        if(apprList.length > 20){
          this.$swal({type: 'warning', text: '최대 20건까지 선택해서 일괄 승인할 수 있습니다.'})
              .then((result)=>{
                  if(result.value){
                      that.totAmt = 0;
                      for(var i=0; i<apprList.length; i++){
                        if(i < 20){
                          that.pendList[i].useYn = true;
                          that.$refs.grid.$children[i].params.node.setDataValue('useYn', true)
                          that.cellValueChange({ data: that.pendList[i] });
                        }else{
                          that.pendList[i].useYn = false;
                        }
                      }

                      var size = that.$refs.grid.$children.length;
                      for(var j=0; j<size; j++){
                        that.$refs.grid.$children[j].select = that.$refs.grid.$children[j].params.data.useYn
                      }
                  }
              });

        }else{
          this.$modal.open({
            component: ApprBundlePop,
            props: {
              apprList,
            },
            parent: this,
            events: {
              close(data) {
                // Close event handler
                console.log("Appr Popup Close Event!!", data);
                that.goSearch();
              },
            },
          });
        }
        
      } else {
        this.$swal({ type: "warning", text: "선택하신 전표정보가 없습니다." });
      }
    },
    popEmp(clear) {
      const that = this;
      this.$modal.open({
        width: 800,
        component: Emp_Ag,
        parent: this,
        props: {
          param: this.form.draftNm,
        },
        events: {
          close(data) {
            that.form.draftUserId = data.empNo;
            that.form.draftNm = data.empNm;
            that.form.draftUserDut = data.dutNm;
            that.form.draftUserDept = data.deptNm;
          },
        },
      });
    },
    initEmp(force) {
      if (force === true) this.form.draftNm = "";
      if (this.form.draftNm === "") {
        this.form.draftUserId = "";
        this.form.draftUserDut = "";
        this.form.draftUserDept = "";
      }
    },
    popCctr() {
      const that = this;

      this.$modal.open({
        width: 800,
        component: Cctr_Ag,
        parent: this,
        props: {
          param: this.form.cctrNm,
        },
        events: {
          close(data) {
            that.form.cctrCd = data.cctrCd;
            that.form.cctrNm = data.cctrNm;
          },
        },
      });
    },
    initCctr(force) {
      if (force === true) this.form.cctrNm = "";
      if (this.form.cctrNm === "") this.form.cctrCd = "";
    },
    dateSetting(str){
      switch (str) {
        case 'toDay':
          this.form.searchDtmFr = this.$moment().format('YYYYMMDD')
          this.form.searchTo = this.$moment().format('YYYYMMDD')
          break;
        case 'crrntMnth':
          this.form.searchDtmFr = this.$moment().startOf('month').format('YYYYMMDD')
          this.form.searchDtmTo = this.$moment().endOf('month').format('YYYYMMDD')
          break;
        case 'PrvsMnth':
          this.form.searchDtmFr = this.$moment().add(-1, 'month').startOf('month').format('YYYYMMDD')
          this.form.searchDtmTo = this.$moment().add(-1, 'month').endOf('month').format('YYYYMMDD')
          break;
      }
      // this.goSearch()
    }
  },
  beforeMount() {
    const that = this;

    this.makeColDef();
    this.defaultColDef = { resizable: true, filter: true, sortable: true };
    this.gridOptions = {
      onFilterChanged: () => {
        that.chkYn = false;
        that.totalAmt = 0;

        for(var j=0; j<that.pendList.length; j++){
          that.pendList[j].useYn = that.chkYn
        }

        var size = that.$refs.grid.$children.length;
        for(var k=0; k<size; k++){
            that.$refs.grid.$children[k].select = that.chkYn;
        }

      }
    }

  },
  mounted() {
    document.title = this.title + ' - IJEAS';
    this.getDocTypeCombo();
    this.goSearch();
  },
  watch: {
    params: {
      immediate: true,
      deep: true,
      handler(value) {
        if (value && value.searchDtmFr) {
          this.form = value;
          if (this.form.page > 0) {
            this.syncGoPage = true;
          }
        }
      },
    },
  },
};
</script>

<style scoped>
.desc-content:after {
  clear: both;
  content: "";
  display: block;
}

.btn-wrap {
  margin-bottom: 10px;
}

.desc-content {
  border: 2px solid #9db6c9;
  background: #f9fafc;
  margin: 0 0 20px 0;
  border-radius: 4px;
  padding: 15px 2%;
  clear: both;
}

.desc-content .item {
  float: left;
}

.desc-content .item .desc-item {
  position: relative;
  padding-left: 82px;
  margin-bottom: 8px;
}

.desc-content .item .desc-item:last-child {
  margin-bottom: 0;
  height: 25px;
}

.desc-content .item .desc-item .tit {
  position: absolute;
  left: 0;
}

.desc-content .item .desc-item .label-tit {
  font-family: "NotoM";
  color: #222;
  font-size: 15px;
}

.desc-content .item.desc-left .desc-item {
  padding-left: 80px;
}
.datepicker.w-type-ymd02 {
  width: 114px;
}

.desc-content .item.desc-left .desc-item .desc:after {
  clear: both;
  content: "";
  display: block;
}

.desc-content .item.desc-left .desc-item .desc .datepicker {
  float: left;
}

.desc-content .item.desc-left .desc-item .desc span.wave {
  float: left;
  padding: 0 6px;
}

.desc-content .item.desc-left .desc-item .td-s-thumb.search-area input,
.desc-content .item.desc-left .desc-item .td-s-thumb.search-area .ip-box {
  float: left;
}

.desc-content .item.desc-left .desc-item .desc.select select {
  width: 70%;
}

.desc-content .item.desc-left {
  width: 38%;
  padding-right: 20px;
}

.desc-content .item.desc-center {
  width: 35%;
  padding-right: 40px;
}

.desc-content .item.desc-right {
  width: 27%;
}

.search-area input {
  position: relative;
}

.search-area .icon {
  position: absolute;
  right: 8px;
  top: 1px;
  z-index: 100;
  cursor: pointer;
  font-size: 16px;
  color: #555;
}

.search-border .td-s-thumb {
  position: relative;
  display: inline-block;
}

.search-border .td-s-thumb.search-area > input,
.search-border
  .td-s-thumb.search-area
  > .ip-box
  .search-border
  .td-s-thumb.search-area
  > button {
  float: left;
}

.search-border .td-s-thumb.search-area .ip-box.ip-box-w02 {
  width: 60%;
  margin-left: 6px;
}

.search-border .td-s-thumb.search-area .ip-box {
  vertical-align: top;
}

@media (max-width: 1580px) {
  .search-border .td-s-thumb.search-area .ip-box.ip-box-w02 {
    width: 50%;
  }
}
</style>

