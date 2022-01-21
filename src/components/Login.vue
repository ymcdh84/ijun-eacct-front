<template>
    <section class="hero is-fullheight login">
        <div class="hero-body">
            <div class="container">
                <div class="columns is-centered">
                    <article class="card is-rounded">
                        <div class="card-content">
                            <h1 class="title">
                                <img src="img/bg_login_title.png" alt="">
                            </h1>
                            <p class="control has-icon">
                                <input v-model="loginInfo.loginId"
                                autocomplete="name"
                                class="input" type="text" name="username"
                                placeholder="사번" autofocus="">
                                <i class="fa fa-envelope"></i>
                            </p>
                            <p class="control has-icon">
                                <input v-model="loginInfo.loginPw"
                                autocomplete="new-password"
                                class="input" type="password" name="password"
                                placeholder="비밀번호" id="myInput" @keypress="caps_lock" @keypress.enter="login">
                                <i class="fa fa-lock"></i>
                            </p>
                            <!-- 2020.08.31 'CapsLock'알림-->
                            
                            <p id="text" class="ly_box">'<strong>Caps Lock</strong>'이 켜져 있습니다.</p>
                            
                            <p class="control">
                                <button class="button is-fullwidth btn-login" @click="login">Login</button>
                            </p>
                        </div>
                    </article>
                </div>
            </div>
        </div>
        <!-- footer -->
        <div class="footer-login">
            <span class="copyright">COPYRIGHT © ILJIN ALL RIGHTS RESERVED.</span>
        </div>
        <!-- //footer-login -->
    </section>
</template>

