<template>
    <div class="inner-box">
        <div class="content-name">
            <h2 class="dp-ib">환경설정</h2>
            
            <div class="btn-wrap btn-type1 clearfix">
                <button class="btn-size btn-blue fl_left" @click="submit"><span class="btn-icon"><i class="fas fa-save"></i></span> 저장</button>
            </div>
         <div class="btn-wrap btn-type1 clearfix">
                <input type="radio" id="Basic" value="/css/common.css" v-model="color" @click="showAlarm()">
                <label for="Basic">Basic</label>
                <input type="radio" id="Mint" value="/css/common_mt.css" v-model="color" @click="showAlarm()">
                <label for="Mint">Mint</label>
                <input type="radio" id="Orange" value="/css/common_or.css" v-model="color" @click="showAlarm()">
                <label for="Orange">Orange</label>
                <input type="radio" id="Violet" value="/css/common_pp.css" v-model="color" @click="showAlarm()">
                <label for="Violet" style="padding-right:30px;">Violet</label>
            </div>
        </div>

        <!-- 테이블 -->
       <ag-grid-vue         
        ref="grid"
        style="width: 100%; height: 84vh; min-height: 300px;"
        class="ag-theme-alpine"
        rowSelection="multiple"                                  

        :columnDefs="columnDefs"
        :defaultColDef="defaultColDef"
        :gridOptions="gridOptions"       
        :rowData="mysets"
        :frameworkComponents="frameworkComponents"          

        @grid-ready="onReady"
        @cell-value-changed="onCellValueChanged"        
      />       
    </div>
</template>

