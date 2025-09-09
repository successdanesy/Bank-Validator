// src/pages/Bankvalues.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { banks } from "../banks";
import { ArrowLeft, Search } from "lucide-react";

export default function Bankvalues() {
    const [search, setSearch] = useState("");

    // Filtered bank list
    const filteredBanks = banks.filter(
        (bank) =>
            bank.label.toLowerCase().includes(search.toLowerCase()) ||
            bank.value.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-6 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
                {/* Header */}
                <div className="bg-blue-600 text-white p-4 md:p-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold">Bank Institution Code Reference</h1>
                            <p className="mt-1 text-blue-100 opacity-90">
                                The institution codes shown here are based on <strong>our API's internal Mapping.</strong> <br />
                                They may look different from the Official Central bank of Nigeria (CBN) codes you might know. <br />

                                Please use these codes exactly as listed whenever you are validating accounts through this system.
                            </p>
                        </div>
                        <Link
                            to="/"
                            className="inline-flex items-center px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium text-sm"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Validator
                        </Link>
                    </div>
                </div>

                <div className="p-4 md:p-6">
                    {/* Search Input */}
                    <div className="relative mb-6">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search bank by name or code..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        />
                    </div>

                    {/* Info Card */}
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200 mb-6">
                        <h3 className="font-medium text-blue-800 mb-2">How to use these values:</h3>
                        <ul className="text-sm text-blue-700 space-y-1">
                            <li>• Use the 6-digit code in your CSV files</li>
                            <li>• Format: Account Number, Institution Code</li>
                            <li>• Maximum 50 rows per batch upload (Rate limit)</li>
                        </ul>
                    </div>

                    {/* Results Count */}
                    <div className="mb-4 flex justify-between items-center">
                        <p className="text-sm text-gray-600">
                            Showing {filteredBanks.length} of {banks.length} banks
                        </p>
                        {search && (
                            <button
                                onClick={() => setSearch("")}
                                className="text-sm text-blue-600 hover:text-blue-800"
                            >
                                Clear search
                            </button>
                        )}
                    </div>

                    {/* Bank Table */}
                    <div className="overflow-hidden border border-gray-200 rounded-lg shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                                        S/N
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                                        Bank Name
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                                        Bank Code
                                    </th>
                                </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                {filteredBanks.map((bank, idx) => (
                                    <tr key={bank.value} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {idx + 1}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-800">
                                            {bank.label}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 font-mono">
                                                    {bank.value}
                                                </span>
                                        </td>
                                    </tr>
                                ))}
                                {filteredBanks.length === 0 && (
                                    <tr>
                                        <td colSpan="3" className="px-4 py-8 text-center">
                                            <div className="text-gray-500 italic">
                                                No banks found matching "{search}"
                                            </div>
                                            <button
                                                onClick={() => setSearch("")}
                                                className="mt-2 text-blue-600 hover:text-blue-800 text-sm"
                                            >
                                                Clear search
                                            </button>
                                        </td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}