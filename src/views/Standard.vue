<template>
  <div class="standard">
    <p class="formula">{{formula}}</p>
    <input type="text" class="value" readonly
      v-model="inputFormatted"
      :style="fontSize">
    <div class="memory-tools">
      <button title="清空内存">MC</button>
      <button title="调用内存">MR</button>
      <button title="内存加 x">M+</button>
      <button title="内存减 x">M-</button>
      <button title="存入内存">MS</button>
      <button title="管理内存">M<i class="iconfont icon-xiala"></i></button>
    </div>
    <div class="keybord">
      <button class="percentage">%</button>
      <button class="grouping" @click="grouping">( )</button>
      <button class="clear" @click="clear">AC</button>
      <button class="backspace" @click="backspace"><i class="iconfont icon-backspace"></i></button>
      <button class="reciprocal"><sup>1</sup>/<em>x</em></button>
      <button class="square"><em>x</em><sup>2</sup></button>
      <button class="square-root"><sup>2</sup>&#8730;<em>x</em></button>
      <button class="divide">&#247;</button>
      <Numbers
        :mode="'standard'"
        @numbersClick="numbersClick"></Numbers>
      <button class="multiply">&#215;</button>
      <button
        class="subtract"
        data-key="-"
        @click="subtract">&#8722;</button>
      <button
        class="add"
        data-key='+'
        @click="add">&#43;</button>
      <button class="equal">&#61;</button>
    </div>
  </div>
</template>

<script>
import Numbers from '../components/Numbers.vue';

export default {
  name: 'Standard',
  components: {
    Numbers,
  },
  data() {
    return {
      input: '0',
      formula: '',
      mathParser: this.$math.parser(),
    };
  },
  computed: {
    inputFormatted: {
      get() {
        let formatted = (this.input.replace(/\s/g, '') || '0');
        // 如果没有用科学计数
        if (formatted.match(/e[+-]/ig) !== null) {
          let strArr = [];
          // 按小数点 . 分割
          strArr = formatted.split('.');
          // 整数部分转换为千分符
          strArr[0] = strArr[0].replace(/\B(?=(\d{3})+$)/g, ',');
          formatted = strArr.length === 1 ? `${strArr[0]}` : `${strArr[0]}.${strArr[1]}`;
        }
        return formatted;
      },
      set(unformatted) {
        let result = unformatted;
        // 去符号检测是否在范围内
        const checkValue = result.toString().replace(/\s|-|\+/g, '');
        if ((+checkValue) <= Number.MAX_SAFE_INTEGER) {
          try {
            /**
             * 符合范围，还原符号，转换为字符串保存
             * 第一个正则是合并整数部分正负符号后的连续的 0 (eg: '-00001.2' => '-01.2')
             * 第二个正则是将整数部分的非小数点和0前面的 0 去除 (eg: '-01.2' => '-1.2')
             */
            /* eslint-disable */
            result = result.toString()
              .replace(/(?<=^[+|-]?)(0+)/, '0')
              .replace(/(?<=^[+|-]?)[0|\s]*(?=[^0|\.])|\s/g, '');
            /* eslint-enable */
            if (result === '-0' || result === '+0') {
              result = '0';
            }
            this.input = result;
          } catch (e) {
            this.input = e.message;
          }
        } else {
          this.input = 'RANGE ERROR: MAX_SAFE_INTEGER';
        }
      },
    },
    fontSize() {
      let init = 48;
      const len = this.inputFormatted.toString().length;
      if (len > 10) {
        init = (init * 10) / len;
      }
      return {
        fontSize: `${init}px`,
      };
    },
  },
  methods: {
    numbersClick(key) {
      // 取相反数，正负转换
      if (key === '-') {
        if (this.input.match(/^-\d+/) !== null) {
          this.inputFormatted = this.input.slice(1);
        } else {
          this.inputFormatted = key + this.input;
        }
      } else if (key === '.') {
        // 只能有 1 个小数点
        if (this.input.indexOf(key) === -1) {
          this.inputFormatted = this.input + key;
        }
      } else {
        // 输入数字，最多只能有 16 个数字（不管符号）
        const numbers = this.input.match(/(\d)/g);
        if (numbers && numbers.length < 16) {
          this.inputFormatted = this.input + key;
        }
      }
    },
    grouping() {
      // eslint-disable-next-line
      const match = this.formula.match(/(\(|\))(?=[^\(\)]*$)/gm);
      const lastKey = match ? match[0] : '';
      let currKey = '(';
      if (lastKey === '(') {
        currKey = ')';
      }
      if (lastKey === ')') {
        currKey = '(';
      }
      this.formula += currKey;
    },
    clear() {
      this.input = '0';
      this.formula = '';
    },
    backspace() {
      const temp = (this.input.slice(0, -1) || '0');
      this.input = temp === '-0' ? '0' : temp;
    },
    add() {
      if (this.formula === '') {
        this.formula = this.input;
      }
      if (this.formula.match(/\+\s*$/) === null) {
        this.formula = `${this.formula} + `;
      }
    },
    subtract() {
      if (this.formula === '') {
        this.formula = this.input;
      }
      if (this.formula.match(/-\s*$/) === null) {
        this.formula = `${this.formula} - `;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../assets/css/index.scss';

.standard {
  height: 100%;
  display: grid;
  grid-template-rows: 30px 90px 1fr 9fr;
  @include font;
  text-align: right;
  .formula {
    margin: 0;
    padding: 0 16px;
    height: 30px;
    line-height: 30px;
    color: $font-light-color;
    white-space: nowrap;
    overflow: hidden;
  }
  .value {
    display: block;
    box-sizing: border-box;
    outline: none;
    border: none;
    padding: 8px 16px;
    width: 100%;
    height: 90px;
    line-height: 90px;
    text-align: right;
    white-space: nowrap;
    background: inherit;
  }
  .memory-tools {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    grid-template-rows: 1fr;
    gap: 2px;
    font-size: 8px;
    button {
      border: 1px solid transparent;
      &:hover {
        border-color: whitesmoke;
        background: $hover-color;
      }
    }
  }
  .keybord {
    display: grid;
    grid-template-columns: repeat(4,1fr);
    grid-template-rows: repeat(6,1fr);
    gap: 2px;
    button {
      border: 1px solid transparent;
      font-weight: bold;
      background: $btn-color;
      &:hover {
        border-color: whitesmoke;
        background: $hover-color;
      }
    }
    .numbers {
      grid-area: 3 / 1 / 7 / 4;
    }
    .equal {
      background: $active-color;
      &:hover {
        background: darken($color: $active-color, $amount: 10);
      }
    }
  }
}
</style>