<script>
    import Vue from 'vue'
    import mixin from '@/mixin';
    import mixinSlip from '@/mixin/slip';
    import SelectCellRenderer from '@/components/agGrid/select-cell-renderer'
    import CheckboxCellRenderer from '@/components/agGrid/checkbox-cell-renderer'
    import _ from 'lodash'

    const bus = new Vue()
    
    export default {
        name: 'QuickSetting',
        mixins: [mixin, mixinSlip],
        data() {
            return {
                title: '환경설정',
                mysets:[],
                menuIconCds:[],
                menuNo:[],
                options: [
                    { detailNm: '', detailCd: 'null' },
                    { detailNm: '1', detailCd: '1' },
                    { detailNm: '2', detailCd: '2' },
                    { detailNm: '3', detailCd: '3' },
                    { detailNm: '4', detailCd: '4' },
                    { detailNm: '5', detailCd: '5' }
                ],                
                authority: '',
                compCd:'',
                loginId:'',
                checkId:[],
                checkList:[],
                chkSaveList:[],
                IconCdv:[],
                Icon:[],
                saveCheck:[],
                saveCheckID:[],
                resultId:[],
                resultCd:[],
                color:'',
                id:'chk',
                defaultColDef: {         
                    resizable: true,
                    filter: true,
                    sortable: true,
                    editable: false,
                    width: 400 , 
                    cellStyle : {'justify-content': 'center','align-items': 'center', 'display': 'flex','height': '100%'}
                }, 
                gridOptions: {          
                    rowHeight: 100
                },                             
                gridApi : null ,    //gridAip
                columnApi : null ,  //columApi
                columnDefs: [] ,    //comulum Defs
                frameworkComponents: {
                    selectCellRenderer: SelectCellRenderer,
                    checkboxRenderer: CheckboxCellRenderer
                },
            };
        },

        methods: {
            //그리드 Ready
            onReady(params) {            
                //그리드용 api 정의
                //this.gridApi = params.api;
                //this.columnApi = params.columnApi; //params대신 gridOptions 사용가능
                this.gridApi = params.api;
                this.columnApi = params.columnApi;

                this.createColumnDefs();

                this.getMySet();
            },
            //컬럼정의 함수
            createColumnDefs() { 
                const vm = this

                this.columnDefs = [
                    {  
                        headerName: "선택"
                      , field:'regYn'
                      , width : 150
                      , editable: true
                      , cellRenderer: 'checkboxRenderer'
                      , cellRendererParams: {
                           trueValue: "1"    //true값  지정 defalut-"Y" ex) "Y", true, "1"
                         , falseValue: "0"  //false값 지정 defalut-"N" ex) "N", false, "0"
                      }                      
                    },
                    {  
                        headerName: "메인"
                      , width : 150
                      , cellRenderer: function(params){                          
                            if(params.node.data.regYn === "1"){
                                return "등록"
                            }                        
                        }
                    },
                    {  
                        headerName: "메뉴순서"
                      , field:'menuOrder' 
                      , width: 100
                      , editable: true
                      , cellRenderer: 'selectCellRenderer'
                      , cellRendererParams: {
                            options : vm.options
                        }
                    },                    
                    {  
                        headerName: "메뉴"
                      , field:'menuName'                 
                      , width : 420
                    },                    
                    {  
                        headerName: "아이콘"
                      , field:'menuIconCd'
                      , editable: true
                      , cellRenderer: 'selectCellRenderer'
                      , cellRendererParams: {
                            options : vm.menuIconCds,
                            detailCd: 'key',  //서버로 부터 받은 key defalut-"detailCd"
                            detailNm: 'value' //서버로 부터 받은 value defalut-"detailNm"
                        }
                    },
                    {  
                        headerName: "아이콘이미지"
                      , cellRenderer : vm.handleChange
                    }
                ];
            },            
            /*설정화면 전체 데이터 가져오기*/
            getMySet() {
                //this.$http.get(`/api/settings/${this.$store.state.loginInfo.loginId}`)
                this.$http.get(`/api/dashboard/settings/${this.$store.state.loginInfo.loginId}`)
                    .then(response => {
                        this.mysets = response.data.menus
                        this.color = response.data.attribute2
                    });
            },
            /*아이콘 셀렉트박스 코드값 가져오기*/
            getMenuIconCdCombo() {
                this.$http.get(`/api/code/combo`, {params: {groupCd: "MENU_ICON_CD"}})                
                    .then(response => {
                        this.menuIconCds = response.data;
                        bus.$emit('selectBox.updated')
                    });
            },
            /*아이콘 셀렉트박스 이벤트*/
            handleChange(params){
                
                let imgtag='';
                
                switch (params.node.data.menuIconCd) {
                    case '10':
                        imgtag = '<img src="img/icon_maintop_01_b.png"/>';
                        break;
                    case '20':
                        imgtag = '<img src="img/icon_maintop_02_b.png"/>';
                        break;
                    case '30':
                        imgtag = '<img src="img/icon_maintop_03_b.png"/>';
                        break;
                    case '40':
                        imgtag = '<img src="img/icon_maintop_04_b.png"/>';
                        break;
                    case '50':
                        imgtag = '<img src="img/icon_maintop_05_b.png"/>';
                        break;
                    case '60':
                        imgtag = '<img src="img/icon_maintop_06_b.png"/>';
                        break;
                    case '70':
                        imgtag = '<img src="img/icon_maintop_06_01_b.png"/>';
                        break;
                    case '80':
                        imgtag = '<img src="img/icon_maintop_06_02_b.png"/>';
                        break;
                    case '90':
                        imgtag = '<img src="img/icon_maintop_06_03_b.png"/>';
                        break;
                    case '100':
                        imgtag = '<img src="img/icon_maintop_06_04_b.png"/>';
                        break;
                    case '110':
                        imgtag = '<img src="img/icon_maintop_06_05_b.png"/>';
                        break;
                    case '120':
                        imgtag = '<img src="img/icon_maintop_06_06_b.png"/>';
                        break;
                }
                return imgtag
            },
            submit() {
                
                let saveList = []
                
                /* 체크된 데이터 가져오기*/
                const grid = this.$refs.grid

                //선택 데이터 개수 체크(6개)    
                const chkDatas = grid.rowData.filter((x,i) => {
                    return x.regYn === "1"
                })

                if(chkDatas.length > 6) {
                    this.$swal({ type: 'warning', text: '메인아이콘은 6개를 초과할 수 없습니다.' })
                    return
                }
                
                //메뉴순서 중복체크
                let menuOrders=[];

                for(let k=0; k < grid.rowData.length; k++){

                    const rData = grid.rowData[k]
                    
                    if(rData.menuOrder){
                        menuOrders.push(Number(rData.menuOrder));
                    }
                }                
                
                let mOrder = _.uniqBy(menuOrders);
                if(mOrder.length !== menuOrders.length){
                    this.$swal({type: 'warning', text: '순서는 중복 될 수 없습니다.'});
                    return;
                }                

                //아이콘선택 체크    
                const uncheckIcon = chkDatas.find( x => {
                    let saveQuick = {
                        "compCd": this.compCd,
                        "loginId": this.loginId,
                        "menuNo": x.menuNo,
                        "menuIconCd": x.menuIconCd,
                        "menuOrder":x.menuOrder
                    };               
                    
                    saveList.push(saveQuick);
                    return !x.menuIconCd
                })
                
                let saveCust={
                    "attribute2" :this.color,
                    "menus":saveList,
                }
                
                if(uncheckIcon){
                    this.$swal({type: 'warning', text: '아이콘을 선택해 주세요.'})
                }else{
                     this.$http.put(`/api/dashboard/settings`, saveCust)
                     .then(response => {
                         this.$swal({ type: 'success', text: '저장되었습니다' });
                         this.getMySet()
                     }).catch(response => {
                        console.error(response)
                     })
                }
            },
            onCellValueChanged(event) {                
                const idx = event.rowIndex
                const field = event.colDef.field
                
                if(field === "regYn" || field === "menuIconCd"){
                    //row refresh
                    var rows = [];
                    var rowNode = this.gridApi.getDisplayedRowAtIndex(idx);
                    
                    rows.push(rowNode)
                
                    this.gridApi.redrawRows({ rowNodes: rows });
                }
            },
            showAlarm(){
             this.$swal({type:'info',text: '저장 후 재로그인해야 테마가 적용됩니다.'})
             }
        },
        created() {
            bus.$on('selectBox.updated', () => {
                 //셀렉트 박스 안에 맵핑될 데이터가 그리드에 반영되기 위해 비동기 처리
                 this.createColumnDefs();
            })
        },
        mounted() {
          document.title = '환경설정 - IJEAS';
            this.authority = this.$store.state.loginInfo.authorities[0].roleCd;
            this.loginId = this.$store.state.loginInfo.loginId;
            this.compCd = this.$store.state.loginInfo.compCd;
            this.getMenuIconCdCombo();
        }       
    };
</script>
