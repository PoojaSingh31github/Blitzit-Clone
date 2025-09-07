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
      class="tasks flex flex-col gap-1 min-h-[83%] max-h-[83%] flex-1 overflow-y-auto"
      ref="listEl"
    >
      <!-- Empty state -->
      <div
        v-if="tasksSorted.length === 0 && placeholderIndex === null"
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

      <template v-for="(t, i) in tasksSorted" :key="t.id">
        <!-- Dynamic placeholder -->
        <div
          v-if="placeholderIndex === i"
          class="drop-placeholder rounded-lg bg-gray-200 transition-all duration-150"
          :style="{ height: placeholderHeight + 'px' }"
        />

        <TaskCard :task="t" />
      </template>

      <!-- End placeholder -->
      <div
        v-if="placeholderIndex === tasksSorted.length"
        class="drop-placeholder rounded-lg bg-gray-200 transition-all duration-150"
        :style="{ height: placeholderHeight + 'px' }"
      />
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

  <!-- Modal -->
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
import { ref, computed, watchEffect, unref, nextTick } from "vue";
import TaskCard from "@/components/TaskCard.vue";
import { useTasks } from "@/store/tasksStore";

const props = defineProps({
  board: { type: Object, required: true },
  tasks: { type: [Array, Object], default: () => [] },
});

const { addTask, reorderInsideBoard, moveToBoard } = useTasks();

const newTitle = ref("");
const openModal = ref(false);
const listEl = ref(null);
const placeholderIndex = ref(null);
const placeholderHeight = ref(60);

// Safe computed for tasks
const tasksSorted = computed(() => {
  const raw = unref(props.tasks) ?? [];
  if (!Array.isArray(raw)) {
    return [];
  }
  return [...raw].sort((a, b) => (a.position || 0) - (b.position || 0));
});

function closeModal() {
  openModal.value = false;
  newTitle.value = "";
}

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

  // Get dynamic height
  try {
    const payloadRaw = e.dataTransfer?.getData("text/plain");
    if (payloadRaw) {
      const parsed = JSON.parse(payloadRaw);
      if (parsed.taskId) {
        const taskCard = document.querySelector(
          `[data-task-id="${parsed.taskId}"]`
        );
        if (taskCard) {
          placeholderHeight.value = taskCard.offsetHeight;
        }
      }
    }
  } catch {
    // Ignore errors
  }
}

function onDragLeave(e) {
  if (!e.currentTarget.contains(e.relatedTarget)) {
    placeholderIndex.value = null;
  }
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

  const filteredTasks = tasksSorted.value.filter((t) => t.id !== taskId);
  const before = idx > 0 ? filteredTasks[idx - 1]?.id : null;
  const after = idx < filteredTasks.length ? filteredTasks[idx]?.id : null;

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
