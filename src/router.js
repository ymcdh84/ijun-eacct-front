import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/login',
            name: 'Login',
            props: true,
            component: () =>
                import ('./components/Login.vue'),
        },
        {
            path: '/cardSlipReg',
            name: 'cardSlipReg',
            props: true,
            component: () =>
                import ('./views/CardSlipReg.vue'),
        },
        {
            path: '/cardSlipReg/:grSlipNo',
            name: 'cardSlipRegEdit',
            props: true,
            component: () =>
                import ('./views/CardSlipReg.vue'),
        },
        {
            path: '/cardSlipQry',
            name: 'cardSlipQry',
            props: true,
            component: () =>
                import ('./views/CardSlipQry.vue'),
        },
        //법인카드
        {
            path: '/cardSlipUseLst',
            name: 'cardSlipUseLst',
            props: (route) => {
                return {
                    params: route.params
                }
            },
            component: () =>
                import ('./views/CardSlipUseLst.vue'),
        },
        {
            path: '/ebillSlipReg',
            name: 'ebillSlipReg',
            props: true,
            component: () =>
                import ('./views/EbillSlipReg.vue'),
        },
        //2020.06.11 전자세금계산서 이동
        {
            path: '/ebillSlipReg/:grSlipNo',
            name: 'ebillSlipRegEdit',
            props: true,
            component: () =>
                import ('./views/EbillSlipReg.vue'),
        },
        {
            path: '/ebillSlipRcvLst',
            name: 'ebillSlipRcvLst',
            props: (route) => {
                return {
                    params: route.params
                }
            },            
            component: () => import ('./views/EbillSlipRcvLst.vue'),
        },
        {
            path: '/slipLst',
            name: 'slipLst',
            props: (route) => {
                return {
                    params: route.params
                }
            },
            //component: () => import ('./views/SlipLst.vue'),
            component: () => import ('./views/SlipLst_New.vue'),
        },
        {
            path: '/evidAtchPopModeless',
            name: 'evidAtchPopModeless',
            props: (route) => {
                return {
                    params: route.params
                }
            },
            component: () => import ('./components/EvidAtchPopModeless.vue'),
        },           
        {
            path: '/slipLst/:slipTypeCd',
            name: 'slipLstSlipTypeCd',
            props: (route) => {
                return {
                    params: route.params
                }
            },
            component: () => import ('./views/SlipLst_New.vue'),
        },        
        {
            path: '/billSlipQry/:grSlipNo',
            name: 'billSlipQry',
            props: true,
            component: () =>
                import ('./views/BillSlipQry.vue'),
        },
        {
            path: '/billSlipMng/:grSlipNo',
            name: 'billSlipMng',
            props: (route) => {
                return {
                    grSlipNo: route.params.grSlipNo
                }
            },
            component: () =>
                import ('./views/BillSlipMng.vue'),
        },
        {
            path: '/quickSetting',
            name: 'quickSetting',
            component: () =>
                import ('./views/QuickSetting.vue'),
        },
        {
            path: '/',
            name: 'main',
            component: () =>
                import ('./views/MyMain_pub.vue'),
        },
        {
            path: '/test',
            name: 'testMain',
            component: () =>
                import ('./views/TestMain.vue'),
        },
        // {
        //     path: '/apprPendLst',
        //     name: 'apprPendLst',
        //     props: (route) => {
        //         return {
        //             params: route.params
        //         }
        //     },
        //     component: () =>
        //         import ('./views/ApprPendLst.vue'),
        // },
        {
            path: '/apprPendLst',
            name: 'apprPendLst',
            props: (route) => {
                return {
                    params: route.params
                }
            },
            component: () =>
                import ('./views/ApprPendLst_new.vue'),
        },
        {
            path: '/apprDtlQry/:docMngNo',
            name: 'apprDtlQry',
            props: true,
            component: () =>
                import ('./views/ApprDtlQry.vue'),
        },
        {
            path: '/mobile/apprDtlQry/:docMngNo',
            name: 'apprDtlQry',
            props: true,
            component: () =>
                import ('./views/ApprDtlQry.vue'),
        },
        {
            path: '/apprCompLst',
            name: 'apprCompLst',
            //component: () => import ('./views/ApprCompLst.vue'),
            component: () => import ('./views/ApprCompLst_New.vue'),
        },
        {
            path: '/apprReqLst',
            name: 'apprReqLst',
            //component: () => import ('./views/ApprReqLst.vue'),
            component: () => import ('./views/ApprReqLst_New.vue'),
        },
        {
            path: '/apprMndSet',
            name: 'apprMndSet',
            component: () =>
                import ('./views/ApprMndSet.vue'),
        },
        {
            path: '/apprRuleSet',
            name: 'apprRuleSet',
            component: () =>
                import ('./views/ApprRuleSet.vue'),
        },
        {
            path: '/cardInfoMng',
            name: 'cardInfoMng',
            component: () =>
                import ('./views/CardInfoMng.vue'),
        },
        {
            path: '/cardMndMng',
            name: 'cardMndMng',
            component: () =>
                import ('./views/CardMndMng.vue'),
        },
        {
            path: '/cardUseLst',
            name: 'cardUseLst',
            //component: () => import ('./views/CardUseLst.vue'),
            component: () => import ('./views/CardUseLst_New.vue'),
        },
        {
            path: '/cardInvLst',
            name: 'cardInvLst',
            component: () =>
                import ('./views/CardInvLst.vue'),
        },
        {
            path: '/cardCoprMng',
            name: 'cardCoprMng',
            component: () =>
                import ('./views/CardCoprMng.vue'),
        },
        {
            path: '/slipMng',
            name: 'slipMng',
            props: (route) => {
                return {
                    params: route.params
                }
            },
            // component: () => import('./views/SlipMng.vue')
            component: () => import('./views/SlipMng_New.vue')
        },
        {
            path: '/slipMng/:fixSlipStatCd',
            name: 'slipMng',
            props: (route) => {
                return {
                    params: route.params,
                    fixSlipStatCd: route.params.fixSlipStatCd,
                }
            },
            component: () => import('./views/SlipMng_New.vue')
        },
        {
            path: '/slipMngDetail',
            name: 'slipMngDetail',
            //component: () => import('./views/SlipMngDetail.vue')
            component: () => import('./views/SlipMngDetail_New.vue')
        },
        {
            path: '/pacctMng',
            name: 'pacctMng',
            component: () => import('./views/PacctMng.vue')            
        },
        {
            path: '/slipGrAppr',
            name: 'slipGrAppr',
            component: () => import('./views/SlipGrAppr.vue')
        },
        {
            path: '/slipMngItemSet',
            name: 'slipMngItemSet',
            component: () => import('./views/SlipMngItemSet.vue')
        },
        {
            path: '/evidSlip',
            name: 'evidSlipNew',
            props: true,
            component: () => import('./views/EvidSlip.vue')
        },
        {
            path: '/evidSlip/:eaSlipNo',
            name: 'evidSlipEdit',
            props: true,
            component: () => import('./views/EvidSlip.vue')
        },
        {
            path: '/whtSlip',
            name: 'whtSlipNew',
            props: true,
            component: () => import('./views/WhtSlip.vue')
        },
        {
            path: '/whtSlip/:eaSlipNo',
            name: 'whtSlipEdit',
            props: true,
            component: () => import('./views/WhtSlip.vue')
        },
        {
            path: '/bdgtReqReg',
            name: 'bdgtReqReg',
            component: () => import('./views/BdgtReqReg.vue')
        },
        {
            path: '/bdgtReq',
            name: 'bdgtReqNew',
            component: () => import('./views/BdgtReq.vue')
        },
        {
            path: '/bdgtReq/:budReqNo',
            name: 'bdgtReqEdit',
            props: true,
            component: () => import('./views/BdgtReq.vue')
        },
        {
            path: '/bdgtReqMng/:budReqNo',
            name: 'bdgtReqMngEdit',
            props: (route) => {
                return {
                    budReqNo: route.params.budReqNo,
                    manage: true
                }
            },
            component: () => import('./views/BdgtReq.vue')
        },
        {
            path: '/bdgtReqLst',
            name: 'bdgtReqLst',
            props: (route) => {
                return {
                    params: route.params
                }
            },
            component: () => import('./views/BdgtReqLst.vue')
        },
        {
            path: '/bdgtReqMng',
            name: 'bdgtReqMng',
            component: () => import('./views/BdgtReqMng.vue')
        },
        {
            path: '/deptBdgLst',
            name: 'deptBdgLst',
            component: () => import('./views/DeptBdgLst.vue')
        },
        {
            path: '/authMng',
            name: 'authMng',
            component: () => import('./views/AuthMng.vue')
        },
        {
            path: '/pgmMng',
            name: 'pgmMng',
            component: () => import('./views/PgmMng.vue')
        },
        {
            path: '/codeMng',
            name: 'codeMng',
            component: () =>
                import ('./views/CodeMng.vue'),
        },
        {
            path: '/acctMng',
            name: 'acctMng',
            component: () => import ('./views/AcctMng.vue')
        },
        {
            path: '/acctSubMng',
            name: 'acctSubMng',
            component: () => import ('./views/AcctSubMng.vue')
        },        
        {
            path: '/taxMng',
            name: 'taxMng',
            component: () =>
                import ('./views/TaxMng.vue'),
        },
        {
            path: '/closeMng',
            name: 'closeMng',
            component: () =>
                import ('./views/CloseMng.vue'),
        },
        {
            path: '/oilPcePop',
            name: 'oilPcePop',
            component: () =>
                import ('./views/oilPcePop.vue'),
        },
        //아래 부터 해당 router url은 화면 개발 완료 후 한번에 namespace 변경 할 예정임.
        {
            path: '/pExpense',//개인비용(경비) 신청서 등록
            name: 'pExpense',
            props: true,
            component: () => import('./views/pExpense.vue')
        },
        {
            path: '/pExpense_pub',//개인비용(경비) 신청서 등록_publisher
            name: 'pExpense_pub',
            props: true,
            component: () => import('./views/pExpense_pub.vue')
        },        
        {   //재조회 가능 시 해당 라우터로 보내야함.
            path: '/pExpense/:grSlipNo',//개인비용(경비) 신청서 등록
            name: 'pExpenseEdit',
            props: (route) => {
                return {
                    grSlipNo: route.params.grSlipNo,
                    slipStatCd: route.params.slipStatCd,
                    fromSlipLst: route.params.fromSlipLst
                }
            },
            component: () => import('./views/pExpense.vue')
        },
        {
            path: '/exctpExpense',//개인비용(경비)외 신청서
            name: 'exctpExpenseNew',
            props: true,
            component: () => import('./views/ExctpExpense.vue')
        },
        {
            path: '/exctpExpense/:grSlipNo',//개인비용(경비)외 신청서
            name: 'exctpExpenseEdit',
            props: (route) => {
                return {
                    grSlipNo: route.params.grSlipNo,
                    slipStatCd: route.params.slipStatCd,
                    fromSlipLst: route.params.fromSlipLst
                }
            },
            component: () => import('./views/ExctpExpense.vue')
        },
        {
            path: '/purSlipLst',//구매전표 목록
            name: 'purSlipLst',
            props: true,
            component: () => import('./views/PurSlipLst.vue')
        },
        {
            path: '/mobile/purSlipQry/:docMngNo',//구매전표 상세
            name: 'purSlipQry',
            props: true,
            component: () => import('./views/PurSlipQry.vue')
        },

        {
            path: '/consSlipLst', //공사비전표
            name: 'consSlipLst',
            props: true,
            component: () => import('./views/ConsSlipLst.vue')
        },
        {
            path: '/mobile/consSlipQry/:docMngNo',//공사비전표 상세
            name: 'consSlipQry',
            props: true,
            component: () => import('./views/ConsSlipQry.vue')
        },
        {
            path: '/billSlipReg/:grSlipNo', //세금계산서
            name: 'billSlipRegEdit',
            props: true,
            component: () =>
                import ('./views/BillSlipReg.vue'),
        },
        {
            path: '/billSlipReg', //세금계산서
            name: 'billSlipReg',
            props: true,
            component: () =>
                import ('./views/BillSlipReg.vue'),
        },
        {
            path: '/bulkExpenseReg', //일괄비용등록(기숙사등) 등록
            name: 'bulkExpenseReg',
            props: true,
            component: () => import('./views/BulkExpenseReg.vue')
        },
        {
            path: '/mobile/bulkExpenseQry/:docMngNo', //일괄비용등록(기숙사등) 상세
            name: 'bulkExpenseQry',
            props: true,
            component: () => import('./views/BulkExpenseQry.vue')
        },
        {
            path: '/payrollSlipLst', //급여전표
            name: 'payrollSlipLst',
            props: true,
            component: () => import('./views/PayrollSlipLst.vue')
        },
        {
            path: '/mobile/payrollSlipQry/:docMngNo', //급여전표 상세
            name: 'payrollSlipQry',
            props: true,
            component: () => import('./views/PayrollSlipQry.vue')
        },
        {
            path: '/paySlipLst', //자금지급전표
            name: 'paySlipLst',
            props: true,
            component: () => import('./views/PaySlipLst.vue')
        },
        {
            path: '/mobile/paySlipQry/:docMngNo',//자금지급전표 상세
            name: 'paySlipQry',
            props: true,
            component: () => import('./views/PaySlipQry.vue')
        },
        {
            path: '/etcSalesSlipLst', //기타전표
            name: 'etcSalesSlipLst',
            props: true,
            component: () => import('./views/etcSalesSlipLst.vue')
        },
        {
            path: '/mobile/etcSalesSlipQry/:docMngNo',//기타전표 상세
            name: 'etcSalesSlipQry',
            props: true,
            component: () => import('./views/EtcSalesSlipQry.vue')
        },
        {
            path: '/gLSlipLst', //GL전표
            name: 'gLSlipLst',
            props: true,
            //component: () => import('./views/GLSlipLst.vue')
            component: () => import('./views/GLSlipLst_New.vue')
        },
        {
            path: '/mobile/gLSlipQry/:docMngNo', //GL전표 상세
            name: 'gLSlipQry',
            props: true,
            component: () => import('./views/GLSlipQry.vue')
        },

//template[start]
        {
            path: '/template1', //Template1
            name: 'template1',
            props: true,
            component: () => import('./template/template1.vue')
        },
        {
            path: '/template2', //Template2
            name: 'template2',
            props: true,
            component: () => import('./template/template2.vue')
        },
        {
            path: '/template3', //Template3
            name: 'template3',
            props: true,
            component: () => import('./template/template3.vue')
        },
        {
            path: '/template4', //Template4
            name: 'template4',
            props: true,
            component: () => import('./template/template4.vue')
        },                             
//template[end]         
    ],
});
