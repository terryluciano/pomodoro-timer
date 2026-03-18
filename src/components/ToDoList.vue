<script setup>
const open = defineModel({ type: Boolean, required: true });

const closeToDoList = () => {
    open.value = false;
};
</script>

<template>
    <div
        class="fixed inset-0 z-50 flex items-end xs:items-stretch xs:justify-end bg-black/35 backdrop-blur-sm transition-opacity duration-300"
        :class="
            open
                ? 'pointer-events-auto opacity-100'
                : 'pointer-events-none opacity-0'
        "
        @click.self.prevent="closeToDoList"
    >
        <aside
            role="dialog"
            aria-modal="true"
            aria-label="Settings menu"
            class="w-full xs:w-[430px] xs:h-full xs:max-h-none max-h-[92vh] overflow-y-auto rounded-t-3xl xs:rounded-none xs:rounded-l-3xl border border-white/20 bg-white/20 text-main-white backdrop-blur-md shadow-2xl transition-transform duration-300 ease-out"
            :class="
                open
                    ? 'translate-y-0 xs:translate-y-0 xs:translate-x-0'
                    : 'translate-y-full xs:translate-y-0 xs:translate-x-full'
            "
        ></aside>
    </div>
</template>
