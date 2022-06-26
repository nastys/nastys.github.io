require.config({ paths: { vs: './node_modules/monaco-editor/min/vs' } });

require(['vs/editor/editor.main'], function () {
    monaco.editor.onDidCreateEditor(function() {
        setProgress(-1);
    });

    editor = monaco.editor.create(document.getElementById('container'), {
        value: ['PV_BRANCH_MODE(0);', 'TIME(0);', 'PV_END();', 'END();', ''].join('\n'),
        language: 'javascript',
        automaticLayout: true,
        theme: browser_dark ? 'vs-dark' : 'vs-light',
    });
});