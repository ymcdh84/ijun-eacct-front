<template>
  <layout>
    <span slot="header">{{title}}<button class="btn-pop-close delete" aria-label="close" @click="closeModal"></button></span>
    <div slot="content">
      <div class="btn-type1">
          <button class="btn-size btn-gray" @click="goSearch"><span class="btn-icon"><i class="fas fa-search"></i></span> 조회</button>
      </div>

      <div class="pop-content-search">
          <div class="field has-addons ">
              <div class="mr20 ">
                  <span class="pop-c-name">- 현장(계약번호)</span>
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
                  @rowDoubleClicked="rowDoubleClick"/>
      </div>
    </div>
  </layout>
</template>

<script>
import Layout from '@/components/ModalSlot.vue'
import mixin from '@/mixin';
import {AgGridVue} from 'ag-grid-vue';

export default {
  name: 'Product',
  props: ['searchStr','slipTypeCd'],
  mixins: [ mixin ],
  data() {
    return {
      title: '현장(계약번호) 조회',
      search: undefined,
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
          headerName:'현장코드', 
          field:'detailCd', 
          width:400, 
          cellStyle:{textAlign:'left'}
        },
        {
          headerName:'현장명', 
          field:'detailNm', 
          width:409, 
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
  components: {
    Layout,
    AgGridVue
  },
  created() {
    this.search = this.searchStr
    this.goSearch();
  },
  methods: {
    goSearch() {
      this.$store.commit('loading');

      if(!this.search) this.search = ''
      
      this.$http.get(`/api/slip/product/${this.search}`)
        .then((result) => {
          this.rowData = result.data;
        })
        .catch(response => {
          console.error("Product_Ag Error");
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
    }
  }
};
</script>