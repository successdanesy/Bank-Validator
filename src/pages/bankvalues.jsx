// src/pages/Bankvalues.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { banks } from "../banks";

export default function Bankvalues() {
    const [search, setSearch] = useState("");

    // Filtered bank list
    const filteredBanks = banks.filter(
        (bank) =>
            bank.label.toLowerCase().includes(search.toLowerCase()) ||
            bank.value.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="p-6 max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold">Bank Values</h1>
                <Link
                    to="/"
                    className="text-blue-600 hover:underline text-sm font-medium"
                >
                    ← Back to Validator
                </Link>
            </div>

            <p className="mb-4 text-gray-700">
                Use the following <span className="font-semibold">Bank Values</span> in
                your CSV upload for batch validation:
            </p>

            {/* Search Input */}
            <input
                type="text"
                placeholder="Search bank by name or value..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full p-2 border rounded-lg mb-4 focus:outline-none focus:ring focus:ring-blue-200"
            />

            {/* Bank Table */}
            <div className="overflow-x-auto">
                <table className="w-full border border-gray-300 rounded-lg shadow-sm">
                    <thead>
                    <tr className="bg-gray-100">
                        <th className="border px-4 py-2 text-left">S/N</th>
                        <th className="border px-4 py-2 text-left">Bank Name</th>
                        <th className="border px-4 py-2 text-left">Bank Value</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredBanks.map((bank, idx) => (
                        <tr key={bank.value} className="hover:bg-gray-50">
                            <td className="border px-4 py-2">{idx + 1}</td>
                            <td className="border px-4 py-2">{bank.label}</td>
                            <td className="border px-4 py-2 font-mono">{bank.value}</td>
                        </tr>
                    ))}
                    {filteredBanks.length === 0 && (
                        <tr>
                            <td
                                colSpan="3"
                                className="text-center text-gray-500 py-4 italic"
                            >
                                No banks found.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
