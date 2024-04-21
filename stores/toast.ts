export const useToastStore = defineStore('toast', () => {
  interface Toast {
    title: string
    message: string
    type?: 'info' | 'success' | 'warning' | 'error' | 'none'
  }
  const toast = ref<Toast | null>(null)
  const toastTimer = ref<ReturnType<typeof setTimeout> | null>(null)

  const addToast = (_toast: Toast) => {
    toast.value = _toast
    toastTimer.value = setTimeout(() => {
      toast.value = null
    }, 5000)
  }
  const removeToast = () => {
    toast.value = null
    if (toastTimer.value) {
      clearTimeout(toastTimer.value)
    }
  }
  const getToast = () => toast.value
  return { getToast, addToast, removeToast }
})