<script>
export default {
  props: {
    loginId: {
      type: String,
      required: false,
    },
    token: {
      type: String,
      required: false,
    },
  },
  name: 'Login',
  data() {
    return {
      loginInfo: {
        loginId: '',
        loginPw: '',
        compCd: '',
          loginDeptNm: '',
          loginDeptCd: '',
          loginDutCd: '',
          loginDutNm: '',
          loginJobCd: '',
          loginJobNm: '',
        token: '',
        menu: [],
        authorities: [],
      },
    }
  },
  methods: {
    // 2020.08.31 'CapsLock'알림
    caps_lock() {
      var input = document.getElementById("myInput");
      var text = document.getElementById("text");
      input.addEventListener("keyup", function(event) {

      if (event.getModifierState("CapsLock")) {
          text.style.display = "block";
        } else {
          text.style.display = "none"
        }
      });
    },
    loginFail() {
      this.$swal({
        animation: false,
        type: 'error',
        text: `로그인 실패했습니다. ID 또는 비밀번호를 확인해 주세요.`,
      });
    },
    async login() {      
      try {
        this.$store.commit('loading');
        const response = await this.$http.post('/login', this.loginInfo);
        
        const loginInfo = {};
        loginInfo.userName = response.data.userName;
        loginInfo.loginId = response.data.loginId;
        loginInfo.compCd = response.data.loginCompCd;
        loginInfo.loginDeptNm = response.data.loginDeptNm;
        loginInfo.loginDeptCd = response.data.loginDeptCd;
        loginInfo.loginDutCd = response.data.loginDutCd;
        loginInfo.loginDutNm = response.data.loginDutNm;
        loginInfo.loginJobCd = response.data.loginJobCd;
        loginInfo.loginJobNm = response.data.loginJobNm;
        loginInfo.token = response.data.token;
        loginInfo.menu = response.data.menu;
        loginInfo.authorities = response.data.authorities;
        loginInfo.loginPw = 'Not Use';
        loginInfo.color = response.data.attribute2

        if(!loginInfo.color){
          loginInfo.color = '/css/common.css'
        }
        
        this.$store.commit('login', loginInfo);
        this.$cookie.set('loginInfo', JSON.stringify(loginInfo));
        this.$http.defaults.headers['x-auth-token'] = loginInfo.token;

        //21.03.29 컬러테마
        var link = document.createElement('link');
        link.rel ='stylesheet';
        link.href = this.$store.state.loginInfo.color;
        document.head.appendChild(link);
    
        this.$store.commit('finish');
      } catch(err) {
        console.log(err)
        this.$store.commit('finish');
        this.loginFail();
      }
    },
    async ssoLogIn() {
      console.log("Now Loged in!!!!")
      try {
        this.$store.commit('loading');
        const response = await this.$http.post('/login', this.loginInfo);
        const loginInfo = {};
        loginInfo.userName = response.data.userName;
        loginInfo.loginId = response.data.loginId;
        loginInfo.compCd = response.data.loginCompCd;
        loginInfo.loginDeptNm = response.data.loginDeptNm;
        loginInfo.loginDeptCd = response.data.loginDeptCd;
        loginInfo.loginDutCd = response.data.loginDutCd;
        loginInfo.loginDutNm = response.data.loginDutNm;
        loginInfo.loginJobCd = response.data.loginJobCd;
        loginInfo.loginJobNm = response.data.loginJobNm;
        loginInfo.token = response.data.token;
        loginInfo.menu = response.data.menu;
        loginInfo.authorities = response.data.authorities;
        loginInfo.color = response.data.attribute2
        loginInfo.loginPw = 'Not Use';

        if(!loginInfo.color){
          loginInfo.color = '/css/common.css'
        }

        this.$store.commit('login', loginInfo);
        this.$cookie.set('loginInfo', JSON.stringify(loginInfo));
        this.$cookie.set('sessionAlive', true);
        this.$http.defaults.headers['x-auth-token'] = loginInfo.token;
        this.$store.commit('register', '');
        this.$router.push({path: '/'});
        
        //21.03.29 컬러테마
        var link = document.createElement('link');
        link.rel ='stylesheet';
        link.href = this.$store.state.loginInfo.color;
        document.head.appendChild(link);

        this.$store.commit('finish');
      } catch(err) {
        this.$store.commit('finish');
        this.loginFail();
      }
    }
  },
  created() {
    this.loginId = this.$route.query['loginId'];
    this.token = this.$route.query['token'];
    console.log("loginId : " + this.loginId);

    this.loginInfo.loginId = this.loginId;
    this.loginInfo.token = this.token;

    //모바일 iframe 메시지 수신을 통한 로그인 
    window.addEventListener('message', async event => {
      // console.log(event.data.id);
      if(event.origin === process.env.VUE_APP_MO_URL) {
        // console.log(`pc:event.origin : ${event.origin}`)
        if(event.data.message === 'isPcLogin') {

          const ret = this.$store.state.loginInfo !== null && this.$store.state.token !== '';
          window.parent.postMessage({ 
            message: 'pcLogin', 
            value: ret
          }, '*');
          console.log('pc:isPcLogin 수신 후 pcLogin' + ret + '보냄');

        } else if(event.data.message === 'login') {

          console.log('pc:login 하라는 메시지 받음');

          if(!this.$store.state.loginInfo) { //로그인 안되어있다면
            this.loginInfo.loginId = event.data.loginId;
            this.loginInfo.loginPw = event.data.loginPw;
            await this.login();        
            const ret = this.$store.state.loginInfo !== null && this.$store.state.token !== '';

            window.parent.postMessage({ 
              message: 'pcLogin', 
              value: ret
            }, '*');
            console.log('pc:현재 로그인 안되어있어서 로그인 시키고 pcLogin:' + ret + ' 메시지 보냄');

          } else {
            window.parent.postMessage({ 
              message: 'pcLogin', 
              value: true
            }, '*');
            console.log('pc:현재 로그인 되어있어서 pcLogin true 메시지 보냄');
          }
        }
      }
    })
  },
  beforeMount() {
    // 페이지 리로드를 위해 localStorage에 vuex 제거
    localStorage.removeItem('vuex');
    
    console.log("this.token : " + this.token);
    if(this.token) {
      console.log("Now redirect MainPage...")
      this.ssoLogIn();
    }
  },
  mounted() {
  }
};
</script>
<!-- 2020.08.31 'CapsLock'알림-->
<style scoped>
#text {display:none;color:black}

.ly_box {
  position:relative;
  margin-bottom: 10px;
  width:230px;
  height:30px;
  background:white;
  border-radius: 10px;
  text-align: center;
}
.ly_box:after {
 border-top:0px solid transparent;
 border-left: 10px solid transparent;
 border-right: 10px solid transparent;
 border-bottom: 10px solid white;
 content:"";
 position:absolute;
 top:-10px;
 left:100px;
} 
</style>

