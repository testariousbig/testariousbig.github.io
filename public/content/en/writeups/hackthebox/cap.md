# Cap - Writeup

## 📋 General Information

- **Platform**: HackTheBox
- **Difficulty**: Easy
- **Category**: Web Exploitation | Log Analysis
- **Date**: 18/02/2026
- **Time spent**: ~30 minutes
- **Author**: Samuel Rodríguez aka Testarious

## 🔍 Reconnaissance and Enumeration

### Port Scanning

We start by scanning the target machine's ports with Nmap.

```bash
# Commands used
nmap -p- --open -sS --min-rate 5000 -vvv -n -Pn 10.129.1.27
nmap -sCV -p 21,22,80 10.129.1.27
```
**Results:**

![Nmap](./content/screenshots/cap/nmap.png)


As we can see in the image, the open ports are 21 (FTP), 22 (SSH) and 80 (HTTP). And we scan them further to see the service versions.

First, we visit the web available on port 80 and we find a dashboard and see a username "nathan" that seems to be the logged-in user.

We save this username for later as it could be a clue for a user available on other services (FTP, SSH).

![Web](./content/screenshots/cap/web.png)


## 💻 Exploitation

While browsing the website, we see that there is a "Security Snapshots" section and when accessing it we see in the URL the directory "/data/2" that seems to generate a downloadable ".pcap" file (packet capture file).

![Security Snapshots](./content/screenshots/cap/cap1.png)

We play a bit with the URL and see that if we put "/data/0" we get a record with quite a bit of data plus a downloadable ".pcap" file.

![Security Snapshots](./content/screenshots/cap/cap2.png)

We proceed to download them and view their content using Tshark.

![Tshark](./content/screenshots/cap/tshark.png)

Reading the log file a bit we see that there is a user "nathan" who performed a successful login to the FTP service along with his password "Buck3tH4TF0RM3!".


### Attack Vector 1:

Since we already have FTP credentials, we try to connect via SSH in case there is credential reuse.

```bash
# Commands used
ssh nathan@10.129.1.27

# Password: Buck3tH4TF0RM3!
```

And we get access to the system as user "nathan" and we obtain the user flag.

![SSH](./content/screenshots/cap/user-flag.png)

## 🔐 Privilege Escalation

### Local Enumeration

After trying several commands (for example, ``sudo -l`` or ``find / -perm -4000 2>/dev/null``) we don't see anything interesting. Therefore, we proceed to see the binaries with capabilities.

```bash
# Capabilities
getcap -r / 2>/dev/null
```
![Capabilities](./content/screenshots/cap/root.png)

We see that the binary ``/usr/bin/python3.8`` has the capability ``cap_setuid``. Therefore, we can execute commands as root.

### Escalation Method

We proceed to execute the binary with the capability ``cap_setuid`` to obtain root access with the following command:

```bash
# Commands used
python3 -c "import os; os.setuid(0); os.system('/bin/bash')"
```


Finally, after executing the command we obtain root access and we obtain the system flag.

![Root Flag](./content/screenshots/cap/root-flag.png)

## 🛠️ Tools Used

| Tool | Version | Specific Use |
|-------------|---------|----------------|
| nmap | 7.92 | Port and service scanning |
| tshark | 4.6.3 | Packet analysis |
| python3 | 3.8 | Command execution |


## 🏆 Conclusion

Good starting point for beginners that teaches how to visualize logs with ``tshark`` and perform a privilege escalation with capabilities. Keep going! 🚀
