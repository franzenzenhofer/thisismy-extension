function createOverlay() {
  const overlay = document.createElement('div');
  overlay.setAttribute('id', 'chatgpt-filedrag-overlay');
  overlay.innerHTML = '<p>Drop file to upload</p>';
  return overlay;
}

function onDragOver(e, target, overlay) {
  e.preventDefault();
  e.stopPropagation();
  target.classList.add('dragging');
  if (!document.getElementById('chatgpt-filedrag-overlay')) {
    document.body.appendChild(overlay);
  }
}

function onDragLeave(e, target, overlay) {
  e.preventDefault();
  e.stopPropagation();
  if (document.getElementById('chatgpt-filedrag-overlay') && e.relatedTarget === null) {
    document.body.removeChild(overlay);
  }
}

function onDrop(e, target, overlay) {
  e.preventDefault();
  e.stopPropagation();
  target.classList.remove('dragging');
  if (document.getElementById('chatgpt-filedrag-overlay')) {
    document.body.removeChild(overlay);
  }

  // Read all dropped files
  const files = e.dataTransfer.files;
  let fileCounter = 0;

  // Function to process each file
  const processFile = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      let contents = e.target.result;
      contents = contents.replace(/[\s\n]+/g, ' ').trim();
      let header = '\n\nThis is my current ' + file.name + '\n\n';
      let footer = '\n\nThis is the end of ' + file.name + '\n';
      const cursorPosition = target.selectionStart;
      const textBeforeCursor = target.value.slice(0, cursorPosition);
      const textAfterCursor = target.value.slice(cursorPosition);
      target.value = textBeforeCursor + header + contents + footer + textAfterCursor;

      target.style.maxHeight = '250px';
      target.style.height = '85px';
      target.style.overflowY = 'hidden';
      target.focus(); // Set focus on the textarea

      // Move the cursor to the beginning of the textarea
  target.setSelectionRange(0, 0);
  
  // Scroll the textarea to the top
  target.scrollTop = 0;
      // Process the next file
      fileCounter++;
      if (fileCounter < files.length) {
        processFile(files[fileCounter]);
      }
    };
    reader.readAsText(file);
  }

  // Start processing the first file
  if (files.length > 0) {
    processFile(files[fileCounter]);
  }
}




function onMouseLeave(e, overlay) {
  if (document.getElementById('chatgpt-filedrag-overlay')) {
    document.body.removeChild(overlay);
  }
}

function onDragEnd(e, overlay) {
  if (document.getElementById('chatgpt-filedrag-overlay')) {
    document.body.removeChild(overlay);
  }
}

function init() {
  const target = document.querySelector('textarea[placeholder="Send a message."]');
  const overlay = createOverlay();
  if (target) {
    document.addEventListener('dragover', (e) => onDragOver(e, target, overlay));
    document.addEventListener('drop', (e) => onDrop(e, target, overlay));
    document.addEventListener('mouseleave', (e) => onMouseLeave(e, overlay));
    document.addEventListener('dragend', (e) => onDragEnd(e, overlay)); // Add this line
  } else {
    setTimeout(init, 500); // Retry after a delay
  }
}

init();
console.log('ChatGPT File Drag extension injected');


