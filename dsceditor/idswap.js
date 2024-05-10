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
function change_id_mouthAnim(toNew)
{
    const regex = `^[\\t\\f\\v ]*MOUTH_ANIM[\\t\\f\\v ]*\\([\\t\\f\\v ]*(-?\\d*)[\\t\\f\\v ]*,[\\t\\f\\v ]*(-?\\d*)[\\t\\f\\v ]*,[\\t\\f\\v ]*(-?\\d*)[\\t\\f\\v ]*,[\\t\\f\\v ]*(-?\\d*)[\\t\\f\\v ]*,[\\t\\f\\v ]*(-?\\d*)[\\t\\f\\v ]*\\);?(?:\\r?\\n)*`;
    const matches = model.findMatches(regex, true, true, true, null, true, 999999999);
    
    let ops = [];

    for (match of matches)
    {
        const newid = swap_id_mouth(match.matches[3], toNew);
        ops.push({range: match.range, text: `MOUTH_ANIM(${match.matches[1]}, ${match.matches[2]}, ${newid}, ${match.matches[4]}, ${match.matches[5]});\n`});
    }

    model.pushEditOperations([], ops, () => null);
}

function change_id_editMouthAnim(toNew)
{
    const regex = `^[\\t\\f\\v ]*EDIT_MOUTH_ANIM[\\t\\f\\v ]*\\([\\t\\f\\v ]*(-?\\d*)[\\t\\f\\v ]*,[\\t\\f\\v ]*(-?\\d*)[\\t\\f\\v ]*\\);?(?:\\r?\\n)*`;
    const matches = model.findMatches(regex, true, true, true, null, true, 999999999);
    
    let ops = [];

    for (match of matches)
    {
        const newid = swap_id_mouth(match.matches[1], toNew);
        ops.push({range: match.range, text: `EDIT_MOUTH_ANIM(${newid}, ${match.matches[2]});\n`});
    }

    model.pushEditOperations([], ops, () => null);
}

function change_id_editMouth(toNew)
{
    const regex = `^[\\t\\f\\v ]*EDIT_MOUTH[\\t\\f\\v ]*\\([\\t\\f\\v ]*(-?\\d*)[\\t\\f\\v ]*\\);?(?:\\r?\\n)*`;
    const matches = model.findMatches(regex, true, true, true, null, true, 999999999);
    
    let ops = [];

    for (match of matches)
    {
        const newid = swap_id_mouth(match.matches[1], toNew);
        ops.push({range: match.range, text: `EDIT_MOUTH(${newid});\n`});
    }

    model.pushEditOperations([], ops, () => null);
}

function change_id_expression(toNew)
{
    const regex = `^[\\t\\f\\v ]*EXPRESSION[\\t\\f\\v ]*\\([\\t\\f\\v ]*(-?\\d*)[\\t\\f\\v ]*,[\\t\\f\\v ]*(-?\\d*)[\\t\\f\\v ]*,[\\t\\f\\v ]*(-?\\d*)[\\t\\f\\v ]*,[\\t\\f\\v ]*(-?\\d*)[\\t\\f\\v ]*\\);?(?:\\r?\\n)*`;
    const matches = model.findMatches(regex, true, true, true, null, true, 999999999);
    
    let ops = [];

    for (match of matches)
    {
        const newid = swap_id_expression(match.matches[2], toNew);
        ops.push({range: match.range, text: `EXPRESSION(${match.matches[1]}, ${newid}, ${match.matches[3]}, ${match.matches[4]});\n`});
    }

    model.pushEditOperations([], ops, () => null);
}

function change_id_editExpression(toNew)
{
    const regex = `^[\\t\\f\\v ]*EDIT_EXPRESSION[\\t\\f\\v ]*\\([\\t\\f\\v ]*(-?\\d*)[\\t\\f\\v ]*,[\\t\\f\\v ]*(-?\\d*)[\\t\\f\\v ]*\\);?(?:\\r?\\n)*`;
    const matches = model.findMatches(regex, true, true, true, null, true, 999999999);
    
    let ops = [];

    for (match of matches)
    {
        const newid = swap_id_expression(match.matches[2], toNew);
        ops.push({range: match.range, text: `EDIT_EXPRESSION(${newid}, ${match.matches[2]});\n`});
    }

    model.pushEditOperations([], ops, () => null);
}

function change_id_handAnim(toNew)
{
    const regex = `^[\\t\\f\\v ]*HAND_ANIM[\\t\\f\\v ]*\\([\\t\\f\\v ]*(-?\\d*)[\\t\\f\\v ]*,[\\t\\f\\v ]*(-?\\d*)[\\t\\f\\v ]*,[\\t\\f\\v ]*(-?\\d*)[\\t\\f\\v ]*,[\\t\\f\\v ]*(-?\\d*)[\\t\\f\\v ]*,[\\t\\f\\v ]*(-?\\d*)[\\t\\f\\v ]*\\);?(?:\\r?\\n)*`;
    const matches = model.findMatches(regex, true, true, true, null, true, 999999999);
    
    let ops = [];

    for (match of matches)
    {
        const newid = swap_id_hand(match.matches[3], toNew);
        ops.push({range: match.range, text: `HAND_ANIM(${match.matches[1]}, ${match.matches[2]}, ${newid}, ${match.matches[4]}, ${match.matches[5]});\n`});
    }

    model.pushEditOperations([], ops, () => null);
}

