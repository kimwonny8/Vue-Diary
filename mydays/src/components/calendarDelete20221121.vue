<!-- 20221121 삭제
이 파일은 calender.vue 파일로 대체합니다. 
bulma를 쓴 코드라 직접 CSS 하려고 전체적인 구조 변경을 위해 다시 작성합니다.
-->

<template>
  <section class="section">
    <div class="container">
      <h2 class="subtitle has-text-centered">
        <button
          @click="calendarData(-1)"
        >
          &lt;
        </button>
        {{ year }}년 {{ month }}월
        <button
          @click="calendarData(1)"
        >
          &gt;
        </button>
      </h2>
      <table style="width: 80%; margin: 0 auto;" class="table is-bordered has-text-centered">
        <!-- 요일 -->
        <thead>
          <th style="text-align: center;" v-for="day in days" :key="day">{{ day }}</th>
        </thead>
        
        <!-- day -->
        <tbody>
          <tr v-for="(date, idx) in dates" :key="idx">
            <td
              v-for="(day, secondIdx) in date"
              :key="secondIdx"
              :class="{
                'has-text-grey-light':
                  (idx === 0 && day >= lastMonthStart) ||
                  (dates.length - 1 === idx && nextMonthStart > day),
                'has-text-link':
                  day === today &&
                  month === currentMonth &&
                  year === currentYear
              }"
            >
              <div class="test" style="height: 15vh; width: 100%;" @click="addSchedule(day)">{{day}}
              <div style="color: blue; width: 100%;">{{schedule[year+""+month+""+day]}}</div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<script>
export default {
  data() {
    return {
      testM:null,
      testD:null,
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
      year: 0,
      month: 0,
      lastMonthStart: 0,
      nextMonthStart: 0,
      today: 0, 
      schedule: { },
    };
  },
  created() {
    // 데이터에 접근이 가능한 첫 번째 라이프 사이클
    const date = new Date();
    this.currentYear = date.getFullYear(); // 이하 현재 년, 월 가지고 있기
    this.currentMonth = date.getMonth() + 1;
    this.year = this.currentYear;
    this.month = this.currentMonth;
    this.today = date.getDate(); // 오늘 날짜
    this.calendarData();
    
    for(let i=0; i<31; i++){
      var d=this.year+""+this.month+""+i;

      if(localStorage.getItem(d)!==null){
        this.schedule[d]=localStorage.getItem(d);
      };
    }
  },
  computed:{
    totalDate(){
      var date=this.year+""+this.month;
      return date
    }
  },

  methods: {
    addSchedule(day){
      var text = prompt("입력하세용");
      var day = this.totalDate+""+day;
      localStorage.setItem(day,text);
    },
    calendarData(arg) {
      // 인자를 추가
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
            weekOfDays.push(prevDay);
            prevDay += 1;
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
          weekOfDays.push(k);
        }
      }
      if (weekOfDays.length > 0) dates.push(weekOfDays); // 남은 날짜 추가
      this.nextMonthStart = weekOfDays[0]; // 이번 달 마지막 주에서 제일 작은 날짜
      return dates;
    }
  }
};
</script>