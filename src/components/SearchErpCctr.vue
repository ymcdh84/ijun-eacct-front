<template>
<div class="desc-item" v-if="options.type === '01'">
  <div class="tit"><span class="label-tit">- {{ title }}</span></div>
  <div class="desc">
    <div class="td-s-thumb search-area">
      <input class="input input-bg" type="text" v-model="data.cctrCd" style="width:60px;" disabled="disabled">
      <div class="ip-box ip-box-w02">
        <input class="input" type="text" v-model="data.cctrNm" @keypress.enter.prevent="query(data.cctrNm)" />
        <button class="icon is-right modal-button" @click="openModal(data.cctrNm)">
          <i class="fas fa-search"></i>
        </button>
      </div>
    </div>
  </div>
</div>
<div class="form-group" v-else-if="options.type === '02'">
  <label class="control-label">{{ title }}</label>
  <div class="form-input">
    <div class="search-box">
      <div class="input-group" style="poaition:relative">
        <input type="text" class="input" disabled="disabled" v-model="data.cctrCd" style="width: 80px;" />
        <input type="text" class="input search-input" v-model="data.cctrNm" style="width:calc(100% - 88px);max-width:120px" :disabled="lock()" @input="initCctr" @keypress.enter.prevent="query(data.cctrNm)" />
        <button type="button" style="width:30px;height:30px;vertical-align:top" class="btn-icon" @click="openModal(data.cctrNm)" v-if="!lock()">
          <span class="btn-icon" style="top:3px;"><i class="fas fa-search"></i></span>
        </button>
      </div>
    </div>
  </div>
</div>
<div v-else></div>
</template>

<script>
import Cctr from './ErpCctr_Ag.vue'

const def_props = {
  type: '01',
  authorize: true,
  cctrCd: 'cctrCd',
  cctrNm: 'cctrNm'
}

export default {
  props: {
    value: {
      type: Object,
      required: true
    },
    title: {
      type: String,
      required: false,
      default: '부서'
    },
    options: {
      type: Object,
      required: false,
      default () {
        return {
          type: '01',
          authorize: true,
          cctrCd: 'cctrCd',
          cctrNm: 'cctrNm'
        }
      }
    }
  },
  data() {
    return {
      data: {
        authority: undefined,
        cctrCd: undefined,
        cctrNm: undefined,
        roleCd:undefined
      }
    }
  },
  methods: {
    lock() {
      if(this.roleCd !== 'ADMIN' && this.roleCd !== 'P_USER'){
        return true
      }
      return false
    },
    submit(data) {
      data = data || {}
      // Apply data
      this.data.cctrCd = data.deptCd
      this.data.cctrNm = data.deptNm
      // Apply to parents
      this.value[this.options.cctrCd] = this.data.cctrCd
      this.value[this.options.cctrNm] = this.data.cctrNm
      this.$emit('input', this.value)
      this.$emit('submit')
    },
    initCctr(force) {
      if (force === true) this.data.cctrNm = '';
      if (this.data.cctrNm === '') {
        this.data.cctrCd = '';
        if(this.$parent.params.wrtDeptCd !== undefined) {
          this.$parent.params.wrtDeptNm = '';
          this.$parent.params.wrtDeptCd = '';
        }
      this.submit();
        // this.value[this.options.cctrCd] = this.data.cctrCd
        // this.value[this.options.cctrNm] = this.data.cctrNm
        // this.$emit('input', this.value)
      }
    },
    query(searchStr) {
      if (searchStr) {
        this.$store.commit('loading')
        this.$http.get(`/api/cctr/erp/${searchStr}`)
          .then(response => {
            if (Array.isArray(response.data)) {
              if (response.data.length === 1) {
                this.submit(response.data[0])
              } else {
                this.openModal(searchStr)
              }
            } else {
              this.submit()
            }
            return response
          })
          .catch(() => {
            this.submit()
          })
          .finally(response => {
            this.$store.commit('finish')
          })
      } else {
        this.submit()
      }
    },
    openModal(searchStr) {
      let vm = this
      this.$modal.open({
        component: Cctr,
        props: {
          title: this.title,
          searchStr: searchStr
        },
        parent: this,
        events: {
          close(data) {
            vm.submit.apply(vm, [data])
          }
        }
      })
    },
    initializeValues() {
      if (this.authority === '30') {
        try {
          let loginInfo = this.$store.state.loginInfo
          // this.data.cctrCd = loginInfo.loginDeptCd
          let loginDeptNm = loginInfo.loginDeptNm
          this.$store.commit('loading')
          this.$http.get(`/api/cctr/erp/${loginDeptNm}`)
              .then(response => {
                if (Array.isArray(response.data)) {
                  if (response.data.length === 1) {
                    this.data.cctrCd = response.data[0].deptCd
                    this.data.cctrNm = response.data[0].deptNm
                  }
                }
              })
              .catch((msg) => {
                console.log('비용부서 초기 셋팅 에러 로그인 부서명에 검색결과가 중복건입니다.' + msg)
              })
              .finally(response => {
                this.$store.commit('finish')
                this.value[this.options.cctrCd] = this.data.cctrCd
                this.value[this.options.cctrNm] = this.data.cctrNm
                this.$emit('input', this.value)
                this.$emit('submit')
              })
        } catch (e) {
          // ...
        }
      }
    }
  },
  created() {
    try {
      let authority = this.$store.state.loginInfo.authorities.map(x => x.roleSelectCd)[0]
      if (!authority) {
        authority = undefined
      }
      this.authority = authority
      this.roleCd = this.$store.state.loginInfo.authorities[0].roleCd
      this.initializeValues()
    } catch (e) {}
  },
  watch: {
    'value': {
      immediate: true,
      deep: true,
      handler(value) {
        this.data = {
          cctrCd: value[this.options.cctrCd],
          cctrNm: value[this.options.cctrNm]
        }
      }
    },
    'options': {
      immediate: true,
      deep: true,
      handler(value) {
        for (var member in def_props) {
          if (value[member] === undefined) {
            value[member] = def_props[member]
          }
        }
        this.initializeValues()
      }
    }
  }
}
</script>
