<script setup>
import Button from './components/Button.vue'
import { ref, watch, onMounted } from 'vue'

const time = ref('00:00')
const timerState = ref(false)
const focusState = ref(true)
const workCount = ref(1)
const breakCount = ref(0)

watch(focusState, (state) => {
    localStorage.setItem('focusState', state)
})

watch(workCount, (state) => {
    localStorage.setItem('workCount', state)
})

watch(breakCount, (state) => {
    localStorage.setItem('breakCount', state)
})

const startTimer = () => {}

onMounted(() => {
    const storedState = localStorage.getItem('focusState')
    if (storedState) {
        focusState.value = storedState
    }

    const storedWorkCount = localStorage.getItem('workCount')
    if (storedWorkCount) {
        workCount.value = storedWorkCount
    }

    const storedBreakCount = localStorage.getItem('breakCount')
    if (storedBreakCount) {
        breakCount.value = storedBreakCount
    }
})

const handleFocusButtonClick = () => {
    if (!focusState.value) {
        workCount.value++
        focusState.value = true
    }
}

const handleBreakButtonClick = () => {
    console.log('break time')
    if (focusState.value) {
        breakCount.value++
        focusState.value = false
    }
}

const hardReset = () => {
    localStorage.clear()
    timerState.value = false
    focusState.value = true
    workCount.value = 1
    breakCount.value = 0
}
</script>

<template>
    <div
        :class="
            'size-full flex flex-col justify-center items-center text-main-white font-arial gap-4 transition-all duration-[0.75s] ease-in-out ' +
            (focusState ? 'bg-main-red' : 'bg-main-blue')
        "
    >
        <div class="flex flex-row gap-4 items-center">
            <Button :isActive="focusState" :onClick="handleFocusButtonClick">
                Focus Mode
            </Button>
            <Button :isActive="!focusState" :onClick="handleBreakButtonClick">
                Take A Break
            </Button>
        </div>
        <div
            class="border-4 border-solid rounded-xl border-main-white w-auto h-auto p-8 flex flex-col gap-2 items-center"
        >
            <h1 class="font-bold text-4xl">
                {{ focusState ? 'Focus' : 'Break' }}
            </h1>
            <p class="text-8xl font-medium">{{ time }}</p>
        </div>
        <p>
            {{ focusState ? 'Focus' : 'Break' }} Count: #{{
                focusState ? workCount : breakCount
            }}
        </p>
        <Button :isActive="false" :onClick="hardReset">Hard Reset</Button>
    </div>
</template>

<style scoped></style>
