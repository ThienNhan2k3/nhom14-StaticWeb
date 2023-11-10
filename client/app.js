let table = new DataTable('#myTable', {
    scrollResize: true,
    scrollCollapse: true,
    paging: false,
});

table.on('click', 'tbody tr', (e) => {
    let classList = e.currentTarget.classList;
 
    if (classList.contains('selected')) {
        classList.remove('selected');
    }
    else {
        table.rows('.selected').nodes().each((row) => row.classList.remove('selected'));
        classList.add('selected');
    }
});
 
/*document.querySelector('#button').addEventListener('click', function () {
    table.row('.selected').remove().draw(false);
});*/

