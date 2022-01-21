<template>
  <div class="inner-box">
    <!-- 헤더 -->
    <div class="content-name">
      <h2 class="dp-ib">전표 관리항목 설정</h2>
      <div class="btn-wrap btn-type1 clearfix">
         <button type="submit" class="btn-size btn-gray fl_left" @click="query">
          <span class="btn-icon"><i class="fas fa-search"></i></span> 조회
        </button>
        <button class="btn-size btn-blue fl_left" @click="save">
          <span class="btn-icon"><i class="fas fa-save"></i></span> 저장
        </button>
      </div>
    </div>
    <!-- //헤더 -->

    <!-- 검색영역 -->
    <div class="search-form">
      <!-- <search-account title="계정과목" v-model="params" :options="{ type: '02' }" /> -->
      <div class="form-group">
        <label class="control-label">계정과목</label>
        <div class="form-input">
          <div class="search-box">
            <div class="input-group">
              <input
                type="text"
                class="input"
                disabled="disabled"
                v-model="params.acctCd"
                style="width: 80px"
              />
              <input
                type="text"
                class="input search-input"
                v-model="params.acctNm"
                style="max-width: calc(100% - 88px)"
                @input="initAccount"
                @keypress.enter.prevent="openModalAccount(params.acctNm)"
              />
              <button
                type="button"
                class="btn-icon"
                @click="openModalAccount(params.acctNm)"
                style="width: 30px; height: 30px; vertical-align: top"
              >
                <span class="btn-icon" style="top: 3px"
                  ><i class="fas fa-search"></i
                ></span>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="form-group">
        <label class="control-label">사용여부</label>
        <div class="form-input">
          <select class="input" v-model="params.useYn">
            <option value="">==전체==</option>
            <option value="Y">사용</option>
            <option value="N">사용안함</option>
          </select>
        </div>
      </div>
    </div>
    <!-- //검색영역 -->

    <!-- 데이터 영역 -->
    <div class="table-area mt10">
      <div class="table-b">
        <div class="table-header">
          <div class="table-name">
            <h3 class="ico_table_name">관리항목</h3>
          </div>
          <div class="btn-wrap btn-type2 clearfix">
            <button type="button" class="btn-size btn-w-gray" @click="addRow">
              <span class="btn-icon"><i class="fas fa-plus"></i></span> 행추가
            </button>
            <button
              type="button"
              class="btn-size btn-w-gray"
              @click="removeRow"
            >
              <span class="btn-icon"><i class="fas fa-trash-alt"></i></span>
              행삭제
            </button>
            <button class="btn-size btn-excel" @click="toExcel">
              엑셀 저장
            </button>
          </div>
        </div>
        <dhx-grid
          ref="grid"
          v-model="data"
          :config="config"
          @constructGridSuccessful="constructGridSuccessful"
        />
      </div>
    </div>
    <!-- //데이터 영역 -->
  </div>
</template>

<script>
import Vue from "vue";
import _ from "lodash";
import assert from "@/libs/assert";
import mixin from "@/mixin/common";
import DhxGrid from "@/components/DhxGrid.vue";
import Account from "@/components/Account_new.vue";

import GridCheckbox from "@/components/grid/GridCheckbox.vue";
import GridNumberInput from "@/components/grid/GridNumberInput.vue";
import GridSelect from "@/components/grid/GridSelect.vue";
import SerchAcctPop from "@/components/SerchAcctPop.vue";

const bus = new Vue();

const defaultParams = {
  acctCd: undefined,
  acctNm: undefined,
  useYn: "",
};

const options = {};
const lock = {};

