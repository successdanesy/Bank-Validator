import { useState } from "react";
import { banks } from "../banks.js";
import { Link } from "react-router-dom";

function Validator() {
    const [activeTab, setActiveTab] = useState("single"); // "single" or "batch"
    const [accountNumber, setAccountNumber] = useState("");
    const [bankValue, setBankValue] = useState(""); // renamed
    const [bankQuery, setBankQuery] = useState(""); // for search
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

    const API_TOKEN = import.meta.env.VITE_API_TOKEN;
    // const API_TOKEN = "A5JZazoWQCKMzwNIwrC1vMhIQXbvs0xcr71fBBys8a0dabc4";

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
                bank_value: bankVal?.trim(), // renamed
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
            ["S/N", "Bank Name", "Account Number", "Account Name"],
            ...batchResults.map((r, idx) => [
                idx + 1,
                r.Bank_name,
                r.account_number,
                r.account_name,
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
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-2xl">
                <h1 className="text-2xl font-bold mb-4 text-center">Bank Validator</h1>

                {/* Tabs */}
                <div className="flex mb-4">
                    <button
                        onClick={() => setActiveTab("single")}
                        className={`flex-1 py-2 rounded-t-lg ${
                            activeTab === "single"
                                ? "bg-blue-500 text-white"
                                : "bg-gray-200 text-gray-700"
                        }`}
                    >
                        Single Validation
                    </button>
                    <button
                        onClick={() => setActiveTab("batch")}
                        className={`flex-1 py-2 rounded-t-lg ${
                            activeTab === "batch"
                                ? "bg-green-500 text-white"
                                : "bg-gray-200 text-gray-700"
                        }`}
                    >
                        Batch Validation
                    </button>
                </div>

                {/* Single Validation */}
                {activeTab === "single" && (
                    <>
                        {/* How to Use - Single Validation */}
                        <details className="mb-4 bg-blue-50 p-3 rounded-lg">
                            <summary className="cursor-pointer font-semibold text-blue-700">
                                How to Use (Single Validation)
                            </summary>
                            <div className="mt-2 text-sm text-gray-700 space-y-2">
                                <p>1. Enter the <b>Account Number</b> in the box.</p>
                                <p>2. Search for the bank by typing its name</p>
                                <p>3. Click <b>Validate</b> to check the account with the chosen bank.</p>
                                <p>4. If you are unsure of the bank, use <b>Smart Validate</b> — the system will try to guess the bank automatically.</p>
                            </div>
                        </details>

                        <input
                            type="text"
                            placeholder="Enter Account Number"
                            value={accountNumber}
                            onChange={(e) => setAccountNumber(e.target.value)}
                            className="w-full border rounded-lg p-2 mb-2 focus:ring focus:ring-blue-300"
                        />
                        <div className="relative mb-2">
                            <input
                                type="text"
                                value={
                                    bankQuery ||
                                    banks.find((b) => b.value === bankValue)?.label ||
                                    ""
                                }
                                onChange={(e) => setBankQuery(e.target.value)}
                                placeholder="Search Bank (Bank Value)"
                                className="w-full border rounded-lg p-2 focus:ring focus:ring-blue-300"
                            />
                            {bankQuery && (
                                <ul className="absolute z-10 mt-1 w-full bg-white border rounded-lg shadow-lg max-h-40 overflow-y-auto">
                                    {filteredBanks.map((bank) => (
                                        <li
                                            key={bank.value}
                                            onClick={() => {
                                                setBankValue(bank.value);
                                                setBankQuery("");
                                            }}
                                            className="px-3 py-2 cursor-pointer hover:bg-blue-100"
                                        >
                                            {bank.label} (Value: {bank.value})
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                        {bankValue && (
                            <p className="text-sm text-gray-500 mb-2">
                                Selected Bank Value: {bankValue}
                            </p>
                        )}

                        <div className="flex gap-2 mb-4">
                            <button
                                onClick={validateAccount}
                                disabled={!accountNumber || !bankValue || loading}
                                className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
                            >
                                {loading ? "Checking..." : "Validate"}
                            </button>
                            <button
                                onClick={smartValidate}
                                disabled={!accountNumber || loading}
                                className="flex-1 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 disabled:bg-gray-400"
                            >
                                {loading ? "Guessing..." : "Smart Validate"}
                            </button>
                        </div>

                        {loading && (
                            <div className="w-full mb-4">
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                                <p className="text-sm text-gray-600 mt-2 text-center">{statusText}</p>
                            </div>
                        )}
                        {error && <p className="mt-4 text-red-500 text-center">{error}</p>}
                        {results.length > 0 && (
                            <div className="mt-4 space-y-3">
                                {results.map((res, idx) => (
                                    <div key={idx} className="p-3 border rounded-lg bg-gray-50 shadow-sm">
                                        <h2 className="font-semibold text-lg">
                                            {res.Bank_name}
                                        </h2>
                                        <p>
                                            <span className="font-medium">Account Number:</span>{" "}
                                            {res.account_number}
                                        </p>
                                        <p>
                                            <span className="font-medium">Name in Bank:</span> {res.account_name}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}

                {/* Batch Validation */}
                {activeTab === "batch" && (
                    <>
                        {/* How to Use - Batch Validation */}
                        <details className="mb-4 bg-green-50 p-3 rounded-lg">
                            <summary className="cursor-pointer font-semibold text-green-700">
                                How to Use (Batch Validation)
                            </summary>
                            <div className="mt-2 text-sm text-gray-700 space-y-2">
                                <p>1. Arrange your data in two columns: <b>Account Number</b> and <b>Bank Value</b>.</p>
                                <p><b>NOTE:</b>Account number's must be 10 digits and Bank Value <br /> numbers must be 6 digits for it to work</p>
                                <p>
                                    2. Check the list of valid Bank Values from{" "}
                                    <Link to="/bankvalues" className="text-green-600 underline">here</Link> to confirm.
                                </p>
                                <p>3. Save your file as <b>CSV</b> (comma-separated values).</p>
                                <p>4. Upload the CSV file and click <b>Validate</b> to process up to 50 accounts at once.</p>
                                <p>Example format:</p>
                                <img
                                    src="/table-sample.png"
                                    alt="Sample Table"
                                    className="rounded-lg shadow-md mt-4"
                                />
                                {/*<img src="../../public/table-sample.png" alt="CSV sample table" className="border rounded-lg mt-2" />*/}
                            </div>
                        </details>

                        <p className="mb-2 text-gray-700">
                            Upload CSV (max 39 rows) with columns:{" "}
                            <b>Bank Name, Bank Value, Account Number, Account Name</b>
                        </p>
                        <input type="file" accept=".csv" onChange={handleBatchUpload} className="mb-4" />

                        {batchLoading && (
                            <div className="w-full mb-4">
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-green-500 h-2 rounded-full transition-all duration-300"
                                        style={{ width: `${batchProgress}%` }}
                                    />
                                </div>
                                <p className="text-sm text-gray-600 mt-2 text-center">{batchStatus}</p>
                            </div>
                        )}
                        {batchError && <p className="text-red-500">{batchError}</p>}

                        {batchResults.length > 0 && (
                            <>
                                <table className="w-full border-collapse">
                                    <thead>
                                    <tr className="bg-gray-200">
                                        <th className="border px-2 py-1">S/N</th>
                                        <th className="border px-2 py-1">Bank Name</th>
                                        {/*<th className="border px-2 py-1">Bank Value</th>*/}
                                        <th className="border px-2 py-1">Account Number</th>
                                        <th className="border px-2 py-1">Account Name</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {batchResults.map((res, idx) => (
                                        <tr
                                            key={idx}
                                            className={`text-center ${res.isValid === false ? "bg-red-100" : ""}`}
                                        >
                                            <td className="border px-2 py-1">{idx + 1}</td>
                                            <td className="border px-2 py-1">{res.Bank_name}</td>
                                            {/*<td className="border px-2 py-1">{res.bank_value}</td>*/}
                                            <td className="border px-2 py-1">{res.account_number}</td>
                                            <td className="border px-2 py-1">{res.account_name}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>

                                <button
                                    onClick={downloadBatchCSV}
                                    className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 mt-2"
                                >
                                    Download CSV
                                </button>
                            </>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

export default Validator;
