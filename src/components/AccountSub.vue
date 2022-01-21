<template>
<layout>
  <span slot="header">
    {{ title }} 조회
    <button class="btn-pop-close delete" aria-label="close" @click="$dismiss"></button>
  </span>
  <div slot="content">
    <form @submit.prevent="query()">
      <div class="btn-type1">
        <button type="submit" class="btn-size btn-gray">
          <span class="btn-icon"><i class="fas fa-search"></i></span>
          조회
        </button>
      </div>
      <div class="pop-content-search">
        <div class="field has-addons ">
          <div class="mr20 ">
            <span class="pop-c-name">- 보조계정 코드/명</span>
          </div>
          <div class="control is-expanded">
            <input class="input" type="text" v-model="search" />
          </div>
        </div>
      </div>
    </form>

    <!-- DHX 그리드 영역 -->
    <dhx-grid class="gridbox" v-model="data" :config="config" />
    <!-- //DHX 그리드 영역 -->
  </div>
</layout>
</template>

<script>
import Layout from '@/components/ModalSlot.vue'
import DhxGrid from '@/components/DhxGrid.vue'

export default {
  props: {
    title: {
      type: String,
      required: false,
      default: '보조계정과목'
    },
    acctCd: {
      type: String,
      required: true
    },
    searchStr: {
      type: String,
      required: false
    },
    queryFunction: {
      type: Function,
      required: false
    }
  },
  components: {
    Layout,
    DhxGrid
  },
  mixins: ['mixin'],
  data() {
    return {
      search: undefined,
      config: {
        columns: [{
          id: 'no',
          type: 'cntr',
          align: 'center',
          sort: 'int',
          value: 'No.'
        }, {
          id: 'subAcctCd',
          type: 'ro',
          align: 'center',
          sort: 'str',
          value: '보조계정코드'
        }, {
          id: 'subAcctNm',
          type: 'ro',
          align: 'left',
          sort: 'str',
          value: '보조계정명'
        }],
        events: {
          onRowDblClicked(rid) {
            var index = rid - 1
            var self = this.$parent.$parent
            self.data[index].acctNmSub = self.data[index].subAcctNm
            self.data[index].acctCdSub = self.data[index].subAcctCd
            self.$emit('close', self.data[index])
          }
        },
        height: 300
      },
      data: []
    }
  },
  methods: {
    $dismiss() {
      this.$emit('dismiss')
      this.$parent.close()
    },
    query(searchStr) {
      searchStr = searchStr || this.search
      this.$store.commit('loading')
      this.data = []
      let acctCd = this.acctCd

      if(!searchStr) searchStr = ''      
      return this.$http.get(`/api/account/sub/${acctCd}`)
      .then(response => {
        this.data = response.data
        return response
      }).finally(() => {
        this.$store.commit('finish')
      })
    }
  },
  created() {
    this.search = this.searchStr
    if (this.queryFunction !== undefined && typeof this.queryFunction === 'function') {
      this.query = () => {
        this.queryFunction.apply(this, [])
      }
    }

    if (this.search) {
      this.query()
    }
  },
  watch: {
    'deptCd': {
      immediate: true,
      deep: true,
      handler(value) {
        // console.log("너 와야대 ", value)
      }
    }
  }
}
</script>
