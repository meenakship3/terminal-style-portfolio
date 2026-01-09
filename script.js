
const terminalContent = document.getElementById('terminalContent');
let currentDirectory = null;
let commandHistory = [];
let historyIndex = -1;

const directories = ['about', 'projects', 'skills', 'blog', 'contact'];
const files = ['resume.pdf'];

const directories_data = {
    about: {
        title: 'About Me',
        content: `
I'm a developer who came to tech through curiosity rather than a CS degree, now building production-ready applications with FastAPI, React, PostgreSQL, and Go. My background working across multiple teams at an early-stage startup taught me that great software isn't just about clean code—it's about understanding the humans on the other side. 
<br>
<br>Currently seeking backend or full-stack engineering internships and roles where I can ship impactful work and learn from experienced engineers.
        `
    },
    projects: {
        title: 'Projects',
        content: `
<a href="https://github.com/meenakship3/cli-speedtest" style="text-decoration: none;">
    <div class="project-item">
    <div class="title">CLI Internet Speed Monitor</div>
    <div class="desc">Network monitoring tool with configurable thresholds and real-time Slack notifications for connectivity drops.</div>
    <div class="tech">Tech: Go • Speedtest.net API • Slack Webhooks • CLI Flags</div>
    </div>
</a>

<a href="https://github.com/meenakship3/safeskin" style="text-decoration: none;">
    <div class="project-item">
    <div class="title">Safeskin</div>
    <div class="desc">Skincare product safety analyzer with database of 2,000+ products that identifies harmful ingredients in cosmetics.</div>
    <div class="tech">Tech: FastAPI • PostgreSQL • Selenium • Next.js • React • TypeScript</div>
    </div>
</a>

<a href="https://github.com/meenakship3/lockbox" style="text-decoration: none;">
    <div class="project-item">
    <div class="title">Lockbox</div>
    <div class="desc">Secure desktop application for managing API keys with AES-256-GCM encryption and biometric authentication.</div>
    <div class="tech">Tech: Node.js • Electron • SQLite • Jest • GitHub Actions</div>
    </div>
</a>

<a href="https://github.com/meenakship3/readme-agent" style="text-decoration: none;">
    <div class="project-item">
    <div class="title">README Agent</div>
    <div class="desc">AI-powered documentation generator that automatically creates comprehensive README files for Python projects using Google Gemini API.</div>
    <div class="tech">Tech: Python • Google Gemini AI • File Parsing</div>
    </div>
</a>

<a href="https://github.com/meenakship3/shell-python" style="text-decoration: none;">
    <div class="project-item">
    <div class="title">Python Shell</div>
    <div class="desc">Unix-like shell interpreter with tab completion, command history, and support for built-in and external commands.</div>
    <div class="tech">Tech: Python • subprocess • readline • pathlib</div>
    </div>
</a>
        `
    },
    skills: {
        title: 'Skills',
        content: `
<div class="content-section">
<h3>Languages</h3>
<div class="skill-tags">
<span class="skill-tag">Python</span>
<span class="skill-tag">TypeScript/JavaScript</span>
<span class="skill-tag">Go</span>
<span class="skill-tag">Java</span>
</div>
</div>

<div class="content-section">
<h3>Frontend</h3>
<div class="skill-tags">
<span class="skill-tag">React</span>
<span class="skill-tag">Next.js</span>
<span class="skill-tag">HTML5/CSS3</span>
<span class="skill-tag">Tailwind CSS</span>
</div>
</div>

<div class="content-section">
<h3>Backend</h3>
<div class="skill-tags">
<span class="skill-tag">Node.js</span>
<span class="skill-tag">Express.js</span>
<span class="skill-tag">FastAPI</span>
<span class="skill-tag">REST APIs</span>
</div>
</div>

<div class="content-section">
<h3>Databases</h3>
<div class="skill-tags">
<span class="skill-tag">PostgreSQL</span>
<span class="skill-tag">MongoDB</span>
<span class="skill-tag">SQLite</span>
<span class="skill-tag">MySQL</span>
</div>
</div>

<div class="content-section">
<h3>DevOps & Tools</h3>
<div class="skill-tags">
<span class="skill-tag">Git/GitHub</span>
<span class="skill-tag">Kubernetes</span>
<span class="skill-tag">Bash/Shell Scripting</span>
<span class="skill-tag">GitHub Actions</span>
<span class="skill-tag">Selenium</span>
<span class="skill-tag">Jest</span>
<span class="skill-tag">Generative AI</span>
</div>
</div>
        `
    },
    blog: {
        title: 'Blog',
        content: `
<a href="https://medium.com/ai-in-plain-english/i-think-i-know-how-to-use-cursor-now-48dc7dc96a7a" style="text-decoration: none;">
    <div class="blog-item">
    <div class="date">August 5, 2025</div>
    <div class="title">I Think I Know How to Use Cursor AI Now</div>
    <div class="desc">5 tips to stay sane (and productive) while using Cursor for AI-powered software development.</div>
    </div>
</a>
        `
    },
    contact: {
        title: 'Contact',
        content: `
Let's connect! 

<div class="contact-button" style="margin-top: 1rem;">
<a href="https://www.linkedin.com/in/meenakshipradeep/" target="_blank" rel="noopener noreferrer" style="color: #333; text-decoration: none; padding: 0.5rem 1rem; border: 1px solid #999; border-radius: 3px; display: inline-block;">LinkedIn</a>
<a href="https://github.com/meenakship3" target="_blank" rel="noopener noreferrer" style="color: #333; text-decoration: none; padding: 0.5rem 1rem; border: 1px solid #999; border-radius: 3px; display: inline-block;">GitHub</a>
<a href="mailto:meenakshi.pradeep1@gmail.com" target="_blank" rel="noopener noreferrer" style="color: #333; text-decoration: none; padding: 0.5rem 1rem; border: 1px solid #999; border-radius: 3px; display: inline-block;">Email</a>
</div>

        `
    }
};

