<template>
  <layout>
    <span slot="header">{{title}}<button class="btn-pop-close delete" aria-label="close" @click="$parent.close()"></button></span>
    
    <div slot="content">
        <div class="content-name">
            <div class="btn-wrap btn-type1 clearfix">
                <div class="dp-ib fl_right">
                    <button class="btn-size btn-blue fl_right" style="height: 33px; margin-right: 7px;" @click="cancel"><span class="btn-icon"><i class="fas fa-pen-alt"></i></span>취소</button>
                </div>
                <div class="dp-ib fl_right">
                    <button class="btn-size btn-gray fl_right" style="height: 33px; margin-right: 7px;" @click="save"><span class="btn-icon"><i class="fas fa-pen-alt"></i></span> 확인</button>
                </div>
            </div>
        </div>
        <!-- <section class="modal-card-body pop-content"> -->
        <!-- 내용 -->
        <div class="table-area mt20" >
            <div class="table-area">
                <div class="table-a">
                    <!-- <div class="table-name">
                        <h3 class="ico_table_name">결재의견</h3>
                    </div> -->
                    <table id="basic" class="table" style="width: calc(100% - 20px);margin:0 auto; height: 350px;">
                        <colgroup>
                            <col width="20%">
                            <col width="80%">
                        </colgroup>
                        <tbody>
                            <tr>
                                <th class="tp">제목</th>
                                <td>
                                    {{form.title}}
                                </td>
                            </tr>
                            <tr>
                                <th class="tp">결재구분</th>
                                <td>
                                    {{form.apprLine}}
                                </td>
                            </tr>
                            <tr>
                                <th class="tp">의견</th>
                                <td>
                                    <textarea v-model="form.apprRsn" style="height: 140px;" @click ="reset()"></textarea>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                
            </div>
        </div>
        <!-- 내용 -->
        <!-- </section> -->
    </div>
  </layout>
</template>

<script>
import moment from 'moment'
import mixin from '@/mixin';
import mixinSlip from '@/mixin/slip';
import _ from 'lodash'

import assert from '@/libs/assert'
import Layout from '@/components/ModalSlot.vue'


import {
  url as _url
} from '@/libs/join'

