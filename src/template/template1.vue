<template>
<div class="inner-box">
  <form @submit.prevent="buttonClickEventSave()">
    <div class="content-name">
      <h2 class="dp-ib">권한관리</h2>
      <div class="btn-wrap btn-type1 clearfix">
        <button type="button" class="btn-size btn-gray fl_left" @click="buttonClickEventSearch()">
          <span class="btn-icon"><i class="fas fa-search"></i></span>
          조회
        </button>
        <button type="submit" class="btn-size btn-blue fl_left">
          <span class="btn-icon"><i class="fas fa-save"></i></span>
          저장
        </button>
      </div>
    </div>

    <div class="search-form">
      <div class="form-group">
        <label class="control-label">회사</label>
        <div class="form-input">
          <select class="input" v-model="params.compCd">
            <option v-for="{ key, value } in options['COMP_CD']" :key="key" :value="key" v-text="value" />
          </select>
        </div>
      </div>
    </div>
  </form>

  <!-- 데이터 영역 -->
  <div class="table-area mt20">
    <div class="table-b">
      <div class="table-header">
        <div class="table-name">
          <h3 class="ico_table_name">권한 내역</h3>
        </div>
        <div class="btn-wrap btn-type2 clearfix">
          <button class="btn-size btn-w-gray" @click="buttonClickEventAddRow()">
            <span class="btn-icon">
              <i class="fas fa-plus"></i>
            </span>
            행추가
          </button>
          <button class="btn-size btn-w-gray" @click="buttonClickEventRemoveRow()">
            <span class="btn-icon">
              <i class="fas fa-trash-alt"></i>
            </span>
            행삭제
          </button>
        </div>
      </div>
      <!-- Grid -->
      <ag-grid-vue         
        ref="grid"
        style="width: 100%; height: 55vh; min-height: 300px;"
        class="ag-theme-alpine"    
        rowSelection="multiple"                                  

        :columnDefs="columnDefs"     
        :gridOptions="gridOptions"
        :defaultColDef="defaultColDef"
        :rowData="data"
        :gridReady="gridSizeFit" 
        :gridSizeChanged="gridSizeFit"
        :frameworkComponents="frameworkComponents"          

        @grid-ready="onReady"        
        @model-updated="onModelUpdated"
        @cell-clicked="onCellClicked"
        @cell-double-clicked="onCellDoubleClicked"
        @cell-context-menu="onCellContextMenu"
        @cell-value-changed="onCellValueChanged"
        @cell-focused="onCellFocused"
        @row-selected="onRowSelected"
        @selection-changed="onSelectionChanged"
        @filter-modified="onFilterModified"
        @virtual-row-removed="onVirtualRowRemoved"
        @row-clicked="onRowClicked"
        @column-everything-changed="onColumnEvent"
        @column-row-group-changed="onColumnEvent"
        @column-value-Changed="onColumnEvent"
        @column-moved="onColumnEvent"
        @column-visible="onColumnEvent"
        @column-group-Opened="onColumnEvent"
        @column-resized="onColumnEvent"
        @column-pinned-count-changed="onColumnEvent"
      />
      <!-- //Grid -->
    </div>
  </div>
  <!-- //데이터 영역 -->
</div>
</template>

<script>
import Vue from 'vue'
import _ from 'lodash'
import assert from '@/libs/assert' 
import GridSelect from '@/components/grid/GridSelect.vue'
import AuthMngMenu from '@/components/AuthMngMenu.vue'
import AuthMngUser from '@/components/AuthMngUser.vue'

import SelectCellRenderer from '@/components/agGrid/select-cell-renderer'
import ButtonCellRenderer from '@/components/agGrid/button-cell-renderer'

import {AgGridVue} from 'ag-grid-vue'

import common from '@/mixin/common';
import { Color } from 'ag-grid-community'

const bus = new Vue()

