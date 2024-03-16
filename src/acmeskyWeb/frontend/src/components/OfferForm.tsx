
const OfferForm = () => {
  return (
    <div className=" p-6 bg-gray-100 flex items-center justify-center">
      <div className="container max-w-screen-sm mx-auto">
        <div className="bg-white rounded shadow-lg p-4 px-4 md:p-8 mb-6">
          <div className="flex flex-1 flex-col mb-1">
            <label htmlFor="full_name">Codice Offerta</label>
            <input type="text" name="startFly" id="startFly" className="h-10 border mt-1 rounded px-4 w-full bg-gray-50" value="" placeholder="47830" />
          </div>
          <div className="md:col-span-5 text-right mt-2">
            <div className="inline-flex items-end">
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Cerca</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OfferForm
