<template>
    <div v-if="this.$store.state.loginInfo !== null && this.$store.state.token !== ''" class="wrap">
        <!-- header -->
        <Navbar v-show="$route.path.substr(0,7)!=='/mobile' && $route.path!=='/' && $route.path.substr(0,20)!=='/evidAtchPopModeless'"/>
        <!-- //header -->

        <div id=app v-if="$route.path.substr(0,7)=='/mobile' || $route.path=='/' || $route.path.substr(0,20)=='/evidAtchPopModeless'">
            <router-view :key="$route.fullPath"/>
        </div>

        <div id=app v-else>
            <!-- lnb -->
            <Menu/>
            <!-- //lnb -->
            <!-- contents -->
            <div class="contents">
                <!-- swiper-container -->
                <!-- <Swiper/> -->
                <!-- //swiper-container -->
                <!-- back button S -->
                <button class="back_auto" v-if="showBackBtn" @click="back">
                    <span class="btn-icon"><i class="fas fa-arrow-left"></i></span>뒤로가기</button>
                <!-- back button E -->
                <!-- Main -->
                <router-view :key="$route.fullPath"/>
                <!-- Main -->
                <!-- <div class="footer">
                    © ILJIN ALL RIGHTS RESERVED.
                </div> -->
            </div>
        </div>
        <div class="vld-parent">
            <loading :active.sync="this.$store.state.isLoading" 
            :can-cancel="false" 
            :is-full-page="true"
            color="#6799FF"
            :opacity="0.1"></loading>
        </div>
        <!-- //contents -->
    </div>
    <div v-else>
        <Login/>
        <div class="vld-parent">
            <loading :active.sync="this.$store.state.isLoading" 
            :can-cancel="false" 
            :is-full-page="true"
            color="#6799FF"
            :opacity="0.1"></loading>
        </div>
    </div>
</template>

