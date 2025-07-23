export function ContactFooter() {
  return (
    <div className="mt-10 bg-[#125A3F] text-white p-6 rounded-xl text-sm flex flex-col sm:flex-row justify-between gap-4">
      <div className="flex items-center gap-2">
        📞 For additional information, feel free to contact us
      </div>

      <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
        <div className="flex items-center gap-2">
          <span className="font-semibold">Phone number:</span> 1294
        </div>
        <div className="flex items-center gap-2">
          <span className="font-semibold">Email address:</span> info@nutva.uz
        </div>
      </div>
    </div>
  );
}