export default {
  mixins: [common],
  components: {
    AgGridVue
  },
  data() {
    return {
      data: [],
      deleteList: [],
      memento: [],
      params: {
        compCd: undefined
      },
      options: {
        'COMP_CD': [],
        'ROLE_SELECT_CD': []
      },         
      gridOptions: {         
          // onColumnResized: true,
          // enableFilter: true,
          // enableSorting: true,
          // suppressRowTransform: true
      },
      defaultColDef: {         
          resizable: true,
          filter: true,
          sortable: true,
          editable: true
      },              
      gridApi : null ,    //gridAip
      columnApi : null ,  //columApi
      columnDefs: [] ,    //comulum Defs
      frameworkComponents: {
        selectCellRenderer: SelectCellRenderer,
        buttonCellRenderer: ButtonCellRenderer
      },  
    }
  },
  methods: {
    //그리드 Ready
    onReady(params) {
      
      //그리드용 api 정의
      //this.gridApi = params.api;
      //this.columnApi = params.columnApi; //params대신 gridOptions 사용가능
      this.gridApi = this.gridOptions.api;
      this.columnApi = this.gridOptions.columnApi;
      
      setTimeout(() => {
        this.createColumnDefs();
      },300);
      
      this.query()
    },
    //컬럼정의 함수
    createColumnDefs() { 
        const vm = this

        this.columnDefs = [
            { headerName : 'COL1',
              children: [
                {
                  headerName: 'No.', width : 80, valueGetter: (params) => {return params.node.rowIndex + 1 },
                },
                {
                  headerName: '권한코드'
                , width : 300
                , field: 'roleCd'
                , headerClass: 'require-column' //필수입력 컬럼 css
                , cellClass : function(params){
                    if(params.node.data.new){
                      return 'bg-lightpink'
                    }else{
                      return 'bg-grey'
                    }
                }
                // , cellStyle : function(params){  
                //     if(params.node.data.new){
                //       return {backgroundColor: '#fff8f7'}
                //     }else{
                //       return {backgroundColor: '#e1e1e1'}
                //     }
                //   }                          
                , editable: function(params){ 
                    if(params.node.data.new){
                      return true
                    }else{
                      return false
                    }
                  }
                },
                {
                  headerName: '권한명'
                , width : 300
                , field: 'roleNm'
                , headerClass: 'require-column' //필수입력 컬럼 css
                , editable : true
                , cellStyle: {backgroundColor: '#fff8f7'}
                },
                {
                  headerName: '조회권한',
                  width : 250 ,
                  field: 'roleSelectCd',
                  headerClass: 'require-column' , //필수입력 컬럼 css
                  cellRenderer: 'selectCellRenderer',
                  cellRendererParams: {
                      options : vm.options["ROLE_SELECT_CD"],
                      detailCd: 'key',  //서버로 부터 받은 key defalut-"detailCd"
                      detailNm: 'value' //서버로 부터 받은 value defalut-"detailNm"
                  }
                },
                // {
                //   headerName: '조회권한',
                //   width : 250 ,
                //   field: 'roleSelectCd',
                //   editable : true,
                //   cellEditor: 'select',
                //   cellEditorParams: {values : vm.extractValues(vm.options.ROLE_SELECT_CD)}, //셀이 선택되었을 때 드롭박스에 펼쳐지는 리스트
                //   valueFormatter: function(params) {               
                //     return vm.lookupValue(vm.options.ROLE_SELECT_CD, params.value);//코드값을 Value로 변환 해준다
                //   }
                // },
              ]
            },
            {
              headerName : '',
              children: [
                {
                  headerName: '권한별메뉴',
                  width : 350 ,
                  field: 'roleMenu', 
                  cellRenderer: function(params){
                    if(!params.node.data.new){
                      return "<div><button type='button' class='ag-standard-button'>선택</button></div>"
                    }                        
                  }
                }
              ]
            },
            {
              headerName : '',
              children: [
                {
                  headerName: '권한별사용자',
                  width : 350 ,
                  field: 'roleUser',
                  editable: function(params){ 
                    if(!params.node.data.new){
                      return false
                    }else{
                      return true
                    }
                  },
                  cellRenderer: 'buttonCellRenderer',
                  cellRendererParams: {
                      name:  '선택2',
                  }
                },
              ]
            }
        ];
    },    
    //그리드 Cell 클릭 함수
    onCellClicked(event) {
      const idx = event.rowIndex
      const field = event.colDef.field

      const sCompCd = event.node.data.compCd
      const sRoleCd = event.node.data.roleCd
        
      if(field === "roleMenu"){
        this.$modal.open({component: AuthMngMenu, parent: this, width: 800, props: {roleCd: sCompCd, compCd: sRoleCd}})
      }else if(field === "roleUser"){
        this.$modal.open({component: AuthMngUser, parent: this, width: 800, props: {roleCd: sCompCd, compCd: sRoleCd}})
      }

    },        
    query() {
      this.$store.commit('loading')
      this.$http.get('/api/auth', {
        params: this.params
      }).then(response => {
        this.data = response.data
        this.deleteList = []
        this.memento = []

        if(response.data.length == 0){
            this.$swal({ type: 'warning', text: '조회내역이 존재하지 않습니다.' })
        }

      }).finally(() => {
        this.$store.commit('finish')
      })
    },
    queryCompCd() {
      this.$store.commit('loading')
      this.$http.get('/api/code/combo', {
        params: {
          groupCd: 'COMP_CD'
        }
      }).then(response => {
        this.options['COMP_CD'] = response.data
      }).catch(response => {
        return response
      }).finally(() => {
        this.$store.commit('finish')
      })
    },
    queryRoleSelectCd() {
      this.$store.commit('loading')
      this.$http.get('/api/code/combo', {
        params: {
          groupCd: 'ROLE_SELECT_CD'
        }
      }).then(response => {
        this.options['ROLE_SELECT_CD'] = response.data        
      }).catch(response => {
        return response
      }).finally(() => {
        this.$store.commit('finish')
      })
    },
    save(callback) {
      try {
        // 권한코드 중복 체크
        let dupRoleCd = this.data.map(x => x.roleCd).filter((x, i, arr) => arr.indexOf(x) === i)
        assert.apply(this, [dupRoleCd.length === this.data.length, '중복된 권한코드는 허용되지 않습니다.'])

        // 빈 권한코드 체크
        let emptyRoleCd = this.data.filter(x => !x.roleCd)
        assert.apply(this, [(emptyRoleCd.length === 0), '권한코드는 빈 값일 수 없습니다.'])

        // 빈 권한명 체크
        let emptyRoleNm = this.data.filter(x => !x.roleNm)
        assert.apply(this, [(emptyRoleNm.length === 0), '권한명은 빈 값일 수 없습니다.'])

        // 삭제할 것이 있음
        if (this.deleteList.length > 0) {
          this.$store.commit('loading')
          let work = []
          _.forEach(this.deleteList, x => {
            work.push(this.$http.delete('/api/auth', {
              params: x
            }))
          })
          Promise.all(work)
            .then(response => {
              _proceed.apply(this, [callback])
            }).catch(response => {
              console.error('Failed to remove authority')
            })
          this.$store.commit('finish')  
        } else {
          _proceed.apply(this, [callback])
        }
      } catch (e) {
        this.$swal({
          type: 'error',
          text: e
        })
      }

      function _proceed(callback) {
        this.$store.commit('loading')
        this.$http.put('/api/auth', this.data)
          .then(response => {
            if (callback !== undefined && typeof callback === 'function') {
              callback.apply(this, [])
            } else {
              this.$swal({
                type: 'success',
                text: '저장되었습니다.'
              }).then(this.query)
            }
          }).finally(() => {
            this.$store.commit('finish')
          })
      }
    },
    buttonClickEventSearch() {
      this.query()
    },
    buttonClickEventSave() {
      
      //그리드 필수입력 체크          
      if(!this.gridRequireCheck([this.$refs.grid])) return;

      if (this.memento.length === 1) {
        this.$swal({
          type: 'warning',
          text: '저장할 내용이 없습니다.'
        })
      } else {
        this.save()
      }
    },
    buttonClickEventAddRow() {
            
      //조회권한 첫번째 Select 박스 포커싱      
      let aOptions = this.options['ROLE_SELECT_CD']
      let sDetailCd = null 

      if (Array.isArray(aOptions) && aOptions.length > 0) {
          sDetailCd = aOptions[0].key
      }      
      
      this.data.push({
        new: true,
        roleSelectCd: sDetailCd
      })

    },
    buttonClickEventRemoveRow() {
      //this.gridApi.getSelectedNodes()[0].childIndex => 선택된 그리드 rowIdx
      //this.gridApi.getSelectedRows()[0] => 선택된 그리드 row
      let i = this.gridApi.getSelectedNodes()[0].childIndex
      let row = this.gridApi.getSelectedRows()[0]
      
      if (!row.new) {
        this.deleteList.push({
          roleCd: row.roleCd,
          compCd: row.compCd
        })
      }
      
      this.data.splice(i, 1)
    },
    gridSizeFit(params) {
      // 모니터나 브라우저 크기에 따라 반응하여 그리드 컬럼 사이즈를 조정합니다.
      if ( window.innerWidth > 800 ){ // 화면 가로가 800 px 이 넘을 경우
        params.api.sizeColumnsToFit() // 가로 스크롤바가 생기지 않도록 컬럼 사이즈를 그리드에 꼭 맞게 조정합니다.
      } else {
        // 컬럼의 데이터값이 잘리지 않도록 조정합니다.
        let allColumnIds = []
        this.gridOptions.columnApi.getAllColumns().forEach(function (column) {
          allColumnIds.push(column.colId)
        })
        this.gridOptions.columnApi.autoSizeColumns(allColumnIds)
      }
    },
    pad(num, totalStringSize) {
        let asString = num + "";
        while (asString.length < totalStringSize) asString = "0" + asString;
        return asString;
    },

    calculateRowCount() {
        if (this.api && this.rowData) {
            let model = this.gridOptions.api.getModel();
            let totalRows = this.rowData.length;
            let processedRows = model.getRowCount();
            this.rowCount = processedRows.toLocaleString() + ' / ' + totalRows.toLocaleString();
        }
    },
    onModelUpdated() {
        console.log('onModelUpdated');
        this.calculateRowCount();
    },
    onCellValueChanged(event) {
       const idx = event.rowIndex
       const field = event.colDef.field

      // if(field === "roleSelectCd"){
      //   this.createColumnDefs()
      // }
        
      console.log('onCellValueChanged: ' + event.oldValue + ' to ' + event.newValue);
    },

    onCellDoubleClicked(event) {
        console.log('onCellDoubleClicked: ' + event.rowIndex + ' ' + event.colDef.field);
    },

    onCellContextMenu(event) {
        console.log('onCellContextMenu: ' + event.rowIndex + ' ' + event.colDef.field);
    },

    onCellFocused(event) {
        console.log('onCellFocused: (' + event.rowIndex + ',' + event.colIndex + ')');
    },

    // taking out, as when we 'select all', it prints to much to the console!!
    // eslint-disable-next-line
    onRowSelected(event) {      
        console.log('onRowSelected: ' + event.node.data.name);
    },

    onSelectionChanged() {
        console.log('selectionChanged');
    },

    onFilterModified() {
        console.log('onFilterModified');
    },

    // eslint-disable-next-line
    onVirtualRowRemoved(event) {
        // because this event gets fired LOTS of times, we don't print it to the
        // console. if you want to see it, just uncomment out this line
        // console.log('onVirtualRowRemoved: ' + event.rowIndex);
    },

    onRowClicked(event) {
        console.log('onRowClicked: ' + event.node.data.name);
    },

    onQuickFilterChanged(event) {
        this.gridOptions.api.setQuickFilter(event.target.value);
    },

    // here we use one generic event to handle all the column type events.
    // the method just prints the event name
    onColumnEvent(event) {
        console.log('onColumnEvent: ' + event);
    }

  },
  created() {
    this.queryCompCd(); 
    this.queryRoleSelectCd();

    let compCd = this.$store.state.loginInfo.compCd
    this.params.compCd = compCd
  },
  watch: {
    'data': {
      deep: true,
      handler(value) {
        let exists = this.memento.indexOf(JSON.stringify(value))
        // Has history?
        if (exists >= 0) {
          // fallback
          this.memento.splice(exists, this.memento.length - exists + 1)
        } else {
          this.memento.unshift(JSON.stringify(value))
        }
      }
    }
  }
}
</script>
