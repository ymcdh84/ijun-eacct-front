<template>
    <div class="inner-box">
        <div class="content-name">
            <h2 class="dp-ib">{{title}}</h2>
            <div class="btn-wrap btn-type1 clearfix">
                <button class="btn-size btn-gray fl_left" @click="goSearch"><span class="btn-icon"><i class="fas fa-search"></i></span> 조회</button>
            </div>
        </div>

        <!-- 검색조건 영역 -->
        <div class="desc-content search-border">
            <div class="item search_wrap">
                <div class="search_box">
                    <div class="search_title">
                        <span class="search_tit">- 사용일자</span>
                    </div>
                    <div class="search_con">
                        <div class="datepicker w-type-ymd02">
                            <dhx-calendar class="input date sDate" v-model="form.apprDateFrom" />
                        </div>
                        <span class="wave"> ~ </span>
                        <div class="datepicker w-type-ymd02">
                            <dhx-calendar class="input date sDate" v-model="form.apprDateTo" />
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
                                    <span class="search_tit">- 사용일자</span>
                                </div>
                                <div class="search_con search-area">
                                    <div class="datepicker w-type-ymd02 w45p">
                                        <dhx-calendar class="input date sDate" v-model="form.apprDateFrom" />
                                    </div>
                                    <span class="w10p dp-ib tac"> ~ </span>
                                    <div class="datepicker w-type-ymd02 w45p dp-ib">
                                        <dhx-calendar class="input date sDate" v-model="form.apprDateTo" />
                                    </div>
                                </div>
                            </div>

                            <div class="search_box_pop">
                                <div class="search_title">
                                    <span class="search_tit">- 카드번호</span>
                                </div>
                                <div class="search_con search-area">
                                    <b-select class="select is-fullwidth" v-model="form.cardNo">
                                        <option
                                                v-for="item in cardNos"
                                                :key="item.crdNo"
                                                :value="item.crdNo"
                                                v-text="`${item.maskedCardNo} (${item.crdPssrNm})`"/>
                                    </b-select>
                                </div>
                            </div>

                            <div class="search_box_pop">
                                <div class="search_title">
                                    <span class="search_tit">- 처리상태</span>
                                </div>
                                <div class="search_con search-area">
                                    <b-select class="select is-fullwidth" v-model="form.useDtlsStatCd">
                                        <option value=''>==전체==</option>
                                        <option
                                                v-for="item in useDtlsStatCds"
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
                        <h3 class="ico_table_name">
                            {{title}}&nbsp;&nbsp;
                        </h3>
                    </div>
                    <div class="table-name">
                        <div style="padding-left: 200px;"></div>
                    </div>                    
                    <div class="table-name">
                        <div style="background : #D5D5D5">**개인비용(경비)에서 처리된 전표는 선택할 수 없습니다.</div>
                    </div>                    
                    <div class="btn-wrap btn-type1 clearfix">
                        <button class="btn-size btn-excel" @click="saveExcel">엑셀 저장</button>
                    </div>
                </div>
                <div class="grid-wrap">
                    <ag-grid-vue ref="grid" style="width: 100%;" class="ag-theme-alpine grid_search_height_300" 
                                :columnDefs="columnDefs" 
                                :rowData="data" 
                                :gridOptions="gridOptions"
                                :defaultColDef="defaultColDef"
                                @rowDoubleClicked="rowDoubleClick"/>
                </div>
            </div>

        </div>
        <!-- //테이블 -->
    </div>
</template>

<script>
    import mixin from '@/mixin';
    import mixinSlip from '@/mixin/slip';
    import _ from 'lodash'
    import DhxCalendar from '@/components/DhxCalendar.vue'

