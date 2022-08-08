const id_fmt = document.getElementById('dscfmt');
const id_ver = document.getElementById('dscver');

let file_picker;
let lastfilename = 'pv_new.dsc';

document.body.addEventListener("dragover", (e) => {
    e.stopPropagation();
    e.preventDefault();
});

document.body.addEventListener("drop", async (e) => {
    e.stopPropagation();
    e.preventDefault();
    
    const files = e.dataTransfer.files;
    if (files.length == 1)
    {
        try
        {
            fileHandle = await e.dataTransfer.items[0].getAsFileSystemHandle();
        }
        catch
        {}
    }
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

document.getElementById('toolopen').onclick = document.getElementById('menuitem_open').onclick = function()
{
    if(modified)
    {
        dialogEx("Open file...", "Discard changes and open another file?", open_dsc);
    }
    else
    {
        open_dsc();
    }
}

function opendiag()
{
    return window.showOpenFilePicker({ types: [ { description: 'DSC', accept: {'application/octet-stream': ['.dsc']} } ], multiple: true });
}

function savediag()
{
    return window.showSaveFilePicker({ types: [ { description: 'DSC', accept: {'application/octet-stream': ['.dsc']} } ] });
}

async function do_open_dsc(newHandle)
{
    const fileData = [];
    for (const fileh of newHandle)
    {
        const file = await fileh.getFile();
        fileData.push(file);
    };
    const fileArray = Array.from(fileData);
    read_dsc(fileArray);

    if (fileData.length == 1)
    {
        fileHandle = newHandle[0];
        lastfilename = fileHandle.name;
    }
};

async function open_dsc()
{
    if (fileApi)
    {
        let newHandle;
        try
        {
            newHandle = await opendiag();
            await do_open_dsc(newHandle);
        }
        catch (ex)
        {
            if (ex.name !== 'AbortError') {
                console.error(ex);
                dialogEx("Error", ex);
            }

            return;
        }
    }
    else
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
}

async function save_dsc()
{
    if (fileHandle)
    {
        do_save_dsc();
    }
    else
    {
        saveas_dsc();
    }
}

document.getElementById('toolsave').onclick = document.getElementById('menuitem_save').onclick = save_dsc;
document.getElementById('toolsaveas').onclick = document.getElementById('menuitem_saveas').onclick = saveas_dsc;

function getFmtToNum()
{
    return parseInt(id_ver.value, 16);
}

function do_save_dsc()
{
    setProgress(0, "Saving file...");
    const worker = new Worker("./dsc_worker_write.js");
    const lines = editor.getValue().split(/\r?\n/);
    worker.postMessage({lines: lines, dscfmt: id_fmt.value, dscver: getFmtToNum()});
    worker.onmessage = worker_message_handler;
}

async function saveas_dsc()
{
    if (fileApi)
    { 
        let newHandle = '';
        try
        {
            newHandle = await savediag();
        }
        catch (ex)
        {
            if (ex.name !== 'AbortError') {
                console.error(ex);
                dialogEx("Error", ex);
            }

            return;
        }

        fileHandle = newHandle;
        lastfilename = fileHandle.name;
        document.title = lastfilename + ' - DSC Editor';
    }
    do_save_dsc();
};

function read_dsc(files)
{
    setProgress(0, "Reading file...");
    const worker = new Worker("./dsc_worker_read.js");
    worker.postMessage({files: files, dscfmt: id_fmt.value, dscver: getFmtToNum()});
    worker.onmessage = worker_message_handler;
}

async function worker_message_handler(e)
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
            id_ver.value = e.data.data.toString(16);
            break;
        case 'datatext':
            bookmark_clear(); // todo deleting a bookmarked line should delete the decoration and the bookmark instead
            editor.setValue(e.data.data);
            document.title = lastfilename + ' - DSC Editor';
            editor.revealLineInCenter(1);
            editor.setPosition({column: 1, lineNumber: 1});
            setProgress(-1);
            break;
        case 'datasave':
            const fileblob = e.data.data;
            let disableFs = false;

            try
            {
                if (fileHandle)
                {
                    const writable = await fileHandle.createWritable();
                    await writable.write(fileblob);
                    await writable.close();
                }
            }
            catch (e)
            {
                console.error(e.stack.toString())
                disableFs = true;
            }

            if (!fileHandle || disableFs)
            {
                const filelink = document.createElement('a');
                const fileurl = URL.createObjectURL(fileblob);
                filelink.href = fileurl;
                filelink.target = "_blank";
                filelink.download = lastfilename;
                filelink.click();
                filelink.remove();
            }
            setModified(false);
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
            dialogEx("Warning", e.data.data);
            break;
    }
}


async function loadQueue()
{
    if ('launchQueue' in window && 'files' in LaunchParams.prototype) {
        launchQueue.setConsumer(async (launchParams) => {
            if (!launchParams.files.length) {
                return;
            }
            async function ensureEditor() {
                if (typeof editor === 'undefined')
                {
                    setTimeout(ensureEditor, 100);
                }
                else
                {
                    await do_open_dsc(launchParams.files);
                }
            }
            await ensureEditor();
        });
    }
}
await loadQueue();