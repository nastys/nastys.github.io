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
require.config({ paths: { vs: './node_modules/monaco-editor/min/vs' } });

require(['vs/editor/editor.main'], async function () {
    monaco.editor.onDidCreateEditor(function () {
        setProgress(-1);
    });

    monaco.languages.register({ id: 'dsc_basic' });
    monaco.languages.setMonarchTokensProvider('dsc_basic',
    {
        defaultToken: 'invalid',
        ignoreCase: false,
        tokenizer: {
            root: [
                [/[A-Z][\w\$]*/, 'type.identifier' ],
                { include: '@whitespace' },
                [/[()]/, '@brackets'],
                [/-?\d+/, 'number'],
                [/[;,]/, 'delimiter'],
            ],
            whitespace: [
                [/[ \t\r\n]+/, 'white'],
            ],
        },
    });
       
    monaco.languages.registerInlayHintsProvider('dsc_basic', {
        provideInlayHints(model, range, token) {
            let h = [];
            
            if (document.getElementById('dscfmt').value === 'ft' && (document.getElementById('cb_showinlayhints').checked || document.getElementById('cb_showinlayhints2').checked)) {
                for (let i = range.startLineNumber; i <= range.endLineNumber; i++) {
                    const line = model.getLineContent(i);
                    const lineTrim = line.trim();
                    const par_start = line.indexOf('(');
                    if (!par_start) continue;
                    const par_end = line.indexOf(')');
                    if (!par_end) continue;
                    const par_in = line.substring(par_start + 1, par_end);
                    const params = par_in.split(',');
                    if (params.length == 0) continue;
                    const opcode = lineTrim.substring(0, lineTrim.indexOf('('));
                    let mappedValue;
                    let paramPos;
                    let brackets = false;
                    switch (opcode) {
                        // value hints
                        case "EXPRESSION":
                            if (document.getElementById('cb_showinlayhints').checked && params[1]) {
                                mappedValue = mappingExpressionFt[params[1].trim()];
                                paramPos = 1;
                            }
                        break;
                        case "LOOK_ANIM":
                            if (document.getElementById('cb_showinlayhints').checked && params[1]) {
                                mappedValue = mappingLookAnimFt[params[1].trim()];
                                paramPos = 1;
                            }
                        break;
                        case "PV_BRANCH_MODE":
                            if (document.getElementById('cb_showinlayhints').checked && params[0]) {
                                mappedValue = mappingBranchFt[params[0].trim()];
                                paramPos = 0;
                            }
                        break;
                        case "HAND_ANIM":
                            if (document.getElementById('cb_showinlayhints').checked && params[2]) {
                                mappedValue = mappingHandAnimFt[params[2].trim()];
                                paramPos = 2;
                            }
                        break;
                        case "MOUTH_ANIM":
                            if (document.getElementById('cb_showinlayhints').checked && params[2]) {
                                mappedValue = mappingMouthAnimFt[params[2].trim()];
                                paramPos = 2;
                            }
                        break;
                        // conversion hints
                        case "TARGET_FLYING_TIME":
                        case "TIME":
                            if (document.getElementById('cb_showinlayhints2').checked && params[0]) {
                                mappedValue = time_to_string(params[0]);
                                paramPos = 0;
                                brackets = true;
                            }
                        break;
                        case "BAR_TIME_SET":
                            if (document.getElementById('cb_showinlayhints2').checked && params[1]) {
                                mappedValue = ts_to_string(Number.parseInt(params[1]));
                                paramPos = 1;
                                brackets = true;
                            }
                        break;
                        case "HAND_SCALE":
                            if (document.getElementById('cb_showinlayhints2').checked && params[2]) {
                                mappedValue = hand_scale_to_string(Number.parseInt(params[2]));
                                paramPos = 2;
                                brackets = true;
                            }
                        break;
                    }
                    if (mappedValue !== null && paramPos !== null && params[paramPos] !== undefined) {
                        let params_length = 0;
                        for (let i = 0; i < paramPos; i++) params_length += params[i].length + 1;
                        params_length += params[paramPos].trimEnd().length + 1;

                        h.push({
                            kind: monaco.languages.InlayHintKind.Type,
                            position: { lineNumber: i, column: par_start + 1 + params_length },
                            label: brackets ? ` [${mappedValue}]` : `: ${mappedValue}`,
                        });
                    }
                }
            }

            return {
                hints: h,
                dispose: () => {},
            };
        },
    });

    const editorContainer = document.getElementById('container');

    monaco.editor.defineTheme('dsce-light', {
        base: 'vs',
        inherit: true,
        rules: [],
        colors: {
          'editorInlayHint.background': '#eeeeee',
          'editorInlayHint.foreground': '#144e8b',
        },
    });

    monaco.editor.defineTheme('dsce-dark', {
        base: 'vs-dark',
        inherit: true,
        rules: [],
        colors: {
          'editorInlayHint.background': '#3a3a3a',
          'editorInlayHint.foreground': '#b8daff',
        },
    });

    editor = await monaco.editor.create(editorContainer, {
        value: ['PV_BRANCH_MODE(0);', 'TIME(0);', 'MUSIC_PLAY();', 'BAR_TIME_SET(120, 3);', 'PV_END();', 'END();', ''].join('\n'),
        language: 'dsc_basic',
        automaticLayout: true,
        glyphMargin: true,
        theme: browser_dark ? 'dsce-dark' : 'dsce-light',
    });
    model = await editor.getModel();

    editorContainer.onpointerdown = menu_close;

    editor.onContextMenu(() => {
        menu_close();
        // based on stackoverflow.com/a/70917930
        const host = editorContainer.querySelector(".shadow-root-host");
        if (host && host.shadowRoot && !host.shadowRoot.querySelector(".monaco-context-custom")) 
        {
          const style = document.createElement("style");
      
          style.setAttribute("class", "monaco-context-custom");
          style.innerHTML = `
            .context-view.monaco-menu-container > .monaco-scrollable-element {
              border-radius: 0.2rem !important;
              box-shadow: 0 2px 10px 0 #1f1f1f22 !important;
            }
            .monaco-action-bar
            {
                padding: 0 !important;
                background: linear-gradient(#eeeef2 80%, #e0e0e3 100%) !important;
            }
            .monaco-menu {
                border: 1px solid rgb(159, 159, 159) !important;
                border-radius: 0.2rem !important; 
            }
            .monaco-menu .action-item {
                color: black !important;
                cursor: default !important;
                border: inherit !important;
            }
            .action-menu-item {
                background-color: inherit !important;
                color: inherit !important;
            }
            .action-menu-item:hover {
                background: linear-gradient(#9a8cee, #7d6fca) !important;
                color: white !important;
            }
            .action-label {
                padding: 0 4px 0 4px !important;
            }
            .keybinding {
                padding-right: 4px !important;
            }
            .action-label.separator {
                padding-top: 0.2em !important;
            }
            @media (prefers-color-scheme: dark) {
                .context-view.monaco-menu-container > .monaco-scrollable-element {
                    box-shadow: 0 2px 10px 0 #cacaca22 !important;
                }
                .monaco-action-bar
                {
                    background: linear-gradient(#2d2d30 80%, #262629 100%) !important;
                }
                .monaco-menu {
                    border: 1px solid rgb(159, 159, 159) !important;
                }
                .monaco-menu .action-item {
                    color: white !important;
                }
            }
          `;
          host.shadowRoot.prepend(style);
        }
    });

    model.onDidChangeContent(() => {
        const allowUndo = model.canUndo();
        const allowRedo = model.canRedo();

        setModified(allowUndo); // TODO not sure if the undo stack has a limit
        if (allowUndo) {
            document.getElementById('toolundo').classList.remove('toolbutton-disabled');
            document.getElementById('menuitem_undo').classList.remove('menuitem-disabled');
        }
        else {
            document.getElementById('toolundo').classList.add('toolbutton-disabled');
            document.getElementById('menuitem_undo').classList.add('menuitem-disabled');
        }

        if (allowRedo) {
            document.getElementById('toolredo').classList.remove('toolbutton-disabled');
            document.getElementById('menuitem_redo').classList.remove('menuitem-disabled');
        }
        else {
            document.getElementById('toolredo').classList.add('toolbutton-disabled');
            document.getElementById('menuitem_redo').classList.add('menuitem-disabled');
        }
    });

    editor.onDidChangeCursorPosition(() => {
        reload_indicators();
    });
});