function queryMngItemCd() {
  return new Promise((resolve, reject) => {
    if (options["MNG_ITEM_CD"] !== undefined || lock["MNG_ITEM_CD"]) {
      reject(false);
    } else {
      lock["MNG_ITEM_CD"] = true;
      this.$store.commit("loading");
      this.$http
        .get("/api/code/detail", {
          params: {
            groupCd: "MNG_ITEM_CD",
          },
        })
        .then((response) => {
          options["MNG_ITEM_CD"] = response.data;
          delete lock["MNG_ITEM_CD"];
          bus.$emit("MNG_ITEM_CD", response.data);
          return resolve(response);
        })
        .catch((response) => {
          return reject(response);
        })
        .finally(() => {
          this.$store.commit("finish");
        });
    }
  });
}

function queryMngItemTypeCd() {
  return new Promise((resolve, reject) => {
    if (options["MNG_ITEM_TYPE_CD"] !== undefined || lock["MNG_ITEM_TYPE_CD"]) {
      reject();
    }
    lock["MNG_ITEM_TYPE_CD"] = true;
    this.$store.commit("loading");
    this.$http
      .get("/api/code/detail", {
        params: {
          groupCd: "MNG_ITEM_TYPE_CD",
        },
      })
      .then((response) => {
        options["MNG_ITEM_TYPE_CD"] = response.data;
        delete lock["MNG_ITEM_TYPE_CD"];
        bus.$emit("MNG_ITEM_TYPE_CD", response.data);
        return resolve(response);
      })
      .catch((response) => {
        return reject(response);
      })
      .finally(() => {
        this.$store.commit("finish");
      });
  });
}

