<!-- 20221119 로그인/회원가입 페이지 작성 -->
<template>
  <!-- 로그인 폼 -->
  <div v-if="!goSignUp" class="loginForm">
    <div class="loginInput">
      <p>아이디:</p>
      <input type="text" class="input" v-model.trim="id" />
    </div>
    <div class="loginInput">
      <p>비밀번호:</p>
      <input type="password" class="input" v-model.trim="pw" />
    </div>
    <div>
      <button @click="login" class="submitBtn">로그인</button>
      <button @click="goSignUp = !goSignUp" class="submitBtn">회원가입</button>
    </div>
    <router-link to="/aboutJW">제작소개</router-link>
  </div>

  <!-- 회원가입폼 -->
  <div v-else class="signUpForm">
    <p
      style="font-size: larger; background-color: yellow;"
      v-text="welcomeMsg"
    ></p>
    <signupCompo></signupCompo>
  </div>
</template>

<script>
import signup from "./signup.vue";

const signupCompo = function(resolve, reject) {
  setTimeout(function() {
    resolve(signup);
  }, 1000);
};

export default {
  name: "Home",
  data() {
    return {
      id: "",
      pw: "",
      name: "",
      goSignUp: false,
      welcomeMsg: "나의 나날들에 오신 것을 환영합니다!"
    };
  },
  components: {
    signupCompo
  },
  methods: {
    login() {
      // 로그인 함수 => 로컬스토리지에 저장된 id, pw와 비교
      if (
        this.id == localStorage.getItem("id") &&
        this.pw == localStorage.getItem("pw")
      ) {
        this.name = localStorage.getItem("name");
        alert("로그인 성공!");
        this.$emit("name", this.name);
        this.$router.push("/calendar");
      } else {
        alert("아이디 비밀번호 확인 후 다시 시도해주세요.");
      }
    }
  }
};
</script>

<style>
* {
  margin: 0 auto;
}

.loginForm {
  margin-top: 3vh;
  padding: 3vh;
  border: 0.01rem solid grey;
  width: 30vw;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.loginInput {
  width: 20vw;
  padding: 2vh;
  display: flex;
  flex-direction: row;
  font-size: large;
}

.loginInput > p {
  width: 50%;
}

.input {
  height: 3vh;
  width: 20vw;
  border: none;
  border-bottom: 0.01rem solid gray;
}
.submitBtn {
  font-family: "KyoboHand";
  font-size: large;
  margin: 3vh 1vh;
  width: 10vw;
  height: 4vh;
  border: none;
  background-color: rgb(226, 226, 226);
  border-radius: 10px;
}
.submitBtn:hover {
  border: 0.01rem solid gray;
  background-color: white;
}
</style>
