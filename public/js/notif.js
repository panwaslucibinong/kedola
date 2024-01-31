const alertSukses = (judul, pesan) => {
    Swal.fire({
        icon: 'success',
        title: judul,
        text: pesan,
        showConfirmButton: false,
        timer: 3000
    })
}
const alertSuksesRedirect = (judul, pesan, arahLink) => {
    Swal.fire({
        icon: 'success',
        title: judul,
        text: pesan,
        showConfirmButton: false,
        timer: 3000
    }).then((result) => {
        window.location.href = arahLink;
    });
}

// Add an event listener to all delete buttons
const deleteButtons = document.querySelectorAll('[id^="deleteButton"]');
deleteButtons.forEach((button) => {
    button.addEventListener('click', function () {
        const index = this.getAttribute('data-index');
        Swal.fire({
            title: 'Konfirmasi Hapus',
            text: 'Anda yakin ingin menghapus data ini?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Ya, Hapus!',
            cancelButtonText: 'Batal'
        }).then((result) => {
            if (result.isConfirmed) {
                document.getElementById(`deleteForm${index}`).submit();
            }
        });
    });
});
