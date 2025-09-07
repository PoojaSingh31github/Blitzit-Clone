<template>
  <div
    class="task-card group bg-white rounded-lg p-3 transition-transform duration-100 ease-in-out user-select-none shadow-sm hover:bg-gray-200"
    :class="{ 'opacity-60 transform scale-95': isDragging }"
    :data-task-id="task.id"
    draggable="true"
    @dragstart="onDragStart"
    @dragend="onDragEnd"
  >
    <div
      class="overflow-hidden transition-all duration-300 ease-out max-h-0 opacity-0 group-hover:max-h-12 group-hover:opacity-100 group-hover:mb-2"
    >
      <div
        class="flex justify-between items-center transform translate-y-[-8px] group-hover:translate-y-0 transition-all duration-300 ease-out"
      >
        <div
          class="flex justify-between items-center transform transition-all duration-200 scale-75 group-hover:scale-100"
        >
          <input
            type="checkbox"
            :checked="task.board === 'done'"
            @change="
              !(task.board === 'done') &&
                moveToBoard(task.id, 'done', null, null)
            "
            class="w-4 h-4 cursor-pointer accent-green-500 transition-all duration-200"
          />
        </div>

        <div
          class="flex justify-between items-center gap-3 transform transition-all duration-200 scale-75 group-hover:scale-100"
        >
          <div class="flex justify-between items-center">
            <button
              @click.stop="hopLeft(task.id)"
              class="icon text-sm px-2 py-1 rounded hover:bg-slate-200 transition-colors duration-150"
              title="Move left"
            >
              ←
            </button>
            <button
              @click.stop="hopRight(task.id)"
              class="icon text-sm px-2 py-1 rounded hover:bg-slate-200 transition-colors duration-150"
              title="Move right"
            >
              →
            </button>
          </div>
          <button
            @click="deleteTask(task.id)"
            class="w-5 h-5 text-gray-600 hover:text-red-500 transition-colors duration-200 transform hover:scale-110"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19 7L18.1327 19.1425C18.0579 20.1891 17.187 21 16.1378 21H7.86224C6.81296 21 5.94208 20.1891 5.86732 19.1425L5 7M10 11V17M14 11V17M15 7V4C15 3.44772 14.5523 3 14 3H10C9.44772 3 9 3.44772 9 4V7M4 7H20"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
    <div class="flex justify-between items-start">
      <div>
        <p
          class="text-gray-800 text-sm font-medium transition-all duration-200"
          :class="{
            'line-through text-slate-500': task.board === 'done' || checked,
          }"
        >
          {{ task.title }}
        </p>
      </div>

      <div class="flex items-center gap-1">
        <div
          class="w-5 h-5 rounded-md bg-yellow-300 flex items-center justify-center text-[10px] font-bold text-gray-700"
        >
          {{ task.title.charAt(0) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { useTasks } from "@/store/tasksStore";

const props = defineProps({ task: { type: Object, required: true } });
const { hopLeft, hopRight, deleteTask, moveToBoard } = useTasks();

const isDragging = ref(false);

function onDragStart(e) {
  isDragging.value = true;
  e.dataTransfer.effectAllowed = "move";
  e.dataTransfer.setData(
    "text/plain",
    JSON.stringify({
      taskId: props.task.id,
      fromBoard: props.task.board
    })
  );
}

function onDragEnd() {
  isDragging.value = false;
}
</script>

<style scoped>
.task-card {
  position: relative;
  overflow: hidden;
}

.task-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(59, 130, 246, 0.2),
    transparent
  );
  transition: left 1s ease;
}

.task-card:hover::before {
  left: 100%;
}
</style>