function initTerminal() { 
    const firstLine = document.createElement('div');
    firstLine.className = 'terminal-line';
    firstLine.innerHTML = `<span class="prompt">(base) meenakshi@portfolio ~ %</span> <span class="command">ls</span>`;
    terminalContent.appendChild(firstLine);

    const dirLine = document.createElement('div');
    dirLine.className = 'terminal-line';
    let dirHtml = '<div class="directory-listing">';
    directories.forEach(dir => {
        dirHtml += `<span class="dir-name" onclick="changeDir('${dir}')">${dir}</span>`;
    });
    files.forEach(file => {
        const filePath = file === 'resume.pdf' ? 'assets/MeenakshiPradeep-Resume.pdf' : file;
        dirHtml += `<span class="file-name" onclick="window.open('${filePath}', '_blank')">${file}</span>`;
    });
    dirHtml += '</div>';
    dirHtml += `<div class="hint">Type cd &lt;directory&gt; to explore</div>`
    dirLine.innerHTML = dirHtml;
    terminalContent.appendChild(dirLine);

    addNewPrompt();
}

function addNewPrompt(scrollToBottom = true) {
    const inputLine = document.createElement('div');
    inputLine.className = 'terminal-line input-line';
    inputLine.innerHTML = `
        <span class="prompt">(base) meenakshi@portfolio ${currentDirectory ? currentDirectory : '~'} %</span>
        <input 
            type="text" 
            id="commandInput" 
            autocomplete="off"
            spellcheck="false"
        >
    `;
    terminalContent.appendChild(inputLine);
    const input = document.getElementById('commandInput');
    
    // Prevent default scroll behavior on focus if we want to control it manually
    if (scrollToBottom) {
        input.focus();
        terminalContent.scrollTop = terminalContent.scrollHeight;
    } else {
        input.focus({ preventScroll: true });
    }
    
    attachInputListeners(input);
}

