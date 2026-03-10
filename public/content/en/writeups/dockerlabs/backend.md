# Backend - Writeup

## 📋 General Information

- **Platform**: DockerLabs
- **Difficulty**: Easy
- **Categories**: SQL Injection | Cracking | Privilege Escalation
- **Date**: 10/03/2026
- **Time spent**: ~15 minutes
- **Author**: Samuel Rodríguez aka Testarious

## 📝 Summary

Exploit a login panel through SQL Injection to gain system access and escalate privileges by cracking the `root` user's password.

## 🔍 Reconnaissance and Enumeration

### Port Scanning

We start by scanning the target machine's ports with `nmap` to gather initial information:

```bash
# Full port scan
nmap -p- --open -sS --min-rate 5000 -vvv -n -Pn 172.17.0.2

# Detailed scan of open ports
nmap -sCV -p22,80 172.17.0.2
```

**Results:**
![Nmap](./content/screenshots/backend/nmap.png)

As we can see, we have two open ports: 22 (SSH) and 80 (HTTP). When accessing http://172.17.0.2/login.html via browser, we observe a login panel.

![Login](./content/screenshots/backend/login_panel.png)

We try entering default credentials in the login form, but it doesn't work. So we proceed to attempt a SQL injection. For this, we enter `' or 1=1' --` in both the username and password fields. The web page shows us a syntax error in the SQL query.

![SQL Injection Error](./content/screenshots/backend/sql_error.png)

## 💻 Exploitation

### Attack Vector 1: SQL Injection

We use `sqlmap` to exploit the SQL injection and explore the database in search of some credentials. With the following command, we obtain the available databases:

```bash
sqlmap -u "http://172.17.0.2/login.html" --batch --forms --dbs
```
![SQLMap DBs](./content/screenshots/backend/databases.png)

With the following command, we obtain the tables of the `register` database:

```bash
sqlmap -u "http://172.17.0.2/login.html" --batch --forms -D register --tables
```
![SQLMap Tables](./content/screenshots/backend/tables.png)

With the following command, we obtain the data from the `users` table:

```bash
sqlmap -u "http://172.17.0.2/login.html" --batch --forms -D register -T users --dump
```
![SQLMap Users](./content/screenshots/backend/users.png)

We obtain the credentials of three users: `paco`, `pepe`, and `juan`.

We use them in the login panel and it redirects to the home page, so it doesn't seem they serve any purpose on the website. Therefore, we're going to test if there is credential reuse on other exposed services, such as `SSH`.

![SSH Connection](./content/screenshots/backend/ssh_pepe.png)

Indeed, the credentials work and we obtain system access as user `pepe`.

## 🔐 Privilege Escalation

### Local Enumeration

We use the command `find / -perm -4000 2>/dev/null` to search for binaries with SUID permissions to attempt privilege escalation.

![SUID Files](./content/screenshots/backend/suid.png)

We notice the binaries `ls` and `grep` have SUID permissions, so we can list the contents of the `/root` folder where we find a file with the `root` password hash:

![Root](./content/screenshots/backend/hash.png)

We use the online tool `crackstation` to crack the hash and obtain the `root` password:

![Root](./content/screenshots/backend/crackstation.png)


![Root](./content/screenshots/backend/root.png)

And we have obtained access to the machine as `root` user! 🎉

## 🛠️ Tools Used

| Tool | Version | Specific Use |
|-------------|---------|----------------|
| nmap | 7.92 | Port and service scanning |
| sqlmap | 1.10 | SQL Injection |

## 🔗 Additional Resources

- [Crackstation](https://crackstation.net/)

## 🏆 Conclusion

A fairly simple but educational machine. It helps us practice SQL injection with a widely used tool like `sqlmap` and carry out privilege escalation by leveraging binaries with SUID permissions and cracking a hash found in the `/root` folder. Keep going! 🚀
