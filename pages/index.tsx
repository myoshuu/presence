import React, { useState } from "react";
import axios from "@/services/axiosInstance";
import QRScanner from "../components/QrScan";
import { useRouter } from "next/router";

const Home: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [date, setDate] = useState<string>("");
  const [isFormValid, setIsFormValid] = useState(false);
  const router = useRouter();

  const handleScanClick = () => {
    setIsModalOpen(true); // Open QR scanner modal
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // Close modal when user is done or cancels
    setQrCode(null); // Clear QR code if modal is closed
    setDate(""); // Clear date
    setIsFormValid(false); // Reset form validity
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDate(e.target.value);
    setIsFormValid(qrCode !== null && e.target.value !== "");
  };

  const handleSubmit = async () => {
    try {
      const nis = parseInt(qrCode || "0", 10);
      const res = await axios.post("/auth/login-qr", { nis, date });

      if (res.status === 200) {
        if (res.data.isAbsen) {
          router.push("/dashboard/siswa");
        } else {
          router.push("/dashboard/siswa");
        }
      }
    } catch (e) {
      console.error(e);
    }

    handleCloseModal();
  };

  return (
    <section>
      <div className="flex items-start justify-center flex-col w-full h-[100vh] pl-52">
        <div className="px-5 py-2 mb-5 font-medium text-white bg-red-600 rounded-full">
          Demo Version
        </div>
        <h3 className="text-4xl font-bold">Selamat datang!</h3>
        <p className="mt-5 text-lg">
          Website ini merupakan demo untuk presensi secara online <br />
          menggunakan RFID (sementara menggunakan QR Scanner)
        </p>
        <button
          onClick={handleScanClick}
          className="px-10 py-2 mt-8 bg-black text-white transition-all border-2 border-black rounded-2xl hover:shadow-xl"
        >
          Scan
        </button>

        {isModalOpen && (
          <div
            className="fixed inset-0 flex justify-center items-center bg-gray-600 bg-opacity-50"
            onClick={handleCloseModal}
          >
            <div
              className="bg-white p-6 rounded-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-semibold mb-4">Scan QR Code</h2>
              <QRScanner setQrCode={setQrCode} />{" "}
              <div className="mt-4">
                <label htmlFor="date" className="block text-sm">
                  Date
                </label>
                <input
                  type="date"
                  id="date"
                  className="border-2 rounded p-2 w-full mt-2"
                  value={date}
                  onChange={handleDateChange}
                />
              </div>
              <div className="mt-4 flex justify-between items-center">
                <button
                  onClick={handleSubmit}
                  className="bg-blue-600 text-white p-2 rounded"
                  disabled={!isFormValid}
                >
                  Submit
                </button>
                <button
                  onClick={handleCloseModal}
                  className="bg-gray-400 text-white p-2 rounded"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Home;
