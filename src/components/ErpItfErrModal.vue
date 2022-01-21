<template>
  <layout>
    <span slot="header">{{title}}<button class="btn-pop-close delete" aria-label="close" @click="closeModal"></button></span>
    
    <div slot="content">
      
      <!-- 테이블 -->
      <div class="table-area">
          <div class="table-b">
              <div class="grid-wrap">
                  <dhx-grid ref="grid" v-model="erpList" :config="config" @constructGridSuccessful="constructGridSuccessful"/>
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

import {
  url as _url
} from '@/libs/join'

//
//'./grid/GridCheckbox.vue'
//['param','slipTypeCd'],
export default {
  name: 'SlipCrdLst',
  props: {
    grSlipNo: {
      type: String,
      required: true
    }
  },
  components: {DhxGrid,Layout},
  mixins: [ mixin, mixinSlip ],
  data() {
    return {
      config : {
        columns: [
            {id: 'eaSlipNo', type: 'ro', align: 'left', sort: 'na', value: '전표번호', width: 120},
            {id: 'erpStatus', type: 'ro', align: 'left', sort: 'na', value: '상태', width: 80},
            {id: 'errMsg', type: 'ro', align: 'left', sort: 'na', value: '상태내용', width: 150},
            {id: 'trsDt', type: 'ro', align: 'center', sort: 'na', value: '전송일시', width: 120},
        ],
        height: 280,
        enablePaging: false,
      },
      title: 'ERP전송상태',
      erpList: [],
    }
  },
  methods: {
    constructGridSuccessful(grid) {
        grid.attachHeader(
            []
        )
        grid.setDateFormat('%Y-%m-%d', '%Y%m%d')
    },
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
