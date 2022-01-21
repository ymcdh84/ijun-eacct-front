<template>
    <div class="inner-box">
        <div class="content-name">
            <h2 class="dp-ib">{{title}}</h2>
            <div class="btn-wrap btn-type1 clearfix">
                <button class="btn-size btn-blue fl_left" @click="goSearch"><span class="btn-icon"><i
                        class="fas fa-pen-alt"></i></span> 조회
                </button>
            </div>
        </div>

        <!-- 검색조건 영역 -->
        <div class="desc-content search-border">
            <div class="item desc-left">
                <div class="desc-item">
                    <div class="tit">
                        <span class="label-tit">- GL일자</span>
                    </div>
                    <div class="desc">
                        <div class="datepicker w-type-ymd02">
                            <dhx-calendar class="input ddate sDate" v-model="form.postDtFr" />
                        </div>
                        <span class="wave"> ~ </span>
                        <div class="datepicker w-type-ymd02">
                            <dhx-calendar class="input ddate sDate" v-model="form.postDtTo" />
                        </div>
                    </div>
                </div>
                <div class="desc-item">
                    <div class="tit">
                        <span class="label-tit">- 증빙 첨부</span>
                    </div>
                    <div class="desc">
                        <b-select class="select" v-model="form.evdYn" style="width: 100%;">
                            <option value=''>==전체==</option>
                            <option
                                    v-for="item in evdYnList"
                                    :key="item.key"
                                    :value="item.key"
                                    v-text="item.value"/>
                        </b-select>
                    </div>
                </div>
            </div>
            <div class="item desc-center">
                <div class="desc-item">
                    <div class="tit">
                        <span class="label-tit">- 공급자</span>
                    </div>
                    <div v-if="authority==='ADMIN'" class="desc">
                        <div class="td-s-thumb search-area" style="width: 100%">
                            <input class="input input-bg" type="text" style="width:100px;" v-model="form.payCustCd">
                            <div class="ip-box ip-box-w02">
                                <input class="input" type="text" v-model="form.payCustNm" @input="initVendor" @keypress.enter="popVendor">
                                <button class="icon is-right" @click="popVendor(true)"><i class="fas fa-search"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div v-else class="desc">
                      <div class="td-s-thumb search-area" style="width: 350px">
                          <input class="input input-bg" type="text" style="width:100px;" v-model="form.payCustCd" disabled>
                          <div class="ip-box ip-box-w02">
                              <input class="input" type="text" v-model="form.payCustNm" @input="initCctr" @keypress.enter="popCctr" disabled>
                          </div>
                      </div>
                  </div>
                </div>
                <div class="desc-item">
                    <div class="tit">
                        <span class="label-tit">- 기안서 연동</span>
                    </div>
                    <div class="desc">
                        <b-select class="select" v-model="form.wingsYn" style="width: 100%;">
                            <option value=''>==전체==</option>
                            <option
                                    v-for="item in drpYnList"
                                    :key="item.key"
                                    :value="item.key"
                                    v-text="item.value"/>
                        </b-select>
                    </div>
                </div>
            </div>
            <div class="item desc-right">
                <div class="desc-item">
                    <div class="tit">
                        <span class="label-tit">- 전표상태</span>
                    </div>
                    <div class="desc">
                        <b-select class="select is-fullwidth" v-model="form.slipStatCd" :disabled="true">
                            <option value=''>==전체==</option>
                            <option
                                    v-for="item in slipStats"
                                    :key="item.key"
                                    :value="item.key"
                                    v-text="item.value"/>
                        </b-select>
                    </div>
                </div>
                <div class="desc-item">
                    <div class="tit">
                        <span class="label-tit">- 작성자</span>
                    </div>
                    <div class="desc">
                        <div class="td-s-thumb search-area" style="width: 450px">
                            <input class="input input-bg" type="text" style="width:65px;" v-model="form.wrtId" disabled>
                            <div v-if="authority==='ADMIN'" class="ip-box ip-box-w02" style="width:120px;">
                                <input class="input" type="text" v-model="form.wrtNm" @input="initEmp" @keypress.enter="popEmp">
                                <button class="icon is-right" @click="popEmp(true)" ><i class="fas fa-search"></i>
                                </button>
                            </div>
                            <div v-else class="ip-box ip-box-w02" style="width:120px;">
                                <input class="input" type="text" v-model="form.wrtNm" @input="initEmp" @keypress.enter="popEmp" disabled>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- //검색조건 영역 -->

        <!-- 테이블 -->
        <div class="table-area">

            <div class="table-b">
                <div class="table-header">
                    <div class="table-name">
                        <h3 class="ico_table_name">전표내역</h3>
                    </div>
                    <div class="btn-wrap btn-type1 clearfix">
                        <input type="file" ref="file" @change="uploadExcel()" style="display: none;" accept="application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" multiple />
                        <button class="btn-size btn-gray fl_left" @click="del()">
                            <span class="btn-icon"><i class="far fa-trash-alt"></i></span>삭제
                        </button>
                        <button class="btn-size btn-excel" @click="startFileUpload()">엑셀 업로드</button>
                        <button class="btn-size btn-excel" @click="saveExcel">엑셀 저장</button>
                        <!-- <button class="btn-size btn-excel" @click="uploadExcel">엑셀 업로드</button> -->
                    </div>
                </div>

                <div class="grid-wrap">
                    <dhx-grid ref="grid" v-model="slipList" :config="config" @constructGridSuccessful="constructGridSuccessful"/>
                </div>
            </div>

        </div>
        <!-- //테이블 -->

        <!--팝업-->
        <b-modal :active.sync="showCctrModal" has-modal-card @receive="receiveCctr">
            <cctr :param="form.payCustNm"></cctr>
        </b-modal>
        <b-modal :active.sync="showEmpModal" has-modal-card @receive="receiveEmp">
            <emp :param="form.wrtNm"></emp>
        </b-modal>
        <b-modal :active.sync="showVendorModal" has-modal-card @receive="receiveVendor">
            <vendor :param="form.payCustNm" :slipTypeCd="form.slipTypeCd"></vendor>
        </b-modal>
        <!--//팝업 -->
    </div>
