# Injection - Writeup

## 📋 General Information

- **Platform**: DockerLabs
- **Difficulty**: Easy
- **Categories**: SQL Injection | Privilege Escalation
- **Date**: 06/03/2026
- **Time spent**: ~15 minutes
- **Author**: Samuel Rodríguez aka Testarious

## 📝 Summary

Exploit a login panel through SQL Injection to gain system access and escalate privileges.

## 🔍 Recognition and Enumeration

### Port Scan

We start by scanning the target machine's ports with `nmap` to get initial information:

```bash
# Full port scan
nmap -p- --open -sS --min-rate 5000 -vvv -n -Pn 172.17.0.2

# Detailed scan of open ports
nmap -sCV -p22,80 172.17.0.2
```

**Results:**
![Nmap](./content/screenshots/injection/nmap.png)

As we can see, we have two open ports: 22 (SSH) and 80 (HTTP). When accessing http://172.17.0.2 via browser, we observe a login panel.

![Login](./content/screenshots/injection/login_panel.png)

We try entering default credentials in the login form, but it doesn't work. So we proceed to attempt a SQL injection. To do this, we enter `' or 1=1 --` in the username and password fields. And the web shows us a syntax error in the SQL query.

![SQL Injection Error](./content/screenshots/injection/sqlerror.png)

## 💻 Exploitation

### Attack Vector 1: SQL Injection

We use `sqlmap` to exploit the SQL injection and explore the database in search of some credentials. With the following command we obtain the available databases:

```bash
sqlmap -u "http://172.17.0.2/index.php" --batch --forms --dbs
```
![SQLMap DBs](./content/screenshots/injection/databases.png)

With the following command we obtain the tables from the `register` database:

```bash
sqlmap -u "http://172.17.0.2/index.php" --batch --forms -D register --tables
```
![SQLMap Tables](./content/screenshots/injection/tables.png)

With the following command we obtain the data from the `users` table:

```bash
sqlmap -u "http://172.17.0.2/index.php" --batch --forms -D register -T users --dump
```
![SQLMap Users](./content/screenshots/injection/users.png)

We now have the credentials for user `dylan`! 🎉

We use them in the login panel:

![Login with credentials](./content/screenshots/injection/dylan_access.png)

But it doesn't seem they're useful for anything... So we're going to test if there's credential reuse on other exposed services, like `SSH`.

![SSH Connection](./content/screenshots/injection/ssh.png)

Indeed, the credentials work and we obtain system access as user `dylan`.

## 🔐 Privilege Escalation

### Local Enumeration

We use the command `find / -perm -4000 2>/dev/null` to search for binaries with SUID permissions to attempt privilege escalation.

![SUID Files](./content/screenshots/injection/suid.png)

We notice the `env` binary has SUID permissions, so we can try to open a shell as `root` with the following command:

```bash
env /bin/sh -p
```

![Root](./content/screenshots/injection/root.png)

And we have obtained access to the machine as user `root`! 🎉​

## 🛠️ Tools Used

| Tool | Version | Specific use |
|-------------|---------|----------------|
| nmap | 7.92 | Port and service scanning |
| sqlmap | 1.10 | SQL Injection |

## 🔗 Additional Resources

- [GTFOBins](https://gtfobins.org/)

## 🏆 Conclusion

Quite simple but educational machine. It helps us practice SQL injection with a widely used tool like `sqlmap` and carry out privilege escalation via binaries with SUID permissions. Keep going! 🚀
