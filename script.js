
const terminalContent = document.getElementById('terminalContent');
let currentDirectory = null;

const directories = ['about', 'projects', 'skills', 'blog', 'contact'];

const directories_data = {
    about: {
        title: 'About Me',
        content: `
I'm a passionate full-stack developer with a love for creating beautiful, 
functional web applications. With expertise in modern JavaScript frameworks 
and backend technologies, I craft solutions that solve real problems.

When I'm not coding, you'll find me exploring new technologies, contributing 
to open source, or enjoying the great outdoors.

📧 Email: your.email@example.com
🌐 Website: your-website.com
        `
    },
    projects: {
        title: 'Projects',
        content: `
<div class="project-item">
<div class="title">Portfolio Website</div>
<div class="desc">A terminal-themed portfolio built with vanilla HTML, CSS, and JavaScript.</div>
<div class="tech">Tech: HTML5 • CSS3 • JavaScript</div>
</div>

<div class="project-item">
<div class="title">Task Management App</div>
<div class="desc">Full-stack application for managing projects and tasks with real-time updates.</div>
<div class="tech">Tech: React • Node.js • MongoDB • Express</div>
</div>

<div class="project-item">
<div class="title">E-Commerce Platform</div>
<div class="desc">Modern e-commerce solution with payment processing and inventory management.</div>
<div class="tech">Tech: Next.js • Stripe • PostgreSQL • Tailwind CSS</div>
</div>
        `
    },
    skills: {
        title: 'Skills',
        content: `
<div class="content-section">
<h3>Frontend</h3>
<div class="skill-tags">
<span class="skill-tag">JavaScript</span>
<span class="skill-tag">React</span>
<span class="skill-tag">TypeScript</span>
<span class="skill-tag">HTML/CSS</span>
<span class="skill-tag">Tailwind CSS</span>
</div>
</div>

<div class="content-section">
<h3>Backend</h3>
<div class="skill-tags">
<span class="skill-tag">Node.js</span>
<span class="skill-tag">Express</span>
<span class="skill-tag">Python</span>
<span class="skill-tag">PostgreSQL</span>
<span class="skill-tag">MongoDB</span>
</div>
</div>

<div class="content-section">
<h3>Tools & Other</h3>
<div class="skill-tags">
<span class="skill-tag">Git</span>
<span class="skill-tag">Docker</span>
<span class="skill-tag">AWS</span>
<span class="skill-tag">REST APIs</span>
<span class="skill-tag">Agile</span>
</div>
</div>
        `
    },
    blog: {
        title: 'Blog',
        content: `
<div class="blog-item">
<div class="date">January 15, 2024</div>
<div class="title">Getting Started with Web Performance</div>
<div class="desc">A comprehensive guide to optimizing your web applications for speed and efficiency.</div>
</div>

<div class="blog-item">
<div class="date">December 28, 2023</div>
<div class="title">Modern JavaScript: ES2024 Features</div>
<div class="desc">Exploring the latest JavaScript features and how they improve code quality.</div>
</div>

<div class="blog-item">
<div class="date">December 10, 2023</div>
<div class="title">Building Scalable APIs</div>
<div class="desc">Best practices for designing and building APIs that scale with your application.</div>
</div>
        `
    },
    contact: {
        title: 'Contact',
        content: `
Let's connect! You can find me on:

<div class="skill-tags" style="margin-top: 1rem;">
<a href="https://github.com" target="_blank" rel="noopener noreferrer" style="color: #333; text-decoration: none; padding: 0.5rem 1rem; border: 1px solid #999; border-radius: 3px; display: inline-block;">GitHub</a>
<a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" style="color: #333; text-decoration: none; padding: 0.5rem 1rem; border: 1px solid #999; border-radius: 3px; display: inline-block;">LinkedIn</a>
</div>

📧 Email: your.email@example.com
💼 LinkedIn: linkedin.com/in/yourprofile
🔗 GitHub: github.com/yourprofile
        `
    }
};

function initTerminal() {
    const firstLine = document.createElement('div');
    firstLine.className = 'terminal-line';
    firstLine.innerHTML = `<span class="prompt">(base) meenu@Meenakshi-MacBook-Pro ~ %</span> <span class="command">ls</span>`;
    terminalContent.appendChild(firstLine);

    const dirLine = document.createElement('div');
    dirLine.className = 'terminal-line';
    let dirHtml = '<div class="directory-listing">';
    directories.forEach(dir => {
        dirHtml += `<span class="dir-name" onclick="changeDir('${dir}')">${dir}</span>`;
    });
    dirHtml += '</div>';
    dirLine.innerHTML = dirHtml;
    terminalContent.appendChild(dirLine);

    addNewPrompt();
}

