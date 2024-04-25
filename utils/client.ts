export function copyRoomCode(roomCode: string, hostname?: string) {
  navigator.clipboard
    .writeText(hostname ? hostname + '/join?roomCode=' + roomCode : roomCode)
    .then(() => {
      const toastStore = useToastStore()
      toastStore.addToast({
        title: 'Room code copied',
        message: 'You can now share the room code!',
        type: 'info',
      })
    })
}
