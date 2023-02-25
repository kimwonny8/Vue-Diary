<template>
  <div class="diaryBox">
    <!-- 날짜 -->
    <div>{{ date | dayDivision }}</div>
    <!-- 20221123 아래 작성, 20221205 json 가져와서 쓰는 부분 수정 중 -->
    <div class="diaryFaceSelect">
      <p v-html="face"></p>
      <br />
      <div v-if="!showContent">
        <button class="imgBtn faceBtn" @click="storeface(faceType[0])">
          <h1>😀</h1>
        </button>
        <button class="imgBtn faceBtn" @click="storeface(faceType[1])">
          <h1>😊</h1>
        </button>
        <button class="imgBtn faceBtn" @click="storeface(faceType[2])">
          <h1>😐</h1>
        </button>
        <button class="imgBtn faceBtn" @click="storeface(faceType[3])">
          <h1>😥</h1>
        </button>
        <button class="imgBtn faceBtn" @click="storeface(faceType[4])">
          <h1>😠</h1>
        </button>
      </div>
      <div v-else></div>
    </div>
    <!-- 일기 내용 없을 때 -->
    <div v-if="!showContent">
      <input
        type="text"
        class="diaryContent"
        v-model.lazy="diaryContent"
        placeholder="일기 내용"
      />
      <br />
      <button class="writeDiaryBtn" @click="storeDiary">기록하기</button>
    </div>
    <!-- 일기 내용 있을 때 -->
    <div class="diaryContents" v-else>
      <p class="diaryContentUnderline">{{ diaryContent }}</p>
      <button class="writeDiaryBtn" @click="showContent = !showContent">
        수정
      </button>
      <button class="writeDiaryBtn" @click="deleteDiary">삭제</button>
    </div>
  </div>
</template>
<script>
export default {
  name: "diary",
  props: {
    d: String
  },
  data() {
    return {
      date: this.d,
      year: 0,
      month: 0,
      day: 0,
      selectFace: "?",
      selectFaceText: `<b>오늘의 기분은</b>`,
      faceType: ["행복해요", "좋아요", "그냥그래요", "슬퍼요", "화나요"],
      diaryContent: null,
      showContent: false,
      // 20221123 diary 내용 가져오기
      diaryList: []
    };
  },
  async created() {
    // 날짜 저장
    let arr = this.date.split("/");
    this.year = arr[0];
    this.month = arr[1];
    this.day = arr[2];
    // json에 있는 일기 가져오기 => 배열객체로 담아서 수정가능하게 하기 20221205
    // 가지고 오는 속도 느리므로 async - await 사용
    await axios.get("/static/db.json").then(res => {
      this.diaryList = res.data.diary;
      this.diaryList = Object.entries(this.diaryList);
    });
    this.chkDiary();
  },
  // 초기 실행시 기존 값 있으면 가져오기
  mounted() {
    var tmp = this.date + "F";
    if (localStorage.getItem(tmp) !== null) {
      this.selectFace = localStorage.getItem(tmp);
    }
    var tmp = this.date + "D";
    if (localStorage.getItem(tmp) !== null) {
      this.diaryContent = localStorage.getItem(tmp);
      this.showContent = true;
    }
  },
  computed: {
    totalDate() {
      var date = this.year + "/" + this.month + "/" + this.day;
      return date;
    },
    face() {
      return this.selectFaceText + " " + this.selectFace;
    }
  },
  filters: {
    dayDivision(date) {
      let arr = date.split("/");
      return `${arr[0]}년 ${arr[1]}월 ${arr[2]}일`;
    }
  },
  methods: {
    // 20221205
    chkDiary() {
      var tmp = this.totalDate;
      for (let i = 0; i < this.diaryList.length; i++) {
        if (this.diaryList[i][0] === tmp) {
          this.showContent = true;
          this.selectFace = this.diaryList[i][1].face;
          this.diaryContent = this.diaryList[i][1].content;
        }
      }
    },

    storeface(arg) {
      var tmp = this.date + "F";
      localStorage.setItem(tmp, arg);
      this.selectFace = arg;
    },
    storeDiary() {
      var tmp = this.date + "D";
      localStorage.setItem(tmp, this.diaryContent);
      alert("하루가 기록되었습니다😊");

      // 입력 값 저장
      let chk = false;
      for (let i = 0; i < this.diaryList.length; i++) {
        if (this.diaryList[i] === this.totalDate) {
          chk = true;
          this.diaryList[i] = this.addScheduleValue;
        }
      }
      console.log(chk);
      // chk false면 diaryContent 배열에 없는 것이므로 추가
      if (chk === false) {
        this.diaryList.push([tmp, { content: this.diaryContent }]);
      }
      this.$router.go();
    },
    deleteDiary() {
      var tmp = this.date + "D";
      var tmp2 = this.date + "F";

      var deleteChk = confirm("정말 삭제하실건가요?");
      if (deleteChk === true) {
        localStorage.removeItem(tmp);
        localStorage.removeItem(tmp2);

        // 리스트에서 삭제
        for (let i = 0; i < this.diaryList.length; i++) {
          if (this.diaryList[i][0] === this.totalDate) {
            this.diaryList.splice(i, 1);
            this.showContent = false;
            this.selectFace = "?";
            this.diaryContent = null;
          }
        }
        alert("삭제되었습니다.");
        this.$router.go();
      }
    }
  },
  watch: {
    diaryContent(newVal, oldVal) {
      console.log("일기 변경 전: " + oldVal);
      console.log("일기 변경 후: " + newVal);
    }
  },
  beforeUpdate() {
    console.log(`데이터가 변경되었습니다.`);
  }
};
</script>

<style>
* {
  margin: 0 auto;
}

.diaryBox {
  width: 50%;
  height: 40vh;
  padding-top: 4vh;
  border: 0.01rem solid gray;
}
.diaryFaceSelect {
  margin: 3vh 0;
}
.diaryContent {
  margin: 2vh 0;
  border: none;
  width: 25vw;
  height: 5vh;
  text-align: center;
  border-bottom: 0.01rem solid gray;
  font-size: 1rem;
  font-family: "KyoboHand", "Avenir", Helvetica, Arial, sans-serif;
}

.faceBtn {
  width: 4vw;
}

.writeDiaryBtn {
  font-size: 1rem;
  font-family: "KyoboHand", "Avenir", Helvetica, Arial, sans-serif;
  width: 5vw;
  height: 5vh;
  border: none;
  background-color: rgb(226, 226, 226);
  border-radius: 10px;
}
.writeDiaryBtn:hover {
  border: 0.01rem solid gray;
  background-color: white;
}
.diaryContents {
  width: 85%;
}
.diaryContentUnderline {
  text-decoration: underline;
  text-underline-position: under;
  margin-bottom: 8vh;
}
</style>
