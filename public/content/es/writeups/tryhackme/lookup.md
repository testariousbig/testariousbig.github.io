# Lookup - Writeup

## 📋 Información General

- **Plataforma**: TryHackMe
- **Dificultad**: Fácil
- **Categoría**: Brute Force | Metasploit | PATH Hijacking
- **Fecha**: 02/03/2026
- **Tiempo empleado**: ~50 minutos
- **Autor**: Samuel Rodríguez aka Testarious

## 🔍 Reconocimiento y Enumeración

### Escaneo de Puertos

Empezamos escaneando los puertos de la máquina objetivo con Nmap.

```bash
# Comandos utilizados
nmap -p- --open -sS --min-rate 5000 -vvv -n -Pn 10.113.179.215
nmap -sCV -p22,80 10.113.179.215
```
**Resultados:**

![Nmap](./content/screenshots/lookup/nmap.png)

Como vemos en la imagen, los puertos abiertos son el 22 (SSH) y el 80 (HTTP). Y los escaneamos más a fondo para ver las versiones de los servicios.

### Reconocimiento Web

En primer lugar, intentamos acceder al servicio web expuesto en el puerto 80 (HTTP). Para ello, tenemos que editar el archivo `/etc/hosts` y agregar la IP de la máquina objetivo con el nombre de la máquina (lookup.thm). Al hacerlo, podemos acceder a la web que hay disponible y nos encontramos con un panel de login. 

![Web](./content/screenshots/lookup/login.png)

Intentamos iniciar sesión con credenciales por defecto como `admin:admin` o `root:root` pero no funciona. Al hacerlo, nos damos cuenta de que el mensaje de error es diferente en ambas ocasiones. Con el usuario admin nos dice "Wrong password", con el usuario root nos dice "Wrong username or password".

También realizamos un escaneo de directorios con Ffuf para ver si hay algún directorio oculto. Pero no sale nada.

```bash
ffuf -w /usr/share/wordlists/dirbuster/directory-list-2.3-medium.txt -u http://lookup.thm/FUZZ 
```

## 💻 Explotación

### Vector de Ataque 1: Fuerza Bruta

Como hemos visto que el mensaje de error es diferente según si el usuario es correcto o no, realizamos una fuerza bruta con Ffuf para enumerar los usuarios, poniendo una contraseña común como "123456".

```bash
ffuf -w /usr/share/wordlists/SecLists/Usernames/Names/names.txt -X POST -d "username=FUZZ&password=123456" -H "Content-Type: application/x-www-form-urlencoded" -u http://lookup.thm/login.php -fw 10
```

![Ffuf](./content/screenshots/lookup/ffuf_user.png)

Así descubrimos que existen los usuarios `jose` y `admin`. Procedemos a hacer fuerza bruta con `hydra` para obtener la contraseña del usuario `jose`.

```bash
hydra -l jose -P /usr/share/wordlists/rockyou.txt lookup.thm http-post-form "/login.php:username=^USER^&password=^PASS^:Wrong password"
```

![Hydra](./content/screenshots/lookup/hydra.png)

Como vemos en la imagen, obtenemos la contraseña del usuario `jose:password123`.

Al acceder con estas credenciales, nos redirige al subdominio `files.lookup.thm` que tenemos que agregar al archivo `/etc/hosts` para acceder, y al hacerlo, nos encontramos con el panel de control de elFinder.

![elFinder](./content/screenshots/lookup/elFinder.png)

### Vector de Ataque 2: elFinder

Buscamos la versión de elFinder que está en el panel de control.

![elFinder](./content/screenshots/lookup/elFinder_version.png)

Y usando metasploit, buscamos vulnerabilidades de elFinder para esa versión.

![metasploit](./content/screenshots/lookup/metasploit_search.png)

Encontramos un exploit que nos permitiría hacer un `Command Injection`. Así que procedemos a usarlo.

