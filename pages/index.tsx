import React from "react";

const Home: React.FC = () => {
  // const [qrCode, setQrCode] = useState<string | null>(null);

  return (
    <section>
      <div className="flex items-start justify-center flex-col w-full h-[100vh] pl-52">
        <div className="px-5 py-2 mb-5 font-medium text-white bg-red-600 rounded-full">
          Demo Version
        </div>
        <h3 className="text-4xl font-bold">Selamat datang!</h3>
        <p className="mt-5 text-lg">
          Website ini merupakan demo untuk presensi secara online <br />{" "}
          menggunakan RFID (sementara menggunakan QR Scanner)
        </p>
        <button className="px-10 py-2 mt-8 bg-black text-white transition-all border-2 border-black rounded-2xl hover:shadow-xl">
          Scan
        </button>
      </div>
    </section>
  );
};

export default Home;
