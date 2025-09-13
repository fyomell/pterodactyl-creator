// config.js
const config = {
  pterodactyl: {
    domain: "https://zebubhost.cloud", 
    apiKey: "ptla_GANTI_DENGAN_API_KEY_ASLI_KAMU", 
  },
  serverDefaults: {
    eggId: 15,
    locationId: 1,
    dockerImage: "ghcr.io/parkervcp/yolks:nodejs_18",
    startupCommand: "if [[ -d .git ]] && [[ {{AUTO_UPDATE}} == \"1\" ]]; then git pull; fi; if [[ ! -z ${NODE_PACKAGES} ]]; then /usr/local/bin/npm install ${NODE_PACKAGES}; fi; if [[ ! -z ${UNNODE_PACKAGES} ]]; then /usr/local/bin/npm uninstall ${UNNODE_PACKAGES}; fi; if [ -f /home/container/package.json ]; then /usr/local/bin/npm install; fi; if [[ ! -z ${CUSTOM_ENVIRONMENT_VARIABLES} ]]; then vars=$(echo ${CUSTOM_ENVIRONMENT_VARIABLES} | tr \"; \"\n\"); for line in $vars; do export $line; done fi; /usr/local/bin/${CMD_RUN};",
  },
  featureLimits: {
    databases: 2,
    backups: 2,
    allocations: 1,
  },
  userEmailDomain: "@yourdomain.com"
};
export default config;
