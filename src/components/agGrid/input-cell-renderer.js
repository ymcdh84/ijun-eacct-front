import Vue from 'vue';

export default Vue.extend({
    template: `
    <div>
    <input ref="box" type="text" class="inputtext" v-model="string" @blur="apply" @keyup.enter="apply" @keydown="keyDown" :maxlength="maxlength"/>
    </div>                              
`,
  data() {
    return {
      string: '',
      disable: false,
      maxlength: 10000
    }
  },  
  created() {
    
    if(this.params.colDef.cellRendererParams !== undefined){
      
      const param = this.params.colDef.cellRendererParams
      
      if(param.disable !== undefined) this.disable = param.disable

      if(param.maxlength !== undefined) this.maxlength = param.maxlength 

    }
    
    //그리드 셀 focusing 방지
    this.params.colDef.editable = false;
  },
  mounted() {
    $(this.$refs.box).on('focus', () => {
      $(this.$refs.box).trigger('select')
    })
  },  
  methods: {
    apply(e) {
      this.params.node.setDataValue(this.params.column.colId, this.string);      
    },
    keyDown(e) {
      //좌우측 방향키 눌림시 다음 컬럼 넘어감 방지
      if(e.keyCode === 37 || e.keyCode === 39){
        e.stopPropagation()
      }
    }    
  }, watch: {
    'value': {
      immediate: true,
      deep: true,
      handler() {
        this.string = this.params.value
      }
    }
  }
});