import axios from 'axios';
import config from '../../config.js';

const { pterodactyl, serverDefaults, featureLimits, userEmailDomain } = config;

const generateRandomID = (length = 8) => {
    return Math.random().toString(36).substring(2, length + 2);
};

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { serverName, ramOption } = req.body;

        if (!serverName || !ramOption) {
            return res.status(400).json({ error: 'Nama server dan pilihan RAM harus diisi.' });
        }
        
        if (!pterodactyl.apiKey || pterodactyl.apiKey.includes("GANTI_DENGAN")) {
           return res.status(500).json({ error: 'API Key Pterodactyl belum diatur di config.js' });
        }

        let ram, disk, cpu;
        switch (ramOption) {
            case "1gb": ram = 1024; disk = 3072; cpu = 50; break;
            case "2gb": ram = 2048; disk = 5120; cpu = 75; break;
            case "3gb": ram = 3072; disk = 7168; cpu = 100; break;
            case "4gb": ram = 4096; disk = 10240; cpu = 125; break;
            case "5gb": ram = 5120; disk = 12288; cpu = 150; break;
            case "6gb": ram = 6144; disk = 15360; cpu = 175; break;
            case "7gb": ram = 7168; disk = 17408; cpu = 200; break;
            case "8gb": ram = 8192; disk = 20480; cpu = 225; break;
            case "9gb": ram = 9216; disk = 22528; cpu = 250; break;
            case "10gb": ram = 10240; disk = 25600; cpu = 300; break;
            case "unlimited": ram = 0; disk = 0; cpu = 0; break;
            default:
                return res.status(400).json({ error: 'Pilihan RAM tidak valid.' });
        }

        const username = serverName.toLowerCase().replace(/[^a-z0-9]/g, '').substring(0, 10) + generateRandomID(4);
        const password = generateRandomID(10);
        const email = `${username}${userEmailDomain}`;

        const userResponse = await axios.post(`${pterodactyl.domain}/api/application/users`, {
            email: email,
            username: username,
            first_name: serverName,
            last_name: "User",
            password: password,
        }, {
            headers: { 'Authorization': `Bearer ${pterodactyl.apiKey}`, 'Accept': 'application/json', 'Content-Type': 'application/json' }
        });

        const userId = userResponse.data.attributes.id;

        const serverData = {
            name: serverName,
            user: userId,
            egg: serverDefaults.eggId,
            docker_image: serverDefaults.dockerImage,
            startup: serverDefaults.startupCommand,
            limits: { memory: ram, swap: 0, disk: disk, io: 500, cpu: cpu },
            feature_limits: featureLimits,
            deploy: {
                locations: [serverDefaults.locationId],
                dedicated_ip: false,
                port_range: [],
            },
        };
        
        const serverResponse = await axios.post(`${pterodactyl.domain}/api/application/servers`, serverData, {
            headers: { 'Authorization': `Bearer ${pterodactyl.apiKey}`, 'Accept': 'application/json', 'Content-Type': 'application/json' }
        });

        res.status(201).json({
            message: 'Server berhasil dibuat!',
            serverDetails: serverResponse.data.attributes,
            userDetails: { username: username, password: password, panelUrl: pterodactyl.domain }
        });

    } catch (error) {
        console.error("Error di API Route:", error.response ? JSON.stringify(error.response.data, null, 2) : error.message);
        res.status(500).json({ 
            error: 'Gagal membuat server.', 
            details: error.response ? error.response.data.errors : 'Terjadi kesalahan pada server internal.' 
        });
    }
}
