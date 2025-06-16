/**
 * CommandHandler - Processes terminal commands and returns appropriate responses
 * 
 * This class handles all command processing for the terminal interface.
 * It maps command strings to handler functions and provides utilities
 * for command execution and suggestion.
 */
import { portfolioData } from '../data/portfolioData';
import { asciiArt } from '../data/asciiArt';

export class CommandHandler {
  /**
   * Map of available commands to their handler functions
   * Each handler returns either a string, string array, or animation object
   */
  private commands: { [key: string]: () => string | string[] | { type: 'animation', component: string } } = {
    // File navigation commands
    cd: () => 'Please specify a directory. Try "cd projects" or "cd skills"',
    'cd ..': () => 'Moving up one directory: /home/ndungukinyanjui',
    'cd projects': () => ['Changed directory to: /home/ndungukinyanjui/projects', '', 'Available projects:', ...this.listProjectsDirectory()],
    'cd skills': () => ['Changed directory to: /home/ndungukinyanjui/skills', '', 'Available skill categories:', '• cloud', '• devops', '• security', '• programming', '• web', '• tools'],
    
    // Game commands
    snake: () => ({ type: 'animation', component: 'snake' }),
    
    // System commands
    restart: () => 'RESTART_TERMINAL',
    
    help: () => this.getHelp(),
    about: () => this.getAbout(),
    skills: () => this.getSkills(),
    projects: () => this.getProjects(),
    certs: () => this.getCertifications(),
    contact: () => this.getContact(),
    ls: () => this.listDirectories(),
    'ls projects/': () => this.listProjectsDirectory(),
    whoami: () => this.whoami(),
    pwd: () => '/home/ndungukinyanjui',
    date: () => new Date().toString(),
    uptime: () => this.getUptime(),
    ps: () => this.getProcesses(),
    sudo: () => this.handleSudo(),
    'sudo make me a cto': () => this.sudoMakeMeCTO(),
    fortune: () => this.getFortune(),
    cat: () => 'cat: missing file operand. Try "cat about" or "cat skills"',
    'cat about': () => this.getAbout(),
    'cat skills': () => this.getSkills(),
    'cat skills/cloud': () => this.getCloudSkills(),
    'cat projects': () => this.getProjects(),
    'wget resume.pdf': () => this.downloadResume(),
    echo: () => 'echo: missing argument',
    history: () => 'Command history feature coming soon!',
    exit: () => 'Exit command handled by terminal interface.',
    quit: () => 'Exit command handled by terminal interface.',
    neofetch: () => this.getSystemInfo(),
    'sudo rm -rf /': () => [
      'Nice try! 😄',
      'Permission denied: Cannot delete the universe.',
      'Maybe try "sudo make me a sandwich" instead?'
    ],
    'sudo make me a sandwich': () => [
      '🥪 *poof*',
      'Here\'s your sandwich! Extra security layers included.',
      'Ingredients: SSL certificates, encrypted pickles, and hardened bread.'
    ],
    matrix: () => ({ type: 'animation', component: 'matrix' }),
    coffee: () => ({ type: 'animation', component: 'coffee' }),
    uname: () => this.getUnameInfo(),
    id: () => 'uid=1000(ndungukinyanjui) gid=1000(ndungukinyanjui) groups=1000(ndungukinyanjui),4(adm),24(cdrom),27(sudo),30(dip),46(plugdev),120(lpadmin),131(lxd),132(sambashare),999(docker)',
    'uname -a': () => 'Linux portfolio 5.15.0-security-hardened #1 SMP Mon Oct 30 14:30:15 UTC 2023 x86_64 x86_64 x86_64 GNU/Linux',
    hostname: () => 'portfolio',
    'echo $USER': () => 'ndungukinyanjui',
    'echo $HOME': () => '/home/ndungukinyanjui',
    'echo $SHELL': () => '/bin/bash',
  };

