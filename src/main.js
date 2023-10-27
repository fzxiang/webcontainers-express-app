import { WebContainer } from '@webcontainer/api';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';

import files from '../files.json';

import './style/index.css';
import 'xterm/css/xterm.css';

// frontend
document.querySelector('#app').innerHTML = `
  <div class="container">
    <div class="editor">
      <textarea>I am a textarea</textarea>
    </div>
    <div class="preview">
      <iframe src="loading.html"></iframe>
    </div>
    <div class="terminal"></div>
  </div>
`
/** @type {HTMLIFrameElement | null} */
const iframeEl = document.querySelector('iframe');

/** @type {HTMLTextAreaElement | null} */
const textareaEl = document.querySelector('textarea');

/** @type {HTMLTextAreaElement | null} */
const terminalEl = document.querySelector('.terminal');


/** @type {import('@webcontainer/api').WebContainer}  */
let webcontainerInstance;

/** 终端 */
const terminal = new Terminal({
  convertEol: true, // 强制光标从头开始
});

const fitAddon = new FitAddon();
terminal.loadAddon(fitAddon);
fitAddon.fit();

async function writeIndexJS(content) {
  await webcontainerInstance.fs.writeFile('/index.js', content);
};

/**
 * @param {Terminal} terminal
 */
async function startShell(terminal) {
  const shellProcess = await webcontainerInstance.spawn('jsh', {
    terminal: {
      cols: terminal.cols,
      rows: terminal.rows,
    },
  });
  shellProcess.output.pipeTo(
    new WritableStream({
      write(data) {
        terminal.write(data);
      },
    })
  );

  const input = shellProcess.input.getWriter();
  terminal.onData((data) => {
    input.write(data);
  });

  return shellProcess;
};

window.addEventListener('load', async () => {
  textareaEl.value = files['index.js'].file.contents;
  textareaEl.addEventListener('input', (e) => {
    writeIndexJS(e.currentTarget.value);
  });

  // 终端
  terminal.open(terminalEl);


	// Call only once
	webcontainerInstance = await WebContainer.boot();
	await webcontainerInstance.mount(files)

  webcontainerInstance.on('server-ready', (port, url) => {
    iframeEl.src = url;
  });

  const shellProcess = startShell(terminal);
  window.addEventListener('resize', () => {
    fitAddon.fit();
    shellProcess.resize({
      cols: terminal.cols,
      rows: terminal.rows,
    });
  });

});