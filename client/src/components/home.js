import ExpandableSections from './ExpandableSections';

function Home() {
  return (
    <div className="bg-gray-800 min-h-screen w-screen text-white">
      <div className="ml-14 p-2 w-[900px]">
        <h1 className="font-bold text-xl">CertPass</h1>
        <h3 className="font-bold">About Us</h3>
        <p>
          CertPass Credentialing is a tamper-proof digital ledger for storing your academic
          credentials and achievements. This ledger, fueled by blockchain technology, ensures
          optimal traceability and security in online transactions, eliminating the need for paper
          documentation and physical visits to credentialing authorities.
        </p>
        <div className="mt-4">
          <h3 className="font-bold">Let's Get To Know You</h3>
          <div className="w-[850px] mt-4 bg-custom-gray rounded-lg">
            <div className="w-full py-2 px-4 bg-custom-gradient text-white rounded-t-lg shadow-lg">
              Unlock Personalized Learning and Opportunities
            </div>
            {/* Expandable Sections */}
            <ExpandableSections />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
