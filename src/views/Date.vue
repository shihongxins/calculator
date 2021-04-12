<template>
  <div class="date">
    <label for="from">
      开始日期
      <input type="date" name="from" id="from">
    </label>
    <label for="">
      <select name="" id="">
        <option value="add">添加</option>
        <option value="subtract">减去</option>
      </select>
    </label>
    <label for="to">
      结束日期
      <input type="date" name="to" id="to">
    </label>
  </div>
</template>

<script>
export default {
  name: 'Date',
};
</script>

<style lang="scss" scoped>
.date {
  padding: 1em;
  label,input {
    display: block;
  }
}
</style>