export default {
  components: {
    DhxGrid,
  },
  mixins: [mixin],
  data() {
    return {
      data: [],
      config: {
        columns: [
          {
            value: "No.",
            width: 50,
            type: "cntr",
          },
          {
            id: "acctCd",
            value: "계정코드",
          },
          {
            id: "acctNm",
            value: "계정명",
            align: "left",
            width: 200,
            type: 'ed'
          },
          {
            value: "#cspan",
            width: 40,
            component: {
              props: ["index", "value", "field"],
              template: `<button type="button" class="icon" @click="openAccountModal"><i class="fas fa-search"></i></button>`,
              methods: {
                openAccountModal() {
                  let vm = this;
                  this.$modal.open({
                    component: SerchAcctPop,
                    parent: this,
                    events: {
                      close(data) {
                        vm.value.acctCd = data.acctCd;
                        vm.value.acctNm = data.acctNm;
                      },
                    },
                  });
                },
              },
            },
          },
          {
            id: "useYn",
            value: "사용여부",
            width: 80,
            type: "ch",
            // component: GridCheckbox
          },
          {
            id: "requiredYn",
            value: "필수여부",
            width: 80,
            type: "ch",
            // component: GridCheckbox
          },
          {
            id: "mngItemCd",
            value: "관리항목",
            component: GridSelect,
            mixin: {
              data() {
                return {
                  options: [],
                };
              },
              created() {
                this.options = options["MNG_ITEM_CD"];
                bus.$on("MNG_ITEM_CD", () => {
                  this.options = options["MNG_ITEM_CD"];
                });
              },
            },
          },
          {
            id: "mngItemNm",
            value: "항목명",
            align: "left",
            type: "ed",
          },
          {
            id: "mngItemTypeCd",
            value: "항목유형",
            component: GridSelect,
            mixin: {
              data() {
                return {
                  options: [],
                };
              },
              created() {
                this.options = options["MNG_ITEM_TYPE_CD"];
                bus.$on("MNG_ITEM_TYPE_CD", () => {
                  this.options = options["MNG_ITEM_TYPE_CD"];
                });
              },
            },
          },
          {
            id: "defaultValue",
            value: "기본값",
            align: "left",
            type: "ed",
            width: 150,
          },
          {
            id: "useCd",
            value: "공통코드",
            align: "left",
            type: "ed",
            width: 150,
          },
          {
            id: "orderSeq",
            value: "출력순서",
            align: "right",
            type: "edn",
          },
          {
            id: "fixLen",
            value: "고정길이",
            align: "right",
            type: "edn",
          },
          {
            id: "halignCd",
            value: "정렬방향",
            component: GridSelect,
            mixin: {
              data() {
                return {
                  options: [
                    {
                      detailCd: null,
                      detailNm: "선택안함",
                    },
                    {
                      detailCd: "left",
                      detailNm: "좌측정렬",
                    },
                    {
                      detailCd: "right",
                      detailNm: "우측정렬",
                    },
                    {
                      detailCd: "center",
                      detailNm: "중앙정렬",
                    },
                  ],
                };
              },
            },
          },
        ],
        events: {
          onEditCell(stage, rId, cInd, nValue, oValue) {
            const that = this

            if (stage === 2 && cInd === 2) {
              if (nValue !== oValue) {
                
                
                let row = this.data[rId - 1]
                
                if(nValue){

                  if(!this.popEvent){
                    
                    this.popEvent = true
                    
                    this.$http.post(`/api/account/list`, {
                      searchVal: nValue,
                    })
                    .then((response) => {
                      
                        if(response.data.length === 1){
                          row.acctCd = response.data[0].acctCd
                          row.acctNm = response.data[0].acctNm
                        }else{
                          that.$modal.open({
                            component: SerchAcctPop,
                            props: {
                              deptCd: "",
                              slipTypeCd: "",
                              searchStr: nValue,
                            },
                            parent: this,
                            events: {
                              close(data) {
                                row.acctCd = data.acctCd;
                                row.acctNm = data.acctNm;
                              },
                            },
                          });
                        }

                        this.popEvent = false
                      }) 
                  }
                }else{
                  row.acctCd = null;
                  row.acctNm = null; 
                }
               
              }
            }
          }
        },        
        height: 650,
      },
      params: {
        acctCd: "",
        acctNm: "",
      },
      deleteList: [],
      popEvent: false
    };
  },
  methods: {
    openModalAccount(searchStr) {
      let vm = this;
      this.$modal.open({
        component: SerchAcctPop,
        props: {
          deptCd: "",
          slipTypeCd: "",
          searchStr: searchStr,
        },
        parent: this,
        events: {
          close(data) {
            vm.params.acctCd = data.acctCd;
            vm.params.acctNm = data.acctNm;
          },
        },
      });
    },
    initAccount(force) {
      if (force === true) this.params.acctNm = "";
      if (this.params.acctNm === "") {
        this.params.acctCd = "";
        this.params.acctNm = "";
      }
    },
    /**
     * 그리드 초기화
     */
    constructGridSuccessful(grid) {
      grid.setNumberFormat("0,000", 10, ".", ",");
      grid.setNumberFormat("0,000", 11, ".", ",");
    },
    /**
     * 데이터를 조회한다
     */
    query() {
      this.$store.commit('loading')
      this.$http
        .post("/api/slip/managementItem", this.params)
        .then((response) => {
          this.data = response.data.map((x) => {
            x.useYn = x.useYn === "Y" ? true : false;
            x.requiredYn = x.requiredYn === "Y" ? true : false;
            return x;
          });
          return response;
        })
        // .catch((response) => {
        //   this.$swal({ type: "error", text: "errorMsg" + response });
        // })
        .finally(() => {
          if (this.data.length === 0) {
            this.$swal({ type: "warning", text: "조회된 데이터가 없습니다." });
          }
        });
            this.$store.commit('finish');
    },
    /**
     * 데이터를 저장한다
     */
    save() {
      try {
        let acctCd = this.data.map((x) => x.acctCd).filter((x) => !x);
        assert.apply(this, [acctCd.length < 1, "계정과목을 입력해주세요."]);

        let mngItemNm = this.data.map((x) => x.mngItemNm).filter((x) => !x);
        assert.apply(this, [mngItemNm.length < 1, "항목명을 입력해주세요."]);

        let mngItemTypeCd_Code = this.data.filter(
          (x) => x.mngItemTypeCd === "Code" && !x.useCd
        );
        assert.apply(this, [
          mngItemTypeCd_Code.length < 1,
          "항목유형이 Code인 경우, 반드시 공통코드란을 입력하셔야 합니다.",
        ]);

        let checkDuplicate_origin = this.data.map((x) =>
          [x.acctCd, x.mngItemCd].join("_")
        );
        let checkDuplicate_modified = checkDuplicate_origin.filter(
          (x, i) => checkDuplicate_origin.indexOf(x) === i
        );
        assert.apply(this, [
          checkDuplicate_origin.length === checkDuplicate_modified.length,
          "동일 계정과목에 중복된 관리항목은 허용되지 않습니다.",
        ]);

        if (this.deleteList.length > 0) {
          this.$http
            .post("/api/slip/deleteManagementItem", this.deleteList)
            .then((response) => {
              _proceed_save.apply(this, []);
            });
        } else {
          _proceed_save.apply(this, []);
        }
      } catch (e) {
        this.$swal({
          type: "warning",
          text: e,
        });
      }
      /**
       * 이상이 없다면 계속!
       */
      function _proceed_save() {
        if (this.data.length < 1) return;
        this.$http
          .post(
            "/api/slip/saveManagementItem",
            _.cloneDeep(this.data).map((x) => {
              x.useYn = x.useYn ? "Y" : "N";
              x.requiredYn = x.requiredYn ? "Y" : "N";
              return x;
            })
          )
          .then((response) => {
            this.$swal({
              type: "success",
              text: "저장되었습니다.",
            }).then(() => {
              this.query();
            });
          });
      }
    },
    /**
     * 행추가
     */
    addRow() {
      try {
        let data = {
          acctCd: this.params.acctCd,
          acctNm: this.params.acctNm,
          useYn: "Y",
          requiredYn: "Y",
          mngItemCd: options["MNG_ITEM_CD"][0].detailCd,
          mngItemNm: null,
          mngItemTypeCd: options["MNG_ITEM_TYPE_CD"][0].detailCd,
          defaultValue: null,
          useCd: null,
          orderSeq: 0,
          fixLen: 100,
          halignCd: null,
        };
        this.data.push(data);
      } catch (e) {
        this.$swal({
          type: "warning",
          text: e,
        });
      }
    },
    /**
     * 행삭제
     */
    removeRow() {
      let id = this.$refs.grid.instance.getSelectedRowId();
      if (id === null) {
        this.$swal({
          type: "warning",
          text: "삭제할 행을 선택해주세요.",
        });
      } else {
        this.deleteList = this.deleteList.concat(this.data.splice(id - 1, 1));
      }
    },
    /**
     * Modal - Account
     */
    openAccountModal() {
      let vm = this;
      this.$modal.open({
        component: Account,
        parent: this,
        events: {
          close(object) {
            vm.accountSuccessHandler(object);
          },
        },
      });
    },
    accountSuccessHandler(data) {
      this.params.acctCd = data.acctCd;
      this.params.acctNm = data.acctNm;
    },
    accountFailedHandler() {
      this.$swal({
        type: "warning",
        text: "계정과목을 찾을 수 없습니다.",
      }).then(() => {
        this.params.acctCd = undefined;
        this.params.acctNm = undefined;
      });
    },
    toExcel() {
      this.$refs.grid.toExcel();
    },
  },
  created() {
    document.title = '전표 관리항목 설정 - IJEAS';
    // set params to default
    this.params = _.clone(defaultParams);

    // call queryMngItemCd
    queryMngItemCd.apply(this, []);

    // call queryMngItemTypeCd
    queryMngItemTypeCd.apply(this, []);

    // query data
    this.query();
  },
};
</script>

<style scoped>
.desc-content .item.desc-left {
  width: 40%;
}

.desc-content .item.desc-right {
  width: 30%;
}

.search-border .td-s-thumb.search-area {
  width: 60%;
}

.search-border .td-s-thumb.search-area .ip-box.ip-box-w02 {
  width: calc(100% - 100px);
}
</style>
