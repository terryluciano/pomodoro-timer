<script setup>
import { ref, watch, onMounted, computed, watchEffect } from 'vue'
import { twMerge } from 'tailwind-merge'
import Button from './components/Button.vue'
import clickSound from './assets/click.mp3'
import chimeSound from './assets/chime.mp3'

const playClick = () => {
    const click = document.getElementById('click')
    click.play()
}

const playChime = () => {
    const chime = document.getElementById('chime')
    chime.play()
}

const time = ref(1000 * 60 * 25)
const focusState = ref(true)
const workCount = ref(1)
const breakCount = ref(0)

let timerInterval

watch(focusState, (state) => {
    localStorage.setItem('focusState', state)
})

watch(workCount, (state) => {
    localStorage.setItem('workCount', state)
})

watch(breakCount, (state) => {
    if (breakCount.value > 0 && breakCount.value % 4 == 0 && !focusState) {
        time.value = 1000 * 60 * 15
    }
    localStorage.setItem('breakCount', state)
})

const startTimer = () => {
    playClick()
    timerInterval = setInterval(() => {
        time.value -= 1000
        if (time.value <= 0) {
            clearInterval(timerInterval)
            playChime()
            if (focusState.value) {
                focusState.value = false
                breakCount.value++
                time.value =
                    breakCount.value % 4 == 0 ? 1000 * 60 * 15 : 1000 * 60 * 5
            } else {
                focusState.value = true
                workCount.value++
                time.value = 1000 * 60 * 25
            }
        }
    }, 1000)
}

const pauseTimer = () => {
    playClick()
    clearInterval(timerInterval)
}

const resetTimer = () => {
    clearInterval(timerInterval)
    time.value = focusState.value
        ? 1000 * 60 * 25
        : breakCount.value % 4 == 0
          ? 1000 * 60 * 15
          : 1000 * 60 * 5
}

onMounted(() => {
    // get focus state
    const storedFocusState = localStorage.getItem('focusState')
    if (storedFocusState) {
        const boolState = storedFocusState == 'true'
        focusState.value = boolState
        time.value = boolState ? 1000 * 60 * 25 : 1000 * 60 * 5
    }

    // get work count
    const storedWorkCount = localStorage.getItem('workCount')
    if (storedWorkCount) {
        workCount.value = Number(storedWorkCount)
    }

    // get break count
    const storedBreakCount = localStorage.getItem('breakCount')
    if (storedBreakCount) {
        breakCount.value = Number(storedBreakCount)
    }
})

const handleFocusButtonClick = () => {
    if (!focusState.value) {
        playClick()
        workCount.value++
        focusState.value = true
        clearInterval(timerInterval)
        time.value = 1000 * 60 * 25
    }
}

const handleBreakButtonClick = () => {
    if (focusState.value) {
        playClick()
        breakCount.value++
        focusState.value = false
        clearInterval(timerInterval)
        time.value = 1000 * 60 * 5
    }
}

const hardReset = () => {
    playClick()
    localStorage.clear()
    focusState.value = true
    workCount.value = 1
    breakCount.value = 0
    resetTimer()
}

const currentTime = computed(() => {
    return `${Math.floor(time.value / 1000 / 60)
        .toString()
        .padStart(2, '0')}:${(Math.floor(time.value / 1000) % 60)
        .toString()
        .padStart(2, '0')}`
})
</script>

<template>
    <div
        :class="
            twMerge(
                'relative size-full flex flex-col xs:justify-center items-center xs:py-10 py-16 text-main-white font-Nunito gap-4 transition-all duration-[0.75s] ease-in-out',
                `${focusState ? 'bg-main-red' : 'bg-main-blue'}`
            )
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
                {{ focusState ? 'Focus Mode' : 'Take a Break' }}
            </h1>
            <p class="text-8xl font-medium">{{ currentTime }}</p>
        </div>
        <p>
            {{ focusState ? 'Focus' : 'Break' }} Count: #{{
                focusState ? workCount : breakCount
            }}
        </p>
        <div class="flex flex-row gap-4 items-center">
            <Button :isActive="false" :onClick="startTimer">Start</Button>
            <Button :isActive="false" :onClick="pauseTimer">Pause</Button>
        </div>

        <audio id="click" preload="auto">
            <source type="audio/mpeg" :src="clickSound" />
        </audio>
        <audio id="chime" preload="auto">
            <source type="audio/mpeg" :src="chimeSound" />
        </audio>

        <Button
            class="absolute bottom-16 left-1/2 -translate-x-1/2"
            :isActive="false"
            :onClick="hardReset"
            >Hard Reset</Button
        >
    </div>
</template>

<style scoped></style>
