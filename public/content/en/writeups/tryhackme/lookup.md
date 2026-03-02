# Lookup - Writeup

## 📋 General Information

- **Platform**: TryHackMe
- **Difficulty**: Easy
- **Category**: Brute Force | Metasploit | PATH Hijacking
- **Date**: 02/03/2026
- **Time spent**: ~50 minutes
- **Author**: Samuel Rodríguez aka Testarious

## 🔍 Reconnaissance and Enumeration

### Port Scanning

We start by scanning the target machine's ports with Nmap.

```bash
# Commands used
nmap -p- --open -sS --min-rate 5000 -vvv -n -Pn 10.113.179.215
nmap -sCV -p22,80 10.113.179.215
```
**Results:**

![Nmap](./content/screenshots/lookup/nmap.png)

As we can see in the image, the open ports are 22 (SSH) and 80 (HTTP). We scan them more thoroughly to see the service versions.

### Web Reconnaissance

First, we try to access the web service exposed on port 80 (HTTP). To do this, we need to edit the `/etc/hosts` file and add the target machine's IP with the machine name (lookup.thm). By doing this, we can access the available web page and find a login panel.

![Web](./content/screenshots/lookup/login.png)

We try to log in with default credentials like `admin:admin` or `root:root` but it doesn't work. When doing this, we notice that the error message is different on both occasions. With the admin user it says "Wrong password", with the root user it says "Wrong username or password".

We also perform a directory scan with Ffuf to see if there are any hidden directories. But nothing comes up.

```bash
ffuf -w /usr/share/wordlists/dirbuster/directory-list-2.3-medium.txt -u http://lookup.thm/FUZZ 
```

## 💻 Exploitation

### Attack Vector 1: Brute Force

As we have seen that the error message is different depending on whether the user is correct or not, we perform a brute force with Ffuf to enumerate users, using a common password like "123456".

```bash
ffuf -w /usr/share/wordlists/SecLists/Usernames/Names/names.txt -X POST -d "username=FUZZ&password=123456" -H "Content-Type: application/x-www-form-urlencoded" -u http://lookup.thm/login.php -fw 10
```

![Ffuf](./content/screenshots/lookup/ffuf_user.png)

This way we discover that the users `jose` and `admin` exist. We proceed to do brute force with `hydra` to obtain the password of the user `jose`.

```bash
hydra -l jose -P /usr/share/wordlists/rockyou.txt lookup.thm http-post-form "/login.php:username=^USER^&password=^PASS^:Wrong password"
```

![Hydra](./content/screenshots/lookup/hydra.png)

As we can see in the image, we obtain the password of the user `jose:password123`.

When accessing with these credentials, it redirects us to the subdomain `files.lookup.thm` that we have to add to the `/etc/hosts` file to access, and when doing this, we find the elFinder control panel.

![elFinder](./content/screenshots/lookup/elFinder.png)

### Attack Vector 2: elFinder

We search for the elFinder version that is in the control panel.

![elFinder](./content/screenshots/lookup/elFinder_version.png)

And using metasploit, we search for elFinder vulnerabilities for that version.

![metasploit](./content/screenshots/lookup/metasploit_search.png)

We find an exploit that would allow us to do a `Command Injection`. So we proceed to use it.

![metasploit](./content/screenshots/lookup/metasploit_run.png)

As we can see in the image, first we set the `RHOSTS` with the target machine's IP and launch the exploit, obtaining a `meterpreter` session.

![meterpreter](./content/screenshots/lookup/meterpreter.png)

We have entered the system as the user `www-data`. We proceed to see the `/etc/passwd` file to see the system users.

![meterpreter](./content/screenshots/lookup/etc_passwd.png)

We see that there is a user `think`.

## 🔐 Privilege Escalation

### Local Enumeration

We search for binaries with SUID permissions with the `find` command. And we see that there is a binary `pwm` that has SUID permissions.

```bash
find / -perm -u=s -type f 2>/dev/null
```

![find](./content/screenshots/lookup/pwm.png)

When executing the binary `pwm`, we observe the output and see that it first executes the `id` command and then gives an error that the file `/home/www-data/.passwords` does not exist.

![pwm](./content/screenshots/lookup/www-data_pwm.png)

At this point we try to do a `PATH hijacking` so that the binary `pwm` can obtain the file `/home/think/.passwords`. To do this, we create an `id` file in the `/tmp` directory and in the file content, we put the output that would come out when executing the `id` command by the user `think`.

```bash
echo '#!/bin/bash' > /tmp/id
echo 'echo "uid=1000(think) gid=1000(think) groups=1000(think)"' >> /tmp/id
chmod +x /tmp/id
export PATH=/tmp:$PATH
```

After executing the binary `pwm`, we obtain the file `/home/think/.passwords`.

![meterpreter](./content/screenshots/lookup/think_passwords.png)

Back on our machine, we create a text file with the content of the `/home/think/.passwords` file and use it to do brute force with `hydra` to obtain the password of the user `think`.

```bash
hydra -l think -P /root/think_passwd.txt ssh://10.113.179.215:22
```

![hydra](./content/screenshots/lookup/hydra_think.png)

We obtain the password of the user `think`. With this password, we access via SSH to the target machine as the user `think` and obtain the user flag.

![flag_user](./content/screenshots/lookup/flag_user.png)

### Escalation Method

We execute the command `sudo -l` to see the sudo permissions of the user `think`.

![sudo](./content/screenshots/lookup/sudo.png)

We see that the binary `look` has sudo permissions. So we can see the root flag.

![flag_root](./content/screenshots/lookup/flag_root.png)

Alternatively, using the `look` command with sudo permissions, we can see that in `/root/.ssh/id_rsa` there is an `ssh` key that we can copy to our machine to access as user `root` to the victim machine.

## 🛠️ Tools Used

| Tool | Version | Specific use |
|-------------|---------|----------------|
| nmap | 7.80 | Port and service scanning |
| ffuf | 1.3.1 | Directory fuzzing |
| hydra | 9.0 | Brute force |
| metasploit | 6.4.55-dev | Exploit search and execution |


## 🏆 Conclusion

Lookup has been an entertaining machine although somewhat frustrating at certain points. User enumeration requires paying attention to small details that are easy to overlook, and privilege escalation via PATH Hijacking, although known in theory, is harder to see when you're in the middle of the challenge. In summary, a machine that teaches you to be more methodical and not to discard anything. Keep going! 🚀