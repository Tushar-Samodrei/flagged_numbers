import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:9000/flagged";

const columns = [
  "tele_id",
  "prescriberId",
  "FlaggedPhoneNumber",
  "TeleMarkterId",
  "Type",
  "FlaggedPhoneNumberDate",
  "IsDeleted",
  "MeetingDate",
  "isOnCall",
  "company_id",
  "company_name",
  "hcp_id",
  "first_name",
  "last_name",
  "Last",
  "First",
  "email",
  "phone_number",
  "npi",
];

export default function FlaggedTable() {
  const [flagged, setFlagged] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  // Fetch one page
  const fetchPage = async (pg = 1) => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}?page=${pg}`);
      setFlagged(res.data.data);
      setTotalPages(res.data.totalPages);
      setPage(res.data.page);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  // Fetch on load & when page changes
  useEffect(() => {
    fetchPage(page);
  }, [page]);

  // Search: filter across all columns
  const filteredData = flagged.filter((row) =>
    Object.values(row).some((val) =>
      String(val || "")
        .toLowerCase()
        .includes(search.toLowerCase())
    )
  );

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Flagged Numbers Dashboard</h1>

      {/* Search Input */}
      <div className="mb-4 flex items-center gap-3">
        <input
          type="text"
          placeholder="Search all fields..."
          className="border p-2 w-80 rounded"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <span className="text-gray-600">
          Showing {filteredData.length} of 50 rows
        </span>
      </div>

      {/* Table */}
      <div className="overflow-auto border rounded">
        <table className="min-w-max text-sm">
          <thead className="bg-gray-100">
            <tr>
              {columns.map((col) => (
                <th key={col} className="border px-3 py-2 text-left">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="text-center p-4">
                  Loading...
                </td>
              </tr>
            ) : filteredData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="text-center p-4">
                  No matching records.
                </td>
              </tr>
            ) : (
              filteredData.map((row, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  {columns.map((col) => (
                    <td key={col} className="border px-3 py-2">
                      {row[col] ?? ""}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center gap-4 mt-4">
        <button
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          Previous
        </button>

        <span>
          Page <strong>{page}</strong> of {totalPages}
        </span>

        <button
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
        >
          Next
        </button>

        {/* Jump to page */}
        <input
          type="number"
          min="1"
          max={totalPages}
          placeholder="Jump to page"
          className="border p-2 w-28 rounded"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              const num = Number(e.target.value);
              if (num >= 1 && num <= totalPages) setPage(num);
            }
          }}
        />
      </div>
    </div>
  );
}