  /**
   * Execute a command and return the result
   * 
   * @param input - The command string to execute
   * @returns Promise resolving to command output (string, string array, or animation object)
   */
  executeCommand(input: string): Promise<string | string[] | { type: 'animation', component: string }> {
    return new Promise((resolve) => {
      const command = input.trim().toLowerCase();
      
      if (command === '') {
        resolve('');
        return;
      }

      // Handle echo command specially
      if (command.startsWith('echo ')) {
        const text = input.slice(5);
        resolve(text);
        return;
      }
      
      // Handle file system navigation commands
      if (command.startsWith('cd ')) {
        resolve(this.handleFileNavigation(command));
        return;
      }

      // Execute registered command if it exists
      if (this.commands[command]) {
        resolve(this.commands[command]());
      } else {
        resolve(`Command not found: ${command}. Type "help" for available commands.`);
      }
    });
  }
  
  /**
   * Handle file system navigation commands
   * 
   * @param command - The navigation command
   * @returns Response message
   */
  private handleFileNavigation(command: string): string[] {
    const path = command.slice(3).trim();
    
    if (path === '..') {
      return ['Moving up one directory: /home/ndungukinyanjui'];
    }
    
    if (path === 'projects') {
      return [
        'Changed directory to: /home/ndungukinyanjui/projects',
        '',
        'Available projects:',
        ...this.listProjectsDirectory()
      ];
    }
    
    if (path === 'skills') {
      return [
        'Changed directory to: /home/ndungukinyanjui/skills',
        '',
        'Available skill categories:',
        '• cloud',
        '• devops',
        '• security',
        '• programming',
        '• web',
        '• tools'
      ];
    }
    
    return [`No such directory: ${path}`];
  }

  getAvailableCommands(): string[] {
    const commandKeys = Object.keys(this.commands).filter(cmd => 
      !cmd.includes(' ') // Filter out compound commands for auto-completion
    );
    // Add 'clear' since it's handled specially in the Terminal component
    return [...commandKeys, 'clear'];
  }

  /**
   * Get help information for available commands
   * 
   * @returns Array of help text lines
   */
  private getHelp(): string[] {
    return [
      '[yellow]Available Commands:[/yellow]',
      '',
      '[green]about[/green]       - Learn who Ndung\'u is',
      '[green]skills[/green]      - Display categorized technical skill sets',
      '[green]projects[/green]    - Showcased DevSecOps & cloud projects',
      '[green]certs[/green]       - Certifications and training',
      '[green]contact[/green]     - Ways to connect and download resume',
      '[green]help[/green]        - This help menu',
      '',
      '[yellow]System Commands:[/yellow]',
      '[green]ls[/green]          - List directories',
      '[green]ls projects/[/green] - List project directories',
      '[green]pwd[/green]         - Show current directory',
      '[green]cd[/green]          - Change directory (try cd projects)',
      '[green]whoami[/green]      - Display username',
      '[green]id[/green]          - Display user and group IDs',
      '[green]uname[/green]       - System information',
      '[green]hostname[/green]    - Display hostname',
      '[green]clear[/green]       - Clear terminal screen',
      '[green]restart[/green]     - Restart terminal (reload page)',
      '[green]history[/green]     - Command history',
      '[green]neofetch[/green]    - System information',
      '[green]uptime[/green]      - System uptime',
      '',
      '[yellow]File Operations:[/yellow]',
      '[green]cat skills/cloud[/green] - View cloud skills',
      '[green]wget resume.pdf[/green] - Download resume',
      '',
      '[yellow]Fun Commands:[/yellow]',
      '[green]matrix[/green]      - Enter the matrix',
      '[green]coffee[/green]      - Brew some coffee',
      '[green]snake[/green]       - Play the classic Snake game',
      '[green]fortune[/green]     - Get a random tech quote',
      '[green]sudo make me a cto[/green] - Try your luck',
      '',
      '[blue]Aliases supported:[/blue]',
      '• ls projects/',
      '• cat skills/cloud',
      '• whoami',
      '• sudo make me a CTO',
      '• uptime',
      '',
      '[blue]Pro Tips:[/blue]',
      '• Use Tab for auto-completion',
      '• Use ↑↓ arrows for command history',
      '• Try "cat <command>" for alternative views',
      '• Ctrl+L clears the terminal'
    ];
  }

