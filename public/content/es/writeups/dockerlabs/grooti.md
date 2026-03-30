# Grooti - Writeup

## 📋 Información General

- **Plataforma**: DockerLabs
- **Dificultad**: Fácil
- **Categorías**: Web Exploitation | Research | Privilege Escalation
- **Fecha**: 30/03/2026
- **Tiempo empleado**: ~40 minutos
- **Autor**: Samuel Rodríguez aka Testarious

## 📝 Resumen

Investigar un servicio web y seguir las pistas para encontrar credenciales y escalar privilegios mediante un cron job mal configurado.

## 🔍 Reconocimiento y Enumeración

### Escaneo de Puertos

Empezamos escaneando los puertos de la máquina objetivo con `nmap` para obtener información inicial:

```bash
# Escaneo completo de puertos
nmap -p- --open -sS --min-rate 5000 -vvv -n -Pn 172.17.0.2
```

**Resultados:**
![Nmap](./content/screenshots/grooti/nmap.png)

Como podemos ver tenemos tres puertos abiertos: 22 (SSH), 80 (HTTP) y 3306 (MySQL). Al acceder mediante el navegador a http://172.17.0.2/ observamos la siguiente web.

![Login](./content/screenshots/grooti/web.png)

Exploramos un poco la web y descubrimos en la ruta `/imagenes` un arhcivo de texto `README.txt` que contiene una contraseña.

![README.txt](./content/screenshots/grooti/readme.png)

En las demás opciones de la web no encontramos nada relevante. Así que vamos a hacer un escaneo de directorios con `gobuster` para buscar rutas ocultas.

```bash
gobuster dir -u http://172.17.0.2/ -w /usr/share/wordlists/dirbuster/directory-list-2.3-medium.txt -x php,html,txt
```

![Gobuster](./content/screenshots/grooti/directorios.png)

Encontramos la ruta `/secret` que nos muestra una tabla con nombres de usuarios y un archivo descargable con una pista que nos sugiere que estos nombres de usuario nos pueden servir.

![Secret](./content/screenshots/grooti/secret.png)

Como ya disponemos de una contraseña que hemos encontrado en el archivo `README.txt`, vamos a probar a iniciar sesión en el servicio MySQL con los usuarios de la tabla para ver si alguna de ellas es válida.

![Database](./content/screenshots/grooti/database.png)

Y encontramos que `rocket:password1` nos permite iniciar sesión en el servicio MySQL. Asi que procedemos a listar la base de datos y ver su contenido.

![Database](./content/screenshots/grooti/secret_ruta.png)

Y nos da una nueva ruta `/unprivate/secret` a la cual accedemos y nos muestra la siguiente web:

![Unprivate](./content/screenshots/grooti/secret_web.png)

## 💻 Explotación

### Vector de Ataque 1: Burp Suite

Probamos a mandar el formulario con valores inventados y se nos descarga un archivo `password1.txt` que contiene el texto "Buen intento!". Viendo el formulario, vemos que hay un campo que se supone que debe contener un número entre 1 y el 100, por lo que para probarlos vamos a usar `burpsuite`.

![Burpsuite](./content/screenshots/grooti/burpsuite.png)

Lo configuramos para probar los números del 1 al 100 y ver cuál nos devuelve algo diferente.

![Burpsuite](./content/screenshots/grooti/result_burpsuite.png)

Como vemos, el número 16 nos devuelve un "length" diferente, asi que probamos con ese número y nos devuelve el archivo `password16.zip`.

Usamos `john` para crackear el archivo zip, que está protegido con contraseña:

```bash
zip2john password16.zip > hash
john --wordlist=/usr/share/wordlists/rockyou.txt hash
```

![John](./content/screenshots/grooti/john_hash_zip.png)

Obtenemos la contraseña `password1`. Por lo que descomprimimos el archivo y nos da un archivo de texto con posibles contraseñas:

![Unzip](./content/screenshots/grooti/passwords.png)

Probamos con `hydra` estas contraseñas para acceder al sistema por SSH y el usuario `grooti`:

![SSH](./content/screenshots/grooti/ssh_user.png)

Y nos devuelve la contraseña `YoSoYgRoOt` que usamos para acceder al sistema.

![SSH](./content/screenshots/grooti/ssh_access.png)


## 🔐 Escalada de Privilegios

### Enumeración Local

Utilizamos los comandos `sudo -l` y `find / -perm -4000 2>/dev/null` para buscar posibles vías de escalada de privilegios pero no encontramos nada relevante.

Usamos el comando `crontab -l` para listar las tareas programadas del usuario `grooti` y vemos que hay una tarea que se ejecuta cada minuto y que ejecuta el script `/opt/cleanup.sh`:

![Crontab](./content/screenshots/grooti/crontab.png)

Buscamos ese script para ver lo que hace, y este ejecuta el script `/tmp/malicious.sh`:

![Cleanup](./content/screenshots/grooti/cleanup.png)

Editamos el script `/tmp/malicious.sh` para que ejecute `chmod u+s /bin/bash`. Y esperamos a que se ejecute la tarea programada.

Una vez se ha ejecutado, probamos a ejecutar el binario `/bin/bash` con el flag `-p` para obtener una shell con privilegios de `root`:

![Root](./content/screenshots/grooti/root.png)

¡Y hemos obtenido acceso a la máquina como usuario `root`! 🎉​

## 🛠️ Herramientas Utilizadas

| Herramienta | Versión | Uso específico |
|-------------|---------|----------------|
| nmap | 7.92 | Escaneo de puertos y servicios |
| Burp Suite | Community 2025 | Interceptación de tráfico HTTP |
| hydra | 9.6 | Fuerza bruta |
| gobuster | 3.8.2 | Enumeración web |
| john | 1.9.1 | Crackeo de hashes |
| zip2john | -- | Crackeo de hashes |

## 🏆 Conclusión

Máquina bastante sencilla pero didáctica. Nos enseña la importancia de estar atentos a los detalles y a seguir las pistas sin dejar pasar nada por alto. A través de esta máquina aprendemos a llevar a cabo una escalada de privilegios aprovechando un script ejecutado por una tarea programada (cron) con permisos de root. Seguimos! 🚀
