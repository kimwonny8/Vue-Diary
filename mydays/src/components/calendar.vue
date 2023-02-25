<!-- 20221121 calender 작성 -->
<!-- 20221124 대부분 완료 => 지난 달 날짜 지우기! -->
<!-- 20221128 json 내용 초기에 1번 담고 수정, 삭제도 가능하게 하기 -->
<template>
  <div>
    <router-link to="/">로그인 페이지로</router-link>
    <!-- 상단 메뉴부분  -->
    <div class="menu">
      <!-- 현재 년, 달 적혀있는 div -->
      <div v-if="scheduleOrDiary != 'diary'" class="currentYM">
    
          <button class="currentYMBtn" @click="calendarData(-1)">◀</button>
          {{ year }}년 {{ month }}월
          <button class="currentYMBtn" @click="calendarData(1)">▶️</button>
          <welcomeMember>
            <div slot="name">
              <p v-if="name===null">비회원입니다.</p>
              <p v-else>{{ name }}님 환영합니다!</p>
            </div>
          </welcomeMember>
      </div>

      <!-- 일정추가, 일기추가선택  -->
      <div v-show="dayBtn" class="addEventBox">
        <p slot="select">현재 선택한 날짜는 {{ totalDate + "" + selectDay }} 입니다.</p>

        <!-- 일정관리 선택했을 때 추가/수정 20221124-->
        <div v-if="scheduleOrDiary === 'schedule'">

          <!-- 일정 내용 없을 때 -->
          <div v-if="!showScheduleContent || scheduleContent == null">
            <input type="text" v-model="addScheduleValue" class="inputBox" />
            <button @click="addSchedule" class="imgBtn">
              <img src="../assets/checkButton.png" />
            </button>
            <button class="imgBtn" @click="scheduleOrDiary = null">
              <img src="../assets/cancelButton.png" />
            </button>
          </div>
          <!-- 일정 내용 있을 때 -->
          <div v-else>
            <p class="diaryContentUnderline">{{ scheduleContent }}
            <button @click="adjustSchedule" class="imgBtn">
              <img src="../assets/checkButton.png" />
            </button>
            <button class="imgBtn" @click="deleteSchedule">
              <img src="../assets/deleteButton.png" />
            </button></p>
          </div>
        </div>
        <!-- 일기쓰기 선택했을 때 -->
        <div v-else-if="scheduleOrDiary === 'diary'"></div>
        
        <!-- 일정 관리 선택했을 때 -->
        <div v-else>
          <button @click="chkScheduleContent" class="addBtn addSchedule">
          일정관리
        </button>
        <button @click="clickDiaryBtn" class="addBtn writeDiary">
          일기관리
        </button>
        </div>
      </div>
    </div>

    <!-- 달력부분 -->
    <table v-if="scheduleOrDiary !== 'diary'" class="calender">
      <!-- 요일 day -->
      <thead>
        <th v-for="day in days" :key="day">{{ day }}</th>
      </thead>

      <!-- 하루 date -->
      <tbody>
        <tr v-for="(date, idx) in dates" :key="idx">
          <!-- 오늘날짜에 파란색 -->
          <td
            v-for="(day, secondIdx) in date"
            :key="secondIdx"
            :class="{
              colorWhite:
                (idx === 0 && day >= lastMonthStart) ||
                (dates.length - 1 === idx && nextMonthStart > day),
              colorBlue:
                day === today && month === currentMonth && year === currentYear
            }"
          >
            <div class="oneDay" @click="select(day)">{{ day }}
            <div style="background-color: #F9DD7C; margin-bottom: 0.5vw;" v-if="chkSchedule(day)">일정 있음</div>
            <div style="background-color: #D3E3F5;" v-if="chkDiary(day)">일기 있음</div>
          </div>
          </td>
        </tr>
      </tbody>
    </table>
    <!-- 일기장부분 -->
    <diary v-else :d="totalDate + selectDay"></diary>
    <br>
  </div>
</template>

<script>
// 20221124 삭제
const thereisDiary = {
  template: `<div>
    <div v-if="checkDiary()">O</div>
    <div v-else>X</div>
    </div>`,
  props: {
    day: Number,
    totalDate: String,
    diaryList: Object
  },
  data() {
    return {
      diaryList2: this.diaryList
    };
  },
  methods: {
    checkDiary() {
      console.log(this.diaryList2);
      console.log("길이" + Object.keys(this.diaryList2).length);
      for (let i = 0; i < this.diaryList2.length; i++) {
        const tmp = this.totalDate + this.day;
        // key값 확인?
        if (this.diaryList2.hasOwnProperty(tmp)) {
          return true;
        } else {
          return false;
        }
      }
    }
  }
};


const welcomeMember = {
  template: `<div>
        <slot name="name"></slot>
  </div>`
};
import diary from "./diary.vue";
import home from "./home.vue";

