<template>
  <layout>
    <span slot="header">{{title}}<button class="btn-pop-close delete" aria-label="close" @click="closeModal"></button></span>
    <div slot="content">
      <div class="btn-type1">
          <button class="btn-size btn-gray" @click="goSearch(true)"><span class="btn-icon"><i class="fas fa-search"></i></span> 조회</button>
      </div>

      <div class="pop-content-search">
          <div class="field has-addons ">
              <div class="mr20 ">
                  <span class="pop-c-name">- 계좌명</span>
              </div>
              <div class="control is-expanded">
                  <input class="input" type="text" v-model="search" @keypress.enter="goSearch">
              </div>
          </div>
      </div>

      <div class="grid-wrap">
          <ag-grid-vue 
                  style="width: 100%; height: 320px;"
                  class="ag-theme-alpine"    
                  rowSelection="single"
                  
                  :columnDefs="columnDefs"     
                  :gridOptions="gridOptions"
                  :rowData="rowData"
                  :defaultColDef="defaultColDef"
                  @rowDoubleClicked="rowDoubleClick"
                  @grid-ready="onGridReady"/>
      </div>
    </div>
  </layout>
</template>

<script>
import Layout from '@/components/ModalSlot.vue'
import mixin from '@/mixin';
import {AgGridVue} from 'ag-grid-vue';

export default {
  name: 'CustAccount',
  props: ['param'],
  mixins: [ mixin ],
  components: {
    Layout,
    AgGridVue
  },
  data() {
    return {
      title: '지급계좌 조회',
      search: '',
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
          headerName:'계좌', 
          field:'custAcctNo', 
          width:300, 
          cellStyle:{textAlign:'left'}
        },
        {
          headerName:'계좌명', 
          field:'custAcctNm', 
          width:300, 
          cellStyle:{textAlign:'left'}
        },        
        {
          headerName:'지점', 
          field:'bankNm', 
          width:200, 
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
    create(){
    },
    goSearch(slow) {
      this.$store.commit('loading');
      
      this.$http.get(`/api/erp/ap/bank/${this.search}`)
        .then((result) => {

          this.rowData = result.data
         
          if(result.data.length === 1) {
            this.$emit('close', result.data[0]);
          }
        }).catch(response => {
          console.error("CustAccount_Ag Error");
        })
        .finally(() => {
          this.$store.commit('finish')
        });
    },
    rowDoubleClick(params){
      this.$emit('close', params.data);
    },
    closeModal() {
      this.$parent.close();
    },
    onGridReady(){
      this.gridOptions.api.sizeColumnsToFit();
    }
  },
  mounted() {
    if(this.param !== undefined) this.search = this.param;
    if(this.search) this.goSearch();
  }
};
</script>

<style scoped>
div#gridbox {
  width: 100%;
  height: 100%;
  min-height: 300px;
}
</style>