function attachInputListeners(input) {
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            e.preventDefault();
            handleAutocomplete(input);
        }
        else if (e.metaKey && e.key === 'k') {
            e.preventDefault();
            clearTerminal();
        }
        else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (historyIndex < commandHistory.length - 1) {
                historyIndex++;
                input.value = commandHistory[commandHistory.length - 1 - historyIndex];
            }
        }
        else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (historyIndex > 0) {
                historyIndex--;
                input.value = commandHistory[commandHistory.length - 1 - historyIndex];
            } else {
                historyIndex = -1;
                input.value = '';
            }
        }
    });

    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleCommand(input.value.trim());
            input.value = '';
        }
    });
}

function handleAutocomplete(input) {
    const value = input.value.toLowerCase();
    
    // Check if the command starts with 'cd ' or 'cat '
    let searchTerm = value;
    let prefix = '';
    
    if (value.startsWith('cd ')) {
        searchTerm = value.substring(3).trim();
        prefix = 'cd ';
    } else if (value.startsWith('cat ')) {
        searchTerm = value.substring(4).trim();
        prefix = 'cat ';
    }

    const allItems = [...directories, ...files];
    const matches = allItems.filter(item => item.startsWith(searchTerm));

    if (matches.length === 1) {
        input.value = `${prefix}${matches[0]}`;
    } else if (matches.length > 1) {
        // Show common prefix
        let commonPrefix = matches[0];
        for (let i = 1; i < matches.length; i++) {
            let j = 0;
            while (j < commonPrefix.length && commonPrefix[j] === matches[i][j]) {
                j++;
            }
            commonPrefix = commonPrefix.substring(0, j);
        }
        input.value = `${prefix}${commonPrefix}`;
    }
}

