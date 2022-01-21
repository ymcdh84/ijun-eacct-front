<template>
<!--  <dhx-calendar class="calendar" v-model="date" :disabled="readOnly" @input="apply" />-->
  <dhx-calendar class="calendar" v-model="date" @input="apply" />
</template>

<script>
import Vue from 'vue'
import DhxCalendar from '@/components/DhxCalendar.vue'

export default Vue.extend({
  components: {
      DhxCalendar
  },
  data() {
    return {
      date: '',
      // readOnly:false
    }
  },
  methods: {
    apply() {
      let colId = this.params.column.colId;

      this.params.node.setDataValue(colId, this.date);
    }
  },
  created(){
    this.date = this.params.value;
    // if(this.params.readOnly){
    //   this.readOnly = true
    // }else {
    //   this.readOnly = false
    // }
  }
})
</script>
