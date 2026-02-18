# Cap - Writeup

## 📋 Información General

- **Plataforma**: HackTheBox
- **Dificultad**: Fácil
- **Categoría**: Web Exploitation | Log Analysis
- **Fecha**: 18/02/2026
- **Tiempo empleado**: ~30 minutos
- **Autor**: Samuel Rodríguez aka Testarious

## 🔍 Reconocimiento y Enumeración

### Escaneo de Puertos

Empezamos escaneando los puertos de la máquina objetivo con Nmap.

```bash
# Comandos utilizados
nmap -p- --open -sS --min-rate 5000 -vvv -n -Pn 10.129.1.27
nmap -sCV -p 21,22,80 10.129.1.27
```
**Resultados:**

![Nmap](./content/screenshots/cap/nmap.png)


Como vemos en la imagen, los puertos abiertos son el 21 (FTP), el 22 (SSH) y el 80 (HTTP). Y los escaneamos más a fondo para ver las versiones de los servicios.

En primer lugar visitamos la web que hay disponible en el puerto 80 y nos encontramos con un dashboard y vemos un nombre de usuario "nathan" que parece ser el usuario que se ha logueado. 

Este nombre lo guardamos para más adelante ya que puede ser una pista de usuario disponible en otros servicios (FTP, SSH).

![Web](./content/screenshots/cap/web.png)


## 💻 Explotación

Al navegar por la web, vemos que hay una sección "Security Snapshots" y al acceder a ella vemos en la URL el directorio "/data/2" que parece generar un archivo ".pcap" descargable (archivo de captura de paquetes).

![Security Snapshots](./content/screenshots/cap/cap1.png)

Jugamos un poco con la URL y vemos que si le ponemos "/data/0" nos aparece un registro con bastantes datos además de un archivo ".pcap" descargable.

![Security Snapshots](./content/screenshots/cap/cap2.png)

Procedemos a descargarlos y a ver su contenido utlizando Tshark.

![Tshark](./content/screenshots/cap/tshark.png)

Leyendo un poco el archivo de log vemos que hay un usuario "nathan" que realizó un login exitoso al servicio FTP junto a su contraseña "Buck3tH4TF0RM3!".



### Vector de Ataque 1:

Como ya tenemos unas credenciales de FTP probamos a conectarnos vía SSH por si hay una reutilización de credenciales.

```bash
# Comandos utilizados
ssh nathan@10.129.1.27

# Contraseña: Buck3tH4TF0RM3!
```

Y obtenemos acceso al sistema como usuario "nathan" y obtenemos la flag del usuario.

![SSH](./content/screenshots/cap/user-flag.png)

## 🔐 Escalada de Privilegios

### Enumeración Local

Después de probar varios comandos (por ejemplo, ``sudo -l`` o ``find / -perm -4000 2>/dev/null``) no vemos nada interesante. Por lo tanto, procedemos a ver los binarios con capabilities.

```bash
# Capabilities
getcap -r / 2>/dev/null
```
![Capabilities](./content/screenshots/cap/root.png)

Vemos que el binario ``/usr/bin/python3.8`` tiene la capability ``cap_setuid``. Por lo tanto, podemos ejecutar comandos como root.

### Método de Escalada

Procedemos a ejecutar el binario con la capability ``cap_setuid`` para obtener acceso como root con el siguiente comando:

```bash
# Comandos utilizados
python3 -c "import os; os.setuid(0); os.system('/bin/bash')"
```


Finalmente, tras ejecutar el comando obtenemos acceso como root y obtenemos la flag del sistema.

![Root Flag](./content/screenshots/cap/root-flag.png)

## 🛠️ Herramientas Utilizadas

| Herramienta | Versión | Uso específico |
|-------------|---------|----------------|
| nmap | 7.92 | Escaneo de puertos y servicios |
| tshark | 4.6.3 | Análisis de paquetes |
| python3 | 3.8 | Ejecución de comandos |


## 🏆 Conclusión

Buen punto de partida para principiantes que enseña a visualizar logs con ``tshark`` y a realizar una escalada de privilegios con capabilities. Seguimos! 🚀
