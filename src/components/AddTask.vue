<template>
  <div class="add-task">
    <input 
      v-model="title" 
      type="text" 
      placeholder="+ Add Task" 
      @keyup.enter="submit"
    />
  </div>
</template>

<script>
export default {
  name: "AddTask",
  data() {
    return { title: "" };
  },
  methods: {
    submit() {
      if (!this.title.trim()) return;
      this.$emit("add", this.title);
      this.title = "";
    }
  }
};
</script>

<style scoped>
.add-task input {
  border: none;
  outline: none;
  background: transparent;
  color: #666;
  font-size: 14px;
}
</style>
