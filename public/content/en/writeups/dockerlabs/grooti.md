# Grooti - Writeup

## 📋 General Information

- **Platform**: DockerLabs
- **Difficulty**: Easy
- **Categories**: Web Exploitation | Research | Privilege Escalation
- **Date**: 30/03/2026
- **Time spent**: ~40 minutes
- **Author**: Samuel Rodríguez aka Testarious

## 📝 Summary

Investigate a web service and follow the clues to find credentials and escalate privileges through a misconfigured cron job.

## 🔍 Recognition and Enumeration

### Port Scan

We start by scanning the target machine's ports with `nmap` to get initial information:

```bash
# Full port scan
nmap -p- --open -sS --min-rate 5000 -vvv -n -Pn 172.17.0.2
```

**Results:**
![Nmap](./content/screenshots/grooti/nmap.png)

As we can see we have three open ports: 22 (SSH), 80 (HTTP) and 3306 (MySQL). When accessing via browser at http://172.17.0.2/ we observe the following website.

![Login](./content/screenshots/grooti/web.png)

We explore the website a bit and discover in the `/imagenes` path a text file `README.txt` that contains a password.

![README.txt](./content/screenshots/grooti/readme.png)

In the other options of the website we don't find anything relevant. So we are going to do a directory scan with `gobuster` to search for hidden paths.

```bash
gobuster dir -u http://172.17.0.2/ -w /usr/share/wordlists/dirbuster/directory-list-2.3-medium.txt -x php,html,txt
```

![Gobuster](./content/screenshots/grooti/directorios.png)

We find the path `/secret` which shows us a table with usernames and a downloadable file with a hint that suggests these usernames can be useful to us.

![Secret](./content/screenshots/grooti/secret.png)

Since we already have a password that we found in the `README.txt` file, we are going to try to log in to the MySQL service with the users from the table to see if any of them is valid.

![Database](./content/screenshots/grooti/database.png)

And we find that `rocket:password1` allows us to log in to the MySQL service. So we proceed to list the database and see its content.

![Database](./content/screenshots/grooti/secret_ruta.png)

And it gives us a new route `/unprivate/secret` which we access and shows us the following website:

![Unprivate](./content/screenshots/grooti/secret_web.png)

## 💻 Exploitation

### Attack Vector 1: Burp Suite

We try to send the form with made-up values and we get a downloaded file `password1.txt` that contains the text "Good try!". Looking at the form, we see that there is a field that is supposed to contain a number between 1 and 100, so to test them we are going to use `burpsuite`.

![Burpsuite](./content/screenshots/grooti/burpsuite.png)

We configure it to test numbers from 1 to 100 and see which one returns something different.

![Burpsuite](./content/screenshots/grooti/result_burpsuite.png)

As we can see, the number 16 returns a different "length", so we try with that number and it returns the file `password16.zip`.

We use `john` to crack the zip file, which is password protected:

```bash
zip2john password16.zip > hash
john --wordlist=/usr/share/wordlists/rockyou.txt hash
```

![John](./content/screenshots/grooti/john_hash_zip.png)

We obtain the password `password1`. So we unzip the file and it gives us a text file with possible passwords:

![Unzip](./content/screenshots/grooti/passwords.png)

We try with `hydra` these passwords to access the system via SSH and the user `grooti`:

![SSH](./content/screenshots/grooti/ssh_user.png)

And it returns the password `YoSoYgRoOt` which we use to access the system.

![SSH](./content/screenshots/grooti/ssh_access.png)


## 🔐 Privilege Escalation

### Local Enumeration

We use the commands `sudo -l` and `find / -perm -4000 2>/dev/null` to search for possible privilege escalation paths but we don't find anything relevant.

We use the command `crontab -l` to list the scheduled tasks of the user `grooti` and we see that there is a task that runs every minute and that executes the script `/opt/cleanup.sh`:

![Crontab](./content/screenshots/grooti/crontab.png)

We look for that script to see what it does, and this one executes the script `/tmp/malicious.sh`:

![Cleanup](./content/screenshots/grooti/cleanup.png)

We edit the script `/tmp/malicious.sh` to execute `chmod u+s /bin/bash`. And we wait for the scheduled task to execute.

Once it has executed, we try to execute the binary `/bin/bash` with the flag `-p` to obtain a shell with `root` privileges:

![Root](./content/screenshots/grooti/root.png)

And we have obtained access to the machine as user `root`! 🎉​

## 🛠️ Tools Used

| Tool | Version | Specific use |
|-------------|---------|----------------|
| nmap | 7.92 | Port and service scanning |
| Burp Suite | Community 2025 | HTTP traffic interception |
| hydra | 9.6 | Brute force |
| gobuster | 3.8.2 | Web enumeration |
| john | 1.9.1 | Hash cracking |
| zip2john | -- | Hash cracking |

## 🏆 Conclusion

A quite simple but didactic machine. It teaches us the importance of paying attention to details and following clues without overlooking anything. Through this machine we learn to carry out a privilege escalation by taking advantage of a script executed by a scheduled task (cron) with root permissions. Keep going! 🚀
