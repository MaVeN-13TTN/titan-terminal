import { portfolioData } from '../data/portfolioData';
import { asciiArt } from '../data/asciiArt';

export class CommandHandler {
  private commands: { [key: string]: () => string | string[] | { type: 'animation', component: string } } = {
    help: () => this.getHelp(),
    about: () => this.getAbout(),
    skills: () => this.getSkills(),
    projects: () => this.getProjects(),
    certs: () => this.getCertifications(),
    contact: () => this.getContact(),
    clear: () => {
      // This will be handled by the terminal component
      return '';
    },
    ls: () => this.listDirectories(),
    whoami: () => portfolioData.basic.name,
    pwd: () => '/home/devsecops',
    date: () => new Date().toString(),
    uptime: () => 'System has been running for 2 years, 5 months (since career started)',
    ps: () => this.getProcesses(),
    sudo: () => this.handleSudo(),
    cat: () => 'cat: missing file operand. Try "cat about" or "cat skills"',
    'cat about': () => this.getAbout(),
    'cat skills': () => this.getSkills(),
    'cat projects': () => this.getProjects(),
    echo: () => 'echo: missing argument',
    history: () => 'Command history feature coming soon!',
    exit: () => 'Thanks for visiting! Refresh to restart the session.',
    quit: () => 'Thanks for visiting! Refresh to restart the session.',
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
    coffee: () => ({ type: 'animation', component: 'coffee' })
  };

  executeCommand(input: string): Promise<string | string[] | { type: 'animation', component: string }> {
    return new Promise((resolve) => {
      const command = input.trim().toLowerCase();
      
      if (command === '') {
        resolve('');
        return;
      }

      if (command === 'clear') {
        // Signal to clear terminal
        resolve('CLEAR_TERMINAL');
        return;
      }

      if (command.startsWith('echo ')) {
        const text = input.slice(5);
        resolve(text);
        return;
      }

      if (this.commands[command]) {
        resolve(this.commands[command]());
      } else {
        resolve(`Command not found: ${command}. Type "help" for available commands.`);
      }
    });
  }

  getAvailableCommands(): string[] {
    return Object.keys(this.commands).filter(cmd => 
      !cmd.includes(' ') // Filter out compound commands for auto-completion
    );
  }

  private getHelp(): string[] {
    return [
      '[yellow]Available Commands:[/yellow]',
      '',
      '[green]about[/green]      - Learn about me',
      '[green]skills[/green]     - View technical skills',
      '[green]projects[/green]   - Browse my projects',
      '[green]certs[/green]      - View certifications',
      '[green]contact[/green]    - Get in touch',
      '',
      '[yellow]System Commands:[/yellow]',
      '[green]ls[/green]         - List directories',
      '[green]pwd[/green]        - Show current directory',
      '[green]whoami[/green]     - Display username',
      '[green]clear[/green]      - Clear terminal',
      '[green]history[/green]    - Command history',
      '[green]neofetch[/green]   - System information',
      '',
      '[yellow]Fun Commands:[/yellow]',
      '[green]matrix[/green]     - Enter the matrix',
      '[green]coffee[/green]     - Brew some coffee',
      '[green]sudo[/green]       - Try some sudo commands',
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
      '[yellow]About Me[/yellow]',
      ''.padEnd(50, '='),
      '',
      `[green]Name:[/green] ${basic.name}`,
      `[green]Role:[/green] ${basic.role}`,
      `[green]Location:[/green] ${basic.location}`,
      `[green]Experience:[/green] ${basic.experience}`,
      '',
      '[yellow]Summary:[/yellow]',
      summary,
      '',
      '[blue]"Security is not a product, but a process."[/blue]'
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
      if (project.demo) {
        result.push(`   [blue]Demo:[/blue] ${project.demo}`);
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
      `[green]Email:[/green] ${contact.email}`,
      `[green]LinkedIn:[/green] ${contact.linkedin}`,
      `[green]GitHub:[/green] ${contact.github}`,
      '',
      '[blue]Feel free to reach out for opportunities or collaboration![/blue]',
      '',
      '[yellow]Available for:[/yellow]',
      '• DevSecOps Engineering roles',
      '• Security consulting',
      '• Cloud infrastructure projects',
      '• Speaking engagements'
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
      '1234   learning               15%    8MB    2y 5m',
      '5678   coding                 45%    16MB   2y 3m',
      '9012   securing               30%    12MB   1y 8m',
      '3456   coffee-brewing         5%     4MB    24/7',
      '7890   problem-solving        85%    20MB   Always'
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
      '[sudo] password for devsecops: ********',
      'Access granted! What would you like to sudo today?'
    ];
  }

  private getSystemInfo(): string[] {
    return [
      '                     [green]devsecops@portfolio[/green]',
      '                     [green]-------------------[/green]',
      `[green]OS:[/green]             Terminal Portfolio v2.0`,
      `[green]Host:[/green]           DevSecOps Workstation`,
      `[green]Kernel:[/green]         Security-Hardened`,
      `[green]Uptime:[/green]         2 years, 5 months`,
      `[green]Packages:[/green]       ${portfolioData.skills['DevOps Tools'].length + portfolioData.skills['Security Tools'].length} tools installed`,
      `[green]Shell:[/green]          /bin/bash`,
      `[green]Resolution:[/green]     1920x1080`,
      `[green]Terminal:[/green]       Portfolio Terminal`,
      `[green]CPU:[/green]            Caffeine-powered Brain`,
      `[green]Memory:[/green]         Unlimited curiosity`,
      '',
      '                     [yellow]Status: Ready for new challenges![/yellow]'
    ];
  }
}
