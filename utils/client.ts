export function copyRoomCode(hostname: string, roomCode: string) {
  navigator.clipboard.writeText(hostname + '/join?roomCode=' + roomCode).then(() => {
    const toastStore = useToastStore()
    toastStore.addToast({
      title: 'Room code copied',
      message: 'You can now share the room code!',
      type: 'info',
    })
  })
}