function handleCommand(input) {
    const cmd = input.trim(); // Keep original case for display, but lower for logic if needed

    if (!cmd) {
        addNewPrompt();
        return;
    }
    
    // Add to history if it's not the same as the last command
    if (commandHistory.length === 0 || commandHistory[commandHistory.length - 1] !== cmd) {
        commandHistory.push(cmd);
    }
    historyIndex = -1;

    const lowerCmd = cmd.toLowerCase();

    // Add command to display
    const cmdLine = terminalContent.querySelector('.input-line');
    if (cmdLine) {
        cmdLine.innerHTML = `<span class="prompt">(base) meenakshi@portfolio ${currentDirectory ? currentDirectory : '~'} %</span> <span class="command">${input}</span>`;
        cmdLine.classList.remove('input-line');
    }

    if (lowerCmd === 'ls') {
        displayLs();
        addNewPrompt();
    } else if (lowerCmd === 'resume') {
        window.open('assets/MeenakshiPradeep-Resume.pdf', '_blank');
        addOutput('Opening resume.pdf...');
        addNewPrompt();
    } else if (lowerCmd === 'cat resume.pdf') {
        window.open('assets/MeenakshiPradeep-Resume.pdf', '_blank');
        addOutput('Opening resume.pdf...');
        addNewPrompt();
    } else if (lowerCmd === 'clear') {
        clearTerminal();
    } else if (lowerCmd === 'whoami') {
        addOutput('visitor');
        addNewPrompt();
    } else if (lowerCmd === 'date') {
        addOutput(new Date().toString());
        addNewPrompt();
    } else if (lowerCmd === 'pwd') {
        addOutput(currentDirectory ? `/Users/meenakshi/${currentDirectory}` : '/Users/meenakshi');
        addNewPrompt();
    } else if (lowerCmd.startsWith('sudo')) {
        addOutput("Trying to gain root access on someone else's website? That's not nice :(");
        addNewPrompt();
    } else if (lowerCmd === 'cd ~' || lowerCmd === 'cd') {
        currentDirectory = null;
        displayLs();
        addNewPrompt();
    } else if (lowerCmd === 'cd ..') {
        currentDirectory = null;
        addNewPrompt();
    } else if (lowerCmd.startsWith('cd ')) {
        const dirName = lowerCmd.slice(3).trim();
        if (directories.includes(dirName)) {
            currentDirectory = dirName;
            const contentElement = displayDirectory(dirName);
            
            // Add prompt WITHOUT scrolling to bottom
            addNewPrompt(false);
            
            // Explicitly scroll the content to the top
            if (contentElement) {
                setTimeout(() => {
                    contentElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 10);
            }
        } else {
            addOutput(`cd: no such file or directory: ${dirName}`);
            addNewPrompt();
        }
    } else if (lowerCmd === 'help') {
        addOutput(`Available commands:
ls              - List all directories and files
resume          - Open resume in a new tab
cat resume.pdf  - View resume file
cd <directory>  - Navigate to a directory
cd .. or cd ~   - Go back to home
clear           - Clear the terminal (or Cmd+K)
whoami          - Display current user
date            - Display current date and time
pwd             - Print working directory
help            - Show this help message`);
        addNewPrompt();
    } else {
        addOutput(`command not found: ${input}`);
        addNewPrompt();
    }
}

function displayLs(shouldScroll = true) {
    const dirLine = document.createElement('div');
    dirLine.className = 'terminal-line';
    let dirHtml = '<div class="directory-listing">';
    
    // Show directories
    directories.forEach(dir => {
        dirHtml += `<span class="dir-name" onclick="changeDir('${dir}')">${dir}</span>`;
    });
    
    // Show files
    files.forEach(file => {
        const filePath = file === 'resume.pdf' ? 'assets/MeenakshiPradeep-Resume.pdf' : file;
        dirHtml += `<span class="file-name" onclick="window.open('${filePath}', '_blank')">${file}</span>`;
    });
    
    dirHtml += '</div>';
    dirHtml += `<div class="hint">Type cd &lt;directory&gt; or cat &lt;file&gt; to explore</div>`;
    dirLine.innerHTML = dirHtml;
    terminalContent.appendChild(dirLine);
    
    if (shouldScroll) {
        terminalContent.scrollTop = terminalContent.scrollHeight;
    }
}

function displayDirectory(dirName) {
    const dir = directories_data[dirName];
    const outputLine = document.createElement('div');
    outputLine.className = 'terminal-line';
    const outputDiv = document.createElement('div');
    outputDiv.className = 'output';
    
    let html = `<div class="content-section"><h3>${dir.title}</h3></div>`;
    html += `<div class="output">${dir.content}</div>`;
    html += `<div class="hint">Type "cd ~" to go back</div>`;
    
    outputDiv.innerHTML = html;
    outputLine.appendChild(outputDiv);
    terminalContent.appendChild(outputLine);
    
    return outputLine;
}

function addOutput(text) {
    const line = document.createElement('div');
    line.className = 'terminal-line';
    line.textContent = text;
    terminalContent.appendChild(line);
    terminalContent.scrollTop = terminalContent.scrollHeight;
}

function clearTerminal() {
    terminalContent.innerHTML = '';
    initTerminal();
}

function changeDir(dirName) {
    currentDirectory = dirName;
    handleCommand(`cd ${dirName}`);
}

function updateTerminalDimensions() {
    const terminalContent = document.getElementById('terminalContent');
    const dimsSpan = document.getElementById('terminal-dimensions');
    
    if (!terminalContent || !dimsSpan) return;

    // Create a temporary span to measure character size
    const testSpan = document.createElement('span');
    testSpan.style.visibility = 'hidden';
    testSpan.style.position = 'absolute';
    testSpan.style.fontFamily = "'Monaco', 'Courier New', monospace";
    testSpan.style.fontSize = '0.95rem'; // Same as .terminal-content in CSS
    testSpan.textContent = 'M';
    document.body.appendChild(testSpan);

    const charWidth = testSpan.getBoundingClientRect().width;
    
    // Calculate line height
    const styles = window.getComputedStyle(terminalContent);
    const lineHeight = parseFloat(styles.lineHeight);

    document.body.removeChild(testSpan);

    const cols = Math.floor(terminalContent.clientWidth / charWidth);
    const rows = Math.floor(terminalContent.clientHeight / lineHeight);

    dimsSpan.textContent = `${cols}x${rows}`;
}

window.addEventListener('resize', updateTerminalDimensions);

// Initialize on load
initTerminal();
updateTerminalDimensions();

