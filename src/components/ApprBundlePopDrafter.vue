<template>
  <layout>
        <span slot="header">{{title}}<button class="btn-pop-close delete" aria-label="close"
                                             @click="closeModal"></button></span>
    <div slot="content">
      <div class="btn-type1">
        <button class="btn-size btn-gray" @click="save"><span class="btn-icon">
                    <i class="fas fa-check"></i></span> 확인
        </button>
      </div>

      <div class="inner-box">
        <table id="basic">
          <colgroup>
            <col width="120px">
            <col width="480px">
          </colgroup>
          <tbody>
          <tr style="">
            <th class="tp-a" style="border-top: 1px solid #d7d7d7"> 제목</th>
            <td style="border-top: 1px solid #d7d7d7"><span>{{docTitleNm}}</span></td>
          </tr>
          <tr>
            <th class="tp-a"> 의견</th>
            <td><textarea v-model="apprDesc"></textarea></td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </layout>
</template>

<script>
import Layout from '@/components/ModalSlot.vue'
import mixin from '@/mixin';

export default {
  name: 'ApprActPopDrafter',
  props: {
    docTitleNm:{
      type:String,
      required:false
    }
  },
  mixins: [mixin],
  components: {Layout},
  data() {
    return {
      title: '기안 의견',
      apprDesc:'상신합니다.'
    }
  },
  methods: {
    save() {
      this.$emit('close', this.apprDesc)
    },
    closeModal() {
      this.$parent.close();
    }
  },
};
</script>

<style scoped>
div#gridbox {
  width: 100%;
  height: 100%;
  min-height: 300px;
}

</style>