<script>
    import Navbar from "@/components/Navbar.vue";
    import Menu from "@/components/Menu.vue";
    import Swiper from "@/components/Swiper.vue";
    import Login from "@/components/Login.vue";
    import MyMain from "@/views/MyMain_pub.vue";
    import router from './router';
    // Import component
    import Loading from 'vue-loading-overlay';
    // Import stylesheet
    import 'vue-loading-overlay/dist/vue-loading.css';
 
    import {LicenseManager} from "ag-grid-enterprise";
    LicenseManager.setLicenseKey("CompanyName=iljin cns,LicensedApplication=ijcns,LicenseType=SingleApplication,LicensedConcurrentDeveloperCount=1,LicensedProductionInstancesCount=0,AssetReference=AG-013981,ExpiryDate=3_March_2022_[v2]_MTY0NjI2NTYwMDAwMA==79ca3f5c5621088302aec8ce6faf7207");    
    
    export default {
        name: "App",
        components: {Navbar, Menu, Swiper, Login, MyMain, Loading},
        methods: {
            isShowBackBtn(){
              var routeValue = this.routeHistory[this.routeHistory.length -2]
              if (['slipLst', 'apprPendLst', 'apprReqLst', 'ebillSlipRcvLst', 'cardSlipUseLst'].indexOf(this.prevRoute.name) >= 0 ||
                  routeValue.from.name === 'slipLst') {
                if(this.routeHistory[this.routeHistory.length -1].from.name === 'billSlipRegEdit'
                    && this.routeHistory[this.routeHistory.length -1].to.name === 'billSlipMng'){
                  this.showBackBtn = false
                }else{
                  this.showBackBtn = true
                }
              }else{
                this.showBackBtn = false
              }
            },
            back(event) {
              if (['slipLst', 'apprPendLst', 'apprReqLst', 'ebillSlipRcvLst', 'cardSlipUseLst'].indexOf(this.prevRoute.name) >= 0) {
                this.$router.push({
                  path: this.prevRoute.fullPath,
                  name: this.prevRoute.name,
                  params: this.$store.state.searchForm,//this.prevRoute.params,
                  props: true,
                })
              }else{
                if(['pExpenseEdit','exctpExpenseEdit','ebillSlipReg','billSlipReg'].indexOf(this.prevRoute.name)>=0 ){
                  var routeValue = this.routeHistory[this.routeHistory.length -2]
                  this.$router.push({
                    path: routeValue.from.fullPath,
                    name: routeValue.from.name,
                    params: this.$store.state.searchForm,//this.prevRoute.params,
                    props: true,
                  })
                }else{
                  this.$swal({type:'warning', text:'뒤로 갈수 없는 상태입니다.'})
                }
              }
            },
            serverSessionCheck() {

            },
        },
        data() {
            return {
                isOpen: true,
                route: router,
                isLoading: false,
                prevRoute: null,
                routeHistory:[],
                showBackBtn:false
            };

        },

        created() {
            if (!Array.prototype.filter) {
                Array.prototype.filter = function (func, thisArg) {
                    'use strict';
                    if (!((typeof func === 'Function' || typeof func === 'function') && this))
                        throw new TypeError();

                    var len = this.length >>> 0,
                        res = new Array(len), // preallocate array
                        t = this, c = 0, i = -1;

                    if (thisArg === undefined) {
                        while (++i !== len) {
                            // checks to see if the key was set
                            if (i in this) {
                                if (func(t[i], i, t)) {
                                    res[c++] = t[i];
                                }
                            }
                        }
                    } else {
                        while (++i !== len) {
                            // checks to see if the key was set
                            if (i in this) {
                                if (func.call(thisArg, t[i], i, t)) {
                                    res[c++] = t[i];
                                }
                            }
                        }
                    }

                    res.length = c; // shrink down array to proper size
                    return res;
                };
            }

            this.$http.defaults.headers['x-auth-token'] = this.$store.state.loginInfo.token;
            // server session check
            this.$http.get('/')
            .catch((ex) => {
                this.$store.commit('logout');
                this.$cookie.delete('loginInfo');
            })

            if (this.$cookie.get('loginInfo') !== null) {
                this.$store.commit('login', JSON.parse(this.$cookie.get('loginInfo')));

                const loginInfo = {};
                loginInfo.loginId = this.$store.state.loginInfo.loginId;
                loginInfo.token = this.$store.state.loginInfo.token;
                loginInfo.menu = this.$store.state.loginInfo.menu;
                loginInfo.authorities = this.$store.state.loginInfo.authorities;
                loginInfo.loginPw = 'Not Use';
                if(!this.$store.state.loginInfo.color){
                    this.$store.state.loginInfo.color = '/css/common.css'
                }
                
                //21.03.29 컬러테마
                var link = document.createElement('link');
                link.rel ='stylesheet';
                link.href = this.$store.state.loginInfo.color;
                document.head.appendChild(link);

            }
        },
        mounted() {
            // eslint-disable-next-line
            dhtmlx.image_path = "/dhtmlx/imgs/";
            // eslint-disable-next-line
            dhtmlXCalendarObject.prototype.langData.ko = {
                // date format
                dateformat: "%Y-%m-%d",
                // full names of months
                monthesFNames: [
                    "1월",
                    "2월",
                    "3월",
                    "4월",
                    "5월",
                    "6월",
                    "7월",
                    "8월",
                    "9월",
                    "10월",
                    "11월",
                    "12월"
                ],
                // short names of months
                monthesSNames: [
                    "1월",
                    "2월",
                    "3월",
                    "4월",
                    "5월",
                    "6월",
                    "7월",
                    "8월",
                    "9월",
                    "10월",
                    "11월",
                    "12월"
                ],
                // full names of days
                daysFNames: [
                    "일요일",
                    "월요일",
                    "화요일",
                    "수요일",
                    "목요일",
                    "금요일",
                    "토요일"
                ],
                // short names of days
                daysSNames: ["일", "월", "화", "수", "목", "금", "토"],
                // starting day of a week. Number from 1(Monday) to 7(Sunday)
                weekstart: 0,
                // the title of the week number column
                weekname: "주"
            };
            // eslint-disable-next-line
            dhtmlXCalendarObject.prototype.lang = "ko";

            //21.03.29 컬러테마
            if(!this.$store.state.loginInfo.color){
                this.$store.state.loginInfo.color = '/css/common.css'
            }

            var link = document.createElement('link');
            link.rel ='stylesheet';
            link.href = this.$store.state.loginInfo.color;
            document.head.appendChild(link);

            this.$store.commit('finish');
        },
        watch: {
            '$route'(to, from) {
              if(to.name && from.name){
                this.prevRoute = from
                this.routeHistory.push({to, from})
                this.isShowBackBtn()
              }
            }
        }
    };
</script>

