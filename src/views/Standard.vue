<template>
  <div class="standard">
    <p class="formula">{{formula}}</p>
    <input type="text" class="input" readonly
      v-model="inputFormatted"
      :style="inputStyle">
    <div class="memory-tools">
      <button title="清空内存">MC</button>
      <button title="调用内存">MR</button>
      <button title="内存加 x">M+</button>
      <button title="内存减 x">M-</button>
      <button title="存入内存">MS</button>
      <button title="管理内存">M<i class="iconfont icon-xiala"></i></button>
    </div>
    <div class="keybord">
      <Numbers
        :mode="'standard'"
        @numbersClick="numbersClick"></Numbers>
      <button class="reciprocal" @click="functionalClick"><sup>1</sup>/<em>x</em></button>
      <button class="percentage" @click="functionalClick">%</button>
      <button class="clear" @click="clear">AC</button>
      <button class="backspace" @click="backspace"><i class="iconfont icon-backspace"></i></button>
      <button class="square" @click="functionalClick"><em>x</em><sup>2</sup></button>
      <button class="sqrt" @click="functionalClick"><sup>2</sup>&#8730;<em>x</em></button>
      <button class="grouping" @click="grouping">( )</button>
      <button
        class="divide"
        @click="operatorsClick('/')">&#247;</button>
      <button
        class="multiply"
        @click="operatorsClick('*')">&#215;</button>
      <button
        class="subtract"
        @click="operatorsClick('-')">&#8722;</button>
      <button
        class="add"
        @click="operatorsClick('+')">&#43;</button>
      <button
        class="compute"
        @click="operatorsClick('=')">&#61;</button>
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
      // 输入，输出
      input: '0',
      // 最后一个操作项
      lastItem: '',
      // 公式
      formula: '',
      // 状态 inputting, waiting, calculated, error
      status: 'inputting',
    };
  },
  computed: {
    // 输入与输出的格式调整与校验
    inputFormatted: {
      // 输出格式调整
      get() {
        let formatted = (this.input.replace(/\s/g, '') || '0');
        // 如果没有用科学计数
        if (formatted.match(/e[+-]/ig) === null) {
          let strArr = [];
          // 按小数点 . 分割
          strArr = formatted.split('.');
          // 整数部分转换为千分符
          strArr[0] = strArr[0].replace(/\B(?=(\d{3})+$)/g, ',');
          formatted = strArr.length === 1 ? `${strArr[0]}` : `${strArr[0]}.${strArr[1]}`;
        }
        return formatted;
      },
      // 输入内容校验
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
            // +0 or -0 直接为 0
            /* eslint-enable */
            if (result === '-0' || result === '+0') {
              result = '0';
            }
            this.input = result;
            this.status = 'inputting';
          } catch (e) {
            console.error(e.message);
            this.status = 'error';
            this.input = e.message;
          }
        } else {
          console.error('ERROR: RANGE ERROR: MAX_SAFE_INTEGER');
          this.status = 'error';
          this.input = 'RANGE ERROR: MAX_SAFE_INTEGER';
        }
      },
    },
    // input 的样式
    inputStyle() {
      let fontSize = 48;
      let color = '';
      const len = this.inputFormatted.toString().length;
      // 超过 10 位数字时调整 input 的 font-size ，不能产生滚动/隐藏
      if (len > 10) {
        fontSize = (fontSize * 10) / len;
      }
      switch (this.status) {
        case 'waiting':
          color = 'gray'; break;
        case 'calculated':
          color = 'limegreen'; break;
        case 'error':
          color = 'red'; break;
        default:
          color = ''; break;
      }
      return {
        fontSize: `${fontSize}px`,
        color,
      };
    },
  },
  methods: {
    // 数字键 123456879 -/+ .
    numbersClick(key) {
      if (this.status === 'waiting' || this.status === 'error') {
        // 当前状态是等待下一轮数字输入，输入新数字前，重置上次输入的内容，但保留公式
        this.input = '0';
      }
      if (this.status === 'calculated' && key !== '-') {
        // 当前状态是已经计算完成，此时输入新数字（非正负号），表示开启新一轮计算，重置所有状态数据
        this.clear();
      }
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
      // 只要开始数字输入，且校验合法通过，就表示当前状态是正在输入数字
      if (this.status !== 'error') {
        this.status = 'inputting';
      }
    },
    // 函数快捷键 1/x % ...
    functionalClick(event) {
      const elem = (event.target || event.srcElement);
      if (elem && elem.className) {
        // 上次操作状态是错误，先重置，返回
        if (this.status === 'error') {
          this.clear();
          return;
        }
        // 函数作用对象判断
        let temp;
        /* eslint-disable */
        if (this.status === 'calculated') {
          // 当是已经计算状态，函数作用于整个公式；
          temp = this.formula.replace(/(\=|\s)*$/gm, '');
        } else if (this.status!=='inputting' && this.lastItem) {
          // 当不是正在输入，且有上一项输入内容时，作用于上一项输入
          temp = this.lastItem.replace(/(\.|\s)*$/g, '');
        } else {
          // 其他情况作用于当前输入，并将当前输入自动记录为上一项输入
          temp = this.input.replace(/(\.|\s)*$/g, '');
          this.lastItem = temp;
        }
        // 没有获取到函数操作对象直接返回
        if (!temp.length) {
          return;
        }
        // 函数功能判断
        const { className } = elem;
        /* eslint-enable */
        if (className === 'reciprocal') {
          // 倒数
          temp = `1/(${temp})`;
        } else if (className === 'percentage') {
          // 百分数
          temp = `(${temp})/100`;
        } else if (className === 'square') {
          // 平方
          temp = `square(${temp})`;
        } else if (className === 'sqrt') {
          // 平方根
          temp = `sqrt(${temp})`;
        }
        // 公式调整拼凑函数功能
        if (this.status === 'calculated' || (!this.formula.length)) {
          this.formula = `${temp}`;
        } else {
          // 将上一次的项目替换为函数包裹的项目
          // eslint-disable-next-line
          // 先替换为空，因为可能上一次的项目是本次从正在输入中自动设置的，公式中还没设置
          this.formula = this.formula.replace(this.lastItem, '');
          // 再替换为函数包裹项
          this.formula += temp;
        }
        // 公式修改完成，自动记录到上一次修改项，并更新状态
        this.lastItem = temp;
        this.status = 'waiting';
        try {
          // 自动计算函数公式
          this.input = this.$math.parse(this.formula).evaluate().toString();
        } catch (e) {
          console.error(e.message);
          this.status = 'error';
          this.input = e.message;
        }
      }
    },
    // 操作按键 + - * / =
    operatorsClick(key) {
      // 上次操作状态出错，先重置，再返回
      if (this.status === 'error') {
        this.clear();
        return;
      }
      // 普通的运算符号 + - * / =
      if (this.status === 'waiting') {
        // 如果当前状态是等待新数字的输入
        const lastChar = this.formula.match(/(\S)(?:\s*)$/);
        // eslint-disable-next-line
        if (lastChar && /[\+\-\*\/]/.test(lastChar[0])) {
          // 如果公式末尾是一个操作符，用新操作符替换，状态不变仍然是等待新数字输入
          this.formula = this.formula.replace(/(\S)(?:\s*)$/, key);
        } else {
          // ( TODO: the formula maybe cant compute even throw Error )
          // 否则可能是用 backspace 删除，导致出现的其他内容，尝试直接在末尾添加操作符，可能导致公式不正确无法计算
          this.formula += `${key}`;
        }
      } else {
        /**
         * 否则不是 waiting ，就是 inputting  或 calculated
         * inputting 正在输入数字，直接新增操作符前，要将当前输入的内容先作为上一轮输入添加到公式中，再增加操作符
         * calculated 则表示将上一轮结果拿来开启新一轮计算
         */
        if (this.status === 'calculated' || this.formula.indexOf('=') > -1) {
          // 开启新一轮计算前，清除上次的公式
          this.formula = '';
        }
        this.formula += `${this.input}${key}`;
        // 记录当前输入
        this.lastItem = this.input;
        // 并更新状态为等待新一轮输入
        this.status = 'waiting';
      }
      // 最后修改完公式后，如果是 = 按钮，则调用求值函数进行求值
      if (key === '=') {
        this.$options.methods.calculating.bind(this)();
      }
    },
    // 分组键 ()
    grouping() {
      // 当前状态是已经计算完成或出错，输入括号，表示开启新一轮计算，先重置
      if (this.status === 'error' || this.status === 'calculated') {
        this.clear();
      }
      // 匹配最后一个括号
      // eslint-disable-next-line
      const match = this.formula.match(/(\(|\))(?=[^\(\)]*$)/);
      let currKey = '(';
      if (match && match.index >= 0) {
        // 如果前面已经输入过括号，取最后一个括号与最后一个字符，作为判断依据
        const lastChar = this.formula.match(/(\S)(?:\s*)$/);
        // eslint-disable-next-line
        if (lastChar && /[\+\-\*\/]/.test(lastChar[0]) && this.status !== 'inputting') {
          // 除正在输入的状态外，如果公式末尾是一个操作符，必定接 ( 左括号
          currKey = '(';
        } else {
          // 如果是正在输入或末尾不是操作符，那么这个括号方向由前一个括号和 input 状态决定
          const lastKey = match[0];
          // 不是连续输入括号，就取相反的 (((x)
          if ((match.index !== (this.formula.length - 1))
            || (lastKey !== this.formula.slice(-1))
            || (this.status === 'inputting' && this.input !== '0')) {
            if (lastKey === '(') {
              currKey = ')';
            }
            if (lastKey === ')') {
              currKey = '(';
            }
          } else {
            // 连续输入括号，直接输入相同的 ((((
            currKey = lastKey;
          }
        }
      }
      if (currKey === ')' && this.status === 'inputting' && this.input !== '0') {
        this.formula += this.input;
        // 设置右括号 ) 前要将有效的正在输入的 input 添加到公式中，状态改为 waiting ，等待新操作符和新数字
        // （如果不改，直接输入新操作符时，新操作符自动会将 inputting 状态下的数字添加到上一轮公式中）
        this.status = 'waiting';
      }
      // 此处真正添加本次生成的括号
      this.formula += currKey;
    },
    // 重置键 CE
    clear() {
      // 重置所有状态数据
      this.input = '0';
      this.lastItem = '';
      this.formula = '';
      this.status = 'inputting';
    },
    // 删除键 Backspace
    backspace() {
      // 上次操作状态为错误，先重置
      if (this.status === 'error') {
        this.clear();
      }
      // 删除操作，会重置记录的上一次输入项
      this.lastItem = '';
      // 如果是正在输入数字，且输入的内容不是 '0' 执行删除末尾一个字符
      if (this.status === 'inputting' && this.input !== '0') {
        const temp = (this.input.slice(0, -1) || '0');
        this.input = (temp === '-0' ? '0' : temp);
      } else if (this.formula.length) {
        // 否则（不是正在输入，或者正在输入的 input 内容以被删除完 '0' ），就判断公式内有没有内容，有就删除一个字符
        // TODO: 因为是对公式进行手动操作，可能产生公式内容错误无法计算的情况
        this.formula = this.formula.slice(0, -1);
      }
    },
    // 求值计算
    calculating() {
      // 上次操作状态为错误，先重置，在返回
      if (this.status === 'error' || (!this.formula.length)) {
        this.clear();
        return;
      }
      try {
        // 去除公式后面末尾的任何操作符，防止计算报错
        // eslint-disable-next-line
        this.formula = this.formula.replace(/[\+\-\*\/\=\s]*$/gm, '');
        const node = this.$math.parse(this.formula);
        if (node) {
          this.formula = `${node.toString()} = `;
          this.input = node.evaluate().toString();
          this.lastItem = this.input;
          this.status = 'calculated';
        }
      } catch (e) {
        console.error(e);
        this.status = 'error';
        this.input = e.message;
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
  grid-template-rows: 40px 80px 1fr 9fr;
  @include font;
  text-align: right;
  .formula {
    margin: 0 16px;
    padding: 0;
    height: 40px;
    line-height: 40px;
    color: $font-light-color;
    white-space: nowrap;
    overflow: auto hidden;
    user-select: text;
    @include scrollbar;
  }
  .input {
    display: block;
    box-sizing: border-box;
    outline: none;
    border: none;
    padding: 8px 16px;
    width: 100%;
    height: 80px;
    line-height: 80px;
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
    grid-auto-flow: row dense;
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
    .compute {
      background: $theme-color;
      &:hover {
        background: darken($color: $theme-color, $amount: 10);
      }
    }
  }
}
</style>
