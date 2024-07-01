import QRCode from 'qrcode';
import jsPDF from 'jspdf';
import { IOffer } from '../App';

export async function generateAndDownloadPDF(offer: IOffer) {
  const doc = new jsPDF();

  // Funzione di utilità per aggiungere testo
  function addText(text: string, x: number, y: number, size: number = 10, font: string = 'helvetica', style: string = 'normal') {
    doc.setFont(font, style);
    doc.setFontSize(size);
    doc.text(text, x, y);
  }

  // Sfondo
  doc.setFillColor(230, 230, 230);
  doc.rect(0, 0, 210, 297, 'F');

  // Bordo del biglietto
  doc.setDrawColor(0);
  doc.setLineWidth(0.5);
  doc.roundedRect(10, 10, 190, 277, 3, 3, 'S');

  // Logo della compagnia aerea (sostituisci con un vero logo se disponibile)
  addText('ACMESky', 15, 25, 24, 'helvetica', 'bold');

  // Intestazione del biglietto
  addText('BOARDING PASS', 105, 20, 18, 'helvetica', 'bold');

  // Genera e aggiungi il QR code sotto "BOARDING PASS"
  const qrCodeData = JSON.stringify({
    offerCode: offer.offer_code,
    outboundFlight: offer.flights[0].flight_code,
    returnFlight: offer.flights[1].flight_code
  });

  try {
    const qrCodeDataUrl = await QRCode.toDataURL(qrCodeData, {
      errorCorrectionLevel: 'M',
      margin: 1,
      width: 80
    });
    doc.addImage(qrCodeDataUrl, 'PNG', 105, 25, 40, 40);
  } catch (error) {
    console.error('Errore nella generazione del QR code:', error);
  }

  // Dettagli del volo di andata
  addText('OUTBOUND FLIGHT', 15, 75, 14, 'helvetica', 'bold');
  addText(`Flight: ${offer.flights[0].flight_code}`, 15, 85);
  addText(`From: ${offer.flights[0].departure_location}`, 15, 95);
  addText(`To: ${offer.flights[0].arrival_location}`, 15, 105);
  addText(`Date: ${offer.flights[0].departure_date}`, 15, 115);
  addText(`Airline: ${offer.flights[0].airline_name}`, 15, 125);

  // Dettagli del volo di ritorno
  addText('RETURN FLIGHT', 15, 145, 14, 'helvetica', 'bold');
  addText(`Flight: ${offer.flights[1].flight_code}`, 15, 155);
  addText(`From: ${offer.flights[1].departure_location}`, 15, 165);
  addText(`To: ${offer.flights[1].arrival_location}`, 15, 175);
  addText(`Date: ${offer.flights[1].departure_date}`, 15, 185);
  addText(`Airline: ${offer.flights[1].airline_name}`, 15, 195);

  // Dettagli dell'offerta
  addText('OFFER DETAILS', 15, 215, 14, 'helvetica', 'bold');
  addText(`Offer Code: ${offer.offer_code}`, 15, 225);
  addText(`Total Amount: €${offer.amount}`, 15, 235);

  // Nota a piè di pagina
  addText(offer.description, 15, 270, 8, 'helvetica', 'italic');

  doc.save('biglietto_aereo.pdf');
}