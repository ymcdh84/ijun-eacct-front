<template>
    <div class="inner-box">
        <div class="content-name">
            <h2 class="dp-ib">{{title}}</h2>
            <div class="btn-wrap btn-type1 clearfix">
                <button class="btn-size btn-blue fl_left" @click="goSearch"><span class="btn-icon"><i class="fas fa-pen-alt"></i></span> 조회</button>
                <!-- <button class="btn-size btn-gray fl_left" @click="newPage"><span class="btn-icon"><i class="far fa-file"></i></span> 신규</button>
                <button class="btn-size btn-gray fl_left" @click="remove"><span class="btn-icon"><i class="far fa-trash-alt"></i></span> 삭제</button> -->
                <button class="btn-size btn-gray fl_left" @click="save"><span class="btn-icon"><i class="fas fa-check"></i></span> 저장</button>
            </div>
        </div>

        <!-- 검색조건 영역 -->
        <div class="desc-content search-border">
            <div class="item search_wrap">
                <div class="search_box">
                    <div class="search_title">
                        <span class="search_tit">- 발급일자</span>
                    </div>
                    <div class="search_con">
                        <div class="datepicker w-type-ymd02">
                            <dhx-calendar class="input ddate sDate" v-model="form.searchDtmFr" />
                        </div>
                        <span class="wave"> ~ </span>
                        <div class="datepicker w-type-ymd02">
                            <dhx-calendar class="input ddate sDate" v-model="form.searchDtmTo" />
                        </div>
                    </div>
                </div>
                <div class="search_box">
                    <button class="item-list icon is-right btn_s_w" @click="openModal()" type="button">상세검색<i class="fas fa-plus"></i></button>
                </div>


                <!-- 상세검색 내용 -->
                <div id="open-moda" class="modal-window">
                    <div class="modal-window-wrap">
                        <div class="modal-window-top">
                            <h4>상세검색</h4>
                            <button title="Close" @click="closeModal()" type="button" class="bt-modal-close mt5"><img src="../../public/img/bt_close_w.png" /></button>    
                        </div>
                        
                        <div class="search_box_wrap">
                            <div class="search_box_pop">
                                <div class="search_title">
                                    <span class="search_tit">- 발급일자</span>
                                </div>
                                <div class="search_con search-area">
                                    <div class="datepicker w-type-ymd02 w45p">
                                        <dhx-calendar class="input ddate sDate" v-model="form.searchDtmFr" />
                                    </div>
                                    <span class="datepicker w10p dp-ib tac"> ~ </span>
                                    <div class="datepicker w-type-ymd02 w45p">
                                        <dhx-calendar class="input ddate sDate" v-model="form.searchDtmTo" />
                                    </div>
                                </div>
                            </div>

                            <div class="search_box_pop">
                                <div class="search_title">
                                    <span class="search_tit">- 회사</span>
                                </div>
                                <div class="search_con search-area">
                                    <div v-if="authority==='ADMIN'" class="desc">
                                        <b-select class="select is-fullwidth w100p" v-model="form.compCd">
                                            <option value=''>==전체==</option>
                                            <option
                                                    v-for="item in compCds"
                                                    :key="item.key"
                                                    :value="item.key"
                                                    v-text="item.value"/>
                                        </b-select>
                                    </div>
                                    <div v-else class="desc">
                                        <b-select class="select is-fullwidth w100p" v-model="form.compCd" disabled>
                                            <option value=''>==전체==</option>
                                            <option
                                                    v-for="item in compCds"
                                                    :key="item.key"
                                                    :value="item.key"
                                                    v-text="item.value"/>
                                        </b-select>
                                    </div>
                                </div>
                            </div>

                            <div class="search_box_pop">
                                <div class="search_title">
                                    <span class="search_tit">- 카드소유자</span>
                                </div>
                                <div class="search_con search-area">
                                    <input class="input dp-ib input-bg w20p_5r" type="text" v-model="form.crdPssrDut" disabled>
                                    <input class="input dp-ib input-bg w30p_5r" type="text" v-model="form.crdPssrDept" disabled>
                                    <input class="input dp-ib input-bg w20p_5r" type="text" v-model="form.crdPssrId" disabled>
                                    <input class="input dp-ib w30p" type="text" v-model="form.crdPssrNm" @input="initEmp" @keypress.enter="popEmp">
                                    <button class="icon is-right" @click="popEmp(true)"><i class="fas fa-search"></i>
                                    </button>
                                </div>
                            </div>

                            <div class="search_box_pop">
                                <div class="search_title">
                                    <span class="search_tit">- 카드상태</span>
                                </div>
                                <div class="search_con search-area">
                                    <b-select class="select is-fullwidth w100p" v-model="form.crdStatCd">
                                        <option value=''>==전체==</option>
                                        <option
                                                v-for="item in crdStatCds"
                                                :key="item.key"
                                                :value="item.key"
                                                v-text="item.value"/>
                                    </b-select>
                                </div>
                            </div>

                            <div class="search_box_pop">
                                <div class="search_title">
                                    <span class="search_tit">- 카드사</span>
                                </div>
                                <div class="search_con search-area">
                                    <b-select class="select is-fullwidth w100p" v-model="form.crdCompCd">
                                        <option value=''>==전체==</option>
                                        <option
                                                v-for="item in crdCompCds"
                                                :key="item.key"
                                                :value="item.key"
                                                v-text="item.value"/>
                                    </b-select>
                                </div>
                            </div>

                            <div class="search_box_pop">
                                <div class="search_title">
                                    <span class="search_tit">- 카드번호</span>
                                </div>
                                <div class="search_con search-area">
                                    <input class="input Rt-M tal w100p" type="text" v-model="form.crdNo">
                                </div>
                            </div>

                            <div class="search_box_pop">
                                <div class="search_title">
                                    <span class="search_tit">- 카드구분</span>
                                </div>
                                <div class="search_con search-area">
                                    <b-select class="select is-fullwidth w100p" v-model="form.crdFgCd">
                                        <option value=''>==전체==</option>
                                        <option
                                                v-for="item in crdFgCds"
                                                :key="item.key"
                                                :value="item.key"
                                                v-text="item.value"/>
                                    </b-select>
                                </div>
                            </div>
                        </div>

                        <div class="modal-window-bottom">
                            <ul>
                                <li>
                                    <button class="bt_blue_s" @click="goSearch">검색</button> 
                                </li>
                                <li>
                                    <button @click="closeModal()" title="Close" class="bt_white_s">닫기</button>
                                </li>
                            </ul>
                             
                            
                        </div>

                    </div>
                </div>
                <!-- //상세검색 내용 -->
            </div>
        </div>
        <!-- //검색조건 영역 -->

        <!-- 테이블 -->
        <div class="table-area">
            <div class="table-b">
                <div class="table-header">
                    <div class="table-name">
                        <h3 class="ico_table_name">법인카드 목록</h3>
                    </div>
                    <div class="btn-wrap btn-type1 clearfix">
                        <button class="btn-size btn-excel" @click="saveExcel">엑셀 저장</button>
                    </div>
                </div>

                <div class="grid-wrap">
                    <dhx-grid ref="grid" v-model="cardList" :config="config" @constructGridSuccessful="constructGridSuccessful"/>
                </div>
                <card-info ref="cardInfo" :cardDetail="cardDetail"/>
            </div>
        </div>
        <!-- //테이블 -->

        <!--팝업-->
        <!-- <b-modal :active.sync="showEmpModal" has-modal-card @receive="receiveEmp">
            <emp :param="form.crdPssrNm"></emp>
        </b-modal> -->
        <!--//팝업 -->
    </div>
