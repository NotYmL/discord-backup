# discord-backup
generate a backup ready event ae a JSON file dump every 24h 

this works because discord will close our ws connection if we don't reply within roughly 45 seconds. Then we can call recursion and repreatthe process forever
