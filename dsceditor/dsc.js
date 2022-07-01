const id_fmt = document.getElementById('dscfmt');
const id_ver = document.getElementById('dscver');

let file_picker;
let lastfilename = 'pv_new.dsc';

document.body.addEventListener("dragover", (e) => {
    e.stopPropagation();
    e.preventDefault();
});

document.body.addEventListener("drop", (e) => {
    e.stopPropagation();
    e.preventDefault();
    
    const files = e.dataTransfer.files;
    lastfilename = files[0].name;
    read_dsc(files);
});

document.getElementById('dscfmt').onchange = function()
{
    switch (document.getElementById('dscfmt').value)
    {
        case 'ft':
            document.getElementById('dscver').value = fmts_ft[0];
            break;
        case 'dt2':
            document.getElementById('dscver').value = fmts_dt2[0];
            break;
    }
}

document.getElementById('toolopen').onclick = open_dsc;
document.getElementById('menuitem_open').onclick = open_dsc;

async function open_dsc()
{
    file_picker = document.createElement('input');
    file_picker.type = 'file';
    file_picker.multiple = 'true';
    file_picker.onchange = _this => {
        lastfilename = file_picker.files[0].name;
        read_dsc(Array.from(file_picker.files));
        file_picker.remove();
    };
    file_picker.click();
    file_picker.remove();
}

document.getElementById('toolsaveas').onclick = saveas_dsc;
document.getElementById('menuitem_saveas').onclick = saveas_dsc;

function saveas_dsc()
{
    setProgress(0);
    const worker = new Worker("./dsc_worker_write.js");
    const lines = editor.getValue().split(/\r?\n/);
    worker.postMessage({lines: lines, dscfmt: id_fmt.value, dscver: id_ver.value});
    worker.onmessage = worker_message_handler;
};

function read_dsc(files)
{
    setProgress(0);
    const worker = new Worker("./dsc_worker_read.js");
    worker.postMessage({files: files, dscfmt: id_fmt.value, dscver: id_ver.value});
    worker.onmessage = worker_message_handler;
}

function worker_message_handler(e)
{
    switch (e.data.type)
    {
        case 'progress':
            setProgress(e.data.data);
            break;
        case 'setfmt':
            id_fmt.value = e.data.data;
            break;
        case 'setver':
            id_ver.value = e.data.data;
            break;
        case 'datatext':
            editor.setValue(e.data.data);
            editor.revealLineInCenter(1);
            editor.setPosition({column: 1, lineNumber: 1});
            setProgress(-1);
            break;
        case 'datasave':
            const fileblob = e.data.data;
            const filelink = document.createElement('a');
            const fileurl = URL.createObjectURL(fileblob);
            filelink.href = fileurl;
            filelink.target = "_blank";
            filelink.download = lastfilename;
            filelink.click();
            filelink.remove();
            setProgress(-1);
            break;
        case 'seteditorpos':
            editor.revealLineInCenter(e.data.data.lineNumber);
            editor.setPosition(e.data.data);
            break;
        case 'exception':
            setProgress(-1);
        case 'warning':
            console.error(e.data.data);
            alert(e.data.data);
            break;
    }
}
