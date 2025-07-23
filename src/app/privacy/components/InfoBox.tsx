export function InfoBox() {
  return (
    <div className="bg-white rounded-xl p-6 border-l-4 border-green-500 shadow-md space-y-4">
      <h2 className="text-lg font-semibold text-green-700">✅ Return and Exchange Conditions</h2>

      <p className="bg-[#ECFBF3] border border-[#B7F5D6] p-4 rounded-md text-sm text-gray-800">
        Products can only be returned or exchanged if they are damaged during delivery or found to be defective by the manufacturer.
      </p>

      <div className="grid gap-4 sm:grid-cols-2 text-sm">
        <div className="border border-[#D3F0E1] rounded-md p-3 bg-[#F4FBF7]">
          🕒 <strong>Within 24 Hours:</strong>
          <br />
         The customer must submit photo evidence of the damage or defect within 24 hours of receiving the product.
        </div>

        <div className="border border-[#D3F0E1] rounded-md p-3 bg-[#F4FBF7]">
          📷 <strong>Proof Submission</strong>
          <br />
         Clear photos showing the damage or defect must be provided to validate the claim.
        </div>
      </div>

      <div className="bg-gray-100 text-gray-700 text-sm p-3 rounded-md border border-gray-200">
        <strong>Important note:</strong> Requests made after the specified period will not be considered. Returns or exchanges are only accepted in valid cases.
      </div>
    </div>
  );
}
