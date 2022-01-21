<template>
<layout>
  <span slot="header">
    {{ title }}
    <button class="btn-pop-close delete" aria-label="close" @click="closeModal()"></button>
  </span>
  <div slot="content">
    <div class="btn-wrap btn-type2 fl_right" v-if="!readonly">
      <button class="btn-size btn-w-gray" @click="buttonClickEventAdd()">
        <span class="btn-icon">
          <i class="fas fa-plus"></i>
        </span>
        행추가
      </button>
      <button class="btn-size btn-w-gray" @click="buttonClickEventRemove()">
        <span class="btn-icon">
          <i class="fas fa-trash-alt"></i>
        </span>
        행삭제
      </button>
      <button class="btn-size btn-w-gray" @click="buttenClickEventSave()">
        <span class="btn-icon">
          <i class="fas fa-save"></i>
        </span>
        저장
      </button>
    </div>
    <div class="table-b">
      <div class="table-header">
    <!-- DhxGrid component -->
      <dhx-grid ref="grid" v-model="slipDetails" class="slip-grid" :config="config" @constructGridSuccessful="constructGridSuccessful" />
    <!-- //DhxGrid component -->
      </div>
    </div>
  </div>
</layout>
</template>

<script>
import _ from 'lodash'

import Layout from '@/components/ModalSlot.vue'
import DhxGrid from '@/components/DhxGrid.vue'
import assert from '@/libs/assert'
//['docMngNo', 'value', 'readonly']
export default {
  props: {
    grSlipNo: {
      type: String,
      required: false
    }, slipDetail: {
      type: Array,
      required: false
    }, readonly: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  mixins: [],
  components: {
    Layout,
    DhxGrid
  },
  data() {
    return {
      title: 'Wings',
      slipDetails: [],
      config:{
        columns: [{
          id: 'itemSeq',
          align: 'center',
          value: 'No.',
          type: 'cntr',
          width: 20
        }, {
          id: 'wingsNm',
          align: 'center',
          value: '문서명',
          type: 'ed',
          width: 50
        }, {
          id: 'wingsId',
          align: 'center',
          value: '문서번호',
          type: 'ed',
          width: 60
        }, {
          id: 'wingsUrl',
          align: 'center',
          value: '문서보기',
          width: 30,
          component: {
            props: ['index', 'value', 'field'],
            template: `<span style="color: #0065b3;" @click="goLink()"> <i class="far fa-file-alt"></i></span>`,
            methods: {
              goLink(){
                if(this.value.wingsUrl !== undefined) window.open(this.value.wingsUrl, "_blank");
              }
            }
          }
        }],
        events: {
          onEditCell(stage, rId, cInd, nValue, oValue){
            let row = this.data[rId - 1]
            let colDef = this.options.columns[cInd]
            if (stage === 2 && nValue !== oValue) {
              switch (colDef.id) {
                case 'wingsId': 
                  try {
                    if(nValue.length < 32) throw '문서번호를 32자리 이내로 입력하셨습니다.'
                    // Delay 200ms
                    setTimeout(() => {
                      let mainUrl = "http://iapp.iljin.co.kr/emate-k15/appro.nsf/easiDocOpen_uni?openagent&docid="
                      // row.wingsUrl = mainUrl + row.wingsId.split('_')[1]
                      row.wingsId = nValue
                      row.wingsUrl = mainUrl + nValue.substr(nValue.length - 32)
                    }, 200)
                  }catch(e){
                    setTimeout(() => {
                      this.$swal({
                        type: 'warning',
                        text: e
                      }).then(()=> {
                        row.wingsId = undefined
                      })
                    }, 200)
                  }
                  
                  break
              }
            }

            return true

          },

        },
      }
    }
  },
  methods: {
    closeModal() {
      this.$emit('close', this.slipDetails)
      // this.$parent.close();
    },
    constructGridSuccessful(grid) {
      grid.attachHeader([],[])
    },
    goSearch() {
      this.$store.commit('loading');
      this.$http.get(_url(`/api/wings/document/${this.grSlipNo}`))
            .then(response => {
              if(response.data) {
                this.slipDetails = response.data
                this.slipDetails.forEach(x => {
                  x.grSlipNo = x.documentId
                  delete x.documentId
                })
              }

            }).catch(response => {

            }).finally(() => {
              this.$store.commit('finish');
            })
    },
    buttonClickEventAdd() {
      this.add_row({
        dcCd: 'D',
        lnTypeCd: 'ITEM',
        grSlipNo: this.grSlipNo,
        wingsNm: undefined,
        wingsId: undefined,
        wingsUrl: undefined
      })

    }, 
    buttonClickEventRemove(){
      this.remove_row()
    },
    buttenClickEventSave(){
      // ㅇ API
      // - POST "/api/wings/document"
      // ㅇ 파라미터명
      // -> 아래 파라미터들의 리스트로 보내주셔야 합니다.
      // - wingsId: 문서번호
      // - wingsNm: 문서명
      // - wingsUrl: wing url (hidden column)
      /** * IJD EA-01-01 개인비용(경비)신청서 
       * * Func: save 
       * * @param wingsDtoList is List<WIngsDto> 
       * *                     This has some fields. 
       * *                     wingsId: 문서번호 
       * *                     wingsNm: 문서명 
       * *                     wingsUrl: wings url * return List<Wings>: saved data 
       * * */
      try{
        let datas = this.slipDetails
        if(datas.length == 0) throw '추가된 행이 존재하지 않습니다.'
        
        for(let i=0; i < datas.length; i++){
          // if(this.$parent.$parent.slipTypeCd == 'E1' || this.$parent.$parent.slipTypeCd == 'E2'){
          //   if(this.$parent.$parent.data.eaSlipNo){
          //     datas[i].grSlipNo = this.$parent.$parent.data.eaSlipNo
          // }
          // }
          datas[i].new = false
          let row = i + 1
          if(datas[i].wingsNm === undefined || datas[i].wingsNm === '') throw row+'행 문서명을 입력해주세요.'
          if(datas[i].wingsId === undefined || datas[i].wingsId === '') throw row+'행 문서번호를 입력해주세요.'
        }

        this.$nextTick(() => {
          this.$store.commit('loading');
          this.$http.post(_url('/api/wings/document'), datas)
          .then(response => {
            datas.forEach((x, index) => {
              x.grSlipNo = response.data[index].documentId
            })
            this.$swal({ type: 'success', text: '저장되었습니다.' });
            this.$emit('close', datas)
          }).catch(response => {
            this.$swal({
              type: 'error',
              text: 'Wings문서 전송에 실패하였습니다.'
            })
            return response
          }).finally(() => {
            this.$store.commit('finish');
          })
        }, 200)
        
      }catch(e){
        this.$swal({
          type: 'warning',
          text: e
        })
      }
    },
    add_row(data) {
      data = data || {}
      this.slipDetails.push({
          dcCd: 'D',
          lnTypeCd: 'ITEM',
          grSlipNo: this.grSlipNo,
          wingsNm: undefined,
          wingsId: undefined,
          wingsUrl: undefined,
          new: true
      })
      
    },
    removeRowConfirm(){
      return new Promise((resolve,reject) =>{
        this.$swal({
          type: 'info',
          text: `Wings 문서를 삭제합니다. 계속 하시겠습니까?`,
          showCancelButton: true,
          confirmButtonText: '예',
          cancelButtonText: '아니오',
        }).then(response => {
          if(response.value){
            resolve()
          }else {
            reject()
          }
        })
      })
    },
    remove_row(){
      this.removeRowConfirm().then(() => {
        //TODO 컨펌창
        let index = this.$refs.grid.instance.getSelectedRowId() - 1
        let deleteList = []
        let rowdata = this.$refs.grid.value[index]
        var datas = this.slipDetails.splice(index,1)
        deleteList.push(rowdata)
        try{
          if(this.$refs.grid.instance.getSelectedRowId() == null) throw '선택된 행이 없습니다.'
          this.$store.commit('loading');
          this.$http.post(_url('/api/wings/document/delete'), deleteList)
              .then(response => {
                if(response){
                  this.$swal({ type: 'success', text: '삭제 되었습니다.' });
                  this.$emit('close', datas)
                }
              }).catch(response => {
            this.$swal({ type: 'warning', text: 'Wings 문서 삭제중 오류가 발생했습니다.' });
            console.log(response)
            this.goSearch()
          }).finally(() => {
            this.$store.commit('finish');
          })
          this.slipDetails.splice(index, 1)
          this.$refs.grid.instance.callEvent('onGridReconstructed', [])
        }catch(e){
          this.$swal({
            type: 'warning',
            text: e
          })
        }
      })
    }
  },
  created() {
  },
  mounted() {
    this.goSearch()
  },
  watch: {
    slipDetail: {
      immediate: true,
      deep: true,
      handler(value) {
        if(value !== undefined){
          this.slipDetails = value
        }
      }
    }
  }
    
}

function _url(...args) {
  args = args.map(x => String(x || '').trim().replace(/^\/*|\/*$/g, ''))
  args = args.filter(x => x)
  return args.join('/')
}
</script>

<style lang="scss" scoped>
.modal-card {
  width: 600px;
}

.display-area {
  :global(img) {
    width: 100%;
  }
}
</style>