export default {
  name: "calendar",
  data() {
    return {
      days: [
        "일요일",
        "월요일",
        "화요일",
        "수요일",
        "목요일",
        "금요일",
        "토요일"
      ],
      dates: [],
      currentYear: 0,
      currentMonth: 0,
      lastMonthStart: 0,
      nextMonthStart: 0,
      year: 0,
      month: 0,
      today: 0,

      dayBtn: false, // 날짜 버튼
      scheduleOrDiary: null,
      addScheduleValue: null,
      selectDay: 0,
      name: null,

      // 스케줄
      showScheduleContent: false,
      scheduleList: [],
      scheduleContent: null,
      diaryList: [],
    };
  },
  created() {
    const date = new Date();
    this.currentYear = date.getFullYear(); // 이하 현재 년, 월 가지고 있기
    this.currentMonth = date.getMonth() + 1;
    this.year = this.currentYear;
    this.month = this.currentMonth;
    this.today = date.getDate(); // 오늘 날짜
    this.calendarData();

    // json에 있는 스케줄 가져오기 => 배열객체로 담아서 수정가능하게 하기 20221128
    axios.get("/static/db2.json").then(res => {
        this.scheduleList = res.data.schedule;
        this.scheduleList = Object.entries(this.scheduleList); 
    });
    
    // json에 있는 일기 가져오기 => 배열객체로 담아서 수정가능하게 하기 20221205
    axios.get("/static/db.json").then(res => {
      this.diaryList = res.data.diary;
      this.diaryList = Object.entries(this.diaryList);
    });

    this.name = localStorage.getItem("name");  
  },
  components: {
    diary,
    home,
    welcomeMember
    //thereisDiary
  },
  computed: {
    totalDate() {
      var date = this.year + "/" + this.month + "/";
      return date;
    }
  },
  methods: {
    // 일기 관리 클릭시
    clickDiaryBtn() {
      this.scheduleOrDiary = "diary";
      this.dayBtn = !!!this.dayBtn;
    },

    // 20221128 일정 있는 지 확인 
    chkSchedule(day){
      var tmp = this.totalDate + day;
      
      for(let i=0; i<this.scheduleList.length; i++){
          if(this.scheduleList[i][0] === tmp){
              return true;
          }
      }
      return false;
    }, 

     // 20221205 일기 있는 지 확인 
     chkDiary(day){
      var tmp = this.totalDate + day;
      
      for(let i=0; i<this.diaryList.length; i++){
          if(this.diaryList[i][0] === tmp){
              return true;
          }
      }
      return false;
    }, 
    
    // 20221128 일정 있을 때 내용 띄우기
    chkScheduleContent(){
      this.scheduleOrDiary = 'schedule'

      var tmp = this.totalDate + this.selectDay;
      for(let i=0; i<this.scheduleList.length; i++){
          if(this.scheduleList[i][0] === tmp){
              this.showScheduleContent = true;
              this.scheduleContent=this.scheduleList[i][1].content;
          }
      }
    },

    // 일정 수정
    adjustSchedule() {
      this.showScheduleContent = false;
      this.addScheduleValue = this.scheduleContent;
    },

    // 일정 추가 내용 입력 후 체크 버튼 => 리스트에 담기 20221128
    addSchedule() {
      if (this.addScheduleValue !== null) {
        var tmp = this.totalDate + this.selectDay;
        localStorage.setItem(tmp, this.addScheduleValue);

        // 입력 값 수정/저장
        let chk=false;
        for(let i=0; i<this.scheduleList.length; i++){
            if(this.scheduleList[i] === tmp){
              chk=true;
              this.scheduleList[i] = this.addScheduleValue;
            }
        }
        console.log(chk);
        // chk false면 scheduleList 배열에 없는 것이므로 추가
        if(chk===false){
          this.scheduleList.push([tmp, {"content":this.addScheduleValue}]);
        }
        this.dates = this.dates;

        console.log(this.scheduleList);

        this.addScheduleValue = null;
        this.scheduleOrDiary = null;
        alert("일정이 추가되었습니다!");
      } else if (
        this.addScheduleValue === null ||
        this.addScheduleValue === ""
      ) {
        alert("일정을 입력해주세요.");
      }
    },

    // 내용 있을 때 일정 삭제함수 20221128
    deleteSchedule(){
      this.scheduleOrDiary = null;
      var tmp = this.totalDate + this.selectDay;

      // 리스트에서 삭제
      for(let i=0; i<this.scheduleList.length; i++){
            if(this.scheduleList[i][0] === tmp){
              this.scheduleList.splice(i,1);
              this.scheduleContent=null;
              console.log(this.scheduleList);
        }
      }
    },

    // 선택한 날 가져와서 저장 + 일정 관리 설정 초기화
    select(day) {
      this.dayBtn = false;
      if(day !== "") {
        this.scheduleOrDiary = null;
        this.scheduleContent = null;
        this.addScheduleValue = null;
        this.dayBtn = true;
        this.selectDay = day;
        localStorage.setItem("selectDay", day);
      }
    },

    // 달력 찍기
    calendarData(arg) {
      if (arg < 0) {
        // -1이 들어오면 지난 달 달력으로 이동
        this.month -= 1;
      } else if (arg === 1) {
        // 1이 들어오면 다음 달 달력으로 이동
        this.month += 1;
      }

      if (this.month === 0) {
        // 작년 12월
        this.year -= 1;
        this.month = 12;
      } else if (this.month > 12) {
        // 내년 1월
        this.year += 1;
        this.month = 1;
      }
      console.log(this.year + " " + this.month);

      const [
        monthFirstDay,
        monthLastDate,
        lastMonthLastDate
      ] = this.getFirstDayLastDate(this.year, this.month);
      this.dates = this.getMonthOfDays(
        monthFirstDay,
        monthLastDate,
        lastMonthLastDate
      );
    },
    getFirstDayLastDate(year, month) {
      const firstDay = new Date(year, month - 1, 1).getDay(); // 이번 달 시작 요일
      const lastDate = new Date(year, month, 0).getDate(); // 이번 달 마지막 날짜
      let lastYear = year;
      let lastMonth = month - 1;
      if (month === 1) {
        lastMonth = 12;
        lastYear -= 1;
      }
      const prevLastDate = new Date(lastYear, lastMonth, 0).getDate(); // 지난 달 마지막 날짜
      return [firstDay, lastDate, prevLastDate];
    },
    getMonthOfDays(monthFirstDay, monthLastDate, prevMonthLastDate) {
      let day = 1;
      let prevDay = prevMonthLastDate - monthFirstDay + 1;
      const dates = [];
      let weekOfDays = [];
      while (day <= monthLastDate) {
        if (day === 1) {
          // 1일이 어느 요일인지에 따라 테이블에 그리기 위한 지난 셀의 날짜들을 구할 필요가 있다.
          for (let j = 0; j < monthFirstDay; j += 1) {
            if (j === 0) this.lastMonthStart = prevDay; // 지난 달에서 제일 작은 날짜
            weekOfDays.push("");
          }
        }
        weekOfDays.push(day);
        if (weekOfDays.length === 7) {
          // 일주일 채우면
          dates.push(weekOfDays);
          weekOfDays = []; // 초기화
        }
        day += 1;
      }
      const len = weekOfDays.length;
      if (len > 0 && len < 7) {
        for (let k = 1; k <= 7 - len; k += 1) {
          weekOfDays.push("");
        }
      }
      if (weekOfDays.length > 0) dates.push(weekOfDays); // 남은 날짜 추가
      this.nextMonthStart = weekOfDays[0]; // 이번 달 마지막 주에서 제일 작은 날짜
      return dates;
    }
  }
};
</script>

