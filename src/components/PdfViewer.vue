<template>
  <div ref="canvas" class="pdf-viewer" v-if="loadingTask !== undefined" @click="rotatePdf('pdf')">
    <pdf id="pdf" v-for="i in numPages" :key="i" :src="loadingTask" :page="i" style="display: inline-block; width: 100%;" ></pdf>
  </div>
</template>

<script>
import _ from 'lodash'
import pdf from 'vue-pdf'


export default {
  props: {
    src: {
      type: String,
      required: true
    }
  },
  components: {
    pdf
  },
  data() {
    return {
      loading: false,
      numPages: undefined,
      href: undefined,
      loadingTask:undefined,
    }
  },
  methods: {
    rotatePdf(pId){
      
      let style = document.getElementById( pId ).getAttribute('style');

      if(style.includes("rotate")){
        
        if(style.includes("90deg")) document.getElementById( pId ).setAttribute( 'style', style.replace("90deg","180deg")) 

        if(style.includes("180deg")) document.getElementById( pId ).setAttribute( 'style', style.replace("180deg","270deg")) 

        if(style.includes("270deg")) document.getElementById( pId ).setAttribute( 'style', style.replace("270deg","360deg")) 

        if(style.includes("360deg")) document.getElementById( pId ).setAttribute( 'style', style.replace("360deg","90deg")) 

      } else{
        document.getElementById( pId ).setAttribute( 'style', style + 'transform:rotate(90deg);')
      } 
    },    
  },
  watch: {
    src: {
      immediate: true,
      handler(url) {
        // if (url !== undefined) {
        //   this.loading = true
        //   this.href = url
        //   this.numPages = 10
        //   pdf.createLoadingTask(url)
        //     .then(pdf => {
        //       this.numPages = pdf.numPages
        //       this.$nextTick(() => {
        //         let canvas = this.$refs.canvas.getElementsByTagName('canvas')
        //         _.forEach(canvas, c => {
        //           let ctx = c.getContext('2d')
        //           this.$nextTick(() => {
        //             ctx.fillStyle = '#757575'
        //             ctx.fill()
        //           })
        //         })
        //       })
        //     })
        // }
      }
    }
  },
  created(){
    this.loadingTask = pdf.createLoadingTask(this.src);
  },
  mounted() {
    this.loadingTask.promise.then(pdf => {
      this.numPages = pdf.numPages
    })
  }
}
</script>

<style lang="scss" scoped>
.pdf-viewer {
  width: 100%;
  overflow-x: hidden;
  overflow-y: scroll;
  background-color: #757575;

  :global(span),
  :global(div) {
    background-color: transparent;
  }
}
</style>
