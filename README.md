# vue-project

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```


taskcard.vew
<template>
  <div
    class="task-card group bg-white rounded-lg p-3 transition-transform duration-100 ease-in-out user-select-none shadow-sm"
    :class="{ 'opacity-60 transform scale-95': isDragging }"
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
          class="transform transition-all duration-200 scale-75 group-hover:scale-100"
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
          class="transform transition-all duration-200 scale-75 group-hover:scale-100"
        >
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
import { computed, ref, onMounted } from "vue";
import { useTasks } from "@/store/tasksStore";

const props = defineProps({ task: { type: Object, required: true } });
const { hopLeft, hopRight, deleteTask, moveToBoard } = useTasks();

const isDragging = ref(false);

const minutes = computed(() =>
  props.task?.estimateTime ? Math.floor(props.task.estimateTime / 60000) : 0
);

function onDragStart(e) {
  isDragging.value = true;
  e.dataTransfer.effectAllowed = "move";
  e.dataTransfer.setData(
    "text/plain",
    JSON.stringify({
      taskId: props.task.id,
      fromBoard: props.task.board,
    })
  );

  // tiny invisible ghost to avoid default drag image
  if (e.dataTransfer.setDragImage) {
    const ghost = document.createElement("div");
    ghost.style.width = "1px";
    ghost.style.height = "1px";
    ghost.style.position = "absolute";
    ghost.style.top = "-9999px";
    document.body.appendChild(ghost);
    e.dataTransfer.setDragImage(ghost, 0, 0);
    setTimeout(() => document.body.removeChild(ghost), 0);
  }
}

function truncateTitle(text, max) {
  if (!text) return "";
  return text.length > max ? text.slice(0, max) + "..." : text;
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
    rgba(59, 130, 246, 0.1),
    transparent
  );
  transition: left 1s ease;
}

.task-card:hover::before {
  left: 100%;
}
</style>












board.vue
<template>
  <div
    class="board bg-[#F5F5F5] rounded-xl p-4 flex flex-col text-sm text-slate-800 shadow-sm border border-slate-200"
    @dragover.prevent="onDragOver"
    @dragleave="onDragLeave"
    @drop.prevent="onDrop"
  >
    <div class="board-header mb-3 flex justify-between items-center">
      <h3 class="text-[15px] font-semibold">{{ board.name }}</h3>

      <button
        class="text-lg rounded-full p-2 flex items-center justify-center hover:bg-slate-300/40 transition"
        @click="openModal = true"
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M10.8585 5.02908H6.96962V1.14019C6.96962 0.882342 6.86719 0.635053 6.68486 0.452726C6.50253 0.270399 6.25524 0.167969 5.9974 0.167969C5.73955 0.167969 5.49226 0.270399 5.30993 0.452726C5.1276 0.635053 5.02517 0.882342 5.02517 1.14019V5.02908H1.13628C0.878435 5.02908 0.631147 5.13151 0.44882 5.31384C0.266493 5.49616 0.164062 5.74345 0.164062 6.0013C0.164062 6.25915 0.266493 6.50644 0.44882 6.68877C0.631147 6.87109 0.878435 6.97352 1.13628 6.97352H5.02517V10.8624C5.02517 11.1203 5.1276 11.3676 5.30993 11.5499C5.49226 11.7322 5.73955 11.8346 5.9974 11.8346C6.25524 11.8346 6.50253 11.7322 6.68486 11.5499C6.86719 11.3676 6.96962 11.1203 6.96962 10.8624V6.97352H10.8585C11.1164 6.97352 11.3636 6.87109 11.546 6.68877C11.7283 6.50644 11.8307 6.25915 11.8307 6.0013C11.8307 5.74345 11.7283 5.49616 11.546 5.31384C11.3636 5.13151 11.1164 5.02908 10.8585 5.02908Z"
            fill="black"
          />
        </svg>
      </button>
    </div>

    <div
      class="tasks flex flex-col gap-2 min-h-[470px] max-h-[470px] flex-1 overflow-y-auto"
      ref="listEl"
    >
      <!-- Empty state when no tasks -->
      <div
        v-if="tasksSorted.length === 0"
        class="flex flex-col items-center justify-center h-full text-slate-400"
      >
        <svg
          class="w-16 h-16 mb-4 text-slate-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
        <p class="text-sm font-medium">No active tasks</p>
        <p class="text-xs text-slate-300 mt-1">
          Add your first task to get started
        </p>
      </div>

      <!-- Tasks when they exist -->
      <template v-else>
        <template v-for="(t, i) in tasksSorted" :key="t.id">
          <div
            v-if="placeholderIndex === i"
            class="drop-placeholder h-11 rounded-lg outline-dashed outline-2 outline-sky-300 bg-gradient-to-br from-sky-50 to-sky-100"
          />
          <TaskCard :task="t" />
        </template>

        <div
          v-if="placeholderIndex === tasksSorted.length"
          class="drop-placeholder h-11 rounded-lg outline-dashed outline-2 outline-sky-300 bg-gradient-to-br from-sky-50 to-sky-100"
        />
      </template>
    </div>

    <button
      class="text-sm rounded-md gap-1 p-2 flex items-center hover:bg-slate-300/40 transition w-fit"
      @click="openModal = true"
    >
      <svg
        width="12"
        height="12"
        viewBox="0 0 12 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M10.8585 5.02908H6.96962V1.14019C6.96962 0.882342 6.86719 0.635053 6.68486 0.452726C6.50253 0.270399 6.25524 0.167969 5.9974 0.167969C5.73955 0.167969 5.49226 0.270399 5.30993 0.452726C5.1276 0.635053 5.02517 0.882342 5.02517 1.14019V5.02908H1.13628C0.878435 5.02908 0.631147 5.13151 0.44882 5.31384C0.266493 5.49616 0.164062 5.74345 0.164062 6.0013C0.164062 6.25915 0.266493 6.50644 0.44882 6.68877C0.631147 6.87109 0.878435 6.97352 1.13628 6.97352H5.02517V10.8624C5.02517 11.1203 5.1276 11.3676 5.30993 11.5499C5.49226 11.7322 5.73955 11.8346 5.9974 11.8346C6.25524 11.8346 6.50253 11.7322 6.68486 11.5499C6.86719 11.3676 6.96962 11.1203 6.96962 10.8624V6.97352H10.8585C11.1164 6.97352 11.3636 6.87109 11.546 6.68877C11.7283 6.50644 11.8307 6.25915 11.8307 6.0013C11.8307 5.74345 11.7283 5.49616 11.546 5.31384C11.3636 5.13151 11.1164 5.02908 10.8585 5.02908Z"
          fill="black"
        />
      </svg>
      <span>ADD TASK</span>
    </button>
  </div>
  <div
    v-if="openModal"
    class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
  >
    <div class="bg-white p-12 rounded-xl w-[35%] font-sans relative shadow-xl">
      <button
        @click="closeModal"
        class="absolute top-4 right-4 text-2xl text-gray-400 hover:text-gray-700"
      >
        ×
      </button>
      <form @submit.prevent="saveTask">
        <h2 class="text-center text-xl font-medium mb-10 text-gray-600">
          Add {{ board.name }} task
        </h2>

        <label for="taskTitle" class="block font-normal mb-1 text-gray-500/90"
          >Title</label
        >
        <input
          id="taskTitle"
          type="text"
          v-model="newTitle"
          placeholder="Enter task title"
          class="w-full border border-gray-300 rounded-lg px-4 py-2 mb-8 focus:outline-none focus:ring-1 focus:ring-green-400 transition"
        />

        <div class="flex justify-center gap-4 w-full">
          <button
            type="button"
            @click="closeModal"
            class="px-6 py-2 text-gray-700 rounded-full border border-black w-1/2"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="px-6 py-2 bg-gradient-to-r from-[#4ac7c0] to-[#8cd96d] hover:opacity-90 rounded-full w-1/2"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watchEffect, unref } from "vue";
import TaskCard from "@/components/TaskCard.vue";
import { useTasks } from "@/store/tasksStore";

const props = defineProps({
  board: { type: Object, required: true },
  // Accept array or reactive references (ref/computed or plain object)
  tasks: { type: [Array, Object], default: () => [] },
});

watchEffect(() => {
  // quick debug — remove in prod
  // console.log("Board:", props.board);
  // console.log("Tasks (raw):", unref(props.tasks), "isArray:", Array.isArray(unref(props.tasks)));
});

const { addTask, reorderInsideBoard, moveToBoard } = useTasks();
const newTitle = ref("");
const openModal = ref(false);

function closeModal() {
  openModal.value = false;
  newTitle.value = "";
}

// safe computed — unwrap refs and guard against non-arrays
const tasksSorted = computed(() => {
  const raw = unref(props.tasks) ?? [];
  if (!Array.isArray(raw)) {
    // if you want to surface the issue, uncomment:
    // console.warn("⚠️ props.tasks is not an array:", raw);
    return [];
  }
  return [...raw].sort((a, b) => (a.position || 0) - (b.position || 0));
});

/** DnD calculations **/
const listEl = ref(null);
const placeholderIndex = ref(null);

function indexFromPointer(clientY) {
  if (!listEl.value) return 0;
  const items = Array.from(listEl.value.querySelectorAll(".task-card"));
  for (let i = 0; i < items.length; i++) {
    const rect = items[i].getBoundingClientRect();
    const mid = rect.top + rect.height / 2;
    if (clientY < mid) return i;
  }
  return items.length;
}

function onDragOver(e) {
  const idx = indexFromPointer(e.clientY);
  placeholderIndex.value = idx;
}

function onDragLeave() {
  placeholderIndex.value = null;
}

function onDrop(e) {
  const payloadRaw = e.dataTransfer.getData("text/plain");
  if (!payloadRaw) {
    placeholderIndex.value = null;
    return;
  }

  let parsed;
  try {
    parsed = JSON.parse(payloadRaw);
  } catch {
    placeholderIndex.value = null;
    return;
  }

  const { taskId, fromBoard } = parsed;
  const idx = placeholderIndex.value ?? tasksSorted.value.length;
  const before = idx > 0 ? tasksSorted.value[idx - 1]?.id : null;
  const after =
    idx < tasksSorted.value.length ? tasksSorted.value[idx]?.id : null;

  if (fromBoard === props.board.id) {
    reorderInsideBoard(taskId, props.board.id, before, after);
  } else {
    moveToBoard(taskId, props.board.id, before, after);
  }
  placeholderIndex.value = null;
}

function saveTask() {
  if (!newTitle.value.trim()) return;
  addTask(props.board.id, newTitle.value.trim());
  closeModal();
}
</script>



