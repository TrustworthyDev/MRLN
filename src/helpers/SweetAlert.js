import Swal from 'sweetalert2'

const swalConfigs = {
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#88ad3a',
    cancelButtonColor: '#6c757d',
    confirmButtonText: 'Confirm'
}

export function showConfirmationAlert(title, text) {
    const configs = {
        title: title,
        text: text,
        ...swalConfigs
    }
    return Swal.fire(configs)
}
