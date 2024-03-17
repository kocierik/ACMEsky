import { useState } from 'react'
import './App.css'
import image from "./assets/20231229_19h04m24s_grim.png"
import image2 from "./assets/mark-olsen-K5j1KgecVC8-unsplash.jpg"
import { Link } from 'react-router-dom'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        {/* Section 2 */}
        <section className="px-2 py-32 bg-white md:px-0">
          <div className="container items-center max-w-6xl px-8 mx-auto xl:px-5">
            <div className="flex flex-wrap items-center sm:-mx-3">
              <div className="w-full md:w-1/2 md:px-3">
                <div className="w-full pb-6 space-y-6 sm:max-w-md lg:max-w-lg md:space-y-4 lg:space-y-8 xl:space-y-9 sm:pr-5 lg:pr-0 md:pb-0">
                  <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-4xl lg:text-5xl xl:text-6xl">
                    <span className="block xl:inline">Trova i migliori voli con </span>
                    <span className="block text-gray-600 xl:inline">ACMEsky</span>
                  </h1>
                  <p className="mx-auto text-base text-gray-500 sm:max-w-md lg:text-xl md:max-w-3xl">Ricevi offerte in tempo reale non appena un volo diventa disponibile. </p>
                  <div className="relative flex flex-col sm:flex-row sm:space-x-4">
                    <Link to={localStorage.getItem("token") ? "/findTrip" : "/login"} className="flex items-center w-full px-6 py-3 mb-3 text-lg text-white bg-gray-600 rounded-md sm:mb-0 hover:bg-indigo-700 sm:w-auto">
                      Prova Gratuitamente
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 ml-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><line x1={5} y1={12} x2={19} y2={12} /><polyline points="12 5 19 12 12 19" /></svg>
                    </Link>
                  </div>
                </div>
              </div>
              <div className="w-full md:w-1/2">
                <div className="w-full h-auto overflow-hidden rounded-md shadow-xl sm:rounded-xl">
                  <img src={image} />
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Section 4 */}
        <section className="py-20 bg-gray-50">
          <div className="container items-center max-w-6xl px-4 px-10 mx-auto sm:px-20 md:px-32 lg:px-16">
            <div className="flex flex-wrap items-center -mx-3">
              <div className="order-1 w-full px-3 lg:w-1/2 lg:order-0">
                <div className="w-full lg:max-w-md">
                  <h2 className="mb-4 text-3xl font-bold leading-tight tracking-tight sm:text-4xl font-heading">Inizia a provare i nostri servizi offerti!</h2>
                  <p className="mb-4 font-medium tracking-tight text-gray-400 xl:mb-6">Non è mai stato così facile cercare un viaggio. I nostri servizi ti aiuteranno con quanto segue:</p>
                  <ul>
                    <li className="flex items-center py-2 space-x-4 xl:py-3">
                      <svg className="w-8 h-8 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" /></svg>
                      <span className="font-medium text-gray-500">Ricerca rapida e completa dei voli</span>
                    </li>
                    <li className="flex items-center py-2 space-x-4 xl:py-3">
                      <svg className="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                      <span className="font-medium text-gray-500">Monitoraggio e tracciamento dei voli in tempo reale</span>
                    </li>
                    <li className="flex items-center py-2 space-x-4 xl:py-3">
                      <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                      <span className="font-medium text-gray-500">Acquisto tramite il servizio di banking 100% sicuro</span>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="w-full px-3 mb-12 lg:w-1/2 order-0 lg:order-1 lg:mb-0"><img className="mx-auto sm:max-w-sm lg:max-w-full rounded" src={image2} alt="feature image" /></div>
            </div>
          </div>
        </section>
        {/* Section 5 */}
        <section className="flex items-center justify-center py-20 bg-white min-w-screen">
          <div className="px-16 bg-white">
            <div className="container flex flex-col items-start mx-auto lg:items-center">
              <h2 className="relative flex items-start justify-start w-full max-w-3xl text-5xl font-bold lg:justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="absolute right-0 hidden w-12 h-12 -mt-2 -mr-16 text-gray-200 lg:inline-block" viewBox="0 0 975.036 975.036">
                  <path d="M925.036 57.197h-304c-27.6 0-50 22.4-50 50v304c0 27.601 22.4 50 50 50h145.5c-1.9 79.601-20.4 143.3-55.4 191.2-27.6 37.8-69.399 69.1-125.3 93.8-25.7 11.3-36.8 41.7-24.8 67.101l36 76c11.6 24.399 40.3 35.1 65.1 24.399 66.2-28.6 122.101-64.8 167.7-108.8 55.601-53.7 93.7-114.3 114.3-181.9 20.601-67.6 30.9-159.8 30.9-276.8v-239c0-27.599-22.401-50-50-50zM106.036 913.497c65.4-28.5 121-64.699 166.9-108.6 56.1-53.7 94.4-114.1 115-181.2 20.6-67.1 30.899-159.6 30.899-277.5v-239c0-27.6-22.399-50-50-50h-304c-27.6 0-50 22.4-50 50v304c0 27.601 22.4 50 50 50h145.5c-1.9 79.601-20.4 143.3-55.4 191.2-27.6 37.8-69.4 69.1-125.3 93.8-25.7 11.3-36.8 41.7-24.8 67.101l35.9 75.8c11.601 24.399 40.501 35.2 65.301 24.399z">
                  </path>
                </svg>
                Cosa dicono di noi</h2>
              <div className="block w-full h-0.5 max-w-lg mt-6 bg-purple-100 rounded-full" />
              <div className="items-center justify-center w-full mt-12 mb-4 lg:flex">
                <div className="flex flex-col items-start justify-start w-full h-auto mb-12 lg:w-1/3 lg:mb-0">
                  <div className="flex items-center justify-center">
                    <div className="w-16 h-16 mr-4 overflow-hidden bg-gray-200 rounded-full">
                      <img src="https://images.unsplash.com/photo-1527980965255-d3b416303d12?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1700&q=80" className="object-cover w-full h-full" />
                    </div>
                    <div className="flex flex-col items-start justify-center">
                      <h4 className="font-bold text-gray-800">John Doe</h4>
                      <p className="text-gray-600">CEO of Something</p>
                    </div>
                  </div>
                  <blockquote className="mt-8 text-lg text-gray-500">Questa è una scelta ovvia se vuoi portare la tua attività al livello successivo. Se stai cercando il set di strumenti definitivo, questo è ciò che fa per te!"</blockquote>
                </div>
                <div className="flex flex-col items-start justify-start w-full h-auto px-0 mx-0 mb-12 border-l border-r border-transparent lg:w-1/3 lg:mb-0 lg:px-8 lg:mx-8 lg:border-gray-200">
                  <div className="flex items-center justify-center">
                    <div className="w-16 h-16 mr-4 overflow-hidden bg-gray-200 rounded-full">
                      <img src="https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2547&q=80" className="object-cover w-full h-full" />
                    </div>
                    <div className="flex flex-col items-start justify-center">
                      <h4 className="font-bold text-gray-800">Jane Doe</h4>
                      <p className="text-gray-600">CTO of Business</p>
                    </div>
                  </div>
                  <blockquote className="mt-8 text-lg text-gray-500">"Grazie per aver creato questo servizio. La mia vita è molto più semplice. Grazie per aver realizzato un prodotto così fantastico."</blockquote>
                </div>
                <div className="flex flex-col items-start justify-start w-full h-auto lg:w-1/3">
                  <div className="flex items-center justify-center">
                    <div className="w-16 h-16 mr-4 overflow-hidden bg-gray-200 rounded-full">
                      <img src="https://images.unsplash.com/photo-1545167622-3a6ac756afa4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1256&q=80" className="object-cover w-full h-full" />
                    </div>
                    <div className="flex flex-col items-start justify-center">
                      <h4 className="font-bold text-gray-800">John Smith</h4>
                      <p className="text-gray-600">Creator of Stuff</p>
                    </div>
                  </div>
                  <blockquote className="mt-8 text-lg text-gray-500">"Ricevere questi contenuti è esattamente ciò che volevo. Consiglierei vivamente questo a chiunque."</blockquote>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Section 7 */}
        <section className="bg-white">
          <div className="max-w-screen-xl px-4 py-12 mx-auto space-y-8 overflow-hidden sm:px-6 lg:px-8">
            <div className="flex justify-center mt-8 space-x-6">
              <a href="https://github.com/kocierik/ACMEsky" className="text-gray-400 hover:text-gray-500">
                <span className="sr-only">GitHub</span>
                <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
            <p className="mt-8 text-base leading-6 text-center text-gray-400">
              © 2024 ACMEsky, Inc. Tutti i diritti riservati.
            </p>
          </div>
        </section>
      </div>
    </>
  )
}

export default App