</template>

<script>
    import mixin from '@/mixin';
    import mixinSlip from '@/mixin/slip';
    import _ from 'lodash'

    import DhxCalendar from '@/components/DhxCalendar.vue'
    import DhxGrid from '@/components/DhxGrid.vue'
    // import Emp from '@/components/Emp.vue';
    import Emp from '@/components/Emp_Ag.vue';
    import CardInfo from '@/components/CardInfo.vue';

    export default {
        name: 'CardInfoMng',
        mixins: [mixin, mixinSlip],
        components: {Emp, CardInfo, DhxGrid, DhxCalendar},
        data() {
            return {
                config : {
                    columns: [
                        {id: 'rn', type: 'cntr', align: 'center', sort: 'na', value: 'No.', width: 35},
                        {id: 'crdNo', type: 'ro', align: 'center', sort: 'na', value: '카드번호', width: 250},
                        {id: 'compNm', type: 'ro', align: 'center', sort: 'na', value: '회사', width: 120},
                        {id: 'crdCompNm', type: 'ro', align: 'center', sort: 'na', value: '카드사', width: 200},
                        {id: 'crdStatNm', type: 'ro', align: 'center', sort: 'na', value: '카드상태', width: 100},
                        {id: 'crdPubcDt', type: 'ro', align: 'center', sort: 'na', value: '발급일자', width: 120},
                        {id: 'crdVldYm', type: 'ron', align: 'center', sort: 'na', value: '유효기간', width: 100},
                        {id: 'crdPlmtAmt', type: 'ron', align: 'right', sort: 'na', value: '한도금액', width: 150},
                        {id: 'crdFgNm', type: 'ro', align: 'center', sort: 'na', value: '카드구분', width: 100},
                        {id: 'crdPssrNm', type: 'ro', align: 'center', sort: 'na', value: '카드소유자', width: 100},
                        {id: 'crdOln', type: 'ro', align: 'center', sort: 'na', value: '적요', width: 300},
                    ],
                    height: 223,
                    enablePaging: true,
                    pagingSize: 5,
                    queryPage: (page) => {
                        page = page || 0
                        return new Promise((resolve, reject) => {
                            let data = {
                                contents: this.cardList,
                                page: page,
                                totalPages: parseInt(this.cardList.length / this.config.pagingSize) + (parseInt(this.cardList.length % this.config.pagingSize) > 0 ? 1 : 0),
                                totalElements: 0
                            }
                            resolve({
                                data: data
                            })
                        })
                    },
                    afterRefreshData(grid, data) {
                        this.$nextTick(() => {
                            _.forEach(data, (item, index) => {
                                var rId = index + 1

                                grid.cells(rId, 1).setValue(this.$parent.getFormattedPureCardNumber(grid.cells(rId, 1).getValue()));
                              if(!_.isEmpty(grid.cells(rId, 5).getValue()))grid.cells(rId, 5).setValue(this.$moment(grid.cells(rId, 5).getValue()).format('YYYY-MM-DD'));
                              if(!_.isEmpty(grid.cells(rId, 6).getValue()))grid.cells(rId, 6).setValue(this.$moment(grid.cells(rId, 6).getValue(), 'YYYYMM').format('YYYY-MM'));
                            })
                        })
                    }
                },
                title: '법인카드 정보관리',
                compCds: [],
                crdCompCds: [],
                crdStatCds: [],
                crdFgCds: [],
                cardList: [],
                cardDetail: [],
                showEmpModal: false,
                authority: '',
                form: {
                    compCd: '',
                    crdCompCd: '',
                    crdStatCd: '',
                    crdFgCd: '',
                    crdNo: '',
                    crdPssrId: '',
                    crdPssrNm: '',
                    crdPssrTitle: '',
                    crdPssrDut: '',
                    crdPssrDept: '',
                    searchDtmFr: this.$moment().add(-1, 'month').startOf('month').format('YYYY-MM-DD'),
                    searchDtmTo: this.$moment().format('YYYY-MM-DD'),
                },
            };
        },
        methods: {
            constructGridSuccessful(grid) {
                this.config.queryPage(0)
                grid.setNumberFormat('0,000', 7, '.', ',')
                grid.attachEvent('onRowSelect', (rId) => {
                    let crdNo = grid.cells(rId,1).getValue();
                    this.getcardInfo(crdNo);
                });
            },
            getCompCdCombo() {
                this.$http.get(`/api/code/combo`, {params: {groupCd: "COMP_CD"}})
                    .then(response => {
                        this.compCds = response.data;
                    });
            },
            getCardCompCdCombo() {
                this.$http.get(`/api/code/combo`, {params: {groupCd: "CRD_COMP_CD"}})
                    .then(response => {
                        this.crdCompCds = response.data;
                    });
            },
            getCardStatCdCombo() {
                this.$http.get(`/api/code/combo`, {params: {groupCd: "CRD_STAT_CD"}})
                    .then(response => {
                        this.crdStatCds = response.data;
                    });
            },
            getCardFgCdCombo() {
                this.$http.get(`/api/code/combo`, {params: {groupCd: "CRD_FG_CD"}})
                    .then(response => {
                        this.crdFgCds = response.data;
                    });
            },
            saveExcel() {
                this.downloadExcel(this.$refs.grid);
            },
            newPage() {
                this.$refs.cardInfo.newPage();
            },
            goSearch() {
                const param = JSON.parse(JSON.stringify(this.form));
                const stripFields = ['searchDtmFr', 'searchDtmTo','crdNo'];
                _.forEach(stripFields, (name) => param[name] = this.toPure(param[name]));

                this.$store.commit('loading');
                this.$http.post(`/api/card/list`, {
                        compCd: param.compCd,
                        // searchDtmFr: param.searchDtmFr,
                        // searchDtmTo: param.searchDtmTo,
                        crdStatCd: param.crdStatCd,
                        crdNo: param.crdNo,
                        crdPssrId: param.crdPssrId,
                        crdCompCd: param.crdCompCd,
                        crdFgCd: param.crdFgCd
                    }
                )
                    .then(response => {
                        if (response.data) {
                            this.cardList = response.data;
                            this.config.queryPage(0)
                        }
                    }).finally(() => {
                        this.$store.commit('finish')
                    });
                    document.getElementById("open-moda").style.opacity = "0";
                    document.getElementById("open-moda").style.pointerEvents = "none";
            },
            openModal() {
                document.getElementById("open-moda").style.opacity = "1";
                document.getElementById("open-moda").style.pointerEvents = "auto";
            },
            closeModal() {
                document.getElementById("open-moda").style.opacity = "0";
                document.getElementById("open-moda").style.pointerEvents = "none";
            },
            getcardInfo(crdNo) {
                let cardNo = this.toPure(crdNo);
                if(crdNo != undefined && crdNo != '0') {
                    this.$http.get(`/api/card/detail/${cardNo}`).then(response => {
                            if(response.data) {
                                this.cardDetail = response.data.cardDetail;
                            }
                        })
                        .catch(({message}) => {
                            console.error(message);
                        });
                }
            },
            save() {
                // form validation
                if(!this.$refs.cardInfo.validation()) return;

                const cardInfo = JSON.parse(JSON.stringify(this.$refs.cardInfo.form));
                const stripFields = ['crdNo','crdPubcDt','crdVldYm','crdAbltDt','crdPlmtAmt','stlBacctNo','preCrdNo','crdUseStrDt','crdUseEndDt'];
                _.forEach(stripFields, (name) => cardInfo[name] = this.toPure(cardInfo[name]));

                this.$http.post(`/api/card/save`, cardInfo)
                    .then((response) => {
                        this.$swal({ type: 'info', text: '저장되었습니다.' });
                        this.goSearch();
                    })
                    .catch((e) => {
                        console.error(e);
                    });
            },
            remove() {
                const crdNo = this.toPure(this.$refs.cardInfo.form.crdNo);
                const crdNo2 = this.$refs.cardInfo.form.crdNo;

                if (crdNo === '') {
                    this.$swal({type: 'warning', text: '카드를 선택해주세요.'});
                    return false;
                } else {
                    this.$swal({
                        type: 'warning',
                        text: `[${crdNo2}] 법인카드를 삭제합니다. 계속 하시겠습니까?`,
                        showCancelButton: true,
                        confirmButtonText: '예',
                        cancelButtonText: '아니오',
                    }).then((result) => {
                        if (result.value) {
                            this.$http.delete(`/api/card/delete/${crdNo}`)
                                .then(response => {
                                    if (response.status === 200) {
                                        this.$swal({type: 'warning', text: response.data});
                                        this.$swal({ type: 'info', text: '삭제되었습니다.' });
                                        this.goSearch();

                                        this.$refs.cardInfo.newPageSkip();
                                    }
                                });
                        }
                    });
                }
            },
            popEmp(clear) {
                let vm = this
                this.$modal.open({
                    component: Emp,
                    props: {
                        param: this.form.crdPssrNm
                    },
                    parent: this,
                    events: {
                        close(obj) {
                            vm.receiveEmp(obj)
                        }
                    }
                })
            },
            receiveEmp(obj) {
                this.form.crdPssrId = obj.empNo;
                this.form.crdPssrNm = obj.empNm;
                this.form.crdPssrDut = obj.dutNm;
                this.form.crdPssrDept = obj.deptNm;
            },
            initEmp(force) {
                if (force === true) this.form.crdPssrNm = '';
                if (this.form.crdPssrNm === '') {
                    this.form.crdPssrId = '';
                    this.form.crdPssrDut = '';
                    this.form.crdPssrDept = '';
                }
            },
        },
        mounted() {
          document.title = this.title + ' - IJEAS';
            this.form.compCd = this.$store.state.loginInfo.compCd;
            this.authority = this.$store.state.loginInfo.authorities[0].roleCd;
            this.getCompCdCombo();
            this.getCardCompCdCombo();
            this.getCardStatCdCombo();
            this.getCardFgCdCombo();
            this.goSearch();
        }
    };
