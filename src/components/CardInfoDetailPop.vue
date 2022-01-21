<template>
    <layout>
        <span slot="header">{{title}}<button class="btn-pop-close delete" aria-label="close"
                                             @click="closeModal"></button></span>
        <div slot="content">
            <div class="inner-box" style="height: 290px">
                <div class="table-area">
                    <div class="table-a">
                        <table id="basic" class="table">
                            <colgroup>
                                <col width="20%">
                                <col width="80%">
                            </colgroup>
                            <tbody>
                            <tr>
                                <th class="tp">카드번호</th>
                                <td>
                                    {{this.form.crdNo}}
                                </td>
                            </tr>
                            <tr>
                                <th class="tp">거래일시</th>
                                <td>
                                    {{this.form.apprDateTime}}
                                </td>
                            </tr>
                            <tr>
                                <th class="tp">거래금액</th>
                                <td>
                                    {{$numeral(this.form.purchTot).format('0,0')}}
                                </td>
                            </tr>
                            <tr>
                                <th class="tp">부가세</th>
                                <td>
                                    {{$numeral(this.form.vat).format('0,0')}}
                                </td>
                            </tr>
                            <tr>
                                <th class="tp">봉사료</th>
                                <td>
                                    {{$numeral(this.form.tips).format('0,0')}}
                                </td>
                            </tr>
                            <tr>
                                <th class="tp">승인번호</th>
                                <td>
                                    {{this.form.apprNo}}
                                </td>
                            </tr>
                            <tr>
                                <th class="tp">가맹점명</th>
                                <td>
                                    {{this.form.merchNm}}
                                </td>
                            </tr>
                            <tr>
                                <th class="tp">가맹점주소</th>
                                <td>
                                    {{this.form.merchAddr}}
                                </td>
                            </tr>
                            <tr>
                                <th class="tp">가맹점번호</th>
                                <td>
                                    {{this.form.merchNo}}
                                </td>
                            </tr>
                            <tr>
                                <th class="tp">사업자번호</th>
                                <td>
                                    {{this.form.merchBizNo}}
                                </td>
                            </tr>
                            <tr>
                                <th class="tp">연락처</th>
                                <td>
                                    {{this.form.merchTel}}
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </layout>
</template>

<script>
    import Layout from '@/components/ModalSlot.vue'
    import mixin from '@/mixin'
    import mixinSlip from '@/mixin/slip'

    import DhxCalendar from '@/components/DhxCalendar.vue'
    import _ from 'lodash'

    export default {
        name: 'CardMndPop',
        props: {
            apprNo: {
                type: String,
                required: true
            },
            crdNo: {
                type: String,
                required: true
            }
        },
        mixins: [mixin, mixinSlip],
        components: {Layout, DhxCalendar},
        data() {
            return {
                title: '법인카드 사용정보',
                form: {
                    crdNo: '',
                    cdlgId: '',
                    cdlgNm: '',
                    nomnId: '',
                    nomnNm: '',
                    cdlgSeq: '',
                    cdlgStrDt: this.$moment().format('YYYY-MM-DD'),
                    cdlgEndDt: this.$moment().format('YYYY-MM-DD')
                },
                cardList: [],
            }
        },
        methods:{
            closeModal() {
                this.$parent.close();
            },
            getcardInfo(apprNo) {
                this.$http.get(`/api/card/use/info/${apprNo}`).then(response => {
                    if(response.data) {

                        this.form.crdNo = response.data[0].cardNo
                        this.form.apprDateTime = response.data[0].apprDateTime
                        this.form.apprMethod = response.data[0].apprMethod
                        this.form.purchTot = response.data[0].purchTot
                        this.form.vat = response.data[0].vat
                        this.form.tips = response.data[0].tips
                        this.form.apprNo = response.data[0].apprNo
                        this.form.merchNm = response.data[0].merchNm
                        this.form.merchAddr = response.data[0].merchAddr
                        this.form.merchNo = response.data[0].merchNo
                        this.form.merchBizNo = response.data[0].merchBizNo
                        this.form.merchTel = response.data[0].merchTel
                    }
                })
                .catch(({message}) => {
                    console.error(message);
                });
            }
        },
        // created(){
        //     console.log(this.crdNo)
        //     console.log(this.form.crdNo)
        // },
        mounted() {
            this.getcardInfo(this.apprNo)
        },
        watch: {
            
        }
    }
</script>

<style scoped>
    .modal-card {
        height: 600px;
    }
</style>
