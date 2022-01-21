<template>
  <layout>
    <span slot="header">{{title}}<button class="btn-pop-close delete" aria-label="close" @click="closeModal"></button></span>
    
    <div slot="content">
      
      <!-- 테이블 -->
      <div class="table-area">
          <div class="table-b">
              <div class="grid-wrap">
                  <ag-grid-vue 
                  style="width: 100%; height: 320px;"
                  class="ag-theme-alpine"    
                  rowSelection="single"
                  
                  :columnDefs="columnDefs"     
                  :gridOptions="gridOptions"
                  :rowData="erpList"
                  :defaultColDef="defaultColDef"
                  @grid-ready="onGridReady"/>
              </div>
          </div>
      </div>
      <!-- //테이블 -->

    </div>
  </layout>
</template>

<script>
import moment from 'moment'
import mixin from '@/mixin';
import mixinSlip from '@/mixin/slip';
import _ from 'lodash'

import assert from '@/libs/assert'
import Layout from '@/components/ModalSlot.vue'
import DhxGrid from '@/components/DhxGrid.vue'
import {AgGridVue} from 'ag-grid-vue';

import {
  url as _url
} from '@/libs/join'

export default {
  name: 'SlipCrdLst',
  props: {
    grSlipNo: {
      type: String,
      required: true
    }
  },
  components: {DhxGrid,Layout,AgGridVue},
  mixins: [ mixin, mixinSlip ],
  data() {
    return {
      title: 'ERP전송상태',
      erpList: [],
      gridOptions: {},
      columnDefs:[
        {
          headerName:'전표번호', 
          field:'eaSlipNo', 
          width:200
        },
        {
          headerName:'상태', 
          field:'erpStatus', 
          width:170, 
          cellStyle:{textAlign:'left'}
        },
        {
          headerName:'상태내용', 
          field:'errMsg', 
          width:339,
          cellStyle:{textAlign:'left'}
        },
        {
          headerName:'전송일시',
          field:'trsDt',
          width:180,
          cellStyle:{textAlign:'left'}
        },
        {
          headerName:'정산일',
          field:'calcuDt',
          width:180,
          cellStyle:{textAlign:'left'}
        }
      ],
      defaultColDef: {
        resizable: true, 
        filter:true, 
        sortable: true 
      }
    }
  },
  methods: {
    goSearch() {
        this.$store.commit('loading');
        this.$http.get(`/api/slip/history/erpStatus/${this.grSlipNo}`)
        .then(response => {
            if (response.data) {
                this.erpList = response.data
            }
        }).finally(()=> {
            this.$store.commit('finish');
        });
    },
    closeModal(){
        this.$parent.close();
    },
    onGridReady(){
      this.gridOptions.api.sizeColumnsToFit();
    }
    
  },
  created(){
      this.goSearch();
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
