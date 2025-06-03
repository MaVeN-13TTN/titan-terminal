
export const portfolioData = {
  basic: {
    name: "Alex Johnson",
    role: "DevSecOps Engineer",
    location: "San Francisco, CA",
    experience: "5+ years"
  },
  
  summary: `Passionate DevSecOps Engineer with 5+ years of experience building secure, scalable infrastructure and implementing security-first DevOps practices. Specialized in cloud security, container orchestration, and CI/CD pipeline automation. Committed to bridging the gap between development, operations, and security teams to deliver robust, compliant applications at scale.`,
  
  skills: {
    "DevOps Tools": [
      "Docker", "Kubernetes", "Terraform", "Ansible", "Jenkins", 
      "GitLab CI/CD", "GitHub Actions", "ArgoCD", "Helm"
    ],
    "Security Tools": [
      "SAST/DAST", "SonarQube", "Snyk", "Aqua Security", "Falco",
      "Vault", "CyberArk", "Nessus", "Wireshark", "Metasploit"
    ],
    "Cloud Platforms": [
      "AWS", "Azure", "GCP", "CloudFormation", "ARM Templates",
      "Cloud Security Center", "AWS Config", "Azure Sentinel"
    ],
    "Programming & Scripting": [
      "Python", "Bash", "PowerShell", "Go", "YAML", "JSON",
      "JavaScript", "SQL", "HCL"
    ],
    "Monitoring & Logging": [
      "Prometheus", "Grafana", "ELK Stack", "Splunk", "DataDog",
      "New Relic", "CloudWatch", "Azure Monitor"
    ],
    "Compliance & Frameworks": [
      "SOC 2", "ISO 27001", "NIST", "CIS Controls", "GDPR",
      "HIPAA", "PCI DSS", "OWASP Top 10"
    ]
  },
  
  projects: [
    {
      name: "SecureCI/CD Pipeline",
      description: "Built an enterprise-grade CI/CD pipeline with integrated security scanning, automated compliance checks, and zero-downtime deployments. Reduced security vulnerabilities by 85% and deployment time by 60%.",
      techStack: ["Jenkins", "SonarQube", "Docker", "Kubernetes", "Terraform", "AWS"],
      github: "https://github.com/alexjohnson/secure-cicd",
      demo: "https://demo-secure-pipeline.com"
    },
    {
      name: "Cloud Security Automation",
      description: "Developed automated security compliance monitoring for multi-cloud environments. Implements CIS benchmarks, automated remediation, and real-time alerting for security violations.",
      techStack: ["Python", "AWS Config", "Azure Policy", "Terraform", "Lambda"],
      github: "https://github.com/alexjohnson/cloud-security-automation"
    },
    {
      name: "Container Security Platform",
      description: "Created a comprehensive container security solution with vulnerability scanning, runtime protection, and compliance monitoring. Supports Kubernetes and Docker environments.",
      techStack: ["Go", "Kubernetes", "Falco", "Aqua", "Prometheus", "Grafana"],
      github: "https://github.com/alexjohnson/container-security-platform"
    },
    {
      name: "Infrastructure as Code (IaC) Security",
      description: "Developed security-first IaC templates and policies for AWS, Azure, and GCP. Includes automated security validation and policy-as-code implementation.",
      techStack: ["Terraform", "CloudFormation", "Ansible", "Open Policy Agent", "Git"],
      github: "https://github.com/alexjohnson/secure-iac-templates"
    }
  ],
  
  certifications: [
    {
      name: "AWS Certified Security - Specialty",
      issuer: "Amazon Web Services",
      date: "2023",
      validUntil: "2026"
    },
    {
      name: "Certified Kubernetes Security Specialist (CKS)",
      issuer: "Cloud Native Computing Foundation",
      date: "2023",
      validUntil: "2026"
    },
    {
      name: "CompTIA Security+",
      issuer: "CompTIA",
      date: "2022",
      validUntil: "2025"
    },
    {
      name: "Azure Security Engineer Associate",
      issuer: "Microsoft",
      date: "2023",
      validUntil: "2025"
    },
    {
      name: "Certified Information Systems Security Professional (CISSP)",
      issuer: "ISC2",
      date: "2024",
      validUntil: "2027"
    },
    {
      name: "HashiCorp Certified: Terraform Associate",
      issuer: "HashiCorp",
      date: "2023",
      validUntil: "2025"
    }
  ],
  
  contact: {
    email: "alex.johnson@devsecops.dev",
    linkedin: "https://linkedin.com/in/alexjohnson-devsecops",
    github: "https://github.com/alexjohnson",
    website: "https://alexjohnson.dev"
  }
};
