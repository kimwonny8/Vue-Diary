<!-- 20221124, 20221128 작성 -->
<template>
    <div>
      <button @click="isIntroduce=true" class="submitBtn">제작</button>
      <button @click="isIntroduce=false" class="submitBtn">사용기능</button>
        <introduceCompo :obj="introduceList" :str="name" v-if="isIntroduce">
            <h1 slot="header">{{ header }}</h1>
            <div slot="content" slot-scope="introduceList">
                🔸 {{introduceList.idx.title}}
                : {{introduceList.idx.content}}
                <br/>
                <br/>
            </div>
        </introduceCompo>
        <component is="usedFunctionCompo" v-else></component>
        
        <br>
        <router-link to="/">뒤로</router-link>
        <br><br>
    </div>
</template>


<script>
const introduceCompo = {
  template: `
    <div> 
       <slot name="header"></slot><br>
       <div>🔸만든 사람 : {{str}} </div><br>
       <slot name="content" v-for="i in obj" :idx="i"></slot>
    </div>
    `,
  props: {
    obj:{
      type: Array,
      default:() => {
        return {title: '내용 없음'}
      }
    },
    str: {
      type: String,
      default: "이름 없음"
    }
    }
};

// 20221128 동적컴포넌트 추가
const usedFunctionCompo = {
  template: `
    <div>
      <h1>사용한 기능</h1>
      <br> 
      <div v-for="content in usedFunction">🔸{{content}}<br></div>
      
    </div>
    `,
    data() {
      return {
        usedFunction : [
          'life cycle', 'v-text', 'v-html', 'v-bind', 'v-on', 'v-show',
          'v-if / v-else', 'v-if / v-else / v-else-if',
          'v-model ⇒ .number / .trim / .lazy',
          'v-for ⇒ (key,value) / value', 'localStrorage', 
          'filters', 'computed', 'watch', 'methods', 'json 가져오기 ⇒ axios 사용',
          'component ⇒ 전역 / 지역 / 단일 파일 / 동적 / 비동기',
          'props / 속성검증', 'template', '$emit', 'slot ⇒ named-slot / slot-scope',
          'router / router-link / redirect'
      ]
      }
    }
};

export default {
  name: "introduce",
  components: {
    introduceCompo, usedFunctionCompo
  },
  data() {
    return {
      name :"김정원(2101059)",
      isIntroduce : true,
      header: "제작",
      introduceList: [
        { title: "제작 기간", content: "2022/11/20 ~ 2022/11/24" },
        { title: "소속", content: "영진전문대 컴퓨터정보계열" },
        { title: "github 주소", content: "https://github.com/kimwonny8" },
        { title: "blog 주소", content: "https://wonny.kim" },
        { title: "mail", content: "kimwonny8@gmail.com" },
        { title: "목표", content: "꾸준히 성장하는 사람이 되겠습니다!" },
      ]
    }
  },
  methods:{
    test() {
      isIntroduce=false;
      console.log(isIntroduce);
    }  
  }
};
</script>
