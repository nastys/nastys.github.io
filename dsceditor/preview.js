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
let worker;
let pbackg;
let pwindow;
let canvas;

let entryPos = null;

let running = false;

function preview_play()
{
    pbackg = document.getElementById('preview_background');
    pwindow = document.getElementById('preview_window');
    canvas = document.getElementById('preview_canvas');
    
    pbackg.style.removeProperty('display');
    pwindow.style.removeProperty('display');

    async function play_hit()
    {
        if (running)
        {
            //a_hit.pause();
            a_hit.currentTime = 0;
            a_hit.play();
        }
    }

    async function spawn_target(tgt)
    {
        const target = document.createElement('img');
        target.src = ((type)=>
        {
            switch (type)
            {
                case 0: case 4: case 8: case 18: return './icons/target_triangle.svg';
                case 1: case 5: case 9: case 19: return './icons/target_circle.svg';
                case 2: case 6: case 10: case 20: return './icons/target_cross.svg';
                case 3: case 7: case 11: case 21: return './icons/target_square.svg';
                case 12: return './icons/target_slidel.svg';
                case 13: return './icons/target_slider.svg';
                case 15: return './icons/target_chainl.svg';
                case 16: return './icons/target_chainr.svg';
                default: return './icons/target_unknown.png';
            }
        })(tgt.type);
        target.classList.add('preview_target');
        target.style.left = `${tgt.x}px`;
        target.style.top = `${tgt.y}px`;
        //console.log(`target: left: ${target.style.left}, top: ${target.style.top}`);
        canvas.appendChild(target);

        const icon = document.createElement('img');
        icon.src = ((type)=>
        {
            switch (type)
            {
                case 0: case 4: case 8: case 18: return './icons/icon_triangle.svg';
                case 1: case 5: case 9: case 19: return './icons/icon_circle.svg';
                case 2: case 6: case 10: case 20: return './icons/icon_cross.svg';
                case 3: case 7: case 11: case 21: return './icons/icon_square.svg';
                case 12: return './icons/icon_slidel.svg';
                case 13: return './icons/icon_slider.svg';
                case 15: return './icons/icon_chainl.svg';
                case 16: return './icons/icon_chainr.svg';
                default: return './icons/target_unknown.png';
            }
        })(tgt.type);
        icon.classList.add('preview_target');
        icon.style.left = `${(tgt.x + Math.sin((tgt.angle/1000) * Math.PI / 180) * (tgt.distance / 500))}px`;
        icon.style.top  = `${(tgt.y - Math.cos((tgt.angle/1000) * Math.PI / 180) * (tgt.distance / 500))}px`;
        icon.style.zIndex = 2;
        icon.style.transitionDuration = `${tgt.tft}ms`;
        //console.log(`initial: left: ${icon.style.left}, top: ${icon.style.top}`);
        canvas.appendChild(icon);
        icon.width;
        icon.style.left = `${tgt.x}px`;
        icon.style.top = `${tgt.y}px`;

        setTimeout(()=>{
            if (document.body.contains(target))
            {
                play_hit(); 
                target.remove(); 
                icon.style.opacity = 0;
                icon.style.transform = 'scale(2)';
                icon.style.transitionDuration = '200ms';
                setTimeout(()=>{
                    icon.remove();
                }, 200);
            }
            delete target;
            delete icon;
        }, tgt.tft);
    }

    async function preview_worker_handler(e)
    {
        switch (e.data.msg)
        {
            case "lineset":
            editor.revealLineInCenter(e.data.line);
            editor.setPosition({column: 1, lineNumber: e.data.line});
            break;

            case "target":
            spawn_target(e.data.tgt);
            break;

            case "info":
            alert(e.data.info);
            break;

            case "end":
            preview_stop();
            return;
        }
    }

    const a_hit = new Audio('./sounds/hit.flac');

    if (!entryPos)
    {
        entryPos = editor.getPosition();
    }

    const ts = get_ts();
    
    worker = new Worker("./preview_worker.js");
    running = true;
    worker.postMessage({value: editor.getValue(), line: editor.getPosition().lineNumber, lineCount: model.getLineCount(), time: get_current_time(), bpm: ts.bpm, tft: ts.tft, classicHolds: document.getElementById('dscfmt').value == 'dt2'});
    worker.onmessage = preview_worker_handler;
}

async function previewall()
{
    entryPos = editor.getPosition();
    await editor.setPosition({column: 1, lineNumber: 1});
    preview_play();
}

async function preview_stop(backToInitial)
{
    worker.terminate();
    running = false;
    pbackg.style.display ='none';
    pwindow.style.display ='none';
    canvas.innerHTML = "";
    if (backToInitial)
    {
        editor.revealLineInCenter(entryPos.lineNumber);
        editor.setPosition(entryPos);
    }
    entryPos = null;
}