export default {
        name: 'SlipList',
        mixins: [ mixin, mixinSlip ],
        components: {DhxCalendar},
        props: {
            params: {
                type: Object,
                required: false
            },
        },        
        data() {
            return {
                title: '법인카드 분할전표',
                cardNos: [],
                useDtlsStatCds: [],
                form: {
                    slipTypeCd: 'E5',
                    apprDateFrom: this.$moment().startOf('month').format('YYYY-MM-DD'),
                    apprDateTo: this.$moment().format('YYYY-MM-DD'),
                    cardNo: '',
                    useDtlsStatCd: '10',
                },
                data: [],
                gridOptions: {
                    getRowStyle: (params) => {
                        if(params.data.slipTypeCd === "E1" || params.data.useDtlsStatCd === "40"){
                            //개인비용(경비)신청서 또는 사적비용 처리된 전표
                            return {background: '#D5D5D5'};
                        }
                    }
                },      
                defaultColDef: {         
                    resizable: true,
                    filter: true,
                    sortable: true,
                    editable: false
                },
            };
        },
        methods: {
            makeColDef(){
                const that = this;
                this.columnDefs = [
                    {headerName: '진행상태', field: 'useDtlsStatNm', width: 120, cellStyle:{textAlign: 'left'}},
                    {headerName: '전표상태', field: 'slipStatNm', width: 140, cellStyle:{textAlign: 'left'}},
                    {headerName: '카드번호', field: 'cardNo', width: 180, cellStyle:{textAlign: 'left'}},
                    {headerName: '가맹점명', field: 'merchNm', width: 200, cellStyle:{textAlign: 'left'}},
                    {headerName: '카드구분', field: 'crdFgNm', width: 120, cellStyle:{textAlign: 'left'}},
                    {headerName: '승인일자', field: 'apprDate', width: 120, cellStyle:{textAlign: 'left'}},
                    {headerName: '승인시각', field: 'apprTime', width: 120, cellStyle:{textAlign: 'left'}},
                    {
                        headerName: '매입금액', 
                        field: 'purchTot', 
                        width: 140, 
                        cellStyle:{textAlign: 'right'},
                        valueFormatter: function(params) { 
                            return that.getNumberFormat(params.value);
                        }
                    },
                    {
                        headerName: '공급가액', 
                        field: 'apprAmt', 
                        width: 140, 
                        cellStyle:{textAlign: 'right'},
                        valueFormatter: function(params) {               
                            return that.getNumberFormat(params.value);
                        }
                    },
                    {
                        headerName: '부가세', 
                        field: 'vat', 
                        width: 100, 
                        cellStyle:{textAlign: 'right'},
                        valueFormatter: function(params) {               
                            return that.getNumberFormat(params.value);
                        }
                    },
                    {
                        headerName: '봉사료', 
                        field: 'tips', 
                        width: 100, 
                        cellStyle:{textAlign: 'right'},
                        valueFormatter: function(params) {               
                            return that.getNumberFormat(params.value);
                        }
                    },
                    {headerName: '승인번호', field: 'apprNo', width: 140, cellStyle:{textAlign: 'left'}},
                    {headerName: '매입구분', field: 'acqClassNm', width: 140, cellStyle:{textAlign: 'left'}},
                    {headerName: '처리취소', field: 'useDtlsCancel', width: 140, cellStyle:{textAlign: 'left'}},
                    {headerName: '가맹점주소', field: 'merchAddr', width: 400, cellStyle:{textAlign: 'left'}},
                    {headerName: '업종명', field: 'mccName', width: 140, cellStyle:{textAlign: 'left'}},
                    {headerName: '과세구분', field: 'etc3', width: 140, cellStyle:{textAlign: 'left'}},
                    {headerName: '전표번호', field: 'eaSlipNo', width: 150, cellStyle:{textAlign: 'left'}},
                    {headerName: '카드사용자', field: 'crdPssrNm', width: 140, cellStyle:{textAlign: 'left'}},
                    {headerName: '직급', field: 'crdUseDutNm', width: 120, cellStyle:{textAlign: 'left'}},
                    {headerName: '부서명', field: 'crdUseDeptNm', width: 150, cellStyle:{textAlign: 'left'}},
                    {headerName: '경비처리기한', field: 'procPeriod', width: 140, cellStyle:{textAlign: 'left'}},
                    {headerName: '경비처리자', field: 'slipProcNm', width: 120, cellStyle:{textAlign: 'left'}},
                    {headerName: '전송일시', field: 'erpSlipDtm', width: 150, cellStyle:{textAlign: 'left'}},
                    {headerName: '대표자', field: 'merchOwner', width: 150, cellStyle:{textAlign: 'left'}, hide:true},
                ];
            },            
            // 카드번호
            getCardNoCombo() {
                this.$http.get(`/api/card/combo/personal`)
                    .then(response => {
                        this.cardNos = response.data
                        _.forEach(this.cardNos, (o) => {
                            o.maskedCardNo = this.getFormattedCardNumber(o.crdNo);
                            
                        })

                        this.form.cardNo = response.data[0].crdNo
                    });
            },
            // 처리상태
            getUseDtlsStatCombo() {
                this.$http.get(`/api/code/combo`, { params: {groupCd: "USE_DTLS_STAT_CD"} })
                    .then(response => {
                        this.useDtlsStatCds = response.data;
                    });
            },
            saveExcel() {
                var params = {
                    fileName : "법인카드 분할전표"
                };
                this.gridOptions.api.exportDataAsCsv(params)
            },
            goSearch() {
                
                const param = JSON.parse(JSON.stringify(this.form));
                const stripFields = ['apprDateFrom','apprDateTo'];
                _.forEach(stripFields, (name) => param[name] = this.toPure(param[name]));

                if(!this.validation(param)) return;

                
                this.$store.commit('loading');
                    this.$http.post(`/api/card/useList`, {
                            // compCd: param.compCd,
                            searchDtmFr: this.form.apprDateFrom,
                            searchDtmTo: this.form.apprDateTo,
                            useDtlsStatCd: this.form.useDtlsStatCd,
                            cardNo: this.form.cardNo,
                        }
                    )                
                    .then(response => {
                        if(response.data) {
                            
                            var data = response.data
                            
                            for(var i=0; i<data.length; i++){
                                data[i].cardNo = this.getFormattedCardNumber(data[i].cardNo);
                                data[i].apprDate = this.$moment(data[i].apprDate).format('YYYY-MM-DD');
                                if(!_.isEmpty(data[i].apprTime)){
                                    data[i].apprTime = this.$moment(data[i].apprTime, 'HHmmss').format('HH:mm:ss');
                                }
                                if(!_.isEmpty(data[i].erpSlipDtm)){
                                    data[i].erpSlipDtm = this.$moment(data[i].erpSlipDtm).format('YYYY-MM-DD HH:mm:ss');
                                }
                            }                            

                            this.data = data;
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
            validation(param) {
                if(!param.apprDateFrom || !param.apprDateTo)    { this.$swal({ type: 'warning', text: '사용일자를 입력해 주세요.' }); return false; }

                return true;
            },
            rowDoubleClick(params){

                const vm = this

                let slipTypeCd = params.data.slipTypeCd;
                let useDtlsStatCd = params.data.useDtlsStatCd;

                if(slipTypeCd === "E1" || useDtlsStatCd === "40"){

                }else{
                    let eaSlipNo =  params.data.eaSlipNo;
                    let useDtlsNo = params.data.useDtlsNo;
                    let slipStatCd = params.data.slipStatCd;
                    let grSlipNo =  params.data.grSlipNo;

                    if(grSlipNo) {
                        this.goPage({ grSlipNo, slipStatCd });
                    } else {
                        this.goPage({ useDtlsNo });
                    }
                }
            },
            goPage(params) {
                //백버튼 생성하기 위해서 쿠키에 임의로 지정 후 스토어에 저장
                this.$cookie.set('searchForm', JSON.stringify(this.form));
                this.$store.commit('searchForm', JSON.parse(this.$cookie.get('searchForm')));

                let targetName = (params.grSlipNo === undefined || params.slipStatCd === '10') ? 'cardSlipReg' : 'billSlipMng';
                this.$router.push({ name: targetName, params: params});
            },            

        },                
        mounted() {
            
            this.getCardNoCombo()
            this.getUseDtlsStatCombo()
            
            setTimeout(() => {
                this.goSearch();
            }, 1000);
            
        },
        beforeMount() {
           this.makeColDef();
        },
        watch: {
            'params': {
                immediate: true,
                deep: true,
                handler(value) {
                    if(value && value.apprDateFrom) {
                        this.form = value
                    }
                }
            }
        }        
    };
</script>

<style scoped>
    .gridbox{height: 650px!important;}
    .gridbox .objbox{height:400px !important;}

    .desc-content:after{clear: both; content:''; display: block;}
    .btn-wrap{margin-bottom:20px;}
    .desc-content{border:2px solid #9db6c9; background:#f9fafc; margin:0 0 20px 0; border-radius:4px; padding:15px 2%; clear: both;}
    .desc-content .item{float:left;}
    .desc-content .item .desc-item{position: relative; padding-left:82px; margin-bottom:8px;}
    .desc-content .item .desc-item:last-child{margin-bottom:0; height:25px;}
    .desc-content .item .desc-item .tit{position: absolute; left:0; }
    .desc-content .item .desc-item .label-tit{font-family:'NotoM'; color:#222; font-size:15px; }
    .desc-content .item.desc-left .desc-item{padding-left:90px;}
    .desc-content .item.desc-left .desc-item .desc:after{clear:both; content:''; display:block;}
    .desc-content .item.desc-left .desc-item .desc .datepicker{float:left;}
    .desc-content .item.desc-left .desc-item .desc span.wave{float:left; padding:0 6px;}
    .desc-content .item.desc-left .desc-item .td-s-thumb.search-area:after{clear:both; content:''; display:block;}
    .desc-content .item.desc-left .desc-item .td-s-thumb.search-area input,
    .desc-content .item.desc-left .desc-item .td-s-thumb.search-area .ip-box{float:left;}
    .desc-content .item.desc-left .desc-item .desc.select select{width:70%;}
    .desc-content .item.desc-left{width:35%; padding-right:40px;}
    .desc-content .item.desc-center{width:35%; padding-right:40px;}
    .desc-content .item.desc-right{width:30%; }
    .search-area input{position:relative;}
    .search-area .icon{position:absolute; right:8px; top:1px; z-index:100; cursor:pointer; font-size:16px; color:#555;}
    .search-border .td-s-thumb{position:relative; display:inline-block; }
    .search-border .td-s-thumb.search-area > input,
    .search-border .td-s-thumb.search-area > .ip-box
    .search-border .td-s-thumb.search-area > button{float:left;}
    .search-border .td-s-thumb.search-area .ip-box.ip-box-w02{width:60%; margin-left:6px;}
    .remove_text{margin-left: 0;}
    .contents div.gridbox_material.gridbox .xhdr{border-bottom:1px solid #dfdfdf;}

    @media (max-width:1580px) {
        .search-border .td-s-thumb.search-area .ip-box.ip-box-w02{width:50%;}
    }
</style>
