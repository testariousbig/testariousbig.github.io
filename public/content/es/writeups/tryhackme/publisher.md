# Publisher - Writeup

## 📋 Información General

- **Plataforma**: TryHackMe
- **Dificultad**: Fácil
- **Categoría**: CVE Exploitation | Research | Privilege Escalation
- **Fecha**: 05/03/2026
- **Tiempo empleado**: ~60 minutos
- **Autor**: Samuel Rodríguez aka Testarious

## 📝 Resumen

En este CTF nos vamos a centrar en la investigación de CVEs y lo importante que es hacer buenas búsquedas en Google para encontrar información relevante. Así como encontrar nuevas formas de escalar privilegios.

## 🔍 Reconocimiento y Enumeración

### Escaneo de Puertos

Empezamos escaneando los puertos de la máquina objetivo con Nmap.

```bash
# Comandos utilizados
nmap -p- --open -sS --min-rate 5000 -vvv -n -Pn 10.114.145.230
nmap -sCV -p22,80,3306,5038 10.114.145.230
```
**Resultados:**

![Nmap](./content/screenshots/publisher/nmap.png)


Como vemos en la imagen, los puertos abiertos son el 22 (SSH) y el 80 (HTTP). Los escaneamos más a fondo para ver las versiones de los servicios.

En primer lugar visitamos la web que hay disponible en el puerto 80 y nos encontramos con una especie de blog. 

Realizamos un escaneo de directorios con Ffuf para ver los directorios disponibles.

```bash/
ffuf -w /usr/share/wordlists/dirbuster/directory-list-2.3-medium.txt -u http://10.114.145.230/FUZZ 
```

**Resultados:**

![Ffuf](./content/screenshots/publisher/ffuf.png)

Descubrimos el directorio "/spip" que parece ser una instalación de SPIP, un sistema de gestión de contenidos (CMS) para sitios web. Accedemos a él y vemos que está en la versión 4.2.0 usando la extensión `wappalyzer`.

![Wappalyzer](./content/screenshots/publisher/wappalyzer.png)

## 💻 Explotación

Vamos a buscar vulnerabilidades conocidas para esta herramienta y buscando por Google encontramos un CVE asociado a esta versión que permite ejecutar comandos remotos (CVE-2023-27372). Para explotarlo vamos a utilizar `metasploit`.

![Metasploit](./content/screenshots/publisher/metasploit1.png)

### Vector de Ataque 1:

Encontramos varios exploits en Metasploit que pueden ser utilizados para explotar esta vulnerabilidad. Vamos a utilizar el número 8 `exploit/multi/http/spip_rce_form`. Utilizamos el comando `options` para ver las opciones que tenemos que configurar. Y seteamos las variables `RHOSTS` y `TARGETURI`.

![Metasploit](./content/screenshots/publisher/metasploit2.png)

Y finalmente ejecutamos el exploit.

![Metasploit](./content/screenshots/publisher/metasploit3.png)

Y tras ejecutarse exitosamente, obtenemos una reverse shell como usuario "www-data".

Tras ver los usuarios del sistema mirando el archivo `/etc/passwd`, vemos que hay un usuario llamado `think`.

![Passwd](./content/screenshots/publisher/etc_passwd.png)

El cual en su directorio `/home/think` tiene la flag del usuario.

![Flag](./content/screenshots/publisher/user_flag.png)

## 🔐 Escalada de Privilegios

### SSH

Buscamos en la carpeta `/home/think/.ssh` si hay alguna clave SSH. Y la encontramos. Lo cual nos permite conectarnos al sistema como el usuario `think`. Para ello copiamos la clave privada y la usamos con el comando `ssh`.

![SSH](./content/screenshots/publisher/ssh.png)

Ya tenemos acceso al sistema como el usuario `think`.

### Enumeración Local

Utilizamos el comando `find / -perm -u=s -type f 2>/dev/null` para ver si el usuario `think` puede ejecutar comandos como root.

![Find](./content/screenshots/publisher/run_container.png)

Encontramos un binario custom que tiene permisos de ejecución para todos los usuarios: `/usr/bin/run_container`. Al ejecutarlo, vemos que este llama a otro script: `/opt/run_container.sh`. Por lo que nos da la idea de que podriamos encontrar una forma de editar este script para obtener privilegios de root.

### Método de Escalada

En esta parte nos vemos un poco atascados, ya que tras revisar el binario, no encontramos una forma directa de escalar privilegios. Así que aquí recurrimos a la ayuda de Google y la comunidad de TryHackMe para encontrar la forma de escalar privilegios. En la plataforma de TryHackMe nos da una pista sobre un servicio que está corriendo en el sistema `apparmor`.

``
AppArmor ("Application Armor") es un módulo de seguridad del núcleo Linux que implementa Control de Acceso Obligatorio (MAC) para limitar los privilegios de los programas. Utiliza perfiles basados en rutas de archivos para definir qué recursos (archivos, redes, capacidades) puede usar una aplicación, protegiendo contra vulnerabilidades incluso si un proceso es comprometido.
``

Después de investigar más sobre AppArmor y el binario `run_container`, vemos que este binario parece estar relacionado con Docker o contenedores, y AppArmor puede estar configurando restricciones. Para ver las restricciones, vemos el archivo `/etc/apparmor.d/usr.sbin.ash`:

![AppArmor](./content/screenshots/publisher/apparmor.png)

Tras ver las restricciones en este archivo, nos damos cuenta de que la shell utilizada es `ash` (Almquist shell), que es una shell muy básica y limitada. Por lo que tenemos que intentar cambiarla por una shell más completa, como `bash`. Para ello, nos fijamos en que el directorio `/dev/shm` tiene permisos de ejecución para todos los usuarios, por lo que podemos copiar `bash` allí y ejecutarlo:

```bash
cp /bin/bash /dev/shm
/dev/shm/bash -p
```

Tras ejecutar estos comandos obtenemos una shell `bash` y procedemos a editar con `nano` el script `/opt/run_container.sh` para añadirle la línea `chmod u+s /bin/bash` para que al ejecutar el script, se le asignen permisos SUID a `bash`:

![Run Container](./content/screenshots/publisher/nano_script.png)

Después de guardar los cambios, ejecutamos el script nuevamente:

![Run Container](./content/screenshots/publisher/root.png)

Y finalmente con `/bin/bash -p` obtenemos una shell con privilegios de root y podemos leer la flag de root!

## 🛠️ Herramientas Utilizadas

| Herramienta | Versión | Uso específico |
|-------------|---------|----------------|
| nmap | 7.80 | Escaneo de puertos y servicios |
| ffuf | 1.3.1 | Fuzzing de directorios |
| metasploit | 6.2.60 | Ejecución de exploits |


## 🏆 Conclusión

Este CTF nos enseña la importancia de realizar una buena investigación para identificar servicios vulnerables y encontrar CVEs asociados a ellos, así como exploits o scripts que los exploten para obtener acceso inicial. Luego, mediante la enumeración de permisos sudo, logramos escalar privilegios y obtener acceso total al sistema. Seguimos! 🚀