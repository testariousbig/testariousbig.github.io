# Publisher - Writeup

## 📋 General Information

- **Platform**: TryHackMe
- **Difficulty**: Easy
- **Category**: CVE Exploitation | Research | Privilege Escalation
- **Date**: 05/03/2026
- **Time spent**: ~60 minutes
- **Author**: Samuel Rodríguez aka Testarious

## 📝 Summary

In this CTF we will focus on CVE research and how important it is to do good Google searches to find relevant information. As well as finding new ways to escalate privileges.

## 🔍 Reconnaissance and Enumeration

### Port Scanning

We start by scanning the target machine's ports with Nmap.

```bash
# Commands used
nmap -p- --open -sS --min-rate 5000 -vvv -n -Pn 10.114.145.230
nmap -sCV -p22,80,3306,5038 10.114.145.230
```
**Results:**

![Nmap](./content/screenshots/publisher/nmap.png)


As we can see in the image, the open ports are 22 (SSH) and 80 (HTTP). We scan them more thoroughly to see the service versions.

First, we visit the web available on port 80 and find a kind of blog.

We perform a directory scan with Ffuf to see the available directories.

```bash/
ffuf -w /usr/share/wordlists/dirbuster/directory-list-2.3-medium.txt -u http://10.114.145.230/FUZZ 
```

**Results:**

![Ffuf](./content/screenshots/publisher/ffuf.png)

We discovered the "/spip" directory which appears to be a SPIP installation, a content management system (CMS) for websites. We access it and see that it's running version 4.2.0 using the `wappalyzer` extension.

![Wappalyzer](./content/screenshots/publisher/wappalyzer.png)

## 💻 Exploitation

We are going to search for known vulnerabilities for this tool and by searching on Google we find a CVE associated with this version that allows remote command execution (CVE-2023-27372). To exploit it we are going to use `metasploit`.

![Metasploit](./content/screenshots/publisher/metasploit1.png)

### Attack Vector 1:

We found several exploits in Metasploit that can be used to exploit this vulnerability. We are going to use number 8 `exploit/multi/http/spip_rce_form`. We use the `options` command to see the options we need to configure. And we set the variables `RHOSTS` and `TARGETURI`.

![Metasploit](./content/screenshots/publisher/metasploit2.png)

And finally we execute the exploit.

![Metasploit](./content/screenshots/publisher/metasploit3.png)

And after running successfully, we obtain a reverse shell as user "www-data".

After seeing the system users by looking at the `/etc/passwd` file, we see that there is a user called `think`.

![Passwd](./content/screenshots/publisher/etc_passwd.png)

Which in its `/home/think` directory has the user flag.

![Flag](./content/screenshots/publisher/user_flag.png)

## 🔐 Privilege Escalation

### SSH

We check in the `/home/think/.ssh` folder if there is any SSH key. And we find it. This allows us to connect to the system as user `think`. To do this, we copy the private key and use it with the `ssh` command.

![SSH](./content/screenshots/publisher/ssh.png)

We now have access to the system as user `think`.

### Local Enumeration

We use the command `find / -perm -u=s -type f 2>/dev/null` to see if user `think` can execute commands as root.

![Find](./content/screenshots/publisher/run_container.png)

We found a custom binary that has execution permissions for all users: `/usr/bin/run_container`. When executing it, we see that it calls another script: `/opt/run_container.sh`. So it gives us the idea that we could find a way to edit this script to gain root privileges.

### Escalation Method

In this part we get a bit stuck, since after reviewing the binary, we don't find a direct way to escalate privileges. So here we resort to the help of Google and the TryHackMe community to find the way to escalate privileges. The TryHackMe platform gives us a hint about a service running on the system `apparmor`.

``
AppArmor ("Application Armor") is a Linux kernel security module that implements Mandatory Access Control (MAC) to limit program privileges. It uses file path-based profiles to define what resources (files, networks, capabilities) an application can use, protecting against vulnerabilities even if a process is compromised.
``

After investigating more about AppArmor and the `run_container` binary, we see that this binary seems to be related to Docker or containers, and AppArmor may be setting restrictions. To see the restrictions, we look at the file `/etc/apparmor.d/usr.sbin.ash`:

![AppArmor](./content/screenshots/publisher/apparmor.png)

After seeing the restrictions in this file, we realize that the shell used is `ash` (Almquist shell), which is a very basic and limited shell. So we have to try to change it for a more complete shell, like `bash`. To do this, we notice that the `/dev/shm` directory has execution permissions for all users, so we can copy `bash` there and execute it:

```bash
cp /bin/bash /dev/shm
/dev/shm/bash -p
```

After executing these commands we obtain a `bash` shell and proceed to edit with `nano` the script `/opt/run_container.sh` to add the line `chmod u+s /bin/bash` so that when executing the script, SUID permissions are assigned to `bash`:

![Run Container](./content/screenshots/publisher/nano_script.png)

After saving the changes, we execute the script again:

![Run Container](./content/screenshots/publisher/root.png)

And finally with `/bin/bash -p` we obtain a shell with root privileges and we can read the root flag!

## 🛠️ Tools Used

| Tool | Version | Specific use |
|-------------|---------|----------------|
| nmap | 7.80 | Port and service scanning |
| ffuf | 1.3.1 | Directory fuzzing |
| metasploit | 6.2.60 | Exploit execution |


## 🏆 Conclusion

This CTF teaches us the importance of conducting good research to identify vulnerable services and find associated CVEs, as well as exploits or scripts that exploit them to gain initial access. Then, through sudo permission enumeration, we managed to escalate privileges and gain full system access. Keep going! 🚀