import { useState } from 'react';
import axios from 'axios';
import Head from 'next/head';

export default function Home() {
    const [serverName, setServerName] = useState('');
    const [ramOption, setRamOption] = useState('1gb');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setResult(null);
        setError(null);

        try {
            const response = await axios.post('/api/create-server', {
                serverName,
                ramOption,
            });
            setResult(response.data);
        } catch (err) {
            const errorMessage = err.response ? (err.response.data.details ? `${err.response.data.error} - ${JSON.stringify(err.response.data.details[0].detail)}` : err.response.data.error) : 'Tidak dapat terhubung ke server.';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gray-900 min-h-screen text-white flex flex-col items-center p-4 sm:p-8">
            <Head>
                <title>Buat Server Pterodactyl</title>
                <meta name="description" content="Panel pembuatan server otomatis" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            
            <main className="w-full max-w-md">
                <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-center">Buat Paket Server</h1>

                <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-lg shadow-lg w-full">
                    <div className="mb-4">
                        <label htmlFor="serverName" className="block mb-2 text-sm font-medium text-gray-300">Nama Server</label>
                        <input
                            type="text"
                            id="serverName"
                            value={serverName}
                            onChange={(e) => setServerName(e.target.value)}
                            className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full p-2.5"
                            placeholder="Contoh: My Cool Bot"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="ramOption" className="block mb-2 text-sm font-medium text-gray-300">Pilih RAM</label>
                        <select
                            id="ramOption"
                            value={ramOption}
                            onChange={(e) => setRamOption(e.target.value)}
                            className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full p-2.5"
                        >
                            <option value="1gb">1 GB RAM</option>
                            <option value="2gb">2 GB RAM</option>
                            <option value="3gb">3 GB RAM</option>
                            <option value="4gb">4 GB RAM</option>
                            <option value="5gb">5 GB RAM</option>
                            <option value="6gb">6 GB RAM</option>
                            <option value="7gb">7 GB RAM</option>
                            <option value="8gb">8 GB RAM</option>
                            <option value="9gb">9 GB RAM</option>
                            <option value="10gb">10 GB RAM</option>
                            <option value="unlimited">Unlimited</option>
                        </select>
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full text-white bg-purple-600 hover:bg-purple-700 focus:ring-4 focus:outline-none focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center disabled:bg-gray-500 transition-colors duration-200"
                    >
                        {loading ? 'Membuat Server...' : 'Buat Sekarang'}
                    </button>
                </form>

                {error && (
                    <div className="mt-6 p-4 bg-red-900 border border-red-700 text-red-200 rounded-lg w-full max-w-md animate-pulse">
                        <p className="font-bold">Terjadi Kesalahan!</p>
                        <p className="text-sm break-words">{error}</p>
                    </div>
                )}

                {result && (
                    <div className="mt-6 p-4 bg-green-900 border border-green-700 text-green-200 rounded-lg w-full max-w-md">
                        <h3 className="text-lg font-bold mb-2">{result.message}</h3>
                        <p><strong>URL Panel:</strong> <a href={result.userDetails.panelUrl} target="_blank" rel="noopener noreferrer" className="underline hover:text-white">{result.userDetails.panelUrl}</a></p>
                        <p><strong>Username:</strong> {result.userDetails.username}</p>
                        <p><strong>Password:</strong> {result.userDetails.password}</p>
                        <p className="mt-2 text-xs text-gray-400">Silakan login dan segera ganti password Anda demi keamanan!</p>
                    </div>
                )}
            </main>
        </div>
    );
}
