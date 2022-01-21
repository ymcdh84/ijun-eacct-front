<template>
<layout>
  <span slot="header">
    {{ title }}
    <button class="btn-pop-close delete" aria-label="close" @click="closeModal()"></button>
  </span>
  <div slot="content">
    <div class="btn-wrap btn-type1 fl_right">
        <button class="btn-size btn-gray" @click="allChk">
            <span class="btn-icon"><i class="fas fa-check"></i></span> 전체선택
        </button>      
        <button class="btn-size btn-gray fl_left" @click="goSearch"><span class="btn-icon"><i
                class="fas fa-search"></i></span> 조회
        </button>
        <button class="btn-size btn-blue fl_left" @click="goSubmit"><span class="btn-icon"><i
                class="fas fa-save"></i></span> 적용
        </button>
    </div>
    <!-- 검색조건 영역 -->
    <div class="desc-content search-border">
        <div class="item desc-left" style="width: 300px; margin-right:30px;">
            <div class="desc-item">
                <div class="tit">
                    <span class="label-tit">- 현장(계약번호)</span>
                </div>
                <div class="desc" style="margin-left: 20px">
                  <div class="form-input">
                    <input type="text" class="input" v-model="form.productCd" />
                  </div>
                </div>
            </div>
        </div>
        <div class="item desc-center" style="width: 350px; margin-right:30px;">
            <div class="desc-item">
                <div class="tit">
                    <span class="label-tit">- 지급거래처</span>
                </div>
                <div class="desc" style="margin-left: 10px">
                    <div class="td-s-thumb search-area" style="width: 100%">
                        <input class="input input-bg" type="text" style="width:100px;" v-model="form.vendorCd">
                        <div class="ip-box ip-box-w02" style="width:150px;">
                            <input class="input" type="text" v-model="form.vendorNm" @input="initVendor" @keypress.enter="popVendor">
                            <button class="icon is-right" @click="popVendor(true)"><i class="fas fa-search"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="item desc-right" style="width: 350px;">
            <div class="desc-item">
                <div class="tit">
                    <span class="label-tit">- 작성자</span>
                </div>
                <div class="desc" style="margin-left: 10px">
                    <div class="td-s-thumb search-area" style="width: 100%">
                        <input class="input input-bg" type="text" style="width:100px;" v-model="form.writerId" disabled>
                        <div class="ip-box ip-box-w02" style="width:150px;">
                            <input class="input" type="text" v-model="form.wrtNm" @input="initEmp" @keypress.enter="popEmp">
                            <button class="icon is-right" @click="popEmp(true)"><i class="fas fa-search"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- //검색조건 영역 -->    
    <div class="table-b">
      <div class="table-header">
        <div class="btn-wrap btn-type2">
          <button class="btn-size btn-w-gray" @click="addWingsRow"><span class="btn-icon"><i class="fas fa-plus"></i></span>행추가</button>
        </div>
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
import Vendor from '@/components/Vendor_Ag.vue'
import Emp from '@/components/Emp_Ag.vue'
import assert from '@/libs/assert'

