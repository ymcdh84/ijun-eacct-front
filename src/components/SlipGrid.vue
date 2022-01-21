<template>
    <div class="table-b">
        <div class="table-header">
            <div class="table-name">
                <h3 class="ico_table_name">{{title}}</h3>
            </div>
            <div class="btn-wrap btn-type2">

                <button class="btn-size btn-w-gray" @click="clearGrid"><span class="btn-icon"><i class="fas fa-redo"></i></span>초기화</button>
                <button class="btn-size btn-w-gray" @click="addRow"><span class="btn-icon"><i class="fas fa-plus"></i></span>행추가</button>
                <button class="btn-size btn-w-gray" @click="deleteRow"><span class="btn-icon"><i class="fas fa-trash-alt"></i></span>행삭제</button>
            </div>
        </div>
        <div class="grid-wrap" ref="test">
            <div ref="grid" id="gridbox" class="grid-tbl-box grid-slip"></div>
        </div>

      <popup-grid ref="pop" :slipTypeCd="slipTypeCd" :deptCd="popup.deptCd"  @returnValue="setCellValue"></popup-grid>
        <!-- <select-grid ref="select" style="display: none;" @returnValue="selectReturn"></select-grid> -->

    </div>
</template>
<script>
/* eslint-disable */
import Vue from 'vue';
import mixin from '@/mixin';
import mixinSlip from '@/mixin/slip';
import _ from 'lodash'

import PopupGrid from '@/components/PopupGrid.vue';
// import SelectGrid from '@/components/grid/SelectGrid.vue';