  private getAbout(): string[] {
    const { basic, summary } = portfolioData;
    return [
      '[yellow]About Ndung\'u Kinyanjui[/yellow]',
      ''.padEnd(50, '='),
      '',
      `[green]Name:[/green] ${basic.name}`,
      `[green]Role:[/green] ${basic.role}`,
      `[green]Location:[/green] ${basic.location}`,
      `[green]Education:[/green] ${basic.experience} at ${basic.institution}`,
      '',
      '[yellow]About:[/yellow]',
      summary,
      '',
      '[blue]"I will strive for excellence in all my endeavors, embracing challenges as opportunities for growth and remaining steadfast in my pursuit of success."[/blue]'
    ];
  }

  private getSkills(): string[] {
    const { skills } = portfolioData;
    const result = [
      '[yellow]Technical Skills[/yellow]',
      ''.padEnd(50, '='),
      ''
    ];

    Object.entries(skills).forEach(([category, skillList]) => {
      result.push(`[green]${category}:[/green]`);
      result.push(`  ${skillList.join(' • ')}`);
      result.push('');
    });

    return result;
  }

  private getProjects(): string[] {
    const { projects } = portfolioData;
    const result = [
      '[yellow]Featured Projects[/yellow]',
      ''.padEnd(50, '='),
      ''
    ];

    projects.forEach((project, index) => {
      result.push(`[green]${index + 1}. ${project.name}[/green]`);
      result.push(`   ${project.description}`);
      result.push(`   [blue]Tech Stack:[/blue] ${project.techStack.join(', ')}`);
      if (project.github) {
        result.push(`   [blue]GitHub:[/blue] ${project.github}`);
      }
      result.push('');
    });

    return result;
  }

  private getCertifications(): string[] {
    const { certifications } = portfolioData;
    const result = [
      '[yellow]Certifications & Training[/yellow]',
      ''.padEnd(50, '='),
      ''
    ];

    certifications.forEach((cert, index) => {
      result.push(`[green]${index + 1}. ${cert.name}[/green]`);
      result.push(`   Issuer: ${cert.issuer}`);
      result.push(`   Date: ${cert.date}`);
      if (cert.validUntil) {
        result.push(`   Valid Until: ${cert.validUntil}`);
      }
      result.push('');
    });

    return result;
  }

  private getContact(): string[] {
    const { contact } = portfolioData;
    return [
      '[yellow]Contact Information[/yellow]',
      ''.padEnd(50, '='),
      '',
      `[green]Email:[/green]       ${contact.email}`,
      `[green]LinkedIn:[/green]    ${contact.linkedin}`,
      `[green]GitHub:[/green]      ${contact.github}`,
      `[green]Resume:[/green]      [Download Resume PDF]`,
      '',
      '[blue]Tip: Run `wget resume.pdf` or click the resume icon above to download.[/blue]',
      '',
      '[yellow]Available for:[/yellow]',
      '• DevSecOps Engineering roles',
      '• Cloud security consulting', 
      '• AWS infrastructure projects',
      '• Tech community speaking'
    ];
  }

  private listDirectories(): string[] {
    return [
      '[blue]drwxr-xr-x[/blue]  about/',
      '[blue]drwxr-xr-x[/blue]  skills/',
      '[blue]drwxr-xr-x[/blue]  projects/',
      '[blue]drwxr-xr-x[/blue]  certs/',
      '[blue]drwxr-xr-x[/blue]  contact/',
      '[green]-rw-r--r--[/green]  README.md',
      '[green]-rw-r--r--[/green]  resume.pdf'
    ];
  }

