import Vue from 'vue';

export default Vue.extend({
  template: `
    <div>
      <button type='button' class='ag-standard-button' :disabled="disable">{{this.data}}</button>
    </div>  
    `,
    data: function () {
    return {
      data: undefined,
      disable: false
    };
  },
  mounted() {
    const param = this.params.colDef.cellRendererParams

    this.data =  param.name
    
    if(this.params.colDef.editable !== undefined) this.disalbe = this.params.colDef.editable(this.params)
  },  
  methods: {
  }, 
  watch: {
    'params.colDef.editable': { 
      immediate: true,
      deep: true,
      handler() {
        
        this.$nextTick(() => {
          if(this.params.colDef.editable !== undefined) this.disable = this.params.colDef.editable(this.params)
        })
      }
    }
  }
});