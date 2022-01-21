<template>
  <select style="width:100%; height:90%;" v-model="data">
    <option v-for="option in dataList" :key="option.detailCd" :value="option.detailCd" v-text="option.detailNm" @change="changeValue"/>
  </select>
</template>

<script>
import Vue from 'vue'
import uuid from '@/libs/uuid'
import _ from 'lodash'

export default Vue.extend({
  data() {
    return {
      data:'',
      dataList:[],
      field: ''
    }
  },
  created() {
    this.field = this.params.colDef.field;
    this.getDataList();
  },
  methods: {
    getDataList(){
      if(this.field === 'vatCd'){
        var result = this.$parent.$parent.vatList.filter(v=>{return !_.isEmpty(v.taxCd)});

        for(var i=0; i<result.length; i++){
          this.dataList[i] = {'detailCd' : result[i].taxCd, 'detailNm' : result[i].taxNm};
        }

      }else if(this.field === 'tpsTypeCd'){
        this.dataList = this.$parent.$parent.tpsTypeList;
      }else if(this.field === 'oilKindCd'){
        this.dataList = this.$parent.$parent.oilKindList;
      }
    },
    changeValue(){
      if(this.field === 'oilKindCd'){
        this.$parent.$parent.changeOilCd();
      }
    }
  },
  watch: {
    'value': { 
      immediate: true,
      deep: true,
      handler() {
        this.data = this.params.value;
      }
    }
  }
});
</script>