  private getProcesses(): string[] {
    return [
      'PID    COMMAND                CPU    MEM    TIME',
      '1234   learning               25%    12MB   ongoing',
      '5678   coding                 40%    18MB   daily',
      '9012   securing               35%    15MB   always',
      '3456   cloud-architecture     10%    8MB    weekly',
      '7890   aws-architecting       45%    22MB   24/7'
    ];
  }

  private handleSudo(): string[] {
    return [
      'We trust you have received the usual lecture from the local System',
      'Administrator. It usually boils down to these three things:',
      '',
      '    #1) Respect the privacy of others.',
      '    #2) Think before you type.',
      '    #3) With great power comes great responsibility.',
      '',
      '[sudo] password for ndungukinyanjui: ********',
      'Access granted! What would you like to sudo today?'
    ];
  }

  private getSystemInfo(): string[] {
    const cloudSkills = portfolioData.skills['☁️ Cloud Platforms & Services'] || [];
    const devopsSkills = portfolioData.skills['⚙️ DevOps & CI/CD'] || [];
    const totalSkills = cloudSkills.length + devopsSkills.length;
    
    return [
      '                     [green]ndungukinyanjui@portfolio[/green]',
      '                     [green]-------------------------[/green]',
      `[green]OS:[/green]             Ubuntu 22.04.3 LTS x86_64`,
      `[green]Host:[/green]           Portfolio Terminal`,
      `[green]Kernel:[/green]         5.15.0-security-hardened`,
      `[green]Uptime:[/green]         ${this.getUptimeInfo()}`,
      `[green]Packages:[/green]       ${totalSkills} core tools installed`,
      `[green]Shell:[/green]          bash 5.1.16`,
      `[green]Resolution:[/green]     1920x1080`,
      `[green]Terminal:[/green]       TITAN Portfolio`,
      `[green]CPU:[/green]            Coffee-powered Brain (8) @ 3.2GHz`,
      `[green]Memory:[/green]         Unlimited curiosity / 16384MiB`,
      `[green]Role:[/green]           DevSecOps Engineer & AWS Solutions Architect`,
      '',
      '                     [yellow]Status: Ready for new challenges![/yellow]'
    ];
  }

  private whoami(): string[] {
    return [
      'ndungukinyanjui',
      'Role: DevSecOps Engineer & Cloud Solutions Architect',
      'Location: Kenya 🌍'
    ];
  }

  private getUptime(): string[] {
    const lifeUptime = this.calculateLifeUptime();
    return [
      `Ndung'u online for: ${lifeUptime}`,
      'System stable. User enthusiasm level: 100%'
    ];
  }

  private sudoMakeMeCTO(): string[] {
    return [
      '[sudo] password for user: *********',
      'Permission denied: Ndung\'u earns that title, not just grants it.'
    ];
  }

  private getFortune(): string {
    const quotes = [
      // Security-Focused Quotes
      '"Only amateurs attack machines; professionals target people." – Bruce Schneier',
      '"Security through obscurity is not security." – Gene Spafford',
      '"If you think technology can solve your security problems, then you don\'t understand the problems and you don\'t understand the technology." – Bruce Schneier',
      '"The best defense against attackers is a well-informed developer."',
      
      // Cloud & DevOps Quotes
      '"Cloud is not a destination. It\'s an operating model." – AWS',
      '"In DevOps, automation is the body, culture is the soul."',
      '"You build it, you run it." – Werner Vogels, Amazon CTO',
      '"Treat your infrastructure like cattle, not pets."',
      '"A good pipeline makes a lazy engineer — in a good way."',
      
      // Motivational / Tech Wisdom Quotes
      '"Stay hungry, stay foolish." – Steve Jobs',
      '"Programs must be written for people to read, and only incidentally for machines to execute." – Harold Abelson',
      '"Talk is cheap. Show me the code." – Linus Torvalds',
      '"Learning never exhausts the mind." – Leonardo da Vinci',
      '"Don\'t optimize for credentials, optimize for competence." – Naval Ravikant',
      '"Discipline equals freedom." – Jocko Willink',
      
      // Bonus Tech Quote
      '"The best way to predict the future is to invent it." – Alan Kay'
    ];
    
    // Get a random quote
    const randomIndex = Math.floor(Math.random() * quotes.length);
    return quotes[randomIndex];
  }

