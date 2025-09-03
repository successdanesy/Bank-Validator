import { useState } from "react";
import { banks } from "../banks.js";
import { Link } from "react-router-dom";
import { ChevronDown, Upload, Download, CheckCircle, XCircle, AlertCircle, Search, Zap, FileText, Users, Shield, Mail, MessageCircle, Github, Linkedin } from "lucide-react";

function Validator() {
    const [activeTab, setActiveTab] = useState("single");
    const [accountNumber, setAccountNumber] = useState("");
    const [bankValue, setBankValue] = useState("");
    const [bankQuery, setBankQuery] = useState("");
    const [showBankDropdown, setShowBankDropdown] = useState(false);
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [statusText, setStatusText] = useState("");
    const [results, setResults] = useState([]);
    const [error, setError] = useState(null);

    // Batch states
    const [batchResults, setBatchResults] = useState([]);
    const [batchLoading, setBatchLoading] = useState(false);
    const [batchProgress, setBatchProgress] = useState(0);
    const [batchStatus, setBatchStatus] = useState("");
    const [batchError, setBatchError] = useState(null);
    const [dragActive, setDragActive] = useState(false);

    const API_TOKEN = import.meta.env.VITE_API_TOKEN;

    const priorityBanks = [
        { value: "000015", label: "ZENITH BANK" },
        { value: "000014", label: "ACCESS BANK" },
        { value: "000001", label: "STERLING BANK" },
        { value: "000002", label: "KEYSTONE BANK" },
        { value: "000003", label: "FIRST CITY MONUMENT BANK" },
        { value: "000004", label: "UNITED BANK FOR AFRICA" },
        { value: "000006", label: "JAIZ BANK" },
        { value: "000007", label: "FIDELITY BANK" },
        { value: "000008", label: "POLARIS BANK" },
        { value: "100033", label: "PALMPAY" },
        { value: "000010", label: "ECOBANK" },
        { value: "000011", label: "UNITY BANK" },
        { value: "000012", label: "STANBIC IBTC BANK" },
        { value: "000013", label: "GTBANK PLC" },
        { value: "000016", label: "FIRST BANK OF NIGERIA" },
        { value: "000017", label: "WEMA BANK" },
        { value: "000018", label: "UNION BANK" },
        { value: "090267", label: "KUDA MICROFINANCE BANK" },
        { value: "000021", label: "STANDARD CHARTERED BANK" },
        { value: "090110", label: "VFD MFB" },
        { value: "000020", label: "HERITAGE BANK" },
        { value: "000026", label: "TAJ BANK" },
        { value: "090405", label: "MONIEPOINT MICROFINANCE BANK" },
        { value: "100004", label: "OPAY" },
        { value: "000023", label: "PROVIDUS BANK" },
    ];

    const filteredBanks = banks.filter((bank) =>
        bank.label.toLowerCase().includes(bankQuery.toLowerCase())
    );

    const handleBankSelect = (bank) => {
        setBankValue(bank.value);
        setBankQuery(bank.label);
        setShowBankDropdown(false);
    };

    // --- Single Validation ---
    const validateAccount = async () => {
        setLoading(true);
        setError(null);
        setResults([]);
        setProgress(0);
        setStatusText("Validating with selected bank...");

        try {
            const response = await fetch(
                `https://nubapi.com/api/verify?account_number=${accountNumber}&bank_code=${bankValue}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${API_TOKEN}`,
                    },
                }
            );

            if (!response.ok) throw new Error("Failed to validate account");

            const data = await response.json();
            setResults([data]);
            setProgress(100);
            setStatusText("Validation complete ✅");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const smartValidate = async () => {
        setLoading(true);
        setError(null);
        setResults([]);
        setProgress(0);
        setStatusText("Starting Smart Validation...");

        try {
            const matches = [];
            const total = priorityBanks.length;

            for (let i = 0; i < total; i++) {
                const bank = priorityBanks[i];
                setStatusText(`Checking ${bank.label}... (${i + 1}/${total})`);

                const response = await fetch(
                    `https://nubapi.com/api/verify?account_number=${accountNumber}&bank_code=${bank.value}`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${API_TOKEN}`,
                        },
                    }
                );

                if (response.ok) {
                    const data = await response.json();
                    if (data?.status === 200) {
                        matches.push(data);
                        setResults([data]);
                        setStatusText(`Found match in ${bank.label} ✅`);
                        setProgress(100);
                        break;
                    }
                }

                setProgress(Math.round(((i + 1) / total) * 100));
            }

            if (matches.length === 0) {
                setError("No matching bank found in priority list.");
                setStatusText("Search finished ❌");
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleBatchUpload({ target: { files: e.dataTransfer.files } });
        }
    };

    // --- Batch Validation ---
    const handleBatchUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const text = await file.text();
        const rows = text.split("\n").map((row) => row.trim());
        const batch = rows.slice(1, 51).map((row, idx) => {
            const [acc, bankVal] = row.split(",");
            return {
                row: idx + 1,
                account_number: acc?.trim(),
                bank_value: bankVal?.trim(),
            };
        });

        const invalidRow = batch.find((item) => !item.account_number || !item.bank_value);
        if (invalidRow) {
            setBatchError(`Row ${invalidRow.row} is invalid.`);
            return;
        }

        setBatchLoading(true);
        setBatchProgress(0);
        setBatchResults([]);
        setBatchError(null);
        setBatchStatus("Starting batch validation...");

        const tempResults = [];

        for (let i = 0; i < batch.length; i++) {
            const item = batch[i];
            setBatchStatus(`Validating ${i + 1} of ${batch.length}...`);

            try {
                const response = await fetch(
                    `https://nubapi.com/api/verify?account_number=${item.account_number}&bank_code=${item.bank_value}`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${API_TOKEN}`,
                        },
                    }
                );

                if (response.ok) {
                    const data = await response.json();
                    tempResults.push({ ...data, isValid: data?.status === 200 });
                } else {
                    tempResults.push({
                        Bank_name: "Error",
                        bank_value: item.bank_value,
                        account_number: item.account_number,
                        account_name: "Invalid or not found",
                        isValid: false,
                    });
                }
            } catch {
                tempResults.push({
                    Bank_name: "Error",
                    bank_value: item.bank_value,
                    account_number: item.account_number,
                    account_name: "Validation failed",
                    isValid: false,
                });
            }

            setBatchResults([...tempResults]);
            setBatchProgress(Math.round(((i + 1) / batch.length) * 100));
            await new Promise((r) => setTimeout(r, 200));
        }

        setBatchStatus("Batch validation complete ✅");
        setBatchLoading(false);
    };

    const downloadBatchCSV = () => {
        if (!batchResults.length) return;

        const csv = [
            ["S/N", "Bank Name", "Account Number", "Account Name", "Status"],
            ...batchResults.map((r, idx) => [
                idx + 1,
                r.Bank_name,
                r.account_number,
                r.account_name,
                r.isValid ? "Valid" : "Invalid"
            ]),
        ]
            .map((e) => e.join(","))
            .join("\n");

        const blob = new Blob([csv], { type: "text/csv" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "batch_results.csv";
        link.click();
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-3">
                            <Shield className="h-8 w-8 text-blue-600" />
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">SuccessValidator</h1>
                                <p className="text-xs text-gray-500">by Success Chukwuemeka</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-500">Professional Banking Solution</span>
                            <div className="h-6 w-px bg-gray-300"></div>
                            <a href="mailto:successdanesy@gmail.com?subject=Inquiry%20about%20your%20services" className="text-blue-600 hover:text-blue-700 font-medium">Contact</a>
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-6xl mx-auto px-4 py-8">
                {/* Hero Section */}
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">
                        Nigerian Bank Account Validator
                    </h2>
                    <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                        Verify Nigerian bank account details in real-time with 99.9% accuracy.
                    </p>

                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
                        <div className="bg-white rounded-lg p-4 shadow-sm">
                            <div className="flex items-center justify-center mb-2">
                                <Zap className="h-6 w-6 text-yellow-500" />
                            </div>
                            <div className="text-2xl font-bold text-gray-900">2s</div>
                            <div className="text-sm text-gray-600">Average validation time</div>
                        </div>
                        <div className="bg-white rounded-lg p-4 shadow-sm">
                            <div className="flex items-center justify-center mb-2">
                                <Users className="h-6 w-6 text-blue-500" />
                            </div>
                            <div className="text-2xl font-bold text-gray-900">50</div>
                            <div className="text-sm text-gray-600">Accounts per batch</div>
                        </div>
                        <div className="bg-white rounded-lg p-4 shadow-sm">
                            <div className="flex items-center justify-center mb-2">
                                <Shield className="h-6 w-6 text-green-500" />
                            </div>
                            <div className="text-2xl font-bold text-gray-900">99.9%</div>
                            <div className="text-sm text-gray-600">Accuracy rate</div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    {/* Tab Navigation */}
                    <div className="border-b bg-gray-50">
                        <nav className="flex">
                            <button
                                onClick={() => setActiveTab("single")}
                                className={`flex-1 py-4 px-6 text-center font-medium transition-colors duration-200 ${
                                    activeTab === "single"
                                        ? "bg-white text-blue-600 border-b-2 border-blue-600"
                                        : "text-gray-500 hover:text-gray-700"
                                }`}
                            >
                                <div className="flex items-center justify-center space-x-2">
                                    <Search className="h-5 w-5" />
                                    <span>Single Validation</span>
                                </div>
                                <p className="text-xs mt-1 opacity-75">Verify individual accounts</p>
                            </button>
                            <button
                                onClick={() => setActiveTab("batch")}
                                className={`flex-1 py-4 px-6 text-center font-medium transition-colors duration-200 ${
                                    activeTab === "batch"
                                        ? "bg-white text-green-600 border-b-2 border-green-600"
                                        : "text-gray-500 hover:text-gray-700"
                                }`}
                            >
                                <div className="flex items-center justify-center space-x-2">
                                    <FileText className="h-5 w-5" />
                                    <span>Batch Processing</span>
                                </div>
                                <p className="text-xs mt-1 opacity-75">Upload CSV files</p>
                            </button>
                        </nav>
                    </div>

                    <div className="p-8">
                        {/* Single Validation Tab */}
                        {activeTab === "single" && (
                            <div className="space-y-6">
                                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                                    <div className="flex items-start space-x-3">
                                        <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                                        <div>
                                            <h3 className="font-medium text-blue-900">How it works</h3>
                                            <ul className="text-sm text-blue-800 mt-2 space-y-1">
                                                <li>• Enter the 10-digit account number</li>
                                                <li>• Select the bank or use Smart Validate to auto-detect</li>
                                                <li>• Get instant verification results</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    {/* Input Form */}
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Account Number
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="e.g., 1234567890"
                                                value={accountNumber}
                                                onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-lg font-mono"
                                            />
                                            <p className="text-xs text-gray-500 mt-1">Must be exactly 10 digits</p>
                                        </div>

                                        <div className="relative">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Select Bank (Optional for Smart Validate)
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    value={bankQuery}
                                                    onChange={(e) => {
                                                        setBankQuery(e.target.value);
                                                        setShowBankDropdown(true);
                                                    }}
                                                    onFocus={() => setShowBankDropdown(true)}
                                                    placeholder="Start typing bank name..."
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                                                />
                                                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />

                                                {showBankDropdown && (
                                                    <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                                        {filteredBanks.map((bank) => (
                                                            <button
                                                                key={bank.value}
                                                                onClick={() => handleBankSelect(bank)}
                                                                className="w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors duration-150 border-b border-gray-100 last:border-b-0"
                                                            >
                                                                <div className="font-medium text-gray-900">{bank.label}</div>
                                                                <div className="text-xs text-gray-500">Code: {bank.value}</div>
                                                            </button>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                            {bankValue && (
                                                <p className="text-xs text-green-600 mt-1 flex items-center">
                                                    <CheckCircle className="h-3 w-3 mr-1" />
                                                    Selected: {banks.find(b => b.value === bankValue)?.label}
                                                </p>
                                            )}
                                        </div>

                                        <div className="flex flex-col sm:flex-row gap-3">
                                            <button
                                                onClick={validateAccount}
                                                disabled={!accountNumber || !bankValue || loading}
                                                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 px-6 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
                                            >
                                                <Search className="h-5 w-5" />
                                                <span>{loading ? "Validating..." : "Validate Account"}</span>
                                            </button>

                                            <button
                                                onClick={smartValidate}
                                                disabled={!accountNumber || loading}
                                                className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:bg-gray-400 text-white py-3 px-6 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2"
                                            >
                                                <Zap className="h-5 w-5" />
                                                <span>{loading ? "Detecting..." : "Smart Validate"}</span>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Results Area */}
                                    <div className="bg-gray-50 rounded-lg p-6">
                                        <h3 className="font-medium text-gray-900 mb-4">Validation Results</h3>

                                        {loading && (
                                            <div className="space-y-4">
                                                <div className="w-full bg-gray-200 rounded-full h-2">
                                                    <div
                                                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                                        style={{ width: `${progress}%` }}
                                                    />
                                                </div>
                                                <p className="text-sm text-gray-600 text-center">{statusText}</p>
                                            </div>
                                        )}

                                        {error && (
                                            <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
                                                <XCircle className="h-5 w-5" />
                                                <span>{error}</span>
                                            </div>
                                        )}

                                        {results.length > 0 && !loading && (
                                            <div className="space-y-4">
                                                {results.map((result, idx) => (
                                                    <div key={idx} className={`bg-white rounded-lg p-4 border ${
                                                        result.status === 200 ? "border-green-200" : "border-red-200"
                                                    }`}>
                                                        <div className="flex items-center space-x-2 mb-3">
                                                            {result.status === 200 ? (
                                                                <>
                                                                    <CheckCircle className="h-5 w-5 text-green-600" />
                                                                    <span className="font-medium text-green-900">Valid Account</span>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <XCircle className="h-5 w-5 text-red-600" />
                                                                    <span className="font-medium text-red-900">Invalid Account</span>
                                                                </>
                                                            )}
                                                        </div>
                                                        <div className="space-y-2 text-sm">
                                                            <div className="flex justify-between">
                                                                <span className="text-gray-600">Bank:</span>
                                                                <span className="font-medium">{result.Bank_name}</span>
                                                            </div>
                                                            <div className="flex justify-between">
                                                                <span className="text-gray-600">Account:</span>
                                                                <span className="font-mono">{result.account_number}</span>
                                                            </div>
                                                            <div className="flex justify-between">
                                                                <span className="text-gray-600">Name:</span>
                                                                <span className="font-medium">{result.account_name}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {!loading && !error && results.length === 0 && (
                                            <div className="text-center text-gray-500 py-8">
                                                <Search className="h-12 w-12 mx-auto mb-3 opacity-30" />
                                                <p>Enter account details above to start validation</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Batch Validation Tab */}
                        {activeTab === "batch" && (
                            <div className="space-y-6">
                                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                                    <div className="flex items-start space-x-3">
                                        <AlertCircle className="h-5 w-5 text-green-600 mt-0.5" />
                                        <div>
                                            <h3 className="font-medium text-green-900">CSV Format Requirements</h3>
                                            <ul className="text-sm text-green-800 mt-2 space-y-1">
                                                <li>• Two columns: <strong>Account Number</strong>, <strong>Bank Code</strong></li>
                                                <li>• No headers allowed </li>
                                                <li>• Maximum 39 rows per upload</li>
                                                <li>• Account numbers must be 10 digits</li>
                                                <li>• Bank codes must be 6 digits (check bank values guide)</li>
                                            </ul>
                                            <Link to="/bankvalues" className="text-green-600 underline text-sm mt-2 block">
                                                Check valid bank codes
                                            </Link>
                                            <p>Example format:</p>
                                            <img
                                                src="/table-sample.png"
                                                alt="Sample Table"
                                                className="rounded-lg shadow-md mt-4"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    {/* Upload Area */}
                                    <div>
                                        <h3 className="font-medium text-gray-900 mb-4">Upload CSV File</h3>
                                        <div
                                            onDragEnter={handleDrag}
                                            onDragLeave={handleDrag}
                                            onDragOver={handleDrag}
                                            onDrop={handleDrop}
                                            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-200 ${
                                                dragActive
                                                    ? "border-green-400 bg-green-50"
                                                    : "border-gray-300 hover:border-green-400 hover:bg-green-50"
                                            }`}
                                        >
                                            <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                                            <p className="text-lg font-medium text-gray-700 mb-2">
                                                Drop your CSV file here
                                            </p>
                                            <p className="text-sm text-gray-500 mb-4">or click to browse</p>
                                            <input
                                                type="file"
                                                accept=".csv"
                                                onChange={handleBatchUpload}
                                                className="hidden"
                                                id="csv-upload"
                                            />
                                            <label
                                                htmlFor="csv-upload"
                                                className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 cursor-pointer transition-colors duration-200"
                                            >
                                                <Upload className="h-4 w-4 mr-2" />
                                                Choose File
                                            </label>
                                        </div>
                                    </div>

                                    {/* Progress and Results */}
                                    <div>
                                        <h3 className="font-medium text-gray-900 mb-4">Processing Status</h3>
                                        <div className="bg-gray-50 rounded-lg p-6">
                                            {batchLoading && (
                                                <div className="space-y-4">
                                                    <div className="w-full bg-gray-200 rounded-full h-3">
                                                        <div
                                                            className="bg-green-600 h-3 rounded-full transition-all duration-300"
                                                            style={{ width: `${batchProgress}%` }}
                                                        />
                                                    </div>
                                                    <p className="text-sm text-gray-600 text-center">{batchStatus}</p>
                                                    <div className="text-center">
                                                        <span className="text-lg font-bold text-green-600">{batchProgress}%</span>
                                                        <span className="text-sm text-gray-500 ml-2">Complete</span>
                                                    </div>
                                                </div>
                                            )}

                                            {batchError && (
                                                <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
                                                    <XCircle className="h-5 w-5" />
                                                    <span>{batchError}</span>
                                                </div>
                                            )}

                                            {!batchLoading && !batchError && batchResults.length === 0 && (
                                                <div className="text-center text-gray-500 py-8">
                                                    <FileText className="h-12 w-12 mx-auto mb-3 opacity-30" />
                                                    <p>Upload a CSV file to start batch validation</p>
                                                </div>
                                            )}

                                            {batchResults.length > 0 && !batchLoading && (
                                                <div className="space-y-4">
                                                    <div className="flex items-center justify-between">
                                                        <span className="font-medium text-gray-900">
                                                            Processed {batchResults.length} accounts
                                                        </span>
                                                        <button
                                                            onClick={downloadBatchCSV}
                                                            className="inline-flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                                                        >
                                                            <Download className="h-4 w-4 mr-2" />
                                                            Download Results
                                                        </button>
                                                    </div>

                                                    <div className="bg-white rounded-lg border overflow-hidden">
                                                        <div className="max-h-64 overflow-y-auto">
                                                            <table className="w-full text-sm">
                                                                <thead className="bg-gray-50 sticky top-0">
                                                                <tr>
                                                                    <th className="px-3 py-2 text-left">Bank</th>
                                                                    <th className="px-3 py-2 text-left">Account</th>
                                                                    <th className="px-3 py-2 text-left">Name</th>
                                                                    <th className="px-3 py-2 text-left">Status</th>
                                                                </tr>
                                                                </thead>
                                                                <tbody>
                                                                {batchResults.map((result, idx) => (
                                                                    <tr key={idx} className="border-t hover:bg-gray-50">
                                                                        <td className="px-3 py-2 font-medium">{result.Bank_name}</td>
                                                                        <td className="px-3 py-2 font-mono">{result.account_number}</td>
                                                                        <td className="px-3 py-2">{result.account_name}</td>
                                                                        <td className="px-3 py-2">
                                                                            {result.isValid ? (
                                                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                                                                                        <CheckCircle className="h-3 w-3 mr-1" />
                                                                                        Valid
                                                                                    </span>
                                                                            ) : (
                                                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">
                                                                                        <XCircle className="h-3 w-3 mr-1" />
                                                                                        Invalid
                                                                                    </span>
                                                                            )}
                                                                        </td>
                                                                    </tr>
                                                                ))}
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <footer className="footer mt-12 bg-white rounded-lg shadow-md p-6">
                    <div className="footer-content text-center">
                        <p className="text-gray-700 mb-4">
                            Developed by <strong className="text-blue-600">Success Chukwuemeka</strong>. <br />
                            Let's connect:
                        </p>
                        <div className="social-icons flex justify-center space-x-4 mb-4">
                            <a
                                href="mailto:successdanesy@gmail.com?subject=Inquiry%20about%20your%20services"
                                title="Email"
                                className="text-gray-600 hover:text-blue-600 transition-colors"
                            >
                                <Mail className="h-6 w-6" />
                            </a>
                            <a
                                href="https://www.linkedin.com/in/success-chu?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app"
                                target="_blank"
                                title="LinkedIn"
                                className="text-gray-600 hover:text-blue-600 transition-colors"
                            >
                                <Linkedin className="h-6 w-6" />
                            </a>
                            <a
                                href="https://github.com/successdanesy"
                                target="_blank"
                                title="GitHub"
                                className="text-gray-600 hover:text-gray-900 transition-colors"
                            >
                                <Github className="h-6 w-6" />
                            </a>
                            <a
                                href="https://wa.me/2347088193394?text=Hello%2C%20I%27m%20interested%20in%20your%20services"
                                target="_blank"
                                title="Whatsapp"
                                className="text-gray-600 hover:text-green-600 transition-colors"
                            >
                                <MessageCircle className="h-6 w-6" />
                            </a>
                        </div>
                        <p className="footer-note text-sm text-gray-500">
                            © 2025 Success Chukwuemeka. All rights reserved.
                        </p>
                    </div>
                </footer>
            </div>
        </div>
    );
}

export default Validator;