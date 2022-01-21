<template>
  <layout>
    <span slot="header">{{title}}<button class="btn-pop-close delete" aria-label="close" @click="closePop"></button></span>
    <div slot="content">
      <!-- <div class="btn-type1">
          <button class="btn-size btn-gray fl_right" @click="goPrint">
            <span class="btn-icon"><i class="fas fa-print"></i></span> 출력
          </button>
      </div> -->
      <div>
        <iframe id="printf" name="printf" :src="url" style="width:100%; height:500px; border:none;"/>
      </div>
    </div>
  </layout>
</template>

<script>
import Layout from '@/components/ModalSlot.vue'

export default {
  name: 'erpAccount',
  props: {
    eTaxNo: {
      type: String,
      required: true,
    }
  },
  components: {Layout},
  data() {
    return {
      title: '전자세금계산서',
      url: '',
    }
  },
  methods: {
    closePop() {
      this.$emit('dismiss')
      this.$parent.close()
    },
    goPrint(){
      var printDiv = document.getElementById("printf");
      
      var pop = window.open(this.url, '_blank', 'height=600, width=800'); 
      pop.document.write(printDiv.outerHTML); 
      
      pop.print(); 
      pop.close();
    }
  },
  created() {
    //this.url = 'http://197.200.1.19:10004/addService/View/XXSB_DTI_PRINT_VIEW_NTS.asp?issue_id='+this.eTaxNo+'&sbtype=AP';
    // this.url = 'http://197.200.1.19:10005/addService/View/XXSB_DTI_PRINT_VIEW_NTS.asp?issue_id='+this.eTaxNo+'&sbtype=AP';
    this.url = 'http://197.200.29.30:30000/dti/api/v1/view/'+ this.eTaxNo + '?stype=AP';
  }
}
</script>