function change_id_editHandAnim(toNew)
{
    const regex = `^[\\t\\f\\v ]*EDIT_HAND_ANIM[\\t\\f\\v ]*\\([\\t\\f\\v ]*(-?\\d*)[\\t\\f\\v ]*,[\\t\\f\\v ]*(-?\\d*)[\\t\\f\\v ]*\\);?(?:\\r?\\n)*`;
    const matches = model.findMatches(regex, true, true, true, null, true, 999999999);
    
    let ops = [];

    for (match of matches)
    {
        const newid = swap_id_hand(match.matches[2], toNew);
        ops.push({range: match.range, text: `EDIT_HAND_ANIM($${newid}, ${match.matches[2]});\n`});
    }

    model.pushEditOperations([], ops, () => null);
}

function change_id_lookAnim(toNew)
{
    const regex = `^[\\t\\f\\v ]*LOOK_ANIM[\\t\\f\\v ]*\\([\\t\\f\\v ]*(-?\\d*)[\\t\\f\\v ]*,[\\t\\f\\v ]*(-?\\d*)[\\t\\f\\v ]*,[\\t\\f\\v ]*(-?\\d*)[\\t\\f\\v ]*,[\\t\\f\\v ]*(-?\\d*)[\\t\\f\\v ]*\\);?(?:\\r?\\n)*`;
    const matches = model.findMatches(regex, true, true, true, null, true, 999999999);
    
    let ops = [];

    for (match of matches)
    {
        const newid = ((param) => {return toNew ? (param >= 11 ? (parseInt(param) - 11).toString() : param) : (param < 11 ? (parseInt(param) + 11).toString() : param)})(match.matches[2]);
        ops.push({range: match.range, text: `LOOK_ANIM(${match.matches[1]}, ${newid}, ${match.matches[3]}, ${match.matches[4]});\n`});
    }

    model.pushEditOperations([], ops, () => null);
}

function change_id_editEye(toNew)
{
    const regex = `^[\\t\\f\\v ]*EDIT_EYE[\\t\\f\\v ]*\\([\\t\\f\\v ]*(-?\\d*)[\\t\\f\\v ]*,[\\t\\f\\v ]*(-?\\d*)[\\t\\f\\v ]*\\);?(?:\\r?\\n)*`;
    const matches = model.findMatches(regex, true, true, true, null, true, 999999999);
    
    let ops = [];

    for (match of matches)
    {
        const newid = ((param) => {return toNew ? (param >= 11 ? (parseInt(param) - 11).toString() : param) : (param < 11 ? (parseInt(param) + 11).toString() : param)})(match.matches[2]);
        ops.push({range: match.range, text: `EDIT_EYE(${newid}, ${match.matches[2]});\n`});
    }

    model.pushEditOperations([], ops, () => null);
}

function swap_id_hand(param, toNew)
{
    switch (param)
    {
        case "9":
            return toNew ? "8" : "9";
        case "11":
            return toNew ? "10" : "11";

        case "8":
            return toNew ? "8" : "9";
        case "10":
            return toNew ? "10" : "11";

        // case "0":
        // case "1":
        // case "2":
        // case "3":
        // case "4":
        // case "5":
        // case "6":
        default:
        return param;
    }
}

function swap_id_mouth(param, toNew)
{
    switch (param)
    {
        case "23":
            return toNew ? "6" : "23";
        case "24":
            return toNew ? "0" : "24";
        case "25":
            return toNew ? "2" : "25";
        case "26":
            return toNew ? "3" : "26";
        case "27":
            return toNew ? "4" : "27";
        case "28":
            return toNew ? "6" : "28";
        case "29":
            return toNew ? "8" : "29";
        case "30":
            return toNew ? "9" : "30";
        case "31":
            return toNew ? "1" : "31";
        case "32":
            return toNew ? "5" : "32";
        case "33":
            return toNew ? "7" : "33";

        case "6":
            return toNew ? "6" : "28";
        case "0":
            return toNew ? "0" : "24";
        case "2":
            return toNew ? "2" : "25";
        case "3":
            return toNew ? "3" : "26";
        case "4":
            return toNew ? "4" : "27";
        case "8":
            return toNew ? "8" : "29"; //?
        case "10":
            return toNew ? "10" : "29"; //?
        case "9":
            return toNew ? "9" : "30";
        case "1":
            return toNew ? "1" : "31";
        case "5":
            return toNew ? "5" : "32";
        case "7":
            return toNew ? "7" : "33";

        default:
        return param;
    }
}