function addNewPrompt() {
    const inputLine = document.createElement('div');
    inputLine.className = 'terminal-line input-line';
    inputLine.innerHTML = `
        <span class="prompt">(base) meenu@Meenakshi-MacBook-Pro ${currentDirectory ? '~/' + currentDirectory : '~'} %</span>
        <input 
            type="text" 
            id="commandInput" 
            autocomplete="off"
            spellcheck="false"
        >
    `;
    terminalContent.appendChild(inputLine);
    const input = document.getElementById('commandInput');
    input.focus();
    terminalContent.scrollTop = terminalContent.scrollHeight;
    attachInputListeners(input);
}

function attachInputListeners(input) {
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            e.preventDefault();
            handleAutocomplete(input);
        }
        else if (e.ctrlKey && e.key === 'c') {
            e.preventDefault();
            input.value = '';
        }
        else if (e.metaKey && e.key === 'k') {
            e.preventDefault();
            clearTerminal();
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
    const matches = directories.filter(dir => dir.startsWith(value));

    if (matches.length === 1) {
        input.value = matches[0];
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
        input.value = commonPrefix;
    }
}

function handleCommand(input) {
    const cmd = input.trim().toLowerCase();

    if (!cmd) {
        addNewPrompt();
        return;
    }

    // Add command to display
    const cmdLine = terminalContent.querySelector('.input-line');
    if (cmdLine) {
        cmdLine.innerHTML = `<span class="prompt">(base) meenu@Meenakshi-MacBook-Pro ${currentDirectory ? '~/' + currentDirectory : '~'} %</span> <span class="command">${input}</span>`;
        cmdLine.classList.remove('input-line');
    }

    if (cmd === 'ls') {
        displayLs();
    } else if (cmd === 'clear') {
        clearTerminal();
    } else if (cmd === 'cd ~' || cmd === 'cd') {
        currentDirectory = null;
        displayLs();
        addNewPrompt();
    } else if (cmd === 'cd ..') {
        currentDirectory = null;
        displayLs();
        addNewPrompt();
    } else if (cmd.startsWith('cd ')) {
        const dirName = cmd.slice(3).trim();
        if (directories.includes(dirName)) {
            currentDirectory = dirName;
            displayDirectory(dirName);
            addNewPrompt();
        } else {
            addOutput(`cd: no such file or directory: ${dirName}`);
            addNewPrompt();
        }
    } else if (cmd === 'help') {
        addOutput(`Available commands:
ls              - List all directories
cd <directory>  - Navigate to a directory (cd about, cd projects, etc.)
cd .. or cd ~   - Go back to home
clear           - Clear the terminal (or Cmd+K)
help            - Show this help message`);
        addNewPrompt();
    } else {
        addOutput(`command not found: ${input}`);
        addNewPrompt();
    }
}

function displayLs() {
    const dirLine = document.createElement('div');
    dirLine.className = 'terminal-line';
    let dirHtml = '<div class="directory-listing">';
    directories.forEach(dir => {
        dirHtml += `<span class="dir-name" onclick="changeDir('${dir}')">${dir}</span>`;
    });
    dirHtml += '</div>';
    dirLine.innerHTML = dirHtml;
    terminalContent.appendChild(dirLine);
    terminalContent.scrollTop = terminalContent.scrollHeight;
}

function displayDirectory(dirName) {
    const dir = directories_data[dirName];
    const outputLine = document.createElement('div');
    outputLine.className = 'terminal-line';
    const outputDiv = document.createElement('div');
    outputDiv.className = 'output';
    
    let html = `<div class="content-section"><h3>${dir.title}</h3></div>`;
    html += `<div class="output">${dir.content}</div>`;
    html += `<div class="hint">Type "cd .." to go back</div>`;
    
    outputDiv.innerHTML = html;
    outputLine.appendChild(outputDiv);
    terminalContent.appendChild(outputLine);
    terminalContent.scrollTop = terminalContent.scrollHeight;
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

// Initialize on load
initTerminal();

