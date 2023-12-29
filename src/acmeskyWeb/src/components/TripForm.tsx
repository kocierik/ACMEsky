
const TripForm = () => {
  return (
    <div className=" p-6 bg-gray-100 flex items-center justify-center">
      <div className="container max-w-screen-lg mx-auto">
        <div>
          <div className="bg-white rounded shadow-lg p-4 px-4 md:p-8 mb-6">
            <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 lg:grid-cols-3">
              <div className="text-gray-600">
                <p className="font-medium text-lg">Seleziona il volo di tuo interesse</p>
              </div>

              <div className="lg:col-span-2">
                <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 md:grid-cols-5">
                  <div className="md:col-span-5">
                    <label htmlFor="full_name">Volo di partenza</label>
                    <input type="text" name="startFly" id="startFly" className="h-10 border mt-1 rounded px-4 w-full bg-gray-50" value="" placeholder="Milano" />
                  </div>

                  <div className="md:col-span-5">
                    <label htmlFor="email">Volo di arrivo</label>
                    <input type="text" name="endFly" id="endFly" className="h-10 border mt-1 rounded px-4 w-full bg-gray-50" value="" placeholder="Bologna" />
                  </div>

                  <div className="md:col-span-3">
                    <label htmlFor="address">data di partenza</label>
                    <input type="date" name="startAddress" id="startAddres" className="h-10 border mt-1 rounded px-4 w-full bg-gray-50" value="" placeholder="" />
                  </div>

                  <div className="md:col-span-2">
                    <label htmlFor="city">data di arrivo</label>
                    <input type="date" name="endAddress" id="endAddress" className="h-10 border mt-1 rounded px-4 w-full bg-gray-50" value="" placeholder="" />
                  </div>

                  <div className="md:col-span-1">
                    <label htmlFor="zipcode">Limite prezzo</label>
                    <input type="text" name="priceLimit" id="zipcode" className="transition-all flex items-center h-10 border mt-1 rounded px-4 w-full bg-gray-50" placeholder="1000" value="" />
                  </div>

                  <div className="md:col-span-5 text-right">
                    <div className="inline-flex items-end">
                      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Cerca</button>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default TripForm