![metasploit](./content/screenshots/lookup/metasploit_run.png)

Como vemos en la imagen, primero ponemos el `RHOSTS` con la IP de la máquina objetivo y lanzamos el exploit, obteniendo una sesión de `meterpreter`.

![meterpreter](./content/screenshots/lookup/meterpreter.png)

Nos hemos metido en el sistema como el usuario `www-data`. Procedemos a ver el archivo `/etc/passwd` para ver los usuarios del sistema.

![meterpreter](./content/screenshots/lookup/etc_passwd.png)

Vemos que existe un usuario `think`.

## 🔐 Escalada de Privilegios

### Enumeración Local

Buscamos binarios con permisos SUID con el comando `find`. Y vemos que existe un binario `pwm` que tiene permisos SUID.

```bash
find / -perm -u=s -type f 2>/dev/null
```

![find](./content/screenshots/lookup/pwm.png)

Al ejecutar el binario `pwm`, observamos el output y vemos que primero ejecuta el comando `id` y después da un error de que el archivo `/home/www-data/.passwords` no existe. 

![pwm](./content/screenshots/lookup/www-data_pwm.png)

En este punto intentamos hacer un `PATH hijacking` para que el binario `pwm` pueda obtener el archivo `/home/think/.passwords`. Para ello, creamos un archivo `id` en el directorio `/tmp` y en el contenido del archivo, ponemos el output que saldría al ejecutar el comando `id` por el usuario `think`.

```bash
echo '#!/bin/bash' > /tmp/id
echo 'echo "uid=1000(think) gid=1000(think) groups=1000(think)"' >> /tmp/id
chmod +x /tmp/id
export PATH=/tmp:$PATH
```

Tras ejecutar el binario `pwm`, obtenemos el archivo `/home/think/.passwords`.

![meterpreter](./content/screenshots/lookup/think_passwords.png)

Ya en nuestra máquina, nos creamos un archivo de texto con el contenido del archivo `/home/think/.passwords` y lo utilizamos para hacer fuerza bruta con `hydra` para obtener la contraseña del usuario `think`.

```bash
hydra -l think -P /root/think_passwd.txt ssh://10.113.179.215:22
```

![hydra](./content/screenshots/lookup/hydra_think.png)

Obtenemos la contraseña del usuario `think`. Con esta contraseña, accedemos via SSH a la máquina objetivo como el usuario `think` y obtenemos la flag de usuario.

![flag_user](./content/screenshots/lookup/flag_user.png)

### Método de Escalada

Ejecutamos el comando `sudo -l` para ver los permisos sudo del usuario `think`.

![sudo](./content/screenshots/lookup/sudo.png)

Vemos que el binario `look` tiene permisos sudo. Por lo que podemos ver la flag de root.

![flag_root](./content/screenshots/lookup/flag_root.png)

De forma alternativa, utilizando el comando `look` con permisos sudo, podemos ver que en `/root/.ssh/id_rsa` hay una clave `ssh` que podemos copiar en nuestra máquina para acceder como usuario `root` a la máquina vícitma.

## 🛠️ Herramientas Utilizadas

| Herramienta | Versión | Uso específico |
|-------------|---------|----------------|
| nmap | 7.80 | Escaneo de puertos y servicios |
| ffuf | 1.3.1 | Fuzzing de directorios |
| hydra | 9.0 | Fuerza bruta |
| metasploit | 6.4.55-dev | Búsqueda y ejecución de exploits |


## 🏆 Conclusión

Lookup ha sido una máquina entretenida aunque algo frustrante en ciertos puntos. La enumeración de usuarios requiere fijarse en detalles pequeños que es fácil pasar por alto, y la escalada de privilegios mediante PATH Hijacking, aunque conocida en teoría, cuesta más verla cuando estás en medio del reto. En definitiva, una máquina que enseña a ser más metódico y a no descartar nada. Seguimos! 🚀