export default {
  name: 'SlipGrid',
  components: { PopupGrid },
  props: ['slipDetails','form', 'slipTypeCd'],
  mixins: [ mixin, mixinSlip ],
  data() {
    return {
      title: '세부항목',
      grid: {
        head: [
          {id: 'itemSeq', type: 'cntr', align: 'center', sort: 'na', value: 'No.', width: 35},
          {id: 'dcNm', type: 'ro', align: 'center', sort: 'na', value: '유형', width: 40},
          {id: 'taxCd', type: 'ro', align: 'center', sort: 'na', value: '세금코드', width: 60},
          {id: 'cctrCd', type: 'ro', align: 'center', sort: 'na', value: '비용부서코드', width: 100},
          {id: 'cctrNm', type: 'ed', align: 'left', sort: 'na', value: '비용부서명', width: 120},
          {id: 'cctrSrch', type: 'ro', align: 'center', sort: 'na', value: '#cspan', width: 40},
          {id: 'acctCd', type: 'ro', align: 'center', sort: 'na', value: '계정코드', width: 80},
          {id: 'acctNm', type: 'ed', align: 'left', sort: 'na', value: '계정명', width: 140},
          {id: 'acctSrch', type: 'ro', align: 'center', sort: 'na', value: '#cspan', width: 40},
          {id: 'dff', type: 'ro', align: 'center', sort: 'na', value: '#cspan', width: 40},
          {id: 'subAcctCd', type: 'ro', align: 'center', sort: 'na', value: '보조계정코드', width: 80},
          {id: 'subAcctNm', type: 'ed', align: 'left', sort: 'na', value: '보조계정명', width: 140},
          {id: 'acctSrchSub', type: 'ro', align: 'center', sort: 'na', value: '#cspan', width: 40},
          {id: 'productCd', type: 'ed', align: 'center', sort: 'na', value: '현장(계약번호)코드', width: 80},
          {id: 'productNm', type: 'ed', align: 'left', sort: 'na', value: '현장(계약번호)', width: 140},
          {id: 'prodSrch', type: 'ro', align: 'center', sort: 'na', value: '#cspan', width: 40},
          {id: 'debitAmt', type: 'edn', align: 'right', sort: 'na', value: '차변금액', width: 90},
          {id: 'creditAmt', type: 'ron', align: 'right', sort: 'na', value: '대변금액', width: 90},
          {id: 'lnSgtxt', type: 'ed', align: 'left', sort: 'na', value: '적요'},
          {id: 'dcCd', type: 'ro', align: 'center', sort: 'na', value: '', width: 0},
          {id: 'lnTypeCd', type: 'ro', align: 'center', sort: 'na', value: '', width: 0},
          {id: 'attribute10', type: 'ro', align: 'center', sort: 'na', value: '선납부가세<br>증빙유형', width: 80},//vatEvdTypeCd
          {id: 'attribute1', type: 'ro', value: '', width: 0},
          {id: 'attribute2', type: 'ro', value: '', width: 0},
          {id: 'attribute3', type: 'ro', value: '', width: 0},
          {id: 'attribute4', type: 'ro', value: '', width: 0},
          {id: 'attribute5', type: 'ro', value: '', width: 0},
          {id: 'attribute6', type: 'ro', value: '', width: 0},
          {id: 'attribute7', type: 'ro', value: '', width: 0},
          {id: 'attribute8', type: 'ro', value: '', width: 0},
          {id: 'attribute9', type: 'ro', value: '', width: 0},
          {id: 'attribute10', type: 'ro', value: '', width: 0},
          {id: 'attribute11', type: 'ro', value: '', width: 0},
          {id: 'attribute12', type: 'ro', value: '', width: 0},
          {id: 'attribute13', type: 'ro', value: '', width: 0},
          {id: 'attribute14', type: 'ro', value: '', width: 0},
          {id: 'attribute15', type: 'ro', value: '', width: 0},
          {id: 'reqSubAcct', type: 'ro', value: '', width: 0},
        ],
        data: [],
      },
      line: {
        creditAcctCd: '',
        creditAcctNm: '',
        debitAcctCd: '',
        debitAcctNm: '',
      },
      popup: {
        rId: -1,
        cInd: -1,
        acctCd:'',
        rowData:{},
        deptCd:'',
      },
      searchDept: "<button class='icon fl_right' onclick='popCctr();'><i class='fas fa-search'></i></button>",
      searchAcct: "<button class='icon fl_right' onclick='popAccount();'><i class='fas fa-search'></i></button>",
      searchAcctSub: "<button class='icon fl_right' onclick='popAccountSub();'><i class='fas fa-search'></i></button>",
      searchProduct: "<button class='icon fl_right' onclick='popProduct();'><i class='fas fa-search'></i></button>",
      selectCombo: "<select class='input is-fullwidth' name='sel' id='sel' style='width:100%; height:100%;'>"+
      "<option key='0' value='기타' id='0'>기타</option>"+
      "<option key='1' value='종이' id='1'>종이</option>"+
      "<option key='2' value='전자' id='2'>전자</option>"+
      "</select>",
      dff:"<button class='icon fl_right' onclick='popDff();'><i class='fas fa-search'></i></button>",
      rowCount: 0,
      showVatLine: true,
      isSyncAmt: true,
      // 잔여예산
      rmnBudget: 0,
      baseDeptGrCd: '', // 부서 계정 그룹 코드
      sgaProductCd : '9999999', //판관부서 현장(계약코드)
    };
  },
  methods: {
    getVatAccount() {
      this.$http.get(`/api/account/vat`)
          .then(response => {
            if(response.data) {
              this.line.debitAcctCd = response.data.acctCd;
              this.line.debitAcctNm = response.data.acctNm;
              /*2020.08.13 부서코드 확인 후 그리드 원래위치 
              if(this.$parent.viewMode !== undefined && !this.$parent.viewMode) {
                  this.setInitGrid();
              }
              */
            }
          });
    },
    drawGrid() {
      // eslint-disable-next-line
      const iljinGrid = new dhtmlXGridObject('gridbox');
      this.$refs.grid = iljinGrid;

      iljinGrid.setColumnHidden(13,true);
      iljinGrid.setColumnHidden(19,true);
      iljinGrid.setColumnHidden(20,true);
      //21부터 15개
      for(var i = 22; i <= 36; i++){
        iljinGrid.setColumnHidden(i,true);
      }

      iljinGrid.attachHeader(["합계","#cspan","#cspan","#cspan","#cspan","#cspan","#cspan","#cspan","#cspan","#cspan","#cspan","#cspan","#cspan","","","#cspan","#stat_total","#stat_total","","","",""]);
      iljinGrid.setNumberFormat("0,000",16,'.',',');
      iljinGrid.setNumberFormat("0,000",17,'.',',');
      
      iljinGrid.enableEditEvents(true,false,true);  // click, dblclick, F2key

      iljinGrid.init();
      iljinGrid.parse(this.grid,"js");
      iljinGrid.enableAutoWidth(true);
      iljinGrid.enableAutoHeight(false);
      
      iljinGrid.attachEvent("onCellChanged", (rId,cInd,nValue) => {
        if(cInd === 3 || cInd === 6) {
          const dcCd = this.$refs.grid.cells(rId,19).getValue();
          const lnTypeCd = this.$refs.grid.cells(rId,20).getValue();
          const cctrCd = this.$refs.grid.cells(rId,3).getValue();
          const acctCd = this.$refs.grid.cells(rId,6).getValue();
        }
      });

      iljinGrid.attachEvent("onEnter", (rId,cInd) => {        
        
        if(cInd === 4) this.cctrValueChange(rId,cInd);        

        if(cInd === 7) this.acctValueChange(rId,cInd);        

        if(cInd === 11) this.subAcctValueChange(rId,cInd);
        
        if(cInd === 14) this.productValueChange(rId,cInd);                        
      });
      
      iljinGrid.attachEvent("onRowSelect", (rId, cInd) => {
        // console.log("셀위치 [", rId, cInd, "]", this.$refs.grid.cells(rId,15).getValue(), this.$refs.grid.cells(rId,16).getValue(), this.$refs.grid.getRowData(rId))
        this.form.deptCd = this.deptCd = this.$refs.grid.getRowData(rId).cctrCd
        this.popup.deptCd = this.$refs.grid.getRowData(rId).cctrCd;
        this.popup.rId = rId;
        this.popup.cInd = cInd;
        this.popup.acctCd = this.$refs.grid.getRowData(rId).acctCd
        this.popup.rowData = this.$refs.grid.getRowData(rId)
      });

      iljinGrid.attachEvent("onMouseOver", (rId, cInd) => {
        this.popup.deptCd = this.$refs.grid.getRowData(rId).cctrCd;
        this.popup.rId = rId;
        this.popup.cInd = cInd;
      });
    },
    setProjectCdAll(rowId){
      const rowsNum = this.$refs.grid.getRowsNum();

      const projCd = this.$refs.grid.cells(rowId,13).getValue();
      const projNm = this.$refs.grid.cells(rowId,14).getValue();
      
      for(var i = 1; i < rowsNum; i++) {
        this.$refs.grid.cells(rowId + i,14).setValue(projNm);
        this.$refs.grid.cells(rowId + i,13).setValue(projCd);
      }
    },
    calcDebitAmt(rId) {
      const debitAmt = this.$numeral(_.reduce(this.$refs.grid.collectValues(16), (a, b) => { return this.$numeral(a).value() + this.$numeral(b).value(); })).value() || 0
      const creditAmt = this.$numeral(_.reduce(this.$refs.grid.collectValues(17), (a, b) => { return this.$numeral(a).value() + this.$numeral(b).value(); })).value() || 0
      console.log('debitAmt ', debitAmt, ' creditAmt ', creditAmt)
      // 차변금액 자동계산
      let overAmt = debitAmt - creditAmt;
      
      const rowsNum = this.$refs.grid.getRowsNum();
      for(var i=rowsNum-1; i >=0; i--) {
        var rowId = this.$refs.grid.getRowId(i);
        var dcCd = this.$refs.grid.cells2(i,18).getValue();
        var lnTypeCd = this.$refs.grid.cells2(i,20).getValue();

        if(rId !== rowId && dcCd === 'D' && lnTypeCd === 'ITEM') {
          let targetAmt = this.$refs.grid.cells2(i,16).getValue() || 0;
          if(overAmt > 0) { // 행이 추가된 경우
            if(targetAmt > overAmt) {
              this.$refs.grid.cells2(i,16).setValue(targetAmt - overAmt);
              break;
            } else {
              if(targetAmt > 0) {
                let remain = (overAmt) - (targetAmt);
                this.$refs.grid.cells2(i,16).setValue(targetAmt - remain);
                overAmt -= remain;
              }else {
                this.$refs.grid.cells2(i,16).setValue(targetAmt - overAmt);
              }
            }
          } else {  // 행이 삭제된 경우
            this.$refs.grid.cells2(i,16).setValue(targetAmt - overAmt);
            break;
          }

        }
      }
      this.refreshGrid();
    },
    refreshGrid() {
      this.$refs.grid.callEvent('ongridreconstructed',[]);
    },
    getNewRowId() {
      return ++this.rowCount;
    },
    setInitGrid(force) {  
      
      //부서 계정 그룹코드 조회(1:판관, 2:원가, COMMON:공통)
      this.$http
        .get('/api/cctr/erp/' + this.form.cctrCd)
        .then(response => {
          this.baseDeptGrCd = response.data[0].expenseFlag;

          this.setDefaultLine(1);
      
          if(force) {
            this.setTaxCd();
            this.setBaseDept();
            this.setCreditAccount();
            this.setVatAmt();
            this.setHdSgtxt();
            this.setSupAmt();
            this.setTotAmt();
          }
        }).finally(() => {
            //간헐적으로 세부항목 차,대 금액이 세팅 안되는 문제로 인해 추가 2021.03.18
            //비동기 처리가 안되어 있음, watch문이 난무
            this.setVatAmt();
            this.setTotAmt();
            this.setSupAmt();
        })
      
    },
    setDefaultLine(expItemCnt) {
  
      this.addRow({ dcCd: 'C', lnTypeCd: 'ITEM', acctCd: this.form.apAcctCd, acctNm: this.form.apAcctNm, search: false, select: false,searchdff:true});
      
      if(!this.$parent.hideVat) {
        this.addRow({ dcCd: 'D', lnTypeCd: 'TAX', acctCd: this.line.debitAcctCd, acctNm: this.line.debitAcctNm, search: false, select: true,searchdff:true});
        this.onInput();
      }

      for(var i=0; i<expItemCnt; i++) {

        this.addRow({ dcCd: 'D', 
                      lnTypeCd: 'ITEM', 
                      search: true, 
                      searchSub: true, 
                      select: false, 
                      searchdff:true, 
                      // productCd: this.baseDeptGrCd === "1" ? this.sgaProductCd : '',
                      // productNm: this.baseDeptGrCd === "1" ? this.sgaProductCd : ''
                      });
      }
    },
    setGridStyle() {
      this.doLineAction(this.$refs.grid, {
        credit: (grid,rId) => grid.lockRow(rId, true),
        vat: (grid,rId) => grid.lockRow(rId, true),
        cost: (grid,rId) => {
          this.setCellClassName(grid, rId, [2,4,5,7,8,9,11,12,14,15,16,18], 'bg-lightpink');
          grid.cells(rId,13).setDisabled(true);
        },
        all: (grid,rId) => {
          this.setCellClassName(grid, rId, [2, 4, 7, 18], 'tal');
          this.setCellClassName(grid, rId, [16, 17], 'tar');
        }
      });
    },
    clearGrid() {
      this.$refs.grid.clearAll();
      this.setInitGrid(true);
    },
    addRow(data) {
      const rId = this.getNewRowId();

      //선택된 row가 있을경우 다음 row에 추가
      let selRowId = this.$refs.grid.getSelectedRowId();
      let rowIndex = this.$refs.grid.getRowIndex(selRowId);

      if(rowIndex === -1 || rowIndex === 0){
      
        this.$refs.grid.addRow(rId, [
          null,
          data.dcCd === 'C'?'대변':'차변',
          this.form.taxCd,
          this.form.cctrCd,
          this.form.cctrNm,
          data.search === false? null : this.searchDept,
          data.acctCd,
          data.acctNm,
          data.search === false? null : this.searchAcct,
          data.searchdff === false? null : this.dff,
          data.subAcctCd,
          data.subAcctNm,
          data.search === false? null : this.searchAcctSub,
          this.baseDeptGrCd === "1" ? this.sgaProductCd : '',
          this.baseDeptGrCd === "1" ? this.sgaProductCd : '',
          // data.productCd ? data.productCd : '',
          // data.productNm ? data.productNm : '',
          this.searchProduct,
          null,
          null,
          this.form.hdSgtxt,
          data.dcCd ? data.dcCd : 'D',
          data.lnTypeCd ? data.lnTypeCd : 'ITEM',
          data.select ? this.selectCombo : null
        ]);
      }else{
        this.$refs.grid.addRow(rId, [
          null,
          data.dcCd === 'C'?'대변':'차변',
          this.form.taxCd,
          this.form.cctrCd,
          this.form.cctrNm,
          data.search === false? null : this.searchDept,
          data.acctCd,
          data.acctNm,
          data.search === false? null : this.searchAcct,
          data.searchdff === false? null : this.dff,
          data.subAcctCd,
          data.subAcctNm,
          data.search === false? null : this.searchAcctSub,
          this.baseDeptGrCd === "1" ? this.sgaProductCd : '',
          this.baseDeptGrCd === "1" ? this.sgaProductCd : '',
          // data.productCd ? data.productCd : '',
          // data.productNm ? data.productNm : '',
          this.searchProduct,
          null,
          null,
          this.form.hdSgtxt,
          data.dcCd ? data.dcCd : 'D',
          data.lnTypeCd ? data.lnTypeCd : 'ITEM',
          data.select ? this.selectCombo : null
        ], rowIndex + 1);
      }
      
      this.setGridStyle();

      return rId;
    },
    deleteRow() {
      const rowsNum = this.$refs.grid.getRowsNum();
      const tax = this.$parent.taxes.find(x => x.taxCd == this.form.taxCd);
      let maxRowNum = 3;

      if(tax && tax.taxRt === 0) maxRowNum = 2;

      if(rowsNum > maxRowNum) {
        let id = this.$refs.grid.getSelectedRowId();
        if (id === null) {
          this.$swal({
            type: "warning",
            text: "삭제할 행을 선택해주세요.",
          });
        } else {
          if(id === "1" || id === "2" || id === "3"){
            this.$swal({ type: 'info', text: '기본으로 생성된 유형은 삭제할 수 없습니다.' });
          }else{
            this.$refs.grid.deleteRow(id);
          }
        }
      } else {
        this.$swal({ type: 'info', text: '더 이상 삭제할 수 없습니다.' });
        return;
      }
    },
    setTaxCd() {
      const rowsNum = this.$refs.grid.getRowsNum();
      for(var i=0; i <rowsNum; i++) {
        this.$refs.grid.cells2(i,2).setValue(this.form.taxCd);
      }
      
      const tax = this.$parent.taxes.find(x => x.taxCd == this.form.taxCd);
      if(tax) {
        if(tax.taxRt === 0) {
          this.form.vatAmt = 0;
          this.$emit('setHideVat', true);

          for(var i=rowsNum-1; i >=0; i--) {
            var rowId = this.$refs.grid.getRowId(i);
            var dcCd = this.$refs.grid.cells2(i,19).getValue();
            var lnTypeCd = this.$refs.grid.cells2(i,20).getValue();
          }
          
          this.changeRowId(this.$refs.grid);
        } else {
            for(var i=rowsNum-1; i >=0; i--) {
              var rowId = this.$refs.grid.getRowId(i);
              var dcCd = this.$refs.grid.cells2(i,19).getValue();
              var lnTypeCd = this.$refs.grid.cells2(i,20).getValue();
              if(dcCd === 'D' && lnTypeCd === 'TAX') {
                this.$refs.grid.cells2(1, 5).setValue(false) //2020.07.16 세금코드에 따른 계정변경 활성화
                this.$refs.grid.cells2(1, 8).setValue(false) 
                this.$refs.grid.cells2(1, 12).setValue(false) 
                

                this.$refs.grid.cells2(i, 6).setValue(this.line.debitAcctCd)
                this.$refs.grid.cells2(i, 7).setValue(this.line.debitAcctNm)
              }
            
          }

          this.$emit('setHideVat', false);
          this.showVatLine = true;
        }
      }
      this.setVatAmt();
    },
    setBaseDept() {
      const rowsNum = this.$refs.grid.getRowsNum();
      for(var i=0; i <rowsNum; i++) {
        this.$refs.grid.cells2(i,3).setValue(this.form.cctrCd);
        this.$refs.grid.cells2(i,4).setValue(this.form.cctrNm);
      }
    },
    setTaxItemBaseDept() {
      const rowsNum = this.$refs.grid.getRowsNum();
      for(var i=0; i <rowsNum; i++) {
        var dcCd = this.$refs.grid.cells2(i,19).getValue();
        var lnTypeCd = this.$refs.grid.cells2(i,20).getValue();
        
        this.$refs.grid.cells2(i,3).setValue(this.form.baseDeptCd);
        this.$refs.grid.cells2(i,4).setValue(this.form.baseDeptNm);
        
      }
    },
    setVatAccount() {
      const rowsNum = this.$refs.grid.getRowsNum();
      for(var i=0; i <rowsNum; i++) {
        var dcCd = this.$refs.grid.cells2(i,19).getValue();
        var lnTypeCd = this.$refs.grid.cells2(i,20).getValue();

        if(dcCd === 'D' && lnTypeCd === 'TAX') {
          this.$refs.grid.cells2(i,6).setValue(this.line.debitAcctCd);
          this.$refs.grid.cells2(i,7).setValue(this.line.debitAcctNm);
        }
      }
    },
    // 대변계정이 선택될 경우
    setCreditAccount() {
      const rowsNum = this.$refs.grid.getRowsNum();
      if(rowsNum > 0) {
        for(var i=0; i <rowsNum; i++) {
          var dcCd = this.$refs.grid.cells2(i,19).getValue();
          var lnTypeCd = this.$refs.grid.cells2(i,20).getValue();

          if(dcCd === 'C' && lnTypeCd === 'ITEM') {
            this.$refs.grid.cells2(i,6).setValue(this.form.apAcctCd);
            this.$refs.grid.cells2(i,7).setValue(this.form.apAcctNm);
          }
        }
      } else {
          console.log('setCreditAccount    !@!@')
          // else 경우 setInitGrid 호출하는 이유?
          // this.setInitGrid();
      }
    },
    setHdSgtxt() {
      if(this.$refs.grid) {
        const rowsNum = this.$refs.grid.getRowsNum();
        for(var i=0; i <rowsNum; i++) {
          this.$refs.grid.cells2(i,18).setValue(this.form.hdSgtxt);
        }
      }
    },
    setSupAmt() {
      if(this.$refs.grid) {
        // const amt = _.parseInt(this.toPure(this.form.supAmt)||0) + _.parseInt(this.toPure(this.form.etcAmt)||0);
        //const amt = this.$numeral(this.form.supAmt).value() + this.$numeral(this.form.etcAmt).value();

        //const rowsNum = this.$refs.grid.getRowsNum();
        for(var i=0; i <3; i++) {
          var dcCd = this.$refs.grid.cells2(i,19).getValue();
          var lnTypeCd = this.$refs.grid.cells2(i,20).getValue();

          if(dcCd === 'D' && lnTypeCd === 'ITEM') {
            //this.$refs.grid.cells2(i,12).setValue(this.form.supAmt);
            this.$refs.grid.cells2(i,16).setValue(this.form.supAmt);
          }
        }
      }
    },
    setVatAmt() {
      if(this.$refs.grid && this.$refs.grid.getRowsNum() > 0) {
        const rowsNum = this.$refs.grid.getRowsNum();
        for(var i=0; i <rowsNum; i++) {
          var dcCd = this.$refs.grid.cells2(i,19).getValue();
          var lnTypeCd = this.$refs.grid.cells2(i,20).getValue();

          if(dcCd === 'D' && lnTypeCd === 'TAX') {
            // this.$refs.grid.cells2(i,12).setValue(this.toPure(this.form.vatAmt));
            if(this.form.vatAmt === 0){
              this.$refs.grid.cells2(i, 16).setValue('0')
            }else{
              this.$refs.grid.cells2(i, 16).setValue(this.$numeral(this.form.vatAmt).value())
            }
          }
        }
      }
    },
    setTotAmt() {
      if(this.$refs.grid && this.$refs.grid.getRowsNum() > 0) {
        const rowsNum = this.$refs.grid.getRowsNum();
        for(var i=0; i <rowsNum; i++) {
          var dcCd = this.$refs.grid.cells2(i,19).getValue();
          var lnTypeCd = this.$refs.grid.cells2(i,20).getValue();

          if(dcCd === 'C' && lnTypeCd === 'ITEM') {
            // this.$refs.grid.cells2(i,13).setValue(this.toPure(this.form.totAmt));
            this.$refs.grid.cells2(i, 17).setValue(this.$numeral(this.form.totAmt).value())
          }
        }
        this.refreshGrid();
      }
    },
    setCellValue(data) {
      if(this.$refs.grid) {
        if(data.name === 'account') {
          //2020.08.07 불공제 저장 후 계정명 변경 가능 하도록 수정
          this.$refs.grid.cells(this.popup.rId,6).setValue(data.acctCd);
          this.$refs.grid.cells(this.popup.rId,7).setValue(data.acctNm);

          //[START] 2021.02.05 보조계정 필수 입력 및 보조계정 값 세팅
          this.$refs.grid.cells(this.popup.rId,37).setValue(data.reqSubAcct);

          if(data.subAcctCd){
            this.$refs.grid.cells(this.popup.rId,10).setValue(data.subAcctCd);
            this.$refs.grid.cells(this.popup.rId,11).setValue(data.subAcctNm);
          }else{
            this.$refs.grid.cells(this.popup.rId,10).setValue("");
            this.$refs.grid.cells(this.popup.rId,11).setValue("");
          }
          //[END]

          if(this.$refs.grid && this.$refs.grid.getRowsNum() > 0) {
            const rowsNum = this.$refs.grid.getRowsNum();
            for(var i=0; i <rowsNum; i++) {
              var dcCd = this.$refs.grid.cells2(i,19).getValue();
              var lnTypeCd = this.$refs.grid.cells2(i,20).getValue();
              if(dcCd === 'D' && lnTypeCd === 'TAX') {
                if(this.form.taxCd === '10006') {
                  this.$refs.grid.cells(i+1,6).setValue(data.acctCd);
                  this.$refs.grid.cells(i+1,7).setValue(data.acctNm);
                }
              }
            }
          }

          if(data.reqSubAcct && !data.subAcctCd){
            //보조계정 팝업 호출
            this.$refs.pop.popAccountSub(this.popup.rId, this.popup.cInd, data.acctCd, this.slipTypeCd)
          }
        } else if(data.name === 'accountSub') {
          this.$refs.grid.cells(this.popup.rId,10).setValue(data.subAcctCd);
          this.$refs.grid.cells(this.popup.rId,11).setValue(data.subAcctNm);
        } else if(data.name === 'cctr') {
          this.$refs.grid.cells(this.popup.rId,3).setValue(data.deptCd);
          this.$refs.grid.cells(this.popup.rId,4).setValue(data.deptNm);

          //판관부서 현장계약번호 default 세팅
          if(data.expenseFlag === "1"){                  
            this.$refs.grid.cells(this.popup.rId,13).setValue(this.sgaProductCd);
            this.$refs.grid.cells(this.popup.rId,14).setValue(this.sgaProductCd);
          }else{
            this.$refs.grid.cells(this.popup.rId,13).setValue('');
            this.$refs.grid.cells(this.popup.rId,14).setValue('');
          }          

          //계정, 보조계정, 관리항목 초기화 [START]
          this.$refs.grid.cells(this.popup.rId,6).setValue("");
          this.$refs.grid.cells(this.popup.rId,7).setValue("");
          this.$refs.grid.cells(this.popup.rId,10).setValue("");
          this.$refs.grid.cells(this.popup.rId,11).setValue("");

          for(var i = 22; i <= 36; i++){
            this.$refs.grid.cells(this.popup.rId,i).setValue("");          
          }
          //계정, 보조계정, 관리항목 초기화 [END]   

        } else if(data.name === 'product') {
          this.$refs.grid.cells(this.popup.rId,14).setValue(data.detailNm);
          this.$refs.grid.cells(this.popup.rId,13).setValue(data.detailCd);

          //대변의 현장(계약번호)가 변경시 비용라인의 현장(계약번호) 동일하게 변경  
          const vm = this
          const dcCd = vm.$refs.grid.cells(this.popup.rId,19).getValue();
          const dcNm = vm.$refs.grid.cells(this.popup.rId,1).getValue();
          
          if(dcNm === "대변") {
            this.setProjectCdAll(this.popup.rId);
          }

        } else if(data.name === 'dff') {
          for(var i = 22; i <= 36; i++){
            var j = i - 21;
            this.$refs.grid.cells(this.popup.rId,i).setValue(data['attribute'+j]);
          }
        }
      }
    },
    // getRemainBudget(rId, cctrCd, acctCd) {
    //   if(rId && cctrCd && acctCd && this.form.postDt !== '') {
    //     this.$http.get(`/api/budget/remain`, { params: {postDt: this.toPure(this.form.postDt), cctrCd: cctrCd, acctCd: acctCd} })
    //         .then(response => {
    //             this.form.rmnBudget = _.toInteger(response.data);
    //             this.setRemainBudget(rId)
    //         });
    //   }
    // },
    // setRemainBudget(rId) {
    //   this.$refs.grid.cells(rId,10).setValue(this.form.rmnBudget);
    // },
    setRemainBudgetAll() {
      const rowsNum = this.$refs.grid.getRowsNum();
      for(var i=0; i <rowsNum; i++) {
        var rowId = this.$refs.grid.getRowId(i);
        var dcCd = this.$refs.grid.cells2(i,19).getValue();
        var lnTypeCd = this.$refs.grid.cells2(i,20).getValue();
        var cctrCd = this.$refs.grid.cells2(i,3).getValue();
        var acctCd = this.$refs.grid.cells2(i,6).getValue();

        // if(dcCd === 'D' && lnTypeCd === 'ITEM') {
        //   this.getRemainBudget(rowId, cctrCd, acctCd)
        // }
      }
    },
    validation() {
      // 계정, 금액입력 확인
      const rowsNum = this.$refs.grid.getRowsNum();
      const tax = this.$parent.taxes.find(x => x.taxCd == this.form.taxCd);

      for(var i=0; i <rowsNum; i++) {
        var rowId = this.$refs.grid.getRowId(i);
        var debitAcctCd = this.$refs.grid.cells2(i,6).getValue();
        var debitProductCd = this.$refs.grid.cells2(i,13).getValue();
        var debitAmt = this.$refs.grid.cells2(i,16).getValue();
        var dcCd = this.$refs.grid.cells2(i,19).getValue();

        if(!debitAcctCd) {
          this.$swal({ type: 'warning', text: '계정을 선택해 주세요.' });
          this.$refs.grid.selectRow(rowId);
          return false;
          break;
        } 
        else if(!this.$parent.taxes.filter(x=> x.taxCd === this.form.taxCd)[0].taxNm.includes('불공제')){
          if(dcCd === 'D' && _.toInteger(debitAmt) == 0) {
            if(tax.taxRt > 0) {
              this.$swal({ type: 'warning', text: '차변금액을 입력해 주세요.' });
              this.$refs.grid.selectRow(rowId);
              return false;
              break;
            }
          }
        }
        
        //보조계정 입력 체크
        var reqSubAcct = this.$refs.grid.cells2(i,37).getValue();

        if(reqSubAcct){
          var strSubAcctCd = this.$refs.grid.cells2(i,10).getValue();
          var strSubAcctNm = this.$refs.grid.cells2(i,11).getValue();
          
          if(!strSubAcctCd || !strSubAcctNm){
            this.$swal({ type: 'warning', text: '보조계정을 입력해 주세요.' });
              this.$refs.grid.selectRow(rowId);
              return false;
              break;
          }
        }

        //현장(계약번호)체크
        var productCd = this.$refs.grid.cells2(i,13).getValue();
          
        if(i > 1 && !productCd){
            this.$swal({ type: 'warning', text: '현장(계약번호)를 입력해 주세요.' });
            this.$refs.grid.selectRow(rowId);
            return false;
            break;
        }

      }
      return true;
    },
    setSlipDetails() {
      if(this.slipDetails.length > 0) {
        setTimeout(() => {
          this.$refs.grid.clearAll();
          this.setDefaultLine(this.$parent.slipHeader.expItemCnt);

          this.slipDetails.forEach((item, index, array) => {
            if(item.dcCd === 'C') {
              item.creditAmt = item.acctAmt;
            } else if(item.dcCd === 'D') {
              item.debitAmt = item.acctAmt;
            }

            this.$refs.grid.setRowData(this.$refs.grid.getRowId(index), item);
          });
          this.grid.data = this.slipDetails;
          this.refreshGrid();
        }, 100);
      }
    },
    onInput(obj) {
      if(this.slipDetails.length === 0) {
        if(document.getElementById("sel")) {
          var sel = document.getElementById("sel")
          if(this.$route.name === 'ebillSlipReg') {
            sel.options[2].selected = true
            sel.disabled = true
          } else {
            sel.options[1].selected = true
          }
        }
      } else {
        this.slipDetails.forEach(x => {
          if(x.dcCd === 'D' && x.lnTypeCd === 'TAX') {

            let select = x.attribute10
            x.attribute10 = "<select class='input is-fullwidth' name='sel' id='sel' style='width:100%; height:100%;'>"+
                            "<option key='0' value='기타' id='0'>기타</option>"+
                            "<option key='1' value='종이' id='1'>종이</option>"+
                            "<option key='2' value='전자' id='2'>전자</option>"+
                            "</select>"
            setTimeout(() => {
              var sel = document.getElementById("sel")
              if(!select) {
                if(this.slipTypeCd === 'E4') select = 1
                if(this.slipTypeCd === 'E3') select = 2
              }

              sel.options[this.$numeral(select).value()].selected = true

              if(this.$route.name === 'ebillSlipReg') {
                sel.disabled = true
              }
              
            }, 500)
            
          }
        })
      }
      this.setVatAmt();
    },
    cctrValueChange(rId,cInd){
      
      //계정, 보조계정, 관리항목 초기화 [START]
      this.$refs.grid.cells(rId,6).setValue("");
      this.$refs.grid.cells(rId,7).setValue("");
      this.$refs.grid.cells(rId,10).setValue("");
      this.$refs.grid.cells(rId,11).setValue("");
      this.$refs.grid.cells(rId,13).setValue("");
      this.$refs.grid.cells(rId,14).setValue("");

      for(var i = 22; i <= 36; i++){
        this.$refs.grid.cells(rId,i).setValue("");          
      }
      //계정, 보조계정, 관리항목 초기화 [END]

      var schCode = this.$refs.grid.cells(rId,cInd).getValue();
      
      if(schCode){
        this.$http
          .get('/api/cctr/erp/' +  schCode)
            .then(response => {
              if(response.data.length === 1){
                this.$refs.grid.cells(rId,3).setValue(response.data[0].deptCd);
                this.$refs.grid.cells(rId,4).setValue(response.data[0].deptNm);
                
                //판관부서 현장계약번호 default 세팅
                if(response.data[0].expenseFlag === "1"){                  
                  this.$refs.grid.cells(rId,13).setValue(this.sgaProductCd);
                  this.$refs.grid.cells(rId,14).setValue(this.sgaProductCd);
                }else{
                  this.$refs.grid.cells(rId,13).setValue('');
                  this.$refs.grid.cells(rId,14).setValue('');
                }
                
              }else{
                this.$refs.pop.popCctr(rId, cInd, schCode)
              }
            })
      }else{
        this.$refs.grid.cells(rId,3).setValue("");
        this.$refs.grid.cells(rId,4).setValue("");
      }

    },
    acctValueChange(rId,cInd){
      //보조계정, 관리항목 초기화 [START]
      this.$refs.grid.cells(rId,10).setValue("")
      this.$refs.grid.cells(rId,11).setValue("");

      for(var i = 22; i <= 36; i++){
        this.$refs.grid.cells(rId,i).setValue("");          
      }
      //보조계정, 관리항목 초기화 [END]

      var schCode = this.$refs.grid.cells(rId,cInd).getValue();

      if(schCode){

        const deptCd =  this.$refs.grid.cells(rId,3).getValue()

        this.$http.get('/api/account/' + deptCd + '/' + this.slipTypeCd+'/' + schCode)
        .then((response) => {
          
          if(response.data.length === 1){
            this.$refs.grid.cells(rId,6).setValue(response.data[0].acctCd);
            this.$refs.grid.cells(rId,7).setValue(response.data[0].acctNm);
            
            //보조계정 조회            
            this.$http.get('/api/account/sub/' + response.data[0].acctCd)
              .then(responseSub => {
                
                var object = responseSub.data;

                if(object.length === 1){
                  
                  this.$refs.grid.cells(rId,10).setValue(responseSub.data[0].subAcctCd);
                  this.$refs.grid.cells(rId,11).setValue(responseSub.data[0].subAcctNm);

                  this.$refs.grid.cells(rId,37).setValue(true);                 

                }else if(object.length == 0){
                  this.$refs.grid.cells(rId,37).setValue(false);

                }else{
                  this.$refs.pop.popAccountSub(rId, cInd, response.data[0].acctCd, this.slipTypeCd)
                  this.$refs.grid.cells(rId,37).setValue(true)
                }
              });

          }else{
            this.$refs.pop.popAccount(rId, cInd, schCode);
          }
        })
      }else{
        this.$refs.grid.cells(rId,6).setValue("");
        this.$refs.grid.cells(rId,7).setValue("");        
      }

    },
    subAcctValueChange(rId,cInd){
      var schCode = this.$refs.grid.cells(rId,cInd).getValue();

      if(schCode){
            
            const acctCd =  this.$refs.grid.cells(rId,6).getValue()

            if(_.isEmpty(acctCd)){
              this.$swal({
                type: 'warning',
                text: '계정을 먼저 선택하기 바랍니다.'
              });
              return;
            }

            //보조계정 조회
            this.$http.get('/api/account/sub/' + acctCd + '/' + schCode)
              .then(response => {
                var object = response.data;

                if(object.length === 1){
                  this.$refs.grid.cells(rId,10).setValue(object[0].subAcctCd);
                  this.$refs.grid.cells(rId,11).setValue(object[0].subAcctNm);
                }else{
                  this.$refs.pop.popAccountSub(rId, cInd, acctCd, this.slipTypeCd, schCode)                  
                }
              });        

      }else{
        this.$refs.grid.cells(rId,10).setValue("")
        this.$refs.grid.cells(rId,11).setValue("");
      }      

    },
    productValueChange(rId,cInd){
      
      var schCode = this.$refs.grid.cells(rId,cInd).getValue();

      if(schCode){

        this.$http.get(`/api/slip/product/` + schCode)
        .then(response => {
          
          if(response.data.length === 1){
            this.$refs.grid.cells(rId,13).setValue(response.data[0].detailCd);
            this.$refs.grid.cells(rId,14).setValue(response.data[0].detailNm);              
          }else{
            this.$refs.pop.popProduct(this.popup.rId, this.popup.cInd, schCode)              
          }
        })        

      }else{
        this.$refs.grid.cells(rId,13).setValue("");
        this.$refs.grid.cells(rId,14).setValue("");
      } 
    },        
  },
  watch: {
    slipDetails() {
      this.setSlipDetails();
    },
    'form.taxCd'() {
      this.setTaxCd();
    },
    'form.baseCctrCd'() {
      this.setBaseDept();
    },
    'line.debitAcctCd'() {
      this.setVatAccount();
    },
    'form.apAcctCd'() {
      this.setCreditAccount();
    },
    'form.postDt'() {
      this.setRemainBudgetAll();
    },
    'form.hdSgtxt'() {
      this.setHdSgtxt()
    },
    'form.supAmt'() {
      this.setSupAmt()
    },
    'form.vatAmt'() {
      this.setVatAmt()
    },
    'form.totAmt'() {
      this.setTotAmt()
    },
    'form.baseDeptCd'() {
      this.setTaxItemBaseDept()
    }
  },
  mounted() {
    window.popCctr = () => this.$refs.pop.popCctr(this.popup.rId, this.popup.cInd);
    window.popAccount = () => this.$refs.pop.popAccount(this.popup.rId, this.popup.cInd);
    window.popAccountSub = () =>setTimeout(() => {this.$refs.pop.popAccountSub(this.popup.rId, this.popup.cInd, this.popup.acctCd, this.slipTypeCd);}, 500) 
    window.popProduct = () => this.$refs.pop.popProduct(this.popup.rId, this.popup.cInd);
    window.popDff = () => setTimeout(() => {this.$refs.pop.popDff(this.popup.acctCd,this.popup.rowData);}, 500)
    window.onInput = () => this.onInput()
    
    this.drawGrid();
  },
  created() {
    this.$store.commit('loading')

    var vm = this
    //20.04.21 전자세금계산서 차변대변 안나오는 현상 수정
    this.getVatAccount();
    this.$http.get(`/api/emp/${this.$store.state.loginInfo.loginId}`)
    .then(response => {
      let data = response.data[0]
      this.form.cctrCd = data.liabilityDeptCode
      this.form.cctrNm = data.liabilityDeptName
    })
    .catch(() => {
      this.$swal({
        type: 'error',
        text: e
      })
    })
    .finally(() => {
      this.$store.commit('finish')
      
      if(this.$parent.viewMode !== undefined && !this.$parent.viewMode && vm.$parent.slipDetails.length === 0) {
          this.setInitGrid();
      }
    })
    
  }
};
</script>

<style scoped>
.gridbox{height: 348px!important;}
.gridbox .objbox{height:348px!important;}
</style>

