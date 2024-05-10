/*
  DSC Studio
  Copyright (C) 2022-2024 nastys

  This program is free software: you can redistribute it and/or modify
  it under the terms of the GNU Affero General Public License as
  published by the Free Software Foundation, either version 3 of the
  License, or (at your option) any later version.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU Affero General Public License for more details.

  You should have received a copy of the GNU Affero General Public License
  along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/
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
            document.getElementById('dscver').value = fmts_ft[0].toString(16);
            break;
        case 'dt2':
            document.getElementById('dscver').value = fmts_dt2[0].toString(16);
            break;
        case 'pd1':
            document.getElementById('dscver').value = fmts_pd1[0].toString(16);
            break;
        case 'pd2':
            document.getElementById('dscver').value = fmts_pd2[0].toString(16);
            break;
    }

    forceEditorUpdate();
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
    return window.showOpenFilePicker({ types: [ { description: 'DSC', accept: {'application/octet-stream': ['.dsc']} } ], multiple: false });
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
    if (document.getElementById('cb_upgradefmt').checked && id_fmt.value === 'ft')
    {
        id_ver.value = fmts_ft[0].toString(16)
    }

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
        document.title = lastfilename;
    }
    do_save_dsc();
};

function read_dsc(files)
{
    setProgress(0, "Reading file...");
    const worker = new Worker("./dsc_worker_read.js");
    worker.postMessage({files: files, dscfmt: id_fmt.value, dscver: getFmtToNum(), autodetectfmt: document.getElementById('cb_autodetectgame').checked});
    worker.onmessage = worker_message_handler;
}

function export_dex()
{
    const bg = document.getElementById('modalbg');
    const container = document.getElementById('modalwndinside');
    const header = document.getElementById('modalwndheader');
    const footer = document.getElementById('modalwndfooter');
    footer.classList.add('gradient');

    const cont1 = document.createElement('div');
    cont1.classList.add('cbcont');
    const el1 = document.createElement('input');
    el1.type = 'number';
    el1.id = 'nm_performer';
    el1.min = 0;
    //el1.max = 5;
    el1.value = 0;
    el1.classList.add('mleft');
    el1.classList.add('mtop4');
    const lab1 = document.createElement('label');
    lab1.setAttribute('for', el1.id);
    lab1.innerText = 'Performer:';
    cont1.appendChild(lab1);
    cont1.appendChild(el1);
    container.appendChild(cont1);

    const cont2 = document.createElement('div');
    cont2.classList.add('cbcont');
    const el2 = document.createElement('input');
    el2.type = 'text';
    el2.id = 'tx_dexname';
    el2.value = 'PV002_MCA00_00_10';
    el2.classList.add('mleft');
    el2.classList.add('mtop4');
    const lab2 = document.createElement('label');
    lab2.setAttribute('for', el2.id);
    lab2.innerText = 'MOT/DEX:';
    cont2.appendChild(lab2);
    cont2.appendChild(el2);
    container.appendChild(cont2);

    const cont3 = document.createElement('div');
    cont3.classList.add('cbcont');
    const el3 = document.createElement('input');
    el3.type = 'checkbox';
    el3.id = 'cb_aligned';
    el3.disabled = true;
    el3.classList.add('cb_rmcommand');
    const lab3 = document.createElement('label');
    lab3.setAttribute('for', el3.id);
    lab3.innerText = 'Aligned';
    lab3.classList.add('cblabel');
    cont3.appendChild(el3);
    cont3.appendChild(lab3);
    container.appendChild(cont3);
    
    const headerlab = document.createElement('label');
    headerlab.innerText = "Export DEX";
    header.appendChild(headerlab);

    const btnok = document.createElement('btn');
    btnok.classList.add('modalbtn');
    btnok.classList.add('modalbtn_blue');
    btnok.innerText = 'OK';
    const btncanc = document.createElement('btn');
    btncanc.classList.add('modalbtn');
    btncanc.classList.add('modalbtn_red');
    btncanc.innerText = 'Cancel';
    function closewnd()
    {
        bg.classList.add('invisible');
        setTimeout(function() { 
            bg.classList.add('hidden');
            header.innerHTML = '';
            container.innerHTML = '';
            footer.innerHTML = '';
        }, 300);
    }
    btncanc.onclick = function()
    {
        closewnd();
    }
    btnok.onclick = function()
    {
        const performer = parseInt(el1.value);
        const dexname = el2.value;
        
        do_export_dex(performer, dexname);

        closewnd();
    }
    footer.appendChild(btnok);
    footer.appendChild(btncanc);

    bg.classList.remove('hidden');
    bg.clientWidth;
    bg.classList.remove('invisible');
}

async function do_export_dex(performer, dexname)
{
    setProgress(0, "Exporting file...");
    const worker = new Worker("./dex_worker_write.js");
    const lines = editor.getValue().split(/\r?\n/);
    worker.postMessage({lines: lines, dscfmt: id_fmt.value, performer: performer, dexname: dexname});
    worker.onmessage = worker_message_handler;
}

const menuitem_export_dex = document.getElementById('menuitem_export_dex');
menuitem_export_dex.oncontextmenu = menuitem_export_dex.onclick = function() { export_dex(); }

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
            document.title = lastfilename;
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
        case 'dataexport':
            const filexblob = e.data.data.blob;
            {
                const filelink = document.createElement('a');
                const fileurl = URL.createObjectURL(filexblob);
                filelink.href = fileurl;
                filelink.target = "_blank";
                filelink.download = e.data.data.filename;
                filelink.click();
                filelink.remove();
            }
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