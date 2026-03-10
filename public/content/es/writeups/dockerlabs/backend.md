# Backend - Writeup

## 📋 Información General

- **Plataforma**: DockerLabs
- **Dificultad**: Fácil
- **Categorías**: SQL Injection | Cracking | Privilege Escalation
- **Fecha**: 10/03/2026
- **Tiempo empleado**: ~15 minutos
- **Autor**: Samuel Rodríguez aka Testarious

## 📝 Resumen

Explotar un panel de login mediante SQL Injection para obtener acceso al sistema y escalar privilegios crackeando la contraseña del usuario `root`.

## 🔍 Reconocimiento y Enumeración

### Escaneo de Puertos

Empezamos escaneando los puertos de la máquina objetivo con `nmap` para obtener información inicial:

```bash
# Escaneo completo de puertos
nmap -p- --open -sS --min-rate 5000 -vvv -n -Pn 172.17.0.2

# Escaneo detallado de puertos abiertos
nmap -sCV -p22,80 172.17.0.2
```

**Resultados:**
![Nmap](./content/screenshots/backend/nmap.png)

Como podemos ver tenemos dos puertos abiertos: 22 (SSH) y 80 (HTTP). Al acceder mediante el navegador a http://172.17.0.2/login.html observamos un panel de login.

![Login](./content/screenshots/backend/login_panel.png)

Probamos a introducir credenciales por defecto en el formulario de login, pero no funciona. Así que procedemos a intentar una inyección SQL. Para ello, introducimos `' or 1=1' --` en el campo de usuario y contraseña. Y la web nos muestra un error de sintaxis en la consulta SQL.

![SQL Injection Error](./content/screenshots/backend/sql_error.png)

## 💻 Explotación

### Vector de Ataque 1: SQL Injection

Utilizamos `sqlmap` para explotar la inyección SQL y explorar la base de datos en busca de algunas credenciales. Con el siguiente comando obtenemos las bases de datos disponibles:

```bash
sqlmap -u "http://172.17.0.2/login.html" --batch --forms --dbs
```
![SQLMap DBs](./content/screenshots/backend/databases.png)

Con el siguiente comando obtenemos las tablas de la base de datos `register`:

```bash
sqlmap -u "http://172.17.0.2/login.html" --batch --forms -D register --tables
```
![SQLMap Tables](./content/screenshots/backend/tables.png)

Con el siguiente comando obtenemos los datos de la tabla `users`:

```bash
sqlmap -u "http://172.17.0.2/login.html" --batch --forms -D register -T users --dump
```
![SQLMap Users](./content/screenshots/backend/users.png)

Conseguimos las credenciales de tres usuarios: `paco`, `pepe` y `juan`.

Las utilizamos en el panel de login y redirige a la página de inicio, asi que no parece que sirvan para nada en la web. Por lo que vamos a probar si hay reutilización de credenciales en otros servicios expuestos, como `SSH`.

![SSH Connection](./content/screenshots/backend/ssh_pepe.png)

Efectivamente, las credenciales funcionan y obtenemos acceso al sistema como usuario `pepe`.

## 🔐 Escalada de Privilegios

### Enumeración Local

Utilizamos el comando `find / -perm -4000 2>/dev/null` para buscar binarios con permisos SUID para intentar escalar privilegios.

![SUID Files](./content/screenshots/backend/suid.png)

Nos fijamos en los binarios `ls` y `grep` que tienen permisos SUID, asi que podemos listar el contenido de la carpeta `/root` donde encontramos un archivo con el hash de la contraseña de `root`:

![Root](./content/screenshots/backend/hash.png)

Utilizamos la herramienta online `crackstation` para crackear el hash y obtener la contraseña de `root`:

![Root](./content/screenshots/backend/crackstation.png)


![Root](./content/screenshots/backend/root.png)

¡Y hemos obtenido acceso a la máquina como usuario `root`! 🎉​

## 🛠️ Herramientas Utilizadas

| Herramienta | Versión | Uso específico |
|-------------|---------|----------------|
| nmap | 7.92 | Escaneo de puertos y servicios |
| sqlmap | 1.10 | Inyección SQL |

## 🔗 Recursos Adicionales

- [Crackstation](https://crackstation.net/)

## 🏆 Conclusión

Máquina bastante sencilla pero didáctica. Nos ayuda a practicar inyección SQL con una herramienta muy utilizada como `sqlmap` y a llevar a cabo una escalada de privilegios aprovechando binarios con permisos SUID y crackeando un hash encontrado en la carpeta `/root`. Seguimos! 🚀
