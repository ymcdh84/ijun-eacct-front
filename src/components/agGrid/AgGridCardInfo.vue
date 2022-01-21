<template>
  <div>
    <button style = "margin-top: 10px;" type="button" class="icon far fa-file" @click="cdInfoPop"></button>
  </div>
</template>

<script>
import Vue from 'vue'
import uuid from '@/libs/uuid'

export default Vue.extend({
  data() {
    return {
      val: ''
    }
  },
  created() {
  },
  methods: {
    cdInfoPop(){
      var idx = this.params.node.rowIndex;
      
      this.$parent.$parent.cardInfoPop(idx);
    }
  },
  watch: {
    'value': { 
      immediate: true,
      deep: true,
      handler() {
        this.val = this.params.value;
      }
    }
  }
});
</script>