  private getCloudSkills(): string[] {
    const cloudSkills = portfolioData.skills["☁️ Cloud Platforms & Services"] || [];
    return [
      '[yellow]☁️ Cloud Platforms & Services[/yellow]',
      ''.padEnd(35, '='),
      '',
      ...cloudSkills.map(skill => `• ${skill}`)
    ];
  }

  private downloadResume(): string[] {
    return [
      'Downloading resume...',
      '[████████████████████████████████] 100%',
      'Resume downloaded successfully!',
      '',
      '[blue]Note:[/blue] This is a simulated download.',
      'Please contact me via email for the actual resume.'
    ];
  }

  private listProjectsDirectory(): string[] {
    return [
      '[blue]drwxr-xr-x[/blue]  devsecops-pipeline/',
      '[blue]drwxr-xr-x[/blue]  aws-portfolio/',
      '[blue]drwxr-xr-x[/blue]  cloudguard/',
      '[blue]drwxr-xr-x[/blue]  cyberctf-toolkit/',
      '[green]-rw-r--r--[/green]  README.md'
    ];
  }

  private getUnameInfo(): string[] {
    return [
      'Linux'
    ];
  }

  private getHostname(): string {
    return 'portfolio';
  }

  private getKernelVersion(): string {
    return '5.15.0-security-hardened';
  }

  private getOSRelease(): string {
    return 'Ubuntu 22.04.3 LTS';
  }

  private getArchitecture(): string {
    return 'x86_64';
  }

  private getProcessorInfo(): string {
    return 'Coffee-powered Brain (8) @ 3.2GHz';
  }

  private getMemoryInfo(): string {
    return 'Unlimited curiosity / 16384MiB';
  }

  private getSwapInfo(): string {
    return '0 bytes';
  }

  private getUptimeInfo(): string {
    return this.calculateLifeUptime();
  }

  private calculateLifeUptime(): string {
    const birthday = new Date('2004-02-24T00:00:00');
    const now = new Date();
    
    // Calculate total milliseconds lived
    const totalMs = now.getTime() - birthday.getTime();
    
    // Convert to days, hours, minutes
    const totalDays = Math.floor(totalMs / (1000 * 60 * 60 * 24));
    const years = Math.floor(totalDays / 365.25); // Account for leap years
    const remainingDays = totalDays - Math.floor(years * 365.25);
    
    // Calculate remaining hours and minutes from current time
    const hours = now.getHours();
    const minutes = now.getMinutes();
    
    return `${years} years, ${remainingDays} days, ${hours} hours, ${minutes} minutes`;
  }

  private getDNSServers(): string {
    return '8.8.8.8, 8.8.4.4';
  }

  private getIPAddress(): string {
    return '192.168.1.100';
  }

  private getCurrentUser(): string {
    return 'ndungukinyanjui';
  }

  private getUserID(): string {
    return '1000';
  }

  private getGroupID(): string {
    return '1000';
  }

  private isSSHServiceActive(): boolean {
    return true;
  }

  private isFirewallActive(): boolean {
    return true;
  }

  private getHostOS(): string {
    return 'Ubuntu 22.04.3 LTS';
  }

  private getVirtualizationType(): string {
    return 'KVM';
  }

  private isRunningInContainer(): boolean {
    return false;
  }
}
