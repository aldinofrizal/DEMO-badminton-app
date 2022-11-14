const Popup = Swal.mixin({
  customClass: {
    confirmButton: 'rounded-md bg-red-700 px-5 py-2.5 text-sm font-medium text-white mx-2',
    cancelButton: 'rounded-md bg-stone-200 px-5 py-2.5 text-sm font-medium text-black mx-2',
  },
  buttonsStyling: false,
})

const confirmAction = function(message, callback, input) {
  Popup.fire({
    title: 'Are you sure?',
    text: message,
    showCancelButton: true,
    confirmButtonText: 'Confirm'
  }).then((result) => {
    if (result.isConfirmed) {
      input ? callback(input) : callback()
    }
  })
}