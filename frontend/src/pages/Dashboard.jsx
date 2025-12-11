import React, { useEffect, useState } from "react";
import { getFlagged, syncFlagged } from "../api/flagged";
import FlaggedTable from "../components/FlaggedTable";

export default function Dashboard() {
  const [data, setData] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  // Loading states
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const result = await getFlagged();
    setData(result);
    setFiltered(result);
    setLoading(false);
  };

  const handleSync = async () => {
    setSyncing(true);
    await syncFlagged();
    await loadData();
    setSyncing(false);
  };

  // SEARCH FILTER
  const handleSearch = (text) => {
    setSearch(text);
    const filteredRows = data.filter((row) =>
      Object.values(row).join(" ").toLowerCase().includes(text.toLowerCase())
    );
    setFiltered(filteredRows);
    setCurrentPage(1);
  };

  // PAGINATION LOGIC
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filtered.slice(indexOfFirstRow, indexOfLastRow);

  const totalPages = Math.ceil(filtered.length / rowsPerPage);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto bg-white p-6 rounded-xl shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-semibold">Flagged Numbers Dashboard</h1>

          <button
            onClick={handleSync}
            disabled={syncing}
            className={`px-5 py-2 rounded text-white font-medium transition ${
              syncing ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {syncing ? "Syncing..." : "Sync Now"}
          </button>
        </div>

        {/* SEARCH BAR */}
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full mb-3 p-2 border rounded-lg"
        />

        {loading ? (
          <p>Loading data...</p>
        ) : (
          <>
            <FlaggedTable data={currentRows} />

            {/* PAGINATION CONTROLS */}
            <div className="flex justify-between items-center mt-4">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Previous
              </button>
              <p>
                Page {currentPage} of {totalPages}
              </p>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