function swap_id_expression(param, toNew)
{
    switch (param)
    {
        case "52":
            return toNew ? "0" : "52";
        case "53":
            return toNew ? "3" : "53";
        case "54":
            return toNew ? "6" : "54";
        case "55":
            return toNew ? "8" : "55";
        case "56":
            return toNew ? "9" : "56";
        case "57":
            return toNew ? "10" : "57";
        case "58":
            return toNew ? "11" : "58";
        case "59":
            return toNew ? "12" : "59";
        case "65":
            return toNew ? "2" : "65";
        case "66":
            return toNew ? "1" : "66";
        case "68":
            return toNew ? "5" : "68";
        case "70":
            return toNew ? "7" : "70";
        case "72":
            return toNew ? "13" : "72";
        case "73":
            return toNew ? "14" : "73";

        case "0":
            return toNew ? "0" : "52";
        case "3":
            return toNew ? "3" : "53";
        case "6":
            return toNew ? "6" : "54";
        case "8":
            return toNew ? "8" : "55";
        case "9":
            return toNew ? "9" : "56";
        case "2":
            return toNew ? "2" : "65";
        case "1":
            return toNew ? "1" : "66";
        case "10":
            return toNew ? "10" : "57";
        case "11":
            return toNew ? "11" : "58";
        case "12":
            return toNew ? "12" : "59";
        case "5":
            return toNew ? "5" : "68";
        case "7":
            return toNew ? "7" : "70";
        case "13":
            return toNew ? "13" : "72";
        case "14":
            return toNew ? "14" : "73";

        default:
        return param;
    }
}

function window_idswap()
{
    const bg = document.getElementById('modalbg');
    const container = document.getElementById('modalwndinside');
    const header = document.getElementById('modalwndheader');
    const footer = document.getElementById('modalwndfooter');
    footer.classList.add('gradient');

    let keys = [];
    const keys_selection = ["MOUTH_ANIM", "EXPRESSION", "HAND_ANIM", "LOOK_ANIM", "EDIT_MOUTH", "EDIT_MOUTH_ANIM", "EXPRESSION", "EDIT_HAND_ANIM", "EDIT_EYE"];
    const lines = editor.getValue().split(/\r?\n/);
    for (const line of lines)
    {
        if (line != '')
        {
            const par_start = line.indexOf('(');
            if (par_start > 0)
            {
                const thiscommand = line.substring(0, par_start);
                if (!keys.includes(thiscommand) && keys_selection.includes(thiscommand))
                {
                    keys.push(thiscommand);
                }
            }
        }
    }
    keys.sort();

    keys.forEach(key => {
        const cont = document.createElement('div');
        cont.classList.add('cbcont');
        const el = document.createElement('input');
        el.type = 'checkbox';
        el.id = 'cb_' + key;
        el.classList.add('cb_swapidcommand');
        const lab = document.createElement('label');
        lab.setAttribute('for', el.id);
        lab.innerText = key;
        lab.classList.add('cblabel');
        cont.appendChild(el);
        cont.appendChild(lab);
        container.appendChild(cont);
    });
    
    const operation = document.createElement('select');
    const operation_otn = document.createElement('option');
    operation_otn.value = "old_to_new";
    operation_otn.innerText = "Old to New";
    operation.appendChild(operation_otn);
    const operation_nto = document.createElement('option');
    operation_nto.value = "new_to_old";
    operation_nto.innerText = "New to Old";
    operation.appendChild(operation_nto);
    header.appendChild(operation);
    const headerlab = document.createElement('label');
    headerlab.setAttribute('for', operation.id);
    headerlab.innerText = " animations (experimental)";
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
        const invert = operation.value == "old_to_new";
        const boxes = document.getElementsByClassName('cb_swapidcommand');
        Array.prototype.forEach.call(boxes, function(box) {
            if (box.checked)
            {
                const opcode = box.id.substring(3);
                switch(opcode)
                { 
                    case "MOUTH_ANIM":
                    change_id_mouthAnim(invert);
                    break;

                    case "EXPRESSION":
                    change_id_expression(invert);
                    break;

                    case "HAND_ANIM":
                    change_id_handAnim(invert);
                    break;

                    case "LOOK_ANIM":
                    change_id_lookAnim(invert);
                    break;

                    case "EDIT_MOUTH":
                    change_id_editMouth(invert);
                    break;

                    case "EDIT_MOUTH_ANIM":
                    change_id_editMouthAnim(invert);
                    break;

                    case "EDIT_EXPRESSION":
                    change_id_editExpression(invert);
                    break;

                    case "EDIT_HAND_ANIM":
                    change_id_editHandAnim(invert);
                    break;

                    case "EDIT_EYE":
                    change_id_editEye(invert);
                    break;

                    default:
                    break;
                }
            }
        });

        closewnd();
    }
    footer.appendChild(btnok);
    footer.appendChild(btncanc);

    bg.classList.remove('hidden');
    bg.clientWidth;
    bg.classList.remove('invisible');
}