<style>
* {
  margin: 0 auto;
  --bodyWidth: 65%;
}
.menu {
  display: flex;
  height: 13vh;
  width: var(--bodyWidth);
  justify-content: space-between;
}
.currentYM {
  padding: 2vh 0;
  margin-left: 3vw;
}
.addEventBox {
  padding: 2vh 0;
  margin-right: 3vw;
}
.currentYMBtn {
  border: none;
  background-color: white;
}
.currentYMBtn:hover {
  color: rgb(255, 106, 0);
}

.calender {
  width: var(--bodyWidth);
  border: 0.01rem solid gray;
  border-collapse: collapse;
}
th {
  background-color: rgb(202, 202, 202);
  border: 0.01rem solid gray;
}

td {
  border: 0.01rem solid gray;
}
.colorWhite {
  color: white;
}
.colorBlue {
  color: blue;
}
.oneDay {
  height: 12vh;
  width: 8vw;
}

.addBtn {
  font-family: "KyoboHand", "Avenir", Helvetica, Arial, sans-serif;
  width: 10vw;
  height: 5vh;
  font-size: larger;
  border: none;
  background-color: rgb(226, 226, 226);
  border-radius: 10px;
}
.addBtn:hover {
  border: 0.01rem solid gray;
  background-color: white;
}
.imgBtn {
  border: none;
  background-color: white;
  width: 4vh;
  height: auto;
}
.imgBtn:hover {
  opacity: 0.7;
}

.imgBtn > img {
  height: 3vh;
  object-fit: contain;
}
.inputBox{
  text-align: center;
  font-family: "KyoboHand", "Avenir", Helvetica, Arial, sans-serif;
  border: none;
  border-bottom: 0.01rem solid gray;
  width: 10vw;
  font-size: large;
  height: 5vh;
}

.inputBox:focus{
  background-color: rgb(226, 226, 226);
}

.thereIs {
  background-color: rgb(255, 255, 162);
}
</style>
