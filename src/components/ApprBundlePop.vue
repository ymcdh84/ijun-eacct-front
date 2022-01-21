<template>
    <layout>
        <span slot="header">{{title}}<button class="btn-pop-close delete" aria-label="close"
                                             @click="closeModal"></button></span>
        <div slot="content">
            <div class="btn-type1">
                <button class="btn-size btn-gray" @click="save"><span class="btn-icon">
                    <i class="fas fa-check"></i></span> 확인
                </button>
            </div>

            <div class="inner-box">
                <table id="basic">
                    <colgroup>
                        <col width="120px">
                        <col width="480px">
                    </colgroup>
                    <tbody>
                    <tr style="">
                        <th class="tp-a" style="border-top: 1px solid #d7d7d7"> 제목</th>
                        <td style="border-top: 1px solid #d7d7d7"><span>{{form.docTitleNm}}</span></td>
                    </tr>
                    <tr>
                        <th class="tp-a">결재구분</th>
                        <td>
                            <div class="control">
                                <div class="dp-ib fl_left">
                                    <input type="radio" id="radio01" v-model="form.apprFgCd" value="A"/>
                                    <label for="radio01" class="NotoM">승인</label>
                                </div>
                                <div class="dp-ib fl_left">
                                    <input type="radio" id="radio02" v-model="form.apprFgCd" value="R"/>
                                    <label for="radio02" class="NotoM">반려</label>
                                </div>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <th class="tp-a"> 의견</th>
                        <td><textarea v-model="form.apprDesc"></textarea></td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </layout>
</template>

<script>
    import Layout from '@/components/ModalSlot.vue'
    import mixin from '@/mixin';

    export default {
        name: 'ApprActPop',
        props: ['apprList'],
        mixins: [mixin],
        components: {Layout},
        data() {
            return {
                title: '승인 처리',
                form: {
                    apprFgCd: 'A',
                    docTitleNm: '',
                    apprDesc: '',
                },
            }
        },
        methods: {
            save() {
                let apprList = this.apprList
                
                this.$store.commit('loading')
                this.$http.post(`/api/appr/bundle/approval`, {
                    apprList,
                    apprFgCd: this.form.apprFgCd,
                    apprDesc: this.form.apprDesc
                })
                .then((response) => {
                    
                    this.closeModal();
                    this.$swal({ type: 'info', text: '결재가 완료되었습니다' });

                    this.$emit('close', apprList)
                })
                .catch((e) => {
                    console.error(e);
                    this.closeModal();
                    this.$emit('close', apprList);
                }).finally(() => {
                    this.$store.commit('finish')
                });
            },
            closeModal() {
                this.$parent.close();
            }
        },
        mounted() {
            if(this.apprList.length > 1) {
                this.form.docTitleNm = this.apprList[0].docTitleNm + ' 외 '+ (this.$numeral(this.apprList.length).value() - 1) + '건';
            } else {
                this.form.docTitleNm = this.apprList[0].docTitleNm;
            }
        }
    };
</script>

<style scoped>
    div#gridbox {
        width: 100%;
        height: 100%;
        min-height: 300px;
    }

</style>
