<template>
  <layout>
    <span slot="header">{{title}}<button class="btn-pop-close delete" aria-label="close" @click="$dismiss"></button></span>
    <div slot="content">
      <div class="btn-type1">
          <button class="btn-size btn-gray" @click="goSearch(true)"><span class="btn-icon"><i class="fas fa-search"></i></span> 조회</button>
      </div>

      <div class="pop-content-search">
          <div class="field has-addons ">
              <div class="mr20 ">
                  <span class="pop-c-name">보조계정 코드/명</span>
              </div>
              <div class="control is-expanded">
                  <input class="input" type="text" v-model="search" @keypress.enter="goSearch">
              </div>
          </div>
      </div>
      <div class="grid-tbl-box">
      <ag-grid-vue 
                  style="width: 100%; height: 320px;"
                  class="ag-theme-alpine"    
                  rowSelection="single"
                  
                  :columnDefs="columnDefs"     
                  :gridOptions="gridOptions"
                  :rowData="rowData"
                  :defaultColDef="defaultColDef"
                  @rowDoubleClicked="rowDoubleClick"/>
    </div>
    </div>
  </layout>
</template>

<script>
import Layout from '@/components/ModalSlot.vue'
import {AgGridVue} from 'ag-grid-vue';

export default {
  name: 'erpAccount',
  props: {
    title: {
      type: String,
      required: false,
      default: '보조계정 조회'
    },
    deptCd: {
      type: String,
      required: true,
    },
    searchStr: {
      type: String,
      required: false
    },
    acctCd: {
      type: String,
      required: false
    },
  },
  components: {
    Layout,
    AgGridVue
  },
  data() {
    return {
      search: "",
      gridOptions: {},
      columnDefs:[
        {
          headerName:'No.', 
          field:'no', 
          width:80,
          valueFormatter: function(params) {               
            return params.node.rowIndex+1;
          }
        },
        {
          headerName:'보조계정코드', 
          field:'subAcctCd', 
          width:170, 
          cellStyle:{textAlign:'left'}
        },
        {
          headerName:'보조계정명', 
          field:'subAcctNm', 
          width:635, 
          cellStyle:{textAlign:'left'}
        }
      ],
      defaultColDef: { 
        resizable: true, 
        filter:true, 
        sortable: true 
      },
      rowData: []
    }
  },
  methods: {
    $dismiss() {
      this.$emit('dismiss')
      this.$parent.close()
    },
    goSearch() {
      // this.$store.commit('loading')
      this.rowData = []

      this.$http.get('/api/account/sub/'+this.acctCd + '/' + this.search)
      .then(response => {
        this.rowData = response.data;
      })
      .catch(response => {
        console.error("ErpAccountSub_Ag Error");
      })
      .finally(() => {
        // this.$store.commit('finish')
      })
    },
    rowDoubleClick(params){
      this.$emit('close', params.data);
    }
  },
  created() {
    this.search = this.searchStr? this.searchStr: ""
    this.goSearch()
  }
}
</script>