</template>

<script>
    import Vue from 'vue'
    import mixin from '@/mixin'
    import mixinSlip from '@/mixin/slip'
    import _ from 'lodash'
    import assert from '@/libs/assert'
    
    import DhxCalendar from '@/components/DhxCalendar.vue'
    import DhxGrid from '@/components/DhxGrid.vue'
    //팝업
    import Vendor from '@/components/Vendor.vue'
    import Cctr from '@/components/Cctr.vue'
    import Emp from '@/components/Emp.vue'
    import SlipDetailModal from '@/components/SlipDetailModal.vue'
    import EvidAtchPop from '@/components/EvidAtchPop.vue'
    import WingsAtchPop from '@/components/WingsAtchPop.vue'
    import BulkSlipModal from '@/components/BulkSlipModal.vue'

    import GridSelect from '@/components/grid/GridSelect.vue'

    //For grid events handling
    const eventBus = new Vue()

    const options = {
        'USE_SELECT_CD' : [{"detailCd" : "N", "detailNm" : "미포함"}, {"detailCd" : "Y", "detailNm" : "포함"}]
    }
    export default {
        name: 'bulkExpenseReg',
        mixins: [mixin, mixinSlip],
        components: {Cctr, Emp, Vendor, DhxGrid, DhxCalendar},
        data() {
            return {
                config: {
                    columns: [
                        {id: 'useYn', type: 'ch', align: 'center', width: 40, value: '<input type="checkbox" id="checkAll" :v-model="checkAll"/><label for="checkAll">전체</label>'},
                        {id: 'eaSlipNo', type: 'ro', align: 'center', sort: 'na', value: '전표번호', width: 100},
                        {id: 'postDt', type: 'ro', align: 'center', sort: 'na', value: 'GL일자', width: 100},
                        {id: 'payCustNm', type: 'ro', align: 'center', sort: 'na', value: '공급자명', width: 100},
                        {id: 'hdSgtxt', value: '적요', width: 200, align: 'left', type: 'ro'},
                        {id: 'totAmt', type: 'ron', align: 'right', sort: 'na', value: '전표금액', width: 100},
                        {id: 'vatTaxNm', align: 'center', value: '부가세코드', width: 80, type: 'ro'},
                        {id: 'evdCnt', value: '증빙첨부', width: 80
                        , component: {
                                props: ['index', 'value', 'field'],
                                template: `<span style="color: #0065b3;" @click="openEvidencePopup()">{{ this.$numeral(value.evdCnt).format('0') || '0' }} <i class="far fa-file-alt"></i></span>`,
                                created(){
                                    //this.scanFileCount();
                                },
                                methods: {
                                    scanFileCount() {
                                        const val = this.$parent.value[this.index]
                                        this.$http.get(`/api/evid/fileList/${val.eaSlipNo}`)
                                        .then(response => {
                                            val.evdCnt = ((response.data || {}).aFiles || []).length
                                        })
                                    },
                                    openEvidencePopup(){
                                        let vm = this
                                        const val = this.$parent.value[this.index]
                                        this.$modal.open({
                                            component: EvidAtchPop,
                                            props: {
                                                docMngNo: val.eaSlipNo,
                                                readonly: val.readonly // Check readonly this.form.slipStatCd !== '10'
                                            },
                                            parent: this,
                                            width: 1200,
                                            events: {
                                                close(value) {
                                                    val.evdCnt = value.length
                                                    //스캔증빙 카운팅 벨류 강제 업데이트
                                                    vm.$forceUpdate();
                                                }
                                            }
                                        })
                                    }
                                },
                                watch: {
                                    value: {
                                        immediate: true,
                                        deep: true,
                                        handler() {
                                           // this.scanFileCount();
                                        }
                                    }
                                },
                            }
                        },
                        {id: 'wingsCnt', value: '기안서연동', width: 80
                        , component: {
                            props: ['index', 'value', 'field'],
                            template: `<span style="color: #0065b3;" @click="openDrfPlanPopup()">{{ this.$numeral(value.wingsCnt).format('0') || '0' }} <i class="far fa-file-alt"></i></span>`,
                            created(){

                            },
                            methods: {
                                openDrfPlanPopup() {
                                    let vm = this
                                    const val = this.$parent.value[this.index]
                                    this.$modal.open({
                                        component: WingsAtchPop,
                                        props: {
                                            grSlipNo: val.grSlipNo,
                                            slipDetail: this.tempData,
                                            readonly: this.isReadonly // Check readonly
                                        },
                                        parent: this,
                                        width: 1200,
                                        events: {
                                            close(value) {
                                                //vm.wingsFileSize = value.length
                                                val.wingsCnt = value.length;
                                                vm.tempData = value;
                                                //value 세팅해야함.
                                                vm.$forceUpdate();
                                            }
                                        }
                                    })
                                }
                            },
                            watch: {
                                value: {
                                    immediate: true,
                                    deep: true,
                                    handler() {

                                    }
                                }
                            }
                          }
                        },
                        {id: 'wrtNm', align: 'center', value: '작성자', width: 80, type: 'ro'},
                        {id: 'slipTypeCd', type: 'ro', align: 'center', sort: 'na', hidden: true},
                        {id: 'grSlipNo', align: 'center', value: '부가세코드', width: 80, type: 'ro', hidden: true},
                    ],
                    height: '425',
                    // enablePaging: true,
                    // pagingSize: 10,
                    afterRefreshData(grid, data) {
                        this.$nextTick(() => {
                            _.forEach(data, (item, index) => {
                                let rId = index + 1
                                grid.cells(rId, 2).setValue(this.$moment(grid.cells(rId, 2).getValue()).format('YYYY-MM-DD'));
                            })
                        })
                    },
                    events: {
                        onRowDblClicked(...args) {
                            let row = args[3] || args[2]
                            row.slipTypeCd = 'E5'

                            this.$modal.open({
                                component: BulkSlipModal,
                                props: {
                                    grSlipNo: row.grSlipNo,
                                    value: row
                                },
                                parent: this,
                                width: 1200
                            })
                        }
                    }
                },
                title: '일괄비용등록(기숙사등)',
                slipList: [],
                evdYnList: [{'key': 'N', 'value' : '미첨부'}, {'key': 'Y', 'value' : '첨부'}],
                drpYnList: [{'key': 'N', 'value' : '미연동'}, {'key': 'Y', 'value' : '연동'}],
                slipStats: [],
                authority: '',
                checkAll: false,
                form: {
                    // useYn: false,
                    postDtFr: this.$moment().add(-1, 'month').startOf('month').format('YYYY-MM-DD'),
                    postDtTo: this.$moment().add(1, 'month').format('YYYY-MM-DD'),
                    slipTypeCd: 'E5',
                    evdYn: '',
                    wingsYn: '',
                    payCustCd: '',
                    payCustNm: '',
                    evdCustBizNo: '',
                    wrtId: '',
                    wrtNm: '',
                    slipStatCd: '10',
                },
                showCctrModal: false,
                showEmpModal: false,
                showVendorModal: false
            };
        },
        methods: {
            constructGridSuccessful(grid) {
                // this.config.queryPage(0)
                grid.setDateFormat('%Y-%m-%d', '%Y%m%d')
                grid.setNumberFormat('0,000', 5, '.', ',')
                grid.setColumnHidden(10,true)
                grid.setColumnHidden(11, true)

                let vm = this
                grid.attachEvent("onHeaderClick", function(ind,obj){
                    if(ind === 0) {
                        const rowsNum = grid.getRowsNum();
                        if(vm.checkAll) {
                            vm.checkAll = false
                            $("#checkAll").prop("checked", false)
                            for(var i=rowsNum; i>0; i--) {
                                grid.cells(i, 0).setValue(vm.checkAll)
                                vm.slipList[i-1].useYn = vm.checkAll
                            }
                        } else {
                            vm.checkAll = true
                            $("#checkAll").prop("checked", true)
                            for(var i=rowsNum; i>0; i--) {
                                grid.cells(i, 0).setValue(vm.checkAll)
                                vm.slipList[i-1].useYn = vm.checkAll
                            }
                        }
                    }
                });
            },
            getSlipTypeCombo() {
                this.$http.get(`/api/code/combo`, {params: {groupCd: "SLIP_TYPE_CD"}})
                    .then(response => {
                        this.slipTypes = response.data;
                    });
            },
            getSlipStatCombo() {
                this.$http.get(`/api/code/combo`, {params: {groupCd: "SLIP_STAT_CD"}})
                    .then(response => {
                        this.slipStats = response.data;
                    });
            },
            saveExcel() {
                this.downloadExcel(this.$refs.grid);
            },
            startFileUpload() {
                // Trigger click event
                this.$refs.file.click()
            },
            uploadExcel() {
                //=> /api/bulk/upload
                //=> file
                let files = this.$refs.file.files

                // Ok to proceed
                if (files.length > 0) {
                    let form = new FormData()

                    _.forEach(files, (file, i) => {
                        form.append(`file`, file)
                    })

                    this.$store.commit('loading')
                    this.$http.post(`/api/bulk/upload/`, form, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    }).then(response => {
                        this.$swal({
                            type: 'success',
                            text: '파일이 업로드 되었습니다.'
                        }).then(() => {
                            this.goSearch()
                        })
                        return response
                    }).catch(response => {
                        this.$swal({
                            type: 'error',
                            text: '파일업로드에 실패하였습니다.'
                        })
                        return response
                    }).finally(() => {
                        this.$store.commit('finish')
                    })
                }

            },
            del() {
                let list = this.slipList.filter(x => x.useYn === true && x.slipStatCd === '10')
                let bulkList = []
                if(list.length > 0) {
                    list.forEach(x => {
                        bulkList.push(x.grSlipNo)
                    })
                    
                    this.$http.post(`/api/bulk/delete/list`, bulkList)
                    .then(response => {
                        if (response.status === 200) {
                            this.$swal({type: 'warning', text: response.data})
                            .then(() => {
                                this.goSearch();
                            });
                        }
                    });
                } else {
                    this.$swal({type: 'warning', text: '삭제 할 데이터가 없습니다.'})
                }
            },
            goSearch() {
                // console.log("조회...")
                const param = JSON.parse(JSON.stringify(this.form));
                const stripFields = ['postDtFr', 'postDtTo', 'payCustCd', 'slipStatCd', 'evdYn', 'wingsYn', 'wrtId'];
                _.forEach(stripFields, (name) => param[name] = this.toPure(param[name]));

                if (!this.validation(param)) return;

                this.$store.commit('loading');
                this.$http.post(`/api/bulk/upload/list`, param)
                    .then(response => {
                        if (response.data) {
                            this.slipList = response.data;
                            _.forEach(this.slipList, (x, i) => {
                                x.useYn = false
                            })
                            $("#checkAll").prop("checked", false)
                        }
                    }).catch(response => {
                        this.$swal({
                            type: 'error',
                            text: response
                        })
                        return response
                    }).finally(() => {
                        this.$store.commit('finish')
                    });
                
            },
            validation(param) {
                if (!param.postDtFr || !param.postDtTo) {
                    this.$swal({type: 'warning', text: '전표일자를 입력해 주세요.'});
                    return false;
                }
                return true;
            },
            popCctr(clear) {
                if (clear === true) {
                    this.form.payCustCd = '';
                    this.form.payCustNm = '';
                }
                this.showCctrModal = true;
            },
            popEmp(clear) {
                if (clear === true) {
                    this.form.wrtId = '';
                    this.form.wrtNm = '';
                }
                this.showEmpModal = true;
            },
            popVendor(clear) {
                if (clear === true) {
                    this.form.payCustCd = '';
                    this.form.payCustNm = '';
                    this.form.evdCustBizNo = '';
                }
                this.showVendorModal = true;
            },
            receiveCctr(obj) {
                this.form.payCustCd = obj.cctrCd;
                this.form.payCustNm = obj.cctrNm;
            },
            receiveEmp(obj) {
                this.form.wrtId = obj.empNo;
                this.form.wrtNm = obj.empNm;
            },
            receiveVendor(obj) {
                this.form.payCustCd = obj.vendCd;
                this.form.payCustNm = obj.vendNm;
                this.form.evdCustBizNo = obj.bizNo;
            },
            initCctr(force) {
                if (force === true) this.form.payCustNm = '';
                if (this.form.payCustNm === '') this.form.payCustCd = '';
            },
            initEmp(force) {
                if (force === true) this.form.wrtNm = '';
                if (this.form.wrtNm === '') {
                    this.form.wrtId = '';
                }
            },
            initVendor(force) {
                if (force === true) this.form.payCustNm = '';
                if (this.form.payCustNm === '') {
                    this.form.payCustCd = '';
                    this.form.evdCustBizNo = '';
                }
            },
            setCallPageByParam(){
                if (this.$route.query) {
                    for (let member in this.form) {
                        if (this.$route.query[member] !== undefined) {
                            this.form[member] = this.$route.query[member]
                        }
                    }
                }
            }
        },
        mounted() {
            this.authority = this.$store.state.loginInfo.authorities[0].roleCd;
            
            this.form.wrtId = this.$store.state.loginInfo.loginId;
            this.form.wrtNm = this.$store.state.loginInfo.userName;

            this.setCallPageByParam()
            this.getSlipTypeCombo()
            this.getSlipStatCombo()
            this.goSearch()
        }
    };
</script>

<style scoped>
.control.select.is-fullwidth {
    width: 100%;
}
.item.desc-left {
    width: 30%!important;
}
.item.desc-center {
    width: 36%!important;
}
.item.desc-center div.desc-item {
    width: 80%!important;
}
.item.desc-center div.desc-item div.desc{
    margin-left: 10px;
}
.item.desc-right {
    width: 34%!important;
}
.item.desc-right div.desc-item {
    width: 80%!important;
}
:global(table tr td[excell="ch"] img) {
    top: 0%
}

</style>
