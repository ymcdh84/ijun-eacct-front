<template>
  <layout>
    <span slot="header">{{title}}<button class="btn-pop-close delete" aria-label="close" @click="$dismiss"></button></span>
    <div slot="content">
      <div class="btn-type1">
          <button class="btn-size btn-gray" @click="goSearch(true)"><span class="btn-icon"><i class="fas fa-search"></i></span> 조회</button>
      </div>

      <div class="pop-content-search">
          <div class="field has-addons ">
              <div class="mr20 ">
                  <span class="pop-c-name">- 계정과목 코드/명</span>
              </div>
              <div class="control is-expanded">
                  <input class="input" type="text" v-model="search" @keypress.enter="goSearch">
              </div>
          </div>
      </div>
      <dhx-grid class="ctrlGridbox" v-model="data" :config="config" />
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
      default: '계정과목 조회'
    },
    searchStr: {
      type: String,
      required: false
    }
  },
  components: {
    Layout,
    DhxGrid
  },
  data() {
    return {
      search: undefined,
      config: {
        columns: [{
          id: 'no',
          type: 'cntr',
          align: 'center',
          sort: 'int',
          value: 'No.',
          width: 50
        }, {
          id: 'acctCd',
          type: 'ro',
          align: 'center',
          sort: 'str',
          value: '계정코드'
        }, {
          id: 'acctNm',
          type: 'ro',
          align: 'left',
          sort: 'str',
          value: '계정명',
          width: 150
        }],
        events: {
          onRowDblClicked(rid) {
            var index = rid - 1
            var self = this.$parent.$parent
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
    goSearch() {
      this.$store.commit('loading')
      this.data = []
      
      this.$http.get(_url('/api/ctrlAccount', this.search))
      .then(response => {
        this.data = response.data
        return response
      })
      .catch(response => {
        return response
      })
      .finally(() => {
        this.$store.commit('finish')
      })
    }
  },
  created() {
    this.search = this.searchStr
    if (this.search) {
      this.goSearch()
    }
  }
}

function _url(...args) {
  args = args.map(x => String(x || '').trim().replace(/^\/*|\/*$/g, ''))
  args = args.filter(x => x)
  return args.join('/')
}

</script>