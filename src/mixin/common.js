import { url as _url } from '@/libs/join'

export default {
  methods: {
    findEmp(searchStr, callback, failed) {
      if (!searchStr) {
        callback.apply(this, [{}])
      } else {
        this.$http.get(_url('/api/emp', searchStr))
          .then(response => {
            let data = response.data
            if (Array.isArray(data) && data.length > 0 && typeof callback === 'function') {
              callback.apply(this, data)
            } else {
              failed.apply(this, [])
            }
          }).catch(() => {
            failed.apply(this, [])
          })
      }
    },
    findAccount(slipTypeCd, searchStr, callback, failed) {
      if (!searchStr) {
        callback.apply(this, [{}])
      } else {
        this.$http.get('/api/account', {
          params: {
            slipTypeCd: slipTypeCd,
            value: searchStr
          }
        }).then(response => {
          let data = response.data
          if (Array.isArray(data) && data.length > 0 && typeof callback === 'function') {
            callback.apply(this, data)
          } else {
            failed.apply(this, [])
          }
        }).catch(() => {
          failed.apply(this, [])
        })
      }
    },
    findCctr(searchStr, callback, failed) {
      if (!searchStr) {
        callback.apply(this, [{}])
      } else {
        this.$http.get(_url('/api/cctr', searchStr))
          .then(response => {
            let data = response.data
            if (Array.isArray(data) && data.length > 0 && typeof callback === 'function') {
              callback.apply(this, data)
            } else {
              failed.apply(this, [])
            }
          }).catch(() => {
            failed.apply(this, [])
          })
      }
    },
    findVendor(slipTypeCd, searchStr, callback, failed) {
      if (!searchStr) {
        callback.apply(this, [{}])
      } else {
        this.$http.get(_url('/api/vendor', slipTypeCd, searchStr))
          .then(response => {
            let data = response.data
            if (Array.isArray(data) && data.length > 0 && typeof callback === 'function') {
              callback.apply(this, data)
            } else {
              failed.apply(this, [])
            }
          }).catch(() => {
            failed.apply(this, [])
          })
      }
    },
    validateDate(data, array){      
      
      for (let index = 0; index < array.length; index++) {
        const v = array[index];        
        
        if(data[v.fromDate] !== undefined && data[v.toDate] !== undefined){
          const fromDate = data[v.fromDate].replace(/\-/g,'') 
          const toDate = data[v.toDate].replace(/\-/g,'')  

          if(fromDate > toDate){
            this.$swal({type: 'warning', text: '?????? ??????????????? ???????????? ????????? ?????????????????????.'});
            return false
          }
        }
      }
      return true
    },
    extractValues(mappings) {           
      var params = new Array();
        for (var i = 0; i< mappings.length;i++) {
            params.push(mappings[i].key);
        }
        return params;
    },
    lookupValue(mappings, key) {
      for (var i = 0; i< mappings.length;i++) {
          if (mappings[i].key == key) {
              return mappings[i].value;
          }    
      }
      return "";
    },
    searchRequireCheck() {

      let valColName

      //[STEP-1] require ?????? ??????
      const reqSearch = document.getElementsByClassName("control-label-req")

      //[STEP-2] require ????????? ??????
      const err = Object.entries(reqSearch).find( x => {
        
        const reqVal = $('[lbl=\"'+ x[1].id +'\"]')
        
        for(let i = 0; i < reqVal.length; i++){
          //if(!reqVal.get(i).value) {
          if(!reqVal.get(i).outerText) {  
            valColName = x[1].innerText 
            break
          }
        }
        
        return valColName !== undefined
      })

      //[STEP-3] ?????? ?????? ??????
      if(err){
        this.$swal({type: 'warning', html: '<h style="color: #CC3D3D;">' + valColName + '</h>???(???) ?????? ?????? ?????? ?????????.'})
        return false        
      } 

      return true
    },    
    gridRequireCheck(params) {
      
      for(var i = 0; i < params.length; i++){
        const grid = params[i]        

        //[STEP-1] START ???????????? ?????? ??????
        let reqCol = []

        grid.columnDefs.forEach( x => {
          if(x.children !== undefined){            
            x.children.forEach( child => { 
              if(child.headerClass == "require-column") reqCol.push(child)
            })
          }else{
            if(x.headerClass == "require-column") reqCol.push(x)
          }
        })
        //[STEP-1] END
      
        //[STEP-2] START ?????? ?????? ??? ??????
        let reqColName
        let reqRowIdx

        const obj = grid.rowData.find((x,i) => {
          reqCol.forEach(c => {            
            if(!x[c.field]){ 
              reqColName = c.headerName
              reqRowIdx = i 
              return
            }
          })
          return reqColName !== undefined
        })
        //[STEP-2] END
        if(obj){
          this.$swal({type: 'info', html: '<h style="color: #CC3D3D;">'+ reqColName + '</h>???(???) ?????? ????????? ?????????.<br />' + (reqRowIdx + 1) + '?????? ????????? ?????? ????????????'});
          return false;
        }

        return true;
      }
    },
    formRequireCheck(params) {
      
      let valColName

      //[STEP-1] require ?????? ??????
      const reqForm = document.getElementsByClassName("label-form-require")

      //[STEP-2] require ????????? ??????
      const err = Object.entries(reqForm).find( x => {
        
        const reqVal = $('[lbl=\"'+ x[1].id +'\"]')
        
        for(let i = 0; i < reqVal.length; i++){
          if(!reqVal.get(i).value) {
            valColName = x[1].innerText 
            break
          }
        }
        
        return valColName !== undefined
      })

      //[STEP-3] ?????? ?????? ??????
      if(err){
        this.$swal({type: 'warning', html: '<h style="color: #CC3D3D;">' + valColName + '</h>???(???) ?????? ?????? ?????? ?????????.'})        
        return false        
      } 

      return true
    },
    gridValidateCheck(params) {
      
      for(var i = 0; i < params.length; i++){
        
        const grid = params[i]        

        //[STEP-1] validation ?????? ??????
        let validCol = []        

        grid.columnDefs.forEach( x => {
          if(x.children !== undefined){            
            x.children.forEach( child => { 
              if(child.min !== undefined || child.max !== undefined 
                || child.from !== undefined || child.to !== undefined 
                || x.maxLength !== undefined) 
                  validCol.push(child)
            })
          }else{
            if(x.min !== undefined || x.max !== undefined 
              || x.from !== undefined || x.to !== undefined 
              || x.maxLength !== undefined) 
                validCol.push(x)
          }
        })
        //[STEP-1] END
        
        //[STEP-2] START validation ??????
        let chkIdx
        let valColName
        let valRowIdx        
        let fromData
        let toData

        const obj = grid.rowData.find((x,i) => {
          validCol.some(c => {

            //?????? ?????? ??????
            if(c.min !== undefined || c.max !== undefined ){              
              
              if( x[c.field] > c.max || x[c.field] < c.min){
                valColName = c.headerName
                valRowIdx = i 
                fromData = c.min
                toData = c.max
                chkIdx = 1
                return true
              }
            }
            
            //????????????
            if((c.from !== undefined || c.to !== undefined) && x[c.field] && x[c.from]){ 
              fromData = x[c.from] ? x[c.from]: x[c.field]
              toData = x[c.to] ? x[c.to]: x[c.field]

              if(toData < fromData){
                valColName = c.headerName
                valRowIdx = i               
                chkIdx = 2
                return true
              }
            }

            //maxLength??????
            if(c.maxLength !== undefined && x[c.field] ){              
              if(x[c.field].length > c.maxLength){
                valColName = c.headerName
                valRowIdx = i               
                toData = c.maxLength
                chkIdx = 3
                return true
              }
            }
          })

          return valColName !== undefined
        })       
        
        if(obj){
          switch (chkIdx) {
            case 1 :
              this.$swal({type: 'warning', html: (valRowIdx + 1) + '?????? ?????????  <h style="color: #CC3D3D;">' + valColName + '</h> ?????? ?????? ?????? ??? ?????? ????????????.<br/>' + '????????? : '+ fromData + '<br/>????????? : '+ toData})
              break;
            case 2 :
              this.$swal({type: 'warning', html: '??????????????? ???????????? ?????? ??? ??? ????????????.<br/>' + (valRowIdx + 1) + '??????  <h style="color: #CC3D3D;">' + valColName + '</h> ?????? ????????????'})
              break;
            case 3 :
              this.$swal({type: 'warning', html: '?????? ?????? ?????? ?????? ???????????????. <br/>?????????????????? : '+ toData +"<br/>"+ (valRowIdx + 1) + '?????? <h style="color: #CC3D3D;">' + valColName + '</h> ????????? ?????? ????????????'})
              break;
          } 
          
          return false;
        }
        //[STEP-2] END

        return true;
      }
    },        
  }
}