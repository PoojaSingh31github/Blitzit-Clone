// src/store/tasksStore.js
import { reactive, computed, watch } from "vue";
import rawTasks from "@/data/tasks.json";
export const BOARD_ORDER = ["backlog", "this-week", "today", "done"];
function sortByPosition(a, b) {
  const pa = typeof a.position === "number" ? a.position : 0;
  const pb = typeof b.position === "number" ? b.position : 0;
  return pa - pb || (a.createdAt || 0) - (b.createdAt || 0);
}
function nextPositionAfter(lastPos) {
  return (typeof lastPos === "number" ? lastPos : 250) + 5;
}

function prevPositionBefore(firstPos) {
  return (typeof firstPos === "number" ? firstPos : 250) - 5;
}

function middlePosition(prevPos, nextPos) {
  if (typeof prevPos !== "number") return (nextPos ?? 250) - 5;
  if (typeof nextPos !== "number") return (prevPos ?? 250) + 5;
  return Math.floor((prevPos + nextPos) / 2);
}
const STORAGE_KEY = "vue-tasks";

function loadFromStorage() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error("❌ Failed to parse localStorage tasks:", e);
    }
  }
  return rawTasks.map((t, i) => ({
    id: t.id || `${t.title}-${t.createdAt || i}`,
    ...t,
  }));
}

function saveToStorage(tasks) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

const state = reactive({
  tasks: loadFromStorage(),
});

watch(
  () => state.tasks,
  (val) => {
    saveToStorage(val);
  },
  { deep: true }
);

export function useTasks() {
  const getTasksForBoard = (boardId) =>
    computed(() =>
      state.tasks
        .filter(
          (t) =>
            t.board === boardId &&
            !t.recurringType &&
            !t.scheduleTime
        )
        .sort(sortByPosition)
    );

  const getScheduledForBoard = (boardId) =>
    computed(() =>
      state.tasks
        .filter((t) => t.board === boardId && !!t.scheduleTime)
        .sort((a, b) => (a.scheduleTime || 0) - (b.scheduleTime || 0))
    );

  const getRecurringForBoard = (boardId) =>
    computed(() =>
      state.tasks
        .filter((t) => t.board === boardId && !!t.recurringType)
        .sort(sortByPosition)
    );

  function computeDropPosition(targetBoardId, beforeId, afterId) {
    const list = state.tasks
      .filter(
        (t) =>
          t.board === targetBoardId &&
          !t.recurringType &&
          !t.scheduleTime
      )
      .sort(sortByPosition);

    if (!beforeId && !afterId) {
      return 250; // empty board
    }

    const before = list.find((t) => t.id === beforeId);
    const after = list.find((t) => t.id === afterId);

    if (!before && after) return prevPositionBefore(after.position);
    if (before && !after) return nextPositionAfter(before.position);
    return middlePosition(before?.position, after?.position);
  }

  function moveToBoard(taskId, targetBoardId, beforeId = null, afterId = null) {
    const idx = state.tasks.findIndex((t) => t.id === taskId);
    if (idx === -1) return;

    const pos = computeDropPosition(targetBoardId, beforeId, afterId);
    const task = state.tasks[idx];
    state.tasks[idx] = { ...task, board: targetBoardId, position: pos };
  }

  function reorderInsideBoard(taskId, targetBoardId, beforeId, afterId) {
    moveToBoard(taskId, targetBoardId, beforeId, afterId);
  }

  function hopLeft(taskId) {
    const task = state.tasks.find((t) => t.id === taskId);
    if (!task) return;
    const i = BOARD_ORDER.indexOf(task.board);
    if (i <= 0) return;
    moveToBoard(taskId, BOARD_ORDER[i - 1], null, null);
  }

  function hopRight(taskId) {
    const task = state.tasks.find((t) => t.id === taskId);
    if (!task) return;
    const i = BOARD_ORDER.indexOf(task.board);
    if (i === -1 || i >= BOARD_ORDER.length - 1) return;
    moveToBoard(taskId, BOARD_ORDER[i + 1], null, null);
  }

  function addTask(boardId, title) {
    const existing = state.tasks
      .filter(
        (t) =>
          t.board === boardId &&
          !t.recurringType &&
          !t.scheduleTime
      )
      .sort(sortByPosition);
    const lastPos = existing.length ? existing[existing.length - 1].position : 245;
    const newTask = {
      id: `task-${Date.now()}`,
      title,
      board: boardId,
      position: lastPos + 5,
      estimateTime: 0,
      createdAt: Date.now(),
    };
    state.tasks.push(newTask);
  }

  function deleteTask(taskId) {
    const idx = state.tasks.findIndex((t) => t.id === taskId);
    if (idx !== -1) state.tasks.splice(idx, 1);
  }

  return {
    state,
    getTasksForBoard,
    getScheduledForBoard,
    getRecurringForBoard,
    moveToBoard,
    reorderInsideBoard,
    hopLeft,
    hopRight,
    addTask,
    deleteTask,
  };
}
