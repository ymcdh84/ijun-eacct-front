//2020.05.26 전표관리에 재경검인, 재경반려 method 따로 뺌

//import SlipMng from '@/views/SlipMng.vue'
import SlipApprovalPop from '@/components/SlipApprovalPop.vue'

import assert from '@/libs/assert'

export default {
    data(){
        return {
            data:{},
            data1:[],
            apprRsn: undefined
        }
    },
    methods: {
        
         approvalButtonClickEvent(value,get) {
            this.data = value;
            try {
              //2020.05.26 팝업창에서 결재할때
              if(get=='10'){
                let data1 = [];
                data1.push(this.data);
                const vm = this.$parent.$parent
                this.$modal.open({
                    component: SlipApprovalPop,
                    parent: this,
                    props: {
                    data: data1,
                    flag: true,
                    get: get //2020.05.29 전표상세내역 팝업 구분
                    },
                    width: 1200,
                    events: {
                      close(object) {
                        vm.goSearch()
                      }
                    }
                })
              }else{
                //2020.05.26 화면에서 바로 결재할때
                let data = this.data.filter(x => x.chk)
                let submitted = data.filter(x => x.slipStatCd === '60' || x.slipStatCd === '70')
        
                assert.apply(this, [data.length > 0, '재경검인할 전표를 선택해주세요.'])
                assert.apply(this, [submitted.length === 0, '재경반려 또는 재경검인된 전표는 다시 재경검인할 수 없습니다.'])
                // assert.apply(this, [this.apprRsn, '결재의견을 작성하셔야 재경승인을 할 수 있습니다.'])
                const vm = this
                this.$modal.open({
                    component: SlipApprovalPop,
                    parent: this,
                    props: {
                    data: data,
                    flag: true
                    },
                    width: 1200,
                    events: {
                        close(object) {
                            vm.goSearch()
                        }
                    }
                })
              }
            } catch (e) {
              this.$swal({
                type: 'error',
                text: e
              })
            }
          },
          rejectButtonClickEvent(value,get) {
            this.data = value;
            try {
                //2020.05.26 팝업창에서 반려할때
                if(get=='10'){
                    let data1 = [];
                    data1.push(this.data);
                    const vm = this.$parent.$parent
                    this.$modal.open({
                        component: SlipApprovalPop,
                        parent: this,
                        props: {
                        data: data1,
                        flag: false,
                        get: get
                        },
                        width: 1200,
                        events: {
                        close(object) {
                            vm.goSearch()
                        }
                        }
                    })
                  }else{
                    let data = this.data.filter(x => x.chk)
                    let submitted = data.filter(x => x.slipStatCd === '60' || x.slipStatCd === '70')
            
                    assert.apply(this, [data.length > 0, '재경반려할 전표를 선택해주세요.'])
                    assert.apply(this, [submitted.length === 0, '재경반려 또는 재경검인된 전표는 다시 재경반려할 수 없습니다.'])
                    // assert.apply(this, [this.apprRsn, '결재의견을 작성하셔야 재경반려를 할 수 있습니다.'])
                    const vm = this
                    this.$modal.open({
                        component: SlipApprovalPop,
                        parent: this,
                        props: {
                        data: data,
                        flag: false
                        },
                        width: 1200,
                        events: {
                            close(object) {
                                vm.goSearch()
                            }
                        }
                    })
                }
            } catch (e) {
              this.$swal({
                type: 'error',
                text: e
              })
            }
          },
          approvalingButtonClickEventOld(value,get) {
            this.data = value;
            try {
                //2020.05.26 팝업창에서 검인할때
                if(get=='10'){
                    let data1 = [];
                    data1.push(this.data);
                    const vm = this.$parent.$parent
                    this.$modal.open({
                        component: SlipApprovalPop,
                        parent: this,
                        props: {
                        data: data1,
                        ing: true,
                        get: get
                        },
                        width: 1200,
                        events: {
                        close(object) {
                            vm.goSearch()
                        }
                        }
                    })
                  }else{
                    let data = this.data.filter(x => x.chk)
                    let submitted = data.filter(x => x.slipStatCd === '60' || x.slipStatCd === '70')
            
                    assert.apply(this, [data.length > 0, '재경반려할 전표를 선택해주세요.'])
                    assert.apply(this, [submitted.length === 0, '재경반려 또는 재경검인된 전표는 다시 재경반려할 수 없습니다.'])
                    // assert.apply(this, [this.apprRsn, '결재의견을 작성하셔야 재경반려를 할 수 있습니다.'])
                    const vm = this
                    this.$modal.open({
                        component: SlipApprovalPop,
                        parent: this,
                        props: {
                        data: data,
                        flag: false
                        },
                        width: 1200,
                        events: {
                            close(object) {
                                vm.goSearch()
                            }
                        }
                    })
                }
            } catch (e) {
              this.$swal({
                type: 'error',
                text: e
              })
            }
          },
          rejectButtonClickEventNew(value) {
            this.data = value;
            try {
                  let data = this.data.filter(x => x.useYn)
                  let submitted = data.filter(x => x.slipStatCd === '60' || x.slipStatCd === '70')
          
                  assert.apply(this, [data.length > 0, '재경반려할 전표를 선택해주세요.'])
                  assert.apply(this, [submitted.length === 0, '재경반려 또는 재경검인된 전표는 다시 반려할 수 없습니다.'])
                  // assert.apply(this, [this.apprRsn, '결재의견을 작성하셔야 재경반려를 할 수 있습니다.'])
                  const that = this
                  this.$modal.open({
                      component: SlipApprovalPop,
                      parent: this,
                      props: {
                      data: data,
                      flag: false
                      },
                      width: 1200,
                      events: {
                          close() {
                              that.goSearch()
                          }
                      }
                  })
            } catch (e) {
              this.$swal({
                type: 'error',
                text: e
              })
            }
          },
          approvalButtonClickEventNew(value) {
            this.data = value;
            try {
                
                let data = this.data.filter(x => x.useYn)
                let submitted = data.filter(x => x.slipStatCd === '60' || x.slipStatCd === '70')
                let erpStat = data.filter(v => v.erpStatus !== 'COMPLETE' && v.slipTypeCd !== 'E11' && v.slipTypeCd !== 'E12' && v.slipTypeCd !== 'E13' && v.slipTypeCd !== 'E14' && v.slipTypeCd !== 'E15')
          
                  assert.apply(this, [data.length > 0, '재경검인할 전표를 선택해주세요.'])
                  assert.apply(this, [submitted.length === 0, '재경반려 또는 재경확정된 전표는 다시 확정할 수 없습니다.'])
                  assert.apply(this, [erpStat.length === 0, 'ERP 전송상태를 확인해주세요.'])
                  // assert.apply(this, [this.apprRsn, '결재의견을 작성하셔야 재경승인을 할 수 있습니다.'])
                  const thats = this
                  this.$modal.open({
                      component: SlipApprovalPop,
                      parent: this,
                      props: {
                      data: data,
                      flag: true
                      },
                      width: 1200,
                      events: {
                          close(object) {
                            thats.goSearch()
                          }
                      }
                  })
            } catch (e) {
              this.$swal({
                type: 'error',
                text: e
              })
            }
          },
          approvalingButtonClickEvent(value){
            this.data = value;
            try {

                let data = this.data.filter(x => x.useYn)
                // let submitted = data.filter(x => x.slipStatCd === '65')
                let erpStat = data.filter(v => v.erpStatus !== 'COMPLETE' && v.slipTypeCd !== 'E11' && v.slipTypeCd !== 'E12' && v.slipTypeCd !== 'E13' && v.slipTypeCd !== 'E14' && v.slipTypeCd !== 'E15')
          
                  assert.apply(this, [data.length > 0, '재경검인할 전표를 선택해주세요.'])
                  // assert.apply(this, [submitted.length === 0, '재경검인된 전표는 다시 재경검인할 수 없습니다.'])
                  assert.apply(this, [erpStat.length === 0, 'ERP 전송상태를 확인해주세요.'])
                  // assert.apply(this, [this.apprRsn, '결재의견을 작성하셔야 재경승인을 할 수 있습니다.'])
                  const thats = this
                  this.$modal.open({
                      component: SlipApprovalPop,
                      parent: this,
                      props: {
                      data: data,
                      ing:true,
                      },
                      width: 1200,
                      events: {
                          close(object) {
                            thats.goSearch()
                          }
                      }
                  })
            } catch (e) {
              this.$swal({
                type: 'error',
                text: e
              })
            }
          }

    }
}