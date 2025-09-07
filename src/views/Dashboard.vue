<template>
  <div class="dashboard bg-[#E8E8E8]">
    <h2 class="title">All Lists</h2>

    <div class="boards h-full">
      <Board
        v-for="b in boardDefs"
        :key="b.id"
        :board="b"
        :tasks="getTasksForBoard(b.id)"
      />
    </div>
  </div>
</template>

<script setup>
import Board from "@/components/Board.vue";
import { useTasks } from "@/store/tasksStore";
import { BOARD_ORDER } from "@/store/tasksStore";

const boardDefs = [
  { id: "backlog", name: "Backlog" },
  { id: "this-week", name: "This Week" },
  { id: "today", name: "Today" },
  { id: "done", name: "Done" },
];

const { getTasksForBoard } = useTasks();

console.assert(
  JSON.stringify(BOARD_ORDER) === JSON.stringify(boardDefs.map((b) => b.id)),
  "BOARD_ORDER and boardDefs should match"
);
</script>

<style scoped>
.dashboard {
  height: 88%;
  padding: 0 20px;
}
.title {
  margin-bottom: 16px;
}
.boards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
}
</style>