</script>

<style scoped>
    .desc-content:after {
        clear: both;
        content: '';
        display: block;
    }

    .btn-wrap {
        margin-bottom: 10px;
    }

    .desc-content {
        border: 2px solid #9db6c9;
        background: #f9fafc;
        margin: 0 0 20px 0;
        border-radius: 4px;
        padding: 15px 2%;
        clear: both;
    }

    .desc-content .item {
        float: left;
    }

    .desc-content .item .desc-item {
        position: relative;
        padding-left: 82px;
        margin-bottom: 8px;
    }

    .desc-content .item .desc-item:last-child {
        margin-bottom: 0;
        height: 50px;
    }

    .desc-content .item .desc-item .tit {
        position: absolute;
        left: 0;
    }

    .desc-content .item .desc-item .label-tit {
        font-family: 'NotoM';
        color: #222;
        font-size: 15px;
    }

    .desc-content .item.desc-left .desc-item {
        padding-left: 80px;
    }

    .desc-content .item.desc-left .desc-item .desc:after {
        clear: both;
        content: '';
        display: block;
    }

    .desc-content .item.desc-left .desc-item .desc .datepicker {
        float: left;
    }

    .desc-content .item.desc-left .desc-item .desc span.wave {
        float: left;
        padding: 0 6px;
    }

    .desc-content .item.desc-left .desc-item .td-s-thumb.search-area:after {
        clear: both;
        content: '';
        display: block;
    }

    .desc-content .item.desc-left .desc-item .td-s-thumb.search-area input,
    .desc-content .item.desc-left .desc-item .td-s-thumb.search-area .ip-box {
        float: left;
    }

    .desc-content .item.desc-left .desc-item .desc.select select {
        width: 70%;
    }

    .desc-content .item.desc-left {
        width: 38%;
        padding-right: 20px;
    }

    .desc-content .item.desc-center {
        width: 35%;
        padding-right: 40px;
    }

    .desc-content .item.desc-right {
        width: 27%;
    }

    .search-area input {
        position: relative;
    }

    .search-area .icon {
        position: absolute;
        right: 8px;
        top: 1px;
        z-index: 100;
        cursor: pointer;
        font-size: 16px;
        color: #555;
    }

    .search-border .td-s-thumb {
        position: relative;
        display: inline-block;
    }

    .search-border .td-s-thumb.search-area > input,
    .search-border .td-s-thumb.search-area > .ip-box
    .search-border .td-s-thumb.search-area > button {
        float: left;
    }

    .search-border .td-s-thumb.search-area .ip-box.ip-box-w02 {
        width: 60%;
        margin-left: 6px;
    }

    @media (max-width: 1580px) {
        .search-border .td-s-thumb.search-area .ip-box.ip-box-w02 {
            width: 50%;
        }
    }
</style>