//['docMngNo', 'value', 'readonly']
export default {
  props: {
    eaSlipNo: {
      type: Array,
      required: true
    },
    slipDetail: {
      type: Array,
      required: false
    }, readonly: {
      type: Boolean,
      required: false,
      default: false
    }, slipTypeCd: {
      type: String,
      required: false
    },payCustCd: {
      type: String,
      required: false
    },wrtId: {
      type: String,
      required: false
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
        columns: [
          {
          id: 'chk',
          type: 'ch', 
          align: 'center', 
          width: 10, 
          value: '#'
        },
          {
          id: 'itemSeq',
          align: 'center',
          value: 'No.',
          type: 'cntr',
          width: 10
        }, {
          id: 'wings_nm',
          align: 'center',
          value: '문서명',
          type: 'ed',
          width: 50
        }, {
          id: 'wings_id',
          align: 'center',
          value: '문서번호',
          type: 'ed',
          width: 60
        }, {
          id: 'wings_url',
          align: 'center',
          value: '문서보기',
          width: 30,
          component: {
            props: ['index', 'value', 'field'],
            template: `<span style="color: #0065b3;" @click="goLink()"> <i class="far fa-file-alt"></i></span>`,
            methods: {
              goLink(){
                if(this.value.wings_url !== undefined) window.open(this.value.wings_url, "_blank");
                else{
                  var lastIndex = this.value.wings_id.lastIndexOf('_')
                  window.open(`http://iapp.iljin.co.kr/emate-k15/appro.nsf/easiDocOpen_uni?openagent&docid=${this.value.wings_id.substr(lastIndex+1, this.value.wings_id.length)}`, "_blank");
                }
              }
            }
          }
        }],
        events: {
          onEditCell(stage, rId, cInd) {
            if (cInd === 3) {
              if(!this.data[rId - 1].new){
                return false
              }
            }
            return true
          }
        },
        afterRefreshData(grid, data) {
          if (grid !== undefined && Array.isArray(data)) {
            this.$nextTick(() => {
              for (var index = 0, row = data[index]; index < data.length; row = data[++index]) {
                let rId = grid.getRowId(index)
                this.setColumnClassName(rId, 3, 'bg-grey', true)
                this.setColumnClassName(rId, 3, 'bg-lightpink', true)
                if (row.new) {
                  this.setColumnClassName(rId, 3, 'bg-lightpink')
                } else {
                  this.setColumnClassName(rId, 3, 'bg-grey')
                }
              }
            })
          }
        }
      },
      form: {
          searchYm: this.$moment().add(-1, 'month').format('YYYY-MM'),
          productCd: '',
          vendorCd: '',
          vendorNm: '',
          evdCustBizNo: '',
          writerId: '',
          wrtNm: '',
      }, 
      chkYn : false     
    }
  },
  methods: {
    addWingsRow(){
      this.slipDetails.push({
        chk:false,
        wings_id:'',
        wings_nm:'',
        wings_url:undefined,
        new: true
      })
    },
    closeModal() {
      this.$emit('close')
    },
    constructGridSuccessful(grid) {
      grid.attachHeader([],[])
    },
    goSearch() {
    
      const param = JSON.parse(JSON.stringify(this.form));
      
      this.$store.commit('loading')
      this.$http.get('/api/wings/previous', {
          params: {
              project : this.form.productCd,
              customer : this.form.vendorCd,
              writer : this.form.writerId
          }
          
      }).then(response => {

        response.data.forEach(x=> {x.chk = false})

        this.slipDetails = response.data

      }).finally(() => {
          this.$store.commit('finish')
      })
    },
    goSubmit() {
        var list = this.slipDetails.filter(v => v.chk)
        this.result = [];
        if(list.length > 0){
            this.result = list;
            this.buttonEventWingsSubmit()
        } else {
            this.$swal({ type: 'info', text: '적용할 기안서를 선택해 주세요.' });
        }
    },
    buttonEventWingsSubmit(){
      const that = this;
      var selWings = [];

      for(var j = 0; j< this.slipDetails.length; j++){
        if(this.slipDetails[j].chk){
          selWings.push({
            grSlipNo : '',
            wingsId : this.slipDetails[j].wings_id,
            wingsNm : this.slipDetails[j].wings_nm,
            wingsUrl : this.slipDetails[j].wings_url ? this.slipDetails[j].wings_url :  `http://iapp.iljin.co.kr/emate-k15/appro.nsf/easiDocOpen_uni?openagent&docid=${this.slipDetails[j].wings_id.substr(this.slipDetails[j].wings_id.lastIndexOf('_',this.slipDetails[j].wings_id.length)+1, this.slipDetails[j].wings_id.length)}`
          })
        }
      }

      this.$swal({
      type: 'question',
      text: '기안서 일괄 적용 하시겠습니까?',
      showCancelButton: true
      }).then(r => {
      if (r.value) {

          this.$store.commit('loading')
          this.$http.post(`/api/wings/bundle`, {
              eaSlipNoList : that.eaSlipNo,
              wingsDtoList : selWings
          })
          .then((response) => {
              
              this.$emit('close', selWings)
              
          })
          .finally(() => {
              this.$store.commit('finish')
          });

      }})
    },
    initVendor(force) {
        if (force === true) this.form.vendorNm = '';
        
        if (this.form.vendorNm === '') {
            this.form.vendorCd = '';
            this.form.evdCustBizNo = '';
        }
    },
    popVendor(clear) {
        let vm = this
        this.$modal.open({
            component: Vendor,
            props: {
                param: this.form.vendorNm,
                slipTypeCd: vm.slipTypeCd
            },
            parent: this,
            events: {
                close(obj) {
                    vm.form.vendorCd = obj.vendCd;
                    vm.form.vendorNm = obj.vendNm;
                    vm.form.evdCustBizNo = obj.bizNo;                    
                }
            }
        })
    },
    initEmp(force) {
        if (force === true) this.form.wrtNm = '';
        if (this.form.wrtNm === '') {
            this.form.writerId = '';
        }
    }, 
    popEmp(clear) {
        let vm = this
        this.$modal.open({
            component: Emp,
            props: {
                param: this.form.wrtNm
            },
            parent: this,
            events: {
                close(obj) {
                   vm.form.writerId = obj.empNo;
                   vm.form.wrtNm = obj.empNm;
                }
            }
        })
    },
    allChk(){
        this.chkYn = this.chkYn ? false : true;
        
        for(var i=0; i< this.slipDetails.length; i++){
          this.slipDetails[i].chk = this.chkYn
        }
    },
    initialValue(){
      var isResponseEmp = false
      if(!_.isEmpty(this.payCustCd)&&!_.isEmpty(this.wrtId)){
        this.$http.get(`/api/vendor/${this.slipTypeCd}/${this.payCustCd}`).then(response => {
          if(response.data.length === 1){
            this.form.vendorCd = response.data[0].vendCd
            this.form.vendorNm = response.data[0].vendNm
            if(isResponseEmp){this.goSearch()}
          }
        })
        this.$http.get(`/api/emp/${this.wrtId}`).then(response => {
          if(response.data.length === 1){
            this.form.writerId = response.data[0].empNo
            this.form.wrtNm = response.data[0].empNm
            isResponseEmp = true
          }
        })
      }
    }
  },  
  mounted() {
    this.initialValue()
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