//
//'./grid/GridCheckbox.vue'
//['param','slipTypeCd'],
export default {
  name: 'SlipCrdLst',
  props: {
    flag: {
      type: Boolean,
      required: false
    },
    ing: {
      type: Boolean,
      required: false
    },
    data: {
      type: Array,
      required: true
    },
    //2020.05.29 전표상세내역 팝업 구분
    get: {
      type: String,
      required: false
    }
  },
  components: {Layout},
  mixins: [ mixin, mixinSlip ],
  data() {
    return {
      title: '',
      re:'1', //2020.05.27 기본문구 리셋
      slipList: [],
      form: {
          title: undefined,
          apprRsn: '',//2020.05.21 의견 문구 셋팅
          apprLine: undefined
      },
      
    }
  },
  methods: {
    //2020.05.27 의견 클릭시 공백
    reset(){
        if(this.re == '1'){
            this.form.apprRsn = '';
        }
        this.re = '2';
    },
    symbolValidation(val){
      if(val){
        // 값이 있음
        val = val.replace(/ /g,"")
        var valList = val.split('');
        var num = /[0-9]/;	// 숫자
        var eng = /[a-zA-Z]/;	// 문자
        var spc = /[^[\]]/; // 특수문자
        var kor = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/; // 한글체크
        for (const item of valList) {
          if(num.test(item)||eng.test(item)||spc.test(item)||kor.test(item)){
            //숫자,영어,한글,허용된 특수문자만 있을 경우
          }else{
            //숫자,영어,한글,허용된 특수문자 외의 값이 있을 경우
            return false
          }
        }
        return true
      }else{
        //값이 없음
        return true
      }
    },
    save(){
        try {
            
            let data = this.slipList
            let url = '/api/slip/mnt/acctAccept'
            let text = '승인 후 취소 되지 않습니다. 승인 작업을 계속하시겠습니까?'
            let aprrRsnText = '결재의견을 작성하셔야 재경승인을 할 수 있습니다.'

            if(this.flag == false && this.ing == false) {
                url = '/api/slip/mnt/acctReject'
                text = '반려 후 취소 되지 않습니다. 반려 작업을 계속하시겠습니까?'
                aprrRsnText = '결재의견을 작성하셔야 재경반려를 할 수 있습니다.'
            }
            if(this.ing == true){
                url = '/api/slip/mnt/acctHold'
                text = '재경검인을 시작합니다. 검인 작업을 계속하시겠습니까?'
                aprrRsnText = '결재의견을 작성하셔야 재경검인를 할 수 있습니다.'
            }
            if(!this.form.apprRsn) {
                this.$swal({
                    type: 'error',
                    text: aprrRsnText
                }) 
                return;
            }
            if(!this.symbolValidation(this.form.apprRsn)){
              this.$swal({
                type: 'error',
                text: '결재 의견에 허용되지 않은 특수문자가 있습니다.'
              })
              return;
            }

            this.$swal({
                type: 'question',
                text: text,
                showCancelButton: true,
                confirmButtonText: 'Yes'
            }).then(response => {
                if (response.value) {

                    
                    //재경 반려인 경우 건별로 api 호출        
                    if(url === "/api/slip/mnt/acctReject"){
                        
                        try{
                            
                            this.$store.commit('loading')

                            data.forEach((item) => {
                                var reqData = [];
                                
                                reqData.push(item)

                                this.$http.post(url, reqData, {
                                    params: {
                                        apprRsn: this.form.apprRsn
                                    }
                                })
                            });
                            
                        }finally{
                            this.$swal({
                                type: 'success',
                                text: "처리완료 되었습니다"
                            }).then((value)=>{
                                if(value){
                                    this.$emit('close', response)
                                }
                            })
                            //2020.05.29 전표상세내역 팝업 닫기
                            if(this.get == '10'){
                                this.$parent.$parent.$parent.close();
                            }

                            this.$store.commit('finish')
                        }

                    }else{
                        this.$store.commit('loading')
                        
                        this.$http.post(url, data, {
                        params: {
                            apprRsn: this.form.apprRsn
                        }
                        }).then(response => {
                            this.$swal({
                                type: 'success',
                                text: response.data
                            }).then((value)=>{
                                if(value){
                                    this.$emit('close', response)
                                }
                            })
                            return response
                        }).catch(response => {
                            // TODO::Error Handling
                            return response
                        }).finally(() => {
                            //2020.05.29 전표상세내역 팝업 닫기
                            if(this.get == '10'){
                                this.$parent.$parent.$parent.close();
                            }
                            this.$store.commit('finish')
                        })                        

                    }
                    
                }
            })
        } catch(e) {
            this.$swal({
                type: 'error',
                text: e
            })
        }
    },
    cancel(){
        this.$parent.close();
    },
  },
  created(){
      
  },
  mounted() {
     //2020.05.21 의견 문구 셋팅
     if(this.flag == false && this.ing == false) {
        this.form.apprRsn = '반려합니다.'
        this.title = '반려'
     }else if(this.flag == true && this.ing == false) {
        this.form.apprRsn = '확정합니다.'
        this.title = '확정'
     }else if(this.flag == false && this.ing == true) {
        this.form.apprRsn = '검인중인 건입니다.'
        this.title = '검인'
     }


  },
  watch: {
    data: {
      immediate: true,
      deep: true,
      handler(value) {
        this.slipList = value
        if(this.slipList.length > 1) {
            this.form.title = this.slipList[0].slipTypeNm + '/' + this.slipList[0].totAmt +'원 /' + this.slipList[0].hdSgtxt +' 외' + this.slipList.length + '건'
            this.form.apprLine = this.slipList[0].slipStatNm +' 외' + this.slipList.length + '건'
        } else {
            this.form.title = this.slipList[0].slipTypeNm + '/' + this.slipList[0].totAmt +'원 /' + this.slipList[0].hdSgtxt
            this.form.apprLine = this.slipList[0].slipStatNm
        }
      }
    }
  }

};
</script>

<style scoped>


</style>
